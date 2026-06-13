import type { Project } from "../data/projects";
import type { Locale, LocalizedProjectText } from "./types";

const localeSet = new Set(["zh", "en"]);

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && localeSet.has(value);
}

export function normalizeLocale(value: unknown): Locale {
  return isLocale(value) ? value : "zh";
}

const zhProjects: Record<string, LocalizedProjectText> = {
  "focus-pomodoro": {
    title: "专注番茄钟",
    role: "第一个实用小应用",
    summary: "带进度和本地记录的专注计时器。",
    effect: "做一个会记录专注次数的计时器",
    audience: "适合第一次想做出可用小工具的新手。",
    difficulty: "难度 1",
    estimatedTime: "45 分钟",
    skills: ["计时器", "状态", "按钮", "进度", "本地保存"],
    visualMotif: "Solar Dial / 专注计时舱",
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
  "memory-cards": {
    title: "记忆翻牌小游戏",
    role: "第一个游戏项目",
    summary: "带洗牌、步数和胜利反馈的翻牌配对游戏。",
    effect: "翻牌匹配，赢下第一局小游戏",
    audience: "适合想理解点击状态和数组变化的新手。",
    difficulty: "难度 2",
    estimatedTime: "60 分钟",
    skills: ["数组", "洗牌", "点击状态", "配对判断", "得分"],
    visualMotif: "Neon Arcade Lab / 霓虹实验台",
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
  "tiny-ledger": {
    title: "极简记账本",
    role: "本地数据工具",
    summary: "带分类、列表和本地保存的收支记录。",
    effect: "记录收支并立刻看到余额",
    audience: "适合想做表单、列表和本地保存的新手。",
    difficulty: "难度 2",
    estimatedTime: "70 分钟",
    skills: ["表单", "列表", "分类", "统计", "本地保存"],
    visualMotif: "Receipt Ledger / 票据账房",
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
  "habit-grid": {
    title: "习惯打卡日历",
    role: "进度反馈工具",
    summary: "把每日打卡变成可见进度的日历网格。",
    effect: "把每日打卡变成一张进度网格",
    audience: "适合想练习日期、网格和连续反馈的新手。",
    difficulty: "难度 2",
    estimatedTime: "75 分钟",
    skills: ["日期", "日历网格", "切换状态", "连续反馈", "本地保存"],
    visualMotif: "Growth Grid / 生长网格",
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
  "split-console": {
    title: "预算 / 分摊计算器",
    role: "场景型实用工具",
    summary: "输入金额和参与者，立刻得到可复制分摊结果。",
    effect: "输入金额和人数，立刻算出分摊",
    audience: "适合想做即时计算和结果摘要的新手。",
    difficulty: "难度 1",
    estimatedTime: "50 分钟",
    skills: ["输入", "计算", "校验", "摘要", "复制"],
    visualMotif: "Split Console / 分账控制台",
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
};

const enProjects: Record<string, LocalizedProjectText> = {
  "focus-pomodoro": {
    title: "Focus Pomodoro",
    role: "First practical mini app",
    summary: "A focus timer with progress and local session records.",
    effect: "Build a timer that records completed focus rounds.",
    audience: "For beginners making their first useful browser tool.",
    difficulty: "Level 1",
    estimatedTime: "45 minutes",
    skills: ["timer", "state", "buttons", "progress", "localStorage"],
    visualMotif: "Solar Dial",
    learningGoals: [
      "Switch timer controls between start, pause, and reset.",
      "Sync countdown and progress feedback in the interface.",
      "Save today's completed focus rounds in the browser."
    ],
    complexitySources: [
      "Page structure: the title, timer area, controls, and record area need clear layers.",
      "Interaction: start, pause, reset, and mode switching all affect the same state.",
      "State: remaining time, running status, current mode, and completed count must stay consistent.",
      "Data: localStorage only keeps a small local record and does not introduce a backend.",
      "Visual completion: Solar Dial uses warm progress and circular rhythm to express focus."
    ],
    sourceGuide: [
      "Read src/demos/pomodoro/logic.ts first to understand how timer state changes.",
      "Then read src/demos/pomodoro/render.ts to find where buttons and progress update.",
      "Finally read docs/projects/pomodoro/source-guide.md to see beginner-friendly edit points."
    ],
    promptSet: {
      start: "From an empty folder, build a pure HTML/CSS/TS pomodoro timer with focus and break modes, start, pause, reset, countdown, and progress display.",
      improve: "Save today's completed focus count to localStorage after a focus round finishes, and keep showing it after refresh.",
      debug: "If the countdown does not stop or starts speeding up, check whether the interval is cleared on pause, reset, and route changes."
    },
    faq: [
      "Why does the timer skip seconds after pausing?",
      "Why does the completed count disappear after refresh?",
      "Why does the progress direction look reversed?",
      "Why do the button labels and status disagree?",
      "Why is there no completion feedback when the timer ends?"
    ],
    remixTasks: [
      { level: "Light", title: "Change durations", description: "Turn 25 minutes into 15 or 50 minutes." },
      { level: "Medium", title: "Add a task name", description: "Let the user name the current focus round before starting." },
      { level: "Deep", title: "Build weekly stats", description: "Track completed rounds across a week." }
    ]
  },
  "memory-cards": {
    title: "Memory Cards",
    role: "First game project",
    summary: "A flip-card matching game with moves, shuffle, and win feedback.",
    effect: "Match pairs and clear your first tiny game.",
    audience: "For beginners learning click state and arrays.",
    difficulty: "Level 2",
    estimatedTime: "60 minutes",
    skills: ["arrays", "shuffle", "click state", "matching", "score"],
    visualMotif: "Neon Arcade Lab",
    learningGoals: [
      "Turn a symbol set into a clickable card array.",
      "Judge whether two flipped cards match and show feedback.",
      "Count moves and show a win state after all pairs are matched."
    ],
    complexitySources: [
      "Page structure: the goal, card board, move count, and restart action must stay visible.",
      "Interaction: first click, second click, match, and mismatch rollback form one continuous flow.",
      "State: face-down, face-up, matched, and locked states need clear separation.",
      "Data: each round reshuffles cards without requiring a server.",
      "Visual completion: Neon Arcade Lab uses glow, contrast, and game feedback to create memory."
    ],
    sourceGuide: [
      "Read src/demos/memory/logic.ts first to understand shuffle and matching rules.",
      "Then read src/demos/memory/render.ts to see how card button states update.",
      "Finally read the tests to verify win and restart behavior."
    ],
    promptSet: {
      start: "From an empty folder, build a 12-card memory game with clicking, matching, mismatch feedback, move count, and restart.",
      improve: "Add clear visual feedback for matches and mismatches, and show the move count.",
      debug: "If three cards can be open at once, check whether the board is locked while the second card is being judged."
    },
    faq: [
      "Why can the same card be clicked twice?",
      "Why do mismatched cards stay face up?",
      "Why is the order identical every round?",
      "Why does the win state appear too early?",
      "Why are cards too small on mobile?"
    ],
    remixTasks: [
      { level: "Light", title: "Change symbols", description: "Replace the card symbols with your own theme." },
      { level: "Medium", title: "Add a timer", description: "Record how many seconds it takes to clear a round." },
      { level: "Deep", title: "Add difficulty", description: "Support a 4x4 or 5x4 board size." }
    ]
  },
  "tiny-ledger": {
    title: "Tiny Ledger",
    role: "Local data tool",
    summary: "A local expense list with categories and simple totals.",
    effect: "Record income and expense, then see the balance immediately.",
    audience: "For beginners practicing forms, lists, and local saving.",
    difficulty: "Level 2",
    estimatedTime: "70 minutes",
    skills: ["forms", "lists", "categories", "totals", "localStorage"],
    visualMotif: "Receipt Ledger",
    learningGoals: [
      "Collect amount, category, note, and date through a form.",
      "Render records as a list that can delete individual items.",
      "Calculate income, expense, and balance from local data."
    ],
    complexitySources: [
      "Page structure: input, stats, and records should read like a simple ledger.",
      "Interaction: add, delete, and category choices all affect the totals.",
      "State: empty list, saved records, and post-delete state need natural transitions.",
      "Data: records persist in localStorage and survive refresh.",
      "Visual completion: Receipt Ledger uses paper, green accents, and receipt cues to feel trustworthy."
    ],
    sourceGuide: [
      "Read src/demos/ledger/logic.ts first to understand how records are added and deleted.",
      "Then read src/demos/ledger/render.ts to find the form and stats cards.",
      "Finally inspect the storage helper to see how invalid data is handled."
    ],
    promptSet: {
      start: "From an empty folder, build a local ledger that can add income and expense records, categories, and totals.",
      improve: "Add record deletion and keep data after refresh.",
      debug: "If totals do not update, check whether the list is recalculated after add and delete operations."
    },
    faq: [
      "Why do amounts concatenate as strings?",
      "Why does the balance not change after deletion?",
      "Why do records disappear after refresh?",
      "Why does the empty state still show old text?",
      "Why do negative inputs break totals?"
    ],
    remixTasks: [
      { level: "Light", title: "Change categories", description: "Replace the default expense categories with your own." },
      { level: "Medium", title: "Add dates", description: "Let every record carry a date and sort by date." },
      { level: "Deep", title: "Build a monthly report", description: "Summarize income and expense changes by month." }
    ]
  },
  "habit-grid": {
    title: "Habit Grid",
    role: "Progress feedback tool",
    summary: "A habit calendar that turns check-ins into visible momentum.",
    effect: "Turn daily check-ins into a progress grid.",
    audience: "For beginners practicing dates, grids, and progress feedback.",
    difficulty: "Level 2",
    estimatedTime: "75 minutes",
    skills: ["dates", "calendar grid", "toggle state", "streaks", "feedback"],
    visualMotif: "Growth Grid",
    learningGoals: [
      "Generate a monthly date grid.",
      "Toggle check-in state by clicking a date.",
      "Show monthly count and streak feedback."
    ],
    complexitySources: [
      "Page structure: calendar, stats, and status copy should be understandable at a glance.",
      "Interaction: each date click should immediately show checked feedback.",
      "State: today, empty dates, and checked dates need distinct presentation.",
      "Data: date keys are saved in localStorage without an account.",
      "Visual completion: Growth Grid uses green cells and accumulated rhythm to express progress."
    ],
    sourceGuide: [
      "Read src/demos/habits/logic.ts first to understand how date arrays are generated.",
      "Then read src/demos/habits/render.ts to find each date button.",
      "Finally inspect local saving to keep the date key format stable."
    ],
    promptSet: {
      start: "From an empty folder, build a habit calendar that shows the current month and supports date check-ins.",
      improve: "Add monthly count, streak feedback, and localStorage persistence.",
      debug: "If today's highlight is misplaced, check the first day of the month and weekday offset."
    },
    faq: [
      "Why is the first row of the calendar offset?",
      "Why do checked dates disappear after refresh?",
      "Why is today not highlighted?",
      "Why is the streak count wrong?",
      "Why does the grid overflow on mobile?"
    ],
    remixTasks: [
      { level: "Light", title: "Rename the habit", description: "Change the default habit to water, reading, or exercise." },
      { level: "Medium", title: "Add notes", description: "Allow a short note for a selected day." },
      { level: "Deep", title: "Track multiple habits", description: "Support two or three habits at the same time." }
    ]
  },
  "split-console": {
    title: "Split Console",
    role: "Scenario utility",
    summary: "A quick bill splitter with instant results and a shareable summary.",
    effect: "Enter an amount and people to calculate the split.",
    audience: "For beginners practicing instant calculation and result summaries.",
    difficulty: "Level 1",
    estimatedTime: "50 minutes",
    skills: ["inputs", "calculation", "validation", "summary", "copy"],
    visualMotif: "Split Console",
    learningGoals: [
      "Read multiple inputs and calculate results immediately.",
      "Handle invalid inputs with clear correction hints.",
      "Generate a copyable split summary."
    ],
    complexitySources: [
      "Page structure: inputs, result, and summary should feel compact like a console.",
      "Interaction: changing amount or people should update the result instantly.",
      "State: valid result, invalid input, and copy feedback need separate states.",
      "Data: everything is calculated on the page without storing private data.",
      "Visual completion: Split Console uses blue control-panel styling and dense numbers to express calculation."
    ],
    sourceGuide: [
      "Read src/demos/split/logic.ts first to understand the split formula and validation.",
      "Then read src/demos/split/render.ts to find the inputs and result summary.",
      "Finally inspect copy feedback to understand the immediate state after user action."
    ],
    promptSet: {
      start: "From an empty folder, build a split calculator that takes a total amount and people, then shows the amount per person.",
      improve: "Add invalid input hints and a copyable result summary.",
      debug: "If empty inputs produce NaN, validate amount and people before calculating."
    },
    faq: [
      "Why does the result show NaN?",
      "Why can zero people still calculate?",
      "Why does changing input not update the result?",
      "Why is there no feedback after copying?",
      "Why do decimals look inconsistent?"
    ],
    remixTasks: [
      { level: "Light", title: "Change currency", description: "Format the result as CNY or USD." },
      { level: "Medium", title: "Add service fees", description: "Support tax or service-fee percentages." },
      { level: "Deep", title: "Add participant details", description: "Let different people pay different items." }
    ]
  }
};

export const dictionaries = {
  zh: {
    localeName: "中文",
    shell: {
      skip: "跳到主要内容",
      navLabel: "主导航",
      nav: {
        home: "首页",
        projects: "V1 首批项目",
        path: "复现路径",
        feedback: "反馈"
      },
      languageToggle: "English"
    },
    home: {
      heroLede: "公开、公益、可复现的 vibe coding 项目地图",
      heroAnswer: "这里收集能在线体验、能阅读源码、能跟 Codex 从 0 到 1 复现的 Web 作品。先从 V1 的 5 个首批项目开始，验证一条小白也能走通的创作路径。",
      primaryCta: "从第一个项目开始",
      secondaryCta: "查看首批项目",
      tagsLabel: "站点定位",
      tags: ["公开", "公益", "可复现", "无需登录"],
      projectsTitle: "V1 首批项目",
      projectsText: "这 5 个纯 Web 小项目是当前 release 的验证样本，不是 Vibe Coding Market 的长期边界。",
      pathTitle: "复现路径",
      pathSteps: [
        { title: "先体验", text: "先打开成品，知道最终会做出什么。" },
        { title: "看懂", text: "看复杂度从哪里来，不先背概念。" },
        { title: "看源码", text: "从真实源码入口找到核心文件。" },
        { title: "跟做", text: "用 Codex 从空文件夹一步步复现。" },
        { title: "二创", text: "换主题、加小功能，做成自己的版本。" }
      ],
      mapTitle: "项目地图会继续长出来",
      mapText: "V1 先验证首批项目和复现系统。后续可以扩展更多项目和路径，但不会在这个版本提前加入复杂筛选、投稿、排行或社区系统。"
    },
    feedback: {
      heading: "反馈入口",
      body: "反馈方式准备中。现在先保留入口位置，并明确未来要收集四件事：最感兴趣项目、是否愿意复现、卡住位置、二创想法。",
      pendingLabel: "反馈方式准备中"
    },
    projectCard: {
      difficulty: "难度",
      time: "时间",
      demo: "在线体验",
      detail: "查看详情",
      skillsLabel: "{title} 核心技能",
      linksLabel: "{title} 链接"
    },
    projectDetail: {
      sections: ["项目头部", "在线体验", "你会学到什么", "复杂度从哪里来", "源码入口与源码导览", "Codex 文档", "Prompt 区", "常见问题", "二创任务"],
      metadataLabel: "{title} 元数据",
      difficulty: "难度",
      estimatedTime: "预计复现时间",
      role: "路径角色",
      visualMotif: "视觉母题",
      openDemo: "在线体验",
      viewSource: "查看源码",
      followCodex: "跟着 Codex 做",
      feedback: "反馈",
      onlineDemoBody: "这个 demo 可以直接在浏览器里体验核心闭环，不需要后端、登录、数据库或 API。",
      codexDocBody: "用这些文档从空文件夹开始复现、排错和二创这个项目。",
      promptStart: "起步 Prompt",
      promptImprove: "修改 Prompt",
      promptDebug: "排错 Prompt",
      notFoundTitle: "没有找到这个项目",
      notFoundBody: "回到首页，从 V1 首批项目里重新选择。"
    },
    docs: {
      "codex-from-zero": "Codex 从 0 到 1",
      "source-guide": "源码导览",
      "complexity-map": "复杂度拆解",
      faq: "常见问题",
      "remix-prompts": "二创任务"
    },
    demos: {
      pomodoro: {
        title: "专注番茄钟",
        lede: "开始一轮专注，看进度盘移动，并把今天完成次数留在这个浏览器里。",
        focus: "专注",
        break: "休息",
        modeLabel: { focus: "专注模式", break: "休息模式" },
        start: "开始",
        pause: "暂停",
        reset: "重置",
        status: "状态",
        completedToday: "今日完成",
        controlsLabel: "番茄钟控制",
        modeGroupLabel: "计时模式",
        progressLabel: "计时进度",
        statusText: { idle: "就绪", running: "进行中", paused: "已暂停", complete: "已完成" },
        message: {
          idle: "准备开始。",
          focusRunning: "专注计时进行中。",
          breakRunning: "休息计时进行中。",
          paused: "计时已暂停。",
          focusComplete: "专注完成。可以休息一下。",
          breakComplete: "休息完成。可以开始下一轮专注。",
          focusReady: "专注模式就绪。",
          breakReady: "休息模式就绪。"
        }
      },
      memory: {
        title: "记忆翻牌小游戏",
        lede: "翻开卡牌、找到配对，并用重新开始生成新牌桌。",
        moves: "步数",
        restart: "重新开始",
        gridLabel: "记忆卡牌网格",
        hiddenCard: "隐藏的记忆卡牌",
        cardLabel: "卡牌",
        feedback: {
          ready: "翻开两张牌，找到一组配对。",
          first: "再选一张牌。",
          match: "配对成功。",
          mismatch: "没有配对，继续试试。",
          win: "全部配对完成，你通关了。"
        }
      },
      ledger: {
        title: "极简记账本",
        lede: "添加收入和支出记录，刷新后确认本地账本仍然存在。",
        type: "类型",
        income: "收入",
        expense: "支出",
        amount: "金额",
        category: "分类",
        note: "备注",
        date: "日期",
        addRecord: "添加记录",
        balance: "余额",
        emptyMessage: "还没有记录。添加第一条收入或支出，唤醒这本账。",
        emptyAction: "添加第一条记录",
        delete: "删除",
        deleteLabel: "删除",
        recordsLabel: "账本记录",
        categories: {
          Work: "工作",
          Food: "餐饮",
          Transit: "交通",
          Home: "居家"
        },
        storageStatus: {
          saved: "更改已保存到此浏览器。",
          failed: "更改已显示在页面上，但未能保存到此浏览器。"
        }
      },
      habits: {
        title: "习惯打卡日历",
        lede: "点击日期，让格子变亮，用本月统计看见进度。",
        thisMonth: "本月完成",
        currentStreak: "当前连续",
        calendarLabel: "习惯打卡日历",
        checked: "已打卡",
        storageStatus: {
          saved: "打卡已保存到此浏览器。",
          failed: "打卡已显示在页面上，但未能保存到此浏览器。"
        },
        feedback: {
          empty: "还没有打卡。选一个日期开始。",
          checked: "已打卡，一个格子亮起来了。",
          streak: "连续 {count} 天，网格正在生长。"
        }
      },
      split: {
        title: "预算 / 分摊计算器",
        lede: "输入总额或明细，再填参与者，立刻得到可复制的分摊结果。",
        total: "总额",
        items: "明细",
        participants: "参与者",
        eachPerson: "每人",
        emptySummary: "输入数值后生成摘要。",
        copySummary: "复制摘要",
        copied: "摘要已复制。",
        copyUnavailable: "复制不可用，请手动选中摘要。",
        errors: {
          positiveItems: "请先修正明细金额，只能使用正数。",
          positiveTotal: "请输入正数总额，或至少一项正数明细。",
          participant: "请至少输入一位参与者。"
        },
        summary: "将 {total} 分给 {who}：每人 {perPerson}。"
      }
    },
    projects: zhProjects
  },
  en: {
    localeName: "English",
    shell: {
      skip: "Skip to main content",
      navLabel: "Primary navigation",
      nav: {
        home: "Home",
        projects: "V1 first batch",
        path: "Rebuild path",
        feedback: "Feedback"
      },
      languageToggle: "中文"
    },
    home: {
      heroLede: "An open, public-interest, reproducible vibe coding project map",
      heroAnswer: "Explore web projects you can try online, read as source, and rebuild with Codex from zero. V1 starts with five pure Web projects to validate the path.",
      primaryCta: "Start with the first project",
      secondaryCta: "View the first batch",
      tagsLabel: "Site positioning",
      tags: ["Open", "Public-interest", "Reproducible", "No login"],
      projectsTitle: "V1 first-batch projects",
      projectsText: "These five pure Web projects are the current release sample, not the long-term boundary of Vibe Coding Market.",
      pathTitle: "Rebuild path",
      pathSteps: [
        { title: "Try", text: "Open the finished demo before reading theory." },
        { title: "Understand", text: "See where the complexity actually comes from." },
        { title: "Read source", text: "Use the real source entry to find core files." },
        { title: "Rebuild", text: "Use Codex to recreate it from an empty folder." },
        { title: "Remix", text: "Change the theme or add a small feature." }
      ],
      mapTitle: "The project map grows from here",
      mapText: "V1 validates the first batch and the rebuild system. Future versions can add more paths without adding search, submissions, rankings, or community systems now."
    },
    feedback: {
      heading: "Feedback entry",
      body: "Feedback channel is being prepared. This space records the four signals we need later: favorite project, willingness to rebuild, stuck point, and remix idea.",
      pendingLabel: "Feedback channel pending"
    },
    projectCard: {
      difficulty: "Level",
      time: "Time",
      demo: "Live demo",
      detail: "Details",
      skillsLabel: "{title} core skills",
      linksLabel: "{title} links"
    },
    projectDetail: {
      sections: ["Project header", "Live demo", "What you will learn", "Where complexity comes from", "Source entry and guide", "Codex docs", "Prompt zone", "FAQ", "Remix tasks"],
      metadataLabel: "{title} metadata",
      difficulty: "Level",
      estimatedTime: "Estimated rebuild time",
      role: "Path role",
      visualMotif: "Visual motif",
      openDemo: "Open Live Demo",
      viewSource: "View source",
      followCodex: "Rebuild with Codex",
      feedback: "Feedback",
      onlineDemoBody: "This demo is live in the browser and needs no backend, login, database, or API.",
      codexDocBody: "Use these docs to rebuild, inspect, troubleshoot, and remix this project from a blank folder.",
      promptStart: "Starting Prompt",
      promptImprove: "Improvement Prompt",
      promptDebug: "Debugging Prompt",
      notFoundTitle: "Project not found",
      notFoundBody: "Return home and choose from the V1 first-batch projects."
    },
    docs: {
      "codex-from-zero": "Codex From Zero",
      "source-guide": "Source Guide",
      "complexity-map": "Complexity Map",
      faq: "FAQ",
      "remix-prompts": "Remix Prompts"
    },
    demos: {
      pomodoro: {
        title: "Focus Pomodoro",
        lede: "Start one focus round, watch the dial move, and keep today's completed count on this browser.",
        focus: "Focus",
        break: "Break",
        modeLabel: { focus: "Focus mode", break: "Break mode" },
        start: "Start",
        pause: "Pause",
        reset: "Reset",
        status: "Status",
        completedToday: "Completed Today",
        controlsLabel: "Pomodoro controls",
        modeGroupLabel: "Timer mode",
        progressLabel: "Timer progress",
        statusText: { idle: "ready", running: "running", paused: "paused", complete: "complete" },
        message: {
          idle: "Ready to start.",
          focusRunning: "Focus timer running.",
          breakRunning: "Break timer running.",
          paused: "Timer paused.",
          focusComplete: "Focus session complete. Take a short break.",
          breakComplete: "Break complete. Ready for another focus round.",
          focusReady: "Focus mode ready.",
          breakReady: "Break mode ready."
        }
      },
      memory: {
        title: "Memory Cards",
        lede: "Flip cards, catch pairs, and restart with a fresh shuffled board.",
        moves: "Moves",
        restart: "Restart game",
        gridLabel: "Memory card grid",
        hiddenCard: "Hidden memory card",
        cardLabel: "Card",
        feedback: {
          ready: "Flip two cards to find a pair.",
          first: "Pick one more card.",
          match: "Match found.",
          mismatch: "Not a match. Try again.",
          win: "All pairs matched. You cleared the lab."
        }
      },
      ledger: {
        title: "Tiny Ledger",
        lede: "Add simple income and expense records, then refresh to confirm the local ledger stays put.",
        type: "Type",
        income: "Income",
        expense: "Expense",
        amount: "Amount",
        category: "Category",
        note: "Note",
        date: "Date",
        addRecord: "Add record",
        balance: "Balance",
        emptyMessage: "No records yet. Add your first income or expense to wake up the ledger.",
        emptyAction: "Add first record",
        delete: "Delete",
        deleteLabel: "Delete",
        recordsLabel: "Ledger records",
        categories: {
          Work: "Work",
          Food: "Food",
          Transit: "Transit",
          Home: "Home"
        },
        storageStatus: {
          saved: "Changes saved in this browser.",
          failed: "Changes updated on screen, but they could not be saved in this browser."
        }
      },
      habits: {
        title: "Habit Grid",
        lede: "Tap a date, turn it green, and let the month count show momentum.",
        thisMonth: "This month",
        currentStreak: "Current streak",
        calendarLabel: "Habit calendar",
        checked: "checked",
        storageStatus: {
          saved: "Check-in saved in this browser.",
          failed: "Check-in updated on screen, but it could not be saved in this browser."
        },
        feedback: {
          empty: "No check-ins yet. Pick a date to start the grid.",
          checked: "Date checked. One square is alive.",
          streak: "{count}-day streak. The grid is growing."
        }
      },
      split: {
        title: "Split Console",
        lede: "Enter a total or item list, add people, and get an immediate copyable split.",
        total: "Total",
        items: "Items",
        participants: "Participants",
        eachPerson: "Each person",
        emptySummary: "Enter values to create a summary.",
        copySummary: "Copy summary",
        copied: "Copied summary.",
        copyUnavailable: "Copy unavailable. Select the summary manually.",
        errors: {
          positiveItems: "Fix item amounts before calculating. Use positive numbers only.",
          positiveTotal: "Enter a positive total or at least one positive item.",
          participant: "Enter at least one participant."
        },
        summary: "Split {total} between {who}: {perPerson} each."
      }
    },
    projects: enProjects
  }
} as const;

export type Dictionary = (typeof dictionaries)[Locale];

export function getProjectText(project: Project, locale: Locale): LocalizedProjectText {
  return dictionaries[locale].projects[project.slug] ?? dictionaries.en.projects[project.slug];
}
