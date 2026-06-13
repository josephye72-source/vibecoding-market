# Tiny Ledger FAQ

## 1. Why do totals not update after adding a record?

Recalculate stats from the current records array after every add.

## 2. Why does delete remove the wrong record?

Delete by the record id, not by the visible row index.

## 3. Why do records disappear after refresh?

Make sure add and delete write the full records array to the same localStorage key that initial state reads.

## 4. Why does the empty state still show after adding a record?

Repaint the list after changing state. The empty state should render only when `records.length === 0`.

## 5. Why does a negative amount break the balance?

Validate that amount is a positive finite number before creating a record.

## 6. Why is the form hard to use on mobile?

Labels and inputs should stack, and every input/button should keep at least a 44px height.

## 7. Why does corrupt localStorage crash the app?

Wrap JSON parsing in `try/catch` and fall back to `[]`.
