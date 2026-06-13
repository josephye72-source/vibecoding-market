import { expect, test } from "@playwright/test";
import { projects } from "../../src/data/projects";

type ProjectLinks = {
  demo?: string;
  source?: string;
  docs?: string;
};

function linksFor(project: (typeof projects)[number]): ProjectLinks {
  return (project as { links?: ProjectLinks }).links ?? {};
}

test("homepage first viewport renders site value, primary paths, tags, and cards", async ({
  page
}) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /Vibe Coding Market/i })).toBeVisible();
  await expect(page.locator(".hero__lede")).toBeVisible();
  await expect(page.locator(".hero").locator(`a[href="#/projects/${projects[0].slug}"]`)).toBeVisible();
  await expect(page.locator(".hero").locator('a[href="#projects"]')).toBeVisible();
  await expect(page.getByTestId("positioning-tag")).toHaveCount(4);
  await expect(page.getByTestId("project-card")).toHaveCount(5);
});

test("homepage renders a four-step beginner path", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByTestId("beginner-path").locator("li")).toHaveCount(4);
});

for (const project of projects) {
  test(`project card for ${project.title} has the required summary and links`, async ({
    page
  }) => {
    const links = linksFor(project);
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
    await expect(card.locator(`a[href="${links.demo ?? ""}"]`)).toBeVisible();
    await expect(card.locator(`a[href="#/projects/${project.slug}"]`)).toBeVisible();
  });

  test(`detail page for ${project.title} renders the 9 required sections`, async ({
    page
  }) => {
    await page.goto(`/#/projects/${project.slug}`);

    await expect(page.getByRole("heading", { name: project.title })).toBeVisible();
    await expect(page.getByTestId("project-detail-section")).toHaveCount(9);
    await expect(page.locator(`a[href="${linksFor(project).demo ?? ""}"]`).first()).toBeVisible();
    await expect(page.locator(`a[href="${linksFor(project).source ?? ""}"]`)).toBeVisible();
    await expect(page.locator(`a[href="${linksFor(project).docs ?? ""}"]`)).toBeVisible();
  });

  test(`demo route for ${project.title} renders implementation pending state`, async ({
    page
  }) => {
    test.skip(project.slug === "focus-pomodoro", "Focus Pomodoro has a real Task 4 demo.");

    const links = linksFor(project);

    await page.goto(`/${links.demo ?? `#/projects/${project.slug}/demo`}`);

    await expect(page.getByRole("heading", { name: `${project.title} Demo` })).toBeVisible();
    await expect(page.getByText("Task 3")).toBeVisible();
  });
}

test("focus pomodoro demo supports the closed-loop timer path", async ({ page }) => {
  await page.goto("/#/projects/focus-pomodoro/demo?testDuration=2");

  await expect(page.getByRole("heading", { name: /Focus Pomodoro/i })).toBeVisible();
  await expect(page.getByText(/Solar Dial/i)).toBeVisible();
  await expect(page.getByRole("button", { name: "Start" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Pause" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Reset" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Focus" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("button", { name: "Break" })).toBeVisible();
  await expect(page.getByTestId("pomodoro-countdown")).toBeVisible();
  await expect(page.getByTestId("pomodoro-progress")).toBeVisible();

  await page.getByRole("button", { name: "Break" }).click();
  await expect(page.getByRole("button", { name: "Break" })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Focus" }).click();

  await page.getByRole("button", { name: "Start" }).click();
  await expect(page.getByTestId("pomodoro-status")).toContainText("running");
  await page.getByRole("button", { name: "Pause" }).click();
  await expect(page.getByTestId("pomodoro-status")).toContainText("paused");
  await page.getByRole("button", { name: "Reset" }).click();
  await expect(page.getByTestId("pomodoro-status")).toContainText("ready");

  await page.getByRole("button", { name: "Start" }).click();
  await expect(page.getByRole("status")).toContainText("Focus session complete", {
    timeout: 4000
  });
  await expect(page.getByTestId("pomodoro-completed-count")).toContainText("1");

  await page.reload();
  await expect(page.getByTestId("pomodoro-completed-count")).toContainText("1");
});

test("malformed and unknown section anchors do not break project rendering", async ({
  page
}) => {
  const pageErrors: string[] = [];
  const consoleErrors: string[] = [];

  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });

  for (const hash of [
    "/#/projects/focus-pomodoro?section=]",
    "/#/projects/focus-pomodoro?section=missing-section"
  ]) {
    await page.goto(hash);
    await expect(page.getByRole("heading", { name: "Focus Pomodoro" })).toBeVisible();
  }

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

test("unknown routes render the fallback page", async ({ page }) => {
  await page.goto("/#/projects/not-a-project");

  await expect(page.getByTestId("not-found")).toBeVisible();
});
