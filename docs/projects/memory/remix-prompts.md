# Memory Cards Remix Prompts

## Light Remix

Prompt:

```text
Change the Memory Cards symbols to a cooking theme with six pairs. Keep shuffle, moves, match, mismatch, victory, and restart behavior the same.
```

Expected output:

- New symbols.
- Same game rules.

Validation:

- 12 cards still render.
- Matching still works by pair id.

## Medium Remix

Prompt:

```text
Add a best-moves record in localStorage. Show the lowest completed move count and update it only when the player wins with fewer moves.
```

Expected output:

- A saved best score.
- Refresh keeps the best score.

Validation:

- Win once and see best moves.
- Refresh and confirm it remains.

## Deep Remix

Prompt:

```text
Add difficulty levels for 6, 8, and 10 pairs. Keep the board responsive and keep all matching logic in pure functions.
```

Expected output:

- Difficulty selector.
- Dynamic card count.
- Tests for each pair count.

Validation:

- Each difficulty renders the correct number of cards.
- Victory works on every difficulty.
