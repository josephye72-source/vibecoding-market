import {
  calculateSplit,
  formatSplitMoney,
  parseItemAmounts,
  parseParticipants
} from "./logic";
import { dictionaries } from "../../i18n/dictionaries";
import type { Locale } from "../../i18n/types";

declare global {
  interface Window {
    __VCM_CLIPBOARD_WRITE__?: (text: string) => Promise<void>;
  }
}

function formatSplitMoneyForLocale(value: number, locale: Locale): string {
  if (locale === "en") {
    return formatSplitMoney(value);
  }

  return new Intl.NumberFormat("zh-CN", {
    currency: "CNY",
    style: "currency"
  }).format(value);
}

export function renderSplitDemo(locale: Locale): string {
  const copy = dictionaries[locale].demos.split;

  return `
    <section class="split-demo" data-testid="split-demo" aria-labelledby="split-title">
      <div class="demo-intro">
        <p class="project-detail__motif">${locale === "zh" ? "Split Console / 分账控制台" : "Split Console"}</p>
        <h1 id="split-title">${copy.title}</h1>
        <p class="project-detail__lede">${copy.lede}</p>
      </div>
      <div class="split-shell">
        <form class="split-form" data-split-form>
          <label>${copy.total}
            <input aria-label="${copy.total}" name="total" inputmode="decimal" type="number" min="0" step="0.01" placeholder="120">
          </label>
          <label>${copy.items}
            <textarea aria-label="${copy.items}" name="items" rows="4" placeholder="12, 8, 10"></textarea>
          </label>
          <label>${copy.participants}
            <textarea aria-label="${copy.participants}" name="participants" rows="4" placeholder="Ava, Bo, Cy"></textarea>
          </label>
        </form>
        <div class="split-result">
          <p class="split-error" role="alert" data-split-error></p>
          <dl>
            <div><dt>${copy.total}</dt><dd data-testid="split-total">--</dd></div>
            <div><dt>${copy.eachPerson}</dt><dd data-testid="split-per-person">--</dd></div>
          </dl>
          <p class="split-summary" data-testid="split-summary">${copy.emptySummary}</p>
          <button class="button button--primary" type="button" data-split-copy>${copy.copySummary}</button>
          <p role="status" aria-live="polite" data-split-copy-status></p>
        </div>
      </div>
    </section>
  `;
}

export function mountSplitDemo(locale: Locale): () => void {
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
  const text = dictionaries[locale].demos.split;
  let currentSummary = "";

  function localizedError(errorText: string | null): string {
    if (!errorText) {
      return "";
    }

    if (errorText.includes("item amounts")) {
      return text.errors.positiveItems;
    }

    if (errorText.includes("positive total")) {
      return text.errors.positiveTotal;
    }

    if (errorText.includes("participant")) {
      return text.errors.participant;
    }

    return errorText;
  }

  function createSummary(result: ReturnType<typeof calculateSplit>): string {
    if (!result.isValid || result.total === null || result.perPerson === null || result.people === null) {
      return "";
    }

    const who =
      result.participants.length > 0
        ? result.participants.join(", ")
        : locale === "zh"
          ? `${result.people} 人`
          : `${result.people} people`;

    return text.summary
      .replace("{total}", formatSplitMoneyForLocale(result.total, locale))
      .replace("{who}", who)
      .replace("{perPerson}", formatSplitMoneyForLocale(result.perPerson, locale));
  }

  function paint(): void {
    const result = calculateSplit({
      total: totalInput?.value ? Number(totalInput.value) : null,
      itemAmounts: parseItemAmounts(itemsInput?.value ?? ""),
      participants: parseParticipants(participantsInput?.value ?? "")
    });

    currentSummary = createSummary(result);

    if (error) {
      error.textContent = localizedError(result.error);
    }

    if (total) {
      total.textContent = result.total === null ? "--" : formatSplitMoneyForLocale(result.total, locale);
    }

    if (perPerson) {
      perPerson.textContent = result.perPerson === null ? "--" : formatSplitMoneyForLocale(result.perPerson, locale);
    }

    if (summary) {
      summary.textContent = currentSummary || text.emptySummary;
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
      const writeText =
        import.meta.env.DEV && window.__VCM_CLIPBOARD_WRITE__
          ? window.__VCM_CLIPBOARD_WRITE__
          : navigator.clipboard?.writeText?.bind(navigator.clipboard);

      if (!writeText) {
        throw new Error("clipboard unavailable");
      }

      await writeText(currentSummary);
      if (copyStatus) {
        copyStatus.textContent = text.copied;
      }
    } catch {
      if (copyStatus) {
        copyStatus.textContent = text.copyUnavailable;
      }
    }
  });

  paint();

  return () => undefined;
}
