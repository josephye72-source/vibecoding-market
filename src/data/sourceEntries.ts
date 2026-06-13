export type SourceEntryFile = {
  label: string;
  repoPath: string;
};

export type SourceEntry = {
  projectSlug: string;
  indexHref: string;
  files: SourceEntryFile[];
};

export const sourceEntriesByProject: Record<string, SourceEntry> = {
  "focus-pomodoro": {
    projectSlug: "focus-pomodoro",
    indexHref: "/source/focus-pomodoro/index.txt",
    files: [
      { label: "Pomodoro logic", repoPath: "src/demos/pomodoro/logic.ts" },
      { label: "Pomodoro renderer", repoPath: "src/demos/pomodoro/render.ts" },
      { label: "Pomodoro tests", repoPath: "src/demos/pomodoro/logic.test.ts" }
    ]
  },
  "memory-cards": {
    projectSlug: "memory-cards",
    indexHref: "/source/memory-cards/index.txt",
    files: [
      { label: "Memory logic", repoPath: "src/demos/memory/logic.ts" },
      { label: "Memory renderer", repoPath: "src/demos/memory/render.ts" },
      { label: "Memory tests", repoPath: "src/demos/memory/logic.test.ts" }
    ]
  },
  "tiny-ledger": {
    projectSlug: "tiny-ledger",
    indexHref: "/source/tiny-ledger/index.txt",
    files: [
      { label: "Ledger logic", repoPath: "src/demos/ledger/logic.ts" },
      { label: "Ledger renderer", repoPath: "src/demos/ledger/render.ts" },
      { label: "Ledger tests", repoPath: "src/demos/ledger/logic.test.ts" }
    ]
  },
  "habit-grid": {
    projectSlug: "habit-grid",
    indexHref: "/source/habit-grid/index.txt",
    files: [
      { label: "Habit logic", repoPath: "src/demos/habits/logic.ts" },
      { label: "Habit renderer", repoPath: "src/demos/habits/render.ts" },
      { label: "Habit tests", repoPath: "src/demos/habits/logic.test.ts" }
    ]
  },
  "split-console": {
    projectSlug: "split-console",
    indexHref: "/source/split-console/index.txt",
    files: [
      { label: "Split logic", repoPath: "src/demos/split/logic.ts" },
      { label: "Split renderer", repoPath: "src/demos/split/render.ts" },
      { label: "Split tests", repoPath: "src/demos/split/logic.test.ts" }
    ]
  }
};
