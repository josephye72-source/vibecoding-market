# Memory Cards Complexity Map

## Page Structure

The demo has three visible zones:

- Intro: project title and goal.
- HUD: moves, status feedback, restart.
- Board: 12 card buttons in a responsive grid.

## Interaction

The game loop is:

- Flip first card.
- Flip second card.
- If pair ids match, keep both cards open.
- If pair ids differ, show mismatch and close them.
- Restart creates a new board.

## State

The state tracks:

- cards with id, pair id, symbol, face-up, and matched flags.
- moves.
- feedback state.
- locked state during mismatch feedback.
- complete state after all pairs match.

## Data

No saved data is required. A new shuffled card array is created for each game. There is no backend, database, login, API, leaderboard, or comment system.

## Visual Completion

The Neon Arcade Lab motif uses:

- purple/pink glow.
- square card grid.
- face-down mystery state.
- bright face-up state.
- matched glow.
- immediate status feedback.

## Testing Complexity

Shuffle is random in the browser, so tests pass a fixed random function. This makes the rules predictable without making the real game predictable.
