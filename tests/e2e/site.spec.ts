import { expect, test } from "@playwright/test";
import { projects } from "../../src/data/projects";

test("homepage renders the title and five project cards", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /Vibe Coding Market/i })).toBeVisible();
  await expect(page.getByTestId("project-card")).toHaveCount(5);
});

test("first viewport explains the site value and primary paths", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByText("5 个纯 Web 小项目，带你用 Codex 从 0 做到可发布")
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "从第一个项目开始" })).toBeVisible();
  await expect(page.getByRole("link", { name: "先看 5 个项目" })).toBeVisible();
  await expect(page.getByTestId("positioning-tag")).toHaveCount(4);
});

test("homepage renders the four-step beginner path", async ({ page }) => {
  await page.goto("/");

  const path = page.getByTestId("beginner-path");
  await expect(path.getByText("先玩", { exact: true })).toBeVisible();
  await expect(path.getByText("看懂", { exact: true })).toBeVisible();
  await expect(path.getByText("跟做", { exact: true })).toBeVisible();
  await expect(path.getByText("二创", { exact: true })).toBeVisible();
});

test("homepage renders exactly 5 project cards", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByTestId("project-card")).toHaveCount(5);
});

for (const project of projects) {
  test(`project card for ${project.title} has the required summary and links`, async ({ page }) => {
    await page.goto("/");

    const card = page.getByTestId("project-card").filter({
      has: page.getByRole("heading", { name: project.title })
    });

    await expect(card).toBeVisible();
    await expect(card.getByTestId("project-effect")).toBeVisible();
    await expect(card.getByText(project.difficulty, { exact: true })).toBeVisible();
    await expect(card.getByText(project.estimatedTime, { exact: true })).toBeVisible();
    await expect(card.getByTestId("skill-tag")).toHaveCount(project.skills.length);
    expect(project.skills.length).toBeGreaterThanOrEqual(3);
    expect(project.skills.length).toBeLessThanOrEqual(5);
    await expect(card.getByRole("link", { name: "在线体验" })).toHaveAttribute(
      "href",
      `#/projects/${project.slug}/demo`
    );
    await expect(card.getByRole("link", { name: "查看详情" })).toHaveAttribute(
      "href",
      `#/projects/${project.slug}`
    );
  });

  test(`detail page for ${project.title} renders the 9 required sections`, async ({ page }) => {
    await page.goto(`/#/projects/${project.slug}`);

    await expect(page.getByRole("heading", { name: project.title })).toBeVisible();
    await expect(page.getByTestId("project-detail-section")).toHaveCount(9);

    for (const sectionName of [
      "项目头部",
      "在线体验",
      "你会学到什么",
      "复杂度从哪里来",
      "源码导览",
      "Codex 文档",
      "Prompt 区",
      "常见问题",
      "二创任务"
    ]) {
      await expect(page.getByRole("heading", { name: sectionName })).toBeVisible();
    }
  });
}
