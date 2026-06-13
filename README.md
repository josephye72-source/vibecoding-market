# Vibe Coding Market

Vibe Coding Market is a V1 static web gallery of five beginner-friendly projects that can be played, inspected, rebuilt with Codex, and remixed. It is a release-review package for a pure Web learning path, not a marketing page or platform launch.

## Run

```powershell
npm install
npm run dev
```

## Verify

```powershell
npm run test:run
npm run build
npm run test:e2e
```

`npm run verify` runs the same three checks in sequence.

## V1 Projects

1. Focus Pomodoro
2. Memory Cards
3. Tiny Ledger
4. Habit Grid
5. Split Console

## Documentation Entry Points

- V1 baseline spec: `docs/superpowers/specs/2026-06-13-vibe-coding-market-v1-baseline-spec.md`
- Implementation plan: `docs/superpowers/plans/2026-06-13-vibe-coding-market-v1-implementation-plan.md`
- Design system review: `docs/reviews/2026-06-13-v1-design-system.md`
- Visual QA: `docs/reviews/2026-06-13-v1-visual-qa.md`
- Accessibility review: `docs/reviews/2026-06-13-v1-accessibility-review.md`
- Release review: `docs/reviews/2026-06-13-v1-release-review.md`
- Feedback plan: `docs/reviews/2026-06-13-v1-feedback-plan.md`
- Project docs: `docs/projects/<project-folder>/codex-from-zero.md`, `source-guide.md`, `complexity-map.md`, `faq.md`, and `remix-prompts.md`

## V1 Scope And Non-Goals

V1 is a static frontend with local browser state where a demo needs it. It does not add backend services, a database, login, third-party API integrations, payment, community features, submissions, or rankings.

## Feedback

Default feedback channel: GitHub Issue when the public repository is ready.

Current release fallback: the homepage opens a prefilled public `#VibeCodingMarketV1` social topic post. It asks for the most interesting project, reproduction willingness, stuck point, and remix idea. If a public GitHub Issue URL becomes available later, replace the social-topic link with that concrete issue URL and keep the same four-question template.
