# Focus Pomodoro: Codex From Zero

## Project Goal

Build a pure web Pomodoro timer that supports start, pause, reset, focus mode, break mode, countdown display, progress feedback, completion feedback, and today's completed focus count in `localStorage`.

## Preparation

- Start from an empty folder.
- Use plain HTML, CSS, and TypeScript or JavaScript.
- Do not add a backend, login, database, or third-party API.
- Keep the first version small enough to understand in one sitting.

## From An Empty Folder

Create these files first:

- `index.html`: page shell and timer controls.
- `src/main.ts`: imports the renderer and starts the app.
- `src/demos/pomodoro/logic.ts`: pure timer state and localStorage helpers.
- `src/demos/pomodoro/render.ts`: DOM rendering and button wiring.
- `src/styles/app.css`: Solar Dial visual motif and responsive layout.

## Starting Prompt

Prompt:

```text
Create a pure HTML/CSS/TypeScript Pomodoro timer from an empty folder. It must have focus and break modes, Start, Pause, Reset buttons, a visible countdown, a progress indicator, completion feedback, and today's completed focus count saved in localStorage. Keep the timer logic in pure functions and keep the UI beginner-readable.
```

Expected output:

- A runnable static web app.
- A visible timer interface with the first action obvious.
- Separate logic and rendering files.
- No backend or API code.

Validation:

- Open the page and click Start within 15 seconds.
- Pause and Reset change the visible state immediately.
- A completed focus session increments today's count.
- Refresh keeps today's count.

## Improvement Prompts

Prompt 1:

```text
Add a Solar Dial visual motif: a warm circular progress dial, amber panel, and clear focus/break mode controls. Keep all controls at least 44px tall and add visible focus states.
```

Expected output:

- A circular progress indicator or strong progress bar.
- Warm yellow and amber styling.
- Keyboard focus is visible on every button.

Validation:

- Tab through Start, Pause, Reset, Focus, and Break.
- The focused control is clearly visible.
- Mobile width still shows the timer and controls.

Prompt 2:

```text
Make the timer test-friendly by allowing configurable durations in the logic layer while keeping the production focus duration at 25 minutes and break duration at 5 minutes.
```

Expected output:

- Default durations for normal use.
- Short durations can be passed by tests.
- The UI still presents beginner-friendly Focus and Break modes.

Validation:

- A test can complete a focus session in 2 seconds.
- Normal app load still shows 25:00 for focus mode.

Prompt 3:

```text
Add localStorage safety. If the saved Pomodoro record is missing, from another date, or corrupt JSON, fall back to today's count of 0 without crashing.
```

Expected output:

- A storage key for today's Pomodoro record.
- Safe parsing with fallback.
- Refresh preservation for valid records.

Validation:

- Manually put invalid JSON in localStorage.
- Reload the page.
- The app still opens and shows 0 completed today.

## Troubleshooting Prompts

Prompt 1:

```text
The countdown keeps running after I press Pause. Inspect interval creation and cleanup. Make Pause clear the active interval and make Start avoid creating duplicate intervals.
```

Expected output:

- One active interval at most.
- Pause freezes the countdown.
- Start resumes from the paused time.

Validation:

- Start, wait one second, Pause.
- The countdown does not change while paused.

Prompt 2:

```text
The completed count resets after refresh. Inspect the localStorage key, record shape, and date check. Make the app read the saved record during initial state creation.
```

Expected output:

- Initial state reads the saved count.
- Completion writes `{ date, completed }`.
- Date mismatch starts a new daily record.

Validation:

- Complete a short test session.
- Refresh.
- Today's count remains visible.

Prompt 3:

```text
The progress indicator moves backward. Check whether progress means elapsed time or remaining time, then render elapsed / total as the visible progress.
```

Expected output:

- Progress starts at 0%.
- Progress reaches 100% at completion.
- Countdown still decreases.

Validation:

- At the start, the bar or ring is empty.
- Halfway through, it is about half full.
- At completion, it is full.

## Remix Prompts

Prompt 1:

```text
Remix this Pomodoro into a 15-minute writing sprint timer with copy that says Draft, Pause, Reset, and Done Drafting.
```

Expected output:

- Same timer logic.
- Writing-focused labels and completion message.

Validation:

- A writing sprint can start and complete.
- The completed count still persists.

Prompt 2:

```text
Remix this into a study timer with three modes: Focus, Break, and Review. Add a mode switch and keep the state transitions testable.
```

Expected output:

- A third mode in the duration map.
- Buttons update the selected mode.
- Countdown and progress still work.

Validation:

- Each mode resets to its own duration.
- Start/Pause/Reset work in every mode.

Prompt 3:

```text
Remix this into a weekly focus tracker by storing counts per date and showing a 7-day mini summary below the timer.
```

Expected output:

- A localStorage record keyed by date.
- A simple weekly summary.
- No backend or account system.

Validation:

- Completing today updates today's cell.
- Refresh preserves the weekly summary.

## Running The Project

Use your local dev server, then open the app route for the Pomodoro demo. In this repository, run:

```powershell
npm install
npm run dev
```

Then open `/#/projects/focus-pomodoro/demo`.

## Validation Checklist

- Start, Pause, and Reset are visible.
- Focus and Break modes are visible.
- Countdown text updates while running.
- Progress feedback moves from 0% to 100%.
- Completion feedback appears after a session.
- Today's completed focus count is saved in `localStorage`.
- Refresh preserves today's count.
- The first action is understandable within 15 seconds.
