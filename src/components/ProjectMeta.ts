import type { Project } from "../data/projects";

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

export function renderProjectMeta(project: Project): string {
  return `
    <dl class="project-meta" aria-label="${escapeHtml(project.title)} metadata">
      <div>
        <dt>难度</dt>
        <dd>${escapeHtml(project.difficulty)}</dd>
      </div>
      <div>
        <dt>预计复现时间</dt>
        <dd>${escapeHtml(project.estimatedTime)}</dd>
      </div>
      <div>
        <dt>路径角色</dt>
        <dd>${escapeHtml(project.role)}</dd>
      </div>
      <div>
        <dt>视觉母题</dt>
        <dd>${escapeHtml(project.visualMotif)}</dd>
      </div>
    </dl>
  `;
}
