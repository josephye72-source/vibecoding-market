# Focus Pomodoro Remix Prompts

## Light Remix

Prompt:

```text
Change the Focus Pomodoro into a 15-minute reading timer. Keep the same start, pause, reset, progress, completion feedback, and localStorage count.
```

Expected output:

- Focus duration becomes 15 minutes.
- Copy mentions reading.
- The same tests still pass after duration expectations are updated.

Validation:

- Start works.
- Completion increments today's count.
- Refresh preserves the count.

## Medium Remix

Prompt:

```text
Add a task name field above the Pomodoro controls. The current task name should appear in the completion message, but the timer must still work if the field is empty.
```

Expected output:

- A labeled text input.
- Completion message includes the task name when present.
- Empty task name falls back to a generic message.

Validation:

- Input has a visible label.
- Starting the timer does not require typing.
- Completion feedback remains clear.

## Deep Remix

Prompt:

```text
Turn the Pomodoro into a 7-day focus tracker. Store completed focus counts by date in localStorage and render a small weekly strip under the timer.
```

Expected output:

- Data shape supports multiple dates.
- Weekly strip shows 7 local days.
- Today's completion updates the strip immediately.

Validation:

- Completing a focus session changes today's count.
- Refresh preserves the weekly strip.
- Corrupt storage still falls back safely.
