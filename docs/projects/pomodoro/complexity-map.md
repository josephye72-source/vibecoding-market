# Focus Pomodoro Complexity Map

## Page Structure

The page has four visible zones:

- Intro: project title and what to do first.
- Dial: countdown and circular progress.
- Controls: mode switch plus Start, Pause, Reset.
- Record: status, completed today, and completion feedback.

The structure is simple, but it must keep the first action visible on both desktop and mobile.

## Interaction

The timer has a small state machine:

- `idle`: ready to start.
- `running`: countdown decreases every second.
- `paused`: countdown stays still.
- `complete`: session ended and feedback appears.

Buttons do not navigate. They change state immediately.

## State

The main state values are:

- selected mode: `focus` or `break`.
- status: `idle`, `running`, `paused`, or `complete`.
- remaining seconds.
- total seconds for the selected mode.
- today's completed focus count.
- message shown in the live feedback area.

## Data

Only one local record is saved:

```json
{ "date": "2026-06-13", "completed": 1 }
```

The app falls back to 0 if the record is missing, from another date, or corrupt. No account, backend, database, or API is used.

## Visual Completion

The Solar Dial motif is created with:

- warm yellow progress color.
- amber cockpit panel.
- circular dial.
- tabular countdown numerals.
- pressed mode state.
- immediate status and completion feedback.

The visual complexity serves the timer. It does not add heavy 3D, WebGL, or assets a beginner cannot reproduce.

## Testing Complexity

The production timer uses 25 minutes, which is too long for tests. The route supports a `testDuration` query for Playwright, while the pure logic accepts configurable durations for unit tests.
