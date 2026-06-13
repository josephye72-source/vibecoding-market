# Vibe Coding Market V1 Feedback Plan

Date: 2026-06-13
Scope: V1 release feedback collection

## Current Status

Gate 6 remediation changes the V1 feedback posture from "temporary public social fallback" to "channel pending".

The homepage should keep a visible feedback entry, but it must not send users to X, a generic GitHub URL, a social topic, or any other unconfirmed destination. The current UI state is disabled/pending and explains what signals will be collected later.

## Channel Decision Needed

Before enabling feedback, choose one concrete collection channel:

- a specific GitHub Issue or Discussion URL;
- a lightweight form URL;
- an email/contact route;
- a documented social topic;
- another single public collection surface approved by the release owner.

Do not use a generic `https://github.com/` link. Do not bind the UI to X or another social platform until that is an explicit product decision.

## Pending UI Requirements

While the channel is pending:

1. Keep the homepage feedback section visible.
2. Keep the control disabled or non-submitting.
3. State that the feedback method is being prepared.
4. List the four signal categories below.
5. Do not transmit user input or open an external post/issue/form.

## Future Feedback Template

Ask users to answer these four questions:

1. Which project is most interesting to you? / 你最感兴趣的是哪个项目？
2. Would you be willing to reproduce one of the projects with Codex? / 你是否愿意跟 Codex 复现其中一个项目？
3. Where did you get stuck, confused, or unsure what to click or read next? / 你卡在了哪里？
4. What remix idea would you try if you changed the project? / 你想怎么二创？

Optional context fields:

- Which project did you open?
- Did you use mobile or desktop?
- Did you try the demo, read the source guide, or follow the Codex doc?
- If you tried to reproduce it, about how much did you complete?

## Collection Process

1. Enable exactly one concrete channel after product approval.
2. Review feedback manually once or twice per week during the V1 feedback window.
3. Copy useful notes into a simple review summary, grouped by project, reproduction signal, stuck point, and remix idea.
4. Label items as V1 fix, documentation fix, unclear signal, or possible 2.0 idea.
5. Do not build accounts, comments, voting, rankings, submissions, or a feedback database for V1.

## Effective Feedback

Feedback counts as effective when it includes at least two of these signals:

- A clear project preference.
- A stated willingness or refusal to reproduce a project.
- A specific stuck point in the demo, source guide, Codex doc, or navigation.
- A concrete remix idea.
- Evidence that the user attempted a project and how far they got.

Feedback is weak but still useful when it only says the site is nice, confusing, or interesting without naming a project or next action.

## Post-Release Decision Rule

Do not enter 2.0 until feedback proves at least one small beginner can reproduce 70% or more of one project, or until concrete V1 fixes are identified and prioritized.

If there is no reproduction signal, continue improving V1 project quality, documentation clarity, and first-project onboarding. More projects, platform features, or community systems are not justified by V1 feedback alone.

## Explicit Non-Goals

V1 feedback collection does not include:

- Account system.
- Login-gated feedback.
- Comments section.
- Rankings or voting.
- Submission pipeline.
- Community system.
- Backend database for feedback.
