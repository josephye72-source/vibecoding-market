export type Locale = "zh" | "en";

export type LocalizedProjectText = {
  title: string;
  role: string;
  summary: string;
  effect: string;
  audience: string;
  difficulty: string;
  estimatedTime: string;
  skills: string[];
  visualMotif: string;
  learningGoals: string[];
  complexitySources: string[];
  sourceGuide: string[];
  promptSet: {
    start: string;
    improve: string;
    debug: string;
  };
  faq: string[];
  remixTasks: Array<{
    level: string;
    title: string;
    description: string;
  }>;
};
