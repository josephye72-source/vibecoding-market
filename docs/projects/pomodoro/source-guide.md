# 专注番茄钟：源码导览

## 先看这些文件

1. `src/demos/pomodoro/logic.ts`

   先从这里读起最稳。它负责番茄钟的状态、专注/休息模式切换、进度计算、完成逻辑，以及把当天完成次数保存到 `localStorage`。

2. `src/demos/pomodoro/render.ts`

   这个文件把逻辑变成浏览器里的界面。它生成 Solar Dial 的 HTML，连接 Start、Pause、Reset 和模式按钮，管理计时器 interval，并更新倒计时和进度文字。

3. `src/main.ts`

   这里根据路由挂载 demo。专注番茄钟会在 `/#/projects/focus-pomodoro/demo` 下启动，并在离开页面时清理旧的 demo。

4. `src/styles/app.css`

   搜索 `.pomodoro-demo`。这一段控制暖色面板、圆形进度盘、按钮状态、响应式布局和减少动画设置。

5. `src/demos/pomodoro/logic.test.ts`

   改计时规则前先看测试。它说明了倒计时、完成次数和异常存储的预期行为。

## 核心文件做什么

- `logic.ts`：决定状态怎么变，包括模式、剩余秒数、进度、完成次数和 `localStorage` 兜底。
- `render.ts`：负责 HTML、DOM 查询、事件监听、interval 生命周期和界面刷新。
- `main.ts`：负责路由选择、挂载 Pomodoro demo，以及切换页面时清理资源。
- `app.css`：负责布局、颜色、触控尺寸、进度盘、键盘焦点和移动端适配。
- `site.spec.ts`：用浏览器测试证明用户能进入 demo 并完成核心操作。

## 新手可改位置

1. 想改专注和休息时长：

   修改 `logic.ts` 里的 `DEFAULT_POMODORO_DURATIONS`。

2. 想改完成后的提示文案：

   修改 `logic.ts` 里 `completeSession` 返回的消息。

3. 想改视觉温度：

   修改 `app.css` 里的 `.pomodoro-demo__panel`、`.pomodoro-dial__progress` 和 `.pomodoro-mode-button[aria-pressed="true"]`。

修改时记住一个简单分工：逻辑决定状态，渲染层决定状态怎么显示，CSS 决定 Solar Dial 的气质。这样拆开后，项目更容易测试，也更容易二创。

## 构建工具与运行

这个项目使用 Vite。对新手来说，Vite 就是本地开发小助手：它会打开本地网页、在文件变化后自动刷新，并把普通的 HTML/CSS/TS 打包成可发布的静态文件。

本地运行：

```powershell
npm install
npm run dev
```

然后打开 Vite 输出的本地地址，进入 `/#/projects/focus-pomodoro/demo`。

发布前检查：

```powershell
npm run build
```

这个命令应该在没有 TypeScript 或 Vite 报错的情况下完成。
