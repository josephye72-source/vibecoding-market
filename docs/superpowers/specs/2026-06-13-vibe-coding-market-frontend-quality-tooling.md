# Vibe Coding Market 前端设计质量工具链

日期：2026-06-13
状态：已部署，等待重启 Codex 后自动发现新 skills

## 1. 目的

这份文档记录 Vibe Coding Market 在正式进入 V1 执行前引入的前端设计质量工具链。

这些工具不改变 V1 产品范围，不替代项目基准 Spec，也不允许执行 session 借它们引入后端、账号、复杂三维、复杂动画或重型工程化。它们的作用是提高视觉设计感、用户交互质量、可访问性和设计自检能力。

## 2. 当前环境已有能力

当前 Codex 环境已经启用以下插件能力：

- Build Web Apps：用于前端应用构建、浏览器测试、组件与 UI 实现；
- Product Design：用于产品设计上下文、原型和设计评审；
- Browser / in-app browser：用于本地页面打开、检查、截图和交互验证；
- Chrome / Computer Use：在确实需要现有浏览器状态或桌面操作时作为补充。

因此，本次不额外安装同类插件，避免重复能力冲突。新增部分主要采用 Codex skills。

## 3. 筛选依据

本次筛选优先考虑：

- GitHub 星标较高或来自可信团队；
- 能以 `SKILL.md` 形式被 Codex 使用；
- 直接服务前端视觉、UI/UX、可访问性或交互质量；
- 不要求账号、后端、复杂插件市场或额外平台化能力；
- 不会把 V1 带向课程平台、SaaS、重社区或复杂工程化。

检索时间：2026-06-13。

| 资源 | GitHub 星标 | 本次动作 | 主要原因 |
| --- | ---: | --- | --- |
| `anthropics/skills` | 150,054 | 安装 `frontend-design` | 官方 Agent Skills 仓库，前端视觉方向能力直接相关 |
| `nextlevelbuilder/ui-ux-pro-max-skill` | 91,044 | 安装 `ui-ux-pro-max` | UI/UX 知识库和设计系统辅助能力强 |
| `Leonxlnx/taste-skill` | 42,577 | 安装 `taste-skill` | 反模板化、提升审美判断，适合本项目的 Studio Anthology 策略 |
| `vercel-labs/agent-skills` | 27,870 | 安装 `web-design-guidelines` | Vercel 官方技能集合，适合作为 Web 体验与可访问性质量闸门 |
| `VoltAgent/awesome-agent-skills` | 25,171 | 不安装 | 聚合索引，不是单一可执行设计 skill |
| `alirezarezvani/claude-skills` | 17,941 | 不安装 | 大型泛用集合，当前阶段不宜批量引入 |
| `ComposioHQ/awesome-codex-skills` | 13,612 | 不安装 | Codex skills 索引价值高，但不直接解决视觉和交互质量 |

## 4. 已安装 Skills

以下 skills 已安装到：

`C:\Users\15618\.codex\skills`

### 4.1 frontend-design

来源：

- GitHub：`anthropics/skills`
- 路径：`skills/frontend-design`
- 安装位置：`C:\Users\15618\.codex\skills\frontend-design`

用途：

- 用于新 UI、首页、项目详情页、项目 demo 视觉方向设计；
- 强化具体主题、字体、布局、视觉签名；
- 防止生成模板感强、缺少观点的页面。

适用时机：

- 首页视觉方向；
- Studio Anthology 视觉路线；
- 每个项目 demo 的视觉母题；
- 视觉方案二次审查。

### 4.2 web-design-guidelines

来源：

- GitHub：`vercel-labs/agent-skills`
- 路径：`skills/web-design-guidelines`
- 安装位置：`C:\Users\15618\.codex\skills\web-design-guidelines`

用途：

- 作为前端体验和可访问性质量闸门；
- 检查语义 HTML、交互反馈、焦点状态、键盘可用性、响应式体验；
- 防止“视觉好看但不好用”。

适用时机：

- 每个 demo 完成后；
- 首页和详情页发布前；
- 移动端和桌面端体验检查；
- Release Review 前。

### 4.3 taste-skill

来源：

- GitHub：`Leonxlnx/taste-skill`
- 路径：`skills/taste-skill`
- 安装位置：`C:\Users\15618\.codex\skills\taste-skill`

用途：

- 作为反模板化、反平庸的审美增强工具；
- 用于检查页面是否过于普通、缺少视觉记忆点；
- 辅助项目 demo 做出更明确的视觉人格。

适用时机：

- 项目 demo 初版视觉方向；
- 视觉方案被认为“太普通”时；
- 发布前视觉完成度复核。

### 4.4 ui-ux-pro-max

来源：

- GitHub：`nextlevelbuilder/ui-ux-pro-max-skill`
- 路径：`.claude/skills/ui-ux-pro-max`
- 安装位置：`C:\Users\15618\.codex\skills\ui-ux-pro-max`

用途：

- 作为 UI/UX 设计知识库；
- 支持风格、配色、字体、产品类型、UX 指南等检索；
- 可辅助生成设计系统和视觉方向候选。

安装修复：

- 原目录中的 `data` 和 `scripts` 是符号链接；
- Windows 上安装后会变成链接文本；
- 已用完整仓库中的真实 `src/ui-ux-pro-max/data` 和 `src/ui-ux-pro-max/scripts` 替换为真实目录；
- 已验证 `scripts/search.py` 可运行。

适用时机：

- 制定首页或项目 demo 的设计系统；
- 需要快速比较视觉风格、字体和配色时；
- 设计 Review 需要更系统的 UI/UX 规则参考时。

## 5. 推荐使用顺序

### 5.1 首页或项目 demo 从 0 到 1 设计

推荐顺序：

1. 使用 `frontend-design` 形成具体视觉方向；
2. 使用 `ui-ux-pro-max` 辅助查找配色、字体、风格和 UX 规则；
3. 使用 `taste-skill` 做反模板化审查；
4. 使用 `web-design-guidelines` 做可访问性和交互质量审查；
5. 使用 Browser / Playwright 类工具截图检查桌面和移动端。

### 5.2 已有页面优化

推荐顺序：

1. 使用 `web-design-guidelines` 先查基础可用性问题；
2. 使用 `taste-skill` 判断视觉是否平庸或模板化；
3. 使用 `frontend-design` 提出更具体的视觉改造方向；
4. 使用浏览器截图做最终验证。

### 5.3 V1 Release Review 前

每个页面和 demo 至少经过：

- 1 次视觉方向检查；
- 1 次交互和可访问性检查；
- 1 次移动端截图检查；
- 1 次桌面端截图检查；
- 1 次是否触碰 V1 非目标的范围检查。

## 6. 暂不引入的候选

以下资源有价值，但当前 V1 暂不引入：

### 6.1 AccessLint plugin

原因：

- 主要面向 Claude plugin marketplace；
- 当前 V1 已有 `web-design-guidelines` 和浏览器测试作为轻量可访问性闸门；
- 后续如果需要更严格 WCAG 审计，再考虑引入。

### 6.2 Figma 系列 skills

原因：

- 官方 curated 列表中有 Figma 相关 skills；
- 当前项目尚未决定使用 Figma 作为主设计源；
- 如果后续开始做高保真设计稿或设计系统，可再安装。

### 6.3 大型 skills 聚合仓库

原因：

- 例如 `awesome-agent-skills`、`claude-skills`、`awesome-codex-skills` 更适合作为索引；
- 本项目当前需要的是少量稳定、直接服务前端设计质量的工具；
- 不建议一次性引入大量泛用技能，避免执行时触发混乱。

## 7. 项目使用规则

- 任何新 skill 不得绕过 V1 基准 Spec；
- 任何设计 skill 的建议都必须回到“纯 Web、小白可复现、视觉可解释”的约束下判断；
- 如果 skill 建议使用重型 3D、复杂 WebGL、复杂动效库、后端能力或账号系统，应默认拒绝；
- 视觉工具只负责提高完成度，不负责扩大产品范围；
- 发布前必须以 V1 基准 Spec 的验收标准为最终判定标准。

## 8. 后续维护

后续如果要新增前端设计相关 skills，必须满足：

- 有明确来源；
- 有 `SKILL.md` 或可被 Codex 识别的能力入口；
- 与 V1 / V2 的质量目标相关；
- 不引入账号、后端或平台化复杂度；
- 记录安装位置、用途、适用时机和不适用场景。
