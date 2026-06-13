export type PomodoroMode = "focus" | "break";
export type PomodoroStatus = "idle" | "running" | "paused" | "complete";

export type PomodoroDurations = Record<PomodoroMode, number>;

export type PomodoroRecord = {
  date: string;
  completed: number;
};

export type PomodoroState = {
  mode: PomodoroMode;
  status: PomodoroStatus;
  remainingSeconds: number;
  totalSeconds: number;
  completedToday: number;
  message: string;
};

export type PomodoroOptions = {
  durations?: PomodoroDurations;
  mode?: PomodoroMode;
  today?: string;
};

export const DEFAULT_POMODORO_DURATIONS: PomodoroDurations = {
  focus: 25 * 60,
  break: 5 * 60
};

export const POMODORO_RECORD_KEY = "vcm:pomodoro:today";

function clampDuration(value: number): number {
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : 1;
}

export function getTodayKey(date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(date);
}

export function normalizeDurations(durations = DEFAULT_POMODORO_DURATIONS): PomodoroDurations {
  return {
    focus: clampDuration(durations.focus),
    break: clampDuration(durations.break)
  };
}

export function loadTodayRecord(today = getTodayKey()): PomodoroRecord {
  try {
    const rawValue = localStorage.getItem(POMODORO_RECORD_KEY);

    if (!rawValue) {
      return { date: today, completed: 0 };
    }

    const parsed = JSON.parse(rawValue) as Partial<PomodoroRecord>;

    if (parsed.date !== today || typeof parsed.completed !== "number" || parsed.completed < 0) {
      return { date: today, completed: 0 };
    }

    return {
      date: today,
      completed: Math.floor(parsed.completed)
    };
  } catch {
    return { date: today, completed: 0 };
  }
}

export function saveTodayRecord(record: PomodoroRecord): void {
  localStorage.setItem(POMODORO_RECORD_KEY, JSON.stringify(record));
}

export function createPomodoroState(options: PomodoroOptions = {}): PomodoroState {
  const durations = normalizeDurations(options.durations);
  const mode = options.mode ?? "focus";
  const today = options.today ?? getTodayKey();
  const record = loadTodayRecord(today);

  return {
    mode,
    status: "idle",
    remainingSeconds: durations[mode],
    totalSeconds: durations[mode],
    completedToday: record.completed,
    message: "Ready to start."
  };
}

export function startTimer(state: PomodoroState): PomodoroState {
  if (state.status === "running") {
    return state;
  }

  return {
    ...state,
    status: "running",
    message: `${state.mode === "focus" ? "Focus" : "Break"} timer running.`
  };
}

export function pauseTimer(state: PomodoroState): PomodoroState {
  if (state.status !== "running") {
    return state;
  }

  return {
    ...state,
    status: "paused",
    message: "Timer paused."
  };
}

export function resetTimer(
  state: PomodoroState,
  durations = DEFAULT_POMODORO_DURATIONS
): PomodoroState {
  const normalized = normalizeDurations(durations);

  return {
    ...state,
    status: "idle",
    remainingSeconds: normalized[state.mode],
    totalSeconds: normalized[state.mode],
    message: "Ready to start."
  };
}

export function switchMode(
  state: PomodoroState,
  mode: PomodoroMode,
  durations = DEFAULT_POMODORO_DURATIONS
): PomodoroState {
  const normalized = normalizeDurations(durations);

  return {
    ...state,
    mode,
    status: "idle",
    remainingSeconds: normalized[mode],
    totalSeconds: normalized[mode],
    message: `${mode === "focus" ? "Focus" : "Break"} mode ready.`
  };
}

export function completeSession(
  state: PomodoroState,
  options: { durations?: PomodoroDurations; today?: string } = {}
): PomodoroState {
  const today = options.today ?? getTodayKey();
  const record = loadTodayRecord(today);
  const completedToday = state.mode === "focus" ? record.completed + 1 : record.completed;

  saveTodayRecord({ date: today, completed: completedToday });

  return {
    ...state,
    status: "complete",
    remainingSeconds: 0,
    completedToday,
    message:
      state.mode === "focus"
        ? "Focus session complete. Take a short break."
        : "Break complete. Ready for another focus round."
  };
}

export function tickTimer(
  state: PomodoroState,
  elapsedSeconds = 1,
  options: { durations?: PomodoroDurations; today?: string } = {}
): PomodoroState {
  if (state.status !== "running") {
    return state;
  }

  const remainingSeconds = Math.max(0, state.remainingSeconds - clampDuration(elapsedSeconds));

  if (remainingSeconds === 0) {
    return completeSession({ ...state, remainingSeconds }, options);
  }

  return {
    ...state,
    remainingSeconds
  };
}

export function getProgress(state: PomodoroState): number {
  if (state.totalSeconds <= 0) {
    return 1;
  }

  const elapsed = state.totalSeconds - state.remainingSeconds;
  return Math.min(1, Math.max(0, elapsed / state.totalSeconds));
}

export function formatCountdown(seconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainder = safeSeconds % 60;

  return `${minutes}:${remainder.toString().padStart(2, "0")}`;
}
