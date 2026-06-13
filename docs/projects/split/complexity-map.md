# Split Console Complexity Map

## Page Structure

The demo has three zones:

- Intro: what to enter.
- Inputs: total, item amounts, participants.
- Result: error, total, per-person result, summary, copy.

## Interaction

The user can:

- Enter a direct total.
- Enter item amounts instead.
- Enter participant names.
- See results update immediately.
- Copy the summary.

## State

No long-term state is needed. Current input values produce a current result object.

## Data

All data stays in the page. There is no backend, database, payment, account, API, upload, leaderboard, or comments.

## Visual Completion

Split Console uses:

- blue console panels.
- numeric emphasis.
- visible invalid state.
- copy feedback.
- compact layout for under-one-minute completion.

## Testing Complexity

Invalid states matter as much as valid states. Tests confirm bad inputs show an error and do not display a wrong per-person result.
