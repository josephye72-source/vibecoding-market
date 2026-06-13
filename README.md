# Vibe Coding Market

Vibe Coding Market 是一个公开、公益、可复现的 vibe coding 项目地图。V1 先用 5 个纯 Web 项目验证“体验 -> 看源码 -> 跟 Codex 从 0 到 1 复现 -> 二创”的学习闭环。

当前版本是静态前端 release candidate。它不引入后端、账号、数据库、支付、投稿、排行或社区系统。

## 运行

```powershell
npm install
npm run dev
```

## 验证

```powershell
npm run test:run
npm run build
npm run test:e2e
```

`npm run verify` runs the same three checks in sequence.

## V1 首批项目

1. 专注番茄钟 / Focus Pomodoro
2. 记忆翻牌小游戏 / Memory Cards
3. 极简记账本 / Tiny Ledger
4. 习惯打卡日历 / Habit Grid
5. 预算 / 分摊计算器 / Split Console

## 文档入口

- V1 基准 Spec：`docs/superpowers/specs/2026-06-13-vibe-coding-market-v1-baseline-spec.md`
- V1 蓝图修订：`docs/superpowers/specs/2026-06-13-vibe-coding-market-v1-blueprint-revision-01.md`
- Gate 6 remediation Spec：`docs/superpowers/specs/2026-06-13-vibe-coding-market-v1-gate6-remediation-spec.md`
- Gate 6 remediation 计划：`docs/superpowers/plans/2026-06-13-vibe-coding-market-v1-gate6-remediation-plan.md`
- 原始 Gate 6 验收报告：`docs/reviews/acceptance/2026-06-13-v1-gate6-release-acceptance-report.md`
- 复验报告：`docs/reviews/acceptance/2026-06-13-v1-gate6-release-remediation-rereview-acceptance-report.md`
- 反馈计划：`docs/reviews/2026-06-13-v1-feedback-plan.md`
- 项目学习文档：`docs/projects/<project-folder>/codex-from-zero.md`、`source-guide.md`、`complexity-map.md`、`faq.md`、`remix-prompts.md`

## V1 范围与非目标

V1 是静态前端；需要状态的 demo 只使用浏览器本地状态或 `localStorage`。源码入口使用构建时生成的静态 `/source/{project}/index.txt` 文本入口，便于用户直接阅读核心实现文件。

V1 不做后端服务、数据库、登录、第三方 API、支付、社区、投稿、排行、复杂搜索或反馈数据库。

## 反馈

反馈入口目前处于 pending 状态：站点保留反馈位置，但不绑定 X、GitHub Issue、表单、邮箱或其他外部渠道。正式渠道确定前，首页只说明未来会收集四类信号：

- 最感兴趣项目；
- 是否愿意复现；
- 卡住位置；
- 二创想法。

正式发布前应先确定唯一反馈渠道，再启用入口。
