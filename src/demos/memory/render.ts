import {
  clearMismatchedCards,
  createMemoryGame,
  flipMemoryCard,
  restartMemoryGame,
  type MemoryFeedback,
  type MemoryState
} from "./logic";
import { dictionaries } from "../../i18n/dictionaries";
import type { Locale } from "../../i18n/types";

declare global {
  interface Window {
    __VCM_MEMORY_TEST_ORDER__?: string[];
  }
}

export function renderMemoryDemo(locale: Locale): string {
  const copy = dictionaries[locale].demos.memory;

  return `
    <section class="memory-demo" data-testid="memory-demo" aria-labelledby="memory-title">
      <div class="demo-intro">
        <p class="project-detail__motif">${copy.title === "Memory Cards" ? "Neon Arcade Lab / Memory Cards" : "Neon Arcade Lab / 霓虹实验台"}</p>
        <h1 id="memory-title">${copy.title}</h1>
        <p class="project-detail__lede">${copy.lede}</p>
      </div>
      <div class="memory-shell">
        <div class="memory-hud">
          <div>
            <span>${copy.moves}</span>
            <strong data-testid="memory-moves">0</strong>
          </div>
          <p role="status" aria-live="polite" data-memory-feedback>${copy.feedback.ready}</p>
          <button class="button button--primary" type="button" data-memory-restart>${copy.restart}</button>
        </div>
        <div class="memory-grid" data-memory-grid aria-label="${copy.gridLabel}"></div>
      </div>
    </section>
  `;
}

export function mountMemoryDemo(locale: Locale): () => void {
  const root = document.querySelector<HTMLElement>("[data-testid='memory-demo']");

  if (!root) {
    return () => undefined;
  }

  const grid = root.querySelector<HTMLElement>("[data-memory-grid]");
  const moves = root.querySelector<HTMLElement>("[data-testid='memory-moves']");
  const feedback = root.querySelector<HTMLElement>("[data-memory-feedback]");
  const restart = root.querySelector<HTMLButtonElement>("[data-memory-restart]");
  const copy = dictionaries[locale].demos.memory;
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

    const cardButtons = state.cards.map((card) => {
      const isVisible = card.isFaceUp || card.isMatched;
      const button = document.createElement("button");
      const label = document.createElement("span");

      button.className = `memory-card${card.isFaceUp ? " is-face-up" : ""}${
        card.isMatched ? " is-matched" : ""
      }`;
      button.type = "button";
      button.dataset.testid = "memory-card";
      button.dataset.memoryCard = card.id;
      button.setAttribute("aria-label", isVisible ? `${copy.cardLabel} ${card.symbol}` : copy.hiddenCard);
      button.setAttribute("aria-pressed", isVisible ? "true" : "false");
      button.disabled = state.isLocked || card.isMatched;
      label.textContent = isVisible ? card.symbol : "?";
      button.append(label);

      return button;
    });

    grid.replaceChildren(...cardButtons);

    if (moves) {
      moves.textContent = String(state.moves);
    }

    if (feedback) {
      feedback.textContent = copy.feedback[state.feedback];
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
