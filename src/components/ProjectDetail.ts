import { projects, type Project } from "../data/projects";
import { getProjectDocs } from "../data/projectDocs";
import { escapeHtml, renderProjectMeta, renderSkillTags } from "./ProjectMeta";

const requiredSectionNames = [
  "项目头部",
  "在线体验",
  "你会学到什么",
  "复杂度从哪里来",
  "源码导览",
  "Codex 文档",
  "Prompt 区",
  "常见问题",
  "二创任务"
];

function renderList(items: string[]): string {
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function renderSection(title: string, body: string, sectionId: string, extraClass = ""): string {
  return `
    <section class="detail-section ${extraClass}" data-testid="project-detail-section" aria-labelledby="${sectionId}">
      <h2 id="${sectionId}">${title}</h2>
      ${body}
    </section>
  `;
}

function renderProjectDocLinks(project: Project): string {
  const docs = getProjectDocs(project.slug);

  return `
    <ul class="doc-link-list">
      ${docs.map((doc) => `<li><a href="${escapeHtml(doc.href)}">${escapeHtml(doc.label)}</a></li>`).join("")}
    </ul>
  `;
}

function renderOnlineDemoBody(project: Project): string {
  return `
    <p>The ${escapeHtml(project.title)} demo is live. Open it to try the core loop directly in the browser with no backend, login, database, or API.</p>
    <a class="button button--primary" href="${escapeHtml(project.links.demo)}">Open Live Demo</a>
  `;
}

function renderCodexDocBody(project: Project): string {
  return `
    <p>Use these docs to rebuild, inspect, troubleshoot, and remix ${escapeHtml(project.title)} from a blank folder.</p>
    ${renderProjectDocLinks(project)}
  `;
}

export function findProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function renderProjectDetail(project: Project): string {
  return `
    <article class="project-detail project-detail--${project.motifKey}" data-motif="${project.motifKey}">
      ${renderSection(
        requiredSectionNames[0],
        `
          <p class="project-detail__motif">${escapeHtml(project.visualMotif)}</p>
          <h1>${escapeHtml(project.title)}</h1>
          <p class="project-detail__lede">${escapeHtml(project.effect)}</p>
          <p>${escapeHtml(project.audience)}</p>
          ${renderProjectMeta(project)}
          <div class="skill-tags">${renderSkillTags(project.skills)}</div>
          <div class="detail-actions">
            <a class="button button--primary" href="${escapeHtml(project.links.demo)}">在线体验</a>
            <a class="button button--secondary" href="${escapeHtml(project.links.source)}">查看源代码</a>
            <a class="button button--secondary" href="${escapeHtml(project.links.docs)}">跟着 Codex 做</a>
          </div>
        `,
        "detail-header",
        "detail-section--hero"
      )}
      ${renderSection(
        requiredSectionNames[1],
        renderOnlineDemoBody(project),
        "online-demo"
      )}
      ${renderSection(requiredSectionNames[2], renderList(project.learningGoals), "learning-goals")}
      ${renderSection(requiredSectionNames[3], renderList(project.complexitySources), "complexity-sources")}
      ${renderSection(
        requiredSectionNames[4],
        `<div>${renderList(project.sourceGuide)}</div>`,
        "source-guide"
      )}
      ${renderSection(
        requiredSectionNames[5],
        renderCodexDocBody(project),
        "codex-doc"
      )}
      ${renderSection(
        requiredSectionNames[6],
        `
          <div class="prompt-grid">
            <article>
              <h3>起步 Prompt</h3>
              <p>${escapeHtml(project.promptSet.start)}</p>
            </article>
            <article>
              <h3>修改 Prompt</h3>
              <p>${escapeHtml(project.promptSet.improve)}</p>
            </article>
            <article>
              <h3>排错 Prompt</h3>
              <p>${escapeHtml(project.promptSet.debug)}</p>
            </article>
          </div>
        `,
        "prompt-zone"
      )}
      ${renderSection(requiredSectionNames[7], renderList(project.faq), "faq")}
      ${renderSection(
        requiredSectionNames[8],
        `
          <div class="remix-grid">
            ${project.remixTasks
              .map(
                (task) => `
                  <article>
                    <p class="remix-grid__level">${task.level}</p>
                    <h3>${escapeHtml(task.title)}</h3>
                    <p>${escapeHtml(task.description)}</p>
                  </article>
                `
              )
              .join("")}
          </div>
        `,
        "remix-tasks"
      )}
    </article>
  `;
}

export function renderDemoPending(project: Project): string {
  return `
    <section class="demo-pending demo-pending--${project.motifKey}" data-motif="${project.motifKey}" aria-labelledby="demo-title">
      <p class="project-detail__motif">${escapeHtml(project.visualMotif)}</p>
      <h1 id="demo-title">${escapeHtml(project.title)} Demo</h1>
      <p class="project-detail__lede">在线体验实现中</p>
      <p>
        Task 3 只交付首页、详情模板和 demo 路由占位。完整 demo 逻辑会在后续任务中补齐。
      </p>
      <div class="detail-actions">
        <a class="button button--primary" href="#/projects/${project.slug}">回到项目详情</a>
        <a class="button button--secondary" href="#/">回到首页</a>
      </div>
    </section>
  `;
}

export function renderNotFound(): string {
  return `
    <section class="not-found" data-testid="not-found" aria-labelledby="not-found-title">
      <h1 id="not-found-title">没有找到这个项目</h1>
      <p>回到首页，从 5 个首发项目里重新选择。</p>
      <a class="button button--primary" href="#/">回到首页</a>
    </section>
  `;
}
