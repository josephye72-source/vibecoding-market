# 习惯方格：源码导览

## 先看这些文件

1. `src/demos/habits/logic.ts`

   先读这里。它创建当月日期网格，切换日期勾选状态，计算月度次数和连续天数，并读写 `localStorage`。

2. `src/demos/habits/render.ts`

   这个文件负责渲染月份、统计、反馈文案和日期按钮。

3. `src/main.ts`

   这里把 Habit Grid 挂载到 `/#/projects/habit-grid/demo`。

4. `src/styles/app.css`

   搜索 `.habit-demo`。这一段控制 Growth Grid 的绿色网格、今天状态、已打卡状态和响应式布局。

5. `src/demos/habits/logic.test.ts`

   改日期规则前先看测试。日期最容易因为今天变化而出错，测试里会用固定日期保证预期稳定。

## 核心文件做什么

- `logic.ts`：负责日期 key、月份网格、勾选切换、存储、月度次数和连续天数。
- `render.ts`：负责日期按钮、点击事件、状态提示和统计刷新。
- `main.ts`：负责路由选择和 demo 挂载。
- `app.css`：负责绿色方格、今天描边、已勾选填充和移动端布局。
- `site.spec.ts`：用浏览器测试证明日期切换和刷新保留可用。

## 新手可改位置

1. 想改反馈文案：

   修改 `logic.ts` 里的 `getHabitFeedback`。

2. 想改方格颜色：

   修改 `app.css` 里的 `.habit-shell` 和 `.habit-day--checked`。

3. 想改统计区域重点：

   修改 `render.ts` 里的 `habit-summary` 标记。

写日期逻辑时，用稳定的日期 key 做判断；给人看的月份、星期和日期标签只负责展示。

## 构建工具与运行

这个项目使用 Vite。它会启动本地网页、自动刷新改动，并在发布前生成静态构建。

本地运行：

```powershell
npm install
npm run dev
```

然后打开本地地址，进入 `/#/projects/habit-grid/demo`。

发布前检查：

```powershell
npm run build
```

这个命令会检查 TypeScript，并生成可发布的 `dist/`。
