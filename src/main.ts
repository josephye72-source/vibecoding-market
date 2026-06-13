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

function getDemoDurations(hash: string): PomodoroDurations {
  const [, query = ""] = hash.replace(/^#/, "").split("?");
  const params = new URLSearchParams(query);
  const testDuration = Number(params.get("testDuration"));

  if (Number.isFinite(testDuration) && testDuration > 0) {
    return {
      focus: Math.floor(testDuration),
      break: Math.max(1, Math.floor(testDuration))
    };
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
    cleanupDemo = mountPomodoroDemo({ durations: getDemoDurations(window.location.hash) });
  }

  if (route.anchor) {
    document.querySelector(route.anchor)?.scrollIntoView();
  }
}

window.addEventListener("hashchange", renderApp);
renderApp();
