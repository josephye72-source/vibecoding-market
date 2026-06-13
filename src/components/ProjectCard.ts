import type { Project } from "../data/projects";
import { escapeHtml, renderSkillTags } from "./ProjectMeta";

export function renderProjectCard(project: Project): string {
  return `
    <article
      class="project-card project-card--${project.motifKey}"
      data-testid="project-card"
      data-motif="${project.motifKey}"
    >
      <p class="project-card__motif">${escapeHtml(project.visualMotif)}</p>
      <h3>${escapeHtml(project.title)}</h3>
      <p class="project-card__role">${escapeHtml(project.role)}</p>
      <p class="project-card__effect" data-testid="project-effect">${escapeHtml(project.effect)}</p>
      <dl class="project-card__meta">
        <div>
          <dt>难度</dt>
          <dd>${escapeHtml(project.difficulty)}</dd>
        </div>
        <div>
          <dt>时间</dt>
          <dd>${escapeHtml(project.estimatedTime)}</dd>
        </div>
      </dl>
      <div class="skill-tags" aria-label="${escapeHtml(project.title)} core skills">
        ${renderSkillTags(project.skills)}
      </div>
      <div class="project-card__actions" aria-label="${escapeHtml(project.title)} links">
        <a href="${escapeHtml(project.links.demo)}">在线体验</a>
        <a href="#/projects/${project.slug}">查看详情</a>
      </div>
    </article>
  `;
}
