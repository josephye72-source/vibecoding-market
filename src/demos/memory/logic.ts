export type MemoryFeedback = "ready" | "first" | "match" | "mismatch" | "win";

export type MemoryCard = {
  id: string;
  pairId: string;
  symbol: string;
  isFaceUp: boolean;
  isMatched: boolean;
};

export type MemoryState = {
  cards: MemoryCard[];
  moves: number;
  feedback: MemoryFeedback;
  isLocked: boolean;
  isComplete: boolean;
  symbols: string[];
};

export type MemoryOptions = {
  symbols?: string[];
  random?: () => number;
};

export const DEFAULT_MEMORY_SYMBOLS = ["01", "10", "</>", "{}", "=>", "[]"];

function shuffleCards(cards: MemoryCard[], random: () => number): MemoryCard[] {
  const shuffled = [...cards];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

export function createMemoryGame(options: MemoryOptions = {}): MemoryState {
  const symbols = (options.symbols ?? DEFAULT_MEMORY_SYMBOLS).slice(0, 6);
  const random = options.random ?? Math.random;
  const cards = symbols.flatMap((symbol, pairIndex) => [
    {
      id: `${symbol}-${pairIndex}-a`,
      pairId: `${pairIndex}`,
      symbol,
      isFaceUp: false,
      isMatched: false
    },
    {
      id: `${symbol}-${pairIndex}-b`,
      pairId: `${pairIndex}`,
      symbol,
      isFaceUp: false,
      isMatched: false
    }
  ]);

  return {
    cards: shuffleCards(cards, random),
    moves: 0,
    feedback: "ready",
    isLocked: false,
    isComplete: false,
    symbols
  };
}

export function getOpenUnmatchedCards(state: MemoryState): MemoryCard[] {
  return state.cards.filter((card) => card.isFaceUp && !card.isMatched);
}

export function clearMismatchedCards(state: MemoryState): MemoryState {
  if (state.feedback !== "mismatch") {
    return state;
  }

  return {
    ...state,
    cards: state.cards.map((card) =>
      card.isMatched ? card : { ...card, isFaceUp: false }
    ),
    feedback: "ready",
    isLocked: false
  };
}

export function flipMemoryCard(state: MemoryState, cardId: string): MemoryState {
  if (state.isLocked || state.isComplete) {
    return state;
  }

  const selected = state.cards.find((card) => card.id === cardId);

  if (!selected || selected.isFaceUp || selected.isMatched) {
    return state;
  }

  const openCards = getOpenUnmatchedCards(state);

  if (openCards.length >= 2) {
    return state;
  }

  const cards = state.cards.map((card) =>
    card.id === cardId ? { ...card, isFaceUp: true } : card
  );

  if (openCards.length === 0) {
    return {
      ...state,
      cards,
      feedback: "first"
    };
  }

  const first = openCards[0];
  const isMatch = first.pairId === selected.pairId;
  const nextMoves = state.moves + 1;

  if (!isMatch) {
    return {
      ...state,
      cards,
      moves: nextMoves,
      feedback: "mismatch",
      isLocked: true
    };
  }

  const matchedCards = cards.map((card) =>
    card.pairId === selected.pairId ? { ...card, isMatched: true, isFaceUp: true } : card
  );
  const isComplete = matchedCards.every((card) => card.isMatched);

  return {
    ...state,
    cards: matchedCards,
    moves: nextMoves,
    feedback: isComplete ? "win" : "match",
    isComplete
  };
}

export function restartMemoryGame(
  state: MemoryState,
  options: Pick<MemoryOptions, "random"> = {}
): MemoryState {
  return createMemoryGame({
    symbols: state.symbols,
    random: options.random
  });
}
