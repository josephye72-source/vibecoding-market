# Tiny Ledger Complexity Map

## Page Structure

The demo has four zones:

- Intro: what the ledger does.
- Form: type, amount, category, note, date.
- Stats: income, expense, balance.
- Records: empty state or record rows.

## Interaction

The user can:

- Add an income record.
- Add an expense record.
- Delete a record.
- Refresh and see records persist.

## State

The main state is one record array. Each record has id, type, amount, category, note, and date.

## Data

Records are saved to one localStorage key. Invalid or corrupt storage falls back to an empty array. No backend, database, payment, account, or API exists.

## Visual Completion

Receipt Ledger uses:

- green paper surface.
- receipt-like rows.
- compact stats.
- clear empty state.
- positive and negative amount cues.

## Testing Complexity

Stats are derived data. Tests add and delete records, then recalculate income, expense, and balance from the record array.
