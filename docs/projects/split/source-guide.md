# Split Console Source Guide

## Read These Files First

1. `src/demos/split/logic.ts`

   This file parses item amounts and participants, validates input, calculates totals, and builds the copyable summary.

2. `src/demos/split/render.ts`

   This file renders inputs, listens for changes, updates results, and handles the copy button.

3. `src/main.ts`

   This file mounts Split Console on `#/projects/split-console/demo`.

4. `src/styles/app.css`

   Search for `.split-demo`. This section owns the blue Split Console motif.

5. `src/demos/split/logic.test.ts`

   Read this file to understand expected calculations and invalid states.

## What Each Core File Does

- `logic.ts`: parse, validate, calculate, format, summarize.
- `render.ts`: DOM inputs, immediate recalculation, copy feedback.
- `main.ts`: route selection and mount.
- `app.css`: console layout, result emphasis, responsive controls.
- `site.spec.ts`: browser proof for valid, invalid, item, and copy flows.

## Beginner Edit Points

1. Change currency:

   Edit `formatSplitMoney` in `logic.ts`.

2. Change validation copy:

   Edit the error strings in `calculateSplit`.

3. Change summary wording:

   Edit `copyableSplitSummary` in `logic.ts`.

## Safe Change Rule

One result object should drive the visible total, per-person result, error, summary, and copy button state.
