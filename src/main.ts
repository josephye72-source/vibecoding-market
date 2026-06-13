import { renderAppShell } from "./components/AppShell";
import { renderHomePage } from "./components/HomePage";
import { findProject, renderDemoPending, renderNotFound, renderProjectDetail } from "./components/ProjectDetail";
import { mountHabitDemo, renderHabitDemo } from "./demos/habits/render";
import { mountLedgerDemo, renderLedgerDemo } from "./demos/ledger/render";
import { mountMemoryDemo, renderMemoryDemo } from "./demos/memory/render";
import { mountPomodoroDemo, renderPomodoroDemo } from "./demos/pomodoro/render";
import { DEFAULT_POMODORO_DURATIONS, type PomodoroDurations } from "./demos/pomodoro/logic";
import { mountSplitDemo, renderSplitDemo } from "./demos/split/render";
import { nextLocale, getStoredLocale, storeLocale, syncDocumentLocale, type Locale } from "./i18n/state";
import { getRoute } from "./lib/router";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/app.css";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("App root was not found.");
}

const appRoot = app;
let cleanupDemo: (() => void) | undefined;
let currentLocale: Locale = getStoredLocale();

declare global {
  interface ImportMeta {
    readonly env: {
      readonly DEV: boolean;
    };
  }

  interface Window {
    __VCM_POMODORO_TEST_DURATIONS__?: Partial<PomodoroDurations>;
  }
}

function getDemoDurations(): PomodoroDurations {
  if (import.meta.env.DEV) {
    const devDurations = window.__VCM_POMODORO_TEST_DURATIONS__;
    const focus = Number(devDurations?.focus);
    const shortBreak = Number(devDurations?.break);

    if (Number.isFinite(focus) && focus > 0 && Number.isFinite(shortBreak) && shortBreak > 0) {
      return {
        focus: Math.floor(focus),
        break: Math.floor(shortBreak)
      };
    }
  }

  return DEFAULT_POMODORO_DURATIONS;
}

function renderRoute(path: string, locale: Locale): string {
  const projectDetailMatch = path.match(/^\/projects\/([^/]+)$/);
  const projectDemoMatch = path.match(/^\/projects\/([^/]+)\/demo$/);

  if (path === "/") {
    return renderHomePage(locale);
  }

  if (projectDetailMatch) {
    const project = findProject(projectDetailMatch[1]);
    return project ? renderProjectDetail(project, locale) : renderNotFound(locale);
  }

  if (projectDemoMatch) {
    const project = findProject(projectDemoMatch[1]);

    if (!project) {
      return renderNotFound(locale);
    }

    if (project.slug === "focus-pomodoro") {
      return renderPomodoroDemo(locale);
    }

    if (project.slug === "memory-cards") {
      return renderMemoryDemo(locale);
    }

    if (project.slug === "tiny-ledger") {
      return renderLedgerDemo(locale);
    }

    if (project.slug === "habit-grid") {
      return renderHabitDemo(locale);
    }

    if (project.slug === "split-console") {
      return renderSplitDemo(locale);
    }

    return renderDemoPending(project, locale);
  }

  return renderNotFound(locale);
}

function renderApp(): void {
  cleanupDemo?.();
  cleanupDemo = undefined;
  syncDocumentLocale(currentLocale);

  const route = getRoute(window.location.hash);
  appRoot.innerHTML = renderAppShell({
    content: renderRoute(route.path, currentLocale),
    currentPath: route.path,
    locale: currentLocale
  });

  appRoot.querySelector<HTMLButtonElement>("[data-locale-toggle]")?.addEventListener("click", () => {
    currentLocale = nextLocale(currentLocale);
    storeLocale(currentLocale);
    renderApp();
  });

  if (route.path === "/projects/focus-pomodoro/demo") {
    cleanupDemo = mountPomodoroDemo({ durations: getDemoDurations(), locale: currentLocale });
  }

  if (route.path === "/projects/memory-cards/demo") {
    cleanupDemo = mountMemoryDemo(currentLocale);
  }

  if (route.path === "/projects/tiny-ledger/demo") {
    cleanupDemo = mountLedgerDemo(currentLocale);
  }

  if (route.path === "/projects/habit-grid/demo") {
    cleanupDemo = mountHabitDemo(currentLocale);
  }

  if (route.path === "/projects/split-console/demo") {
    cleanupDemo = mountSplitDemo(currentLocale);
  }

  if (route.anchor) {
    document.querySelector(route.anchor)?.scrollIntoView();
  }
}

window.addEventListener("hashchange", renderApp);
renderApp();
