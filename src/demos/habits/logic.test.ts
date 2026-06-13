import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  HABIT_STORAGE_KEY,
  calculateHabitStreak,
  calculateMonthlyCount,
  createHabitState,
  getHabitFeedback,
  loadHabitDays,
  toggleHabitDate
} from "./logic";

describe("Habit Grid logic", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("creates a calendar grid that distinguishes today and empty dates", () => {
    const state = createHabitState({ year: 2026, monthIndex: 5, today: "2026-06-13" });

    expect(state.days.length).toBeGreaterThanOrEqual(30);
    expect(state.days.some((day) => day.status === "today")).toBe(true);
    expect(state.days.some((day) => day.status === "empty")).toBe(true);
  });

  it("toggles a selected date and gives checked visual state data", () => {
    let state = createHabitState({ year: 2026, monthIndex: 5, today: "2026-06-13" });

    state = toggleHabitDate(state, "2026-06-13");

    expect(state.checkedDates).toContain("2026-06-13");
    expect(state.days.find((day) => day.date === "2026-06-13")?.status).toBe("checked");

    state = toggleHabitDate(state, "2026-06-13");

    expect(state.checkedDates).not.toContain("2026-06-13");
  });

  it("calculates monthly count and current streak", () => {
    const state = createHabitState({
      year: 2026,
      monthIndex: 5,
      today: "2026-06-13",
      checkedDates: ["2026-06-10", "2026-06-11", "2026-06-12", "2026-06-13"]
    });

    expect(calculateMonthlyCount(state)).toBe(4);
    expect(calculateHabitStreak(state)).toBe(4);
  });

  it("persists checked dates and reloads them after refresh", () => {
    const state = toggleHabitDate(
      createHabitState({ year: 2026, monthIndex: 5, today: "2026-06-13" }),
      "2026-06-13"
    );

    expect(loadHabitDays()).toEqual(state.checkedDates);
    expect(JSON.parse(localStorage.getItem(HABIT_STORAGE_KEY) ?? "[]")).toEqual(["2026-06-13"]);
  });

  it("keeps the toggled state and reports a warning when localStorage write fails", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota exceeded");
    });

    const state = toggleHabitDate(
      createHabitState({ year: 2026, monthIndex: 5, today: "2026-06-13" }),
      "2026-06-13"
    );

    expect(state.checkedDates).toEqual(["2026-06-13"]);
    expect(state.storageStatus).toBe("failed");
    expect(state.message).toBe("Check-in updated on screen, but it could not be saved in this browser.");
  });

  it("reports empty, checked, and streak feedback states", () => {
    const empty = createHabitState({ year: 2026, monthIndex: 5, today: "2026-06-13" });
    const checked = createHabitState({
      year: 2026,
      monthIndex: 5,
      today: "2026-06-13",
      checkedDates: ["2026-06-13"]
    });
    const streak = createHabitState({
      year: 2026,
      monthIndex: 5,
      today: "2026-06-13",
      checkedDates: ["2026-06-12", "2026-06-13"]
    });

    expect(getHabitFeedback(empty).state).toBe("empty");
    expect(getHabitFeedback(checked).state).toBe("checked");
    expect(getHabitFeedback(streak).state).toBe("streak");
  });
});
