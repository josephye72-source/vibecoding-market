# 记忆翻牌：源码导览

## 先看这些文件

1. `src/demos/memory/logic.ts`

   先看这里。它保存游戏规则：创建卡牌、洗牌、翻牌、判断配对、处理不匹配、胜利条件和重新开始。

2. `src/demos/memory/render.ts`

   这个文件负责把卡牌棋盘画到页面上，连接每张卡的点击事件，更新步数、状态提示，并安排不匹配卡牌的延迟翻回。

3. `src/main.ts`

   这里把 Memory Cards 挂载到 `/#/projects/memory-cards/demo`，并在切换路由时清理等待中的计时器。

4. `src/styles/app.css`

   搜索 `.memory-demo`。这一段控制 Neon Arcade Lab 的视觉，包括卡牌网格、发光、正反面状态和移动端布局。

5. `src/demos/memory/logic.test.ts`

   改规则前先读测试。它把“什么时候算一步”“什么时候锁住棋盘”“什么时候胜利”写得很清楚。

## 核心文件做什么

- `logic.ts`：纯函数规则层，负责卡牌状态、洗牌、翻牌和胜利判断。
- `render.ts`：负责 HTML、事件监听、界面刷新和延迟关闭不匹配卡牌。
- `main.ts`：负责路由选择、demo 挂载和清理。
- `app.css`：负责街机风卡牌网格、发光、匹配状态和响应式尺寸。
- `site.spec.ts`：用浏览器测试证明玩家能完成一次主要游戏流程。

## 新手可改位置

1. 想改卡牌符号：

   修改 `logic.ts` 里的 `DEFAULT_MEMORY_SYMBOLS`。

2. 想改不匹配卡牌停留多久：

   修改 `render.ts` 里的 `550` 毫秒延迟。

3. 想改霓虹发光效果：

   修改 `app.css` 里的 `.memory-shell`、`.memory-card` 和 `.memory-card.is-face-up`。

改动时尽量保持分工：`logic.ts` 只管哪些牌打开或配对，`render.ts` 只管什么时候重画，CSS 只管每种卡牌状态看起来如何。

## 构建工具与运行

这个项目使用 Vite。它会帮你在本地启动网页、监听文件变化，并在发布前生成静态 `dist/`。

本地运行：

```powershell
npm install
npm run dev
```

然后打开本地地址，进入 `/#/projects/memory-cards/demo`。

发布前检查：

```powershell
npm run build
```

这个命令会检查 TypeScript，并生成可发布的静态构建。
