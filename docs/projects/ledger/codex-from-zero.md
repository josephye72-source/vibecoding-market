# Tiny Ledger: Codex From Zero

## Project Goal

Build a pure web ledger that adds income and expense records, stores amount/category/note/date, provides at least three categories, deletes records, shows income/expense/balance stats, persists in `localStorage`, and has a clear empty state.

## Preparation

- Start from an empty folder.
- Use plain HTML, CSS, and TypeScript or JavaScript.
- Do not add a backend, login, database, API, payment, upload, leaderboard, or comments.
- Keep record calculations in pure functions.

## From An Empty Folder

Create these files first:

- `index.html`: app root.
- `src/main.ts`: imports the renderer and starts the app.
- `src/demos/ledger/logic.ts`: record shape, add, delete, stats, storage.
- `src/demos/ledger/render.ts`: form, list, empty state, and totals.
- `src/styles/app.css`: Receipt Ledger visual motif.

## Starting Prompt

Prompt:

```text
Create a pure HTML/CSS/TypeScript local ledger from an empty folder. It must add income and expense records with amount, category, note, and date; include at least three categories; delete records; show income, expense, and balance; persist records in localStorage; and show a clear empty state with a primary action. Keep calculations in pure functions.
```

Expected output:

- A runnable static web app.
- A labeled form.
- A stats area.
- A record list with delete buttons.

Validation:

- Add one income and one expense.
- See at least two stats update immediately.
- Delete a record and see stats update.
- Refresh and confirm records remain.

## Improvement Prompts

Prompt 1:

```text
Add a Receipt Ledger motif with soft green paper, receipt-like rows, and clear positive/negative amount styling.
```

Expected output:

- Ledger paper look.
- Income and expense are easy to distinguish.

Validation:

- Empty state, form, stats, and list fit on mobile.
- Buttons remain at least 44px tall.

Prompt 2:

```text
Add localStorage safety. If saved records are missing or corrupt, show an empty ledger instead of crashing.
```

Expected output:

- Safe parsing.
- Empty fallback.

Validation:

- Put invalid JSON in the storage key.
- Reload the page.
- The app opens with the empty state.

Prompt 3:

```text
After adding a record, reset the form while keeping the date set to today.
```

Expected output:

- Amount and note clear.
- Date remains usable.

Validation:

- Add a record.
- The next record can be entered immediately.

## Troubleshooting Prompts

Prompt 1:

```text
The totals do not change after deleting a record. Recalculate stats from the new record array after every add or delete.
```

Expected output:

- Delete updates list and totals.

Validation:

- Add income and expense.
- Delete expense.
- Balance equals income.

Prompt 2:

```text
Refresh removes every record. Check that add and delete both write the full records array to localStorage and initial state reads the same key.
```

Expected output:

- One shared storage key.
- Initial render reads saved records.

Validation:

- Add a record.
- Refresh.
- The record remains.

Prompt 3:

```text
Negative amounts break the balance. Validate the amount and ignore records that are not positive numbers.
```

Expected output:

- Invalid amounts are not added.
- Stats remain stable.

Validation:

- Try adding `-5`.
- Record count does not change.

## Remix Prompts

Prompt 1:

```text
Remix Tiny Ledger for travel spending by changing categories to Food, Transit, Hotel, and Tickets.
```

Expected output:

- New categories.
- Same add/delete/stat behavior.

Validation:

- Each category can be selected.

Prompt 2:

```text
Add a category filter above the record list while keeping stats based on all records.
```

Expected output:

- Filtered visible list.
- Totals still reflect all records.

Validation:

- Add records in two categories.
- Filter one category.
- Stats remain unchanged.

Prompt 3:

```text
Add monthly grouping by record date. Show each month with its own income, expense, and balance.
```

Expected output:

- Records grouped by month.
- Monthly subtotals.

Validation:

- Add two dates in different months.
- Two month sections appear.

## Running The Project

```powershell
npm install
npm run dev
```

Then open `/#/projects/tiny-ledger/demo`.

## Validation Checklist

- Add income and expense records.
- Each record has amount, category, note, and date.
- At least three categories exist.
- Delete works.
- Income, expense, and balance update.
- Records persist after refresh.
- Empty state has helpful copy and a primary action.
