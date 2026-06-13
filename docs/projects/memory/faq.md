# Memory Cards FAQ

## 1. Why can I click the same card twice?

Ignore clicks on cards that are already face-up or already matched.

## 2. Why do mismatched cards stay open forever?

After a mismatch, schedule a short timeout that calls the function that clears unmatched face-up cards.

## 3. Why can I flip a third card during mismatch feedback?

Use a locked state while the mismatch is visible. The renderer can disable cards until the timeout clears.

## 4. Why is the order the same after restart?

Make restart create a new shuffled card array. Do not reuse the previous card order.

## 5. Why does the move count increase too often?

Only increase moves after the second card in a pair attempt is flipped.

## 6. Why does victory appear before the final pair?

Only set victory when every card has `isMatched: true`.

## 7. Why are cards hard to tap on mobile?

Keep card buttons large enough, use a responsive grid, and avoid tiny text-only click targets.
