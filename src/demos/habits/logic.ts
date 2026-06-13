export type HabitDayStatus = "empty" | "today" | "checked";

export type HabitDay = {
  date: string;
  dayNumber: number;
  status: HabitDayStatus;
};

export type HabitState = {
  year: number;
  monthIndex: number;
  today: string;
  checkedDates: string[];
  days: HabitDay[];
  storageStatus: "saved" | "failed" | "idle";
  message: string;
};

export type HabitOptions = {
  year?: number;
  monthIndex?: number;
  today?: string;
  checkedDates?: string[];
};

export const HABIT_STORAGE_KEY = "vcm:habits:checked-days";

function toDateKey(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(date);
}

function monthDateKey(year: number, monthIndex: number, day: number): string {
  return toDateKey(new Date(year, monthIndex, day));
}

export function loadHabitDays(): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(HABIT_STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((value) => typeof value === "string") : [];
  } catch {
    return [];
  }
}

export function saveHabitDays(checkedDates: string[]): boolean {
  try {
    localStorage.setItem(HABIT_STORAGE_KEY, JSON.stringify(checkedDates));
    return true;
  } catch {
    return false;
  }
}

export function createHabitState(options: HabitOptions = {}): HabitState {
  const now = new Date();
  const year = options.year ?? now.getFullYear();
  const monthIndex = options.monthIndex ?? now.getMonth();
  const today = options.today ?? toDateKey(now);
  const checkedDates = [...(options.checkedDates ?? loadHabitDays())].sort();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const days: HabitDay[] = Array.from({ length: daysInMonth }, (_, index) => {
    const dayNumber = index + 1;
    const date = monthDateKey(year, monthIndex, dayNumber);
    const isChecked = checkedDates.includes(date);

    return {
      date,
      dayNumber,
      status: isChecked ? "checked" : date === today ? "today" : "empty"
    };
  });

  return {
    year,
    monthIndex,
    today,
    checkedDates,
    days,
    storageStatus: "idle",
    message: ""
  };
}

export function toggleHabitDate(state: HabitState, date: string): HabitState {
  const checked = new Set(state.checkedDates);

  if (checked.has(date)) {
    checked.delete(date);
  } else {
    checked.add(date);
  }

  const checkedDates = Array.from(checked).sort();
  const saved = saveHabitDays(checkedDates);
  const nextState = createHabitState({
    year: state.year,
    monthIndex: state.monthIndex,
    today: state.today,
    checkedDates
  });

  return {
    ...nextState,
    storageStatus: saved ? "saved" : "failed",
    message: saved
      ? "Check-in saved in this browser."
      : "Check-in updated on screen, but it could not be saved in this browser."
  };
}

export function calculateMonthlyCount(state: HabitState): number {
  return state.days.filter((day) => state.checkedDates.includes(day.date)).length;
}

export function calculateHabitStreak(state: HabitState): number {
  let streak = 0;
  let cursor = new Date(`${state.today}T00:00:00`);

  while (state.checkedDates.includes(toDateKey(cursor))) {
    streak += 1;
    cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() - 1);
  }

  return streak;
}

export function getHabitFeedback(state: HabitState): { state: "empty" | "checked" | "streak"; message: string } {
  const streak = calculateHabitStreak(state);
  const count = calculateMonthlyCount(state);

  if (streak >= 2) {
    return {
      state: "streak",
      message: `${streak}-day streak. The grid is growing.`
    };
  }

  if (count > 0) {
    return {
      state: "checked",
      message: "Date checked. One square is alive."
    };
  }

  return {
    state: "empty",
    message: "No check-ins yet. Pick a date to start the grid."
  };
}
