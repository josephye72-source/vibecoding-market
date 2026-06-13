import { projects, type Project } from "../data/projects";
import { getLocalizedProjectDocs } from "../data/projectDocs";
import { dictionaries, getProjectText } from "../i18n/dictionaries";
import type { Locale } from "../i18n/types";
import { escapeHtml, renderProjectMeta, renderSkillTags } from "./ProjectMeta";

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

function renderProjectDocLinks(project: Project, locale: Locale): string {
  const docs = getLocalizedProjectDocs(project.slug, locale);

  return `
    <ul class="doc-link-list">
      ${docs.map((doc) => `<li><a href="${escapeHtml(doc.href)}">${escapeHtml(doc.label)}</a></li>`).join("")}
    </ul>
  `;
}

function renderOnlineDemoBody(project: Project, locale: Locale): string {
  const copy = dictionaries[locale].projectDetail;

  return `
    <p>${copy.onlineDemoBody}</p>
    <a class="button button--primary" href="${escapeHtml(project.links.demo)}">${copy.openDemo}</a>
  `;
}

function renderCodexDocBody(project: Project, locale: Locale): string {
  const copy = dictionaries[locale].projectDetail;

  return `
    <p>${copy.codexDocBody}</p>
    ${renderProjectDocLinks(project, locale)}
  `;
}

export function findProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function renderProjectDetail(project: Project, locale: Locale): string {
  const copy = dictionaries[locale].projectDetail;
  const sectionNames = copy.sections;
  const text = getProjectText(project, locale);

  return `
    <article class="project-detail project-detail--${project.motifKey}" data-motif="${project.motifKey}">
      ${renderSection(
        sectionNames[0],
        `
          <p class="project-detail__motif">${escapeHtml(text.visualMotif)}</p>
          <h1>${escapeHtml(text.title)}</h1>
          <p class="project-detail__lede">${escapeHtml(text.effect)}</p>
          <p>${escapeHtml(text.audience)}</p>
          ${renderProjectMeta(project, locale)}
          <div class="skill-tags">${renderSkillTags(text.skills)}</div>
          <div class="detail-actions">
            <a class="button button--primary" href="${escapeHtml(project.links.demo)}">${copy.openDemo}</a>
            <a class="button button--secondary" href="${escapeHtml(project.links.source)}">${copy.viewSource}</a>
            <a class="button button--secondary" href="${escapeHtml(project.links.docs)}">${copy.followCodex}</a>
            <a class="button button--secondary" href="#feedback">${copy.feedback}</a>
          </div>
        `,
        "detail-header",
        "detail-section--hero"
      )}
      ${renderSection(
        sectionNames[1],
        renderOnlineDemoBody(project, locale),
        "online-demo"
      )}
      ${renderSection(sectionNames[2], renderList(text.learningGoals), "learning-goals")}
      ${renderSection(sectionNames[3], renderList(text.complexitySources), "complexity-sources")}
      ${renderSection(
        sectionNames[4],
        `<div>${renderList(text.sourceGuide)}</div>`,
        "source-guide"
      )}
      ${renderSection(
        sectionNames[5],
        renderCodexDocBody(project, locale),
        "codex-doc"
      )}
      ${renderSection(
        sectionNames[6],
        `
          <div class="prompt-grid">
            <article>
              <h3>${copy.promptStart}</h3>
              <p>${escapeHtml(text.promptSet.start)}</p>
            </article>
            <article>
              <h3>${copy.promptImprove}</h3>
              <p>${escapeHtml(text.promptSet.improve)}</p>
            </article>
            <article>
              <h3>${copy.promptDebug}</h3>
              <p>${escapeHtml(text.promptSet.debug)}</p>
            </article>
          </div>
        `,
        "prompt-zone"
      )}
      ${renderSection(sectionNames[7], renderList(text.faq), "faq")}
      ${renderSection(
        sectionNames[8],
        `
          <div class="remix-grid">
            ${text.remixTasks
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

export function renderDemoPending(project: Project, locale: Locale): string {
  const text = getProjectText(project, locale);

  return `
    <section class="demo-pending demo-pending--${project.motifKey}" data-motif="${project.motifKey}" aria-labelledby="demo-title">
      <p class="project-detail__motif">${escapeHtml(text.visualMotif)}</p>
      <h1 id="demo-title">${escapeHtml(text.title)} Demo</h1>
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

export function renderNotFound(locale: Locale = "zh"): string {
  const copy = dictionaries[locale].projectDetail;

  return `
    <section class="not-found" data-testid="not-found" aria-labelledby="not-found-title">
      <h1 id="not-found-title">${copy.notFoundTitle}</h1>
      <p>${copy.notFoundBody}</p>
      <a class="button button--primary" href="#/">${dictionaries[locale].shell.nav.home}</a>
    </section>
  `;
}
