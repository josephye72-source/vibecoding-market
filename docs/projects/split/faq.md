# Split Console FAQ

## 1. Why does the result show NaN?

Validate inputs before dividing and show `--` when the result is invalid.

## 2. Why does people count become 0?

Require at least one participant or a positive people count before calculating.

## 3. Why do item amounts not add up?

Parse commas, spaces, and new lines, then sum only positive finite numbers.

## 4. Why does changing inputs not update the result?

Listen for `input` events and recalculate from the current fields every time.

## 5. Why is the copied text stale?

Build the copy text from the same current result object used by the UI.

## 6. Why is invalid input still copyable?

Disable the copy button when the result is invalid.

## 7. Why is the tool slow to complete?

Keep the flow to three fields: total or items, participants, and copy summary.
