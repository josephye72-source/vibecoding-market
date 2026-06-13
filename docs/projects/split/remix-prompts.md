# Split Console Remix Prompts

## Light Remix

Prompt:

```text
Change Split Console into a pizza split calculator. Keep total/items, participants, immediate result, invalid input, and copy summary behavior.
```

Expected output:

- Pizza-themed copy.
- Same calculation.

Validation:

- Enter total and participants.
- Per-person amount updates.

## Medium Remix

Prompt:

```text
Add a tip percentage field. The app should split total plus tip and include the tip percentage in the summary.
```

Expected output:

- Tip input.
- Adjusted total.
- Updated summary.

Validation:

- 100 with 20% tip and 3 people gives 40 each.

## Deep Remix

Prompt:

```text
Add weighted participants so someone can pay 2 shares while others pay 1 share. Show each participant's amount.
```

Expected output:

- Participant rows with weights.
- Per-participant result list.
- Validation for positive weights.

Validation:

- A 2x participant pays twice the 1x amount.
