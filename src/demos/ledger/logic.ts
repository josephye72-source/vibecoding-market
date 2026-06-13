export type LedgerRecordType = "income" | "expense";

export type LedgerRecord = {
  id: string;
  type: LedgerRecordType;
  amount: number;
  category: string;
  note: string;
  date: string;
};

export type LedgerInput = Omit<LedgerRecord, "id">;

export type LedgerState = {
  records: LedgerRecord[];
  storageStatus: "saved" | "failed" | "idle";
  message: string;
};

export type LedgerStats = {
  income: number;
  expense: number;
  balance: number;
};

export const LEDGER_STORAGE_KEY = "vcm:ledger:records";
export const LEDGER_CATEGORIES = ["Work", "Food", "Transit", "Home"];

function safeRecords(value: unknown): LedgerRecord[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (record): record is LedgerRecord =>
      typeof record === "object" &&
      record !== null &&
      typeof (record as LedgerRecord).id === "string" &&
      ((record as LedgerRecord).type === "income" || (record as LedgerRecord).type === "expense") &&
      typeof (record as LedgerRecord).amount === "number" &&
      Number.isFinite((record as LedgerRecord).amount) &&
      (record as LedgerRecord).amount > 0 &&
      typeof (record as LedgerRecord).category === "string" &&
      typeof (record as LedgerRecord).note === "string" &&
      typeof (record as LedgerRecord).date === "string"
  );
}

export function loadLedgerRecords(): LedgerRecord[] {
  try {
    return safeRecords(JSON.parse(localStorage.getItem(LEDGER_STORAGE_KEY) ?? "[]"));
  } catch {
    return [];
  }
}

export function saveLedgerRecords(records: LedgerRecord[]): boolean {
  try {
    localStorage.setItem(LEDGER_STORAGE_KEY, JSON.stringify(records));
    return true;
  } catch {
    return false;
  }
}

export function createLedgerState(): LedgerState {
  return {
    records: loadLedgerRecords(),
    storageStatus: "idle",
    message: ""
  };
}

export function addLedgerRecord(state: LedgerState, input: LedgerInput): LedgerState {
  const amount = Math.max(0, Number(input.amount));

  if (!Number.isFinite(amount) || amount <= 0) {
    return state;
  }

  const record: LedgerRecord = {
    id: `ledger-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    type: input.type,
    amount,
    category: input.category,
    note: input.note.trim() || "Untitled record",
    date: input.date
  };
  const nextState = {
    records: [...state.records, record]
  };

  const saved = saveLedgerRecords(nextState.records);
  return {
    ...nextState,
    storageStatus: saved ? "saved" : "failed",
    message: saved ? "Record saved in this browser." : "Record updated on screen, but it could not be saved in this browser."
  };
}

export function deleteLedgerRecord(state: LedgerState, recordId: string): LedgerState {
  const nextState = {
    records: state.records.filter((record) => record.id !== recordId)
  };

  const saved = saveLedgerRecords(nextState.records);
  return {
    ...nextState,
    storageStatus: saved ? "saved" : "failed",
    message: saved ? "Record deleted and saved." : "Record updated on screen, but it could not be saved in this browser."
  };
}

export function calculateLedgerStats(records: LedgerRecord[]): LedgerStats {
  return records.reduce<LedgerStats>(
    (stats, record) => {
      if (record.type === "income") {
        stats.income += record.amount;
      } else {
        stats.expense += record.amount;
      }

      stats.balance = stats.income - stats.expense;
      return stats;
    },
    { income: 0, expense: 0, balance: 0 }
  );
}

export function getLedgerEmptyState(): { message: string; actionLabel: string } {
  return {
    message: "No records yet. Add your first income or expense to wake up the ledger.",
    actionLabel: "Add first record"
  };
}
