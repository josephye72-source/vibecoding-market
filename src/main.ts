import { projects } from "./data/projects";
import { formatSkills } from "./lib/format";
import { getRoute } from "./lib/router";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/app.css";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("App root was not found.");
}

const appRoot = app;

function renderHome(): string {
  const projectCards = projects
    .map(
      (project) => `
        <article class="project-card" data-testid="project-card">
          <p class="project-card__motif">${project.visualMotif}</p>
          <h3>${project.title}</h3>
          <p>${project.summary}</p>
          <dl class="project-card__meta">
            <div>
              <dt>Difficulty</dt>
              <dd>${project.difficulty}</dd>
            </div>
            <div>
              <dt>Time</dt>
              <dd>${project.estimatedTime}</dd>
            </div>
          </dl>
          <p class="project-card__skills">${formatSkills(project.skills)}</p>
          <div class="project-card__actions" aria-label="${project.title} links">
            <a href="#/projects/${project.slug}/demo">Try demo</a>
            <a href="#/projects/${project.slug}">Details</a>
          </div>
        </article>
      `
    )
    .join("");

  return `
    <header class="site-header">
      <a class="site-header__brand" href="#/">Vibe Coding Market</a>
      <nav aria-label="Primary navigation">
        <a href="#projects">Projects</a>
        <a href="#path">Path</a>
      </nav>
    </header>
    <main>
      <section class="hero" aria-labelledby="home-title">
        <div class="hero__content">
          <p class="hero__label">Pure Web, no backend, no login</p>
          <h1 id="home-title">Vibe Coding Market</h1>
          <p class="hero__lede">
            Five small browser projects you can play first, understand next,
            rebuild with Codex, and then remix into your own version.
          </p>
          <div class="hero__actions">
            <a class="button button--primary" href="#/projects/focus-pomodoro">
              Start with the first project
            </a>
            <a class="button button--secondary" href="#projects">See all 5 projects</a>
          </div>
        </div>
      </section>

      <section class="path" id="path" aria-labelledby="path-title">
        <h2 id="path-title">The beginner path</h2>
        <ol>
          <li><strong>Play</strong><span>Try the finished project.</span></li>
          <li><strong>Understand</strong><span>See where the complexity lives.</span></li>
          <li><strong>Rebuild</strong><span>Follow a Codex-friendly path from zero.</span></li>
          <li><strong>Remix</strong><span>Change the idea into something personal.</span></li>
        </ol>
      </section>

      <section class="projects" id="projects" aria-labelledby="projects-title">
        <div class="section-heading">
          <h2 id="projects-title">Five launch projects</h2>
          <p>Static, local-first, and intentionally small enough to read.</p>
        </div>
        <div class="project-grid">${projectCards}</div>
      </section>
    </main>
  `;
}

function renderApp(): void {
  const route = getRoute(window.location.hash);
  appRoot.innerHTML = renderHome();

  if (route.anchor) {
    document.querySelector(route.anchor)?.scrollIntoView();
  }
}

window.addEventListener("hashchange", renderApp);
renderApp();
