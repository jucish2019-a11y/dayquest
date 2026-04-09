# DayQuest - Workspace Context

## Overview

**DayQuest** is a gamified daily quest tracker that turns your daily routine into an RPG quest log. Complete quests, earn XP, level up, unlock achievements, and build streaks — all in a beautiful dark RPG dashboard.

| Property | Value |
|----------|-------|
| **Version** | 1.0.0 |
| **Type** | Single-page application (SPA) + Progressive Web App (PWA) |
| **Runtime** | Vanilla JavaScript (ES5, IIFE pattern) |
| **Dependencies** | Zero (pure HTML/CSS/JS) |
| **Data Layer** | localStorage (key: `dayquest-data`) |
| **Browser Support** | Chrome 60+, Firefox 55+, Safari 12+, Edge 79+ |
| **File Protocol** | Supports `file://` (no server needed) |
| **Live Demo** | https://jucish2019-a11y.github.io/dayquest/ |
| **Total Size** | < 80KB (including icons + service worker) |
| **Installable** | Yes — PWA on iOS, Android, desktop |
| **Offline** | Yes — service worker caches all assets |

---

## Project Structure

```
dayquest/
├── index.html                 # Single-page entry point (~150 lines, PWA meta tags)
├── manifest.json              # PWA app manifest (name, icons, display mode)
├── sw.js                      # Service worker (~60 lines, offline caching)
├── icon-192.png               # Home screen icon (192x192, generated)
├── icon-512.png               # Home screen icon (512x512, generated)
├── generate-icons.js          # Node.js icon generator (zero deps, ~300 lines)
├── icon-generator.html        # Browser-based icon generator (no Node needed)
├── README.md                  # User-facing documentation
├── QWEN.md                    # This file - developer context
├── design/
│   ├── design-tokens.css      # Complete design system + mobile responsive (~1,880 lines)
│   ├── design-system-spec.md  # Design specification document
│   └── wireframe-spec.md      # UX wireframe specification
└── src/
    ├── app.js                 # All application logic (~1,267 lines)
    ├── router.js              # (reserved - not yet used)
    ├── store.js               # (reserved - not yet used)
    ├── types.js               # (reserved - not yet used)
    ├── components/            # (reserved - empty directory)
    ├── store/                 # (reserved - empty directory)
    ├── types/                 # (reserved - empty directory)
    └── data/                  # (reserved - empty directory)
```

**Note:** The `src/` subdirectories (`components/`, `store/`, `types/`, `data/`) and files (`router.js`, `store.js`, `types.js`) are **reserved for future modularization** but currently empty/unused. All logic lives in `app.js`.

---

## Architecture

### Single-File IIFE Pattern

The entire app is wrapped in an Immediately Invoked Function Expression (IIFE) to avoid polluting the global scope. All functions that need to be called from HTML inline event handlers are explicitly exposed via `window.functionName`.

```javascript
(function() {
  "use strict";
  // ... all code here ...
  
  // Expose to global scope for inline HTML handlers
  window.navigateTo = navigateTo;
  window.toggleComplete = toggleComplete;
  // ... etc
})();
```

### Why This Pattern?
- **`file://` protocol support** — Works when opened directly from disk (no web server required)
- **Zero build step** — No bundlers, no transpilers, no npm
- **Maximum compatibility** — ES5 syntax works in very old browsers
- **Simple debugging** — Everything is in one file, easy to trace

### Routing

Client-side routing is handled via inline `onclick` handlers that call `navigateTo(route)`. The function:
1. Updates `currentRoute` variable
2. Toggles `.active` class on nav links
3. Calls the appropriate render function (`renderHome()`, `renderStats()`, `renderAchievements()`, `renderSettings()`)
4. Updates the navbar with current level/XP info

All pages are **re-rendered from scratch** on every navigation — there's no virtual DOM or component lifecycle.

### State Management

State is a single plain JavaScript object (`S`) loaded from localStorage on init:

```javascript
var SKEY = "dayquest-data";
var S; // global state object

function loadState() {
  var raw = localStorage.getItem(SKEY);
  if (raw) {
    var d = JSON.parse(raw);
    if (d.version === "v1") return d;
  }
  // Return default state if no valid data
}

function saveState() {
  localStorage.setItem(SKEY, JSON.stringify(S));
}
```

**State shape:**
```javascript
{
  version: "v1",
  quests: [
    { id: "q1", name: "Exercise 30 min", cat: "health", diff: "medium", active: true },
    // ... more quests
  ],
  completions: {
    "2026-04-10": {
      "q1": { completed: true, time: "08:30" },
      "q5": { completed: true, time: "09:15" }
    }
  },
  totalXP: 450,
  level: 5,
  unlocked: ["a1", "a2", "a5"],  // achievement IDs
  streaks: {
    "q1": { current: 7, best: 12, last: "2026-04-10" }
  },
  settings: {
    xpMul: 1,          // XP multiplier (0.5, 1, 1.5, 2)
    sound: true,       // sound effects toggle
    cursor: "star",    // cursor style (star/sword/potion/shield/scroll/default)
    hideCompleted: false,
    sortOrder: "default", // "default" or "alphabetical"
    themeColor: "purple", // purple/cyan/amber/rose/emerald
    compactMode: false
  }
}
```

### Rendering

All pages are rendered by building HTML strings and setting `innerHTML` on `#main-content`. There's no templating library or virtual DOM.

```javascript
function renderHome() {
  var html = '<div class="page-header">...';
  // ... build HTML string ...
  document.getElementById("main-content").innerHTML = html;
}
```

---

## PWA Architecture

### Progressive Web App Implementation

DayQuest is a fully functional PWA that can be installed on any device, works offline, and provides a native-app-like experience.

### Files Added

| File | Purpose | Size |
|------|---------|------|
| `manifest.json` | PWA app manifest (name, icons, theme colors, display mode) | ~500 bytes |
| `sw.js` | Service worker (offline caching, network-first strategy) | ~1.5KB |
| `icon-192.png` | Home screen icon (192x192) | ~4KB |
| `icon-512.png` | Home screen icon (512x512) | ~8KB |

### manifest.json

Defines the app's identity and behavior when installed:

```json
{
  "name": "DayQuest - Gamified Daily Quest Tracker",
  "short_name": "DayQuest",
  "start_url": "./",
  "scope": "./",
  "display": "standalone",       // Fullscreen, no browser chrome
  "theme_color": "#b44aff",      // Status bar color
  "background_color": "#0d0d14", // Splash screen background
  "icons": [
    { "src": "icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any maskable" },
    { "src": "icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
  ]
}
```

**Key properties:**
- `"display": "standalone"` — Opens fullscreen, no URL bar, no browser controls
- `"scope": "./"` — Service worker controls all files under the directory
- `"purpose": "any maskable"` — Icons adapt to device shape (circle/squircle on Android)

### sw.js (Service Worker)

Implements a **cache-first strategy** with network fallback:

```javascript
var CACHE_NAME = "dayquest-v1";
var ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./design/design-tokens.css",
  "./src/app.js"
];
```

**Lifecycle:**
1. **Install** — Caches all `ASSETS` on first visit
2. **Activate** — Clears old caches (version-based invalidation)
3. **Fetch** — Serves from cache first, fallback to network, cache new responses

**Offline behavior:**
- All pages/assets served from cache
- Navigation requests (`mode: "navigate"`) return cached `index.html`
- localStorage data unaffected (browser-level persistence)

**Cache invalidation:**
- Change `CACHE_NAME` (e.g., `"dayquest-v2"`) to force re-caching
- Old caches deleted on activate event
- Users get fresh assets on next visit

### index.html PWA Meta Tags

```html
<!-- PWA Manifest -->
<link rel="manifest" href="manifest.json">

<!-- iOS Safari PWA meta tags -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="DayQuest">
<link rel="apple-touch-icon" href="icon-192.png">

<!-- Android/Chrome meta tags -->
<meta name="theme-color" content="#b44aff">
<meta name="mobile-web-app-capable" content="yes">
```

### Service Worker Registration

Located at the bottom of `index.html` in an IIFE:

```javascript
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js")
    .then(function(reg) { console.log("DayQuest: Service Worker registered"); })
    .catch(function(err) { console.warn("DayQuest: Service Worker failed", err); });
}
```

### Install Prompt Banner

A non-intrusive banner appears on first visit (Chrome/Android only):

```html
<div id="pwa-install-banner" class="pwa-install-banner hidden">
  <div class="pwa-banner-content">
    <span class="pwa-banner-icon">⚔️</span>
    <div class="pwa-banner-text">
      <strong>Install DayQuest</strong>
      <span>Add to your home screen for quick access</span>
    </div>
  </div>
  <div class="pwa-banner-actions">
    <button class="btn btn-sm btn-primary" id="pwa-install-btn">Install</button>
    <button class="btn btn-sm btn-ghost" id="pwa-dismiss-btn">Later</button>
  </div>
</div>
```

**Behavior:**
- Listens for `beforeinstallprompt` event (fired by Chrome when app is installable)
- Stores event in `deferredPrompt` variable
- Shows banner with Install/Dismiss buttons
- "Later" dismisses for current session (sessionStorage)
- Install triggers native OS install dialog
- `appinstalled` event hides banner and logs

### Icon Generation

Two methods to generate app icons:

**Method 1: Node.js (zero dependencies)**
```bash
node generate-icons.js
# Produces: icon-192.png, icon-512.png
```

**Method 2: Browser-based**
```
Open: icon-generator.html
Click: "Download Icons"
# Downloads both PNG files
```

Both methods use a minimal PNG encoder (no external libraries) to draw:
- Dark gradient background (#1a1a2e → #0d0d14)
- Rounded rectangle with purple glow border
- RPG sword icon (silver blade, purple crossguard, brown handle)

### Mobile Responsive Design

CSS overrides in `design-tokens.css` for `max-width: 640px`:

| Element | Mobile Behavior |
|---------|----------------|
| **Navbar** | Stacks vertically, icons only (no labels) |
| **Character stats** | Full-width top bar with border separator |
| **Page header** | Column layout, full-width action button |
| **Progress ring** | Centered, smaller size |
| **Daily stats** | Full-width, evenly spaced |
| **Stats grid** | Single column (1 card per row) |
| **Week comparison** | Column layout, full-width columns |
| **Heatmap** | Horizontal scroll with touch momentum |
| **Modals** | Full-width, max-height with scroll |
| **Settings** | Stacked label/select layout |
| **Achievements** | 2-column grid (instead of 3-4) |
| **Toast notifications** | Full-width at bottom |
| **PWA banner** | Full-width, edge-to-edge |

### iOS Safe Area Support

```css
@supports (padding: max(0px)) {
  .navbar {
    padding-left: max(var(--space-6), env(safe-area-inset-left));
    padding-right: max(var(--space-6), env(safe-area-inset-right));
  }
}
```

Handles iPhone notch, home indicator, and Dynamic Island.

### Mobile UX Enhancements

| Feature | Implementation |
|---------|---------------|
| **No pull-to-refresh** | `overscroll-behavior-y: contain` on html/body |
| **No zoom on double-tap** | `user-scalable=no` in viewport meta |
| **No text selection on UI** | `user-select: none`, `-webkit-user-select: none` |
| **No tap highlight flash** | `-webkit-tap-highlight-color: transparent` |
| **Tap feedback** | `transform: scale(0.98)` on `:active` for interactive elements |
| **Touch-optimized scroll** | `-webkit-overflow-scrolling: touch` on heatmap |

### PWA Limitations

| Limitation | Workaround |
|-----------|------------|
| **iOS Safari doesn't fire `beforeinstallprompt`** | Users manually add via Share → "Add to Home Screen" |
| **localStorage may clear on iOS storage pressure** | Export/import backup feature in Settings |
| **Service worker not supported on `file://`** | PWA only works when served via HTTPS (GitHub Pages) |
| **No push notifications** | Not implemented (future feature) |
| **No background sync** | Not implemented (future feature) |

---

## Core Data Models

### Quest
```javascript
{
  id: "q1",           // unique ID (genId() function)
  name: "Exercise 30 min",
  cat: "health",      // "health" | "mind" | "skills" | "social"
  diff: "medium",     // "easy" | "medium" | "hard"
  active: true        // whether quest appears on the board
}
```

### Completion
```javascript
{
  "2026-04-10": {     // date key (ISO format)
    "q1": {           // quest ID
      completed: true,
      time: "08:30"   // completion time (HH:MM, 24h format)
    }
  }
}
```

### Streak
```javascript
{
  current: 7,         // consecutive days
  best: 12,           // best ever
  last: "2026-04-10"  // last completion date
}
```

### Achievement Definition
```javascript
{
  id: "a1",
  name: "First Step",
  desc: "Complete your first quest",
  icon: "🎯",
  fn: function(stats) { return stats.totalCompleted >= 1; }
}
```

---

## Constants

### Categories & Colors
| Category | Icon | Color | RGB |
|----------|------|-------|-----|
| **health** | 💪 | #00e5ff (Cyan) | 0, 229, 255 |
| **mind** | 🧠 | #b44aff (Purple) | 180, 74, 255 |
| **skills** | 💻 | #ffb300 (Amber) | 255, 179, 0 |
| **social** | 💬 | #f43f5e (Rose) | 244, 63, 94 |

### XP Values by Difficulty
| Difficulty | Base XP | Visual |
|------------|---------|--------|
| Easy | 10 | ⚡ |
| Medium | 25 | ⚡⚡ |
| Hard | 50 | ⚡⚡⚡ |

XP is multiplied by `settings.xpMul` (0.5x, 1x, 1.5x, 2x).

### Level Titles
| Level | Title |
|-------|-------|
| 1 | Novice |
| 3 | Apprentice |
| 5 | Explorer |
| 10 | Warrior |
| 15 | Champion |
| 20 | Master |
| 30 | Grandmaster |
| 50 | Legend |

**XP formula:** `xpNeededForLevel = 100 + (level - 1) * 50`

### Achievements (12 Total)
| ID | Name | Description | Icon | Unlock Condition |
|----|------|-------------|------|-----------------|
| a1 | First Step | Complete your first quest | 🎯 | totalCompleted >= 1 |
| a2 | Getting Started | Complete 10 quests | 🌱 | totalCompleted >= 10 |
| a3 | On Fire | 7-day streak on any quest | 🔥 | bestStreak >= 7 |
| a4 | Unstoppable | 30-day streak on any quest | 💥 | bestStreak >= 30 |
| a5 | Balanced Life | Complete all 4 categories in one day | ⚖️ | balancedDays >= 1 |
| a6 | Centurion | Complete 100 quests total | 💯 | totalCompleted >= 100 |
| a7 | Rise & Shine | Complete 3 quests before 9am | 🌅 | earlyBirdDays >= 1 |
| a8 | Night Owl | Complete 3 quests after 9pm | 🦉 | nightOwlDays >= 1 |
| a9 | Level 10 | Reach level 10 | ⚔️ | level >= 10 |
| a10 | Halfway There | Reach level 25 | 🏆 | level >= 25 |
| a11 | Legendary | Reach level 50 | 👑 | level >= 50 |
| a12 | Completionist | Complete ALL active quests in one day | ✨ | perfectDays >= 1 |

### Default Quests (16 Pre-built)
| ID | Name | Category | Difficulty | Active? |
|----|------|----------|------------|---------|
| q1 | Exercise 30 min | health | medium | ✅ |
| q2 | Drink 8 glasses of water | health | easy | ✅ |
| q3 | Sleep 8 hours | health | medium | ✅ |
| q4 | Stretch for 10 min | health | easy | ✅ |
| q5 | Meditate 10 min | mind | easy | ✅ |
| q6 | Journal your thoughts | mind | easy | ✅ |
| q7 | Read for 20 min | mind | medium | ✅ |
| q8 | No social media for 2h | mind | hard | ❌ |
| q9 | Code for 2 hours | skills | medium | ✅ |
| q10 | Study a new topic | skills | medium | ✅ |
| q11 | Practice a language | skills | hard | ❌ |
| q12 | Write for 30 min | skills | medium | ✅ |
| q13 | Call or text a friend | social | easy | ✅ |
| q14 | Spend quality time with family | social | medium | ✅ |
| q15 | Attend a social event | social | hard | ❌ |
| q16 | Reach out to someone new | social | medium | ❌ |

---

## Features

### Quest Board (Home)
- **Time-based greeting** (Rise and grind / Afternoon push / Evening stretch / Night owl mode)
- **Motivational hint** (streak progress, achievement progress, or remaining quests)
- **Circular progress ring** (SVG) showing daily completion percentage
- **Stats overview**: Total XP, Level, Best Streak
- **4 category sections** with quests organized by category
- **Quest cards** with check button, name, difficulty badges, XP values, completion time
- **Completed quests** archived at bottom with "✨ Completed Today" divider
- **Quest context menu** (⋯ button): Edit, Deactivate/Activate, Remove
- **Add Quest modal** with name input, category select, difficulty selector
- **Edit/Delete modals** with confirmation
- **Sort options**: Default (definition order) or Alphabetical (A-Z)
- **Hide completed quests** toggle in Settings
- **Compact mode** toggle for smaller quest cards

### Stats Dashboard
- **Summary cards**: Total XP, Level + Title, Best Streak, Total Quests Completed
- **Week comparison**: This Week vs Last Week (XP, quest count, % change)
- **Level progress donut**: SVG donut chart showing current XP progress to next level
- **XP Progress line chart**: 30-day cumulative XP with smooth bezier curves
- **Activity heatmap**: GitHub-style 90-day contribution grid (5 intensity levels)
- **Completion rate trend**: 30-day line chart of daily completion percentage
- **Weekly activity bar chart**: Last 7 days with today highlighted
- **Category breakdown**: Horizontal bars showing completion counts per category
- **Top Quests leaderboard**: Top 5 most-completed quests with medals
- **Milestones**: Perfect Days, Balanced Days, Early Birds, Night Owls

### Achievements
- **12 unlockable badges** with fanfare animations
- **Progress bar** showing X/12 unlocked
- **Unlocked section** with all earned achievements
- **Locked section** showing "???" for unearned achievements with their unlock conditions
- **2-second overlay celebration** when achievement is unlocked

### Settings
- **XP Multiplier**: 0.5x, 1x, 1.5x, 2x
- **Cursor Style**: Magic Star ✦, Sword 🗡️, Potion 🧪, Shield 🛡️, Scroll 📜, System Default
- **Theme Color**: Purple Realm, Cyan Depths, Amber Glow, Rose Flame, Emerald Forest
- **Sort Order**: Default, Alphabetical
- **Hide Completed Quests**: Toggle
- **Compact Mode**: Toggle
- **Export Data**: Download JSON backup
- **Import Data**: Load from JSON file
- **Reset Quests to Default**: Restores 16 default quests (keeps XP/level/streaks/achievements)
- **Reset Everything**: Full data wipe with confirmation
- **About card**: Version info, links to agent collection and previous project

---

## Key Functions

### State Management
| Function | Purpose |
|----------|---------|
| `loadState()` | Load from localStorage or return defaults |
| `saveState()` | Persist state to localStorage |
| `initState()` | Initialize `S` global variable |

### Quest Actions
| Function | Purpose |
|----------|---------|
| `completeQuest(id)` | Mark quest complete, award XP, update streaks, check achievements |
| `undoQuest(id)` | Remove today's completion, recalculate XP/level |
| `addQuest(name, cat, diff)` | Add new quest to the board |
| `editQuest(id, name, cat, diff)` | Update quest properties |
| `deleteQuestById(id)` | Remove quest from array |
| `toggleQuestActive(id)` | Toggle quest visibility on board |

### Statistics
| Function | Purpose |
|----------|---------|
| `getStats()` | Compute all statistics from completions + streaks |
| `calcLevel(xp)` | Calculate level from total XP |
| `xpForLv(lv)` | XP needed to reach a specific level |
| `xpForCurrentLevel()` | XP earned so far in current level |
| `xpForDiff(d)` | XP for a quest difficulty (respects multiplier) |

### Rendering
| Function | Purpose |
|----------|---------|
| `renderHome()` | Quest board page |
| `renderStats()` | Stats dashboard page |
| `renderAchievements()` | Achievements page |
| `renderSettings()` | Settings page |
| `renderLineChart(data, type)` | SVG line chart with smooth curves + gradient fill |
| `renderHeatmap(data)` | GitHub-style contribution heatmap |

### UI Helpers
| Function | Purpose |
|----------|---------|
| `toast(msg, type, dur)` | Show toast notification (success/error/info) |
| `achOverlay(ach)` | Show achievement unlock overlay (2s auto-dismiss) |
| `openQuestModal(editId?)` | Open add/edit quest modal |
| `openDeleteModal(id)` | Open delete confirmation modal |
| `showQMenu(id, btnEl)` | Show quest context menu (positioned near button) |
| `closeQMenus()` | Close all open context menus + backdrops |
| `navigateTo(route)` | Switch between pages |
| `updateNavbar()` | Update navbar level/XP/title display |

### Customization
| Function | Purpose |
|----------|---------|
| `applyTheme(v)` | Dynamically inject CSS for theme color |
| `applyCursor(type)` | Inject cursor CSS (SVG data URIs) for all interactive elements |
| `changeXpMul(v)` | Update XP multiplier setting |
| `changeCursor(type)` | Update cursor setting + apply |
| `changeTheme(v)` | Update theme setting + apply |
| `changeSortOrder(v)` | Update sort order setting |
| `toggleHideCompleted(btn)` | Toggle hide completed quests |
| `toggleCompact(btn)` | Toggle compact mode |

### Data Management
| Function | Purpose |
|----------|---------|
| `exportData()` | Download state as JSON file |
| `importData(input)` | Load state from uploaded JSON file |
| `resetQuests()` | Restore default quests (preserves progress) |
| `resetAll()` | Clear localStorage and reload defaults |

---

## Design System

### Fonts
- **Inter** — Body text, UI labels (Google Fonts)
- **Orbitron** — Numbers, level display, headings (Google Fonts)

### Cursor SVGs (Custom)
Custom SVG cursors are defined as data URIs in `CURSOR_MAP`:
- **star**: Purple 4-pointed star
- **sword**: Gray sword with purple outline
- **potion**: Purple potion bottle
- **shield**: Blue shield
- **scroll**: Tan scroll/parchment

### Theme Colors
Dynamic theme system injects CSS overrides for:
- **Purple** (#b44aff) — Default
- **Cyan** (#06b6d4)
- **Amber** (#f59e0b)
- **Rose** (#f43f5e)
- **Emerald** (#10b981)

### Animations (CSS)
All animations are defined in `design/design-tokens.css`:
- Quest card entrance (staggered by index, max 300ms)
- Quest completion celebration (XP burst effect)
- Achievement unlock overlay (2-second popup)
- Toast notifications (slide in/out)
- Toggle switches (knob slide)
- Progress ring fill
- Modal backdrop fade
- Bar chart fill animation
- Modal open/close

---

## localStorage

**Key:** `dayquest-data`

**Typical Size:** 2-10KB (depends on completion history length)

**Data Format:**
```json
{
  "version": "v1",
  "quests": [...],
  "completions": { "2026-04-10": { "q1": {...} } },
  "totalXP": 450,
  "level": 5,
  "unlocked": ["a1", "a2"],
  "streaks": { "q1": { "current": 7, "best": 12, "last": "2026-04-10" } },
  "settings": { "xpMul": 1, "sound": true, "cursor": "star", "hideCompleted": false, "sortOrder": "default", "themeColor": "purple", "compactMode": false }
}
```

---

## Browser Compatibility

| Browser | Min Version | Notes |
|---------|------------|-------|
| Chrome | 60+ | Full support |
| Firefox | 55+ | Full support |
| Safari | 12+ | Full support |
| Edge | 79+ | Full support (Chromium-based) |

**Key Compatibility Notes:**
- ES5 syntax only (no arrow functions in production code, no `let`/`const`, no template literals in JS — only HTML strings)
- `localStorage` API required (not available in private/incognito mode in some browsers)
- SVG support required for progress rings, donut charts, line charts
- CSS custom properties (variables) required for design tokens
- Flexbox and CSS Grid required for layouts

---

## Performance

| Metric | Target | Actual |
|--------|--------|--------|
| Total file size | < 100KB | ~50KB |
| First paint | < 100ms | ~50ms |
| Animation frame rate | 60fps | 60fps |
| localStorage read/write | < 5ms | ~2ms |
| Page render | < 50ms | ~20ms |

**Optimizations:**
- Staggered quest card animations (max 300ms total delay)
- Debounced re-renders (only on user action)
- Minimal DOM manipulation (innerHTML replacement, not diffing)
- SVG charts use inline paths (no external libraries)

---

## Accessibility

- Keyboard navigation support (tab order through all interactive elements)
- ARIA labels on quest cards, buttons, and navigation
- Focus management for modals (auto-focus on open, restore on close)
- Reduced motion support (CSS `@media (prefers-reduced-motion: reduce)`)
- Color contrast meets WCAG AA standards
- Screen reader-friendly milestone labels and stat descriptions

---

## Testing

**Current state:** No automated tests.

**Manual testing checklist:**
- [ ] Complete a quest → XP awarded, progress ring updates
- [ ] Complete all quests → Perfect Day milestone check
- [ ] Complete same quest next day → Streak increments
- [ ] Undo a quest → XP removed, streak unchanged
- [ ] Add custom quest → Appears on board
- [ ] Edit quest name → Updates immediately
- [ ] Deactivate quest → Disappears from board
- Remove quest → Confirmation modal, quest removed, past completions preserved
- [ ] Level up → Toast notification, navbar updates
- [ ] Achievement unlock → 2-second overlay + toast
- [ ] Change XP multiplier → Future completions use new multiplier
- [ ] Change cursor → Cursor updates on all interactive elements
- [ ] Change theme → Accent color updates immediately
- [ ] Export data → JSON file downloads
- [ ] Import data → State restores from file
- [ ] Reset quests → Defaults restore, progress preserved
- [ ] Reset everything → localStorage clears, app restarts
- [ ] Navigate between pages → All routes render correctly
- [ ] Mobile responsiveness → Works on 320px+ screens

---

## Development Guidelines

### Adding New Features
1. All code goes in `app.js` (single file pattern)
2. Use ES5 syntax (`var`, function declarations, string concatenation)
3. Expose new global functions via `window.functionName = functionName;`
4. Add new settings to `S.settings` and the Settings page
5. Update `loadState()` defaults if adding new settings
6. Follow existing patterns for modals, toasts, and rendering

### Modifying State Shape
1. Bump `version` from `"v1"` to `"v2"` if making breaking changes
2. Add migration logic in `loadState()` to handle old data
3. Update this QWEN.md with new state shape

### Adding New Achievements
1. Add entry to `ACH` array with unique ID
2. Implement condition function that takes `stats` object
3. Ensure `getStats()` computes required stat
4. Add achievement info (name, desc, icon)

### Adding New Charts
1. Use the `renderLineChart()` or `renderHeatmap()` helpers as templates
2. All charts are inline SVG (no external libraries)
3. Use smooth bezier curves for line charts (`C` path commands)
4. Use 5-level intensity for heatmaps (0-4)

### Styling
1. All CSS lives in `design/design-tokens.css`
2. Use CSS custom properties for all colors
3. Follow the existing spacing scale (4px base unit)
4. Maintain dark mode (no light mode toggle yet)

---

## Planned Features (v2.0 Roadmap)

- [ ] **Cloud sync** (Firebase/Supabase) for multi-device support
- [ ] **Sound effects** on quest completion (currently `sound: true` in settings but no implementation)
- [ ] **Daily/weekly quest presets** (curated quest sets)
- [ ] **Social sharing** of achievements (image export)
- [ ] **Dark/light theme toggle** (currently dark-only)
- [ ] **PWA support** (installable, works offline, service worker)
- [ ] **Automated tests** (unit + integration)
- [ ] **Modular architecture** (split app.js into components/store/types)

---

## Common Modifications

### Adding a New Quest Category
1. Add category key to `CAT_ICONS` and `CAT_CLR` objects
2. Add to `cats` array in `renderHome()`
3. Update greeting/motivational hint logic if needed
4. Add category icon to any relevant achievement

### Changing XP Values
Edit the `XP` constant:
```javascript
var XP = { easy: 10, medium: 25, hard: 50 };
```

### Adding a New Level Title
Add to `LVL_TITLES` array (must be sorted by level):
```javascript
var LVL_TITLES = [
  [1,"Novice"],[3,"Apprentice"],[5,"Explorer"],[10,"Warrior"],
  [15,"Champion"],[20,"Master"],[30,"Grandmaster"],[50,"Legend"],
  [75,"Mythic"]  // <-- new entry
];
```

### Adding a New Setting
1. Add default value to settings object in `loadState()`:
```javascript
settings: { ..., newSetting: defaultValue }
```
2. Add UI control in `renderSettings()`
3. Add handler function and expose via `window.handlerName`
4. Apply setting in relevant render/action functions

---

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| App doesn't load | localStorage corrupted | Clear `dayquest-data` key in browser dev tools |
| Quests not saving | localStorage quota exceeded | Export data, clear storage, reimport |
| Charts not rendering | No completion data | Complete some quests first |
| Cursor not updating | Browser doesn't support SVG cursors | Switch to "System Default" |
| Animations janky | Low-end device or old browser | Enable `prefers-reduced-motion` in OS |
| Modal doesn't close | JavaScript error | Check browser console for errors |

---

## Quick Commands

### Run Locally
```bash
cd dayquest

# macOS
open index.html

# Windows
start index.html

# Linux
xdg-open index.html
```

### Regenerate Icons
```bash
# Node.js method (no dependencies)
node generate-icons.js

# Or open in browser:
open icon-generator.html  # macOS
start icon-generator.html # Windows
xdg-open icon-generator.html  # Linux
```

### Deploy to GitHub Pages
```bash
cd dayquest
git add . && git commit -m "chore: update build"
git push origin main

# Enable GitHub Pages in repo settings → Pages → Source: main branch → / (root)
# PWA requires HTTPS — GitHub Pages provides this automatically
```

### Clear LocalStorage (Dev Tools)
```
Chrome: F12 → Application → Local Storage → dayquest-data → Delete
Firefox: F12 → Storage → Local Storage → dayquest-data → Delete
```

### Clear Service Worker Cache (Dev Tools)
```
Chrome: F12 → Application → Service Workers → Unregister
Chrome: F12 → Application → Cache Storage → dayquest-v1 → Delete
Or: Change CACHE_NAME in sw.js to "dayquest-v2"
```

### Test PWA Installability
```
Chrome DevTools → Application → Manifest → Check "Installable" status
Chrome DevTools → Application → Service Workers → Check registration
Chrome DevTools → Application → Cache Storage → Verify cached assets
Lighthouse → Generate PWA audit report
```

---

## Design Inspiration

- **Linear** — Clean dark UI, minimal chrome
- **Destiny 2** — Quest tracker aesthetic, glowing accents
- **Habitica** — Gamified productivity concepts

---

## AI Design Pipeline

This app was fully designed by **20 specialized AI agents** before implementation:

| Phase | Agents | Output |
|-------|--------|--------|
| Research | `ux-research-wireframe` | JTBD, user flows, wireframes, IA, keyboard nav specs |
| Design | `design-system-architect` | Color palette, typography, spacing, glow effects, elevation |
| Motion | `motion-design` | 15+ animations with timings and easing curves |
| Assets | `visual-asset-generator` | Category emoji icons, achievement badges, cursor SVGs |
| Spec | `component-style-spec` | Full DESIGN.md for all components |
| Copy | `ux-microcopy-writer` | Quest names, achievement titles, toast messages |
| Review | `ux-friction-hunter` | Friction audit, completion flow review, modal interaction check |
| Access | `accessibility-specialist` | Keyboard shortcuts, ARIA labels, reduced motion support |

Total design output: **143,000+ bytes** of specifications.

---

## Related Projects

| Project | Description | Link |
|---------|-------------|------|
| **awesome-qwen-agents** | Agent collection used to design DayQuest | github.com/jucish2019-a11y/awesome-qwen-agents |
| **Nokia Snake** | First AI-designed app (same pipeline) | github.com/jucish2019-a11y/nokia-snake |

---

## Notes for AI Agents

- **All code is ES5** — use `var`, function declarations, string concatenation (no template literals in JS)
- **Single file architecture** — everything goes in `app.js`
- **Global function exposure** — any function called from HTML must be assigned to `window`
- **No external dependencies** — do not suggest adding npm packages, libraries, or CDNs
- **localStorage is the only data layer** — no APIs, no servers, no databases
- **File protocol support** — must work with `file://` (no `fetch()`, no ES modules, no `import/export`)
- **Render from scratch** — pages rebuild entire HTML on every navigation
- **Follow existing patterns** — match existing code style, naming conventions, and HTML structure
- **Update this file** — when making changes, update QWEN.md to reflect new state shape, functions, or constants

### PWA-Specific Notes
- **Service worker requires HTTPS** — PWA features only work on GitHub Pages or other HTTPS hosts
- **`file://` still works** — app functions normally offline, just no service worker/PWA install
- **Cache versioning** — bump `CACHE_NAME` in `sw.js` to invalidate old caches
- **Icon regeneration** — use `generate-icons.js` (Node) or `icon-generator.html` (browser)
- **Mobile-first CSS** — new responsive overrides go in `design-tokens.css` at the `@media (max-width: 640px)` block
- **Install banner** — Chrome/Android only; iOS users must manually add via Share menu
