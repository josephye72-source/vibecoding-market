import type { Project } from "../data/projects";
import { dictionaries, getProjectText } from "../i18n/dictionaries";
import type { Locale } from "../i18n/types";
import { escapeHtml, renderSkillTags } from "./ProjectMeta";

export function renderProjectCard(project: Project, locale: Locale): string {
  const copy = dictionaries[locale];
  const text = getProjectText(project, locale);

  return `
    <article
      class="project-card project-card--${project.motifKey}"
      data-testid="project-card"
      data-motif="${project.motifKey}"
    >
      <p class="project-card__motif">${escapeHtml(text.visualMotif)}</p>
      <h3>${escapeHtml(text.title)}</h3>
      <p class="project-card__role">${escapeHtml(text.role)}</p>
      <p class="project-card__effect" data-testid="project-effect">${escapeHtml(text.effect)}</p>
      <dl class="project-card__meta">
        <div>
          <dt>${copy.projectCard.difficulty}</dt>
          <dd>${escapeHtml(text.difficulty)}</dd>
        </div>
        <div>
          <dt>${copy.projectCard.time}</dt>
          <dd>${escapeHtml(text.estimatedTime)}</dd>
        </div>
      </dl>
      <div class="skill-tags" aria-label="${escapeHtml(copy.projectCard.skillsLabel.replace("{title}", text.title))}">
        ${renderSkillTags(text.skills)}
      </div>
      <div class="project-card__actions" aria-label="${escapeHtml(copy.projectCard.linksLabel.replace("{title}", text.title))}">
        <a href="${escapeHtml(project.links.demo)}">${copy.projectCard.demo}</a>
        <a href="#/projects/${project.slug}">${copy.projectCard.detail}</a>
      </div>
    </article>
  `;
}
