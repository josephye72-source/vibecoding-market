export type ItemAmountParseResult = {
  amounts: number[];
  error: string | null;
  hasInput: boolean;
};

export type SplitInput = {
  total?: number | null;
  itemAmounts?: number[] | ItemAmountParseResult;
  people?: number | null;
  participants?: string[];
};

export type SplitResult = {
  isValid: boolean;
  total: number | null;
  people: number | null;
  perPerson: number | null;
  participants: string[];
  error: string | null;
};

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

export const INVALID_ITEM_AMOUNT_MESSAGE =
  "Fix item amounts before calculating. Use positive numbers only.";

export function parseItemAmounts(value: string): ItemAmountParseResult {
  const tokens = value
    .split(/[\s,]+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (tokens.length === 0) {
    return {
      amounts: [],
      error: null,
      hasInput: false
    };
  }

  const amounts = tokens.map((token) => Number(token));
  const hasInvalidAmount = amounts.some((amount) => !Number.isFinite(amount) || amount <= 0);

  if (hasInvalidAmount) {
    return {
      amounts: [],
      error: INVALID_ITEM_AMOUNT_MESSAGE,
      hasInput: true
    };
  }

  return {
    amounts,
    error: null,
    hasInput: true
  };
}

export function parseParticipants(value: string): string[] {
  return value
    .split(/[,\n]+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function calculateSplit(input: SplitInput): SplitResult {
  const itemInput = Array.isArray(input.itemAmounts)
    ? { amounts: input.itemAmounts, error: null, hasInput: input.itemAmounts.length > 0 }
    : input.itemAmounts;

  if (itemInput?.error) {
    return {
      isValid: false,
      total: null,
      people: null,
      perPerson: null,
      participants: input.participants?.filter(Boolean) ?? [],
      error: itemInput.error
    };
  }

  const itemTotal = (itemInput?.amounts ?? []).reduce((sum, amount) => sum + amount, 0);
  const directTotal = Number(input.total);
  const total = Number.isFinite(directTotal) && directTotal > 0 ? directTotal : itemTotal;
  const participants = input.participants?.filter(Boolean) ?? [];
  const people = participants.length > 0 ? participants.length : Number(input.people);

  if (!Number.isFinite(total) || total <= 0) {
    return {
      isValid: false,
      total: null,
      people: Number.isFinite(people) ? people : null,
      perPerson: null,
      participants,
      error: "Enter a positive total or at least one positive item."
    };
  }

  if (!Number.isFinite(people) || people < 1) {
    return {
      isValid: false,
      total: roundMoney(total),
      people: null,
      perPerson: null,
      participants,
      error: "Enter at least one participant."
    };
  }

  return {
    isValid: true,
    total: roundMoney(total),
    people,
    perPerson: roundMoney(total / people),
    participants,
    error: null
  };
}

export function formatSplitMoney(value: number): string {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    style: "currency"
  }).format(value);
}

export function copyableSplitSummary(result: SplitResult): string {
  if (!result.isValid || result.total === null || result.perPerson === null || result.people === null) {
    return "";
  }

  const who =
    result.participants.length > 0 ? result.participants.join(", ") : `${result.people} people`;

  return `Split ${formatSplitMoney(result.total)} between ${who}: ${formatSplitMoney(result.perPerson)} each.`;
}
