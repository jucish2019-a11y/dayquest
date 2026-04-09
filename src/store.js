// DayQuest - State Management with localStorage persistence
import { DEFAULT_QUESTS, ACHIEVEMENTS, getTodayKey, getWeekKeys, xpForLevel, getLevelTitle, generateId } from './types.js';

const STORAGE_KEY = 'dayquest-data';
const STORAGE_VERSION = 'dayquest-v1';

class DayQuestStore {
  constructor() {
    this.listeners = [];
    this.state = this.load();
    this.subscribe = this.subscribe.bind(this);
    this.setState = this.setState.bind(this);
  }

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (data.version === STORAGE_VERSION) return data;
      }
    } catch (_) {
      // localStorage unavailable or corrupted
    }

    // Default state
    return {
      version: STORAGE_VERSION,
      quests: JSON.parse(JSON.stringify(DEFAULT_QUESTS)),
      completions: {}, // { "2025-04-09": { "q1": { completed: true, time: "08:30" } } }
      totalXP: 0,
      level: 1,
      unlockedAchievements: [],
      streaks: {}, // { "q1": { current: 5, best: 12, lastCompleted: "2025-04-09" } }
      createdAt: getTodayKey(),
      settings: {
        dailyReminder: false,
        soundEnabled: true,
        startOfWeek: 'monday',
        xpMultiplier: 1,
      },
    };
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (_) {
      // silently fail
    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  setState(updater) {
    const newState = typeof updater === 'function' ? updater(this.state) : { ...this.state, ...updater };
    this.state = newState;
    this.save();
    this.listeners.forEach(fn => fn(this.state));
  }

  // ==================== QUEST ACTIONS ====================

  toggleQuest(questId) {
    this.setState(state => ({
      quests: state.quests.map(q =>
        q.id === questId ? { ...q, active: !q.active } : q
      ),
    }));
  }

  addQuest(name, category, difficulty) {
    const maxOrder = this.state.quests.filter(q => q.category === category).length;
    this.setState(state => ({
      quests: [...state.quests, {
        id: generateId(),
        name,
        category,
        difficulty,
        active: true,
        order: maxOrder,
      }],
    }));
  }

  editQuest(questId, updates) {
    this.setState(state => ({
      quests: state.quests.map(q =>
        q.id === questId ? { ...q, ...updates } : q
      ),
    }));
  }

  deleteQuest(questId) {
    this.setState(state => ({
      quests: state.quests.filter(q => q.id !== questId),
    }));
  }

  // ==================== COMPLETION ACTIONS ====================

  completeQuest(questId) {
    const today = getTodayKey();
    const quest = this.state.quests.find(q => q.id === questId);
    if (!quest) return { xp: 0, levelUp: false, newAchievements: [] };

    const todayCompletions = this.state.completions[today] || {};
    if (todayCompletions[questId]) return { xp: 0, levelUp: false, newAchievements: [] }; // already done

    const xp = this.getXpForDifficulty(quest.difficulty);
    const completedAt = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

    // Calculate new level
    const newTotalXP = this.state.totalXP + xp;
    const newLevel = this.calculateLevel(newTotalXP);
    const levelUp = newLevel > this.state.level;

    // Update streaks
    const newStreaks = { ...this.state.streaks };
    const streak = newStreaks[questId] || { current: 0, best: 0, lastCompleted: null };

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = yesterday.toISOString().split('T')[0];

    if (streak.lastCompleted === yesterdayKey) {
      streak.current += 1;
    } else if (streak.lastCompleted !== today) {
      streak.current = 1;
    }
    streak.lastCompleted = today;
    if (streak.current > streak.best) streak.best = streak.current;
    newStreaks[questId] = streak;

    // Check achievements
    const newAchievements = this.checkAchievements(newTotalXP, newLevel, newStreaks, today);

    this.setState(state => ({
      completions: {
        ...state.completions,
        [today]: {
          ...state.completions[today],
          [questId]: { completed: true, time: completedAt },
        },
      },
      totalXP: newTotalXP,
      level: newLevel,
      streaks: newStreaks,
      unlockedAchievements: [...state.unlockedAchievements, ...newAchievements.map(a => a.id)],
    }));

    return { xp, levelUp, newAchievements, newLevel };
  }

  undoQuestCompletion(questId) {
    const today = getTodayKey();
    const todayCompletions = this.state.completions[today] || {};
    if (!todayCompletions[questId]) return;

    const quest = this.state.quests.find(q => q.id === questId);
    const xp = this.getXpForDifficulty(quest.difficulty);

    // Remove completion
    const newCompletions = { ...this.state.completions };
    delete newCompletions[today][questId];
    if (Object.keys(newCompletions[today]).length === 0) delete newCompletions[today];

    // Recalculate level from scratch (safest approach)
    let totalXP = 0;
    for (const day of Object.keys(newCompletions)) {
      for (const qid of Object.keys(newCompletions[day])) {
        const q = this.state.quests.find(qq => qq.id === qid);
        if (q) totalXP += this.getXpForDifficulty(q.difficulty);
      }
    }
    const newLevel = this.calculateLevel(totalXP);

    this.setState(state => ({
      completions: newCompletions,
      totalXP,
      level: newLevel,
    }));
  }

  // ==================== STATS HELPERS ====================

  getStats() {
    const s = this.state;
    const totalCompleted = Object.values(s.completions).reduce(
      (sum, day) => sum + Object.keys(day).length, 0
    );

    const bestStreak = Math.max(0, ...Object.values(s.streaks).map(st => st.best));

    // Category breakdown
    const categoryCounts = { health: 0, mind: 0, skills: 0, social: 0 };
    for (const day of Object.values(s.completions)) {
      for (const qid of Object.keys(day)) {
        const quest = s.quests.find(q => q.id === qid);
        if (quest) categoryCounts[quest.category]++;
      }
    }

    // Balanced days (all 4 categories completed in one day)
    let balancedDays = 0;
    for (const day of Object.values(s.completions)) {
      const cats = new Set();
      for (const qid of Object.keys(day)) {
        const quest = s.quests.find(q => q.id === qid);
        if (quest) cats.add(quest.category);
      }
      if (cats.size >= 4) balancedDays++;
    }

    // Early bird / Night owl
    let earlyBirdDays = 0;
    let nightOwlDays = 0;
    let perfectDays = 0;
    for (const [date, completions] of Object.entries(s.completions)) {
      const activeQuests = s.quests.filter(q => q.active);
      const completedQuestIds = Object.keys(completions);
      const completedQuests = activeQuests.filter(q => completedQuestIds.includes(q.id));

      if (completedQuests.length === activeQuests.length && activeQuests.length > 0) perfectDays++;

      let hasEarly = false, hasNight = false;
      for (const comp of Object.values(completions)) {
        const hour = parseInt(comp.time.split(':')[0], 10);
        if (hour < 9) hasEarly = true;
        if (hour >= 21) hasNight = true;
      }
      if (hasEarly && completedQuestIds.length >= 3) earlyBirdDays++;
      if (hasNight && completedQuestIds.length >= 3) nightOwlDays++;
    }

    // Weekly data for heatmap
    const weekKeys = getWeekKeys();
    const weeklyData = weekKeys.map(key => {
      const day = s.completions[key] || {};
      return {
        date: key,
        completed: Object.keys(day).length,
        total: s.quests.filter(q => q.active).length,
      };
    });

    return {
      totalXP: s.totalXP,
      level: s.level,
      levelTitle: getLevelTitle(s.level),
      xpToNextLevel: xpForLevel(s.level) - (s.totalXP - this.getXpForLevel(s.level)),
      totalCompleted,
      bestStreak,
      balancedDays,
      earlyBirdDays,
      nightOwlDays,
      perfectDays,
      categoryCounts,
      weeklyData,
      achievementCount: s.unlockedAchievements.length,
      totalAchievements: ACHIEVEMENTS.length,
    };
  }

  getDailyCompletion() {
    const today = getTodayKey();
    return this.state.completions[today] || {};
  }

  // ==================== ACHIEVEMENTS ====================

  checkAchievements(totalXP, level, streaks, today) {
    const stats = this.getStats();
    const newlyUnlocked = [];

    for (const achievement of ACHIEVEMENTS) {
      if (!this.state.unlockedAchievements.includes(achievement.id)) {
        if (achievement.condition(stats)) {
          newlyUnlocked.push(achievement);
        }
      }
    }

    return newlyUnlocked;
  }

  getAllAchievements() {
    return ACHIEVEMENTS.map(a => ({
      ...a,
      unlocked: this.state.unlockedAchievements.includes(a.id),
    }));
  }

  // ==================== SETTINGS ====================

  updateSetting(key, value) {
    this.setState(state => ({
      settings: { ...state.settings, [key]: value },
    }));
  }

  // ==================== HELPERS ====================

  getXpForDifficulty(difficulty) {
    const base = { easy: 10, medium: 25, hard: 50 }[difficulty] || 10;
    return Math.round(base * (this.state.settings.xpMultiplier || 1));
  }

  calculateLevel(totalXP) {
    let level = 1;
    let remaining = totalXP;
    while (remaining >= xpForLevel(level)) {
      remaining -= xpForLevel(level);
      level++;
    }
    return level;
  }

  getXpForLevel(level) {
    let total = 0;
    for (let i = 1; i < level; i++) {
      total += xpForLevel(i);
    }
    return total;
  }

  // ==================== RESET ====================

  resetAllData() {
    try {
      localStorage.removeItem('dayquest-data');
    } catch (_) { }
    this.state = this.load();
    this.listeners.forEach(fn => fn(this.state));
  }
}

export const store = new DayQuestStore();
export default store;
