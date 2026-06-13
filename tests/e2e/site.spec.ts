import { expect, test, type Locator, type Page } from "@playwright/test";
import { projects } from "../../src/data/projects";
import { sourceEntriesByProject } from "../../src/data/sourceEntries";

type ProjectLinks = {
  demo?: string;
  source?: string;
  docs?: string;
};

type ViewportCheck = {
  label: string;
  width: number;
  height: number;
};

const homepageViewports: ViewportCheck[] = [
  { label: "390px", width: 390, height: 900 },
  { label: "768px", width: 768, height: 1000 },
  { label: "1440px", width: 1440, height: 1000 }
];

const routeViewports: ViewportCheck[] = [
  { label: "390px", width: 390, height: 900 },
  { label: "768px", width: 768, height: 1000 },
  { label: "1440px", width: 1440, height: 1000 }
];

function linksFor(project: (typeof projects)[number]): ProjectLinks {
  return (project as { links?: ProjectLinks }).links ?? {};
}

function primaryRoutePaths(): string[] {
  return [
    "/",
    ...projects.flatMap((project) => [
      `/#/projects/${project.slug}`,
      `/#/projects/${project.slug}/demo`
    ])
  ];
}

async function useEnglishLocale(page: Page): Promise<void> {
  await page.addInitScript(() => {
    window.localStorage.setItem("vcm:locale", "en");
  });
}

async function expectMinimumTouchTarget(locator: Locator): Promise<void> {
  const box = await locator.boundingBox();

  expect(box, "control should have a visible bounding box").not.toBeNull();
  expect(box?.width ?? 0, "control width should meet the 44px touch target").toBeGreaterThanOrEqual(
    44
  );
  expect(
    box?.height ?? 0,
    "control height should meet the 44px touch target"
  ).toBeGreaterThanOrEqual(44);
}

async function expectNoMainHorizontalOverflow(page: Page): Promise<void> {
  const overflow = await page.evaluate(() => {
    const main = document.querySelector("main");
    const offenders = Array.from(document.querySelectorAll("main *"))
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          className: element.className?.toString() ?? "",
          tagName: element.tagName.toLowerCase(),
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width)
        };
      })
      .filter((item) => item.width > 0 && (item.left < -1 || item.right > window.innerWidth + 1))
      .slice(0, 5);

    return {
      bodyScrollWidth: document.body.scrollWidth,
      documentScrollWidth: document.documentElement.scrollWidth,
      mainClientWidth: main?.clientWidth ?? 0,
      mainScrollWidth: main?.scrollWidth ?? 0,
      offenders,
      viewportWidth: window.innerWidth
    };
  });

  expect(overflow.offenders, JSON.stringify(overflow, null, 2)).toEqual([]);
  expect(overflow.documentScrollWidth, JSON.stringify(overflow, null, 2)).toBeLessThanOrEqual(
    overflow.viewportWidth + 1
  );
  expect(overflow.bodyScrollWidth, JSON.stringify(overflow, null, 2)).toBeLessThanOrEqual(
    overflow.viewportWidth + 1
  );
  expect(overflow.mainScrollWidth, JSON.stringify(overflow, null, 2)).toBeLessThanOrEqual(
    overflow.mainClientWidth + 1
  );
}

async function expectKeyboardFocusReachable(
  page: Page,
  target: Locator,
  maxTabs = 32
): Promise<void> {
  await expect(target).toBeVisible();
  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  });

  for (let index = 0; index < maxTabs; index += 1) {
    await page.keyboard.press("Tab");
    const isFocused = await target.evaluate((element) => element === document.activeElement);

    if (isFocused) {
      const focusStyle = await target.evaluate((element) => {
        const style = window.getComputedStyle(element);
        return {
          boxShadow: style.boxShadow,
          outlineStyle: style.outlineStyle,
          outlineWidth: style.outlineWidth
        };
      });

      const hasOutline = focusStyle.outlineStyle !== "none" && focusStyle.outlineWidth !== "0px";
      const hasHalo = focusStyle.boxShadow !== "none";

      expect(hasOutline || hasHalo, JSON.stringify(focusStyle)).toBe(true);
      return;
    }
  }

  throw new Error(
    `Expected ${await target.evaluate((element) => element.outerHTML)} to receive Tab focus`
  );
}

async function prepareDemoRoute(page: Page, slug: string): Promise<void> {
  await useEnglishLocale(page);

  if (slug === "focus-pomodoro") {
    await page.addInitScript(() => {
      window.__VCM_POMODORO_TEST_DURATIONS__ = { focus: 2, break: 2 };
    });
  }

  if (slug === "memory-cards") {
    await page.addInitScript(() => {
      window.__VCM_MEMORY_TEST_ORDER__ = [
        "01",
        "10",
        "01",
        "</>",
        "10",
        "</>",
        "{}",
        "=>",
        "{}",
        "[]",
        "=>",
        "[]"
      ];
    });
  }

  if (slug === "habit-grid") {
    await page.clock.setFixedTime(new Date("2026-06-13T12:00:00"));
  }

  if (slug === "split-console") {
    await page.addInitScript(() => {
      window.__VCM_CLIPBOARD_WRITE__ = () => Promise.resolve();
    });
  }
}

async function exerciseDemoCoreControls(page: Page, slug: string): Promise<Locator> {
  if (slug === "focus-pomodoro") {
    const start = page.getByRole("button", { name: "Start" });
    await expectMinimumTouchTarget(start);
    await start.click();
    await expect(page.getByTestId("pomodoro-status")).toContainText("running");
    await page.getByRole("button", { name: "Pause" }).click();
    await expect(page.getByTestId("pomodoro-status")).toContainText("paused");
    await page.getByRole("button", { name: "Reset" }).click();
    await expect(page.getByTestId("pomodoro-status")).toContainText("ready");
    await page.getByRole("button", { name: "Break" }).click();
    await expect(page.getByRole("button", { name: "Break" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    return start;
  }

  if (slug === "memory-cards") {
    const restart = page.getByRole("button", { name: /restart game/i });
    const firstCard = page.getByTestId("memory-card").first();
    await expectMinimumTouchTarget(firstCard);
    await firstCard.click();
    await expect(firstCard.locator("span")).not.toHaveText("?");
    await restart.click();
    await expect(page.getByTestId("memory-moves")).toContainText("0");
    return restart;
  }

  if (slug === "tiny-ledger") {
    const amount = page.getByLabel("Amount");
    const addFirst = page.getByRole("button", { name: /add first record/i });
    const addRecord = page.getByRole("button", { name: /^Add record$/i });
    await expectMinimumTouchTarget(addFirst);
    await addFirst.click();
    await expect(amount).toBeFocused();
    await amount.fill("42");
    await page.getByLabel("Note").fill("Mobile QA");
    await addRecord.click();
    await expect(page.getByTestId("ledger-record")).toHaveCount(1);
    return amount;
  }

  if (slug === "habit-grid") {
    const day = page.getByRole("button", { name: /^2026-06-13/ });
    await expectMinimumTouchTarget(day);
    await day.click();
    await expect(page.getByTestId("habit-monthly-count")).toContainText("1");
    return day;
  }

  if (slug === "split-console") {
    const total = page.getByLabel("Total");
    const copy = page.getByRole("button", { name: /copy summary/i });
    await total.fill("90");
    await page.getByLabel("Participants").fill("Ava, Bo, Cy");
    await expect(page.getByTestId("split-per-person")).toContainText("$30.00");
    await expectMinimumTouchTarget(copy);
    await copy.click();
    await expect(page.getByRole("status")).toContainText(/copied/i);
    return total;
  }

  throw new Error(`Unsupported demo slug: ${slug}`);
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

test("homepage hero presents the long-term project-map identity", async ({ page }) => {
  await page.goto("/");
  const hero = page.locator(".hero");

  await expect(hero).toContainText("公开");
  await expect(hero).toContainText("公益");
  await expect(hero).toContainText("可复现");
  await expect(hero).toContainText("项目地图");
  await expect(hero).not.toContainText("5 个纯 Web 小项目，带你用 Codex 从 0 做到可发布");
});

test("homepage separates long-term identity from the V1 first batch", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /V1 首批项目|当前首批项目/ })).toBeVisible();
  await expect(page.getByTestId("beginner-path")).toContainText("看源码");
  await expect(page.getByTestId("project-map-intent")).toContainText("后续");
});

test("homepage renders a five-step beginner path", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByTestId("beginner-path").locator("li")).toHaveCount(5);
});

test("homepage feedback entry is present but not bound to X while strategy is pending", async ({
  page
}) => {
  await page.goto("/");

  const feedback = page.locator(".feedback");

  await expect(feedback).toContainText("最感兴趣项目");
  await expect(feedback).toContainText("是否愿意复现");
  await expect(feedback).toContainText("卡住位置");
  await expect(feedback).toContainText("二创想法");
  await expect(feedback).toContainText("反馈方式准备中");
  await expect(feedback.locator('a[href*="x.com/intent/post"]')).toHaveCount(0);
  await expect(feedback.locator('a[href="https://github.com/"]')).toHaveCount(0);
});

test("default locale is Chinese and language switch persists", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
  await expect(page.getByTestId("project-card").first()).toContainText("专注番茄钟");

  await page.getByRole("button", { name: /English/ }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByTestId("project-card").first()).toContainText("Focus Pomodoro");

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("memory demo is Chinese by default and English after switching", async ({ page }) => {
  await page.goto("/#/projects/memory-cards/demo");

  await expect(page.getByText("步数")).toBeVisible();
  await expect(page.getByRole("button", { name: "重新开始" })).toBeVisible();
  await expect(page.getByText("Moves")).toHaveCount(0);

  await page.getByRole("button", { name: /English/ }).click();
  await expect(page.getByText("Moves")).toBeVisible();
  await expect(page.getByRole("button", { name: "Restart game" })).toBeVisible();
});

test("English detail page does not reuse Chinese project body copy", async ({ page }) => {
  await page.goto("/#/projects/focus-pomodoro");

  await page.getByRole("button", { name: /English/ }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { name: "Focus Pomodoro" })).toBeVisible();

  const mainText = await page.locator("main").innerText();
  expect(mainText).not.toMatch(/[\u3400-\u9fff]/);
});

test("default Chinese locale localizes ledger and habit dynamic demo copy", async ({ page }) => {
  await page.goto("/#/projects/tiny-ledger/demo");

  await expect(page.getByLabel("分类")).toContainText("工作");
  await expect(page.getByText("Work")).toHaveCount(0);
  await page.getByLabel("金额").fill("42");
  await page.getByLabel("备注").fill("中文验收");
  await page.getByRole("button", { name: /^添加记录$/ }).click();
  await expect(page.locator("[data-ledger-storage-status]")).toContainText("已保存");
  await expect(page.locator("[data-ledger-storage-status]")).not.toContainText("Record");

  await page.clock.setFixedTime(new Date("2026-06-13T12:00:00"));
  await page.goto("/#/projects/habit-grid/demo");
  await page.getByRole("button", { name: /^2026-06-13/ }).click();
  await expect(page.locator("[data-habit-storage-status]")).toContainText("已保存");
  await expect(page.locator("[data-habit-storage-status]")).not.toContainText("Check-in");
});

test("default Chinese locale localizes key accessibility labels", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator('nav[aria-label="主导航"]')).toHaveCount(1);
  await expect(page.locator('[aria-label="Primary navigation"]')).toHaveCount(0);
  await expect(page.locator('[aria-label="站点定位"]')).toHaveCount(1);

  await page.goto("/#/projects/focus-pomodoro/demo");
  await expect(page.locator('[aria-label="番茄钟控制"]')).toHaveCount(1);
  await expect(page.locator('[aria-label="Pomodoro controls"]')).toHaveCount(0);
  await expect(page.locator('[aria-label="计时进度"]')).toHaveCount(1);
});

for (const viewport of homepageViewports) {
  test(`homepage is visually available at ${viewport.label}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/");

    await expect(page.getByRole("heading", { name: /Vibe Coding Market/i })).toBeVisible();
    await expect(page.locator(".hero__lede")).toBeVisible();
    await expect(page.locator(".hero").locator(`a[href="#/projects/${projects[0].slug}"]`)).toBeVisible();
    await expect(page.getByTestId("project-card")).toHaveCount(5);

    if (viewport.width === 390) {
      await expectNoMainHorizontalOverflow(page);
    }
  });
}

for (const project of projects) {
  test(`project card for ${project.title} has the required summary and links`, async ({
    page
  }) => {
    const links = linksFor(project);
    await useEnglishLocale(page);
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
    await useEnglishLocale(page);
    await page.goto(`/#/projects/${project.slug}`);

    await expect(page.getByRole("heading", { name: project.title })).toBeVisible();
    await expect(page.getByTestId("project-detail-section")).toHaveCount(9);
    await expect(page.locator(`a[href="${linksFor(project).demo ?? ""}"]`).first()).toBeVisible();
    await expect(page.locator(`a[href="${linksFor(project).source ?? ""}"]`)).toBeVisible();
    await expect(page.locator(`a[href="${linksFor(project).docs ?? ""}"]`)).toBeVisible();
  });

  for (const viewport of routeViewports) {
    test(`detail page for ${project.title} is responsive at ${viewport.label}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await useEnglishLocale(page);
      await page.goto(`/#/projects/${project.slug}`);

      await expect(page.getByRole("heading", { name: project.title })).toBeVisible();
      await expect(page.getByTestId("project-detail-section")).toHaveCount(9);
      await expect(page.locator(`a[href="${linksFor(project).demo ?? ""}"]`).first()).toBeVisible();
      await expect(page.locator(`a[href="${linksFor(project).source ?? ""}"]`).first()).toBeVisible();
      await expect(page.locator(`a[href="${linksFor(project).docs ?? ""}"]`).first()).toBeVisible();

      if (viewport.width === 390) {
        await expectNoMainHorizontalOverflow(page);
      }
    });

    test(`demo for ${project.title} has core controls at ${viewport.label}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await prepareDemoRoute(page, project.slug);
      await page.goto(`/#/projects/${project.slug}/demo`);

      await expect(page.getByRole("heading", { name: project.title })).toBeVisible();
      const focusTarget = await exerciseDemoCoreControls(page, project.slug);

      if (viewport.width === 390) {
        await expectNoMainHorizontalOverflow(page);
      }

      await expectKeyboardFocusReachable(page, focusTarget);
    });
  }
}

test("project documentation links resolve from the static app", async ({ page }) => {
  await useEnglishLocale(page);
  await page.goto("/#/projects/memory-cards");

  const docLink = page.getByRole("link", { name: "Source Guide" });
  await expect(docLink).toHaveAttribute("href", "/docs/projects/memory/source-guide.md");

  const response = await page.request.get("/docs/projects/memory/source-guide.md");
  expect(response.ok()).toBe(true);
  const sourceGuide = await response.text();
  expect(sourceGuide).toContain("记忆翻牌：源码导览");
  expect(sourceGuide).not.toContain("Memory Cards Source Guide");
});

test("project source entries resolve from the static app", async ({ page }) => {
  for (const project of projects) {
    const sourceEntry = sourceEntriesByProject[project.slug];

    expect(sourceEntry).toBeDefined();
    const response = await page.request.get(sourceEntry.indexHref);

    expect(response.ok()).toBe(true);
    const body = await response.text();
    expect(body).toContain(`# ${project.slug} source entry`);

    for (const sourceFile of sourceEntry.files) {
      expect(body).toContain(`## ${sourceFile.repoPath}`);
    }
  }
});

test("project documentation middleware rejects malformed and directory requests", async ({
  page
}) => {
  const malformedResponse = await page.request.get("/docs/projects/%E0%A4%A");
  expect(malformedResponse.status()).toBe(400);

  const directoryResponse = await page.request.get("/docs/projects/memory");
  expect(directoryResponse.status()).toBe(404);

  const malformedSourceResponse = await page.request.get("/source/%E0%A4%A");
  expect(malformedSourceResponse.status()).toBe(400);

  const extraSourcePathResponse = await page.request.get("/source/memory-cards/index.txt/extra");
  expect(extraSourcePathResponse.status()).toBe(404);
});

test("focus pomodoro demo supports the closed-loop timer path", async ({ page }) => {
  await useEnglishLocale(page);
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
  await useEnglishLocale(page);
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

test("memory cards demo safely renders symbol-like card text", async ({ page }) => {
  await useEnglishLocale(page);
  await page.addInitScript(() => {
    window.__VCM_MEMORY_TEST_ORDER__ = ["01", "10", "01", "</>", "10", "</>", "{}", "=>", "{}", "[]", "=>", "[]"];
  });
  await page.goto("/#/projects/memory-cards/demo");

  const cards = page.getByTestId("memory-card");

  await cards.nth(3).click();
  await expect(cards.nth(3).locator("span")).toHaveText("</>");
});

test("tiny ledger demo adds, deletes, totals, persists, and shows empty state", async ({
  page
}) => {
  await useEnglishLocale(page);
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
  await useEnglishLocale(page);
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
  await useEnglishLocale(page);
  await page.addInitScript(() => {
    window.__VCM_CLIPBOARD_WRITE__ = () => Promise.resolve();
  });
  await page.goto("/#/projects/split-console/demo");

  await expect(page.getByRole("heading", { name: /Split Console/i })).toBeVisible();
  await expect(page.locator(".project-detail__motif")).toContainText("Split Console");

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

test("split console copy action has a distinct disabled affordance before valid input", async ({
  page
}) => {
  await useEnglishLocale(page);
  await page.goto("/#/projects/split-console/demo");

  const copy = page.getByRole("button", { name: /Copy summary/i });
  await expect(copy).toBeDisabled();

  const disabledStyle = await copy.evaluate((element) => {
    const style = window.getComputedStyle(element);

    return {
      backgroundColor: style.backgroundColor,
      boxShadow: style.boxShadow,
      color: style.color,
      cursor: style.cursor
    };
  });

  await page.getByLabel("Total").fill("90");
  await page.getByLabel("Participants").fill("Ava, Bo, Cy");
  await expect(copy).toBeEnabled();
  await expect
    .poll(() => copy.evaluate((element) => window.getComputedStyle(element).backgroundColor))
    .not.toBe(disabledStyle.backgroundColor);
  await expect
    .poll(() => copy.evaluate((element) => window.getComputedStyle(element).boxShadow))
    .not.toBe(disabledStyle.boxShadow);

  const enabledStyle = await copy.evaluate((element) => {
    const style = window.getComputedStyle(element);

    return {
      backgroundColor: style.backgroundColor,
      boxShadow: style.boxShadow,
      color: style.color,
      cursor: style.cursor
    };
  });

  expect(disabledStyle.color).not.toBe("rgba(0, 0, 0, 0)");
  expect(disabledStyle.cursor).toBe("not-allowed");
  expect(disabledStyle.backgroundColor).not.toBe(enabledStyle.backgroundColor);
  expect(disabledStyle.boxShadow).not.toBe(enabledStyle.boxShadow);
});

test("split console reports when clipboard copy is unavailable", async ({ page }) => {
  await useEnglishLocale(page);
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
    await useEnglishLocale(page);
    await page.goto(hash);
    await expect(page.getByRole("heading", { name: "Focus Pomodoro" })).toBeVisible();
  }

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

test("keyboard Tab reaches homepage primary controls with visible focus", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto("/");

  await expectKeyboardFocusReachable(
    page,
    page.locator(".hero").locator(`a[href="#/projects/${projects[0].slug}"]`)
  );
});

test("route smoke has no console errors across home, detail, and demo routes", async ({ page }) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  const routes = primaryRoutePaths();

  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(`${page.url()}: ${message.text()}`);
    }
  });
  page.on("pageerror", (error) => {
    pageErrors.push(`${page.url()}: ${error.message}`);
  });

  for (const viewport of routeViewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });

    for (const route of routes) {
      await page.goto(route);
      await expect(page.locator("main")).toBeVisible();
    }
  }

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

test("main content has no horizontal overflow at 390px on primary routes", async ({ page }) => {
  const routes = primaryRoutePaths();

  await page.setViewportSize({ width: 390, height: 900 });

  for (const route of routes) {
    await page.goto(route);
    await expectNoMainHorizontalOverflow(page);
  }
});

test("unknown routes render the fallback page", async ({ page }) => {
  await page.goto("/#/projects/not-a-project");

  await expect(page.getByTestId("not-found")).toBeVisible();
});
