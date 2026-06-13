import {
  LEDGER_CATEGORIES,
  addLedgerRecord,
  calculateLedgerStats,
  createLedgerState,
  deleteLedgerRecord,
  type LedgerRecordType,
  type LedgerState
} from "./logic";
import { dictionaries } from "../../i18n/dictionaries";
import type { Locale } from "../../i18n/types";

function formatMoney(value: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === "zh" ? "zh-CN" : "en-US", {
    currency: locale === "zh" ? "CNY" : "USD",
    style: "currency"
  }).format(value);
}

function todayValue(): string {
  return new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(new Date());
}

export function renderLedgerDemo(locale: Locale): string {
  const copy = dictionaries[locale].demos.ledger;

  return `
    <section class="ledger-demo" data-testid="ledger-demo" aria-labelledby="ledger-title">
      <div class="demo-intro">
        <p class="project-detail__motif">${locale === "zh" ? "Receipt Ledger / 票据账房" : "Receipt Ledger"}</p>
        <h1 id="ledger-title">${copy.title}</h1>
        <p class="project-detail__lede">${copy.lede}</p>
      </div>
      <div class="ledger-shell">
        <form class="ledger-form" data-ledger-form>
          <label>${copy.type}
            <select name="type" aria-label="${copy.type}">
              <option value="income">${copy.income}</option>
              <option value="expense">${copy.expense}</option>
            </select>
          </label>
          <label>${copy.amount}
            <input name="amount" aria-label="${copy.amount}" inputmode="decimal" min="0.01" step="0.01" type="number" required>
          </label>
          <label>${copy.category}
            <select name="category" aria-label="${copy.category}">
              ${LEDGER_CATEGORIES.map((category) => `<option value="${category}">${copy.categories[category as keyof typeof copy.categories]}</option>`).join("")}
            </select>
          </label>
          <label>${copy.note}
            <input name="note" aria-label="${copy.note}" type="text" placeholder="${copy.note}">
          </label>
          <label>${copy.date}
            <input name="date" aria-label="${copy.date}" type="date" value="${todayValue()}">
          </label>
          <button class="button button--primary" type="submit">${copy.addRecord}</button>
        </form>
        <div class="ledger-board">
          <dl class="ledger-stats">
            <div><dt>${copy.income}</dt><dd data-testid="ledger-income">${formatMoney(0, locale)}</dd></div>
            <div><dt>${copy.expense}</dt><dd data-testid="ledger-expense">${formatMoney(0, locale)}</dd></div>
            <div><dt>${copy.balance}</dt><dd data-testid="ledger-balance">${formatMoney(0, locale)}</dd></div>
          </dl>
          <p class="ledger-storage-status" data-ledger-storage-status role="status" aria-live="polite"></p>
          <div data-ledger-list></div>
        </div>
      </div>
    </section>
  `;
}

export function mountLedgerDemo(locale: Locale): () => void {
  const root = document.querySelector<HTMLElement>("[data-testid='ledger-demo']");

  if (!root) {
    return () => undefined;
  }

  const form = root.querySelector<HTMLFormElement>("[data-ledger-form]");
  const list = root.querySelector<HTMLElement>("[data-ledger-list]");
  const income = root.querySelector<HTMLElement>("[data-testid='ledger-income']");
  const expense = root.querySelector<HTMLElement>("[data-testid='ledger-expense']");
  const balance = root.querySelector<HTMLElement>("[data-testid='ledger-balance']");
  const storageStatus = root.querySelector<HTMLElement>("[data-ledger-storage-status]");
  const copy = dictionaries[locale].demos.ledger;
  let state: LedgerState = createLedgerState();

  function renderEmptyState(container: HTMLElement): void {
    const wrapper = document.createElement("div");
    const message = document.createElement("p");
    const action = document.createElement("button");

    wrapper.className = "ledger-empty";
    wrapper.dataset.testid = "ledger-empty";
    message.textContent = copy.emptyMessage;
    action.className = "button button--secondary";
    action.type = "button";
    action.dataset.ledgerFocusAmount = "";
    action.textContent = copy.emptyAction;

    wrapper.append(message, action);
    container.replaceChildren(wrapper);
  }

  function renderRecordList(container: HTMLElement): void {
    const recordList = document.createElement("ul");
    recordList.className = "ledger-list";
    recordList.setAttribute("aria-label", copy.recordsLabel);

    for (const record of state.records) {
      const item = document.createElement("li");
      const textBlock = document.createElement("div");
      const note = document.createElement("strong");
      const meta = document.createElement("span");
      const amount = document.createElement("b");
      const deleteButton = document.createElement("button");

      item.className = `ledger-record ledger-record--${record.type}`;
      item.dataset.testid = "ledger-record";
      note.textContent = record.note;
      meta.textContent = `${copy.categories[record.category as keyof typeof copy.categories] ?? record.category} - ${record.date}`;
      amount.textContent = `${record.type === "expense" ? "-" : "+"}${formatMoney(record.amount, locale)}`;
      deleteButton.className = "button button--secondary";
      deleteButton.type = "button";
      deleteButton.dataset.ledgerDelete = record.id;
      deleteButton.setAttribute("aria-label", `${copy.deleteLabel} ${record.note}`);
      deleteButton.textContent = copy.delete;

      textBlock.append(note, meta);
      item.append(textBlock, amount, deleteButton);
      recordList.append(item);
    }

    container.replaceChildren(recordList);
  }

  function paint(): void {
    const stats = calculateLedgerStats(state.records);

    if (income) income.textContent = formatMoney(stats.income, locale);
    if (expense) expense.textContent = formatMoney(stats.expense, locale);
    if (balance) balance.textContent = formatMoney(stats.balance, locale);
    if (storageStatus) {
      storageStatus.textContent =
        state.storageStatus === "idle" ? "" : copy.storageStatus[state.storageStatus];
      storageStatus.dataset.state = state.storageStatus;
    }

    if (!list) {
      return;
    }

    if (state.records.length === 0) {
      renderEmptyState(list);
      return;
    }

    renderRecordList(list);
  }

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    state = addLedgerRecord(state, {
      type: data.get("type") as LedgerRecordType,
      amount: Number(data.get("amount")),
      category: String(data.get("category") ?? LEDGER_CATEGORIES[0]),
      note: String(data.get("note") ?? ""),
      date: String(data.get("date") ?? todayValue())
    });
    form.reset();
    const dateInput = form.elements.namedItem("date") as HTMLInputElement | null;
    if (dateInput) dateInput.value = todayValue();
    paint();
  });

  list?.addEventListener("click", (event) => {
    const target = (event.target as HTMLElement).closest<HTMLElement>("[data-ledger-delete], [data-ledger-focus-amount]");

    if (!target) {
      return;
    }

    if (target.dataset.ledgerFocusAmount !== undefined) {
      form?.elements.namedItem("amount") instanceof HTMLInputElement &&
        (form.elements.namedItem("amount") as HTMLInputElement).focus();
      return;
    }

    state = deleteLedgerRecord(state, target.dataset.ledgerDelete ?? "");
    paint();
  });

  paint();

  return () => undefined;
}
