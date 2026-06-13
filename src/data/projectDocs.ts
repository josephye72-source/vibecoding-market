import { projects } from "./projects";
import { dictionaries } from "../i18n/dictionaries";
import type { Locale } from "../i18n/types";

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
  fileName: string;
  href: string;
  repoPath: string;
};

const requiredDocDefinitions: ReadonlyArray<Pick<ProjectDocLink, "kind" | "fileName">> = [
  { kind: "codex-from-zero", fileName: "codex-from-zero.md" },
  { kind: "source-guide", fileName: "source-guide.md" },
  { kind: "complexity-map", fileName: "complexity-map.md" },
  { kind: "faq", fileName: "faq.md" },
  { kind: "remix-prompts", fileName: "remix-prompts.md" }
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

export function getLocalizedProjectDocs(projectSlug: string, locale: Locale): Array<ProjectDocLink & { label: string }> {
  return getProjectDocs(projectSlug).map((doc) => ({
    ...doc,
    label: dictionaries[locale].docs[doc.kind]
  }));
}
