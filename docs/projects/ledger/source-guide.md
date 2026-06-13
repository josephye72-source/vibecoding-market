# Tiny Ledger Source Guide

## Read These Files First

1. `src/demos/ledger/logic.ts`

   This file defines the record shape, categories, add/delete behavior, totals, and localStorage handling.

2. `src/demos/ledger/render.ts`

   This file renders the form, stats, empty state, and record list.

3. `src/main.ts`

   This file mounts Tiny Ledger on `#/projects/tiny-ledger/demo`.

4. `src/styles/app.css`

   Search for `.ledger-demo`. This section owns the Receipt Ledger motif.

5. `src/demos/ledger/logic.test.ts`

   Read this file to see the required ledger behaviors.

## What Each Core File Does

- `logic.ts`: data shape, storage, stats, add, delete.
- `render.ts`: DOM form, FormData reading, list updates.
- `main.ts`: route selection and mount.
- `app.css`: ledger paper, receipt rows, form controls.
- `site.spec.ts`: browser proof for add, delete, refresh, and empty state.

## Beginner Edit Points

1. Change categories:

   Edit `LEDGER_CATEGORIES` in `logic.ts`.

2. Change empty copy:

   Edit `getLedgerEmptyState` in `logic.ts`.

3. Change money display:

   Edit `formatMoney` in `render.ts`.

## Build Tool And Running

This project uses Vite as a lightweight static frontend dev/build tool. For a beginner, Vite is the small helper that opens the app in a local browser, reloads when files change, and packages the plain web files for publishing.

Run locally:

```powershell
npm install
npm run dev
```

Then open the local URL and visit `/#/projects/tiny-ledger/demo`.

Build/check before sharing:

```powershell
npm run build
```

That command type-checks the TypeScript and creates a static `dist/` build.

## Safe Change Rule

The form collects data. Logic changes the record array. Stats are always calculated from records, not stored separately.
