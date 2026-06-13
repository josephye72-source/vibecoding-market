import { beforeEach, describe, expect, it } from "vitest";
import {
  completeSession,
  createPomodoroState,
  getProgress,
  loadTodayRecord,
  pauseTimer,
  resetTimer,
  startTimer,
  switchMode,
  tickTimer,
  type PomodoroDurations
} from "./logic";

const durations: PomodoroDurations = {
  focus: 10,
  break: 4
};

describe("Pomodoro logic", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("moves through start, pause, and reset without losing the selected mode", () => {
    const idle = createPomodoroState({ durations, today: "2026-06-13" });
    const running = startTimer(idle);
    const paused = pauseTimer(running);
    const reset = resetTimer(paused, durations);

    expect(running.status).toBe("running");
    expect(paused.status).toBe("paused");
    expect(reset).toMatchObject({
      mode: "focus",
      status: "idle",
      remainingSeconds: 10,
      totalSeconds: 10
    });
  });

  it("switches between focus and break modes with mode-specific durations", () => {
    const focus = createPomodoroState({ durations, today: "2026-06-13" });
    const shortBreak = switchMode(focus, "break", durations);
    const backToFocus = switchMode(shortBreak, "focus", durations);

    expect(shortBreak).toMatchObject({
      mode: "break",
      status: "idle",
      remainingSeconds: 4,
      totalSeconds: 4
    });
    expect(backToFocus).toMatchObject({
      mode: "focus",
      remainingSeconds: 10,
      totalSeconds: 10
    });
  });

  it("calculates progress from elapsed time", () => {
    const idle = createPomodoroState({ durations, today: "2026-06-13" });
    const halfway = tickTimer(startTimer(idle), 5, { durations, today: "2026-06-13" });
    const complete = tickTimer(halfway, 5, { durations, today: "2026-06-13" });

    expect(getProgress(idle)).toBe(0);
    expect(getProgress(halfway)).toBe(0.5);
    expect(getProgress(complete)).toBe(1);
  });

  it("increments and persists today's completed focus count after completion", () => {
    localStorage.setItem(
      "vcm:pomodoro:today",
      JSON.stringify({ date: "2026-06-13", completed: 2 })
    );

    const running = startTimer(createPomodoroState({ durations, today: "2026-06-13" }));
    const complete = completeSession(running, { durations, today: "2026-06-13" });

    expect(complete.status).toBe("complete");
    expect(complete.completedToday).toBe(3);
    expect(loadTodayRecord("2026-06-13")).toEqual({
      date: "2026-06-13",
      completed: 3
    });
  });

  it("does not increment today's count when a break completes", () => {
    const breakState = startTimer(
      switchMode(createPomodoroState({ durations, today: "2026-06-13" }), "break", durations)
    );

    const complete = completeSession(breakState, { durations, today: "2026-06-13" });

    expect(complete.status).toBe("complete");
    expect(complete.completedToday).toBe(0);
    expect(loadTodayRecord("2026-06-13")).toEqual({
      date: "2026-06-13",
      completed: 0
    });
  });

  it("falls back safely when localStorage contains corrupt data", () => {
    localStorage.setItem("vcm:pomodoro:today", "{not-json");

    expect(loadTodayRecord("2026-06-13")).toEqual({
      date: "2026-06-13",
      completed: 0
    });
    expect(createPomodoroState({ durations, today: "2026-06-13" }).completedToday).toBe(0);
  });
});
