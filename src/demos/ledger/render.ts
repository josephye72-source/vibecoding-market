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
          <p class="ledger-storage-status" data-ledger-storage-status role="status" aria-live="polite"></p>
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
  const storageStatus = root.querySelector<HTMLElement>("[data-ledger-storage-status]");
  let state: LedgerState = createLedgerState();

  function renderEmptyState(container: HTMLElement): void {
    const empty = getLedgerEmptyState();
    const wrapper = document.createElement("div");
    const message = document.createElement("p");
    const action = document.createElement("button");

    wrapper.className = "ledger-empty";
    wrapper.dataset.testid = "ledger-empty";
    message.textContent = empty.message;
    action.className = "button button--secondary";
    action.type = "button";
    action.dataset.ledgerFocusAmount = "";
    action.textContent = empty.actionLabel;

    wrapper.append(message, action);
    container.replaceChildren(wrapper);
  }

  function renderRecordList(container: HTMLElement): void {
    const recordList = document.createElement("ul");
    recordList.className = "ledger-list";
    recordList.setAttribute("aria-label", "Ledger records");

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
      meta.textContent = `${record.category} - ${record.date}`;
      amount.textContent = `${record.type === "expense" ? "-" : "+"}${formatMoney(record.amount)}`;
      deleteButton.className = "button button--secondary";
      deleteButton.type = "button";
      deleteButton.dataset.ledgerDelete = record.id;
      deleteButton.setAttribute("aria-label", `Delete ${record.note}`);
      deleteButton.textContent = "Delete";

      textBlock.append(note, meta);
      item.append(textBlock, amount, deleteButton);
      recordList.append(item);
    }

    container.replaceChildren(recordList);
  }

  function paint(): void {
    const stats = calculateLedgerStats(state.records);

    if (income) income.textContent = formatMoney(stats.income);
    if (expense) expense.textContent = formatMoney(stats.expense);
    if (balance) balance.textContent = formatMoney(stats.balance);
    if (storageStatus) {
      storageStatus.textContent = state.message;
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
