# Vibe Coding Market V1 Release Review

Date: 2026-06-13
Product baseline commit: `bf89dd0beb2953b765c2ff41395ecc6f24c9918e`
Task 8 package commit: `6907cd3a45effdf08db40ddf6c44a292b171081a`
Pre-final-gap implementation head: `b24ca5f3ed4d796ee6b8d6db99eb44bcac9afe2b`
Final evidence correction commit: the commit containing this document; confirm exact SHA with `git rev-parse HEAD` at handoff because a commit cannot embed its own SHA before it exists.
Package task: Task 8 plus final release review gap fixes

## Release Recommendation

Recommendation: Pass for the final handoff HEAD confirmed by `git rev-parse HEAD`, covering the pre-final-gap implementation head plus the feedback-entry, Memory Cards rendering, viewport-matrix, and `zh-CN` evidence fixes in this commit.

V1 is ready for a public release review and lightweight feedback collection. The recommendation is based on the checked V1 scope, the five-project static site boundary, Task 7 visual and accessibility QA, unit coverage, Playwright route and interaction coverage, and the absence of blocking release risks in this review package.

This recommendation does not approve any 2.0 work. Per the baseline spec, post-release feedback must prove beginner reproduction signal before 2.0 starts.

## Scope Summary

V1 contains exactly five pure static web projects:

1. Focus Pomodoro
2. Memory Cards
3. Tiny Ledger
4. Habit Grid
5. Split Console

The product boundary is a Vite and TypeScript static web app with local browser state where needed. There is no backend, database, login, API integration, payment, community system, submission pipeline, or ranking feature.

Primary scope evidence:

| Evidence | Path or command | Status |
| --- | --- | --- |
| Baseline V1 project list and release rules | `docs/superpowers/specs/2026-06-13-vibe-coding-market-v1-baseline-spec.md` sections 4-12 | Pass |
| Project metadata contains exactly five projects | `src/data/projects.ts`; `src/data/projects.test.ts` test `contains exactly five projects` | Pass |
| Static project docs registry exists for every project | `src/data/projectDocs.ts`; `src/data/projectDocs.test.ts` | Pass |
| Static frontend build only | `package.json` scripts `dev`, `build`; no server package scripts | Pass |

## Phase 0-6 Checklist

| Phase | Criterion | File evidence | Test or command evidence | Browser or visual QA note | Doc link | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Phase 0, scope freeze | Five launch projects are fixed, exactly five, pure Web, at least one game, and V1 non-goals are explicit. | `docs/superpowers/specs/2026-06-13-vibe-coding-market-v1-baseline-spec.md` sections 4, 5.0, 7, 12; `src/data/projects.ts` | `src/data/projects.test.ts` tests `contains exactly five projects`, `includes at least one game project`; `npm run test:run` | Not visual by itself. Scope feeds the five visible cards and one game demo. | Baseline spec section 4 and 12 | Pass |
| Phase 1, homepage and IA | First viewport explains the site, primary and secondary CTAs exist, four-step path exists, five cards exist, each card links to demo and detail, detail template has 9 sections, no sales language. | `src/components/HomePage.ts`, `src/components/ProjectCard.ts`, `src/components/ProjectDetail.ts`, `src/data/projects.ts` | `tests/e2e/site.spec.ts` tests `homepage first viewport renders site value, primary paths, tags, and cards`, `homepage renders a four-step beginner path`, `project card for ... has the required summary and links`, `detail page for ... renders the 9 required sections` | Task 7 visual QA says homepage at 390, 768, and 1440 kept the Studio Anthology direction without becoming a SaaS dashboard or sales page. | `docs/reviews/2026-06-13-v1-visual-qa.md`; baseline spec section 5.1 | Pass |
| Phase 2, visual system and interaction principles | Shared site shell, named motif per demo, project visual difference, visible focus, touch targets, responsive breakpoints, no heavy WebGL or 3D. | `docs/reviews/2026-06-13-v1-design-system.md`, `src/styles/tokens.css`, `src/styles/base.css`, `src/styles/app.css`, `src/data/projects.ts` | `tests/e2e/site.spec.ts` tests `homepage is visually available at 390px`, `detail page for ... is responsive at ...`, `demo for ... has core controls at ...`, `keyboard Tab reaches homepage primary controls with visible focus`, `main content has no horizontal overflow at 390px on primary routes`. Detail and demo viewport matrix covers 390px, 768px, and 1440px. | Task 7 visual QA and accessibility review report no blocking visual or accessibility issues remain; final release gap coverage expands detail and demo checks to 390/768/1440. | `docs/reviews/2026-06-13-v1-design-system.md`; `docs/reviews/2026-06-13-v1-accessibility-review.md`; `docs/reviews/2026-06-13-v1-visual-qa.md` | Pass |
| Phase 3, first project closed loop | Focus Pomodoro demo, detail page, source guide, Codex doc, FAQ, remix tasks, local record, no backend or API. | `src/demos/pomodoro/logic.ts`, `src/demos/pomodoro/render.ts`, `docs/projects/pomodoro/*`, `src/data/projects.ts` | `src/demos/pomodoro/logic.test.ts`; `tests/e2e/site.spec.ts` test `focus pomodoro demo supports the closed-loop timer path` | Task 7 sampled Focus Pomodoro on mobile and desktop detail and demo routes. | `docs/projects/pomodoro/codex-from-zero.md`; `docs/projects/pomodoro/source-guide.md` | Pass |
| Phase 4, template solidification | Project detail template has 9 fixed sections; Codex docs and source docs use the same required registry and link rules; metadata template includes slug, order, roles, links, motif, skills, and docs folder. | `src/components/ProjectDetail.ts`, `src/data/projects.ts`, `src/data/projectDocs.ts`, `docs/projects/*/*` | `src/data/projectDocs.test.ts` tests `defines exactly five canonical doc links for every project`, `maps every canonical doc link to the static published href and existing repo file`, `keeps each project metadata record complete for V1`, `renders detail page links from project metadata and the centralized doc registry` | Shared detail route structure was checked at 390px and 1440px in Task 7. | Baseline spec section 5.4; `docs/reviews/2026-06-13-v1-visual-qa.md` | Pass |
| Phase 5, remaining four projects | Memory Cards, Tiny Ledger, Habit Grid, and Split Console each have a demo, detail page, source entry, source guide, Codex doc, FAQ, remix prompts, motif, states, and local or page state feedback where required. | `src/demos/memory/*`, `src/demos/ledger/*`, `src/demos/habits/*`, `src/demos/split/*`, `docs/projects/memory/*`, `docs/projects/ledger/*`, `docs/projects/habits/*`, `docs/projects/split/*` | Unit tests under `src/demos/*/logic.test.ts`; Playwright tests `memory cards demo supports matching, mismatch feedback, victory, and restart`, `memory cards demo safely renders symbol-like card text`, `tiny ledger demo adds, deletes, totals, persists, and shows empty state`, `habit grid demo toggles a date, shows stats, and persists after refresh`, `split console demo calculates immediately, blocks invalid input, and copies summary` | Task 7 visual QA inspected all detail and demo routes; final release gap matrix covers 390px, 768px, and 1440px. | Baseline spec sections 5.5 and 8.2-8.5 | Pass |
| Phase 6, site integration and pre-release acceptance | Complete homepage, 5 details, 5 demos, 5 source entries, 5 Codex docs, feedback entry, pre-release review, risk list, link integrity, responsive QA, console smoke, 5-minute manual QA note. | `src/components/HomePage.ts`, `src/components/AppShell.ts`, `src/components/ProjectDetail.ts`, `src/data/projectDocs.ts`, this file, `docs/reviews/2026-06-13-v1-feedback-plan.md` | `tests/e2e/site.spec.ts` tests `homepage feedback entry uses a concrete channel and asks the four V1 questions`, `project documentation links resolve from the static app`, `route smoke has no console errors across home, detail, and demo routes`, `main content has no horizontal overflow at 390px on primary routes`; `npm run build`; `npm run test:e2e` | Feedback uses the public `#VibeCodingMarketV1` social-topic fallback with four prompted feedback fields until a concrete GitHub Issue URL exists. Controller timed exploratory smoke on 2026-06-13 covered 303 seconds against `http://127.0.0.1:5173` with no console errors, page errors, or blocking interaction errors. | `docs/reviews/2026-06-13-v1-visual-qa.md`; `docs/reviews/2026-06-13-v1-accessibility-review.md`; `docs/reviews/2026-06-13-v1-feedback-plan.md` | Pass |

## Core Deliverables Checklist

| Deliverable | Evidence | Status |
| --- | --- | --- |
| Complete homepage | `src/components/HomePage.ts`; Playwright test `homepage first viewport renders site value, primary paths, tags, and cards` | Pass |
| 5 project detail pages | `src/components/ProjectDetail.ts`; generated from `src/data/projects.ts`; Playwright test `detail page for ... renders the 9 required sections` | Pass |
| 5 demos | `src/demos/pomodoro`, `src/demos/memory`, `src/demos/ledger`, `src/demos/habits`, `src/demos/split`; Playwright project-specific demo tests | Pass |
| 5 source entries | `src/data/projects.ts` `links.source`; `docs/projects/*/source-guide.md`; `src/data/projectDocs.test.ts` source-guide assertions | Pass |
| 5 Codex docs | `docs/projects/*/codex-from-zero.md`; `src/data/projectDocs.test.ts` test `keeps every Codex-from-zero guide complete enough to reproduce` | Pass |
| Feedback entry | `src/components/HomePage.ts` feedback section with public `#VibeCodingMarketV1` social-topic fallback; Playwright test `homepage feedback entry uses a concrete channel and asks the four V1 questions`; `src/components/AppShell.ts` feedback nav; `docs/reviews/2026-06-13-v1-feedback-plan.md` | Pass |
| Release risk list | Pre-release risk list in this file | Pass |

## Project Definition Of Done

| Project | Demo DoD evidence | Detail, source, and docs evidence | Tests and QA evidence | Status |
| --- | --- | --- | --- | --- |
| Focus Pomodoro | `src/demos/pomodoro/logic.ts` and `render.ts` implement start, pause, reset, focus/break, progress, completion, and local count. | `src/data/projects.ts` entry `focus-pomodoro`; `docs/projects/pomodoro/source-guide.md`; `docs/projects/pomodoro/codex-from-zero.md`; FAQ and remix docs in same folder. | `src/demos/pomodoro/logic.test.ts`; Playwright `focus pomodoro demo supports the closed-loop timer path`; Task 7 route QA. | Pass |
| Memory Cards | `src/demos/memory/logic.ts` and `render.ts` implement 12 cards, 6 pairs, shuffle, match/mismatch, moves, win, restart, and DOM/textContent card symbol rendering. | `src/data/projects.ts` entry `memory-cards`; `docs/projects/memory/source-guide.md`; `docs/projects/memory/codex-from-zero.md`; FAQ and remix docs. | `src/demos/memory/logic.test.ts`; Playwright `memory cards demo supports matching, mismatch feedback, victory, and restart`; Playwright `memory cards demo safely renders symbol-like card text`; Task 7 route QA. | Pass |
| Tiny Ledger | `src/demos/ledger/logic.ts` and `render.ts` implement income/expense records, categories, delete, totals, localStorage, empty state. | `src/data/projects.ts` entry `tiny-ledger`; `docs/projects/ledger/source-guide.md`; `docs/projects/ledger/codex-from-zero.md`; FAQ and remix docs. | `src/demos/ledger/logic.test.ts`; Playwright `tiny ledger demo adds, deletes, totals, persists, and shows empty state`; Task 7 route QA. | Pass |
| Habit Grid | `src/demos/habits/logic.ts` and `render.ts` implement date grid, toggled check-ins, today/checked states, monthly count, streak feedback, localStorage. | `src/data/projects.ts` entry `habit-grid`; `docs/projects/habits/source-guide.md`; `docs/projects/habits/codex-from-zero.md`; FAQ and remix docs. | `src/demos/habits/logic.test.ts`; Playwright `habit grid demo toggles a date, shows stats, and persists after refresh`; Task 7 route QA. | Pass |
| Split Console | `src/demos/split/logic.ts` and `render.ts` implement total/items, participants, immediate split result, validation, copyable summary, disabled state. | `src/data/projects.ts` entry `split-console`; `docs/projects/split/source-guide.md`; `docs/projects/split/codex-from-zero.md`; FAQ and remix docs. | `src/demos/split/logic.test.ts`; Playwright `split console demo calculates immediately, blocks invalid input, and copies summary`; disabled copy affordance test; Task 7 route QA. | Pass |

## V1 Non-Goal Audit

| Non-goal | Evidence | Status |
| --- | --- | --- |
| No login or account system | `src/components/ProjectDetail.ts` states demos run with no login; project docs repeat no account/login; grep found no product login implementation. | Pass |
| No backend or database | `package.json` has only Vite, Vitest, Playwright scripts; demos use browser code and localStorage only where required. | Pass |
| No third-party API or AI API | `src/components/ProjectDetail.ts` states no API; docs explicitly exclude API; no fetch/API integration appears in product code. | Pass |
| No payment | `docs/projects/ledger/codex-from-zero.md` and `docs/projects/split/codex-from-zero.md` explicitly exclude payment; no payment package or route exists. | Pass |
| No community, comments, submission pipeline, or rankings | Project docs exclude upload, leaderboard, and comments; no routes or components implement submissions, rankings, or comments. | Pass |

## Visual And Interaction Acceptance Summary

Task 7 visual QA and accessibility review support release acceptance:

| Acceptance area | Evidence | Status |
| --- | --- | --- |
| Responsive layout | `docs/reviews/2026-06-13-v1-visual-qa.md`; Playwright `homepage is visually available at 390px`, `detail page for ... is responsive at ...`, `demo for ... has core controls at ...`, `main content has no horizontal overflow at 390px on primary routes`; detail and demo matrix covers 390px, 768px, and 1440px | Pass |
| Distinct motifs | `docs/reviews/2026-06-13-v1-design-system.md`; `src/data/projects.ts` motif fields; Task 7 visual findings | Pass |
| Interaction feedback | Project-specific Playwright demo tests; `docs/reviews/2026-06-13-v1-accessibility-review.md` checks for labels, focus, status messages, and touch targets | Pass |
| Console and route smoke | Playwright `route smoke has no console errors across home, detail, and demo routes` | Pass |
| Known visual fix | Split Console disabled copy affordance fixed and covered by Playwright `split console copy action has a distinct disabled affordance before valid input` | Pass |
| Safe symbol rendering | Memory Cards DOM/textContent rendering covered by Playwright `memory cards demo safely renders symbol-like card text` | Pass |
| Final route smoke | Playwright coverage confirms the homepage feedback entry, four feedback prompts, Memory Cards `</>` visibility during card interaction, and route smoke with zero console errors | Pass |

Accepted non-blocking limitations from Task 7:

- In-app Browser screenshot capture timed out while waiting for the webview to attach; Playwright screenshots and route tests were used instead.
- No axe, Lighthouse, or full screen-reader transcript audit was added.
- Cross-browser screenshot coverage beyond Chromium Playwright was not added.

## Manual QA Smoke Note

Controller timed smoke on 2026-06-13:

| Field | Evidence |
| --- | --- |
| Method | Controller timed exploratory smoke using Playwright browser interactions against `http://127.0.0.1:5173`. |
| Duration | 303 seconds. |
| Viewports and routes | Mobile 390px homepage, all five project detail routes, all five demo routes, then desktop Split route; repeated home, memory, and split navigation until 5 minutes elapsed. |
| Interactions | Pomodoro start, pause, and reset; Memory mismatch and restart; Ledger add record; Habit date toggle; Split calculation and copy. |
| Result | No console errors, no page errors, and no blocking interaction errors. |

## Pre-Release Risk List

| Risk | Severity | Evidence | Owner and next action | Blocker |
| --- | --- | --- | --- | --- |
| Browser plugin screenshot capture was unavailable during Task 7. | Low | `docs/reviews/2026-06-13-v1-visual-qa.md` accepted deviation; Playwright screenshots and route checks replaced it. | Release owner can rerun Browser plugin QA if the attach timeout is resolved. | No |
| Accessibility review is not a full assistive-technology audit. | Low | `docs/reviews/2026-06-13-v1-accessibility-review.md` remaining accepted risks. | Release owner can schedule axe/Lighthouse or screen-reader pass after V1 if feedback indicates accessibility friction. | No |
| Public fallback topic should be replaced by GitHub Issue when the repository is ready. | Low | `src/components/HomePage.ts` uses concrete `#VibeCodingMarketV1` social-topic fallback; `docs/reviews/2026-06-13-v1-feedback-plan.md` documents GitHub Issue as default and social topic as the temporary fallback. | Release owner should replace the fallback with a concrete public GitHub Issue URL before broad announcement if the repository is ready. | No |
| Public feedback volume may be too small to justify 2.0. | Medium | Baseline spec section 7 and 12 require post-release feedback signal before 2.0. | Release owner must apply the feedback plan decision rule and keep 2.0 blocked until reproduction evidence exists. | No |

## Verification Commands

Run these before committing the release package:

| Command | Latest expected result |
| --- | --- |
| `npm run test:run` | Pass on 2026-06-13. Vitest reported 8 test files passed and 49 tests passed. |
| `npm run build` | Pass on 2026-06-13. TypeScript app/test programs typechecked and Vite produced `dist/index.html`, CSS, and JS assets. |
| `npm run test:e2e` | Pass on 2026-06-13. Equivalent to `npx playwright test`; Playwright reported 61 Chromium tests passed after adding the feedback-channel, safe Memory symbol rendering, and 390/768/1440 detail/demo viewport coverage. |
| `git diff --check` | Pass on 2026-06-13. No whitespace errors. |
| `git status --short` | Pass on 2026-06-13. Final gap-fix pre-commit status showed only the expected code, test, README, and review-document files changed. After commit, expected short status is clean. |
| `git status --short --branch` | Optional branch-aware check. Pass on 2026-06-13. After commit, expected branch status is clean. |

## Release Decision

Pass, with no blocking pre-release risk.

Do not enter 2.0 from this decision. Enter 2.0 only after the feedback plan proves at least one beginner can reproduce 70% or more of a project, or after V1 fixes are identified and addressed.
