# Habit Grid: Codex From Zero

## Project Goal

Build a pure web habit calendar that displays a monthly grid, toggles today or a selected date, gives checked-state feedback, shows monthly count or streak, persists in `localStorage`, and includes empty, checked, and streak feedback states.

## Preparation

- Start from an empty folder.
- Use plain HTML, CSS, and TypeScript or JavaScript.
- Do not add a backend, login, database, API, upload, leaderboard, or comments.
- Keep date generation and streak calculations in pure functions.

## From An Empty Folder

Create these files first:

- `index.html`: app root.
- `src/main.ts`: imports the renderer and starts the app.
- `src/demos/habits/logic.ts`: date grid, toggle, count, streak, storage.
- `src/demos/habits/render.ts`: calendar buttons and feedback.
- `src/styles/app.css`: Growth Grid visual motif.

## Starting Prompt

Prompt:

```text
Create a pure HTML/CSS/TypeScript habit calendar from an empty folder. It must show a monthly grid, let the user toggle today or a selected date, show checked feedback, show monthly count or current streak, persist checked dates in localStorage, and include empty, checked, and streak feedback states. Keep date logic in pure functions.
```

Expected output:

- A runnable static web app.
- A visible month grid.
- Date buttons with checked state.
- Stats and status feedback.

Validation:

- Click a date and see it become checked.
- Monthly count increases.
- Refresh keeps the checked date.
- Feedback changes from empty to checked.

## Improvement Prompts

Prompt 1:

```text
Add a Growth Grid motif with green square rhythm, clear today state, checked state, and compact monthly/streak stats.
```

Expected output:

- Green grid visual language.
- Today and checked states are distinct.

Validation:

- Today is visible.
- Checked dates are clearly different.

Prompt 2:

```text
Add current streak calculation based on consecutive checked dates ending today.
```

Expected output:

- Streak stat.
- Streak feedback when two or more consecutive days are checked.

Validation:

- Check yesterday and today.
- Streak shows 2.

Prompt 3:

```text
Make localStorage safe. If saved checked dates are missing or corrupt, show an empty grid instead of crashing.
```

Expected output:

- Safe parsing.
- Empty fallback.

Validation:

- Put invalid JSON in storage.
- Reload and see the grid.

## Troubleshooting Prompts

Prompt 1:

```text
The checked state disappears after refresh. Check that toggle writes the checked date array to localStorage and initial state reads it.
```

Expected output:

- One storage key for checked dates.
- Initial render uses saved dates.

Validation:

- Check a date.
- Refresh.
- Date remains checked.

Prompt 2:

```text
Today is highlighted on the wrong day. Use a stable YYYY-MM-DD date key and compare date keys, not display text.
```

Expected output:

- Stable date key helper.
- Today comparison uses the same format.

Validation:

- Today's button has the today style.

Prompt 3:

```text
The streak count is too high. Count backward from today and stop at the first unchecked date.
```

Expected output:

- Streak only covers consecutive checked dates.
- Gaps stop the streak.

Validation:

- Check today and two days ago but not yesterday.
- Streak is 1.

## Remix Prompts

Prompt 1:

```text
Remix Habit Grid into a reading tracker. Change copy to pages read and keep one checked square per reading day.
```

Expected output:

- Reading-specific copy.
- Same date toggle logic.

Validation:

- Check a reading day.
- Refresh preserves it.

Prompt 2:

```text
Add a note for each checked date. Keep the date checked even when the note is empty.
```

Expected output:

- Optional note input.
- Data shape can store notes by date.

Validation:

- Add a note to a date.
- Refresh keeps the note.

Prompt 3:

```text
Support three habits in one grid by storing checked dates per habit name and switching between habits.
```

Expected output:

- Habit selector.
- Separate checked dates per habit.

Validation:

- Check one habit.
- Switch habits.
- The first habit's check does not appear on the second.

## Running The Project

```powershell
npm install
npm run dev
```

Then open `/#/projects/habit-grid/demo`.

## Validation Checklist

- Calendar/grid is visible.
- User can toggle a date.
- Checked state has clear visual feedback.
- Monthly count or streak is visible.
- Data persists after refresh.
- Empty, checked, and streak feedback states exist.
