# Vibe Coding Market V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete Vibe Coding Market 1.0 static web experience that satisfies `docs/superpowers/specs/2026-06-13-vibe-coding-market-v1-baseline-spec.md`.

**Architecture:** Use a static Vite app with vanilla TypeScript, HTML, and CSS modules organized around project metadata, reusable page sections, and pure client-side demo logic. Keep all five demos pure Web, local-state only, and source-readable for beginners. Documentation lives beside the product docs under `docs/projects/` and quality/release evidence under `docs/reviews/`.

**Tech Stack:** Vite, TypeScript, Vitest, Playwright, HTML, CSS, localStorage, no backend, no database, no third-party API.

---

## Required Context

All implementers and reviewers must read these files before making changes:

- `docs/superpowers/specs/2026-06-13-vibe-coding-market-v1-baseline-spec.md`
- `docs/superpowers/specs/2026-06-13-vibe-coding-market-frontend-quality-tooling.md`
- `docs/superpowers/specs/2026-06-13-vibe-coding-market-blueprint-design.md`

Relevant installed skills or plugin capabilities:

- `build-web-apps:frontend-app-builder` for frontend app implementation and browser verification.
- `imagegen` for visual concept and project-bound raster concept assets where needed.
- `frontend-design` for distinctive visual direction.
- `ui-ux-pro-max` for style, color, typography, and UX rule lookup.
- `taste-skill` for anti-template visual critique.
- `web-design-guidelines` for accessibility and interaction review.
- Browser / in-app browser for local visual QA.

## Planned File Structure

- `package.json` - scripts and dev dependencies.
- `vite.config.ts` - static Vite build config.
- `tsconfig.json` - TypeScript config.
- `index.html` - Vite entry.
- `src/main.ts` - app bootstrap and route rendering.
- `src/styles/tokens.css` - site tokens, typography, color, spacing, focus, motion.
- `src/styles/base.css` - reset, base typography, layout utilities.
- `src/styles/app.css` - page and component styling.
- `src/data/projects.ts` - V1 project metadata and detail content.
- `src/data/projectDocs.ts` - links and content snippets for project docs.
- `src/lib/storage.ts` - safe localStorage helpers.
- `src/lib/format.ts` - formatting helpers.
- `src/lib/router.ts` - hash or pathname routing helpers.
- `src/components/` - reusable render functions for shell, cards, detail sections, buttons, badges.
- `src/demos/` - one folder per project demo, each with pure logic and renderer.
- `src/test/` - Vitest setup and shared test helpers.
- `tests/e2e/` - Playwright smoke, accessibility, responsive, and flow tests.
- `docs/projects/` - Codex reproduction docs, source guides, complexity maps, FAQ, remix prompts per project.
- `docs/reviews/` - design concept, implementation review, release review, and feedback review docs.
- `public/assets/` - project-bound generated visual concept images or lightweight assets.

## Git Rules

- Work on `v1-implementation`, not `main`.
- Commit after each completed task and its verification.
- Commit messages use `type: concise summary`, for example `feat: scaffold static v1 app`.
- Do not commit generated caches, dependency folders, build output, browser reports, or local agent state.
- If a task changes docs and code, include both in the same commit only when the docs are the evidence for that implementation.

## Task 1: Project Structure And Vite Scaffold

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `index.html`
- Create: `src/main.ts`
- Create: `src/styles/tokens.css`
- Create: `src/styles/base.css`
- Create: `src/styles/app.css`
- Create: `src/data/projects.ts`
- Create: `src/lib/storage.ts`
- Create: `src/lib/format.ts`
- Create: `src/lib/router.ts`
- Create: `src/test/setup.ts`
- Create: `tests/e2e/site.spec.ts`
- Modify: `.gitignore`

- [ ] **Step 1: Add the failing baseline tests**

Create unit tests for:

- project metadata has exactly 5 projects;
- at least one project has `kind: "game"`;
- all projects have `slug`, `title`, `difficulty`, `estimatedTime`, `skills`, `visualMotif`;
- localStorage helper survives missing or corrupt data.

Create an e2e smoke test that expects the site to render the homepage title and 5 project cards.

- [ ] **Step 2: Run tests and verify they fail**

Run:

```powershell
npm run test:run
npx playwright test
```

Expected:

- unit tests fail because app files do not exist yet;
- e2e test fails because the Vite app is not implemented yet.

- [ ] **Step 3: Implement the minimal scaffold**

Set up Vite + TypeScript with static entry, project metadata, storage helpers, base shell render, and enough homepage markup for the smoke test.

Implementation constraints:

- no React or backend;
- no third-party API;
- all source files small and readable;
- use semantic HTML for the homepage shell.

- [ ] **Step 4: Run verification**

Run:

```powershell
npm install
npm run test:run
npm run build
npx playwright install chromium
npx playwright test
```

Expected:

- unit tests pass;
- build passes;
- e2e smoke passes.

- [ ] **Step 5: Commit**

```powershell
git add package.json package-lock.json vite.config.ts tsconfig.json index.html src tests .gitignore
git commit -m "feat: scaffold static v1 app"
```

## Task 2: Design Direction And Visual System

**Files:**
- Create: `docs/reviews/2026-06-13-v1-design-system.md`
- Create: `public/assets/concepts/`
- Modify: `src/styles/tokens.css`
- Modify: `src/styles/app.css`

- [ ] **Step 1: Use design skills before editing**

Required design references:

- read `frontend-design`;
- use `ui-ux-pro-max/scripts/search.py` for project gallery style, inclusive design, and color system references;
- read or use `taste-skill` for anti-template critique;
- keep `web-design-guidelines` available for review.

- [ ] **Step 2: Generate or define visual concepts**

Use Image Gen for at least one full-site concept or one concept board covering:

- homepage shell;
- project card system;
- five demo visual motifs;
- desktop and mobile rhythm.

Save accepted project-bound concept assets under `public/assets/concepts/`.

- [ ] **Step 3: Write the design system doc**

`docs/reviews/2026-06-13-v1-design-system.md` must include:

- chosen visual thesis;
- 4-6 site tokens with hex values;
- type scale;
- spacing scale;
- component families;
- focus and motion rules;
- five project visual motifs;
- rejected visual directions and why;
- how the design satisfies V1 Spec sections 5.2, 6.7, and 6.8.

- [ ] **Step 4: Apply tokens**

Implement tokens and baseline styles:

- visible focus ring;
- touch target minimums;
- responsive typography;
- `prefers-reduced-motion`;
- CSS variables for all project motifs.

- [ ] **Step 5: Verify**

Run:

```powershell
npm run test:run
npm run build
```

Expected:

- tests pass;
- no generated asset is referenced from outside the workspace;
- design system doc has no empty or unfinished sections.

- [ ] **Step 6: Commit**

```powershell
git add docs/reviews public/assets src/styles
git commit -m "design: define v1 visual system"
```

## Task 3: Homepage And Project Detail Template

**Files:**
- Create: `src/components/AppShell.ts`
- Create: `src/components/HomePage.ts`
- Create: `src/components/ProjectCard.ts`
- Create: `src/components/ProjectDetail.ts`
- Create: `src/components/ProjectMeta.ts`
- Modify: `src/main.ts`
- Modify: `src/data/projects.ts`
- Modify: `src/styles/app.css`
- Modify: `tests/e2e/site.spec.ts`

- [ ] **Step 1: Write failing tests**

Add tests for:

- first viewport contains site value, primary CTA, secondary CTA, and at least 4 positioning tags;
- homepage renders 4-step path: 先玩、看懂、跟做、二创;
- homepage renders exactly 5 project cards;
- project card contains title, one-line effect, difficulty, estimated time, 3-5 skill tags, demo link, detail link;
- each project detail page renders 9 required sections.

- [ ] **Step 2: Verify RED**

Run:

```powershell
npm run test:run
npx playwright test tests/e2e/site.spec.ts
```

Expected:

- tests fail because full homepage/detail sections are not implemented yet.

- [ ] **Step 3: Implement homepage and detail template**

Implement routes:

- `/` or root hash route for homepage;
- project detail route for each project;
- demo route for each project with an explicit “implementation pending” state before the real demo lands.

Use code-native links, buttons, and text. Do not create a marketing landing page detached from the actual project entry points.

- [ ] **Step 4: Verify**

Run:

```powershell
npm run test:run
npm run build
npx playwright test
```

Expected:

- all tests pass;
- homepage entry to first project requires one click;
- homepage entry to any project detail requires one click.

- [ ] **Step 5: Commit**

```powershell
git add src tests
git commit -m "feat: build homepage and project detail template"
```

## Task 4: Pomodoro Full Closed Loop

**Files:**
- Create: `src/demos/pomodoro/logic.ts`
- Create: `src/demos/pomodoro/render.ts`
- Create: `src/demos/pomodoro/logic.test.ts`
- Modify: `src/data/projects.ts`
- Modify: `src/components/ProjectDetail.ts`
- Create: `docs/projects/pomodoro/codex-from-zero.md`
- Create: `docs/projects/pomodoro/source-guide.md`
- Create: `docs/projects/pomodoro/complexity-map.md`
- Create: `docs/projects/pomodoro/faq.md`
- Create: `docs/projects/pomodoro/remix-prompts.md`
- Modify: `tests/e2e/site.spec.ts`

- [ ] **Step 1: Write failing logic tests**

Test:

- start/pause/reset state transitions;
- focus and break mode switching;
- progress calculation;
- completed session increments local record;
- corrupt localStorage falls back safely.

- [ ] **Step 2: Verify RED**

Run:

```powershell
npm run test:run -- src/demos/pomodoro/logic.test.ts
```

Expected:

- tests fail because Pomodoro logic does not exist.

- [ ] **Step 3: Implement Pomodoro**

Implement:

- start, pause, reset;
- focus and short break modes;
- countdown display;
- progress ring or bar;
- completion feedback;
- today completed count in localStorage;
- accessible controls and visible focus.

- [ ] **Step 4: Add docs**

Docs must satisfy V1 Spec sections 6.5, 6.6, 7, and 8.1.

- [ ] **Step 5: Verify**

Run:

```powershell
npm run test:run
npm run build
npx playwright test
```

Expected:

- unit and e2e tests pass;
- Pomodoro core flow can be completed in browser;
- docs contain at least 1 starting Prompt, 3 improvement Prompts, 3 troubleshooting Prompts, and 3 remix Prompts.

- [ ] **Step 6: Commit**

```powershell
git add src docs/projects/pomodoro tests
git commit -m "feat: complete pomodoro closed loop"
```

## Task 5: Remaining Demo Logic And Documentation

**Files:**
- Create: `src/demos/memory/`
- Create: `src/demos/ledger/`
- Create: `src/demos/habits/`
- Create: `src/demos/split/`
- Create: `docs/projects/memory/`
- Create: `docs/projects/ledger/`
- Create: `docs/projects/habits/`
- Create: `docs/projects/split/`
- Modify: `src/data/projects.ts`
- Modify: `tests/e2e/site.spec.ts`

- [ ] **Step 1: Write failing tests for all four projects**

Test the exact project-level criteria in V1 Spec sections 8.2-8.5.

- [ ] **Step 2: Verify RED**

Run:

```powershell
npm run test:run -- src/demos
```

Expected:

- tests fail for missing logic and renderers.

- [ ] **Step 3: Implement demos**

Implement:

- memory game with 12 cards, shuffle, match, mismatch, moves, win, restart;
- ledger with add income/expense, 3 categories, delete, stats, localStorage;
- habit calendar with date grid, toggle, current date or checked states, streak or monthly count, localStorage;
- split calculator with amount or items, participants, immediate result, copyable summary, invalid input messaging.

- [ ] **Step 4: Add docs**

Each project folder must include:

- `codex-from-zero.md`;
- `source-guide.md`;
- `complexity-map.md`;
- `faq.md`;
- `remix-prompts.md`.

Each FAQ must include at least 5 issues. Each remix doc must include light, medium, deep remix prompts.

- [ ] **Step 5: Verify**

Run:

```powershell
npm run test:run
npm run build
npx playwright test
```

Expected:

- all demo tests pass;
- all project routes render;
- no demo requires backend, login, database, or third-party API.

- [ ] **Step 6: Commit**

```powershell
git add src/demos src/data docs/projects tests
git commit -m "feat: complete remaining v1 demos"
```

## Task 6: Source Guides, Metadata, And Link Integrity

**Files:**
- Modify: `src/data/projects.ts`
- Modify: `src/data/projectDocs.ts`
- Create: `src/data/projectDocs.test.ts`
- Modify: `docs/projects/**`
- Modify: `tests/e2e/site.spec.ts`

- [ ] **Step 1: Write failing tests**

Test:

- all five projects have source guide, complexity map, FAQ, Codex doc, remix prompts;
- each detail page links to demo, source, and Codex doc;
- all project metadata fields required by the Spec exist.

- [ ] **Step 2: Verify RED**

Run:

```powershell
npm run test:run -- src/data
```

Expected:

- tests fail until all docs and links are complete.

- [ ] **Step 3: Complete docs and metadata**

Ensure every project has:

- exact source guide;
- 3 beginner edit points;
- complexity categories: page structure, interaction, state, data, visual completion;
- at least 5 FAQ items;
- at least 3 remix prompts.

- [ ] **Step 4: Verify**

Run:

```powershell
npm run test:run
npm run build
npx playwright test
```

Expected:

- all metadata and link integrity tests pass.

- [ ] **Step 5: Commit**

```powershell
git add src/data docs/projects tests
git commit -m "docs: complete project reproduction materials"
```

## Task 7: Visual, Responsive, And Accessibility QA

**Files:**
- Create: `docs/reviews/2026-06-13-v1-visual-qa.md`
- Create: `docs/reviews/2026-06-13-v1-accessibility-review.md`
- Modify: `tests/e2e/site.spec.ts`
- Modify: `src/styles/`
- Modify: `src/components/`
- Modify: `src/demos/`

- [ ] **Step 1: Add failing e2e coverage**

Add Playwright tests for:

- homepage at 390px, 768px, 1440px;
- each project route at mobile and desktop;
- core controls are visible and clickable;
- focus can move through primary controls;
- no console errors during route smoke.

- [ ] **Step 2: Verify RED**

Run:

```powershell
npx playwright test
```

Expected:

- tests fail for missing responsive or interaction checks before fixes.

- [ ] **Step 3: Use quality skills**

Use:

- `web-design-guidelines` rules from Vercel source;
- `taste-skill` for anti-template review;
- `frontend-design` for visual repair decisions;
- Browser plugin screenshots for desktop and mobile.

- [ ] **Step 4: Fix issues and write review docs**

Review docs must record:

- screenshots or screenshot method;
- inspected viewports: 390px, 768px, 1440px;
- visual mismatches and fixes;
- accessibility findings and fixes;
- remaining accepted deviations.

- [ ] **Step 5: Verify**

Run:

```powershell
npm run test:run
npm run build
npx playwright test
```

Expected:

- all tests pass;
- review docs contain no open blocking issues.

- [ ] **Step 6: Commit**

```powershell
git add src tests docs/reviews
git commit -m "test: verify visual responsive accessibility quality"
```

## Task 8: Release Review Package

**Files:**
- Create: `docs/reviews/2026-06-13-v1-release-review.md`
- Create: `docs/reviews/2026-06-13-v1-feedback-plan.md`
- Create: `README.md`
- Modify: `package.json`

- [ ] **Step 1: Write release checklist**

The release review must map every V1 Spec phase 0-6 criterion to evidence:

- file path;
- test name;
- browser QA note;
- doc link;
- pass/fail status.

- [ ] **Step 2: Write feedback plan**

Feedback plan must ask users for:

- most interesting project;
- whether they want to reproduce;
- where they got stuck;
- remix idea.

Default feedback channel is GitHub Issue, with social topic fallback.

- [ ] **Step 3: Final verification**

Run:

```powershell
npm run test:run
npm run build
npx playwright test
git status --short
```

Expected:

- all checks pass;
- working tree only contains intended release review changes before commit.

- [ ] **Step 4: Commit**

```powershell
git add README.md package.json docs/reviews
git commit -m "docs: prepare v1 release review package"
```

## Final Acceptance

Before calling the goal complete:

- Verify every explicit requirement in the user objective.
- Verify every V1 Spec phase 0-6 requirement.
- Verify all five project-level criteria.
- Run unit tests, build, and Playwright tests.
- Use Browser or Playwright screenshots for 390px, 768px, and 1440px.
- Confirm Git history contains the baseline commit and implementation commits.
- Confirm no generated caches or local state are tracked.
- Confirm important documents are committed.
