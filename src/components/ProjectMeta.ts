import type { Project } from "../data/projects";
import { dictionaries, getProjectText } from "../i18n/dictionaries";
import type { Locale } from "../i18n/types";

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function renderSkillTags(skills: string[]): string {
  return skills
    .map((skill) => `<span class="skill-tag" data-testid="skill-tag">${escapeHtml(skill)}</span>`)
    .join("");
}

export function renderProjectMeta(project: Project, locale: Locale): string {
  const copy = dictionaries[locale].projectDetail;
  const text = getProjectText(project, locale);

  return `
    <dl class="project-meta" aria-label="${escapeHtml(copy.metadataLabel.replace("{title}", text.title))}">
      <div>
        <dt>${copy.difficulty}</dt>
        <dd>${escapeHtml(text.difficulty)}</dd>
      </div>
      <div>
        <dt>${copy.estimatedTime}</dt>
        <dd>${escapeHtml(text.estimatedTime)}</dd>
      </div>
      <div>
        <dt>${copy.role}</dt>
        <dd>${escapeHtml(text.role)}</dd>
      </div>
      <div>
        <dt>${copy.visualMotif}</dt>
        <dd>${escapeHtml(text.visualMotif)}</dd>
      </div>
    </dl>
  `;
}
