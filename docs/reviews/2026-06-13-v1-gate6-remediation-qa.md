# Vibe Coding Market V1 Gate 6 Remediation QA Evidence

日期：2026-06-13
范围：Gate 6 remediation 后的视觉、可访问性、本地化与源码入口复验
结论：通过

## 验证命令

```powershell
npm run verify
```

结果：

- Vitest：10 个 test files，53 个 tests，通过；
- Build：`tsc --noEmit -p tsconfig.json`、`tsc --noEmit -p tsconfig.test.json`、`vite build` 通过；
- Playwright：69 个 tests，通过。

补充检查：

```powershell
git diff --check
```

结果：通过，仅出现 Windows 工作区的换行提示，不存在 whitespace error。

## 视觉与响应式证据

Playwright 覆盖：

- 首页在 390px、768px、1440px 可见；
- 5 个项目详情页在 390px、768px、1440px 可见；
- 5 个 demo 在 390px、768px、1440px 具备核心控件；
- 390px 主路由无横向溢出；
- 内置浏览器抽查首页和项目详情页无横向溢出。

当前 UI 保持 Studio Anthology 方向：统一站点外壳，项目卡和 demo 保留各自视觉母题；未新增 landing page、社区模块、排行或复杂筛选。

## 本地化证据

默认语言：

- `html lang="zh-CN"`；
- 首页、项目卡、项目详情、demo 主控件、反馈入口默认中文；
- 账本分类、账本保存状态、习惯保存状态默认中文；
- 中文默认下关键 aria label 使用中文。

英文切换：

- 语言切换按钮可用，并将 `html lang` 切换为 `en`；
- 刷新后语言偏好保持；
- 英文项目详情页不复用中文正文；
- Memory demo 覆盖中文默认与英文切换。

项目文档：

- `docs/projects/**` 25 份文档已改为中文优先；
- `source-guide.md`、`complexity-map.md`、`codex-from-zero.md`、`faq.md`、`remix-prompts.md` 均有中文结构测试；
- 测试包含旧英文二级标题回流防线。

## 源码入口证据

每个项目的 `links.source` 指向静态源码入口：

- `/source/focus-pomodoro/index.txt`
- `/source/memory-cards/index.txt`
- `/source/tiny-ledger/index.txt`
- `/source/habit-grid/index.txt`
- `/source/split-console/index.txt`

Vite dev middleware 可直接返回这些入口；生产 build 会生成 `dist/source/{project}/index.txt`。E2E 会请求每个源码入口，并验证其中包含对应核心源码文件路径。

## 反馈入口证据

当前反馈入口状态为 pending：

- 首页保留反馈区；
- 控件 disabled；
- 不存在 `x.com/intent/post`；
- 不存在 generic `https://github.com/`；
- 文案只说明未来会收集“最感兴趣项目、是否愿意复现、卡住位置、二创想法”。

## 残余风险

- 反馈渠道仍需产品层最终确认，确认前不建议启用外部提交；
- 当前源码入口是静态文本源码树，不是 GitHub 仓库链接；若公开仓库准备好，可替换为真实仓库或目录链接；
- 英文项目学习文档尚未独立维护，当前正式学习文档仍以中文优先为准。
