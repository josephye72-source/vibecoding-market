import { describe, expect, it } from "vitest";
import {
  clearMismatchedCards,
  createMemoryGame,
  flipMemoryCard,
  restartMemoryGame
} from "./logic";

const symbols = ["A", "B", "C", "D", "E", "F"];

function fixedRandom(values: number[]): () => number {
  let index = 0;
  return () => values[index++ % values.length];
}

describe("Memory Cards logic", () => {
  it("creates 12 shuffled cards from 6 pairs", () => {
    const first = createMemoryGame({ symbols, random: fixedRandom([0.1, 0.7, 0.2, 0.8]) });
    const second = createMemoryGame({ symbols, random: fixedRandom([0.8, 0.2, 0.7, 0.1]) });

    expect(first.cards).toHaveLength(12);
    expect(new Set(first.cards.map((card) => card.pairId)).size).toBe(6);
    expect(first.cards.map((card) => card.pairId)).not.toEqual(second.cards.map((card) => card.pairId));
  });

  it("flips two matching cards, counts a move, and leaves them matched", () => {
    let state = createMemoryGame({ symbols, random: fixedRandom([0]) });
    const [first, second] = state.cards.filter((card) => card.pairId === state.cards[0].pairId);

    state = flipMemoryCard(state, first.id);
    state = flipMemoryCard(state, second.id);

    expect(state.moves).toBe(1);
    expect(state.feedback).toBe("match");
    expect(state.cards.filter((card) => card.isMatched)).toHaveLength(2);
  });

  it("shows mismatch feedback and clears only the unmatched open cards", () => {
    let state = createMemoryGame({ symbols, random: fixedRandom([0]) });
    const first = state.cards[0];
    const second = state.cards.find((card) => card.pairId !== first.pairId);

    expect(second).toBeDefined();

    state = flipMemoryCard(state, first.id);
    state = flipMemoryCard(state, second!.id);

    expect(state.moves).toBe(1);
    expect(state.feedback).toBe("mismatch");
    expect(state.cards.filter((card) => card.isFaceUp)).toHaveLength(2);

    state = clearMismatchedCards(state);

    expect(state.feedback).toBe("ready");
    expect(state.cards.filter((card) => card.isFaceUp)).toHaveLength(0);
  });

  it("shows victory feedback when every pair is matched", () => {
    let state = createMemoryGame({ symbols: ["A"], random: fixedRandom([0]) });
    const [first, second] = state.cards;

    state = flipMemoryCard(state, first.id);
    state = flipMemoryCard(state, second.id);

    expect(state.feedback).toBe("win");
    expect(state.isComplete).toBe(true);
  });

  it("restarts with a fresh shuffled board and resets score", () => {
    let state = createMemoryGame({ symbols, random: fixedRandom([0]) });
    const previousOrder = state.cards.map((card) => card.id);

    state = flipMemoryCard(state, state.cards[0].id);
    const restarted = restartMemoryGame(state, { random: fixedRandom([0.9, 0.1, 0.8, 0.2]) });

    expect(restarted.moves).toBe(0);
    expect(restarted.feedback).toBe("ready");
    expect(restarted.cards.map((card) => card.id)).not.toEqual(previousOrder);
  });
});
