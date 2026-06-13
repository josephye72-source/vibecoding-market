# Habit Grid Source Guide

## Read These Files First

1. `src/demos/habits/logic.ts`

   This file creates the month grid, toggles dates, calculates monthly count and streak, and reads/writes localStorage.

2. `src/demos/habits/render.ts`

   This file renders the month, stats, feedback, and date buttons.

3. `src/main.ts`

   This file mounts Habit Grid on `#/projects/habit-grid/demo`.

4. `src/styles/app.css`

   Search for `.habit-demo`. This section owns the Growth Grid motif.

5. `src/demos/habits/logic.test.ts`

   Read this file before changing date rules.

## What Each Core File Does

- `logic.ts`: date keys, grid generation, toggle, storage, count, streak.
- `render.ts`: DOM buttons, click handling, status updates.
- `main.ts`: route selection and mount.
- `app.css`: green grid, today state, checked state, responsive layout.
- `site.spec.ts`: browser proof for toggle and refresh.

## Beginner Edit Points

1. Change feedback copy:

   Edit `getHabitFeedback` in `logic.ts`.

2. Change grid color:

   Edit `.habit-shell` and `.habit-day--checked` in `app.css`.

3. Change the stat emphasis:

   Edit the `habit-summary` markup in `render.ts`.

## Safe Change Rule

Use date keys for logic. Use display labels only for people reading the calendar.
