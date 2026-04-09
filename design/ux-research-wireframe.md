# DayQuest — UX Research & Wireframe Specification

---

## Phase 1: Problem Definition

### Jobs-to-be-Done

**Who:** A self-motivated individual (student, freelancer, knowledge worker, or anyone building habits) who wants to track daily personal goals. They are comfortable with digital tools, enjoy gamification mechanics, and prefer a visually engaging experience over plain checklists. Skill level: intermediate — they've used habit trackers, todo apps, or fitness apps before.

**What job:** Turn vague intentions ("exercise more," "be more mindful") into concrete daily actions, track completion consistently, and feel a sense of progression and accomplishment over time.

**What are they doing now:** A patchwork of phone reminders, paper notes, generic todo apps (Todoist, Google Tasks), habit-tracking apps (Habitica, Streaks), or nothing at all — relying on memory and willpower.

**What triggers them to look for a solution:** They've let a habit slip for the third time, they feel unmotivated by plain checklists, they want something that makes daily self-improvement feel rewarding and fun rather than like a chore.

**What does "done" look like:** The user opens the app each morning, picks their quests, checks them off throughout the day, sees their XP go up and streaks grow, and feels a genuine dopamine hit from the RPG-style feedback. They return day after day because the experience itself is engaging.

### JTBD Statements

```
When I wake up and think about the habits I want to build,
I want to quickly pick a focused set of daily quests,
So I can have a clear, achievable plan for my day without feeling overwhelmed.

When I complete a task during my day,
I want to check it off and see immediate visual feedback (XP, progress, streaks),
So I feel rewarded and motivated to keep going.

When I look back at my week or month,
I want to see concrete evidence of my progress and consistency,
So I know I'm actually improving and not just going through the motions.

When I hit a milestone or unlock an achievement,
I want to celebrate it in a way that feels meaningful,
So I stay committed to my long-term growth.
```

### Lightweight Competitive Analysis

| Alternatives | What They Do Well | What They Do Badly |
|---|---|---|
| **Habitica** | Full RPG gamification, social accountability | Overwhelming complexity, steep learning curve, pixel art aesthetic feels dated |
| **Streaks (Apple)** | Beautiful minimal design, simple streak tracking | No gamification beyond streaks, Apple-only, no sense of progression |
| **Todoist + karma** | Clean task management, karma points for motivation | Karma is a thin gamification layer, not RPG-themed, daily quest structure is manual |

**Table stakes (must have):** Daily task selection, completion tracking, streak counting, basic XP/leveling, persistent data via localStorage.

**Opportunity (what competitors do badly):** Most are either too complex (Habitica's full RPG system) or too thin on gamification (Streaks). The sweet spot is a focused daily quest experience with rich visual feedback that feels like a game dashboard but is as simple to use as a checklist.

**Differentiator:** A visually immersive dark RPG dashboard that makes tracking daily habits feel like managing a quest board in a game — immediate, visceral, rewarding — without the overhead of character sheets, inventories, or multiplayer systems.

---

## Phase 2: User Flow Mapping

### Flow 1: Morning Setup (First-Time User)

```
[Open app / #/ ] → [See welcome + level 1 badge] → [View empty Quest Board] →
[Click "Choose Today's Quests"] → [Category picker modal] →
[Select 3-5 quests from categories] → [Confirm selection] →
[Quests appear on Quest Board] → [Ready for daily use]
```

- **Entry point:** App URL or bookmark, hash `#/`
- **Happy path:** 6 steps, user lands on Quest Board with quests selected
- **Alternate paths:** User closes picker without selecting → Quest Board shows empty state with CTA to try again
- **Exit point:** Quest Board populated, user continues to Flow 2 throughout the day
- **Decision points:** (1) Which categories to pick from, (2) Which specific quests within each category
- **Steps:** 6 (within limit)

### Flow 2: Daily Quest Completion

```
[Open app / #/ ] → [See Quest Board with today's quests] →
[Click checkbox on completed quest] → [XP animation plays + sound] →
[Quest marked complete, streak updated] → [Progress bar advances] →
[All quests done? → Level-up check → Show daily summary] → [Continue or close app]
```

- **Entry point:** `#/` (Quest Board)
- **Happy path:** 6-8 steps per quest, final summary when all done
- **Alternate paths:** User checks off quests out of order (allowed), user undoes a completion (undo toast, 5s window)
- **Exit point:** All quests complete → daily summary modal → return to Quest Board showing 100% complete
- **Decision points:** (1) Whether to undo a completion (rare)
- **Steps:** 6-8 per quest (within limit)

### Flow 3: Viewing Stats

```
[Open app] → [Click "Stats" in nav / press 2] →
[Stats page loads with overview cards] →
[Scroll to see category breakdown] →
[Toggle time range: Day / Week / Month / All] →
[View XP graph and streak calendar] →
[Return to Quest Board]
```

- **Entry point:** Navigation click or keyboard shortcut `2`
- **Happy path:** 4 steps to full stats view
- **Alternate paths:** User filters to a specific category → sees filtered stats → resets filter
- **Exit point:** User clicks nav back to Quest Board or uses `1` shortcut
- **Decision points:** (1) Which time range to view, (2) Optional: which category to filter
- **Steps:** 4-6 (within limit)

### Flow 4: Unlocking an Achievement

```
[Complete quest or reach milestone] → [System checks achievement criteria] →
[Achievement toast/modal appears with animation] →
[User clicks "View Details" or dismisses] →
[If View Details → Achievement detail view with description + unlock date] →
[Achievement added to Achievements page]
```

- **Entry point:** Triggered automatically by system (quest completion, streak milestone, level-up)
- **Happy path:** 4 steps, achievement displayed and recorded
- **Alternate paths:** User dismisses notification → achievement still recorded, viewable later on Achievements page
- **Exit point:** Achievement recorded, user returns to previous screen
- **Decision points:** (1) Whether to view details or dismiss
- **Steps:** 4 (within limit)

---

## Phase 3: Information Architecture & Navigation

### Navigation Pattern: Hub and Spoke with Top-Level Tab Bar

The app uses a **horizontal tab bar** as primary navigation (Hub and Spoke pattern). Each tab is an independent view. This matches the mental model of "switching between different dashboards" rather than drilling into nested content.

### Top-Level Navigation (4 items — within Miller's Law)

| Order | Label | Route | Icon | Frequency |
|---|---|---|---|---|
| 1 | Quest Board | `#/` | Sword/Shield | Primary — used every session, multiple times/day |
| 2 | Stats | `#/stats` | Chart/Graph | Secondary — used daily or every few days |
| 3 | Achievements | `#/achievements` | Trophy/Badge | Secondary — used when curious about progress |
| 4 | Settings | `#/settings` | Gear | Rare — used for configuration, customization |

### Sub-Navigation (within tabs — progressive disclosure)

- **Quest Board:** No sub-nav. Single screen with category filters.
- **Stats:** Time range toggle (Day / Week / Month / All) — not sub-nav, but a filter control.
- **Achievements:** Filter by category (All / Health / Mindfulness / Productivity / Social) — filter chips, not sub-nav.
- **Settings:** Tabbed sections (Profile, Quests, Appearance, Data) — uses inline tabs since Settings is a utility page.

### Content Grouping Rationale

- Grouped by **user goal** ("What am I doing right now?") not technical structure
- "Quest Board" is first because it is the primary daily action surface
- "Stats" and "Achievements" are separate because they serve different psychological needs (progress tracking vs. celebration)
- "Settings" is last and tucked away because it is rarely accessed

---

## Phase 4: Wireframe Specifications

---

### Wireframe: Quest Board (Home Screen)

#### Purpose
The user sees today's selected quests, tracks completion in real time, and receives XP/streak feedback — the primary action surface used multiple times per day.

#### Layout Structure

```
┌────────────────────────────────────────────────────────┐
│  [LOGO] DayQuest          [LVL 7]  [540 XP]  [🔥 12]  │
├────────────────────────────────────────────────────────┤
│  [Quest Board]  [Stats]  [Achievements]  [Settings]   │
├────────────────────────────────────────────────────────┤
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │  TODAY'S QUESTS                    [3/5 Done]    │  │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 60%              │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│  ┌─ Health & Fitness ────────────────────────────┐    │
│  │ ☑  Do 20 push-ups              [+15 XP]  Done │    │
│  │ ☐  Drink 8 glasses of water    [+10 XP]       │    │
│  │ ☐  30-min walk or run         [+20 XP]       │    │
│  └────────────────────────────────────────────────┘    │
│                                                        │
│  ┌─ Mindfulness & Growth ────────────────────────┐    │
│  │ ☐  Meditate for 10 minutes     [+15 XP]       │    │
│  │ ☐  Write 3 things grateful for [+10 XP]       │    │
│  └────────────────────────────────────────────────┘    │
│                                                        │
│  ┌─ Productivity & Skills ───────────────────────┐    │
│  │ ☐  Read for 20 minutes         [+15 XP]       │    │
│  └────────────────────────────────────────────────┘    │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │  [+ Add Quests]  [View Quest Library]            │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
├────────────────────────────────────────────────────────┤
│  All quests complete! 🎉  [+50 XP Bonus]  [View Summary]│
└────────────────────────────────────────────────────────┘
```

#### Components (top to bottom, left to right)

| # | Component | Type | Content | Action | State |
|---|-----------|------|---------|--------|-------|
| 1 | AppHeader | Header | Logo "DayQuest", Level badge, XP total, Streak counter | Click level badge → Stats page | Always visible; level badge pulses on level-up |
| 2 | TabNav | Navigation | 4 tabs: Quest Board, Stats, Achievements, Settings | Navigate to route | Active tab highlighted with glow |
| 3 | DailyProgress | Progress Bar | "3/5 Done", percentage text, animated fill bar | Click → scrolls to first incomplete quest | Fills as quests complete; hidden when 0 quests |
| 4 | CategoryGroup | Section | Category name, list of quest items | Collapse/expand on header click | Default expanded; remembers collapsed state |
| 5 | QuestItem | Interactive Row | Checkbox, quest title, XP reward, status badge | Toggle checkbox → mark complete/incomplete | Default (unchecked), Checked (with XP animation), Undo toast (5s) |
| 6 | AddQuestsCTA | Button Row | "+ Add Quests" (primary), "View Quest Library" (secondary) | Primary → opens quest picker; Secondary → navigates to library | Primary always visible; secondary hidden if 0 quests selected |
| 7 | CompletionBanner | Banner | Celebration message, bonus XP, "View Summary" link | Click → daily summary modal | Hidden until all quests complete; slides up with animation |

---

### Wireframe: Stats

#### Purpose
The user reviews their progress over time — XP earned, streaks, completion rates, and category breakdowns — to stay motivated and identify patterns.

#### Layout Structure

```
┌────────────────────────────────────────────────────────┐
│  [LOGO] DayQuest          [LVL 7]  [540 XP]  [🔥 12]  │
├────────────────────────────────────────────────────────┤
│  [Quest Board]  [Stats]  [Achievements]  [Settings]   │
├────────────────────────────────────────────────────────┤
│                                                        │
│  [Day] [Week] [Month] [All]    ← Time range toggle    │
│                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   TOTAL XP   │  │ CURRENT STRK │  │ COMPLETION   │ │
│  │    3,240     │  │     12 🔥    │  │    78%       │ │
│  │  +420 this wk │  │  Best: 21   │  │  +5% vs last │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │  XP OVER TIME (line graph)                       │  │
│  │  ╱╲    ╱╲      ╱╲╱                               │  │
│  │ ╱  ╲  ╱  ╲    ╱    ╲                             │  │
│  │╱    ╲╱    ╲  ╱      ╲                            │  │
│  │ Mon Tue Wed Thu Fri Sat Sun                      │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │  BY CATEGORY                                     │  │
│  │  Health & Fitness    ████████████░░░░  72%       │  │
│  │  Mindfulness & Grwt  ██████████░░░░░░  60%       │  │
│  │  Productivity & Skl  █████████████░░░  80%       │  │
│  │  Social & Relations  ████████░░░░░░░░  48%       │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │  STREAK CALENDAR (GitHub-style heatmap)          │  │
│  │  [color-coded grid showing daily completion]     │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
└────────────────────────────────────────────────────────┘
```

#### Components (top to bottom, left to right)

| # | Component | Type | Content | Action | State |
|---|-----------|------|---------|--------|-------|
| 1 | AppHeader | Header | (Same as Quest Board) | — | Always visible |
| 2 | TabNav | Navigation | (Same as Quest Board, Stats active) | — | Always visible |
| 3 | TimeRangeToggle | Toggle Group | Day / Week / Month / All | Switch time range → refreshes all data below | Active range highlighted; persists in localStorage |
| 4 | StatsOverview | Card Grid (3 cards) | Total XP, Current Streak, Completion Rate — each with primary value and secondary context | Click any card → drills down to detailed view | Loading skeleton; "—" if no data for range |
| 5 | XPGraph | Line Chart | XP earned per day over selected range | Hover data point → tooltip with exact value | Loading skeleton; empty state message if no data |
| 6 | CategoryBreakdown | Horizontal Bars | Category name, completion percentage bar, percentage text | Click bar → filter Quest Board to category | Loading bars; "No data" if 0% completion |
| 7 | StreakCalendar | Heatmap Grid | Calendar cells color-coded by completion intensity | Hover cell → tooltip with date and completion count | Loading grid; blank if first day |

---

### Wireframe: Achievements

#### Purpose
The user browses earned and locked achievements, sees progress toward unlocks, and feels motivated by visible milestones.

#### Layout Structure

```
┌────────────────────────────────────────────────────────┐
│  [LOGO] DayQuest          [LVL 7]  [540 XP]  [🔥 12]  │
├────────────────────────────────────────────────────────┤
│  [Quest Board]  [Stats]  [Achievements]  [Settings]   │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Achievements:  12 / 30 Unlocked                       │
│                                                        │
│  [All] [Health] [Mindfulness] [Productivity] [Social] │
│                                                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │  🏆      │  │  🏆      │  │  🔒      │             │
│  │  First   │  │  Streak  │  │  30-Day  │             │
│  │  Quest   │  │  Master  │  │  Warrior │             │
│  │          │  │          │  │          │             │
│  │  Day 1   │  │  7 days  │  │  14/30   │             │
│  └──────────┘  └──────────┘  │  days     │             │
│                              └──────────┘             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │  🏆      │  │  🔒      │  │  🔒      │             │
│  │  Social  │  │  XP      │  │  All     │             │
│  │  Butterfly│  │  Climber │  │  Rounder │             │
│  │          │  │          │  │          │             │
│  │  Day 3   │  │  400/1k  │  │  2/5     │             │
│  └──────────┘  └──────────┘  └──────────┘             │
│                                                        │
│                                                        │
└────────────────────────────────────────────────────────┘
```

#### Components (top to bottom, left to right)

| # | Component | Type | Content | Action | State |
|---|-----------|------|---------|--------|-------|
| 1 | AppHeader | Header | (Same as Quest Board) | — | Always visible |
| 2 | TabNav | Navigation | (Achievements active) | — | Always visible |
| 3 | AchievementCounter | Text | "12 / 30 Unlocked" with progress bar | — | Static; updates when achievement unlocked |
| 4 | CategoryFilter | Filter Chips | All / Health / Mindfulness / Productivity / Social | Click → filter grid to category | Active chip highlighted |
| 5 | AchievementGrid | Card Grid (3-col) | Achievement badge icon, title, unlock status, date or progress | Click unlocked → detail modal; Click locked → tooltip showing requirement | Unlocked (full color + glow), Locked (grayed out + lock icon), New (pulsing border for just-unlocked) |
| 6 | AchievementDetail | Modal/Overlay | Large badge, title, description, unlock date, share button | Close button → back to grid; Share → copies to clipboard | Only appears when clicking an unlocked achievement |

---

### Wireframe: Settings

#### Purpose
The user configures profile, manages quest library, customizes appearance, and handles data import/export.

#### Layout Structure

```
┌────────────────────────────────────────────────────────┐
│  [LOGO] DayQuest          [LVL 7]  [540 XP]  [🔥 12]  │
├────────────────────────────────────────────────────────┤
│  [Quest Board]  [Stats]  [Achievements]  [Settings]   │
├────────────────────────────────────────────────────────┤
│                                                        │
│  [Profile]  [Quest Library]  [Appearance]  [Data]     │
│  ← inline settings tabs                                │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │  PROFILE SETTINGS                                │  │
│  │                                                  │  │
│  │  Display Name    [Adventurer42         ]         │  │
│  │                                                  │  │
│  │  Daily Quest Goal  [ 5 ] quests per day          │  │
│  │                                                  │  │
│  │  Day Starts At     [ 5:00 AM  ▼     ]           │  │
│  │                                                  │  │
│  │  Sound Effects     [ON] toggle                   │  │
│  │                                                  │  │
│  │  Animations        [ON] toggle                   │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│  [Save Changes]  [Reset All Data]                      │
│                                                        │
└────────────────────────────────────────────────────────┘
```

#### Components (top to bottom, left to right)

| # | Component | Type | Content | Action | State |
|---|-----------|------|---------|--------|-------|
| 1 | AppHeader | Header | (Same as Quest Board) | — | Always visible |
| 2 | TabNav | Navigation | (Settings active) | — | Always visible |
| 3 | SettingsTabs | Inline Tabs | Profile / Quest Library / Appearance / Data | Switch tab → changes form content below | Active tab underlined |
| 4 | SettingsForm | Form | Field labels, inputs, toggles, selects | Edit → auto-validates; Save → persists to localStorage | Default; Validation error (red border + message); Saved confirmation (green check) |
| 5 | SaveButton | Button | "Save Changes" | Click → saves all changes, shows confirmation toast | Disabled until changes detected; Loading state during save |
| 6 | DangerZone | Action Row | "Reset All Data" (destructive) | Click → confirmation modal → erase localStorage | Always visible but separated visually; requires double confirmation |

---

## Phase 4b: Component Detail Specifications

### Component: QuestItem

#### Anatomy
- Checkbox (left)
- Quest title text (center-left)
- XP reward badge (center-right, color-coded by XP value)
- Status badge: "Done" or streak icon (right)

#### States
- **Default**: Unchecked checkbox, white title text, XP badge in category color, no status badge
- **Hover**: Row background lightens, checkbox glows faintly, cursor changes to pointer
- **Active/Pressed**: Checkbox animates to checked, XP badge pulses, "+XP" flies up as floating animation
- **Focus**: Visible glow ring around entire row (for keyboard navigation)
- **Disabled**: Grayed out, no interaction — only if quest is locked behind a prerequisite
- **Loading**: Skeleton row — gray placeholder bar with shimmer animation
- **Error**: Red border, "Failed to save" text, retry button appears

#### Content Rules
- Max title length: 60 characters before truncation with ellipsis
- XP reward: Always visible, format "+10 XP", "+15 XP", "+20 XP" (3 tiers)
- Actions: 1 primary action (check/uncheck)

#### Interaction Rules
- Click checkbox: Toggle completion, play XP animation, save to localStorage
- Click row (not checkbox): Toggle completion (larger click target for mobile)
- Keyboard: Space or Enter toggles when focused
- Undo: After check, 5-second toast "Quest completed! [+15 XP] [Undo]" — Undo reverts
- After undo: Focus returns to the quest item

---

### Component: AchievementGrid Card

#### Anatomy
- Badge icon (top, centered)
- Achievement title (below icon)
- Status text: date earned OR progress toward unlock (bottom)
- Visual treatment: Full color + glow (unlocked), grayed + lock icon (locked)

#### States
- **Default (Unlocked)**: Full-color badge, subtle glow border, title in white
- **Default (Locked)**: Grayscale badge, lock icon overlay, title in gray, dimmed background
- **Hover (Unlocked)**: Glow intensifies, card lifts slightly
- **Hover (Locked)**: Tooltip appears showing unlock requirement ("Complete 30 consecutive days")
- **Focus**: Glow ring for keyboard navigation
- **New (Just unlocked)**: Pulsing gold border animation for 3 seconds, then settles to normal unlocked state

#### Content Rules
- Max title length: 24 characters
- Badge icon: 48x48px SVG, category-colored
- Progress text: Format "14/30 days" or "Day 1" for earned achievements

#### Interaction Rules
- Click unlocked: Opens detail modal with full description
- Click locked: Tooltip shows requirement (no modal)
- Keyboard: Enter opens detail for unlocked; Space shows tooltip for locked
- Escape closes detail modal

---

### Component: TabNav (Primary Navigation)

#### Anatomy
- 4 tab buttons with icons and labels
- Active indicator (glowing underline or background highlight)

#### States
- **Default**: Inactive tabs in muted gray
- **Hover**: Tab text brightens, subtle background tint
- **Active**: Tab text in accent color (cyan/neon), glow underline, brighter background
- **Focus**: Visible focus ring around tab button
- **Disabled**: N/A — all tabs always accessible

#### Interaction Rules
- Click: Navigate to hash route, update URL
- Keyboard: Left/Right arrow keys move between tabs, Enter activates
- On route change: Active tab updates, focus moves to page heading

---

### Component: DailyProgress Bar

#### Anatomy
- Progress fill bar (animated)
- Text: "3/5 Done" and "60%"
- Background track

#### States
- **Default**: Empty or partially filled bar in muted gray
- **In progress**: Fill animates smoothly, bar color shifts from red → yellow → green based on percentage
- **Complete**: Full green bar, confetti particles animation, bonus XP banner appears below
- **Loading**: Skeleton shimmer on bar
- **Error**: Red bar with "Sync error — data may be incomplete" text

#### Interaction Rules
- Click: Scrolls viewport to first incomplete quest
- Keyboard: Not directly interactive; skip in tab order

---

## Phase 4c: State Definitions Per Screen

### Quest Board

| State | What Shows | Trigger |
|---|---|---|
| **Empty (no quests selected)** | Centered illustration of empty quest board, text "Your quest board is empty", large CTA "[Choose Today's Quests]" | First visit, or user removed all quests |
| **Loading** | Skeleton rows matching the shape of quest items (category headers as gray bars, quest items as thin gray lines with shimmer) | Initial localStorage read |
| **Error** | Red-bordered banner at top: "Could not load today's quests. [Try Again]" — existing content still visible below | localStorage read failure, corrupted data |
| **Partial completion** | Mixed checked/unchecked items, progress bar at 40-80%, normal state | Ongoing daily use |
| **Complete** | All items checked, progress bar at 100%, completion banner slides up with bonus XP and confetti | Last quest checked off |
| **First day (onboarding)** | Same as empty state, but with additional text: "Pick 3-5 quests to start your journey" | localStorage has no history at all |

### Stats

| State | What Shows | Trigger |
|---|---|---|
| **Empty (no data)** | Centered text: "No stats yet — complete your first quest to see your progress here", illustration of blank chart | First visit before any quest completion |
| **Loading** | Skeleton cards for overview stats, gray placeholder for graph and heatmap, shimmer animation | Initial data aggregation |
| **Error** | "Could not calculate stats. Some data may be missing. [Recalculate]" | Data corruption or calculation error |
| **Partial data** | Stats show available data, graph has gaps for missing days, "— days ago" labels where data missing | User missed some days of tracking |
| **Full data** | All charts populated, color-coded heatmap, category bars filled | Normal use with consistent tracking |

### Achievements

| State | What Shows | Trigger |
|---|---|---|
| **Empty (no achievements earned)** | "No achievements unlocked yet" with illustration of locked trophy case, text: "Complete quests and build streaks to unlock achievements", all 30 achievements shown as locked | First visit before any achievement criteria met |
| **Loading** | Grid of gray card placeholders with shimmer animation | Initial achievement data load |
| **Error** | "Could not load achievements. [Retry]" | Data read failure |
| **Some unlocked** | Mix of unlocked (color) and locked (gray) cards, counter updated (e.g., "3 / 30 Unlocked") | Normal progress |
| **Newly unlocked** | Toast notification pops up, newly unlocked achievement has pulsing border for 3 seconds | Right after achievement criteria met |
| **All unlocked** | "All achievements unlocked! You are a true DayQuest champion." All cards in full color | 100% completion (rare edge case) |

### Settings

| State | What Shows | Trigger |
|---|---|---|
| **Default** | All settings forms loaded with current values | Normal navigation to Settings |
| **Loading** | Skeleton form fields with shimmer | Initial settings load (fast, usually instant) |
| **Error** | "Could not load settings. [Retry]" — form disabled | Settings data read failure |
| **Unsaved changes** | "Save Changes" button becomes enabled (was disabled), subtle highlight on modified fields | User edits any setting |
| **Saved** | Green checkmark toast "Settings saved", button returns to disabled state | After clicking Save |
| **Reset in progress** | Confirmation modal: "Are you sure? This will erase ALL your data including XP, streaks, and achievements. Type 'RESET' to confirm." | User clicks "Reset All Data" |

---

## Phase 5: Keyboard Navigation Specification

### Global Shortcuts

| Key | Action | Scope |
|---|---|---|
| `1` | Navigate to Quest Board | Global |
| `2` | Navigate to Stats | Global |
| `3` | Navigate to Achievements | Global |
| `4` | Navigate to Settings | Global |
| `?` | Show keyboard shortcuts overlay modal | Global |
| `Escape` | Close any open modal/toast, return focus to triggering element | Global |
| `/` | Focus search (if/when search is implemented) | Global (future) |

### Quest Board Keyboard Navigation

**Tab Order:**
1. App logo (focusable, returns to Quest Board home)
2. Level badge (focusable, navigates to Stats)
3. Tab navigation (Quest Board, Stats, Achievements, Settings)
4. "Choose Today's Quests" button (if quests not yet selected)
5. Each QuestItem (in order, top to bottom, grouped by category)
   - Within each QuestItem: Tab lands on the row, Space/Enter toggles
6. "View Quest Library" button (if quests exist)
7. Completion banner "View Summary" link (only when all complete)
8. Loop back to top

**Quest Item Keys:**
- `Space` or `Enter`: Toggle quest completion
- `Tab` / `Shift+Tab`: Move to next/previous quest item
- `Arrow Up` / `Arrow Down`: Move between quests within same category
- `Arrow Right`: Move to next category group
- `Arrow Left`: Move to previous category group

**Focus Management:**
- After completing a quest: Focus stays on that quest item (visual feedback happens on it)
- After undo: Focus stays on the quest item that was undone
- After all quests complete: Focus moves to "View Summary" button in completion banner
- After navigating via shortcut key: Focus moves to page heading (h1)

### Stats Keyboard Navigation

**Tab Order:**
1. Tab navigation
2. Time range toggle (Day / Week / Month / All) — use arrow keys within toggle
3. Each stats card (focusable, Enter drills down — future feature)
4. Graph (focusable, arrow keys move between data points, tooltip appears)
5. Category bars (focusable, Enter filters Quest Board to category)
6. Streak calendar (focusable, arrow keys navigate cells, tooltip shows date data)

**Focus Management:**
- On page load: Focus on page heading "Stats"
- After time range change: Focus stays on toggle group, aria-live announces update

### Achievements Keyboard Navigation

**Tab Order:**
1. Tab navigation
2. Category filter chips (arrow keys within filter group)
3. Each achievement card (grid navigation)
   - `Arrow Up/Down/Left/Right`: Navigate grid
   - `Enter`: Open detail modal (unlocked) or show tooltip (locked)
4. Detail modal (when open): Close button → focus returns to triggering card

**Focus Management:**
- On page load: Focus on page heading "Achievements"
- When detail modal opens: Focus trapped inside modal, Escape closes, focus returns to card
- When new achievement unlocks: Focus moves to the new achievement card (with pulsing border)

### Settings Keyboard Navigation

**Tab Order:**
1. Tab navigation
2. Inline settings tabs (Profile, Quest Library, Appearance, Data) — arrow keys within
3. Form fields in order (top to bottom)
4. "Save Changes" button
5. "Reset All Data" button
6. Confirmation modal (if triggered): Cancel (focused by default), Confirm

**Focus Management:**
- On page load: Focus on page heading "Settings"
- After inline tab switch: Focus moves to first form field in that tab
- After