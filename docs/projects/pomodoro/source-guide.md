# Focus Pomodoro Source Guide

## Read These Files First

1. `src/demos/pomodoro/logic.ts`

   This is the safest starting point. It defines the timer state, mode switching, progress calculation, completion behavior, and localStorage record handling.

2. `src/demos/pomodoro/render.ts`

   This file turns the logic into a browser experience. It renders the Solar Dial markup, connects buttons, starts and clears the interval, and updates countdown/progress text.

3. `src/main.ts`

   This file mounts the real Pomodoro demo only on `#/projects/focus-pomodoro/demo`. The other demo routes stay as placeholders for their own tasks.

4. `src/styles/app.css`

   Search for `.pomodoro-demo`. This section owns the warm Solar Dial panel, circular dial, button states, responsive layout, and reduced-motion handling.

5. `src/demos/pomodoro/logic.test.ts`

   Read this when you want to understand the expected behavior before changing the logic.

## What Each Core File Does

- `logic.ts`: state transitions, duration normalization, progress math, countdown formatting, storage fallback.
- `render.ts`: HTML string, DOM query selectors, event listeners, interval lifecycle, visual updates.
- `main.ts`: route selection, Pomodoro demo mounting, and demo cleanup when routes change.
- `app.css`: layout, color, touch target, progress, focus-friendly control styling.
- `site.spec.ts`: browser proof that the user can complete the timer loop.

## Beginner Edit Points

1. Change durations:

   Edit `DEFAULT_POMODORO_DURATIONS` in `logic.ts`.

2. Change completion copy:

   Edit the messages inside `completeSession` in `logic.ts`.

3. Change the visual warmth:

   Edit the `.pomodoro-demo__panel`, `.pomodoro-dial__progress`, and `.pomodoro-mode-button[aria-pressed="true"]` rules in `app.css`.

## Safe Change Rule

When editing the timer, keep this split:

- Logic decides what the state should be.
- Renderer decides how the state appears.
- CSS decides how the Solar Dial feels.

That split keeps the project testable and easier to remix.
