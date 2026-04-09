# DayQuest Design System Specification

> A premium game UI design system — dark, neon-accented, clean and readable.
> Think **Linear meets Destiny 2**.

---

## 1. Color System

### 1.1 Core Philosophy

- **Backgrounds**: Deep near-black with subtle blue-purple undertone, not pure `#000`. Layered surface colors create depth.
- **Foregrounds**: Warm white tints (never pure `#fff`) to reduce eye strain on dark backgrounds.
- **Accents**: Neon-saturated colors with high luminance for visibility against dark surfaces. Each category gets a unique hue.
- **Borders**: Alpha-transparent white/neutral strokes that add structure without harsh lines.
- **Glows**: Accent colors at low opacity with CSS `blur()` for interactive/hover states.

### 1.2 Neutral Palette (Backgrounds & Surfaces)

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-bg-void` | `#06060b` | Absolute deepest background (app root, behind everything) |
| `--color-bg-primary` | `#0a0a0f` | Main app background |
| `--color-bg-secondary` | `#101018` | Primary surface panels, sidebars |
| `--color-bg-tertiary` | `#16161f` | Cards, elevated surfaces |
| `--color-bg-elevated` | `#1c1c28` | Dropdowns, modals, tooltips |
| `--color-bg-overlay` | `#22222f` | Popovers, floating elements |
| `--color-bg-hover` | `#2a2a38` | Hover state on interactive surfaces |
| `--color-bg-active` | `#33334a` | Active/pressed state on surfaces |

### 1.3 Neutral Palette (Foregrounds & Text)

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-text-primary` | `#f0f0f5` | Primary headings, body text |
| `--color-text-secondary` | `#a0a0b4` | Subtitles, descriptions, labels |
| `--color-text-tertiary` | `#6a6a80` | Placeholder text, disabled, timestamps |
| `--color-text-inverse` | `#0a0a0f` | Text on light/bright backgrounds |

### 1.4 Category Accent Colors

Each quest category gets a neon accent with three variants: base, glow (for shadows/effects), and dim (for backgrounds/subtle indicators).

| Category | Base | Glow (shadow) | Dim (bg) | Usage |
|----------|------|---------------|----------|-------|
| Health | `#00e5ff` (cyan) | `rgba(0, 229, 255, 0.4)` | `rgba(0, 229, 255, 0.08)` | Exercise, sleep, diet quests |
| Mind | `#b44aff` (purple) | `rgba(180, 74, 255, 0.4)` | `rgba(180, 74, 255, 0.08)` | Reading, meditation, journaling |
| Skills | `#ffb300` (amber) | `rgba(255, 179, 0, 0.4)` | `rgba(255, 179, 0, 0.08)` | Practice, coding, study |
| Social | `#ff4a8d` (rose) | `rgba(255, 74, 141, 0.4)` | `rgba(255, 74, 141, 0.08)` | Networking, calls, events |

### 1.5 Semantic Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-xp` | `#00e676` (green) | XP bars, XP gain text, level progress |
| `--color-xp-glow` | `rgba(0, 230, 118, 0.4)` | XP bar glow effect |
| `--color-xp-dim` | `rgba(0, 230, 118, 0.08)` | XP background tints |
| `--color-streak` | `#ff6d00` (orange) | Streak counters, fire effects |
| `--color-streak-glow` | `rgba(255, 109, 0, 0.4)` | Streak fire glow |
| `--color-streak-dim` | `rgba(255, 109, 0, 0.08)` | Streak background tints |
| `--color-level` | `#ffd600` (gold) | Level badges, level-up text |
| `--color-level-glow` | `rgba(255, 214, 0, 0.4)` | Level badge glow |
| `--color-success` | `#00e676` | Completion checkmarks, success toasts |
| `--color-warning` | `#ffb300` | Warnings, incomplete quests |
| `--color-danger` | `#ff3d5a` | Errors, streak broken |
| `--color-info` | `#448aff` | Info messages, tips |

### 1.6 Border Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-border-subtle` | `rgba(255, 255, 255, 0.06)` | Default card/border separators |
| `--color-border-default` | `rgba(255, 255, 255, 0.10)` | Standard borders |
| `--color-border-strong` | `rgba(255, 255, 255, 0.16)` | Active element borders, focus |
| `--color-border-accent` | Varies | Category-colored borders (use accent + alpha) |

### 1.7 Glow Colors (Interactive)

| Token | Value | Usage |
|-------|-------|-------|
| `--glow-health` | `0 0 12px rgba(0, 229, 255, 0.5), 0 0 24px rgba(0, 229, 255, 0.2)` | Hover on Health quests |
| `--glow-mind` | `0 0 12px rgba(180, 74, 255, 0.5), 0 0 24px rgba(180, 74, 255, 0.2)` | Hover on Mind quests |
| `--glow-skills` | `0 0 12px rgba(255, 179, 0, 0.5), 0 0 24px rgba(255, 179, 0, 0.2)` | Hover on Skills quests |
| `--glow-social` | `0 0 12px rgba(255, 74, 141, 0.5), 0 0 24px rgba(255, 74, 141, 0.2)` | Hover on Social quests |
| `--glow-xp` | `0 0 12px rgba(0, 230, 118, 0.5), 0 0 24px rgba(0, 230, 118, 0.2)` | XP bar at 100% |
| `--glow-streak` | `0 0 12px rgba(255, 109, 0, 0.5), 0 0 24px rgba(255, 109, 0, 0.2)` | Active streak fire |
| `--glow-level` | `0 0 16px rgba(255, 214, 0, 0.6), 0 0 32px rgba(255, 214, 0, 0.2)` | Level-up badge |
| `--glow-focus` | `0 0 0 2px rgba(0, 229, 255, 0.4)` | Keyboard focus ring |

---

## 2. Typography System

### 2.1 Font Families

| Token | Font Stack | Usage |
|-------|-----------|-------|
| `--font-body` | `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` | All body text, labels, inputs |
| `--font-display` | `'Orbitron', 'Inter', sans-serif` | Level numbers, achievement titles, section headers |
| `--font-mono` | `'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace` | Stats, numbers, timestamps, data |

### 2.2 Type Scale

Base size: **16px** (1rem). Scale ratio: **1.250** (major third).

| Name | Size (rem) | Size (px) | Line Height | Weight | Letter Spacing | Usage |
|------|-----------|-----------|-------------|--------|----------------|-------|
| `text-xs` | 0.75 | 12 | 1.0 | 500 | +0.05em | Badges, tags, timestamps |
| `text-sm` | 0.875 | 14 | 1.4 | 400 | 0 | Secondary labels, hints |
| `text-base` | 1 | 16 | 1.5 | 400 | 0 | Body text, quest descriptions |
| `text-lg` | 1.25 | 20 | 1.4 | 500 | 0 | Quest titles, card headings |
| `text-xl` | 1.563 | 25 | 1.3 | 600 | -0.01em | Section headers |
| `text-2xl` | 1.953 | 31 | 1.2 | 700 | -0.02em | Page titles, dashboard headers |
| `text-3xl` | 2.441 | 39 | 1.1 | 800 | -0.02em | Hero numbers (level, streak) |
| `text-4xl` | 3.052 | 49 | 1.0 | 800 | -0.03em | Level-up popup (display) |
| `text-5xl` | 3.815 | 61 | 1.0 | 900 | -0.04em | Mega display (annual stats) |

### 2.3 Weight Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--font-weight-normal` | 400 | Body text, descriptions |
| `--font-weight-medium` | 500 | Labels, quest titles |
| `--font-weight-semibold` | 600 | Headings, emphasis |
| `--font-weight-bold` | 700 | Section headers, numbers |
| `--font-weight-extrabold` | 800 | Display numbers, level badges |
| `--font-weight-black` | 900 | Hero display numbers |

---

## 3. Spacing System

Base unit: **4px**. All spacing is a power-of-2 multiple of 4.

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Icon padding, tight gaps |
| `--space-2` | 8px | Inline element gaps |
| `--space-3` | 12px | Small component padding |
| `--space-4` | 16px | Card padding, standard gaps |
| `--space-5` | 20px | Section padding |
| `--space-6` | 24px | Large component padding |
| `--space-8` | 32px | Panel margins, layout gaps |
| `--space-10` | 40px | Section spacing |
| `--space-12` | 48px | Page section gaps |
| `--space-16` | 64px | Major layout gaps |
| `--space-20` | 80px | Page margins (mobile) |
| `--space-24` | 96px | Page margins (desktop) |

---

## 4. Elevation & Depth System

In dark mode, elevation is conveyed through **surface lightness** + **shadow depth** + **glow effects**.

### 4.1 Surface Levels

| Level | Surface Color | Shadow | Usage |
|-------|--------------|--------|-------|
| `elevation-0` | `--color-bg-primary` | none | Base canvas |
| `elevation-1` | `--color-bg-secondary` | `0 1px 2px rgba(0,0,0,0.3)` | Sidebars, nav bars |
| `elevation-2` | `--color-bg-tertiary` | `0 2px 8px rgba(0,0,0,0.3)` | Quest cards, stat panels |
| `elevation-3` | `--color-bg-elevated` | `0 4px 16px rgba(0,0,0,0.4)` | Dropdowns, popovers |
| `elevation-4` | `--color-bg-overlay` | `0 8px 32px rgba(0,0,0,0.5)` | Modals, dialogs |
| `elevation-5` | `--color-bg-overlay` | `0 16px 64px rgba(0,0,0,0.6)` | Full-screen overlays |

### 4.2 Glow Elevation (Interactive)

Interactive elements at rest use standard shadows. On hover/active, they gain a colored glow:

| State | Effect |
|-------|--------|
| Rest | Standard shadow from elevation level |
| Hover | Shadow deepens + accent color glow (`0 0 12px`, `0 0 24px`) |
| Active/Press | Glow intensifies + surface brightens slightly |
| Focus | `0 0 0 2px` focus ring in accent color |

### 4.3 Neon Glow Application Rules

- **Subtle glow** (always-on): Quest cards get a faint category-colored glow on their border, not box-shadow. Achieved via `border-color` with accent + alpha.
- **Hover glow**: `box-shadow` with two layers — tight bright glow + wide soft glow.
- **Completion glow**: XP bar at 100% gets green glow. Achievement unlock gets gold glow.
- **Streak fire**: Orange/red glow + CSS animation (flicker).

---

## 5. Border Radius System

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-none` | 0 | RPG badges, achievement icons (sharp) |
| `--radius-sm` | 4px | Small badges, tags |
| `--radius-md` | 8px | Quest cards, stat panels, inputs |
| `--radius-lg` | 12px | Large panels, sidebars |
| `--radius-xl` | 16px | Modals, dialog containers |
| `--radius-full` | 9999px | Buttons (pill), avatars, progress bar tracks, pill badges |

### Rules
- **Quest cards**: `--radius-md` (8px) — sharp enough to feel tactical, rounded enough to be friendly.
- **Achievement badges**: `--radius-none` (0) — sharp diamond/shield shapes feel RPG.
- **Buttons**: `--radius-full` — pill shape, modern and clickable.
- **XP/Progress bars**: `--radius-full` — smooth, fluid feel.
- **Modals**: `--radius-xl` — large containers need softer corners.

---

## 6. Motion & Animation System

### 6.1 Duration Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--duration-instant` | 50ms | Micro-interactions (button press) |
| `--duration-fast` | 100ms | Toggle switches, checkbox state |
| `--duration-normal` | 200ms | Hover transitions, color shifts |
| `--duration-slow` | 300ms | Card appearance, panel slides |
| `--duration-slower` | 500ms | Page transitions, XP bar fill |
| `--duration-slowest` | 800ms | Modal open/close, achievement reveal |

### 6.2 Easing Curves

| Token | Value | Usage |
|-------|-------|-------|
| `--ease-linear` | `linear` | Progress bars (constant motion) |
| `--ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Elements exiting (slide out) |
| `--ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Elements entering (slide in) |
| `--ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | General purpose transitions |
| `--ease-bounce` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Level-up popup scale, achievement pop-in |
| `--ease-spring` | `cubic-bezier(0.175, 0.885, 0.32, 1.275)` | Card hover lift, button press |

### 6.3 Animation Definitions

| Name | Duration | Easing | Description |
|------|----------|--------|-------------|
| `xp-fill` | 800ms | `ease-out` | XP bar fills from old to new value |
| `level-up-pop` | 600ms | `ease-bounce` | Level badge scales up with overshoot |
| `streak-fire` | 1000ms | `ease-in-out` infinite | Flame flicker on streak counter |
| `achievement-unlock` | 800ms | `ease-bounce` | Badge scales in, glows gold, particles |
| `quest-complete` | 400ms | `ease-spring` | Card checkmark pops in, border glows green |
| `shimmer` | 2000ms | `linear` infinite | Loading skeleton shimmer effect |
| `pulse-glow` | 2000ms | `ease-in-out` infinite | Subtle glow pulse on active elements |
| `fade-in-up` | 300ms | `ease-out` | Card entrance animation |
| `slide-in-right` | 300ms | `ease-out` | Toast notification entrance |
| `count-up` | 600ms | `ease-out` | Number counter animations (XP, level) |

---

## 7. Component Design Rules

### 7.1 Quest Card

- **Surface**: `--color-bg-tertiary` with `--elevation-2` shadow
- **Border**: `--color-border-default`, changes to category accent on hover
- **Border-radius**: `--radius-md`
- **Padding**: `--space-4`
- **Layout**: Flex column — category badge (top-left) + title + description + XP reward (bottom-right)
- **Hover**: Surface lightens to `--color-bg-hover`, border becomes accent color, subtle glow appears
- **Complete state**: Checkmark icon slides in, border turns green with glow, surface gets green tint
- **Animation**: Fade-in-up on mount, spring on hover

### 7.2 XP Bar

- **Track**: `--color-bg-secondary`, `--radius-full`, height 8px
- **Fill**: `--color-xp` gradient (lighter to darker green), `--radius-full`
- **Glow**: When fill > 90%, green glow activates
- **Fill animation**: Smooth transition from old width to new width (800ms, ease-out)
- **Label**: XP text centered above bar — "1,240 / 2,000 XP" in `--color-text-secondary`
- **Level indicator**: Small triangle or dot at current position on track

### 7.3 Achievement Badge

- **Shape**: Sharp square/diamond (0px radius) — feels like an RPG item
- **Size**: 48x48px icon container
- **Background**: Category dim color with subtle gradient
- **Border**: Category accent, 1px
- **Locked state**: Desaturated (grayscale), border at 30% opacity
- **Unlocked state**: Full color, glow effect, gold sparkle particles on unlock
- **Animation**: Scale from 0 to 1 with bounce easing, then glow pulse

### 7.4 Streak Counter

- **Layout**: Horizontal — fire icon + number + "day streak" label
- **Number**: `--font-display`, `--text-3xl`, `--color-streak`
- **Fire icon**: Animated with CSS flame flicker (scale + opacity oscillation)
- **Glow**: Streak > 7 days gets stronger glow; > 30 days gets intense pulsing glow
- **Broken state**: Number turns `--color-danger`, fire icon becomes ash/gray, sad animation

### 7.5 Stat Chart (Weekly/Monthly View)

- **Grid lines**: `--color-border-subtle` (barely visible)
- **Bars/lines**: Category accent colors with gradient fill
- **Labels**: `--color-text-tertiary`, `--text-xs`, `--font-mono`
- **Hover on data point**: Tooltip appears with `--elevation-3`, shows exact number
- **Animation**: Bars grow from bottom on page load (staggered)

### 7.6 Navigation Bar

- **Surface**: `--color-bg-secondary`, `--elevation-1`
- **Height**: 64px
- **Border-bottom**: `--color-border-default`
- **Logo**: Orbitron font, neon accent color
- **Nav items**: Icon + label, `--color-text-secondary`, hover changes to `--color-text-primary` with subtle glow
- **Active item**: Category accent color, underline or left-border indicator
- **Mobile**: Bottom nav bar with icons only

### 7.7 Settings Toggle

- **Style**: Pill toggle switch (not checkbox)
- **Track**: `--color-bg-hover`, `--radius-full`, 48x24px
- **Thumb**: `--color-text-primary`, `--radius-full`, 20px diameter
- **Active track**: Category accent color
- **Transition**: 200ms, ease-in-out
- **Label**: `--text-sm`, `--color-text-secondary`, left of toggle

### 7.8 Level Badge

- **Shape**: Circle or shield
- **Background**: `--color-level` gradient (gold)
- **Text**: `--font-display`, `--text-xl`, `--color-text-inverse`
- **Glow**: Always on — soft gold glow
- **Level-up**: Badge pulses, then new number bounces in with scale animation

---

## 8. Accessibility Rules

- **Contrast**: All text meets WCAG AA minimum (4.5:1 for normal text, 3:0:1 for large text)
- **Focus**: All interactive elements have visible `--glow-focus` ring on `:focus-visible`
- **Motion**: Respect `prefers-reduced-motion` — disable non-essential animations, replace with fades
- **Color**: Never use color alone to convey state — always pair with icons or text labels

---

## 9. Responsive Breakpoints

| Token | Value | Target |
|-------|-------|--------|
| `--breakpoint-sm` | 640px | Large phones |
| `--breakpoint-md` | 768px | Tablets |
| `--breakpoint-lg` | 1024px | Small laptops |
| `--breakpoint-xl` | 1280px | Desktops |
| `--breakpoint-2xl` | 1536px | Large monitors |

---

## 10. Z-Index Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--z-base` | 0 | Default |
| `--z-dropdown` | 100 | Dropdown menus |
| `--z-sticky` | 200 | Sticky headers |
| `--z-overlay` | 300 | Tooltips, popovers |
| `--z-modal` | 400 | Modal dialogs |
| `--z-toast` | 500 | Toast notifications |
| `--z-levelup` | 600 | Level-up popup (highest priority) |
