# 账本小记：源码导览

## 先看这些文件

1. `src/demos/ledger/logic.ts`

   先读这里。它定义账本记录的字段、分类、添加/删除规则、统计计算，以及 `localStorage` 读写。

2. `src/demos/ledger/render.ts`

   这个文件负责表单、统计区域、空状态和记录列表的渲染，也会读取用户输入并调用逻辑层。

3. `src/main.ts`

   这里把 Tiny Ledger 挂载到 `/#/projects/tiny-ledger/demo`。

4. `src/styles/app.css`

   搜索 `.ledger-demo`。这一段控制 Receipt Ledger 的纸张质感、收据行、表单控件和统计布局。

5. `src/demos/ledger/logic.test.ts`

   改账本规则前先看测试。它说明添加、删除、统计和损坏存储的预期结果。

## 核心文件做什么

- `logic.ts`：负责数据形状、分类、存储、安全解析、添加、删除和统计。
- `render.ts`：负责 DOM 表单、`FormData` 读取、列表刷新和空状态。
- `main.ts`：负责路由选择和 demo 挂载。
- `app.css`：负责账本纸面、收据行、金额提示和移动端表单。
- `site.spec.ts`：用浏览器测试证明添加、删除、刷新保留和空状态可用。

## 新手可改位置

1. 想改分类：

   修改 `logic.ts` 里的 `LEDGER_CATEGORIES`。

2. 想改空状态文案：

   修改 `logic.ts` 里的 `getLedgerEmptyState`。

3. 想改金额显示：

   修改 `render.ts` 里的 `formatMoney`。

保持一个原则：表单只收集数据，逻辑层改变记录数组，收入、支出和余额永远从记录数组重新计算，不单独存一份。

## 构建工具与运行

这个项目使用 Vite。它负责本地开发服务器、自动刷新，以及把 HTML/CSS/TS 打包成静态文件。

本地运行：

```powershell
npm install
npm run dev
```

然后打开本地地址，进入 `/#/projects/tiny-ledger/demo`。

发布前检查：

```powershell
npm run build
```

这个命令会做 TypeScript 检查，并创建静态 `dist/` 构建。
