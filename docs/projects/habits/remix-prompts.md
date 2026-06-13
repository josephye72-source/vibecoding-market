# Habit Grid Remix Prompts

## Light Remix

Prompt:

```text
Change Habit Grid into a water-drinking tracker. Keep the same date toggles, monthly count, streak feedback, and localStorage persistence.
```

Expected output:

- Water-specific copy.
- Same grid behavior.

Validation:

- Check a date.
- Refresh preserves it.

## Medium Remix

Prompt:

```text
Add optional notes for checked dates. A date can be checked without a note, but a note should persist when added.
```

Expected output:

- Note input or small editor.
- Data shape stores notes by date.

Validation:

- Add a note.
- Refresh and see it again.

## Deep Remix

Prompt:

```text
Support multiple habits by storing checked dates under habit names and adding a selector to switch the active habit.
```

Expected output:

- Habit selector.
- Separate data per habit.
- Same count and streak calculations for the active habit.

Validation:

- Check a date for habit A.
- Switch to habit B.
- Habit B starts empty.
