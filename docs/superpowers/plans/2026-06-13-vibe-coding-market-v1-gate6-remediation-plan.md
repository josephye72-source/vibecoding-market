# Vibe Coding Market V1 Gate 6 Remediation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the current V1 release candidate back to Gate 6 by fixing the blockers from the acceptance report and satisfying `docs/superpowers/specs/2026-06-13-vibe-coding-market-v1-gate6-remediation-spec.md`.

**Architecture:** Keep the app static and pure Web. Add a small i18n layer, localized project metadata, source-entry data, and release-channel configuration; then update components, demos, docs, tests, and review evidence around those data contracts.

**Tech Stack:** Vite, TypeScript, Vitest, Playwright, HTML, CSS, localStorage, static generated source assets, no backend, no database, no third-party API.

---

## Required Context

Every worker and reviewer must read:

- `docs/reviews/acceptance/2026-06-13-v1-gate6-release-acceptance-report.md`
- `docs/superpowers/specs/2026-06-13-vibe-coding-market-v1-blueprint-revision-01.md`
- `docs/superpowers/specs/2026-06-13-vibe-coding-market-v1-gate6-remediation-spec.md`
- `docs/superpowers/specs/2026-06-13-vibe-coding-market-v1-baseline-spec.md`
- `docs/superpowers/specs/2026-06-13-vibe-coding-market-frontend-quality-tooling.md`

## Planned File Structure

- `src/i18n/types.ts` - locale types and dictionary contracts.
- `src/i18n/dictionaries.ts` - zh/en site, project, detail, docs, and demo strings.
- `src/i18n/state.ts` - localStorage-backed locale selection and `html lang` sync.
- `src/config/releaseChannels.ts` - feedback state and source entry policy.
- `src/data/projects.ts` - localized project metadata and source-entry links.
- `src/data/projectDocs.ts` - localized doc labels and doc hrefs.
- `src/data/sourceEntries.ts` - per-project source files exposed as real source entries.
- `src/components/*.ts` - shell, home, card, detail, and feedback rendering.
- `src/demos/*/render.ts` - localized demo UI and dynamic status strings.
- `src/lib/format.ts` - locale-aware number, currency, duration, and date formatting.
- `vite.config.mjs` - static source-tree middleware/build copy if source tree is chosen.
- `tests/e2e/site.spec.ts` - Gate 6 remediation acceptance tests.
- `src/**/*.test.ts` - dictionary, metadata, source, and format tests.
- `docs/projects/**` - Chinese-first reproduction docs and source guides.
- `docs/reviews/**` - updated QA, release review, feedback strategy, and re-acceptance report.

## Git Rules

- Continue on `v1-implementation` unless the owner creates a new remediation branch.
- Do not overwrite untracked acceptance docs or blueprint revision docs.
- Commit each task after tests for that task pass.
- Keep commits narrow: `docs: establish gate6 remediation baseline`, `feat: add locale foundation`, `fix: localize demo interfaces`.

## Task 1: Establish Remediation Baseline Docs

**Files:**
- Create: `docs/superpowers/specs/2026-06-13-vibe-coding-market-v1-gate6-remediation-spec.md`
- Create: `docs/superpowers/plans/2026-06-13-vibe-coding-market-v1-gate6-remediation-plan.md`
- Modify: `docs/superpowers/specs/2026-06-13-vibe-coding-market-v1-baseline-spec.md`
- Modify: `docs/superpowers/plans/2026-06-13-vibe-coding-market-v1-implementation-plan.md`
- Modify: `docs/superpowers/plans/2026-06-13-vibe-coding-market-v1-delivery-plan.md`

- [ ] **Step 1: Add status banners to old docs**

Add a top notice to the old baseline spec and old plans:

```markdown
> 状态更新，2026-06-13：本文件是历史基线。Gate 6 发布验收不通过后，
> 后续执行以 `docs/superpowers/specs/2026-06-13-vibe-coding-market-v1-blueprint-revision-01.md`
> 和 `docs/superpowers/specs/2026-06-13-vibe-coding-market-v1-gate6-remediation-spec.md`
> 为准。
```

- [ ] **Step 2: Verify the new docs reference all P1 blockers**

Run:

```powershell
rg -n "Hero|信息架构|源码入口|中英文|反馈入口|中文优先|Memory Cards|demo" docs\superpowers\specs\2026-06-13-vibe-coding-market-v1-gate6-remediation-spec.md
```

Expected: each Gate 6 blocker appears in the new spec.

- [ ] **Step 3: Commit**

```powershell
git add docs/superpowers/specs docs/superpowers/plans
git commit -m "docs: establish gate6 remediation baseline"
```

## Task 2: Rework Homepage And Information Architecture

**Files:**
- Modify: `src/components/HomePage.ts`
- Modify: `src/components/AppShell.ts`
- Modify: `src/styles/app.css`
- Modify: `tests/e2e/site.spec.ts`
- Modify: `docs/reviews/2026-06-13-v1-visual-qa.md`

- [ ] **Step 1: Write failing IA tests**

Add Playwright checks:

```ts
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
  await expect(page.getByTestId("reproduction-path")).toContainText("看源码");
  await expect(page.getByTestId("project-map-intent")).toContainText("后续");
});
```

- [ ] **Step 2: Run tests to verify RED**

Run:

```powershell
npx playwright test tests/e2e/site.spec.ts -g "homepage hero|homepage separates"
```

Expected: tests fail because the current hero and section structure still center the old 5-project identity.

- [ ] **Step 3: Implement the IA copy and sections**

Update homepage sections to this order:

1. long-term product hero;
2. V1 first batch projects;
3. reproduction path: 先体验、看懂、看源码、跟 Codex 复现、二创;
4. project-map intent;
5. feedback area.

- [ ] **Step 4: Verify**

Run:

```powershell
npm run test:run
npm run build
npx playwright test tests/e2e/site.spec.ts
```

Expected: homepage tests pass; no route smoke regression.

- [ ] **Step 5: Commit**

```powershell
git add src/components src/styles tests/e2e docs/reviews
git commit -m "feat: align homepage with project-map positioning"
```

## Task 3: Add Locale Foundation

**Files:**
- Create: `src/i18n/types.ts`
- Create: `src/i18n/dictionaries.ts`
- Create: `src/i18n/state.ts`
- Create: `src/i18n/i18n.test.ts`
- Modify: `src/main.ts`
- Modify: `src/components/AppShell.ts`
- Modify: `tests/e2e/site.spec.ts`

- [ ] **Step 1: Write failing unit tests**

Create `src/i18n/i18n.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { dictionaries, isLocale, normalizeLocale } from "./dictionaries";

describe("i18n dictionaries", () => {
  it("supports zh and en", () => {
    expect(isLocale("zh")).toBe(true);
    expect(isLocale("en")).toBe(true);
    expect(normalizeLocale("fr")).toBe("zh");
  });

  it("contains shell and homepage labels for both locales", () => {
    for (const locale of ["zh", "en"] as const) {
      expect(dictionaries[locale].shell.nav.home).toBeTruthy();
      expect(dictionaries[locale].home.heroTitle).toBeTruthy();
      expect(dictionaries[locale].feedback.heading).toBeTruthy();
    }
  });
});
```

- [ ] **Step 2: Write failing E2E tests**

Add:

```ts
test("default locale is Chinese and language switch persists", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
  await page.getByRole("button", { name: /English/ }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});
```

- [ ] **Step 3: Run tests to verify RED**

Run:

```powershell
npm run test:run -- src/i18n/i18n.test.ts
npx playwright test tests/e2e/site.spec.ts -g "default locale"
```

Expected: tests fail because no i18n layer or language switch exists.

- [ ] **Step 4: Implement locale foundation**

Implement `Locale = "zh" | "en"`, dictionaries, locale state, localStorage persistence, and `document.documentElement.lang` sync.

- [ ] **Step 5: Verify and commit**

Run:

```powershell
npm run test:run
npm run build
npx playwright test tests/e2e/site.spec.ts -g "default locale"
```

Then:

```powershell
git add src/i18n src/main.ts src/components/AppShell.ts tests/e2e
git commit -m "feat: add bilingual locale foundation"
```

## Task 4: Localize Project Metadata, Cards, Details, And Doc Labels

**Files:**
- Modify: `src/data/projects.ts`
- Modify: `src/data/projectDocs.ts`
- Modify: `src/data/projectDocs.test.ts`
- Modify: `src/components/ProjectCard.ts`
- Modify: `src/components/ProjectDetail.ts`
- Modify: `tests/e2e/site.spec.ts`

- [ ] **Step 1: Write failing data tests**

Add tests:

```ts
it("keeps every project localized for zh and en", () => {
  for (const project of projects) {
    expect(project.title.zh).toBeTruthy();
    expect(project.title.en).toBeTruthy();
    expect(project.summary.zh).toBeTruthy();
    expect(project.summary.en).toBeTruthy();
    expect(project.difficulty.zh).toMatch(/^难度 [1-3]$/);
    expect(project.difficulty.en).toMatch(/^Level [1-3]$/);
  }
});
```

- [ ] **Step 2: Write failing E2E tests**

Add:

```ts
test("project card and detail page switch visible language", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByTestId("project-card").first()).toContainText("专注番茄钟");
  await expect(page.getByTestId("project-card").first()).toContainText("难度 1");

  await page.getByRole("button", { name: /English/ }).click();
  await expect(page.getByTestId("project-card").first()).toContainText("Focus Pomodoro");
  await expect(page.getByTestId("project-card").first()).toContainText("Level 1");

  await page.getByRole("link", { name: /Focus Pomodoro/ }).first().click();
  await expect(page.getByRole("link", { name: /Open Live Demo/ })).toBeVisible();
});
```

- [ ] **Step 3: Run RED**

Run:

```powershell
npm run test:run -- src/data/projectDocs.test.ts
npx playwright test tests/e2e/site.spec.ts -g "project card and detail"
```

Expected: tests fail because metadata is currently string-only and English-first.

- [ ] **Step 4: Implement localized metadata**

Convert user-visible metadata fields to localized objects and update renderers to accept current locale.

- [ ] **Step 5: Verify and commit**

Run:

```powershell
npm run test:run
npm run build
npx playwright test
```

Then:

```powershell
git add src/data src/components tests/e2e
git commit -m "feat: localize project metadata and detail pages"
```

## Task 5: Localize All Demo Interfaces And Formatting

**Files:**
- Modify: `src/demos/pomodoro/render.ts`
- Modify: `src/demos/memory/render.ts`
- Modify: `src/demos/ledger/render.ts`
- Modify: `src/demos/habits/render.ts`
- Modify: `src/demos/split/render.ts`
- Modify: `src/lib/format.ts`
- Modify: `tests/e2e/site.spec.ts`

- [ ] **Step 1: Write failing demo language tests**

Add E2E checks for one route per demo:

```ts
test("memory demo is Chinese by default and English after switching", async ({ page }) => {
  await page.goto("/#/projects/memory-cards/demo");

  await expect(page.getByText("步数")).toBeVisible();
  await expect(page.getByRole("button", { name: "重新开始" })).toBeVisible();
  await expect(page.getByText("Moves")).toHaveCount(0);

  await page.getByRole("button", { name: /English/ }).click();
  await expect(page.getByText("Moves")).toBeVisible();
  await expect(page.getByRole("button", { name: "Restart game" })).toBeVisible();
});
```

Repeat the same pattern for Pomodoro, Ledger, Habit Grid, and Split Console with their core buttons/status labels.

- [ ] **Step 2: Run RED**

Run:

```powershell
npx playwright test tests/e2e/site.spec.ts -g "demo is Chinese"
```

Expected: tests fail because demo UI is English-first.

- [ ] **Step 3: Implement demo dictionaries**

Move demo headings, labels, statuses, button text, validation messages, aria-labels, and empty-state copy into the shared dictionary.

- [ ] **Step 4: Add locale-aware formatting**

Update amount/date/duration helpers so user-visible output uses:

- zh: `Intl.NumberFormat("zh-CN", { style: "currency", currency: "CNY" })` or neutral `¥` where suitable;
- en: existing USD/en-US style when useful for the English demo.

- [ ] **Step 5: Verify and commit**

Run:

```powershell
npm run test:run
npm run build
npx playwright test
```

Then:

```powershell
git add src/demos src/lib tests/e2e
git commit -m "fix: localize all demo interfaces"
```

## Task 6: Add Real Source Entries

**Files:**
- Create: `src/data/sourceEntries.ts`
- Create: `src/data/sourceEntries.test.ts`
- Modify: `src/data/projects.ts`
- Modify: `src/components/ProjectDetail.ts`
- Modify: `vite.config.mjs`
- Modify: `tests/e2e/site.spec.ts`
- Modify: `docs/projects/**/source-guide.md`

- [ ] **Step 1: Write failing source-entry tests**

Add:

```ts
import { describe, expect, it } from "vitest";
import { projects } from "./projects";
import { sourceEntriesByProject } from "./sourceEntries";

describe("source entries", () => {
  it("provides a real source entry for every project", () => {
    for (const project of projects) {
      expect(project.links.source).not.toContain("?section=source-guide");
      expect(project.links.source).not.toMatch(/^#\//);
      expect(sourceEntriesByProject[project.slug].files.length).toBeGreaterThanOrEqual(2);
    }
  });
});
```

- [ ] **Step 2: Write failing E2E tests**

Add:

```ts
test("all project source links point to accessible source entries", async ({ page, request }) => {
  await page.goto("/");

  for (const project of projects) {
    await page.goto(`/#/projects/${project.slug}`);
    const href = await page.getByRole("link", { name: /查看源码|View source/ }).getAttribute("href");

    expect(href).toBeTruthy();
    expect(href).not.toContain("section=source-guide");

    const response = await request.get(new URL(href ?? "", page.url()).toString());
    expect(response.status()).toBeLessThan(400);
  }
});
```

- [ ] **Step 3: Run RED**

Run:

```powershell
npm run test:run -- src/data/sourceEntries.test.ts
npx playwright test tests/e2e/site.spec.ts -g "source links"
```

Expected: tests fail because source links are currently source-guide anchors.

- [ ] **Step 4: Implement static source-tree entries**

Expose selected source files under a static route such as `/source/<project-slug>/index.html` or `/source/<project-slug>/<file>.txt`. Use a Vite dev middleware plus build copy step so the same URLs work locally and after `vite build`.

- [ ] **Step 5: Update source guides**

Each source guide must explain:

- the real source entry URL;
- the project core files;
- which files to read first;
- which parts are safe for beginners to edit.

- [ ] **Step 6: Verify and commit**

Run:

```powershell
npm run test:run
npm run build
npx playwright test
```

Then:

```powershell
git add src/data src/components vite.config.mjs tests/e2e docs/projects
git commit -m "feat: expose real source entries"
```

## Task 7: Make Project Docs Chinese-First

**Files:**
- Modify: `docs/projects/pomodoro/*.md`
- Modify: `docs/projects/memory/*.md`
- Modify: `docs/projects/ledger/*.md`
- Modify: `docs/projects/habits/*.md`
- Modify: `docs/projects/split/*.md`
- Modify: `src/data/projectDocs.test.ts`

- [ ] **Step 1: Write failing doc-language tests**

Add:

```ts
it("keeps project docs Chinese-first", () => {
  for (const docPath of allProjectDocPaths) {
    const content = readFileSync(docPath, "utf8");
    expect(content).toMatch(/[一-龥]/);
    expect(content.split("\n")[0]).toMatch(/[一-龥]|Codex|FAQ/);
  }
});
```

- [ ] **Step 2: Run RED**

Run:

```powershell
npm run test:run -- src/data/projectDocs.test.ts
```

Expected: tests fail for English-first docs.

- [ ] **Step 3: Rewrite docs**

For each project, make these files Chinese-first:

- `codex-from-zero.md`
- `source-guide.md`
- `complexity-map.md`
- `faq.md`
- `remix-prompts.md`

Keep file paths, command names, `Codex`, `GitHub`, `localStorage`, and source filenames in English where they are technical terms.

- [ ] **Step 4: Verify and commit**

Run:

```powershell
npm run test:run
npm run build
```

Then:

```powershell
git add docs/projects src/data/projectDocs.test.ts
git commit -m "docs: make project guides Chinese first"
```

## Task 8: Replace X-Bound Feedback With Pending Strategy State

**Files:**
- Create: `src/config/releaseChannels.ts`
- Modify: `src/components/HomePage.ts`
- Modify: `src/components/ProjectDetail.ts`
- Modify: `src/lib/router.ts`
- Modify: `tests/e2e/site.spec.ts`
- Modify: `docs/reviews/2026-06-13-v1-feedback-plan.md`

- [ ] **Step 1: Write failing feedback tests**

Add:

```ts
test("feedback entry is present but not bound to X while strategy is pending", async ({ page }) => {
  await page.goto("/");

  const feedback = page.locator(".feedback");
  await expect(feedback).toContainText("反馈方式准备中");
  await expect(feedback).toContainText("最感兴趣项目");
  await expect(feedback.locator('a[href*="x.com/intent/post"]')).toHaveCount(0);
});

test("project detail page exposes the feedback entry", async ({ page }) => {
  await page.goto("/#/projects/focus-pomodoro");
  await expect(page.getByRole("link", { name: /反馈|Feedback/ })).toBeVisible();
});
```

- [ ] **Step 2: Run RED**

Run:

```powershell
npx playwright test tests/e2e/site.spec.ts -g "feedback"
```

Expected: tests fail because feedback currently links to X.

- [ ] **Step 3: Implement pending feedback state**

Use `releaseChannels.ts`:

```ts
export const feedbackChannel = {
  status: "pending",
  requiredQuestions: ["最感兴趣项目", "是否愿意复现", "卡住位置", "二创想法"]
} as const;
```

Render a clear in-page explanation instead of an external X intent link.

- [ ] **Step 4: Verify and commit**

Run:

```powershell
npm run test:run
npm run build
npx playwright test
```

Then:

```powershell
git add src/config src/components src/lib tests/e2e docs/reviews
git commit -m "fix: mark feedback channel as pending"
```

## Task 9: Rebuild QA And Release Re-acceptance Evidence

**Files:**
- Create: `docs/reviews/2026-06-13-v1-i18n-qa.md`
- Create: `docs/reviews/acceptance/2026-06-13-v1-gate6-release-rereview-acceptance-report.md`
- Modify: `docs/reviews/2026-06-13-v1-release-review.md`
- Modify: `docs/reviews/2026-06-13-v1-visual-qa.md`
- Modify: `README.md`
- Modify: `package.json` if scripts need new checks.

- [ ] **Step 1: Add final e2e acceptance tests**

Confirm `tests/e2e/site.spec.ts` covers:

- default Chinese;
- language switching;
- homepage long-term identity;
- V1 first-batch section;
- five source links accessible;
- no default X feedback link;
- 390px, 768px, 1440px route checks;
- no console errors.

- [ ] **Step 2: Run full verification**

Run:

```powershell
npm run test:run
npm run build
npm run test:e2e
git diff --check
git status --short --branch
```

Expected:

- all tests pass;
- build passes;
- diff check has no output;
- working tree contains only intended final review docs before commit.

- [ ] **Step 3: Write re-acceptance report**

The new report must include:

- exact HEAD under review;
- previous Gate 6 failure summary;
- status of each old blocker: closed / still open;
- verification command results;
- remaining risks;
- clear public-release recommendation: pass or fail.

- [ ] **Step 4: Commit**

```powershell
git add README.md package.json docs/reviews tests/e2e
git commit -m "docs: prepare gate6 rereview package"
```

## Final Gate Before Asking For Re-review

- Run `npm run verify` if available, otherwise run `npm run test:run`, `npm run build`, and `npm run test:e2e`.
- Run `git diff --check`.
- Run `git status --short --branch`.
- Ask a spec reviewer subagent to compare the implementation against `2026-06-13-vibe-coding-market-v1-gate6-remediation-spec.md`.
- Ask a code quality reviewer subagent to review the full remediation diff.
- Do not claim Gate 6 is passed until the new acceptance report says it is passed.
