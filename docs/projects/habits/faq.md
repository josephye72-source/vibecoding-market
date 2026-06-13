# Habit Grid FAQ

## 1. Why is today highlighted on the wrong square?

Use one date-key function everywhere and compare keys like `2026-06-13`.

## 2. Why does a checked date disappear after refresh?

Make toggle save the updated checked date array and initial state read from the same localStorage key.

## 3. Why is the streak wrong when there is a gap?

Count backward from today and stop as soon as a date is not checked.

## 4. Why does the monthly count include another month?

Count only dates that are present in the generated current month grid.

## 5. Why do buttons overflow on mobile?

Use a 7-column grid with small gaps and square buttons that can shrink inside the container.

## 6. Why does corrupt storage break the page?

Wrap JSON parsing in `try/catch` and fall back to an empty array.

## 7. Why is checked state hard to see?

Use more than color when possible: filled background, border, and `aria-pressed`.
