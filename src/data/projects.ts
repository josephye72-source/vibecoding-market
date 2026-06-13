export type ProjectKind = "app" | "game" | "tool";

export type Project = {
  slug: string;
  title: string;
  kind: ProjectKind;
  summary: string;
  difficulty: "Level 1" | "Level 2" | "Level 3";
  estimatedTime: string;
  skills: string[];
  visualMotif: string;
};

export const projects: Project[] = [
  {
    slug: "focus-pomodoro",
    title: "Focus Pomodoro",
    kind: "app",
    summary: "A small focus timer with progress and local session records.",
    difficulty: "Level 1",
    estimatedTime: "45 minutes",
    skills: ["timer", "state", "buttons", "progress", "localStorage"],
    visualMotif: "Solar Dial"
  },
  {
    slug: "memory-cards",
    title: "Memory Cards",
    kind: "game",
    summary: "A flip-card matching game with moves, shuffle, and win feedback.",
    difficulty: "Level 2",
    estimatedTime: "60 minutes",
    skills: ["arrays", "shuffle", "click state", "matching", "score"],
    visualMotif: "Neon Arcade Lab"
  },
  {
    slug: "tiny-ledger",
    title: "Tiny Ledger",
    kind: "tool",
    summary: "A local expense list with categories and simple totals.",
    difficulty: "Level 2",
    estimatedTime: "70 minutes",
    skills: ["forms", "lists", "categories", "totals", "localStorage"],
    visualMotif: "Receipt Ledger"
  },
  {
    slug: "habit-grid",
    title: "Habit Grid",
    kind: "app",
    summary: "A habit calendar that turns daily check-ins into visible momentum.",
    difficulty: "Level 2",
    estimatedTime: "75 minutes",
    skills: ["dates", "calendar grid", "toggle state", "streaks", "feedback"],
    visualMotif: "Growth Grid"
  },
  {
    slug: "split-console",
    title: "Split Console",
    kind: "tool",
    summary: "A quick bill splitter with instant results and a shareable summary.",
    difficulty: "Level 1",
    estimatedTime: "50 minutes",
    skills: ["inputs", "calculation", "validation", "summary", "copy"],
    visualMotif: "Split Console"
  }
];
