import {
  clearMismatchedCards,
  createMemoryGame,
  flipMemoryCard,
  restartMemoryGame,
  type MemoryFeedback,
  type MemoryState
} from "./logic";

declare global {
  interface Window {
    __VCM_MEMORY_TEST_ORDER__?: string[];
  }
}

const feedbackCopy: Record<MemoryFeedback, string> = {
  ready: "Flip two cards to find a pair.",
  first: "Pick one more card.",
  match: "Match found.",
  mismatch: "Not a match. Try again.",
  win: "All pairs matched. You cleared the lab."
};

export function renderMemoryDemo(): string {
  return `
    <section class="memory-demo" data-testid="memory-demo" aria-labelledby="memory-title">
      <div class="demo-intro">
        <p class="project-detail__motif">Neon Arcade Lab / Memory Cards</p>
        <h1 id="memory-title">Memory Cards</h1>
        <p class="project-detail__lede">Flip cards, catch pairs, and restart with a fresh shuffled board.</p>
      </div>
      <div class="memory-shell">
        <div class="memory-hud">
          <div>
            <span>Moves</span>
            <strong data-testid="memory-moves">0</strong>
          </div>
          <p role="status" aria-live="polite" data-memory-feedback>${feedbackCopy.ready}</p>
          <button class="button button--primary" type="button" data-memory-restart>Restart game</button>
        </div>
        <div class="memory-grid" data-memory-grid aria-label="Memory card grid"></div>
      </div>
    </section>
  `;
}

export function mountMemoryDemo(): () => void {
  const root = document.querySelector<HTMLElement>("[data-testid='memory-demo']");

  if (!root) {
    return () => undefined;
  }

  const grid = root.querySelector<HTMLElement>("[data-memory-grid]");
  const moves = root.querySelector<HTMLElement>("[data-testid='memory-moves']");
  const feedback = root.querySelector<HTMLElement>("[data-memory-feedback]");
  const restart = root.querySelector<HTMLButtonElement>("[data-memory-restart]");
  const testOrder =
    import.meta.env.DEV && Array.isArray(window.__VCM_MEMORY_TEST_ORDER__)
      ? window.__VCM_MEMORY_TEST_ORDER__
      : undefined;
  let state = createMemoryGame({ orderedSymbols: testOrder });
  let mismatchTimer: number | undefined;

  function clearTimer(): void {
    if (mismatchTimer !== undefined) {
      window.clearTimeout(mismatchTimer);
      mismatchTimer = undefined;
    }
  }

  function paint(): void {
    if (!grid) {
      return;
    }

    grid.innerHTML = state.cards
      .map(
        (card) => `
          <button
            class="memory-card${card.isFaceUp ? " is-face-up" : ""}${card.isMatched ? " is-matched" : ""}"
            type="button"
            data-testid="memory-card"
            data-memory-card="${card.id}"
            aria-label="${card.isFaceUp || card.isMatched ? `Card ${card.symbol}` : "Hidden memory card"}"
            aria-pressed="${card.isFaceUp || card.isMatched ? "true" : "false"}"
            ${state.isLocked || card.isMatched ? "disabled" : ""}
          >
            <span>${card.isFaceUp || card.isMatched ? card.symbol : "?"}</span>
          </button>
        `
      )
      .join("");

    if (moves) {
      moves.textContent = String(state.moves);
    }

    if (feedback) {
      feedback.textContent = feedbackCopy[state.feedback];
    }
  }

  function scheduleMismatchClear(): void {
    clearTimer();

    if (state.feedback === "mismatch") {
      mismatchTimer = window.setTimeout(() => {
        state = clearMismatchedCards(state);
        paint();
      }, 550);
    }
  }

  grid?.addEventListener("click", (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>("[data-memory-card]");

    if (!button) {
      return;
    }

    state = flipMemoryCard(state, button.dataset.memoryCard ?? "");
    paint();
    scheduleMismatchClear();
  });

  restart?.addEventListener("click", () => {
    clearTimer();
    state = testOrder ? createMemoryGame({ orderedSymbols: testOrder }) : restartMemoryGame(state);
    paint();
  });

  paint();

  return clearTimer;
}
