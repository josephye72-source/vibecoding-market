import { projects } from "../data/projects";
import { feedbackChannel } from "../config/releaseChannels";
import { dictionaries } from "../i18n/dictionaries";
import type { Locale } from "../i18n/types";
import { renderProjectCard } from "./ProjectCard";

export function renderHomePage(locale: Locale): string {
  const copy = dictionaries[locale];
  const projectCards = projects.map((project) => renderProjectCard(project, locale)).join("");
  const firstProject = projects[0];

  return `
    <section class="hero" aria-labelledby="home-title">
      <div class="hero__content">
        <h1 id="home-title" translate="no">Vibe Coding Market</h1>
        <p class="hero__lede">${copy.home.heroLede}</p>
        <p class="hero__answer">
          ${copy.home.heroAnswer}
        </p>
        <div class="positioning-tags" aria-label="${copy.home.tagsLabel}">
          ${copy.home.tags
            .map((tag) => `<span data-testid="positioning-tag">${tag}</span>`)
            .join("")}
        </div>
        <div class="hero__actions">
          <a class="button button--primary" href="#/projects/${firstProject.slug}">
            ${copy.home.primaryCta}
          </a>
          <a class="button button--secondary" href="#projects">${copy.home.secondaryCta}</a>
        </div>
      </div>
      <div class="hero__map" aria-hidden="true">
        <span data-motif="solar"></span>
        <span data-motif="arcade"></span>
        <span data-motif="ledger"></span>
        <span data-motif="growth"></span>
        <span data-motif="split"></span>
      </div>
    </section>

    <section class="projects" id="projects" aria-labelledby="projects-title">
      <div class="section-heading">
        <h2 id="projects-title">${copy.home.projectsTitle}</h2>
        <p>${copy.home.projectsText}</p>
      </div>
      <div class="project-grid">${projectCards}</div>
    </section>

    <section class="path" id="path" aria-labelledby="path-title" data-testid="beginner-path">
      <h2 id="path-title">${copy.home.pathTitle}</h2>
      <ol>
        ${copy.home.pathSteps
          .map(
            (step) => `
              <li>
                <strong>${step.title}</strong>
                <span>${step.text}</span>
              </li>
            `
          )
          .join("")}
      </ol>
    </section>

    <section class="map-intent" aria-labelledby="map-intent-title" data-testid="project-map-intent">
      <div class="section-heading">
        <h2 id="map-intent-title">${copy.home.mapTitle}</h2>
        <p>${copy.home.mapText}</p>
      </div>
    </section>

    <section class="feedback" id="feedback" aria-labelledby="feedback-title">
      <div>
        <h2 id="feedback-title">${copy.feedback.heading}</h2>
        <p>${copy.feedback.body}</p>
      </div>
      <button class="button button--secondary" type="button" disabled data-feedback-status="${feedbackChannel.status}">
        ${copy.feedback.pendingLabel}
      </button>
    </section>
  `;
}
