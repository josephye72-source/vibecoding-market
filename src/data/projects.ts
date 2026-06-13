export type ProjectKind = "app" | "game" | "tool";
export type MotifKey = "solar" | "arcade" | "ledger" | "growth" | "split";

export type PromptSet = {
  start: string;
  improve: string;
  debug: string;
};

export type RemixTask = {
  level: "轻改" | "中改" | "深改";
  title: string;
  description: string;
};

export type ProjectLinks = {
  demo: string;
  source: string;
  docs: string;
};

export type Project = {
  slug: string;
  docsFolder: string;
  links: ProjectLinks;
  title: string;
  kind: ProjectKind;
  role: string;
  summary: string;
  effect: string;
  audience: string;
  difficulty: "Level 1" | "Level 2" | "Level 3";
  estimatedTime: string;
  skills: string[];
  visualMotif: string;
  motifKey: MotifKey;
  learningGoals: string[];
  complexitySources: string[];
  sourceGuide: string[];
  promptSet: PromptSet;
  faq: string[];
  remixTasks: RemixTask[];
};

export const projects: Project[] = [
  {
    slug: "focus-pomodoro",
    docsFolder: "pomodoro",
    links: {
      demo: "#/projects/focus-pomodoro/demo",
      source: "#/projects/focus-pomodoro?section=source-guide",
      docs: "#/projects/focus-pomodoro?section=codex-doc"
    },
    title: "Focus Pomodoro",
    kind: "app",
    role: "第一个实用小应用",
    summary: "A small focus timer with progress and local session records.",
    effect: "做一个会记录专注次数的计时器",
    audience: "适合第一次想做出可用小工具的新手。",
    difficulty: "Level 1",
    estimatedTime: "45 minutes",
    skills: ["timer", "state", "buttons", "progress", "localStorage"],
    visualMotif: "Solar Dial",
    motifKey: "solar",
    learningGoals: [
      "让按钮在开始、暂停、重置之间切换。",
      "把倒计时和进度反馈同步到界面。",
      "把今日完成次数保存到浏览器本地。"
    ],
    complexitySources: [
      "页面结构：标题、计时区、操作区和记录区需要清楚分层。",
      "交互：开始、暂停、重置必须在同一个状态里互相影响。",
      "状态：剩余时间、运行中、当前模式和完成次数要保持一致。",
      "数据：localStorage 只保存少量本地记录，不引入后端。",
      "视觉完成度：Solar Dial 用暖色进度和圆形节奏表达专注。"
    ],
    sourceGuide: [
      "先看 src/demos/pomodoro/logic.ts，理解计时状态怎么变化。",
      "再看 src/demos/pomodoro/render.ts，找到按钮和进度条在哪里更新。",
      "最后看 docs/projects/pomodoro/source-guide.md，确认哪些位置适合新手先改。"
    ],
    promptSet: {
      start: "从空文件夹开始，做一个纯 HTML/CSS/TS 番茄钟，包含专注/休息模式、开始、暂停、重置、倒计时和进度显示。",
      improve: "把完成一次专注后的今日次数保存到 localStorage，并在刷新后继续显示完成反馈。",
      debug: "如果倒计时没有停止或重复加速，请检查 interval 是否在暂停、重置和路由切换时被清理。"
    },
    faq: [
      "为什么暂停后再次开始会跳秒？",
      "为什么刷新后完成次数没有保留？",
      "为什么进度条方向看起来反了？",
      "为什么按钮文字和状态对不上？",
      "为什么计时结束后没有完成反馈？"
    ],
    remixTasks: [
      { level: "轻改", title: "改时长", description: "把 25 分钟改成 15 分钟或 50 分钟。" },
      { level: "中改", title: "加任务名", description: "开始前输入本轮专注主题。" },
      { level: "深改", title: "做周统计", description: "把每天完成次数做成一周记录。" }
    ]
  },
  {
    slug: "memory-cards",
    docsFolder: "memory",
    links: {
      demo: "#/projects/memory-cards/demo",
      source: "#/projects/memory-cards?section=source-guide",
      docs: "#/projects/memory-cards?section=codex-doc"
    },
    title: "Memory Cards",
    kind: "game",
    role: "第一个游戏项目",
    summary: "A flip-card matching game with moves, shuffle, and win feedback.",
    effect: "翻牌匹配，赢下第一局小游戏",
    audience: "适合想理解点击状态和数组变化的新手。",
    difficulty: "Level 2",
    estimatedTime: "60 minutes",
    skills: ["arrays", "shuffle", "click state", "matching", "score"],
    visualMotif: "Neon Arcade Lab",
    motifKey: "arcade",
    learningGoals: [
      "把一组图案变成可点击的卡牌数组。",
      "判断两张牌是否匹配并给出反馈。",
      "记录步数，并在全部匹配后显示胜利。"
    ],
    complexitySources: [
      "页面结构：游戏目标、牌桌、步数和重开入口要同时可见。",
      "交互：点击第一张、第二张、匹配、失败回弹是连续流程。",
      "状态：翻开、已配对、暂时锁定三类状态要区分。",
      "数据：每一局都要重新洗牌，但不需要服务器。",
      "视觉完成度：Neon Arcade Lab 用霓虹、发光和游戏反馈制造记忆点。"
    ],
    sourceGuide: [
      "先看 src/demos/memory/logic.ts，理解洗牌和匹配判断。",
      "再看 src/demos/memory/render.ts，找到卡牌按钮状态。",
      "最后看测试文件，确认胜利和重新开始的判断。"
    ],
    promptSet: {
      start: "从空文件夹开始，做一个 12 张牌的记忆翻牌小游戏，支持点击、匹配和重新开始。",
      improve: "给匹配成功和失败分别增加清楚的视觉反馈，并显示步数。",
      debug: "如果能同时翻开三张牌，请检查第二张牌判断期间是否锁住牌桌。"
    },
    faq: [
      "为什么同一张牌能点两次？",
      "为什么失败的牌没有翻回去？",
      "为什么每局顺序都一样？",
      "为什么胜利状态提前出现？",
      "为什么手机上卡牌太小？"
    ],
    remixTasks: [
      { level: "轻改", title: "换图案", description: "把卡牌符号换成自己喜欢的主题。" },
      { level: "中改", title: "加计时", description: "记录完成一局用了多少秒。" },
      { level: "深改", title: "做难度", description: "增加 4x4 或 5x4 的牌桌尺寸。" }
    ]
  },
  {
    slug: "tiny-ledger",
    docsFolder: "ledger",
    links: {
      demo: "#/projects/tiny-ledger/demo",
      source: "#/projects/tiny-ledger?section=source-guide",
      docs: "#/projects/tiny-ledger?section=codex-doc"
    },
    title: "Tiny Ledger",
    kind: "tool",
    role: "本地数据工具",
    summary: "A local expense list with categories and simple totals.",
    effect: "记录收支并立刻看到余额",
    audience: "适合想做表单、列表和本地保存的新手。",
    difficulty: "Level 2",
    estimatedTime: "70 minutes",
    skills: ["forms", "lists", "categories", "totals", "localStorage"],
    visualMotif: "Receipt Ledger",
    motifKey: "ledger",
    learningGoals: [
      "用表单收集金额、分类和说明。",
      "把记录渲染成可删除的列表。",
      "根据本地数据计算收入、支出和余额。"
    ],
    complexitySources: [
      "页面结构：输入区、统计区、记录区要像账本一样清楚。",
      "交互：新增、删除、分类选择都会影响总计。",
      "状态：空列表、已有记录和删除后的状态要自然切换。",
      "数据：记录保存在 localStorage，刷新后继续存在。",
      "视觉完成度：Receipt Ledger 用纸张、绿色和票据线索表达可信记录。"
    ],
    sourceGuide: [
      "先看 src/demos/ledger/logic.ts，理解记录数组如何增删。",
      "再看 src/demos/ledger/render.ts，找到表单和统计卡片。",
      "最后看 storage helper，确认异常数据如何兜底。"
    ],
    promptSet: {
      start: "从空文件夹开始，做一个本地记账本，支持添加收支记录、分类和总计。",
      improve: "增加删除记录和刷新后保留数据的能力。",
      debug: "如果总计不更新，请检查新增和删除后是否重新计算列表。"
    },
    faq: [
      "为什么输入金额后变成字符串相加？",
      "为什么删除后余额没有变化？",
      "为什么刷新后记录消失？",
      "为什么空状态还显示旧提示？",
      "为什么负数输入会破坏统计？"
    ],
    remixTasks: [
      { level: "轻改", title: "改分类", description: "换成自己的消费分类。" },
      { level: "中改", title: "加日期", description: "让每条记录带上日期并按日期排序。" },
      { level: "深改", title: "做月报", description: "按月份汇总收支变化。" }
    ]
  },
  {
    slug: "habit-grid",
    docsFolder: "habits",
    links: {
      demo: "#/projects/habit-grid/demo",
      source: "#/projects/habit-grid?section=source-guide",
      docs: "#/projects/habit-grid?section=codex-doc"
    },
    title: "Habit Grid",
    kind: "app",
    role: "进度反馈工具",
    summary: "A habit calendar that turns daily check-ins into visible momentum.",
    effect: "把每日打卡变成一张进度网格",
    audience: "适合想练习日期、网格和连续反馈的新手。",
    difficulty: "Level 2",
    estimatedTime: "75 minutes",
    skills: ["dates", "calendar grid", "toggle state", "streaks", "feedback"],
    visualMotif: "Growth Grid",
    motifKey: "growth",
    learningGoals: [
      "生成一个月的日期网格。",
      "点击日期后切换打卡状态。",
      "显示本月完成数或连续打卡反馈。"
    ],
    complexitySources: [
      "页面结构：日历、统计和状态说明要一眼能懂。",
      "交互：点击格子要立即出现已打卡反馈。",
      "状态：今天、未打卡、已打卡要有不同表现。",
      "数据：日期键保存在 localStorage，不需要账号。",
      "视觉完成度：Growth Grid 用绿色网格和生长节奏表达累积。"
    ],
    sourceGuide: [
      "先看 src/demos/habits/logic.ts，理解日期数组如何生成。",
      "再看 src/demos/habits/render.ts，找到每个日期按钮。",
      "最后看本地保存逻辑，确认日期键格式保持稳定。"
    ],
    promptSet: {
      start: "从空文件夹开始，做一个习惯打卡日历，显示本月网格并支持点击打卡。",
      improve: "增加本月完成数量和连续打卡反馈，并保存到 localStorage。",
      debug: "如果今天高亮错位，请检查月份第一天和星期偏移。"
    },
    faq: [
      "为什么日历第一行错位？",
      "为什么刷新后打卡状态不见了？",
      "为什么今天没有高亮？",
      "为什么连续天数算错？",
      "为什么手机上网格溢出？"
    ],
    remixTasks: [
      { level: "轻改", title: "换习惯名", description: "把默认习惯改成喝水、阅读或运动。" },
      { level: "中改", title: "加备注", description: "允许给某一天写一句备注。" },
      { level: "深改", title: "多习惯", description: "支持同时追踪 2 到 3 个习惯。" }
    ]
  },
  {
    slug: "split-console",
    docsFolder: "split",
    links: {
      demo: "#/projects/split-console/demo",
      source: "#/projects/split-console?section=source-guide",
      docs: "#/projects/split-console?section=codex-doc"
    },
    title: "Split Console",
    kind: "tool",
    role: "场景型实用工具",
    summary: "A quick bill splitter with instant results and a shareable summary.",
    effect: "输入金额和人数，立刻算出分摊",
    audience: "适合想做即时计算和结果摘要的新手。",
    difficulty: "Level 1",
    estimatedTime: "50 minutes",
    skills: ["inputs", "calculation", "validation", "summary", "copy"],
    visualMotif: "Split Console",
    motifKey: "split",
    learningGoals: [
      "读取多个输入并即时计算结果。",
      "处理无效输入并给出可修正提示。",
      "生成一段可复制的分摊摘要。"
    ],
    complexitySources: [
      "页面结构：输入、结果和摘要要像控制台一样紧凑。",
      "交互：金额或人数变化后结果要立即更新。",
      "状态：有效结果、无效输入和复制反馈要区分。",
      "数据：只在当前页面计算，不需要保存隐私数据。",
      "视觉完成度：Split Console 用蓝色控制台和数字密度表达计算。"
    ],
    sourceGuide: [
      "先看 src/demos/split/logic.ts，理解分摊公式和校验。",
      "再看 src/demos/split/render.ts，找到输入和结果摘要。",
      "最后看复制反馈，理解用户操作后的即时状态。"
    ],
    promptSet: {
      start: "从空文件夹开始，做一个分摊计算器，输入总金额和人数后显示人均金额。",
      improve: "增加无效输入提示和一段可复制的结果摘要。",
      debug: "如果输入为空时出现 NaN，请先校验金额和人数再计算。"
    },
    faq: [
      "为什么结果显示 NaN？",
      "为什么人数为 0 还能计算？",
      "为什么修改输入后结果不变？",
      "为什么复制后没有反馈？",
      "为什么小数位看起来不统一？"
    ],
    remixTasks: [
      { level: "轻改", title: "改币种", description: "把结果格式改成人民币或美元。" },
      { level: "中改", title: "加服务费", description: "支持输入税费或服务费比例。" },
      { level: "深改", title: "多人明细", description: "让不同参与者承担不同项目。" }
    ]
  }
];
