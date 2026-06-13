import { renderAppShell } from "./components/AppShell";
import { renderHomePage } from "./components/HomePage";
import { findProject, renderDemoPending, renderNotFound, renderProjectDetail } from "./components/ProjectDetail";
import { mountPomodoroDemo, renderPomodoroDemo } from "./demos/pomodoro/render";
import { DEFAULT_POMODORO_DURATIONS, type PomodoroDurations } from "./demos/pomodoro/logic";
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

function renderRoute(path: string): string {
  const projectDetailMatch = path.match(/^\/projects\/([^/]+)$/);
  const projectDemoMatch = path.match(/^\/projects\/([^/]+)\/demo$/);

  if (path === "/") {
    return renderHomePage();
  }

  if (projectDetailMatch) {
    const project = findProject(projectDetailMatch[1]);
    return project ? renderProjectDetail(project) : renderNotFound();
  }

  if (projectDemoMatch) {
    const project = findProject(projectDemoMatch[1]);

    if (!project) {
      return renderNotFound();
    }

    if (project.slug === "focus-pomodoro") {
      return renderPomodoroDemo();
    }

    return renderDemoPending(project);
  }

  return renderNotFound();
}

function renderApp(): void {
  cleanupDemo?.();
  cleanupDemo = undefined;

  const route = getRoute(window.location.hash);
  appRoot.innerHTML = renderAppShell({
    content: renderRoute(route.path),
    currentPath: route.path
  });

  if (route.path === "/projects/focus-pomodoro/demo") {
    cleanupDemo = mountPomodoroDemo({ durations: getDemoDurations() });
  }

  if (route.anchor) {
    document.querySelector(route.anchor)?.scrollIntoView();
  }
}

window.addEventListener("hashchange", renderApp);
renderApp();
