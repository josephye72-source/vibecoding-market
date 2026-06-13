# Vibe Coding Market V1 Design System

Date: 2026-06-13
Scope: Task 2, Design Direction And Visual System
Accepted concept reference: `public/assets/concepts/v1-studio-anthology-concept.png`

## Visual Thesis

V1 uses a Studio Anthology direction: the site behaves like a curated public project map, while every demo gets a named, distinct visual motif. The shared shell is dark, high contrast, editorially compact, and code-native. The project cards carry the louder color, material, and interaction cues so the gallery does not become a generic SaaS grid or a white-card demo list.

The signature move is a "night studio map" foundation: an obsidian surface, precise chart/grid structure, and five vivid motif strips that make the projects feel like completed artifacts in one collection.

## Site Tokens

Core site tokens:

| Token | Hex | Use |
| --- | --- | --- |
| Obsidian Field | `#07100F` | Page background |
| Chalk Ink | `#F7F1DF` | Primary text |
| Sage Note | `#B7C2A7` | Secondary text |
| Blueprint Line | `#30413D` | Borders and dividers |
| Signal Lime | `#E4FF32` | Primary action and site accent |
| Focus Sky | `#7DD3FC` | Keyboard focus ring |

Motif tokens:

| Project | Motif | Key Hex Values |
| --- | --- | --- |
| Focus Pomodoro | Solar Dial | `#F7C948`, `#4A3108`, `#211400` |
| Memory Cards | Neon Arcade Lab | `#B77CFF`, `#FF62D8`, `#1A1034` |
| Tiny Ledger | Receipt Ledger | `#7BDC92`, `#EFF9E8`, `#12351F` |
| Habit Grid | Growth Grid | `#A8E86F`, `#22643C`, `#122D1C` |
| Split Console | Split Console | `#84C7FF`, `#15517E`, `#0D2235` |

## Type Scale

The type system uses native/system sans faces to keep the project reproducible: `Segoe UI Variable`, `Aptos`, `Inter`, and system fallbacks.

| Role | Desktop | Tablet | Mobile |
| --- | ---: | ---: | ---: |
| Display | 5.5rem | 4rem | 2.75rem |
| H1 | 3.75rem | 3rem | 2.35rem |
| H2 | 2rem | 1.75rem | 1.55rem |
| H3 | 1.18rem | 1.18rem | 1.08rem |
| Body | 1rem | 1rem | 1rem |
| Small | 0.9rem | 0.9rem | 0.9rem |

Line height is tight for display text and 1.65 for body copy. Type changes by breakpoint tokens rather than viewport-width scaling.

## Spacing Scale

Spacing uses a 4px/8px rhythm:

| Token | Value |
| --- | ---: |
| `--space-1` | 0.25rem |
| `--space-2` | 0.5rem |
| `--space-3` | 0.75rem |
| `--space-4` | 1rem |
| `--space-5` | 1.25rem |
| `--space-6` | 1.5rem |
| `--space-8` | 2rem |
| `--space-10` | 2.5rem |
| `--space-12` | 3rem |
| `--space-16` | 4rem |
| `--space-20` | 5rem |

The max page width is `1180px`. Mobile gutters remain at `1rem` to preserve 390px usability.

## Component Families

- Site shell: compact header, text links, single-line brand, no app-dashboard chrome.
- Hero: thesis-first editorial block with a subtle blueprint grid and direct CTAs.
- Path steps: ordered learning sequence with numbered circular markers.
- Project cards: one shared card anatomy, but per-project accent, panel, and action color variables.
- Buttons and links: rectangular 6px radius, clear hover, pressed, and focus states.
- Badges and metadata: compact labels with high contrast and no color-only meaning.

## Focus And Motion Rules

- All interactive elements use a visible `3px` Focus Sky outline plus halo.
- Primary touch targets use a minimum `44px` block size.
- Hover and press states change contrast and use small `translateY` feedback.
- Motion durations are limited to `150ms` or `240ms` and animate transform, color, border, shadow, or background only.
- `prefers-reduced-motion: reduce` disables transitions, animations, and smooth scrolling.
- No heavy 3D, WebGL, cursor hijacking, or animation systems are required.

## Project Visual Motifs

1. Solar Dial: warm radial timer language, sunlit yellow, dark amber panel, tactile start state.
2. Neon Arcade Lab: purple/pink arcade glow, higher contrast, game-like card feedback.
3. Receipt Ledger: green ledger paper, account-book calm, data clarity over decoration.
4. Growth Grid: plant/grid greens, repeated square rhythm, progress made visible.
5. Split Console: blue console controls, calculator density, immediate numeric clarity.

Each motif must differ in at least three dimensions across color, material, component shape, state feedback, layout rhythm, or graphic language.

## Rejected Directions

- White SaaS card gallery: rejected because V1 Spec 6.7 says the site must not feel like a white-card demo collection or SaaS template.
- Course landing page: rejected because the product is public, open, and reproducible, not a conversion funnel.
- Heavy 3D/WebGL showcase: rejected because V1 must stay pure Web, explainable, and beginner-reproducible.
- Beige editorial craft palette: rejected as too common for AI-generated "creative" pages and too close to a generic warm portfolio.
- Five projects as recolored clones: rejected because every demo needs a named motif and at least three visible differences.

## Spec Fit

Section 5.2, Visual System And Interaction Principles:
The system defines one site-level shell, named motifs for all five projects, shared interaction rules, touch minimums, responsive typography, and explicit no-heavy-3D limits. It turns Studio Anthology from a concept into reusable CSS variables and reviewable rules.

Section 6.7, Visual Design:
The dark studio shell avoids the default white card grid, while motif variables ensure project individuality. Typography, spacing, color, buttons, and labels are consistent at the site level. The concept image `public/assets/concepts/v1-studio-anthology-concept.png` is the accepted reference for the visual thesis.

Section 6.8, User Interaction:
The baseline CSS defines visible keyboard focus, touch-friendly targets, hover and pressed feedback, reduced-motion behavior, and immediate visual feedback tokens for buttons and cards. Future demos should inherit these rules and add form labels, empty/input/result states, and local-state feedback per project.

## Quality Tooling Used

- `frontend-design`: used for the Studio Anthology thesis, token plan, and anti-template design pass.
- `ui-ux-pro-max`: ran `public project gallery interactive learning path --domain style`; selected inclusive/accessibility guidance and rejected custom cursor complexity.
- `ui-ux-pro-max`: ran `creative web project gallery typography color system --domain color`; used gallery-neutral contrast guidance while moving the accepted concept into a darker studio palette.
- `taste-skill`: used for anti-default checks against AI-purple gradients, generic three-card layouts, beige creative defaults, and template SaaS styling.
- `web-design-guidelines`: fetched the latest Vercel guideline source and applied focus, touch, motion, semantic link/button, text wrapping, and reduced-motion checks.
