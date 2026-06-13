# Tiny Ledger Remix Prompts

## Light Remix

Prompt:

```text
Change Tiny Ledger into a coffee budget tracker with categories Beans, Snacks, Gear, and Tips. Keep add, delete, stats, and localStorage behavior.
```

Expected output:

- Coffee-specific categories.
- Same ledger loop.

Validation:

- Add one record in each category.
- Stats update.

## Medium Remix

Prompt:

```text
Add a category filter that changes which rows are visible but keeps income, expense, and balance based on all records.
```

Expected output:

- Filter control.
- List changes by category.
- Stats do not change when filtering.

Validation:

- Add records in two categories.
- Filter one category.
- Stats remain based on all records.

## Deep Remix

Prompt:

```text
Add monthly summaries by grouping records by their date month. Show monthly income, expense, and balance above each group.
```

Expected output:

- Grouped record sections.
- Derived monthly stats.

Validation:

- Add records in two months.
- Both month groups appear with correct subtotals.
