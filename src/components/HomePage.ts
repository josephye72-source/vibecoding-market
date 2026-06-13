import { projects } from "../data/projects";
import { renderProjectCard } from "./ProjectCard";

const pathSteps = [
  { title: "先玩", text: "先打开成品，知道最终会做出什么。" },
  { title: "看懂", text: "看复杂度从哪里来，不先背概念。" },
  { title: "跟做", text: "用 Codex 从空文件夹一步步复现。" },
  { title: "二创", text: "换主题、加小功能，做成自己的版本。" }
];

const positioningTags = ["公益", "开源", "无需登录", "无后端"];
const feedbackTopic = "VibeCodingMarketV1";
const feedbackPostText = `#${feedbackTopic}
1. 最感兴趣项目：
2. 是否愿意复现：
3. 卡住位置：
4. 二创想法：`;
const feedbackHref = `https://x.com/intent/post?hashtags=${feedbackTopic}&text=${encodeURIComponent(
  feedbackPostText
)}`;

export function renderHomePage(): string {
  const projectCards = projects.map((project) => renderProjectCard(project)).join("");
  const firstProject = projects[0];

  return `
    <section class="hero" aria-labelledby="home-title">
      <div class="hero__content">
        <h1 id="home-title" translate="no">Vibe Coding Market</h1>
        <p class="hero__lede">5 个纯 Web 小项目，带你用 Codex 从 0 做到可发布</p>
        <p class="hero__answer">
          给编程小白的一条公开复现路径：先体验成品，再看懂结构，然后跟着提示词做出自己的网页作品。
        </p>
        <div class="positioning-tags" aria-label="Site positioning">
          ${positioningTags
            .map((tag) => `<span data-testid="positioning-tag">${tag}</span>`)
            .join("")}
        </div>
        <div class="hero__actions">
          <a class="button button--primary" href="#/projects/${firstProject.slug}">
            从第一个项目开始
          </a>
          <a class="button button--secondary" href="#projects">先看 5 个项目</a>
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

    <section class="path" id="path" aria-labelledby="path-title" data-testid="beginner-path">
      <h2 id="path-title">新手路径</h2>
      <ol>
        ${pathSteps
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

    <section class="projects" id="projects" aria-labelledby="projects-title">
      <div class="section-heading">
        <h2 id="projects-title">5 个首发项目</h2>
        <p>全部是浏览器里能运行、能阅读源码、能被 Codex 复现的纯 Web 小项目。</p>
      </div>
      <div class="project-grid">${projectCards}</div>
    </section>

    <section class="feedback" id="feedback" aria-labelledby="feedback-title">
      <div>
        <h2 id="feedback-title">反馈入口</h2>
        <p>用公开话题告诉我们四件事：最感兴趣项目、是否愿意复现、卡住位置、二创想法。</p>
      </div>
      <a class="button button--secondary" href="${feedbackHref}" target="_blank" rel="noreferrer">
        发布话题反馈
      </a>
    </section>
  `;
}
