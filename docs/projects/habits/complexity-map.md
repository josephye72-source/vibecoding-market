# Habit Grid Complexity Map

## Page Structure

The demo has three zones:

- Intro: project title and goal.
- Summary: month label, monthly count, streak, feedback.
- Grid: one button per date in the current month.

## Interaction

The user toggles a date:

- Unchecked becomes checked.
- Checked becomes unchecked.
- Stats update immediately.
- The checked array is saved.

## State

State contains:

- year.
- month index.
- today key.
- checked date keys.
- generated day objects.

## Data

Only checked date keys are saved in localStorage. There is no account, backend, database, API, upload, leaderboard, or comments.

## Visual Completion

Growth Grid uses:

- green grid lines.
- square date rhythm.
- today outline.
- checked green fill.
- monthly and streak feedback.

## Testing Complexity

Dates can be difficult because today's date changes. Tests pass a fixed year, month, and today key to keep expectations stable.
