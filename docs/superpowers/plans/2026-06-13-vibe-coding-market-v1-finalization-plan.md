# Vibe Coding Market V1.0 定版收口开发交付单

> 给执行同事：请按任务逐项推进。建议使用 `superpowers:subagent-driven-development` 或 `superpowers:executing-plans` 分任务执行，并在每个任务完成后留下验证结果。

目标：完成 V1.0 公开测试版发布前的最后一轮收口，让首页真正呈现“长期项目地图第一版”，接入公开 GitHub 仓库入口，保持 V1 范围边界，并为最终进入 `main` 分支做准备。

架构约束：继续保持静态 Vite 前端站点，不引入后端、数据库、登录、第三方 API、搜索系统、投稿系统、排行或社区功能。首页应被理解为长期项目地图的第一版：当前 5 个 V1 项目是已开放路径，未来项目类型以“准备中”方式轻量预留。

技术栈：Vite、TypeScript、原生 HTML 渲染、CSS、Vitest、Playwright、GitHub 公开仓库。

---

## 1. 职责边界

这份交付单给 V1 执行团队使用。策略会话负责人不直接修改产品代码，只负责产品基线、验收、仓库策略和最终版本判定。

| 角色 | 职责 |
|---|---|
| 用户 | 已确认视觉方向为方案 A；分配执行同事；决定公开发布时间。 |
| V1 执行团队 | 修改首页、文案、样式、国际化、测试和截图证据。 |
| 策略会话负责人 | 维护蓝图、验收矩阵、最终验收报告、GitHub 仓库配置和 `main` 分支收口。 |

## 2. 已确定决策

- 公开发布标签使用“V1.0 公开测试版”。
- 不宣称“已经被真实外部小白验证成立”。
- 反馈入口继续保持准备中状态，不跳转 X。
- 本轮不进入 V2，也不新增项目。
- 不做搜索、筛选、投稿、排行榜、评论、账号、数据库或社区系统。
- GitHub 仓库已经建立：`https://github.com/josephye72-source/vibecoding-market`。
- 最终验收通过后，公开稳定版本必须落到 `main`，不能只停留在 `v1-implementation`。

## 3. 视觉方向决策

### 方案 A：轨道地图

已确认采用方案 A。本轮 V1.0 定版收口不再让执行团队重新选择视觉方向。

核心想法：

- 首页像一个项目地图，而不是 5 张项目卡片的集合。
- 当前 V1 项目作为第一条已开放路径出现。
- 未来项目类型作为较轻的路径节点或轨道出现，并标注“准备中”。
- 视觉气质可以参考地铁线路图、技术地图、工作室墙面项目图谱，但不要做成后台仪表盘，也不要像课程销售页。

为什么适合 V1：

- 最直接表达“长期项目地图”。
- 可以保留现有项目卡片的高视觉感。
- 未来扩展到 V2 路径时有自然承接。
- 不会落回“普通落地页 + 卡片列表”的形态。

必须包含：

- 已开放路径：`V1 首批项目`。
- 未来路径：`游戏路径`、`实用工具`、`创作工具`、`学习辅助`、`数据小工具`。
- 状态文案：当前项目使用 `已开放`，未来路径使用 `准备中`。
- 轻量地图元素：线路、节点、路径块、状态标记均可。
- 不做假筛选、不做假按钮、不做看起来可点但实际不可用的控件。

### 方案 B：策展图册

仅作为历史备选参考，本轮不执行。

核心想法：

- 首页像一本被策展的项目图册。
- 当前项目是第一章节。
- 未来类型作为后续章节显示“准备中”。

风险：

- 容易又变成“5 张漂亮卡片 + 一句未来文案”。
- 需要非常强的章节结构，才能表达长期地图。

### 方案 C：信号控制台

仅作为历史备选参考，本轮不执行。

核心想法：

- 首页像一个学习路径控制台。
- 当前 V1 项目是已激活信号。
- 未来路径是较弱的准备中信号。

风险：

- 容易变成后台系统或假数据面板。
- 对小白可能不够友好。

## 4. 预计涉及文件

执行团队可根据现有代码结构调整，但原则上会涉及：

- `src/components/HomePage.ts`：重构首页结构，渲染长期项目地图。
- `src/i18n/dictionaries.ts`：增加中文和英文文案。
- `src/i18n/types.ts`：如新增结构化文案类型，再补类型。
- `src/data/homeRoadmap.ts`：可选。若首页地图数据较多，建议单独抽出。
- `src/config/releaseChannels.ts`：可选。若集中管理 GitHub 仓库地址，可在这里或单独配置文件里增加。
- `src/styles/app.css`：实现首页轨道地图、响应式布局和视觉状态。
- `tests/e2e/site.spec.ts`：补首页地图、GitHub 入口、反馈准备中状态和移动端验证。
- 相关单测：如果新增数据结构，需要补对应测试。

不要修改：

- 5 个演示项目的核心逻辑，除非本轮收口改动导致测试失败。
- V1 项目数量。
- 项目详情页 9 个固定区块结构，除非只是补 GitHub 入口相关文案。
- 反馈提交功能。当前只允许准备中状态。

## 5. 开发任务

### 任务 1：确认基线和分支

文件：不修改产品文件。

- [ ] 步骤 1：确认工作区干净

运行：

```powershell
git status -sb
git branch --show-current
```

预期：

- 开始前工作区干净。
- 开发可以在工作分支进行，不直接把未验收代码当成公开稳定版本。

- [ ] 步骤 2：确认当前验证基线

运行：

```powershell
npm run verify
```

预期：

- 修改前测试通过，避免把旧问题混入本轮收口。

### 任务 2：先用测试锁定产品要求

文件：

- 修改：`tests/e2e/site.spec.ts`
- 可选修改：`src/i18n/i18n.test.ts`

- [ ] 步骤 1：新增首页验收测试

测试需要覆盖：

- 首页存在长期项目地图区，而不是只有一段未来文案。
- 地图中有 V1 已开放路径。
- 未来路径可见，并标注“准备中”。
- GitHub 仓库入口可见，链接到 `https://github.com/josephye72-source/vibecoding-market`。
- 反馈入口仍为准备中状态，不跳转 X。
- 默认中文仍成立，英文切换仍成立。

建议测试名称：

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

- [ ] 步骤 2：确认新测试先失败

运行：

```powershell
npx playwright test tests/e2e/site.spec.ts -g "project atlas|GitHub repository"
```

预期：

- 新测试在实现前失败，说明测试确实锁住了本轮新增要求。

### 任务 3：增加首页地图数据

文件：

- 创建或修改：`src/data/homeRoadmap.ts`
- 修改：`src/i18n/dictionaries.ts`
- 按需修改：`src/i18n/types.ts`
- 测试：`src/i18n/i18n.test.ts` 或新增数据测试

- [ ] 步骤 1：定义已开放和准备中路径

推荐数据结构：

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

这个结构只是建议，执行同事可以用更贴合现有代码的实现。关键是页面行为必须满足验收标准。

- [ ] 步骤 2：增加中英文文案

中文至少包含：

- `V1 首批项目`
- `游戏路径`
- `实用工具`
- `创作工具`
- `学习辅助`
- `数据小工具`
- `已开放`
- `准备中`
- `源码仓库`

英文至少包含：

- `V1 first batch`
- `Game path`
- `Utility tools`
- `Creative tools`
- `Learning aids`
- `Data tools`
- `Open`
- `Coming soon`
- `Source repo`

- [ ] 步骤 3：验证国际化完整性

运行：

```powershell
npm run test:run -- src/i18n/i18n.test.ts
```

预期：

- 中英文首页、反馈、项目详情和演示项目文案仍完整。
- 英文模式主要 UI 不混入中文兜底文案。

### 任务 4：重构首页信息架构

文件：

- 修改：`src/components/HomePage.ts`
- 修改：`src/styles/app.css`
- 修改：`src/i18n/dictionaries.ts`

- [ ] 步骤 1：替换单薄的未来文案模块

首页建议顺序：

1. 长期产品首屏。
2. 项目轨道地图。
3. V1 首批项目。
4. 复现路径。
5. 反馈准备中入口。

项目轨道地图必须提供稳定测试标记：

```html
<section class="project-atlas" data-testid="project-atlas" aria-labelledby="project-atlas-title">
```

- [ ] 步骤 2：明确 V1 首批项目定位

项目区文案必须表达：

- 这 5 个项目是第一批公开测试样本；
- 它们不是站点长期边界；
- 用户现在可以从任一项目开始体验和复现。

- [ ] 步骤 3：保持反馈准备中状态

反馈区要求：

- 不跳 X；
- 不做假表单；
- 不启用 GitHub Issue，除非之后产品层另行批准；
- 可以说明未来收集：最感兴趣项目、是否愿意复现、卡住位置、二创想法。

### 任务 5：接入公开 GitHub 仓库入口

文件：

- 修改：`src/config/releaseChannels.ts` 或新增小型配置文件
- 修改：`src/components/HomePage.ts`
- 修改：`src/i18n/dictionaries.ts`
- 测试：`tests/e2e/site.spec.ts`

- [ ] 步骤 1：集中配置仓库地址

推荐：

```ts
export const sourceRepository = {
  url: "https://github.com/josephye72-source/vibecoding-market"
} as const;
```

- [ ] 步骤 2：增加可见入口

GitHub 入口可以放在首屏行动区或项目地图附近，但不能压过“从第一个项目开始”的主行动。

要求：

- 中文模式链接文字包含 `GitHub` 或 `源码仓库`。
- 英文模式链接文字包含 `GitHub` 或 `Source repo`。
- 链接打开公开仓库。
- 每个项目原有 `/source/<project>/index.txt` 源码入口继续保留。

- [ ] 步骤 3：确认测试覆盖

运行：

```powershell
npx playwright test tests/e2e/site.spec.ts -g "GitHub repository"
```

预期：

- GitHub 入口可见且指向公开仓库。
- 项目详情页的“查看源码”仍指向静态源码索引。

### 任务 6：实现方案 A 的视觉系统

文件：

- 修改：`src/styles/app.css`
- 修改：`src/components/HomePage.ts`

- [ ] 步骤 1：实现轨道地图结构

布局要求：

- 与首页其他主体内容对齐；
- 桌面端有清晰地图感；
- 移动端不横向溢出；
- `已开放` 和 `准备中` 状态视觉区分明确；
- 状态标签和路径名称不能依赖过长文本撑开布局；
- 不做卡片套卡片。

- [ ] 步骤 2：视觉边界

页面不能变成：

- 泛 Apple 风落地页；
- 单一紫蓝渐变页面；
- 假数据仪表盘；
- 普通教程博客；
- 课程销售页。

推荐表达：

- 可以保留深色或中性色底；
- 使用现有 5 个项目视觉母题颜色作为轨道或节点辅助色；
- 未来路径可见但更安静；
- 文案和状态标签在 390px 移动端仍清楚。

- [ ] 步骤 3：解决 `.map-intent` 问题

原来的 `.map-intent` 单薄模块应被替换。若保留同名 class，也必须纳入统一地图结构，并与主内容容器对齐。

### 任务 7：验证响应式和语言质量

文件：

- 测试：`tests/e2e/site.spec.ts`
- 如验证失败，再修对应产品文件。

- [ ] 步骤 1：跑完整验证

运行：

```powershell
npm run verify
git diff --check
```

预期：

- 单测通过；
- 构建通过；
- Playwright 通过；
- 无行尾空格或格式错误。

- [ ] 步骤 2：截图检查

必须检查：

- 桌面：`1440x1000`
- 平板：`768x1000`
- 移动端：`390x900`

检查点：

- 无横向滚动；
- 无文本重叠；
- GitHub 入口可见但不是主按钮；
- 未来路径看起来是“准备中”，不是坏掉或假功能；
- 反馈仍是准备中状态；
- 中文默认体验完整；
- 英文切换后首页主要控件不混中文。

### 任务 8：给策略会话负责人回传证据

文件：

- 可选新增：`docs/reviews/` 下的 QA 记录。

- [ ] 步骤 1：提交执行证据

执行团队完成后，回传：

- 改动文件列表；
- `npm run verify` 结果；
- `git diff --check` 结果；
- 桌面和移动端截图；
- 确认没有新增 V2/V3 功能；
- 确认 `/source/<project>/index.txt` 仍可访问；
- 确认 GitHub 仓库入口已出现。

- [ ] 步骤 2：不要自行宣布 V1 公开测试版

执行团队做到代码和证据即可。是否通过、是否进入 `main`、是否标记公开测试版，由策略会话负责人最终验收决定。

## 6. 验收标准

### P0：必须通过

- `npm run verify` 通过。
- `git diff --check` 通过。
- 默认语言是中文。
- 英文切换仍覆盖首页、项目卡、详情页和演示项目主路径。
- 5 个 V1 项目数量不变。
- 5 个演示项目仍可体验。
- 5 个项目详情页仍保留固定结构。
- 5 个静态源码入口仍可访问。
- 反馈入口仍为准备中状态，不跳 X。
- 没有引入后端、数据库、登录、支付、API、搜索、筛选、投稿、排行、评论或社区功能。

### P1：公开测试版前必须通过

- 首页看起来是长期项目地图第一版，而不是只有 5 个项目的网站。
- 方案 A 的轨道地图视觉路线在桌面和移动端都成立。
- 未来项目类型可见，并明确标注 `准备中`。
- V1 首批项目被表达为当前已开放路径。
- GitHub 仓库入口可见，链接到 `https://github.com/josephye72-source/vibecoding-market`。
- 每个项目的源码入口继续指向站内静态源码索引，而不是只剩一个总仓库链接。
- 原 `.map-intent` 弱文案模块被替换或并入轨道地图结构，不再布局错位。

### P2：强烈建议公开前通过

- 首页有鲜明视觉记忆点，不像普通模板。
- 390px 移动端路径标签仍可读。
- GitHub 入口是清楚的次行动，不抢主行动。
- 未来占位不会像坏掉的功能、付费功能或假按钮。
- 首页截图足够干净，可以用于社交媒体发布。

## 7. 策略会话的最终验收动作

执行团队完成后，策略会话负责人会做：

1. 复核或重跑 `npm run verify`。
2. 检查桌面和移动端截图。
3. 对照 V1 蓝图、补充 02、最终策略验收矩阵检查首页。
4. 把发现的问题分类为：蓝图变更、实现修复、后续版本事项。
5. 更新 `docs/reviews/acceptance/2026-06-13-v1-final-strategy-acceptance-matrix.md`。
6. 如果通过，新增最终验收报告。
7. 将已验收公开测试版落到 `main`，并把 GitHub 默认分支设为 `main`。

## 8. main 分支策略

当前仓库状态：

- GitHub 仓库：`https://github.com/josephye72-source/vibecoding-market`
- 当前已推送分支：`v1-implementation`
- 当前默认分支：`v1-implementation`

最终公开测试版策略：

- 已验收代码必须存在于 `main`。
- GitHub 默认分支必须设为 `main`。
- `v1-implementation` 可以保留为历史工作分支，也可以在确认 `main` 稳定后删除。
- 这件事由策略会话负责人在验收通过后处理，执行团队不需要在开发过程中强行切分支。

## 9. 自检结果

需求覆盖：

- 首页长期地图：任务 2、任务 4、任务 6 和 P1 验收覆盖。
- GitHub 入口：任务 5 和 P1 验收覆盖。
- 反馈准备中状态：任务 4、任务 7 和 P0 验收覆盖。
- 不扩 V2/V3：第 2 节、任务 6 和 P0 验收覆盖。
- `main` 分支要求：第 7 节和第 8 节覆盖。
- 公开测试版表述：第 2 节和最终验收动作覆盖。

占位检查：

- 本文没有待补占位项。
- 未来功能只以 `准备中` 状态展示，不提供假交互。

类型一致性：

- `HomeRoadmapLane` 只是建议实现结构。
- 最终必须满足的是页面行为和验收测试，不强制内部类型命名。
