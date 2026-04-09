# DayQuest -- UX Research & Wireframe Specification

> Gamified Daily Quest Tracker with Dark RPG Dashboard
> Version: 1.0 | Date: 2026-04-10 | Complexity: Medium SPA

---

## 1. Jobs-to-be-Done

### Primary JTBD

```
When I start my day (morning routine),
I want to pick a handful of meaningful quests and track my progress visually,
So I can feel a sense of accomplishment, build consistency, and level up my real-life habits.
```

### JTBD Breakdown

| # | Who | What Job | Current Solution | Trigger | "Done" Looks Like |
|---|-----|----------|-----------------|---------|-------------------|
| 1 | Habit-builder who struggles with consistency | Turn abstract self-improvement goals into concrete, trackable daily actions with game-like reward | Paper habit tracker, Notion template, "do nothing" | Morning wakeup, desire for structure | End of day: see all quests checked off, XP gained, streak intact |
| 2 | Gamer who wants to gamify real life | Get the dopamine hit of quest completion and leveling applied to real habits | Habitica (too heavy), spreadsheet | Feeling unmotivated, wanting engagement | See level-up animation, unlock achievement badge |
| 3 | Data-curious self-tracker | See trends in my habits over time -- am I actually improving? | Journaling, mental tracking | End of week/month reflection | Clear chart showing streak growth, XP progression |

### Secondary JTBD

```
When I notice my streak is about to break,
I want a quick way to salvage it or understand the damage,
So I don't feel demotivated and quit entirely.
```

```
When I'm browsing my achievements,
I want to feel proud of how far I've come,
So I stay motivated to keep going tomorrow.
```

---

## 2. Lightweight Competitive Analysis

### Alternatives

| Alternative | Type | Key Strength | Key Weakness |
|-------------|------|--------------|--------------|
| Habitica | Gamified habit app | Deep RPG mechanics, social parties | Overwhelming, slow, mobile-first not desktop |
| Paper habit tracker / bullet journal | Analog | Tactile, zero friction, customizable | No automation, no stats, easily lost |
| Notion habit template | Flexible workspace | Highly customizable, cloud-synced | Setup friction, not gamified, feels like work |
| Do nothing | Status quo | Zero effort | No accountability, no progress visibility |

### Table Stakes (Must Have)
- Daily quest/task listing with check-off
- Visual progress tracking (XP, levels, streaks)
- Category-based quest organization
- Persistent data across sessions

### Competitor Weaknesses (Opportunities)
- Habitica is bloated and social-heavy (users want personal focus)
- Paper/journal has no analytics or automation
- Notion templates require setup and lack game feel
- None are designed as a **desktop-first, dark RPG dashboard** -- most are mobile apps

### Differentiator
- **Desktop-first dark RPG aesthetic**: Designed for the computer screen where users work, with immersive game UI that makes habit tracking feel like opening a quest board in an RPG
- **Local-first, zero setup**: Open the file, start questing -- no account, no loading, no social pressure
- **Cloud-ready architecture**: Built to sync later, but works perfectly offline today

---

## 3. User Flow Mapping

### Flow 1: Morning Setup (First Quest Selection of the Day)

```
[Open app / land on #quest-board] 
  → See "Good Morning" greeting + yesterday's summary (if exists)
  → See category tabs with available quests
  → Click "Add Quest" in a category
  → [Decision?] Pick from suggested quests OR type custom
  → Quest appears on Quest Board with XP value
  → Repeat for other categories (2-4 total quests)
  → [Decision?] Click "Lock In" to finalize today's quests
  → Toast: "Quests Locked! Earn XP by checking them off."
  → [Outcome] Quest Board shows active quests ready for completion
```

- **Entry point**: Hash route `#quest-board` (default landing)
- **Happy path**: 5 steps, 2 decisions
- **Alternate path**: User skips "Lock In" and checks off quests directly (still valid)
- **Exit point**: User sees locked quest board, navigates to work on quests
- **Max steps**: 6 (within 7-step rule)

### Flow 2: Daily Quest Completion

```
[Quest Board with locked quests]
  → See quest cards with checkboxes
  → Click checkbox on completed quest
  → [System] Checkbox animates ✓, card gets "completed" styling
  → [System] XP bar animates upward with numeric counter
  → [System] Toast: "+25 XP! Streak: 5 days"
  → [Decision?] All quests complete?
    → Yes → [System] Show "All Quests Complete!" banner with bonus XP
    → No → User continues completing remaining quests
  → [Outcome] All quests checked, daily summary shown
```

- **Entry point**: Quest Board
- **Happy path**: 4 steps, 1 decision
- **Alternate path**: User completes only some quests, ends day with partial XP
- **Exit point**: End of day view or manual navigation to Stats
- **Max steps**: 5 (within 7-step rule)

### Flow 3: Viewing Stats

```
[Click "Stats" in nav / navigate to #stats]
  → Stats page loads
  → See Level & XP overview (big number, progress bar)
  → See streak calendar heatmap (current + longest streak)
  → See category breakdown (radial or bar chart)
  → See weekly trend line (last 7 days of XP)
  → [Decision?] Scroll for more detail?
    → Yes → See category-level stats and completion rates
  → [Outcome] User understands their progress trajectory
```

- **Entry point**: Navigation link `#stats`
- **Happy path**: 3 steps, 1 decision
- **Alternate path**: User sees no data yet (first day), sees empty state
- **Exit point**: User returns to Quest Board or navigates to Achievements
- **Max steps**: 4 (within 7-step rule)

### Flow 4: Unlocking an Achievement

```
[User completes milestone action] 
  → [System] Detects achievement condition met (e.g., "7-day streak")
  → [System] Achievement modal slides in with glow effect
  → Show achievement icon, title, description, XP bonus
  → [System] Play unlock animation (CSS glow + scale)
  → User clicks "Claim" or auto-dismisses after 5s
  → [System] XP bonus applied, achievement stored
  → [Outcome] Achievement appears in Achievements gallery as unlocked
```

- **Entry point**: Triggered by system event (not user-initiated)
- **Happy path**: 5 steps, 0 decisions
- **Alternate path**: User dismisses modal before claiming, can re-view in Achievements
- **Exit point**: Achievement saved to gallery, user continues current task
- **Max steps**: 5 (within 7-step rule)

---

## 4. Information Architecture & Navigation

### Navigation Pattern: Hub and Spoke with Tabbed Sub-Sections

DayQuest uses a **top-level tab navigation** (Hub and Spoke variant) because each section is a distinct view of the user's quest data. Users switch between views but always return to the Quest Board as the "hub."

### Top-Level Navigation (4 items -- well under Miller's Law limit)

| Order | Label | Hash Route | Icon Concept | Frequency | Description |
|-------|-------|------------|--------------|-----------|-------------|
| 1 | Quest Board | `#quest-board` | Scroll/Shield | Highest | Primary view -- today's quests |
| 2 | Stats | `#stats` | Chart/Graph | High | Progress overview, streaks, trends |
| 3 | Achievements | `#achievements` | Trophy/Medal | Medium | Badge gallery, unlock history |
| 4 | Settings | `#settings` | Gear/Cog | Low | App configuration, data management |

### Content Grouping Rationale

- **Quest Board first**: This is the daily workhorse. Users spend 80% of their time here.
- **Stats second**: Most frequently visited secondary view.
- **Achievements third**: Periodic check-in for motivation.
- **Settings last**: Rarely visited, progressive disclosure principle.

### Hash Routing Structure

```
#quest-board                    → Main quest view
#stats                          → Overview stats
#stats?category=health          → Filtered stats by category (future)
#achievements                   → Achievement gallery
#achievements?filter=locked     → Show locked achievements (future)
#settings                       → Settings page
```

---

## 5. Wireframe Specifications

### Screen 1: Quest Board

#### Purpose
The daily command center where users view, select, and check off today's quests, watch their XP grow, and feel the RPG-style progression in real time.

#### Layout Structure

```
┌──────────────────────────────────────────────────────────┐
│  HEADER: [DayQuest Logo]  [Greeting: "Good Morning"]     │
│                     [Level 7] [██████░░░░ 650/1000 XP]   │
│                     [Streak: 🔥 12 days]                  │
├──────────────────────────────────────────────────────────┤
│  NAV TABS: [⚔ Quest Board] [📊 Stats] [🏆 Achieve] [⚙ Settings]
├──────────────────────────────────────────────────────────┤
│  DATE BAR: "Friday, April 10"  [Lock In Quests] Button   │
├──────────────────────────────────────────────────────────┤
│  CATEGORY TABS (pill filter):                            │
│  [All] [❤ Health] [🧠 Mindfulness] [⚡ Productivity] [🤝 Social]
├──────────────────────────────────────────────────────────┤
│  ┌─────────────────────────┐  ┌─────────────────────────┐│
│  │ QUEST CARD (Health)     │  │ QUEST CARD (Mindfulness)││
│  │ [ ] Morning Run 5km     │  │ [ ] Meditate 10 min     ││
│  │ ⚡ 30 XP  |  🔥 Streak  │  │ ⚡ 20 XP  |  🔥 Streak  ││
│  └─────────────────────────┘  └─────────────────────────┘│
│  ┌─────────────────────────┐  ┌─────────────────────────┐│
│  │ QUEST CARD (Productivity)│ │ QUEST CARD (Social)     ││
│  │ [ ] Write 500 words     │  │ [ ] Call a friend       ││
│  │ ⚡ 25 XP  |  🔥 Streak  │  │ ⚡ 15 XP  |  🔥 Streak  ││
│  └─────────────────────────┘  └─────────────────────────┘│
├──────────────────────────────────────────────────────────┤
│  [Add Quest +]  (floating bottom-right)                   │
├──────────────────────────────────────────────────────────┤
│  FOOTER: "3 of 5 quests completed"  [Reset Day] (subtle) │
└──────────────────────────────────────────────────────────┘
```

#### Components

| # | Component | Type | Content | Action | State |
|---|-----------|------|---------|--------|-------|
| 1 | HeaderBar | Container | Logo text "DayQuest", greeting message | None | Static, always visible |
| 2 | PlayerStatus | Status Bar | Level badge, XP progress bar, streak counter | None | Animated on XP gain |
| 3 | TopNav | Tab Navigation | 4 tab links with icons | Navigate to hash route | Active tab highlighted |
| 4 | DateBar | Banner | Current date (localized), "Lock In" button | Lock quests for the day | Pre-lock / locked state |
| 5 | CategoryFilter | Pill Group | 5 pills: All + 4 categories | Filter visible quests | Active pill highlighted |
| 6 | QuestCard | Card | Quest name, checkbox, XP value, streak count, category color | Check/uncheck quest | Default / completed / locked |
| 7 | AddQuestButton | FAB (Floating Action) | "+" icon | Open quest picker modal | Always visible |
| 8 | CompletionFooter | Status Bar | "X of Y quests completed" text, subtle reset link | Reset day (with confirm) | Hidden when all complete |

### Component Detail: QuestCard

#### Anatomy
- Checkbox (left-aligned, RPG-style square with glow on check)
- Quest title (bold, truncates at 40 chars)
- XP badge (right-aligned, small pill: "+30 XP")
- Streak indicator (flame icon + number, shown if streak > 0)
- Category accent border (left edge: green=Health, blue=Mindfulness, orange=Productivity, pink=Social)

#### States
- **Default**: Unchecked, full opacity, no glow
- **Hover**: Subtle brightness increase, checkbox outline glows in category color
- **Active/Pressed**: Checkbox scales down slightly (press effect)
- **Focus**: 2px neon outline in category color, 4px offset
- **Completed**: Checkbox filled with ✓, card dims to 70% opacity, strikethrough on title, glow pulse fades
- **Loading**: Skeleton card with shimmer animation
- **Error**: Card shows "Quest load failed" with retry button

#### Content Rules
- Max title length: 40 characters (truncates with ellipsis)
- XP values: 10-50 XP range (displayed as "+N XP")
- Streak: Only shown if streak >= 1, hidden otherwise

#### Interaction Rules
- Click checkbox: Toggle completion, trigger XP animation in header
- Click card body: No action (checkbox is the sole interactive element)
- Keyboard: Space/Enter toggles checkbox when focused
- On complete: Header XP bar animates, toast notification appears

---

### Screen 2: Stats

#### Purpose
Show the user's overall progress, streak history, and performance trends so they can see their improvement over time.

#### Layout Structure

```
┌──────────────────────────────────────────────────────────┐
│  HEADER: [DayQuest Logo]  [Greeting]                     │
│                     [Level 7] [██████░░░░ 650/1000 XP]   │
│                     [Streak: 🔥 12 days]                  │
├──────────────────────────────────────────────────────────┤
│  NAV TABS: [⚔ Quest Board] [📊 Stats] [🏆 Achieve] [⚙ Settings]
├──────────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────┐              │
│  │ LEVEL & XP CARD  │  │ STREAK CARD      │              │
│  │ Level 7          │  │ Current: 12 days │              │
│  │ 650 / 1000 XP    │  │ Longest: 21 days │              │
│  │ [██████░░░░]     │  │ [Heatmap mini]   │              │
│  │ Next: Level 8    │  │ [View Calendar]  │              │
│  └──────────────────┘  └──────────────────┘              │
├──────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐│
│  │ WEEKLY XP TREND (Line Chart)                         ││
│  │ Y: XP earned  X: Last 7 days                         ││
│  │ [Mon: 80] [Tue: 100] [Wed: 60] [Thu: 90] ...        ││
│  └──────────────────────────────────────────────────────┘│
├──────────────────────────────────────────────────────────┤
│  ┌──────────────────────────┐ ┌─────────────────────────┐│
│  │ CATEGORY BREAKDOWN       │ │ COMPLETION RATE         ││
│  │ (Radial/Donut Chart)     │ │ (Bar per category)      ││
│  │ Health:     78%          ││ Health:     ████████░░ 78%│
│  │ Mindfulness:65%          ││ Mindfulness:██████░░░░ 65%│
│  │ Productivity:82%         ││ Productivity:████████░░ 82%│
│  │ Social:     45%          ││ Social:     ████░░░░░░ 45%│
│  └──────────────────────────┘ └─────────────────────────┘│
├──────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐│
│  │ MILESTONES (Horizontal Scroll)                       ││
│  │ [First Quest ✓] [7-Day Streak ✓] [1000 XP ✓] ...    ││
│  └──────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────┘
```

#### Components

| # | Component | Type | Content | Action | State |
|---|-----------|------|---------|--------|-------|
| 1 | HeaderBar | Container | Same as Quest Board | None | Always visible |
| 2 | PlayerStatus | Status Bar | Same as Quest Board | None | Always visible |
| 3 | TopNav | Tab Navigation | Same as Quest Board | Navigate | Stats tab active |
| 4 | LevelCard | Info Card | Current level, XP progress bar, next level target | None | Static |
| 5 | StreakCard | Info Card | Current streak, longest streak, mini heatmap, calendar link | Click → expand calendar view | Static |
| 6 | WeeklyTrendChart | Line Chart | 7-day XP trend with data points | Hover → tooltip with exact XP | Loading skeleton |
| 7 | CategoryBreakdownChart | Donut Chart | Percentage completion per category | Hover → category tooltip | Loading skeleton |
| 8 | CompletionRateBars | Horizontal Bar Chart | Per-category completion rate with percentage | None | Loading skeleton |
| 9 | MilestonesStrip | Horizontal Scroll | Unlocked milestone badges in a scrollable row | Click → navigate to achievement detail | Static |

### Component Detail: WeeklyTrendChart

#### Anatomy
- SVG/canvas line chart
- X-axis: 7 day labels (Mon, Tue, Wed...)
- Y-axis: XP values (auto-scaled)
- Data line: Neon-colored stroke with filled gradient below
- Data points: Small circles at each day's value
- Grid lines: Subtle, low-contrast

#### States
- **Default**: Full chart rendered with neon line
- **Hover**: Tooltip appears showing exact XP for hovered day
- **Loading**: Skeleton rectangle with shimmer
- **Error**: "Chart data unavailable" text with retry

#### Content Rules
- Shows exactly last 7 days (including today)
- If today has no data, shows 0
- Y-axis auto-scales to max value + 10% headroom

---

### Screen 3: Achievements

#### Purpose
Display a gallery of all achievements -- unlocked and locked -- so users can see their accomplishments and stay motivated to earn more.

#### Layout Structure

```
┌──────────────────────────────────────────────────────────┐
│  HEADER: [DayQuest Logo]  [Greeting]                     │
│                     [Level 7] [██████░░░░ 650/1000 XP]   │
│                     [Streak: 🔥 12 days]                  │
├──────────────────────────────────────────────────────────┤
│  NAV TABS: [⚔ Quest Board] [📊 Stats] [🏆 Achieve] [⚙ Settings]
├──────────────────────────────────────────────────────────┤
│  SUMMARY BAR: "12 of 30 Achievements Unlocked"           │
│  [████████░░░░░░░░░░░░░░░░░░░ 40%]                       │
├──────────────────────────────────────────────────────────┤
│  FILTER TABS: [All] [Unlocked] [Locked]                   │
├──────────────────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│  │ BADGE    │ │ BADGE    │ │ BADGE    │ │ BADGE    │    │
│  │ [Icon]   │ │ [Icon]   │ │ [Icon]   │ │ [Icon]   │    │
│  │ Title    │ │ Title    │ │ [?]      │ │ [?]      │    │
│  │ Desc     │ │ Desc     │ │ Locked   │ │ Locked   │    │
│  │ ✓ Unlocked││ ✓ Unlocked││ 🔒 3-day  ││ 🔒 30-day │    │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│  │ BADGE    │ │ BADGE    │ │ BADGE    │ │ BADGE    │    │
│  │ [Icon]   │ │ [Icon]   │ │ [Icon]   │ │ [Icon]   │    │
│  │ Title    │ │ Title    │ │ [?]      │ │ [?]      │    │
│  │ Desc     │ │ Desc     │ │ Locked   │ │ Locked   │    │
│  │ ✓        │ │ ✓        │ │ 🔒       │ │ 🔒       │    │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘    │
│  ... (grid continues, 4 per row)                          │
├──────────────────────────────────────────────────────────┤
│  [Load More] (if paginated, or infinite scroll)           │
└──────────────────────────────────────────────────────────┘
```

#### Components

| # | Component | Type | Content | Action | State |
|---|-----------|------|---------|--------|-------|
| 1 | HeaderBar | Container | Same as other screens | None | Always visible |
| 2 | PlayerStatus | Status Bar | Same as other screens | None | Always visible |
| 3 | TopNav | Tab Navigation | Same as other screens | Navigate | Achievements tab active |
| 4 | SummaryBar | Progress Banner | "X of Y Unlocked" text, progress bar | None | Static |
| 5 | FilterTabs | Tab Group | All / Unlocked / Locked | Filter visible badges | Active tab highlighted |
| 6 | AchievementBadge | Card | Icon, title, description, status | Click → detail modal | Unlocked (full color) / Locked (grayscale, fog of war) |
| 7 | LoadMoreButton | Button | "Load More" text or infinite scroll sentinel | Load next batch | Hidden if all loaded |

### Component Detail: AchievementBadge

#### Anatomy
- Badge icon (SVG, centered, 48x48px visual)
- Title (bold, below icon)
- Description (muted text, 1-2 lines)
- Status indicator (checkmark for unlocked, lock icon for locked)
- Glow ring (unlocked only, pulsing neon border)

#### States
- **Default (Unlocked)**: Full color icon, glowing ring, readable text
- **Default (Locked)**: Grayscale icon, fog-of-war overlay, "[?]" placeholder, "Locked" status, dimmed
- **Hover (Unlocked)**: Glow intensifies, slight scale-up
- **Hover (Locked)**: Subtle brightness increase, tooltip shows unlock condition
- **Focus**: 2px neon ring, 4px offset
- **Loading**: Skeleton card with shimmer

#### Content Rules
- Max title length: 24 characters
- Max description length: 60 characters (2 lines, ellipsis)
- Icon: 48x48px, SVG preferred

#### Interaction Rules
- Click unlocked badge: Open detail modal (date earned, XP bonus, related stats)
- Click locked badge: Show unlock condition in tooltip or small popover
- Keyboard: Enter opens detail/tooltip

---

### Screen 4: Settings

#### Purpose
Configure app preferences, manage local data, and prepare for future cloud sync -- the control panel for the DayQuest experience.

#### Layout Structure

```
┌──────────────────────────────────────────────────────────┐
│  HEADER: [DayQuest Logo]  [Greeting]                     │
│                     [Level 7] [██████░░░░ 650/1000 XP]   │
│                     [Streak: 🔥 12 days]                  │
├──────────────────────────────────────────────────────────┤
│  NAV TABS: [⚔ Quest Board] [📊 Stats] [🏆 Achieve] [⚙ Settings]
├──────────────────────────────────────────────────────────┤
│  SETTINGS PANEL (single column, grouped sections):       │
│                                                          │
│  ┌── APPEARANCE ──────────────────────────────────────┐  │
│  │ Theme          [Dark RPG ●  Light ○  Auto ○]       │  │
│  │ Accent Color   [Neon Green ▼] (color picker)        │  │
│  │ Animations     [Toggle ON/OFF]                      │  │
│  │ Sound Effects  [Toggle ON/OFF]                      │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌── QUESTS ──────────────────────────────────────────┐  │
│  │ Default Quests/Day  [5] (number input, 1-10)        │  │
│  │ Auto-reset Time     [12:00 AM ▼] (time picker)      │  │
│  │ Suggested Quests    [Toggle ON/OFF]                 │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌── DATA ────────────────────────────────────────────┐  │
│  │ Export Data     [Download JSON]                     │  │
│  │ Import Data     [Upload JSON]                       │  │
│  │ Reset All Data  [Reset...] (destructive, red button) │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌── ABOUT ───────────────────────────────────────────┐  │
│  │ DayQuest v1.0.0                                     │  │
│  │ "Level up your life, one quest at a time"            │  │
│  │ [GitHub] [Report Bug] [Request Feature]              │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

#### Components

| # | Component | Type | Content | Action | State |
|---|-----------|------|---------|--------|-------|
| 1 | HeaderBar | Container | Same as other screens | None | Always visible |
| 2 | PlayerStatus | Status Bar | Same as other screens | None | Always visible |
| 3 | TopNav | Tab Navigation | Same as other screens | Navigate | Settings tab active |
| 4 | SettingsGroup | Section Container | Group title, divider, settings items | None | Static |
| 5 | ThemeSelector | Radio Group | Dark RPG / Light / Auto options | Change theme | Active option filled |
| 6 | ColorPicker | Dropdown | Accent color options (pre-set palette) | Change accent color | Shows current selection |
| 7 | Toggle | Switch | ON/OFF toggle for animations, sounds, suggestions | Toggle preference | On (neon) / Off (grey) |
| 8 | NumberInput | Input Field | Numeric value with +/- stepper | Change default quest count | 1-10 range, validated |
| 9 | TimePicker | Dropdown | Time options for daily reset | Change reset time | Current time shown |
| 10 | ExportButton | Button | "Download JSON" | Export localStorage to .json file | Enabled |
| 11 | ImportButton | Button | "Upload JSON" | Open file picker, import data | Enabled, with validation |
| 12 | ResetButton | Destructive Button | "Reset..." | Show confirm dialog, wipe all data | Red, requires double-confirm |
| 13 | AboutSection | Text Block | Version, tagline, links | Open external links | Static |

### Component Detail: Toggle (Switch)

#### Anatomy
- Track (rounded rectangle, 44x24px)
- Thumb (circle, slides left/right)
- Label (text to the left of the toggle)
- Status text ("ON" / "OFF" inside or beside)

#### States
- **Default (ON)**: Neon-filled track, thumb on right
- **Default (OFF)**: Grey track, thumb on left
- **Hover**: Track border glows
- **Active/Pressed**: Thumb scales down slightly during drag
- **Focus**: 2px neon ring around entire toggle
- **Disabled**: Greyed out, opacity 50%

#### Interaction Rules
- Click: Toggle state, save to localStorage immediately
- Keyboard: Space toggles when focused
- No confirm dialog needed (reversible action)

---

## 6. Empty State, Loading State, Error State Definitions

### Quest Board

| State | What Shows | Visual Details |
|-------|-----------|----------------|
| **Empty (First Visit)** | "Your Quest Board Awaits" heading, "Add your first quest to begin your journey" text, prominent "+ Add Quest" button, illustration of empty scroll/board | Large centered layout, glowing CTA button, category suggestions below |
| **Empty (No Quests Today)** | "No Quests Locked In" heading, "Pick quests for today or add new ones" text, "Add Quest" + "Browse Suggestions" buttons | Centered, less prominent than first visit |
| **Loading** | Skeleton cards (4 shimmer rectangles), header XP bar shows placeholder "Loading..." | Shimmer animation, 1.5s max duration |
| **Error (localStorage unavailable)** | "Storage Error" heading, "DayQuest needs localStorage to save your progress. Please enable it and reload." text, [Reload] button | Red accent, center-aligned |
| **Error (Data corrupted)** | "Data Error" heading, "Your saved data appears corrupted. You can try to recover or start fresh." text, [Attempt Recovery] [Start Fresh] buttons | Warning orange, center-aligned |

### Stats

| State | What Shows | Visual Details |
|-------|-----------|----------------|
| **Empty (No Data)** | "No Stats Yet" heading, "Complete your first quest to start tracking progress" text, [Go to Quest Board] button, preview of what charts will look like | Centered, dimmed chart outlines as preview |
| **Loading** | Skeleton rectangles for each chart area (LevelCard, StreakCard, TrendChart, CategoryBreakdown, MilestonesStrip) | Shimmer animation, 2s max |
| **Error (Chart render failed)** | Specific chart shows "Could not render chart" text with [Retry] button, other charts unaffected | Inline error within chart container only |

### Achievements

| State | What Shows | Visual Details |
|-------|-----------|----------------|
| **Empty (First Visit)** | "Achievements Locked" heading, "Complete quests, build streaks, and level up to earn badges" text, preview grid of 3 achievement silhouettes with fog-of-war, [Go to Quest Board] button | Dark, mysterious aesthetic -- fog of war effect |
| **Loading** | Skeleton badge grid (8 shimmer circles in 4x2 layout) | Shimmer animation, 1.5s max |
| **Error** | "Could not load achievements" text, [Retry] button | Centered, red accent |

### Settings

| State | What Shows | Visual Details |
|-------|-----------|----------------|
| **Empty** | N/A -- Settings always has default values | No empty state needed |
| **Loading** | N/A -- Settings loads instantly from defaults/localStorage | No loading state needed |
| **Error (Import failed)** | Toast notification: "Import failed: invalid file format", settings page unchanged | Red toast, top-center, 5s dismiss |
| **Error (Reset confirmation)** | Modal dialog: "Are you absolutely sure? This will erase ALL your progress, streaks, levels, and achievements. This cannot be undone." [Cancel] [Yes, Erase Everything] | Red modal, double-confirm required |

---

## 7. Keyboard Navigation Specification

### Global Tab Order (per screen)

The tab order follows the visual reading order: top to bottom, left to right.

```
[Logo/Skip Link] → [Nav Tab 1] → [Nav Tab 2] → [Nav Tab 3] → [Nav Tab 4]
→ [Screen-specific controls in reading order]
→ [Footer actions]
→ (loops back to top)
```

### Quest Board Tab Sequence

```
1. TopNav: Quest Board (skip, already active)
2. TopNav: Stats
3. TopNav: Achievements
4. TopNav: Settings
5. DateBar: Lock In Quests button (if not locked)
6. CategoryFilter: All
7. CategoryFilter: Health
8. CategoryFilter: Mindfulness
9. CategoryFilter: Productivity
10. CategoryFilter: Social
11. QuestCard 1: Checkbox
12. QuestCard 2: Checkbox
13. QuestCard 3: Checkbox
14. QuestCard 4: Checkbox
15. QuestCard N: Checkbox (each quest in order)
16. AddQuestButton (FAB)
17. Footer: Reset Day link
```

### Stats Tab Sequence

```
1. TopNav tabs
2. LevelCard (focusable, shows detail tooltip on Enter)
3. StreakCard (focusable)
4. WeeklyTrendChart (focusable, arrow keys to navigate data points)
5. CategoryBreakdownChart (focusable, arrow keys to navigate categories)
6. CompletionRateBars (focusable)
7. MilestonesStrip (focusable, arrow keys to scroll)
```

### Achievements Tab Sequence

```
1. TopNav tabs
2. FilterTabs: All / Unlocked / Locked
3. Badge 1 (grid row 1, col 1)
4. Badge 2 (grid row 1, col 2)
5. Badge N... (left-to-right, top-to-bottom)
6. LoadMoreButton (if present)
```

### Settings Tab Sequence

```
1. TopNav tabs
2. ThemeSelector: Dark RPG radio
3. ThemeSelector: Light radio
4. ThemeSelector: Auto radio
5. AccentColor dropdown
6. Animations toggle
7. Sound Effects toggle
8. DefaultQuestsPerDay input
9. AutoResetTime dropdown
10. SuggestedQuests toggle
11. ExportButton
12. ImportButton
13. ResetButton
14. About links
```

### Keyboard Shortcuts (Power Users)

| Shortcut | Action | Scope |
|----------|--------|-------|
| `1` | Navigate to Quest Board | Global |
| `2` | Navigate to Stats | Global |
| `3` | Navigate to Achievements | Global |
| `4` | Navigate to Settings | Global |
| `Space` | Toggle focused quest checkbox | Quest Board |
| `Enter` | Activate focused button/link | Global |
| `Escape` | Close modal / dismiss toast | Global |
| `/` | Focus search (if search is added in future) | Global (future) |
| `N` | Open Add Quest modal | Quest Board |
| `L` | Lock in quests for today | Quest Board |
| `?` | Show keyboard shortcuts help modal | Global |

### Focus Management Rules

- **On page load (hash change)**: Focus moves to the first content element of the new view (after nav)
- **After checking a quest**: Focus stays on the checkbox (now checked), XP bar animates in background
- **After opening Add Quest modal**: Focus moves to the first input in the modal, Escape closes and returns focus to the FAB
- **After dismissing a toast**: Focus returns to the element that triggered the toast
- **Trap focus in modals**: Tab cycles within the modal until dismissed
- **Skip link**: Hidden skip link at top of page jumps to main content (accessibility requirement)

### Focus Indicator Style

- 2px solid neon outline (color matches active category/accent)
- 4px offset from element border
- Semi-transparent glow behind the outline
- No outline on `:active` state (only on `:focus` and `:focus-visible`)

---

## 8. Responsive Behavior

### Breakpoints

| Breakpoint | Width | Target Devices |
|------------|-------|----------------|
| Desktop | > 1024px | Desktop monitors, laptops |
| Tablet | 768px - 1024px | iPad, tablets in portrait |
| Mobile | < 768px | Phones, small tablets |

### Desktop (> 1024px)

| Element | Behavior |
|---------|----------|
| **Navigation** | Top tab bar always visible, all 4 tabs shown inline |
| **Header** | Full header with logo, greeting, player status, streak -- all in single row |
| **Quest Board** | Quest cards in 2-column grid (or 3 if screen > 1400px), category filter as horizontal pill row |
| **Stats** | 2-column layout: LevelCard + StreakCard side by side, charts full-width below |
| **Achievements** | 4-column badge grid |
| **Settings** | Single column, max-width 700px, centered |
| **FAB** | Bottom-right, visible |
| **Completion Footer** | Visible at bottom |

### Tablet (768px - 1024px)

| Element | Behavior |
|---------|----------|
| **Navigation** | Top tab bar still visible, tabs may compress (icon-only on smaller end) |
| **Header** | Greeting may truncate, player status wraps to second line if needed |
| **Quest Board** | Quest cards in 2-column grid, category filter scrolls horizontally |
| **Stats** | 2-column layout maintained, charts scale down |
| **Achievements** | 3-column badge grid |
| **Settings** | Single column, max-width 600px |
| **FAB** | Bottom-right, visible |
| **Completion Footer** | Visible |

### Mobile (< 768px)

| Element | Behavior |
|---------|----------|
| **Navigation** | Bottom tab bar (4 icons + labels), fixed to bottom of viewport -- NOT hamburger |
| **Header** | Condensed: logo + level on left, streak on right, XP bar below |
| **Quest Board** | Quest cards in single column, full-width cards, category filter scrolls horizontally with snap points |
| **Stats** | Single column, all cards/stacked vertically, charts scrollable horizontally if needed |
| **Achievements** | 2-column badge grid |
| **Settings** | Single column, full-width |
| **FAB** | Bottom-right, positioned above bottom nav bar |
| **Completion Footer** | Sticky above bottom nav bar |
| **DateBar** | "Lock In" button becomes full-width below date |

### Responsive Layout Diagram (Mobile)

```
┌─────────────────────┐
│ [Logo]  Lv7  🔥 12  │
│ [██████░░ 650/1000] │
├─────────────────────┤
│ Fri, Apr 10         │
│ [Lock In Quests    ]│
├─────────────────────┤
│ [All][Health][Mind] │ ← horizontal scroll
├─────────────────────┤
│ ┌─────────────────┐ │
│ │ [ ] Morning Run │ │
│ │     +30 XP 🔥 5 │ │
│ └─────────────────┘ │
│ ┌─────────────────┐ │
│ │ [ ] Meditate    │ │
│ │     +20 XP 🔥 3 │ │
│ └─────────────────┘ │
│ ┌─────────────────┐ │
│ │ [ ] Write 500w  │ │
│ │     +25 XP      │ │
│ └─────────────────┘ │
│                     │
│       [+] FAB       │
├─────────────────────┤
│ "2 of 3 complete"   │
├─────────────────────┤
│ [🏠] [📊] [🏆] [⚙] │ ← bottom nav
└─────────────────────┘
```

### Touch Targets (Mobile)

- Minimum touch target: 44x44px (Apple HIG / WCAG guideline)
- Quest card checkbox: 48x48px hit area (even if visual checkbox is smaller)
- Tab bar items: 48px height minimum
- FAB: 56x56px

---

## 9. Customer Journey Map

### Journey: New Habit-Builder -- First Week

| Stage | What They're Doing | What They're Thinking | What They're Feeling | Pain Points | Opportunities |
|-------|-------------------|----------------------|---------------------|-------------|---------------|
| Discover | Opens DayQuest for the first time | "What is this? Looks cool. How do I start?" | Curious (3/5), slightly confused (2/5) | No onboarding -- might not know what to do | Lightweight "Add your first quest" hint on empty state |
| Learn | Clicks "Add Quest", picks first quest | "Oh, I pick quests for today. This makes sense." | Getting it (4/5) | Category filter might be unclear | Tooltip on first visit: "Pick 3-5 quests across categories" |
| First Use | Completes first quest, sees XP animation | "Nice! That +30 XP feels good." | Accomplished (4/5) | Might not understand streak yet | Toast explains: "Complete this quest tomorrow to start a streak!" |
| Regular Use (Day 3) | Opens app, sees yesterday's summary, adds quests | "I'm building a streak. Don't want to break it." | Motivated (4/5) | Morning greeting might get stale | Rotate greeting messages or hide after Day 5 |
| Regular Use (Day 7) | Unlocks first streak achievement | "7 days! I'm actually consistent!" | Proud (5/5) | Achievement might go unnoticed if user isn't on app | Achievement should persist as notification until viewed |
| Advanced Use (Day 30) | Checks stats, reviews trends | "My Health quests are strong but Social is weak." | Self-aware (4/5), motivated to improve | Stats might not surface insights clearly | Add "Insight" callout: "Tip: Try adding 1 Social quest to balance" |

### Journey: Returning Gamer -- Returning After Break

| Stage | What They're Doing | What They're Thinking | What They're Feeling | Pain Points | Opportunities |
|-------|-------------------|----------------------|---------------------|-------------|---------------|
| Return (Day 15 gap) | Opens app, sees "Welcome back!" + streak lost | "Aw, I lost my 21-day streak..." | Disappointed (2/5), guilty (3/5) | Losing streak is demotivating | "Streak Freeze" feature: forgive 1 missed day |
| Re-engage | Adds quests for today, completes them | "Let's start a new streak. Fresh start." | Determined (4/5) | No encouragement for restarting | "New streak started! You've got this." message |

---

## 10. Prioritization (Impact vs Effort)

### MVP (Do Now -- Quick Wins)

| Feature | Impact | Effort | Rationale |
|---------|--------|--------|-----------|
| Quest Board with add/check-off | High | Low | Core value proposition |
| XP system with level progression | High | Low | Core gamification loop |
| Streak tracking | High | Low | Retention driver |
| LocalStorage persistence | High | Low | Foundation for everything |
| Category filtering | Medium | Low | Organization, easy to build |
| Stats overview (basic) | Medium | Medium | Progress visibility |
| Achievement system (basic) | Medium | Medium | Motivation, can start with 5-8 achievements |
| Dark RPG theme (default) | Medium | Low | Aesthetic identity |
| Responsive (mobile support) | High | Medium | Users will check quests on phone |

### Phase 2 (Plan Carefully -- Major Projects)

| Feature | Impact | Effort | Rationale |
|---------|--------|--------|-----------|
| Suggested quest library | High | High | Reduces setup friction, needs content creation |
| Streak freeze / forgiveness | Medium | Low | Addresses break-demotivation |
| Achievement detail modals | Low | Low | Nice to have, not critical |
| Export/Import data | Medium | Medium | Data portability, power user feature |
| Custom quest creation | Medium | Low | Already in MVP if Add Quest is flexible |
| Sound effects toggle | Low | Low | Polish, not core |
| Light theme | Low | Medium | Aesthetic preference |

### Phase 3 (Delegate or Batch)

| Feature | Impact | Effort | Rationale |
|---------|--------|--------|-----------|
| Cloud sync architecture | High | High | Future-proofing, not needed for MVP |
| Achievement notifications (push) | Medium | High | Requires service workers, complex |
| Social sharing of achievements | Low | Medium | Vanity feature, low impact |
| Weekly email summary | Low | High | Requires email infrastructure |

### Don't Do (Time Sinks)

| Feature | Rationale |
|---------|-----------|
| Multi-user accounts | Single-player by design, adds massive complexity |
| Leaderboards | Undermines personal growth focus |
| Social features | Out of scope, changes product identity |

---

## 11. Data Architecture (Local-First, Cloud-Ready)

### localStorage Schema

```
dayquest_data: {
  user: {
    level: 7,
    xp: 650,
    xpToNext: 1000,
    totalXpEarned: 4200,
    createdAt: "2026-03-15T08:00:00Z",
    lastActiveDate: "2026-04-09"
  },
  streaks: {
    current: 12,
    longest: 21,
    lastCompletedDate: "2026-04-09",
    perQuest: {
      "quest-id-1": { current: 12, longest: 21 },
      "quest-id-2": { current: 5, longest: 8 }
    }
  },
  quests: {
    catalog: [
      {
        id: "quest-001",
        title: "Morning Run 5km",
        category: "health",
        xpValue: 30,
        isCustom: false,
        createdAt: "2026-03-15T08:00:00Z"
      }
    ],
    today: {
      date: "2026-04-10",
      locked: true,
      lockedAt: "2026-04-10T07:30:00Z",
      items: [
        { questId: "quest-001", completed: true, completedAt: "2026-04-10T08:15:00Z" },
        { questId: "quest-002", completed: false }
      ]
    },
    history: {
      "2026-04-09": { completed: 4, total: 5, xpEarned: 110 },
      "2026-04-08": { completed: 5, total: 5, xpEarned: 130 }
    }
  },
  achievements: {
    unlocked: [
      { id: "ach-first-quest", unlockedAt: "2026-03-15T08:20:00Z" },
      { id: "ach-streak-7", unlockedAt: "2026-03-22T09:00:00Z" }
    ]
  },
  settings: {
    theme: "dark-rpg",
    accentColor: "neon-green",
    animations: true,
    sounds: true,
    defaultQuestsPerDay: 5,
    autoResetTime: "00:00",
    suggestedQuests: true
  }
}
```

### Cloud Sync Readiness

- All data is under a single `dayquest_data` key -- easy to serialize
- Every record has timestamps -- supports conflict resolution (last-write-wins)
- `user.createdAt` and incremental history enable server-side reconciliation
- Future cloud sync: POST entire object to API, receive merged version back

---

## 12. Output Checklist

- [x] User's job-to-be-done is clearly stated (3 primary JTBD + 2 secondary)
- [x] All flows have <= 7 steps and <= 3 decision points (verified: max 6 steps, max 2 decisions)
- [x] Every screen has a defined empty, loading, and error state (all 4 screens documented)
- [x] Navigation structure follows user mental model (Quest Board > Stats > Achievements > Settings)
- [x] Max 7 top-level navigation items (4 items -- well under limit)
- [x] Every screen has ONE clear primary action (Quest Board: check off quests; Stats: view progress; Achievements: browse badges; Settings: configure preferences)
- [x] Responsive behavior is defined for desktop, tablet, mobile (detailed per-element behavior)
- [x] Keyboard navigation path is specified (full tab sequences, shortcuts, focus management)
- [x] Priority is ranked using impact/effort matrix (MVP, Phase 2, Phase 3, Don't Do)
- [x] Wireframes are agent-readable (component tables with states, actions, anatomy, interaction rules)
