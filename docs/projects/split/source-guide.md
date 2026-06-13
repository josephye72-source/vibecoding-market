# 分账控制台：源码导览

## 先看这些文件

1. `src/demos/split/logic.ts`

   先读这里。它解析总金额、明细金额和参与者，校验输入，计算总额和人均金额，并生成可复制的摘要。

2. `src/demos/split/render.ts`

   这个文件负责渲染输入框、监听输入变化、刷新结果，并处理复制按钮。

3. `src/main.ts`

   这里把 Split Console 挂载到 `/#/projects/split-console/demo`。

4. `src/styles/app.css`

   搜索 `.split-demo`。这一段控制蓝色控制台面板、结果重点、错误状态和响应式控件。

5. `src/demos/split/logic.test.ts`

   改计算规则前先看测试。它说明有效输入、无效输入、明细金额和复制摘要应该如何工作。

## 核心文件做什么

- `logic.ts`：负责解析、校验、计算、格式化和摘要生成。
- `render.ts`：负责 DOM 输入、即时重算、复制反馈和按钮状态。
- `main.ts`：负责路由选择和 demo 挂载。
- `app.css`：负责控制台布局、数字重点、错误提示和移动端控件。
- `site.spec.ts`：用浏览器测试证明有效输入、无效输入、明细和复制流程可用。

## 新手可改位置

1. 想改货币显示：

   修改 `logic.ts` 里的 `formatSplitMoney`。

2. 想改校验提示：

   修改 `logic.ts` 里 `calculateSplit` 返回的错误字符串。

3. 想改复制摘要：

   修改 `logic.ts` 里的 `copyableSplitSummary`。

保持一个原则：同一个结果对象应该同时驱动可见总额、人均结果、错误提示、摘要文字和复制按钮状态。

## 构建工具与运行

这个项目使用 Vite。它负责启动本地开发网页、监听文件变化，并把 HTML/CSS/TS 打包成静态文件。

本地运行：

```powershell
npm install
npm run dev
```

然后打开本地地址，进入 `/#/projects/split-console/demo`。

发布前检查：

```powershell
npm run build
```

这个命令会检查 TypeScript，并生成静态 `dist/` 构建。
