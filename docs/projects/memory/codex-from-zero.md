# Memory Cards: Codex From Zero

## Project Goal

Build a pure web memory matching game with 12 cards, 6 pairs, shuffled order, flip feedback, match and mismatch states, move count, victory feedback, restart, and mouse/touch friendly controls.

## Preparation

- Start from an empty folder.
- Use plain HTML, CSS, and TypeScript or JavaScript.
- Do not add a backend, login, database, API, upload, leaderboard, or comments.
- Keep game rules in pure functions and DOM code in a separate renderer.

## From An Empty Folder

Create these files first:

- `index.html`: app root.
- `src/main.ts`: imports the renderer and starts the app.
- `src/demos/memory/logic.ts`: cards, shuffle, flip, match, mismatch, restart.
- `src/demos/memory/render.ts`: game board markup and event listeners.
- `src/styles/app.css`: Neon Arcade Lab styling.

## Starting Prompt

Prompt:

```text
Create a pure HTML/CSS/TypeScript memory card game from an empty folder. It must have 12 cards made from 6 pairs, shuffle each new game, flip two cards, show match and mismatch feedback, count moves, show victory feedback when all pairs are matched, and provide a restart button. Keep the game logic in pure functions and keep the UI beginner-readable.
```

Expected output:

- A runnable static web app.
- A 12-card board.
- Separate logic and rendering files.
- No backend or account code.

Validation:

- Open the page and see the goal, board, moves, and restart within 10 seconds.
- Flip two matching cards and see match feedback.
- Flip two nonmatching cards and see mismatch feedback.
- Finish all pairs and see victory feedback.

## Improvement Prompts

Prompt 1:

```text
Add a Neon Arcade Lab visual motif with purple and pink card glow, pressed card states, and a compact moves/status panel. Keep all cards touch-friendly.
```

Expected output:

- Neon arcade colors.
- Face-down, face-up, matched, and mismatch states are visually distinct.
- Cards remain usable on mobile.

Validation:

- Tap cards on a 390px wide viewport.
- Matched cards stay visible.
- Mismatch feedback appears immediately.

Prompt 2:

```text
Make restart create a fresh shuffled board and reset moves to 0 without reloading the page.
```

Expected output:

- Restart button calls the same game creation logic.
- Moves reset to 0.
- Card order changes.

Validation:

- Record the first board order.
- Click Restart.
- Confirm moves are 0 and order is different.

Prompt 3:

```text
Lock the board while mismatched cards are visible so the player cannot flip a third card during the feedback delay.
```

Expected output:

- Two mismatched cards stay open briefly.
- Other cards are temporarily disabled.
- Cards close after the delay.

Validation:

- Flip a mismatch.
- Try clicking a third card immediately.
- The third card does not open until feedback clears.

## Troubleshooting Prompts

Prompt 1:

```text
The same card can be clicked twice and counts as a match. Add a guard that ignores already open or matched cards.
```

Expected output:

- Clicking an open card does nothing.
- Move count only changes after two different cards are selected.

Validation:

- Click one card twice.
- Moves stay at 0.

Prompt 2:

```text
The board order is identical every game. Inspect the shuffle function and make sure restart creates a new shuffled copy instead of reusing the old array.
```

Expected output:

- Shuffle returns a new card array.
- Restart does not mutate stale state.

Validation:

- Restart several times.
- Card order changes.

Prompt 3:

```text
Victory appears too early. Check the win condition and only show victory when every card is marked matched.
```

Expected output:

- Match feedback appears for normal pairs.
- Victory appears only after the last pair.

Validation:

- Match one pair on a 12-card board.
- Victory is not shown.
- Match all pairs and victory is shown.

## Remix Prompts

Prompt 1:

```text
Remix this game into a color matching board. Replace text symbols with color swatches and keep the same match rules.
```

Expected output:

- Cards show colors when face-up.
- Matching is still based on pair id.

Validation:

- Matching colors stay open.
- Nonmatching colors close.

Prompt 2:

```text
Add a timer that starts on the first flip and shows how long the player took to win.
```

Expected output:

- Timer starts after the first card.
- Timer stops on victory.
- Restart clears the timer.

Validation:

- First flip starts the timer.
- Victory freezes the final time.

Prompt 3:

```text
Add difficulty levels for 6, 8, and 10 pairs while keeping the card creation and shuffle logic testable.
```

Expected output:

- A difficulty selector.
- Board size changes based on pair count.
- Logic still creates pairs from a symbol list.

Validation:

- Select each difficulty.
- Card count is twice the pair count.

## Running The Project

```powershell
npm install
npm run dev
```

Then open `/#/projects/memory-cards/demo`.

## Validation Checklist

- 12 cards and 6 pairs are present.
- Each game shuffles.
- Flip, match, mismatch, moves, victory, and restart work.
- Mouse and touch can operate cards.
- No backend, login, database, API, upload, leaderboard, or comments are added.
