import {
  DEFAULT_POMODORO_DURATIONS,
  createPomodoroState,
  formatCountdown,
  getProgress,
  getTodayKey,
  pauseTimer,
  resetTimer,
  startTimer,
  switchMode,
  tickTimer,
  type PomodoroDurations,
  type PomodoroMode,
  type PomodoroState
} from "./logic";

export type PomodoroDemoOptions = {
  durations?: PomodoroDurations;
  today?: string;
};

const modeLabels: Record<PomodoroMode, string> = {
  focus: "Focus",
  break: "Break"
};

function dialOffset(progress: number): number {
  return Math.round(565.48 * (1 - progress));
}

function statusLabel(status: PomodoroState["status"]): string {
  if (status === "idle") {
    return "ready";
  }

  return status;
}

export function renderPomodoroDemo(): string {
  return `
    <section class="pomodoro-demo" data-testid="pomodoro-demo" aria-labelledby="pomodoro-title">
      <div class="pomodoro-demo__intro">
        <p class="project-detail__motif">Solar Dial / 专注计时舱</p>
        <h1 id="pomodoro-title">Focus Pomodoro</h1>
        <p class="project-detail__lede">Start one focus round, watch the dial move, and keep today's completed count on this browser.</p>
      </div>

      <div class="pomodoro-demo__panel">
        <div class="pomodoro-dial" aria-hidden="true">
          <svg viewBox="0 0 220 220" role="img">
            <circle class="pomodoro-dial__track" cx="110" cy="110" r="90"></circle>
            <circle class="pomodoro-dial__progress" data-pomodoro-dial cx="110" cy="110" r="90"></circle>
          </svg>
          <div class="pomodoro-dial__center">
            <span data-testid="pomodoro-countdown" data-pomodoro-countdown>25:00</span>
            <span data-pomodoro-mode-label>Focus mode</span>
          </div>
        </div>

        <div class="pomodoro-controls" aria-label="Pomodoro controls">
          <div class="pomodoro-mode-switch" role="group" aria-label="Timer mode">
            <button class="pomodoro-mode-button" type="button" data-pomodoro-mode="focus" aria-pressed="true">Focus</button>
            <button class="pomodoro-mode-button" type="button" data-pomodoro-mode="break" aria-pressed="false">Break</button>
          </div>

          <div class="pomodoro-actions">
            <button class="button button--primary" type="button" data-pomodoro-action="start">Start</button>
            <button class="button button--secondary" type="button" data-pomodoro-action="pause">Pause</button>
            <button class="button button--secondary" type="button" data-pomodoro-action="reset">Reset</button>
          </div>

          <div class="pomodoro-progress" data-testid="pomodoro-progress" role="progressbar" aria-label="Timer progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
            <span data-pomodoro-progress-fill></span>
          </div>

          <dl class="pomodoro-stats">
            <div>
              <dt>Status</dt>
              <dd data-testid="pomodoro-status" data-pomodoro-status>ready</dd>
            </div>
            <div>
              <dt>Completed Today</dt>
              <dd data-testid="pomodoro-completed-count" data-pomodoro-completed>0</dd>
            </div>
          </dl>

          <p class="pomodoro-live" role="status" aria-live="polite" data-pomodoro-message>Ready to start.</p>
        </div>
      </div>
    </section>
  `;
}

export function mountPomodoroDemo(options: PomodoroDemoOptions = {}): () => void {
  const root = document.querySelector<HTMLElement>("[data-testid='pomodoro-demo']");

  if (!root) {
    return () => undefined;
  }

  const durations = options.durations ?? DEFAULT_POMODORO_DURATIONS;
  const today = options.today ?? getTodayKey();
  let state = createPomodoroState({ durations, today });

  const countdown = root.querySelector<HTMLElement>("[data-pomodoro-countdown]");
  const modeLabel = root.querySelector<HTMLElement>("[data-pomodoro-mode-label]");
  const progress = root.querySelector<HTMLElement>("[data-testid='pomodoro-progress']");
  const progressFill = root.querySelector<HTMLElement>("[data-pomodoro-progress-fill]");
  const dial = root.querySelector<SVGCircleElement>("[data-pomodoro-dial]");
  const status = root.querySelector<HTMLElement>("[data-pomodoro-status]");
  const completed = root.querySelector<HTMLElement>("[data-pomodoro-completed]");
  const message = root.querySelector<HTMLElement>("[data-pomodoro-message]");
  const modeButtons = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-pomodoro-mode]"));
  const actionButtons = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-pomodoro-action]"));
  let intervalId: number | undefined;

  function stopInterval(): void {
    if (intervalId !== undefined) {
      window.clearInterval(intervalId);
      intervalId = undefined;
    }
  }

  function paint(): void {
    const progressValue = getProgress(state);
    const progressPercent = Math.round(progressValue * 100);

    if (countdown) {
      countdown.textContent = formatCountdown(state.remainingSeconds);
    }

    if (modeLabel) {
      modeLabel.textContent = `${modeLabels[state.mode]} mode`;
    }

    if (progress) {
      progress.setAttribute("aria-valuenow", String(progressPercent));
    }

    if (progressFill) {
      progressFill.style.inlineSize = `${progressPercent}%`;
    }

    if (dial) {
      dial.style.strokeDashoffset = String(dialOffset(progressValue));
    }

    if (status) {
      status.textContent = statusLabel(state.status);
    }

    if (completed) {
      completed.textContent = String(state.completedToday);
    }

    if (message) {
      message.textContent = state.message;
    }

    for (const button of modeButtons) {
      button.setAttribute("aria-pressed", String(button.dataset.pomodoroMode === state.mode));
    }
  }

  function startInterval(): void {
    stopInterval();
    intervalId = window.setInterval(() => {
      state = tickTimer(state, 1, { durations, today });
      paint();

      if (state.status === "complete") {
        stopInterval();
      }
    }, 1000);
  }

  for (const button of modeButtons) {
    button.addEventListener("click", () => {
      stopInterval();
      state = switchMode(state, button.dataset.pomodoroMode as PomodoroMode, durations);
      paint();
    });
  }

  for (const button of actionButtons) {
    button.addEventListener("click", () => {
      const action = button.dataset.pomodoroAction;

      if (action === "start") {
        state = startTimer(state);
        if (state.status === "running") {
          startInterval();
        }
      }

      if (action === "pause") {
        state = pauseTimer(state);
        stopInterval();
      }

      if (action === "reset") {
        state = resetTimer(state, durations);
        stopInterval();
      }

      paint();
    });
  }

  paint();

  return stopInterval;
}
