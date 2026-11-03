---
name: Cinematic Editorial Discovery
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c4c7c8'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#8e9192'
  outline-variant: '#444748'
  surface-tint: '#c6c6c7'
  primary: '#ffffff'
  on-primary: '#2f3131'
  primary-container: '#e2e2e2'
  on-primary-container: '#636565'
  inverse-primary: '#5d5f5f'
  secondary: '#c7c6c6'
  on-secondary: '#2f3131'
  secondary-container: '#484949'
  on-secondary-container: '#b8b8b8'
  tertiary: '#ffffff'
  on-tertiary: '#303031'
  tertiary-container: '#e4e2e2'
  on-tertiary-container: '#646464'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c7'
  on-primary-fixed: '#1a1c1c'
  on-primary-fixed-variant: '#454747'
  secondary-fixed: '#e3e2e2'
  secondary-fixed-dim: '#c7c6c6'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#464747'
  tertiary-fixed: '#e4e2e2'
  tertiary-fixed-dim: '#c7c6c6'
  on-tertiary-fixed: '#1b1c1c'
  on-tertiary-fixed-variant: '#464747'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-hero:
    fontFamily: Hanken Grotesk
    fontSize: 64px
    fontWeight: '600'
    lineHeight: 72px
    letterSpacing: -0.03em
  display-hero-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 42px
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 40px
    fontWeight: '500'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 34px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 17px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.005em
  label-mono-md:
    fontFamily: Space Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.06em
  label-mono-sm:
    fontFamily: Space Mono
    fontSize: 10px
    fontWeight: '400'
    lineHeight: 14px
    letterSpacing: 0.08em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 0.75rem
  margin: 3rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
  space-2xl: 4rem
---

## Brand & Style

This design system expresses a refined cinematic editorial aesthetic built for cinephiles, industry curators, and discerning viewers. Combining the stark elegance of prestige print film journals with the fluid, tactile polish of modern high-end operating systems, the product treats motion picture artifacts as pure gallery objects.

### Visual Pillars
- **Curatorial Restraint:** Minimal, uncluttered structures prioritize large-format poster photography, production stills, and directorial typography over decorative UI embellishments.
- **Cinematic Atmosphere:** Deep obsidian tones evoke the controlled darkness of a cinema theater, enabling vivid film stills and color grades to pop without UI competition.
- **Micro-Precision Interaction:** Fluid transitions, delicate borders, crisp monospaced metadata pairings, and subtle kinetic hover effects inspired by physical film strips and archival documentation.
- **Understated Wordmark:** The identity anchors around an unpretentious, lowercase mark (`trendo.`) set in quiet, balanced geometric sans with an intentional full stop.

## Colors

The palette is strictly monochromatic and dark-first, constructed from nuanced gradations of obsidian and carbon to create natural depth without relying on colored lights or synthetic glows.

### Color Tiers
- **Canvas Base (`#070707`):** The foundational void, replicating a pitch-black projection theater. Used exclusively for application root backgrounds and cinematic letterbox viewports.
- **Canvas Secondary (`#0D0D0D`):** Recessed structural wells, fixed side rails, and utility panels.
- **Surface Elevation (`#141414`):** Overlaid navigation headers, filter bars, sheet drawers, and contextual toolbars.
- **Card Surface (`#191919`):** Media tile card planes, poster backdrops, and active interactive containers.
- **Border Ghost (`rgba(255, 255, 255, 0.08)`): Whispering boundary strokes separating content tiers without visual weight.
- **Border Active (`rgba(255, 255, 255, 0.20)`): Focused states, active pills, and emphasized boundaries.

### Typography & Content Shades
- **Text High Emphasis (`#F5F5F5`):** Titles, primary metrics, active navigation labels, and dominant editorial quotes.
- **Text Secondary (`#A1A1A1`):** Directorial credits, genre tags, loglines, and secondary metadata.
- **Text Muted (`#707070`):** Release years, runtime stamps, aspect ratios, technical production data, and unselected states.
- **Accent Highlight (`#FFFFFF`):** Reserved solely for micro-indicators, scrub-heads, and definitive play states.

## Typography

The typographic hierarchy pairs the architectural clarity of **Hanken Grotesk** for cinematic display and editorial reading with the technical, slate-inspired precision of **Space Mono** for curation metadata.

### Application Guidelines
- **Wordmark (`trendo.`):** Set in lowercase Hanken Grotesk Medium, letter-spacing `-0.04em`.
- **Editorial Film Titles:** Use `display-hero` or `headline-lg` with tight tracking. Titles over imagery must maintain legible text hierarchy through natural dark vignette underlays.
- **Loglines & Reviews:** Set in `body-lg` or `body-md` using generous line-heights to capture the visual pacing of prestige film prints.
- **Metadata Slates:** Production years, runtime, camera formats (e.g., `35MM`, `4K HDR`, `2.39:1`), and curation badges always employ `label-mono-sm` or `label-mono-md` in uppercase with expanded tracking.

## Layout & Spacing

The layout philosophy follows a strict fluid modular grid calibrated around golden-ratio poster ratios (2:3) and cinematic widescreen banners (16:9 and 2.39:1).

### Layout System
- **Desktop (12 Columns):** Fixed outer margin of `margin` (48px) with `gutter` (24px). Hero features and director retrospectives span 12 columns or split 8/4 for curation narratives.
- **Tablet (8 Columns):** Fluid outer margins (32px) and 16px gutters. Poster galleries reflow to 3 or 4 columns.
- **Mobile (4 Columns):** Outer margin of `margin-mobile` (20px) with `gutter-mobile` (12px). Poster rails transform into horizontal edge-to-edge swipe carousels.

### Spacing Rhythm
- Internal card component padding adheres strictly to `space-sm` or `space-md`.
- Section gaps between curated collections leverage `space-2xl` to mimic white space in gallery installations.

## Elevation & Depth

Visual hierarchy does not use diffuse colorful drop-shadows or saturated glows. Instead, physical presence is established through tonal layering, disciplined translucency, and ghost stroke boundaries.

### Depth Mechanics
- **Ground Floor (`#070707`):** The master canvas.
- **Floating Rail & Menus (`#141414` at 80% opacity with `backdrop-filter: blur(24px)`):** Persistent topbars and side navigation sit subtly over passing media, matching Apple glass aesthetics without milkiness.
- **Card Planes (`#191919`):** Elements lift via hairline outlines: `1px solid rgba(255, 255, 255, 0.08)`.
- **Active Lift / Hover:** Media cards elevate not through Y-axis translation, but through subtle poster image zoom (`transform: scale(1.025)` over `300ms cubic-bezier(0.16, 1, 0.3, 1)`) and border brightening to `rgba(255, 255, 255, 0.22)`.

## Shapes

The interface embraces a restrained geometric profile (`roundedness: 1`), honoring the architectural edges of physical media cases, film cells, and editorial magazines.

### Geometry Rules
- **Poster Frames & Hero Displays:** Minimal corner softening (`0.25rem` / 4px) to retain sharp editorial presence.
- **Cards & Utility Modals:** Standard `rounded-lg` (`0.5rem` / 8px) creates clean structural framing.
- **Pill Exceptions:** Filter chips and scrub-heads utilize fully circular endpoints (`9999px`) to immediately denote interactive touch-points and scrub controls.

## Components

### Buttons
- **Primary Action (Watch, Play, Add):** Solid `#F5F5F5` background with `#070707` text. Bold, decisive, zero border. Hover shifts smoothly to `#E5E5E5`.
- **Secondary Action (Trailer, Details):** Surface `#141414` with `#F5F5F5` text and ghost border (`rgba(255, 255, 255, 0.12)`). Hover transitions to background `#1E1E1E`.
- **Ghost Action:** Pure transparent background, `#A1A1A1` text, hover shifts to `#F5F5F5` with subtle underline or micro icon translation.

### Discovery Media Cards (Poster & Backdrop)
- **Aspect Ratios:** Standard vertical posters use strict 2:3. Cinematic stills use 16:9.
- **Card Container:** `#191919` surface, 4px border radius, 1px perimeter border `rgba(255, 255, 255, 0.07)`.
- **Overlay States:** Gradient scrim from transparent top to 85% `#070707` bottom. Monospaced metadata (`label-mono-sm`) pinned to bottom-left with genre and year.

### Chips & Filter Pills
- Fully rounded (`9999px`), padding `6px 14px`.
- **Inactive:** `#0D0D0D` background, `1px solid rgba(255, 255, 255, 0.10)`, text `#A1A1A1` in `label-mono-sm`.
- **Active:** `#F5F5F5` fill, `#070707` text, no border.

### Input Fields & Search Slate
- **Search Shell:** Recessed `#0D0D0D` fill, `1px solid rgba(255, 255, 255, 0.10)`, text `#F5F5F5`.
- **Focus State:** Border shifts to `#F5F5F5` with zero outer shadow rings.
- **Placeholder:** `#707070` in `body-md`. Search icon styled in muted monochrome.

### Checkboxes & Toggle Controls
- 16x16px squares with 2px radius. Border `1px solid #707070`.
- **Checked:** Filled with `#F5F5F5`, interior check icon rendered in `#070707`.

### Curated Lists & Filmography Tables
- Horizontal row layouts separated by `1px solid rgba(255, 255, 255, 0.05)`.
- Columns align title (left), director/role (center), and year/rating (right) with monospace metadata alignment.