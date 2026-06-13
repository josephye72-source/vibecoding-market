# Vibe Coding Market V1 Finalization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the final V1 public-beta pass by turning the homepage into the first version of the long-term project map, adding the public GitHub repository entry, preserving the V1 scope boundary, and preparing the accepted result to land on `main`.

**Architecture:** Keep the app as a static Vite site with no backend, database, login, external API, search system, submission system, ranking, or community feature. Treat the homepage as a long-term map shell: current V1 projects are the first active lane, while future lanes are visible as prepared-but-not-active map areas. Keep existing project detail pages, demos, source text entries, and reproduction docs intact unless they need a link or copy adjustment for the GitHub entry.

**Tech Stack:** Vite, TypeScript, vanilla HTML rendering, CSS, Vitest, Playwright, GitHub public repository.

---

## 1. Ownership Boundary

This plan is for the V1 execution team. The Strategy Session owner does not modify product code in this phase.

| Owner | Responsibilities |
|---|---|
| User | Approve the visual direction before implementation; assign the execution team; decide when to publicly announce the public beta. |
| V1 execution team | Modify homepage code, copy, styles, i18n, tests, and screenshots according to this handoff. |
| Strategy Session owner | Maintain blueprint, roadmap, acceptance matrix, GitHub repository configuration, final acceptance report, and final `main` branch/default-branch setup after acceptance. |

## 2. Decisions Already Made

- Public release label: `V1.0 public beta`.
- Do not claim that the path has been externally validated by real beginners yet.
- Feedback entry remains pending and must not jump to X.
- No V2/V3 functions in this pass: no search, filtering, user submission, ranking, comments, accounts, database, or community system.
- Public GitHub repository already exists: `https://github.com/josephye72-source/vibecoding-market`.
- Final accepted GitHub version must land on `main`; current implementation work may happen on a working branch, but public-facing stable code should not remain only on `v1-implementation`.

## 3. Recommended Visual Direction

### Route A: Project Atlas / 轨道地图

Recommendation: use Route A for V1 Finalization.

Core idea:

- Homepage feels like a project atlas rather than a list of five cards.
- Current V1 projects appear as the first active route.
- Future project families appear as muted route nodes or lanes marked `准备中` / `Coming soon`.
- The visual language borrows from metro maps, technical atlases, and studio wall maps, without becoming a dashboard or a course catalog.

Why it fits:

- It directly expresses the long-term project-map idea.
- It can preserve the current high-visual V1 project cards.
- It scales naturally into V2 paths without implementing V2 filtering now.
- It avoids an Apple-like generic landing page and avoids a plain card grid.

Must include:

- Active lane: V1 首批项目 / V1 first batch.
- Future lanes: 游戏路径、实用工具、创作工具、学习辅助、数据小工具.
- Status language: `已开放` for current V1, `准备中` for future lanes.
- Lightweight map markers, lane lines, or route blocks.
- No clickable fake filters or fake unavailable controls.

### Route B: Studio Anthology / 策展图册

Use only if Route A feels too technical.

Core idea:

- Homepage feels like a curated creative anthology.
- Current projects are presented as a first chapter.
- Future project families become chapter tabs or issue sections marked `准备中`.

Risk:

- Easier to slide back into “five polished project cards plus copy.”
- Needs stronger structure to communicate the long-term map.

### Route C: Signal Console / 信号控制台

Use only if the team wants a more technical expression.

Core idea:

- Homepage feels like a controlled launch console for learning paths.
- Current V1 projects are active signals; future paths are dimmed status modules.

Risk:

- Can become too dashboard-like and less welcoming for beginners.
- Must avoid pretending there are live systems, accounts, or data feeds.

## 4. Files And Responsibilities

Expected execution files:

- Modify `src/components/HomePage.ts`: restructure homepage sections and render the long-term map.
- Modify `src/i18n/dictionaries.ts`: add Chinese and English copy for roadmap, statuses, GitHub entry, and future lanes.
- Modify `src/i18n/types.ts` only if new localized structures need explicit typing.
- Modify or create `src/data/homeRoadmap.ts`: centralize homepage roadmap lane data if this keeps `HomePage.ts` readable.
- Modify `src/config/releaseChannels.ts`: add the public source repository URL if the execution team chooses config-based linking.
- Modify `src/styles/app.css`: implement Route A visual structure, responsive layout, and remove or replace `.map-intent` as a thin copy-only module.
- Modify `tests/e2e/site.spec.ts`: add E2E coverage for the long-term map, GitHub entry, feedback pending, and mobile layout.
- Modify relevant unit tests if new data structures are created.

Do not modify:

- Demo logic unless a failing test proves the finalization work broke a demo.
- Project count.
- Project detail structure except for a clearly needed GitHub link/copy adjustment.
- Feedback functionality beyond preserving pending state.

## 5. Development Tasks

### Task 1: Confirm Baseline And Branch

**Files:**
- No product file changes.

- [ ] **Step 1: Confirm branch and clean state**

Run:

```powershell
git status -sb
git branch --show-current
```

Expected:

- Working tree is clean before implementation starts.
- Work happens on a development branch, not directly on a public final branch.

- [ ] **Step 2: Confirm current verification baseline**

Run:

```powershell
npm run verify
```

Expected:

- Existing tests pass before finalization changes begin.

### Task 2: Lock Product Requirements With Tests First

**Files:**
- Modify: `tests/e2e/site.spec.ts`
- Optional Modify: `src/i18n/i18n.test.ts`

- [ ] **Step 1: Add or update homepage E2E requirements**

Add Playwright expectations covering these behaviors:

- Homepage contains a long-term project-map section, not only a single future-copy paragraph.
- The map shows current V1 as active/open.
- Future lanes are visible and marked as preparing/coming soon.
- The old thin phrase-only module does not remain the only long-term map expression.
- GitHub repository link is visible and points to `https://github.com/josephye72-source/vibecoding-market`.
- Feedback entry remains pending and does not link to X.
- Default locale remains Chinese and English switch still works.

Suggested test names:

```ts
test("homepage renders the long-term project atlas with active and future lanes", async ({ page }) => {
  await page.goto("/");

  const atlas = page.getByTestId("project-atlas");
  await expect(atlas).toBeVisible();
  await expect(atlas).toContainText(/V1 首批项目|V1 first batch/);
  await expect(atlas).toContainText(/已开放|Open/);
  await expect(atlas).toContainText(/游戏路径|Game path/);
  await expect(atlas).toContainText(/实用工具|Utility tools/);
  await expect(atlas).toContainText(/创作工具|Creative tools/);
  await expect(atlas).toContainText(/学习辅助|Learning aids/);
  await expect(atlas).toContainText(/数据小工具|Data tools/);
  await expect(atlas).toContainText(/准备中|Coming soon/);
});

test("homepage exposes the public GitHub repository without replacing source entries", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("link", { name: /GitHub|源码仓库|Source repo/i })).toHaveAttribute(
    "href",
    "https://github.com/josephye72-source/vibecoding-market"
  );

  await page.goto("#/projects/memory-cards");
  await expect(page.getByRole("link", { name: /查看源码|View source/ })).toHaveAttribute(
    "href",
    "/source/memory-cards/index.txt"
  );
});
```

- [ ] **Step 2: Run the focused E2E tests and confirm they fail**

Run:

```powershell
npx playwright test tests/e2e/site.spec.ts -g "project atlas|GitHub repository"
```

Expected:

- New tests fail before implementation because the long-term atlas and GitHub entry are not yet present.

### Task 3: Add Homepage Roadmap Data

**Files:**
- Create or Modify: `src/data/homeRoadmap.ts`
- Modify: `src/i18n/dictionaries.ts`
- Modify: `src/i18n/types.ts` if needed
- Test: `src/i18n/i18n.test.ts` or a new focused data test

- [ ] **Step 1: Define active and future lanes**

Recommended data shape:

```ts
export type HomeRoadmapLaneStatus = "open" | "preparing";

export type HomeRoadmapLane = {
  id: "v1" | "games" | "utilities" | "creative" | "learning" | "data";
  status: HomeRoadmapLaneStatus;
  projectSlugs: string[];
};

export const homeRoadmapLanes: HomeRoadmapLane[] = [
  { id: "v1", status: "open", projectSlugs: ["focus-pomodoro", "memory-cards", "tiny-ledger", "habit-grid", "split-console"] },
  { id: "games", status: "preparing", projectSlugs: ["memory-cards"] },
  { id: "utilities", status: "preparing", projectSlugs: ["focus-pomodoro", "tiny-ledger", "habit-grid", "split-console"] },
  { id: "creative", status: "preparing", projectSlugs: [] },
  { id: "learning", status: "preparing", projectSlugs: [] },
  { id: "data", status: "preparing", projectSlugs: [] }
];
```

The exact implementation may differ, but it must keep future lanes lightweight and non-interactive.

- [ ] **Step 2: Add localized lane copy**

Chinese labels:

- `V1 首批项目`
- `游戏路径`
- `实用工具`
- `创作工具`
- `学习辅助`
- `数据小工具`
- `已开放`
- `准备中`
- `源码仓库`

English labels:

- `V1 first batch`
- `Game path`
- `Utility tools`
- `Creative tools`
- `Learning aids`
- `Data tools`
- `Open`
- `Coming soon`
- `Source repo`

- [ ] **Step 3: Verify i18n remains complete**

Run:

```powershell
npm run test:run -- src/i18n/i18n.test.ts
```

Expected:

- Chinese and English dictionaries both include homepage, roadmap, feedback, project detail, and demo labels.
- English project detail copy remains free of Chinese fallback text.

### Task 4: Rebuild Homepage Information Architecture

**Files:**
- Modify: `src/components/HomePage.ts`
- Modify: `src/styles/app.css`
- Modify: `src/i18n/dictionaries.ts`

- [ ] **Step 1: Replace thin map-intent copy with an actual map section**

The homepage should render these sections in this order:

1. Long-term product hero.
2. Project atlas / long-term map section.
3. V1 first-batch projects.
4. Rebuild path.
5. Feedback pending entry.

The project atlas section must have a stable test id:

```html
<section class="project-atlas" data-testid="project-atlas" aria-labelledby="project-atlas-title">
```

- [ ] **Step 2: Keep the V1 first-batch section explicit**

The project cards remain the current first batch. The copy must make clear:

- these five are the first public-beta sample;
- they do not define the long-term boundary of the site;
- users can start with one project now.

- [ ] **Step 3: Keep feedback pending**

Feedback must remain a disabled or clearly pending entry:

- no X intent link;
- no fake form;
- no GitHub issue creation unless the product owner later approves it.

### Task 5: Add Public GitHub Repository Entry

**Files:**
- Modify: `src/config/releaseChannels.ts` or create a small source config file.
- Modify: `src/components/HomePage.ts`
- Modify: `src/i18n/dictionaries.ts`
- Test: `tests/e2e/site.spec.ts`

- [ ] **Step 1: Add repository URL as centralized config**

Recommended:

```ts
export const sourceRepository = {
  url: "https://github.com/josephye72-source/vibecoding-market"
} as const;
```

- [ ] **Step 2: Add visible repository entry**

The GitHub entry can appear in the hero action group or near the project atlas. It must be visible without making GitHub the primary CTA.

Requirements:

- Link text in Chinese mode includes `GitHub` or `源码仓库`.
- Link text in English mode includes `GitHub` or `Source repo`.
- Link opens the public repository.
- Existing per-project source links stay as `/source/<project>/index.txt`.

- [ ] **Step 3: Confirm E2E coverage**

Run:

```powershell
npx playwright test tests/e2e/site.spec.ts -g "GitHub repository"
```

Expected:

- GitHub entry is visible and points to the public repo.
- Per-project source entry remains the static source index.

### Task 6: Implement Route A Visual System

**Files:**
- Modify: `src/styles/app.css`
- Modify: `src/components/HomePage.ts`

- [ ] **Step 1: Build the atlas visual structure**

Use stable, responsive layout primitives:

- constrained inner width aligned with the rest of the homepage;
- route lanes or map rows that do not rely on text wrapping for layout stability;
- active and preparing states with clear visual distinction;
- compact labels on mobile;
- no nested cards inside cards.

- [ ] **Step 2: Visual style rules**

The page must not become:

- a generic Apple-like landing page;
- a one-hue purple/blue gradient page;
- a dark dashboard with fake telemetry;
- a plain blog/tutorial page;
- a marketing course page.

Recommended expression:

- dark or neutral base may remain, but add enough contrast and secondary color variety;
- lane markers can use the existing five project motif colors;
- future lanes should be visible but quieter;
- text must fit within all status chips and lane labels.

- [ ] **Step 3: Remove `.map-intent` as a standalone weak module**

The existing `.map-intent` issue can be solved by replacement. If the class remains, it must be part of the unified atlas structure and aligned to the main content container.

### Task 7: Verify Responsive And Language Quality

**Files:**
- Test: `tests/e2e/site.spec.ts`
- No direct product changes unless verification fails.

- [ ] **Step 1: Run full verification**

Run:

```powershell
npm run verify
git diff --check
```

Expected:

- Unit tests pass.
- Build passes.
- Playwright tests pass.
- No whitespace errors.

- [ ] **Step 2: Screenshot-review these viewports**

Required viewports:

- Desktop: `1440x1000`
- Tablet: `768x1000`
- Mobile: `390x900`

Check:

- no horizontal overflow;
- no overlapping text;
- GitHub entry is visible and not primary over the first-project CTA;
- future lanes read as placeholders, not fake features;
- feedback remains pending;
- Chinese default is coherent;
- English switch does not leave mixed Chinese UI on main homepage controls.

### Task 8: Development Handoff Evidence

**Files:**
- Modify or create a short QA note under `docs/reviews/` only if the execution team normally records QA evidence.

- [ ] **Step 1: Provide evidence to Strategy Session**

The execution team should send:

- changed file list;
- verification command results;
- desktop and mobile screenshots;
- note confirming no V2/V3 features were added;
- note confirming `/source/<project>/index.txt` links still work;
- note confirming GitHub link is present.

- [ ] **Step 2: Do not mark V1 public beta yourself**

The execution team should stop after implementation and evidence. Strategy Session performs acceptance and version-label decision.

## 6. Acceptance Standards

### P0: Must Pass

- `npm run verify` passes.
- `git diff --check` passes.
- Default locale is Chinese.
- English switch still works for homepage, project cards, project detail, and demos.
- Five V1 projects remain present and unchanged in count.
- Five demos remain playable.
- Five project detail pages still have their fixed structure.
- Five static source entries remain reachable.
- Feedback entry remains pending and does not link to X.
- No backend, database, login, payment, API, search, filtering, submission, ranking, comment, or community feature is introduced.

### P1: Must Pass Before Public Beta

- Homepage visually reads as the first version of a long-term project map, not as a five-project-only site.
- Route A or an approved visual route is implemented consistently across desktop and mobile.
- Future project families are visible and clearly marked as preparing/coming soon.
- V1 first batch is framed as the active starting lane.
- GitHub public repository entry is visible and links to `https://github.com/josephye72-source/vibecoding-market`.
- Per-project source links remain the static source index and are not replaced by a generic repository-only link.
- `.map-intent` weak-copy module is removed or absorbed into the atlas structure without layout misalignment.

### P2: Strongly Preferred Before Public Beta

- Homepage feels distinctive, not like a generic template.
- Atlas labels remain readable at 390px.
- GitHub entry is visible but secondary.
- Future placeholders do not look broken, disabled by accident, or like unavailable paid features.
- Homepage screenshots are clean enough to share in social media posts.

## 7. Strategy Acceptance After Development

After the execution team finishes, Strategy Session will:

1. Re-run or review `npm run verify`.
2. Inspect desktop and mobile screenshots.
3. Check the live homepage against V1 blueprint, addendum 02, and the final strategy acceptance matrix.
4. Classify any gaps as blueprint change, implementation fix, or post-V1 work.
5. Update `docs/reviews/acceptance/2026-06-13-v1-final-strategy-acceptance-matrix.md`.
6. Create a final acceptance report if the version passes.
7. Move the accepted public GitHub version to `main` and set GitHub default branch to `main`.

## 8. Main Branch Policy

Current repository state:

- GitHub repository: `https://github.com/josephye72-source/vibecoding-market`
- Current pushed branch: `v1-implementation`
- Current default branch before final acceptance: `v1-implementation`

Final public-beta policy:

- Accepted public code must exist on `main`.
- GitHub default branch must be `main`.
- `v1-implementation` may remain as historical work branch or be deleted after `main` is confirmed.
- Strategy Session owner handles this after acceptance, so execution developers do not need to force branch policy during implementation.

## 9. Self-Review

Spec coverage:

- Long-term homepage map: covered by Tasks 2, 4, 6 and P1 acceptance.
- GitHub entry: covered by Task 5 and P1 acceptance.
- Feedback pending: covered by Tasks 4, 7 and P0 acceptance.
- No V2/V3 scope creep: covered by Decisions, Task 6, P0 acceptance.
- Main branch requirement: covered by Sections 7 and 8.
- Public beta wording: covered by Decisions and Strategy Acceptance.

Placeholder scan:

- This plan uses no `TBD`, no deferred placeholder requirements, and no fake future controls.

Type consistency:

- Suggested `HomeRoadmapLane` fields are only a recommended implementation pattern.
- Required externally visible contract is the homepage behavior and test coverage, not a mandatory internal type name.
