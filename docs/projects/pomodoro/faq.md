# Focus Pomodoro FAQ

## 1. Why does the timer keep running after Pause?

The interval was probably not cleared. Pause should call the logic function that changes status to `paused`, then clear the browser interval.

## 2. Why does the completed count disappear after refresh?

Check that completion writes to `localStorage` and initial state reads from the same key. Also check that the saved date matches today's date.

## 3. Why does corrupt localStorage crash the page?

Wrap JSON parsing in a `try/catch` and return `{ date: today, completed: 0 }` when parsing fails.

## 4. Why does progress move in the wrong direction?

Use elapsed progress: `(totalSeconds - remainingSeconds) / totalSeconds`. The countdown should go down, but the progress feedback should fill up.

## 5. Why does Start create two timers?

Starting twice can create duplicate intervals if the renderer does not clear the old interval first. Keep one interval id and clear it before starting a new one.

## 6. Why does Break completion increase the focus count?

Only focus sessions should increment today's completed count. Break mode can show completion feedback without changing the record.

## 7. Why is the timer hard to use on mobile?

Check that buttons are at least 44px tall, the layout becomes one column on narrow screens, and the countdown text does not overflow the dial.
