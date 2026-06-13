import {
  calculateSplit,
  copyableSplitSummary,
  formatSplitMoney,
  parseItemAmounts,
  parseParticipants
} from "./logic";

export function renderSplitDemo(): string {
  return `
    <section class="split-demo" data-testid="split-demo" aria-labelledby="split-title">
      <div class="demo-intro">
        <p class="project-detail__motif">Split Console / Split Console</p>
        <h1 id="split-title">Split Console</h1>
        <p class="project-detail__lede">Enter a total or item list, add people, and get an immediate copyable split.</p>
      </div>
      <div class="split-shell">
        <form class="split-form" data-split-form>
          <label>Total
            <input aria-label="Total" name="total" inputmode="decimal" type="number" min="0" step="0.01" placeholder="120">
          </label>
          <label>Items
            <textarea aria-label="Items" name="items" rows="4" placeholder="12, 8, 10"></textarea>
          </label>
          <label>Participants
            <textarea aria-label="Participants" name="participants" rows="4" placeholder="Ava, Bo, Cy"></textarea>
          </label>
        </form>
        <div class="split-result">
          <p class="split-error" role="alert" data-split-error></p>
          <dl>
            <div><dt>Total</dt><dd data-testid="split-total">--</dd></div>
            <div><dt>Each person</dt><dd data-testid="split-per-person">--</dd></div>
          </dl>
          <p class="split-summary" data-testid="split-summary">Enter values to create a summary.</p>
          <button class="button button--primary" type="button" data-split-copy>Copy summary</button>
          <p role="status" aria-live="polite" data-split-copy-status></p>
        </div>
      </div>
    </section>
  `;
}

export function mountSplitDemo(): () => void {
  const root = document.querySelector<HTMLElement>("[data-testid='split-demo']");

  if (!root) {
    return () => undefined;
  }

  const form = root.querySelector<HTMLFormElement>("[data-split-form]");
  const totalInput = form?.elements.namedItem("total") as HTMLInputElement | null;
  const itemsInput = form?.elements.namedItem("items") as HTMLTextAreaElement | null;
  const participantsInput = form?.elements.namedItem("participants") as HTMLTextAreaElement | null;
  const error = root.querySelector<HTMLElement>("[data-split-error]");
  const total = root.querySelector<HTMLElement>("[data-testid='split-total']");
  const perPerson = root.querySelector<HTMLElement>("[data-testid='split-per-person']");
  const summary = root.querySelector<HTMLElement>("[data-testid='split-summary']");
  const copy = root.querySelector<HTMLButtonElement>("[data-split-copy]");
  const copyStatus = root.querySelector<HTMLElement>("[data-split-copy-status]");
  let currentSummary = "";

  function paint(): void {
    const result = calculateSplit({
      total: totalInput?.value ? Number(totalInput.value) : null,
      itemAmounts: parseItemAmounts(itemsInput?.value ?? ""),
      participants: parseParticipants(participantsInput?.value ?? "")
    });

    currentSummary = copyableSplitSummary(result);

    if (error) {
      error.textContent = result.error ?? "";
    }

    if (total) {
      total.textContent = result.total === null ? "--" : formatSplitMoney(result.total);
    }

    if (perPerson) {
      perPerson.textContent = result.perPerson === null ? "--" : formatSplitMoney(result.perPerson);
    }

    if (summary) {
      summary.textContent = currentSummary || "Enter values to create a summary.";
    }

    if (copy) {
      copy.disabled = !result.isValid;
    }

    if (copyStatus) {
      copyStatus.textContent = "";
    }
  }

  form?.addEventListener("input", paint);
  copy?.addEventListener("click", async () => {
    if (!currentSummary) {
      return;
    }

    try {
      await navigator.clipboard?.writeText(currentSummary);
    } catch {
      // The visible summary remains copyable even when clipboard permission is unavailable.
    }

    if (copyStatus) {
      copyStatus.textContent = "Copied summary.";
    }
  });

  paint();

  return () => undefined;
}
