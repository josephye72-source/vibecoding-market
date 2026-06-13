# Memory Cards Source Guide

## Read These Files First

1. `src/demos/memory/logic.ts`

   This file owns the game state, shuffle, flip rules, match detection, mismatch clearing, win condition, and restart.

2. `src/demos/memory/render.ts`

   This file renders the board, connects card clicks, updates moves/status, and schedules the mismatch reset.

3. `src/main.ts`

   This file mounts Memory Cards on `#/projects/memory-cards/demo` and cleans up timers when routes change.

4. `src/styles/app.css`

   Search for `.memory-demo`. This section owns the Neon Arcade Lab motif.

5. `src/demos/memory/logic.test.ts`

   Read the tests before editing rules. They describe the expected behavior.

## What Each Core File Does

- `logic.ts`: pure state transitions and shuffle.
- `render.ts`: HTML, event listeners, and paint updates.
- `main.ts`: route selection and demo mounting.
- `app.css`: arcade card layout, glow, card states, and responsive grid.
- `site.spec.ts`: browser proof that a player can complete the loop.

## Beginner Edit Points

1. Change card symbols:

   Edit `DEFAULT_MEMORY_SYMBOLS` in `logic.ts`.

2. Change mismatch timing:

   Edit the `550` millisecond timeout in `render.ts`.

3. Change visual glow:

   Edit `.memory-shell`, `.memory-card`, and `.memory-card.is-face-up` in `app.css`.

## Safe Change Rule

Logic decides which cards are open or matched. The renderer decides when to repaint. CSS decides how each card state feels.
