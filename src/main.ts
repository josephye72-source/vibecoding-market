import { renderAppShell } from "./components/AppShell";
import { renderHomePage } from "./components/HomePage";
import { findProject, renderDemoPending, renderNotFound, renderProjectDetail } from "./components/ProjectDetail";
import { getRoute } from "./lib/router";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/app.css";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("App root was not found.");
}

const appRoot = app;

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
    return project ? renderDemoPending(project) : renderNotFound();
  }

  return renderNotFound();
}

function renderApp(): void {
  const route = getRoute(window.location.hash);
  appRoot.innerHTML = renderAppShell({
    content: renderRoute(route.path),
    currentPath: route.path
  });

  if (route.anchor) {
    document.querySelector(route.anchor)?.scrollIntoView();
  }
}

window.addEventListener("hashchange", renderApp);
renderApp();
