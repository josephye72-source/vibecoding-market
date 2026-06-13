import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  LEDGER_CATEGORIES,
  LEDGER_STORAGE_KEY,
  addLedgerRecord,
  calculateLedgerStats,
  createLedgerState,
  deleteLedgerRecord,
  getLedgerEmptyState,
  loadLedgerRecords
} from "./logic";

describe("Tiny Ledger logic", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("offers at least three categories", () => {
    expect(LEDGER_CATEGORIES.length).toBeGreaterThanOrEqual(3);
  });

  it("adds income and expense records with amount, category, note, and date", () => {
    let state = createLedgerState();

    state = addLedgerRecord(state, {
      type: "income",
      amount: 1200,
      category: "Work",
      note: "Project payment",
      date: "2026-06-13"
    });
    state = addLedgerRecord(state, {
      type: "expense",
      amount: 42.5,
      category: "Food",
      note: "Lunch",
      date: "2026-06-13"
    });

    expect(state.records).toHaveLength(2);
    expect(state.records[0]).toMatchObject({
      amount: 1200,
      category: "Work",
      note: "Project payment",
      date: "2026-06-13"
    });
  });

  it("deletes records and recalculates income, expense, and balance", () => {
    let state = createLedgerState();
    state = addLedgerRecord(state, {
      type: "income",
      amount: 100,
      category: "Work",
      note: "Invoice",
      date: "2026-06-13"
    });
    state = addLedgerRecord(state, {
      type: "expense",
      amount: 35,
      category: "Food",
      note: "Dinner",
      date: "2026-06-13"
    });

    expect(calculateLedgerStats(state.records)).toEqual({
      income: 100,
      expense: 35,
      balance: 65
    });

    state = deleteLedgerRecord(state, state.records[1].id);

    expect(state.records).toHaveLength(1);
    expect(calculateLedgerStats(state.records)).toEqual({
      income: 100,
      expense: 0,
      balance: 100
    });
  });

  it("persists records in localStorage and survives refresh-style reload", () => {
    const state = addLedgerRecord(createLedgerState(), {
      type: "expense",
      amount: 18,
      category: "Transit",
      note: "Train",
      date: "2026-06-13"
    });

    expect(loadLedgerRecords()).toEqual(state.records);
    expect(createLedgerState().records).toEqual(state.records);
  });

  it("filters malformed stored records before rendering them", () => {
    localStorage.setItem(
      LEDGER_STORAGE_KEY,
      JSON.stringify([
        {
          id: "valid",
          type: "income",
          amount: 10,
          category: "Work",
          note: "Safe",
          date: "2026-06-13"
        },
        {
          id: "bad-negative",
          type: "expense",
          amount: -10,
          category: "Food",
          note: "Bad",
          date: "2026-06-13"
        },
        {
          id: "bad-type",
          type: "gift",
          amount: 10,
          category: "Other",
          note: "Bad",
          date: "2026-06-13"
        }
      ])
    );

    expect(loadLedgerRecords()).toEqual([
      {
        id: "valid",
        type: "income",
        amount: 10,
        category: "Work",
        note: "Safe",
        date: "2026-06-13"
      }
    ]);
  });

  it("keeps current add state and reports a warning when localStorage write fails", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota exceeded");
    });

    const state = addLedgerRecord(createLedgerState(), {
      type: "income",
      amount: 50,
      category: "Work",
      note: "Offline invoice",
      date: "2026-06-13"
    });

    expect(state.records).toHaveLength(1);
    expect(state.storageStatus).toBe("failed");
    expect(state.message).toBe("Record updated on screen, but it could not be saved in this browser.");
  });

  it("returns a clear empty state with a prompt and primary action", () => {
    expect(getLedgerEmptyState()).toEqual({
      message: "No records yet. Add your first income or expense to wake up the ledger.",
      actionLabel: "Add first record"
    });
  });
});
