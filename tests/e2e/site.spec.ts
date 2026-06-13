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

}

test("project documentation links resolve from the static app", async ({ page }) => {
  await page.goto("/#/projects/memory-cards");

  const docLink = page.getByRole("link", { name: "Source Guide" });
  await expect(docLink).toHaveAttribute("href", "/docs/projects/memory/source-guide.md");

  const response = await page.request.get("/docs/projects/memory/source-guide.md");
  expect(response.ok()).toBe(true);
  expect(await response.text()).toContain("Memory Cards Source Guide");
});

test("focus pomodoro demo supports the closed-loop timer path", async ({ page }) => {
  await page.addInitScript(() => {
    window.__VCM_POMODORO_TEST_DURATIONS__ = { focus: 2, break: 2 };
  });
  await page.goto("/#/projects/focus-pomodoro/demo");

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

  await page.getByRole("button", { name: "Start" }).click();
  await page.waitForTimeout(2200);
  await expect(page.getByTestId("pomodoro-completed-count")).toContainText("1");

  await page.reload();
  await expect(page.getByTestId("pomodoro-completed-count")).toContainText("1");
});

test("memory cards demo supports matching, mismatch feedback, victory, and restart", async ({
  page
}) => {
  await page.addInitScript(() => {
    window.__VCM_MEMORY_TEST_ORDER__ = ["01", "10", "01", "</>", "10", "</>", "{}", "=>", "{}", "[]", "=>", "[]"];
  });
  await page.goto("/#/projects/memory-cards/demo");

  await expect(page.getByRole("heading", { name: /Memory Cards/i })).toBeVisible();
  await expect(page.getByText(/Neon Arcade Lab/i)).toBeVisible();
  await expect(page.getByTestId("memory-card")).toHaveCount(12);
  await expect(page.getByTestId("memory-moves")).toContainText("0");
  await expect(page.locator("[data-pair]")).toHaveCount(0);

  const cards = page.getByTestId("memory-card");

  await cards.nth(0).click();
  await expect(cards.nth(0)).toContainText("01");
  await cards.nth(1).click();
  await expect(cards.nth(1)).toContainText("10");
  await expect(page.getByRole("status")).toContainText(/try again/i);
  await expect(page.getByTestId("memory-moves")).toContainText("1");
  await page.waitForTimeout(700);

  await cards.nth(0).click();
  await cards.nth(2).click();
  await expect(page.getByRole("status")).toContainText(/match/i);

  for (const [first, second] of [
    [1, 4],
    [3, 5],
    [6, 8],
    [7, 10],
    [9, 11]
  ]) {
    await cards.nth(first).click();
    await cards.nth(second).click();
  }

  await expect(page.getByRole("status")).toContainText(/all pairs/i);
  await page.getByRole("button", { name: /restart/i }).click();
  await expect(page.getByTestId("memory-moves")).toContainText("0");
});

test("tiny ledger demo adds, deletes, totals, persists, and shows empty state", async ({
  page
}) => {
  await page.goto("/#/projects/tiny-ledger/demo");

  await expect(page.getByRole("heading", { name: /Tiny Ledger/i })).toBeVisible();
  await expect(page.getByText(/Receipt Ledger/i)).toBeVisible();
  await expect(page.getByTestId("ledger-empty")).toContainText(/No records yet/i);
  await expect(page.getByRole("button", { name: /Add first record/i })).toBeVisible();

  await page.getByLabel("Type").selectOption("income");
  await page.getByLabel("Amount").fill("100");
  await page.getByLabel("Category").selectOption("Work");
  await page.getByLabel("Note").fill("Invoice");
  await page.getByLabel("Date").fill("2026-06-13");
  await page.getByRole("button", { name: /^Add record$/i }).click();

  await page.getByLabel("Type").selectOption("expense");
  await page.getByLabel("Amount").fill("35");
  await page.getByLabel("Category").selectOption("Food");
  await page.getByLabel("Note").fill("Dinner");
  await page.getByLabel("Date").fill("2026-06-13");
  await page.getByRole("button", { name: /^Add record$/i }).click();

  await page.getByLabel("Amount").fill("1");
  await page.getByLabel("Category").selectOption("Work");
  await page.getByLabel("Note").fill("<img src=x onerror=alert(1)>");
  await page.getByLabel("Date").fill("2026-06-13");
  await page.getByRole("button", { name: /^Add record$/i }).click();

  await expect(page.getByTestId("ledger-record")).toHaveCount(3);
  await expect(page.getByTestId("ledger-income")).toContainText("$101.00");
  await expect(page.getByTestId("ledger-expense")).toContainText("$35.00");
  await expect(page.getByTestId("ledger-balance")).toContainText("$66.00");
  await expect(
    page.getByTestId("ledger-record").filter({ hasText: "<img src=x onerror=alert(1)>" })
  ).toBeVisible();
  await expect(page.locator("img")).toHaveCount(0);

  await page.reload();
  await expect(page.getByTestId("ledger-record")).toHaveCount(3);

  await page.getByRole("button", { name: /Delete Dinner/i }).click();
  await expect(page.getByTestId("ledger-record")).toHaveCount(2);
});

test("habit grid demo toggles a date, shows stats, and persists after refresh", async ({
  page
}) => {
  await page.clock.setFixedTime(new Date("2026-06-13T12:00:00"));
  await page.goto("/#/projects/habit-grid/demo");

  await expect(page.getByRole("heading", { name: /Habit Grid/i })).toBeVisible();
  await expect(page.getByText(/Growth Grid/i)).toBeVisible();
  await expect(page.getByTestId("habit-day")).toHaveCount(30);
  await expect(page.getByTestId("habit-feedback")).toContainText(/No check-ins yet/i);

  await page.getByRole("button", { name: /13/ }).first().click();

  await expect(page.getByTestId("habit-monthly-count")).toContainText("1");
  await expect(page.getByTestId("habit-feedback")).toContainText(/checked/i);

  await page.reload();
  await expect(page.getByTestId("habit-monthly-count")).toContainText("1");
});

test("split console demo calculates immediately, blocks invalid input, and copies summary", async ({
  page
}) => {
  await page.addInitScript(() => {
    window.__VCM_CLIPBOARD_WRITE__ = () => Promise.resolve();
  });
  await page.goto("/#/projects/split-console/demo");

  await expect(page.getByRole("heading", { name: /Split Console/i })).toBeVisible();
  await expect(page.getByText(/Split Console \/ /i)).toBeVisible();

  await page.getByLabel("Total").fill("120");
  await page.getByLabel("Participants").fill("Ava, Bo, Cy");
  await expect(page.getByTestId("split-per-person")).toContainText("$40.00");
  await expect(page.getByTestId("split-summary")).toContainText("Ava, Bo, Cy");

  await page.getByLabel("Total").fill("-1");
  await expect(page.getByRole("alert")).toContainText(/positive total/i);
  await expect(page.getByTestId("split-per-person")).toContainText("--");

  await page.getByLabel("Total").fill("");
  await page.getByLabel("Items").fill("12, 8\n10");
  await page.getByLabel("Participants").fill("Ava, Bo");
  await expect(page.getByTestId("split-per-person")).toContainText("$15.00");
  await page.getByRole("button", { name: /Copy summary/i }).click();
  await expect(page.getByRole("status")).toContainText(/copied/i);

  await page.getByLabel("Items").fill("12, abc, -8, 8");
  await expect(page.getByRole("alert")).toContainText(/positive numbers only/i);
  await expect(page.getByTestId("split-per-person")).toContainText("--");
  await expect(page.getByRole("button", { name: /Copy summary/i })).toBeDisabled();
});

test("split console reports when clipboard copy is unavailable", async ({ page }) => {
  await page.addInitScript(() => {
    window.__VCM_CLIPBOARD_WRITE__ = () => Promise.reject(new Error("blocked"));
  });
  await page.goto("/#/projects/split-console/demo");

  await page.getByLabel("Total").fill("60");
  await page.getByLabel("Participants").fill("Ava, Bo");
  await expect(page.getByTestId("split-summary")).toContainText("$30.00 each");
  await page.getByRole("button", { name: /Copy summary/i }).click();
  await expect(page.getByRole("status")).toContainText(/Copy unavailable/i);
  await expect(page.getByTestId("split-summary")).toContainText("Ava, Bo");
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
