import {
  LEDGER_CATEGORIES,
  addLedgerRecord,
  calculateLedgerStats,
  createLedgerState,
  deleteLedgerRecord,
  getLedgerEmptyState,
  type LedgerRecordType,
  type LedgerState
} from "./logic";

function formatMoney(value: number): string {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
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

export function renderLedgerDemo(): string {
  return `
    <section class="ledger-demo" data-testid="ledger-demo" aria-labelledby="ledger-title">
      <div class="demo-intro">
        <p class="project-detail__motif">Receipt Ledger / Tiny Ledger</p>
        <h1 id="ledger-title">Tiny Ledger</h1>
        <p class="project-detail__lede">Add simple income and expense records, then refresh to confirm the local ledger stays put.</p>
      </div>
      <div class="ledger-shell">
        <form class="ledger-form" data-ledger-form>
          <label>Type
            <select name="type" aria-label="Type">
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </label>
          <label>Amount
            <input name="amount" aria-label="Amount" inputmode="decimal" min="0.01" step="0.01" type="number" required>
          </label>
          <label>Category
            <select name="category" aria-label="Category">
              ${LEDGER_CATEGORIES.map((category) => `<option value="${category}">${category}</option>`).join("")}
            </select>
          </label>
          <label>Note
            <input name="note" aria-label="Note" type="text" placeholder="Short note">
          </label>
          <label>Date
            <input name="date" aria-label="Date" type="date" value="${todayValue()}">
          </label>
          <button class="button button--primary" type="submit">Add record</button>
        </form>
        <div class="ledger-board">
          <dl class="ledger-stats">
            <div><dt>Income</dt><dd data-testid="ledger-income">$0.00</dd></div>
            <div><dt>Expense</dt><dd data-testid="ledger-expense">$0.00</dd></div>
            <div><dt>Balance</dt><dd data-testid="ledger-balance">$0.00</dd></div>
          </dl>
          <div data-ledger-list></div>
        </div>
      </div>
    </section>
  `;
}

export function mountLedgerDemo(): () => void {
  const root = document.querySelector<HTMLElement>("[data-testid='ledger-demo']");

  if (!root) {
    return () => undefined;
  }

  const form = root.querySelector<HTMLFormElement>("[data-ledger-form]");
  const list = root.querySelector<HTMLElement>("[data-ledger-list]");
  const income = root.querySelector<HTMLElement>("[data-testid='ledger-income']");
  const expense = root.querySelector<HTMLElement>("[data-testid='ledger-expense']");
  const balance = root.querySelector<HTMLElement>("[data-testid='ledger-balance']");
  let state: LedgerState = createLedgerState();

  function paint(): void {
    const stats = calculateLedgerStats(state.records);

    if (income) income.textContent = formatMoney(stats.income);
    if (expense) expense.textContent = formatMoney(stats.expense);
    if (balance) balance.textContent = formatMoney(stats.balance);

    if (!list) {
      return;
    }

    if (state.records.length === 0) {
      const empty = getLedgerEmptyState();
      list.innerHTML = `
        <div class="ledger-empty" data-testid="ledger-empty">
          <p>${empty.message}</p>
          <button class="button button--secondary" type="button" data-ledger-focus-amount>${empty.actionLabel}</button>
        </div>
      `;
      return;
    }

    list.innerHTML = `
      <ul class="ledger-list" aria-label="Ledger records">
        ${state.records
          .map(
            (record) => `
              <li class="ledger-record ledger-record--${record.type}" data-testid="ledger-record">
                <div>
                  <strong>${record.note}</strong>
                  <span>${record.category} · ${record.date}</span>
                </div>
                <b>${record.type === "expense" ? "-" : "+"}${formatMoney(record.amount)}</b>
                <button class="button button--secondary" type="button" data-ledger-delete="${record.id}" aria-label="Delete ${record.note}">Delete</button>
              </li>
            `
          )
          .join("")}
      </ul>
    `;
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
