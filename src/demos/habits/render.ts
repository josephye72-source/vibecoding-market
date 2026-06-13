import {
  calculateHabitStreak,
  calculateMonthlyCount,
  createHabitState,
  getHabitFeedback,
  toggleHabitDate,
  type HabitState
} from "./logic";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

export function renderHabitDemo(): string {
  return `
    <section class="habit-demo" data-testid="habit-demo" aria-labelledby="habit-title">
      <div class="demo-intro">
        <p class="project-detail__motif">Growth Grid / Habit Grid</p>
        <h1 id="habit-title">Habit Grid</h1>
        <p class="project-detail__lede">Tap a date, turn it green, and let the month count show momentum.</p>
      </div>
      <div class="habit-shell">
        <div class="habit-summary">
          <p data-habit-month></p>
          <dl>
            <div><dt>This month</dt><dd data-testid="habit-monthly-count">0</dd></div>
            <div><dt>Current streak</dt><dd data-testid="habit-streak">0</dd></div>
          </dl>
          <p class="habit-feedback" data-testid="habit-feedback" role="status" aria-live="polite"></p>
        </div>
        <div class="habit-grid" data-habit-grid aria-label="Habit calendar"></div>
      </div>
    </section>
  `;
}

export function mountHabitDemo(): () => void {
  const root = document.querySelector<HTMLElement>("[data-testid='habit-demo']");

  if (!root) {
    return () => undefined;
  }

  const grid = root.querySelector<HTMLElement>("[data-habit-grid]");
  const month = root.querySelector<HTMLElement>("[data-habit-month]");
  const count = root.querySelector<HTMLElement>("[data-testid='habit-monthly-count']");
  const streak = root.querySelector<HTMLElement>("[data-testid='habit-streak']");
  const feedback = root.querySelector<HTMLElement>("[data-testid='habit-feedback']");
  let state: HabitState = createHabitState();

  function paint(): void {
    if (month) {
      month.textContent = `${monthNames[state.monthIndex]} ${state.year}`;
    }

    if (count) {
      count.textContent = String(calculateMonthlyCount(state));
    }

    if (streak) {
      streak.textContent = String(calculateHabitStreak(state));
    }

    if (feedback) {
      feedback.textContent = getHabitFeedback(state).message;
      feedback.dataset.state = getHabitFeedback(state).state;
    }

    if (!grid) {
      return;
    }

    grid.innerHTML = state.days
      .map(
        (day) => `
          <button
            class="habit-day habit-day--${day.status}"
            type="button"
            data-testid="habit-day"
            data-habit-date="${day.date}"
            aria-pressed="${day.status === "checked" ? "true" : "false"}"
            aria-label="${day.date}${day.status === "checked" ? " checked" : ""}"
          >
            <span>${day.dayNumber}</span>
          </button>
        `
      )
      .join("");
  }

  grid?.addEventListener("click", (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>("[data-habit-date]");

    if (!button) {
      return;
    }

    state = toggleHabitDate(state, button.dataset.habitDate ?? "");
    paint();
  });

  paint();

  return () => undefined;
}
