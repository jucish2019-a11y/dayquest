// DayQuest - Type definitions and constants

// ==================== QUEST TYPES ====================

const CATEGORY_ICONS = {
  health: '💪',
  mind: '🧠',
  skills: '💻',
  social: '💬',
};

const CATEGORY_COLORS = {
  health: { bg: 'rgba(6,182,212,0.1)', border: 'rgba(6,182,212,0.3)', text: '#06b6d4', glow: 'rgba(6,182,212,0.4)' },
  mind: { bg: 'rgba(168,85,247,0.1)', border: 'rgba(168,85,247,0.3)', text: '#a855f7', glow: 'rgba(168,85,247,0.4)' },
  skills: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', text: '#f59e0b', glow: 'rgba(245,158,11,0.4)' },
  social: { bg: 'rgba(244,63,94,0.1)', border: 'rgba(244,63,94,0.3)', text: '#f43f5e', glow: 'rgba(244,63,94,0.4)' },
};

const DIFFICULTY_XP = {
  easy: 10,
  medium: 25,
  hard: 50,
};

const LEVEL_TITLES = [
  { level: 1, title: 'Novice' },
  { level: 3, title: 'Apprentice' },
  { level: 5, title: 'Explorer' },
  { level: 10, title: 'Warrior' },
  { level: 15, title: 'Champion' },
  { level: 20, title: 'Master' },
  { level: 30, title: 'Grandmaster' },
  { level: 50, title: 'Legend' },
];

function getLevelTitle(level) {
  let title = 'Novice';
  for (const l of LEVEL_TITLES) {
    if (level >= l.level) title = l.title;
    else break;
  }
  return title;
}

function xpForLevel(level) {
  return 100 + (level - 1) * 50;
}

// ==================== DEFAULT QUESTS ====================

const DEFAULT_QUESTS = [
  // Health & Fitness
  { id: 'q1', name: 'Exercise 30 min', category: 'health', difficulty: 'medium', active: true, order: 0 },
  { id: 'q2', name: 'Drink 8 glasses of water', category: 'health', difficulty: 'easy', active: true, order: 1 },
  { id: 'q3', name: 'Sleep 8 hours', category: 'health', difficulty: 'medium', active: true, order: 2 },
  { id: 'q4', name: 'Stretch for 10 min', category: 'health', difficulty: 'easy', active: true, order: 3 },

  // Mindfulness & Growth
  { id: 'q5', name: 'Meditate 10 min', category: 'mind', difficulty: 'easy', active: true, order: 0 },
  { id: 'q6', name: 'Journal your thoughts', category: 'mind', difficulty: 'easy', active: true, order: 1 },
  { id: 'q7', name: 'Read for 20 min', category: 'mind', difficulty: 'medium', active: true, order: 2 },
  { id: 'q8', name: 'No social media for 2h', category: 'mind', difficulty: 'hard', active: false, order: 3 },

  // Productivity & Skills
  { id: 'q9', name: 'Code for 2 hours', category: 'skills', difficulty: 'medium', active: true, order: 0 },
  { id: 'q10', name: 'Study a new topic', category: 'skills', difficulty: 'medium', active: true, order: 1 },
  { id: 'q11', name: 'Practice a language', category: 'skills', difficulty: 'hard', active: false, order: 2 },
  { id: 'q12', name: 'Write for 30 min', category: 'skills', difficulty: 'medium', active: true, order: 3 },

  // Social & Relationships
  { id: 'q13', name: 'Call or text a friend', category: 'social', difficulty: 'easy', active: true, order: 0 },
  { id: 'q14', name: 'Spend quality time with family', category: 'social', difficulty: 'medium', active: true, order: 1 },
  { id: 'q15', name: 'Attend a social event', category: 'social', difficulty: 'hard', active: false, order: 2 },
  { id: 'q16', name: 'Network or reach out to someone new', category: 'social', difficulty: 'medium', active: false, order: 3 },
];

// ==================== ACHIEVEMENTS ====================

const ACHIEVEMENTS = [
  { id: 'a1', name: 'First Step', description: 'Complete your first quest', icon: '🎯', condition: (stats) => stats.totalCompleted >= 1 },
  { id: 'a2', name: 'Getting Started', description: 'Complete 10 quests', icon: '🌱', condition: (stats) => stats.totalCompleted >= 10 },
  { id: 'a3', name: 'On Fire', description: '7-day streak on any quest', icon: '🔥', condition: (stats) => stats.bestStreak >= 7 },
  { id: 'a4', name: 'Unstoppable', description: '30-day streak on any quest', icon: '💥', condition: (stats) => stats.bestStreak >= 30 },
  { id: 'a5', name: 'Balanced Life', description: 'Complete all 4 categories in one day', icon: '⚖️', condition: (stats) => stats.balancedDays >= 1 },
  { id: 'a6', name: 'Centurion', description: 'Complete 100 quests total', icon: '💯', condition: (stats) => stats.totalCompleted >= 100 },
  { id: 'a7', name: 'Rise & Shine', description: 'Complete 3 quests before 9am', icon: '🌅', condition: (stats) => stats.earlyBirdDays >= 1 },
  { id: 'a8', name: 'Night Owl', description: 'Complete 3 quests after 9pm', icon: '🦉', condition: (stats) => stats.nightOwlDays >= 1 },
  { id: 'a9', name: 'Level 10', description: 'Reach level 10', icon: '⚔️', condition: (stats) => stats.level >= 10 },
  { id: 'a10', name: 'Halfway There', description: 'Reach level 25', icon: '🏆', condition: (stats) => stats.level >= 25 },
  { id: 'a11', name: 'Legendary', description: 'Reach level 50', icon: '👑', condition: (stats) => stats.level >= 50 },
  { id: 'a12', name: 'Completionist', description: 'Complete ALL active quests in a single day', icon: '✨', condition: (stats) => stats.perfectDays >= 1 },
];

// ==================== UTILITY FUNCTIONS ====================

function generateId() {
  return 'q' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
}

function getTodayKey() {
  return new Date().toISOString().split('T')[0]; // "2025-04-09"
}

function getWeekKeys() {
  const keys = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    keys.push(d.toISOString().split('T')[0]);
  }
  return keys;
}

function formatNumber(n) {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return String(n);
}

function getTimeOfDay(hour) {
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}
