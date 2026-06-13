import {
  calculateHabitStreak,
  calculateMonthlyCount,
  createHabitState,
  getHabitFeedback,
  toggleHabitDate,
  type HabitState
} from "./logic";
import { dictionaries } from "../../i18n/dictionaries";
import type { Locale } from "../../i18n/types";

const monthNamesEn = [
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

const monthNamesZh = ["1 月", "2 月", "3 月", "4 月", "5 月", "6 月", "7 月", "8 月", "9 月", "10 月", "11 月", "12 月"];

export function renderHabitDemo(locale: Locale): string {
  const copy = dictionaries[locale].demos.habits;

  return `
    <section class="habit-demo" data-testid="habit-demo" aria-labelledby="habit-title">
      <div class="demo-intro">
        <p class="project-detail__motif">${locale === "zh" ? "Growth Grid / 生长网格" : "Growth Grid / Habit Grid"}</p>
        <h1 id="habit-title">${copy.title}</h1>
        <p class="project-detail__lede">${copy.lede}</p>
      </div>
      <div class="habit-shell">
        <div class="habit-summary">
          <p data-habit-month></p>
          <dl>
            <div><dt>${copy.thisMonth}</dt><dd data-testid="habit-monthly-count">0</dd></div>
            <div><dt>${copy.currentStreak}</dt><dd data-testid="habit-streak">0</dd></div>
          </dl>
          <p class="habit-feedback" data-testid="habit-feedback" role="status" aria-live="polite"></p>
          <p class="habit-storage-status" data-habit-storage-status role="status" aria-live="polite"></p>
        </div>
        <div class="habit-grid" data-habit-grid aria-label="${copy.calendarLabel}"></div>
      </div>
    </section>
  `;
}

export function mountHabitDemo(locale: Locale): () => void {
  const root = document.querySelector<HTMLElement>("[data-testid='habit-demo']");

  if (!root) {
    return () => undefined;
  }

  const grid = root.querySelector<HTMLElement>("[data-habit-grid]");
  const month = root.querySelector<HTMLElement>("[data-habit-month]");
  const count = root.querySelector<HTMLElement>("[data-testid='habit-monthly-count']");
  const streak = root.querySelector<HTMLElement>("[data-testid='habit-streak']");
  const feedback = root.querySelector<HTMLElement>("[data-testid='habit-feedback']");
  const storageStatus = root.querySelector<HTMLElement>("[data-habit-storage-status]");
  const copy = dictionaries[locale].demos.habits;
  let state: HabitState = createHabitState();

  function paint(): void {
    if (month) {
      const monthName = locale === "zh" ? monthNamesZh[state.monthIndex] : monthNamesEn[state.monthIndex];
      month.textContent = locale === "zh" ? `${state.year} 年 ${monthName}` : `${monthName} ${state.year}`;
    }

    if (count) {
      count.textContent = String(calculateMonthlyCount(state));
    }

    if (streak) {
      streak.textContent = String(calculateHabitStreak(state));
    }

    if (feedback) {
      const habitFeedback = getHabitFeedback(state);
      feedback.textContent =
        habitFeedback.state === "streak"
          ? copy.feedback.streak.replace("{count}", String(calculateHabitStreak(state)))
          : copy.feedback[habitFeedback.state];
      feedback.dataset.state = habitFeedback.state;
    }

    if (storageStatus) {
      storageStatus.textContent =
        state.storageStatus === "idle" ? "" : copy.storageStatus[state.storageStatus];
      storageStatus.dataset.state = state.storageStatus;
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
            aria-label="${day.date}${day.status === "checked" ? ` ${copy.checked}` : ""}"
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
