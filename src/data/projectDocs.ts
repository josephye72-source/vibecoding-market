import { projects } from "./projects";

export const requiredProjectDocKinds = [
  "codex-from-zero",
  "source-guide",
  "complexity-map",
  "faq",
  "remix-prompts"
] as const;

export type ProjectDocKind = (typeof requiredProjectDocKinds)[number];

export type ProjectDocLink = {
  projectSlug: string;
  kind: ProjectDocKind;
  label: string;
  fileName: string;
  href: string;
  repoPath: string;
};

const requiredDocDefinitions: ReadonlyArray<Pick<ProjectDocLink, "kind" | "label" | "fileName">> = [
  { kind: "codex-from-zero", label: "Codex From Zero", fileName: "codex-from-zero.md" },
  { kind: "source-guide", label: "Source Guide", fileName: "source-guide.md" },
  { kind: "complexity-map", label: "Complexity Map", fileName: "complexity-map.md" },
  { kind: "faq", label: "FAQ", fileName: "faq.md" },
  { kind: "remix-prompts", label: "Remix Prompts", fileName: "remix-prompts.md" }
];

export const projectDocs: Record<string, ProjectDocLink[]> = Object.fromEntries(
  projects.map((project) => [
    project.slug,
    requiredDocDefinitions.map((doc) => ({
      ...doc,
      projectSlug: project.slug,
      href: `/docs/projects/${project.docsFolder}/${doc.fileName}`,
      repoPath: `docs/projects/${project.docsFolder}/${doc.fileName}`
    }))
  ])
);

export function getProjectDocs(projectSlug: string): ProjectDocLink[] {
  return projectDocs[projectSlug] ?? [];
}
