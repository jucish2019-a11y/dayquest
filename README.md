# DayQuest — Gamified Daily Quest Tracker

> **Turn your daily routine into an RPG quest log.** Complete quests, earn XP, level up, unlock achievements, and build streaks — all in a beautiful dark RPG dashboard.

<div align="center">

[🎮 Play Live Demo](https://jucish2019-a11y.github.io/dayquest/) · [📦 Report a Bug](../../issues/new) · [💡 Request a Feature](../../issues/new)

![Version](https://img.shields.io/badge/version-1.0.0-b44aff)
![License](https://img.shields.io/badge/license-MIT-blue)
![Zero Dependencies](https://img.shields.io/badge/dependencies-0-green)
![Built With](https://img.shields.io/badge/built%20with-AI%20design%20pipeline-6d28d9)

</div>

---

## ✨ Features

### 🗡️ Quest Board
- **4 quest categories**: 💪 Health, 🧠 Mind, 💻 Skills, 💬 Social
- **16 pre-built quests** with difficulty levels (Easy/Medium/Hard)
- **Check to complete** — quests auto-archive to the bottom with a "Completed Today" divider
- **Add custom quests** — name any activity, pick a category and difficulty
- **Edit, deactivate, or remove** any quest via the `⋯` menu

### ⚡ XP & Leveling
- Earn **10/25/50 XP** per quest based on difficulty
- **Level up** with RPG-style titles: Novice → Apprentice → Explorer → Warrior → Champion → Master → Grandmaster → Legend
- **XP multiplier** — adjust to 0.5x, 1x, 1.5x, or 2x in Settings

### 🔥 Streaks & Stats
- **Per-quest streak tracking** — consecutive day completions
- **Weekly activity chart** — see your last 7 days at a glance
- **Category breakdown** — visualize where you spend your effort
- **Milestones** — Perfect Days, Balanced Days, Early Birds, Night Owls

### 🏆 Achievements
- **12 unlockable badges** with fanfare animations
- From "First Step" (complete 1 quest) to "Legendary" (reach level 50)
- Quick 2-second celebration overlay — satisfying without interrupting flow

### 🎨 Customization
- **6 RPG cursor styles**: Magic Star ✦, Sword 🗡️, Potion 🧪, Shield 🛡️, Scroll 📜, or System Default
- **Data export/import** — backup and restore your progress as JSON
- **Full data reset** — start fresh anytime

### 📱 Progressive Web App (PWA)
- **Installable on any device** — home screen icon, fullscreen mode, no browser chrome
- **Works offline** — service worker caches all assets
- **Cross-platform** — iOS Safari, Android Chrome, desktop browsers
- **Instant loading** — cached files, no network needed after first visit

---

## 🎮 Play Now

### Live Demo
**[👉 Click here to play DayQuest instantly](https://jucish2019-a11y.github.io/dayquest/)**

No install, no signup, no dependencies. Opens in any modern browser. All data stays in your browser (localStorage).

### Run Locally
```bash
# Clone the repo
git clone https://github.com/jucish2019-a11y/dayquest.git
cd dayquest

# Open in your browser — no build step needed!
# macOS:
open index.html
# Windows:
start index.html
# Linux:
xdg-open index.html
```

That's it. **Zero dependencies. Zero build tools. Zero configuration.** Just open `index.html` and play.

### 📱 Install on Your Device (PWA)

DayQuest is a **Progressive Web App** — install it like a native app without any app store.

#### Android (Chrome)
1. Open [DayQuest Live Demo](https://jucish2019-a11y.github.io/dayquest/) in Chrome
2. Tap the **⋮ menu** → **"Add to Home screen"** (or tap the install banner when it appears)
3. Confirm the install — DayQuest icon appears on your home screen
4. Open it — fullscreen mode, no browser bar, works offline

#### iOS (Safari)
1. Open [DayQuest Live Demo](https://jucish2019-a11y.github.io/dayquest/) in Safari
2. Tap the **Share button** (box with arrow)
3. Scroll down → tap **"Add to Home Screen"**
4. Name it "DayQuest" → tap **Add**
5. Open from your home screen — fullscreen experience with your custom icon

#### Desktop (Chrome/Edge)
1. Open [DayQuest Live Demo](https://jucish2019-a11y.github.io/dayquest/)
2. Click the **install icon** in the address bar (looks like a monitor with arrow)
3. Click **Install**
4. Opens in its own window — like a native app

> **Note:** The first visit caches all files. After that, DayQuest works **completely offline** — no internet needed.

---

## 🖥️ Screenshots

### Quest Board
Your daily dashboard with a greeting based on time of day, a circular progress ring, stats overview, and quest cards organized by category.

### Stats Dashboard
Weekly activity bar chart, category breakdown bars, and milestone counters.

### Achievements
Collection of unlocked and locked achievement badges with progress tracking.

### Settings
Customize XP multiplier, toggle sound, **choose your cursor style**, export/import data, or reset everything.

---

## 🎯 How to Play

1. **Open the app** — you'll see your quest board with a time-based greeting
2. **Complete quests** — click the circle next to any quest you've done today
3. **Earn XP** — each quest gives 10 (Easy), 25 (Medium), or 50 (Hard) XP
4. **Level up** — fill your XP bar to earn new titles and track progress
5. **Build streaks** — complete the same quest on consecutive days
6. **Unlock achievements** — hit milestones to earn badges
7. **Add custom quests** — click "+ Add Quest" to track any daily activity
8. **Check your stats** — visit the Stats tab for weekly and category analytics
9. **Customize** — change your cursor, adjust XP multiplier, or export your data

---

## 🛠️ Project Structure

```
dayquest/
├── index.html                 # Single-page entry point + PWA meta tags
├── manifest.json              # PWA app manifest (name, icons, display mode)
├── sw.js                      # Service worker (offline caching)
├── icon-192.png               # Home screen icon (192x192)
├── icon-512.png               # Home screen icon (512x512)
├── generate-icons.js          # Script to regenerate icons (Node.js, no deps)
├── icon-generator.html        # Browser-based icon generator (no Node needed)
├── design/
│   ├── design-tokens.css      # Complete design system + mobile responsive (~1,600 lines)
│   ├── design-system-spec.md  # Design specification document
│   └── wireframe-spec.md      # UX wireframe specification
└── src/
    └── app.js                 # All application logic (~1,267 lines)
```

**Total: 5 core files + design docs. Zero dependencies. Zero build step.**

---

## 🤖 Built with an AI Design Pipeline

This entire app was designed by **20 specialized AI agents** before a single line of code was written:

| Phase | Agents Used | What They Produced |
|-------|------------|-------------------|
| **Research** | `ux-research-wireframe` | JTBD statements, 4 user flows, 4 screen wireframes, IA, keyboard nav specs |
| **Design** | `design-system-architect` | Dark RPG color palette, typography, spacing grid, glow effects, elevation system |
| **Motion** | `motion-design` | 15+ animations: XP fills, level-up pop, achievement unlock, quest archive |
| **Assets** | `visual-asset-generator` | Category emoji icons, achievement badge system, cursor SVGs |
| **Spec** | `component-style-spec` | Full DESIGN.md for quest cards, XP bars, badges, stat cards, modals |
| **Copy** | `ux-microcopy-writer` | Quest names, achievement titles, stat labels, toast messages |
| **Review** | `ux-friction-hunter` | Dashboard friction audit, completion flow review, modal interaction check |
| **Access** | `accessibility-specialist` | Keyboard shortcuts, focus management, ARIA labels, reduced motion support |

The design agents produced **143,000+ bytes** of specifications (color tokens, type scales, animation timings, component states) that were then implemented exactly as specified.

---

## 📋 Technical Details

| Aspect | Details |
|--------|---------|
| **Language** | Vanilla JavaScript (ES5-compatible, IIFE pattern) |
| **Styling** | CSS Custom Properties, flexbox, grid, keyframe animations |
| **Fonts** | Inter + Orbitron (loaded from Google Fonts) |
| **Routing** | Inline `onclick` handlers — works with `file://` protocol |
| **State** | Plain JS object with `localStorage` persistence |
| **Storage** | `localStorage` key `dayquest-data` (~2-10KB typical) |
| **Browser Support** | Chrome 60+, Firefox 55+, Safari 12+, Edge 79+ |
| **Performance** | < 80KB total, < 100ms first paint, 60fps animations |
| **PWA** | Installable, offline-capable, service worker cached |
| **Mobile** | Fully responsive, iOS safe area, Android installable |

---

## 💾 Data & Privacy

- **All data stays in your browser** — no servers, no tracking, no accounts
- Stored in `localStorage` under key `dayquest-data`
- Export your data as JSON anytime from Settings
- Import data from a previous export to restore or migrate browsers
- Clear all data with one click in Settings (requires confirmation)

---

## 🗺️ Roadmap

### ✅ Implemented (v1.0)
- Quest board with 4 categories and 16 pre-built quests
- Quest CRUD (add, edit, deactivate, delete)
- XP system with leveling and 8 title tiers
- Streak tracking per quest
- Stats dashboard with weekly chart, category bars, milestones
- 12 achievements with unlock animations
- Custom RPG cursor (6 styles)
- Data export/import/reset
- XP multiplier setting
- Responsive design (desktop + mobile)
- `file://` protocol support (no server needed)
- **PWA support** — installable on any device, works offline
- **Mobile install banner** — prompts users to add to home screen
- **Offline caching** — service worker caches all assets
- **iOS safe area support** — works with notched iPhones
- **Touch-optimized** — tap feedback, no zoom, no pull-to-refresh

### 🔮 Planned (v2.0)
- Cloud sync (Firebase/Supabase) for multi-device support
- Sound effects on quest completion
- Daily/weekly quest presets
- Social sharing of achievements
- Dark/light theme toggle

---

## 📄 License

[MIT License](LICENSE) — use it personally, commercially, or modify it however you want.

---

## 🙏 Acknowledgments

- **Design inspiration**: Linear (clean dark UI), Destiny 2 (quest tracker aesthetic), Habitica (gamified productivity)
- **Built with**: [Qwen Code](https://qwen.ai) and 20 custom AI design agents
- **Agent collection**: [awesome-qwen-agents](https://github.com/jucish2019-a11y/awesome-qwen-agents) — the full agent fleet used to design this app
- **Previous project**: [Nokia Snake](https://github.com/jucish2019-a11y/nokia-snake) — the first AI-designed app

---

<div align="center">

**Made with ⚔️ by DayQuest**

[🎮 Play Now](https://jucish2019-a11y.github.io/dayquest/) · [⭐ Star this repo](../../stargazers)

</div>
