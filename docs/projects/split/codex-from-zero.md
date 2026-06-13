# Split Console: Codex From Zero

## Project Goal

Build a pure web split calculator that accepts a total or multiple item amounts, accepts people or participants, calculates per-person result immediately, generates a copyable summary, and blocks invalid input with a visible message.

## Preparation

- Start from an empty folder.
- Use plain HTML, CSS, and TypeScript or JavaScript.
- Do not add backend, login, database, API, payment, upload, leaderboard, or comments.
- Keep calculation and validation in pure functions.

## From An Empty Folder

Create these files first:

- `index.html`: app root.
- `src/main.ts`: imports the renderer and starts the app.
- `src/demos/split/logic.ts`: parsing, validation, calculation, summary.
- `src/demos/split/render.ts`: inputs, result panel, copy button.
- `src/styles/app.css`: Split Console visual motif.

## Starting Prompt

Prompt:

```text
Create a pure HTML/CSS/TypeScript split calculator from an empty folder. It must accept either a total amount or multiple item amounts, accept people or participant names, calculate the per-person result immediately when inputs change, generate a copyable summary, and show an invalid input message while blocking wrong results. Keep calculation logic in pure functions.
```

Expected output:

- A runnable static web app.
- Inputs for total, items, and participants.
- A result area with total, per-person amount, error, summary, and copy button.

Validation:

- Enter 120 and three participants.
- See 40 per person immediately.
- Enter invalid input and see an error with no wrong result.
- Copy the valid summary.

## Improvement Prompts

Prompt 1:

```text
Add a Split Console visual motif with blue console panels, numeric result emphasis, and compact controls that can be completed in under one minute.
```

Expected output:

- Blue console styling.
- Immediate result is visually prominent.

Validation:

- User can complete one split with three fields.
- Mobile layout remains usable.

Prompt 2:

```text
Add item parsing so users can enter amounts separated by commas, spaces, or new lines.
```

Expected output:

- `12, 8` and `12\n8` both work.
- Positive numbers are summed.

Validation:

- Enter three item values.
- Result total equals their sum.

Prompt 3:

```text
Make the copy button disabled until a valid result exists and show feedback after copying.
```

Expected output:

- Copy button is blocked for invalid result.
- Copy status appears after click.

Validation:

- Invalid input disables copy.
- Valid input enables copy and shows copied feedback.

## Troubleshooting Prompts

Prompt 1:

```text
The result shows NaN. Validate total/items and participants before dividing, and display -- when the result is invalid.
```

Expected output:

- No NaN is visible.
- Error explains what to fix.

Validation:

- Leave inputs empty.
- See placeholders, not NaN.

Prompt 2:

```text
Changing inputs does not update the result. Listen for input events on the form and recalculate from current field values each time.
```

Expected output:

- Result updates immediately.
- No submit button is required.

Validation:

- Type 120, then change it to 90.
- Per-person amount updates.

Prompt 3:

```text
The summary copies stale text. Generate the copyable summary from the same result object that is currently displayed.
```

Expected output:

- Summary and visible result match.
- Copy uses the current summary.

Validation:

- Change participants.
- Copy summary.
- Copied text includes the latest participants.

## Remix Prompts

Prompt 1:

```text
Remix Split Console for a lunch table by changing the copy to mention lunch and keeping the same total, participants, validation, and copy behavior.
```

Expected output:

- Lunch-specific summary copy.
- Same calculation.

Validation:

- Enter a lunch total and participants.
- Summary is lunch-themed.

Prompt 2:

```text
Add tip percentage input. Calculate total plus tip before splitting, and include the tip in the copyable summary.
```

Expected output:

- Tip input.
- Adjusted total and per-person result.

Validation:

- 100 total, 20% tip, 3 people gives 40 each.

Prompt 3:

```text
Add uneven split weights, where each participant can have a weight like 1x or 2x. Keep validation clear and show each participant's share.
```

Expected output:

- Weighted participants.
- Per-person rows.
- Clear invalid input messages.

Validation:

- One 2x participant pays double a 1x participant.

## Running The Project

```powershell
npm install
npm run dev
```

Then open `/#/projects/split-console/demo`.

## Validation Checklist

- Total or multiple items can be entered.
- People or participants can be entered.
- Result updates immediately.
- Summary is copyable.
- Invalid input shows a message and blocks wrong results.
- One split can be completed in under one minute.
