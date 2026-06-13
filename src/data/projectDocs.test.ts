import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { renderProjectDetail } from "../components/ProjectDetail";
import { projectDocs, requiredProjectDocKinds } from "./projectDocs";
import { projects } from "./projects";

const repoRoot = resolve(".");

const requiredDocs = [
  { kind: "codex-from-zero", fileName: "codex-from-zero.md", label: "Codex From Zero" },
  { kind: "source-guide", fileName: "source-guide.md", label: "Source Guide" },
  { kind: "complexity-map", fileName: "complexity-map.md", label: "Complexity Map" },
  { kind: "faq", fileName: "faq.md", label: "FAQ" },
  { kind: "remix-prompts", fileName: "remix-prompts.md", label: "Remix Prompts" }
] as const;

function repoPathFor(projectFolder: string, fileName: string): string {
  return `docs/projects/${projectFolder}/${fileName}`;
}

function readRepoFile(repoPath: string): string {
  return readFileSync(resolve(repoRoot, repoPath), "utf8");
}

function extractMarkdownSection(content: string, heading: string): string {
  const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const startMatch = new RegExp(`^## ${escapedHeading}\\s*$`, "im").exec(content);

  if (!startMatch) {
    return "";
  }

  const sectionStart = startMatch.index + startMatch[0].length;
  const rest = content.slice(sectionStart);
  const nextSectionMatch = /^##\s/im.exec(rest);

  return nextSectionMatch ? rest.slice(0, nextSectionMatch.index) : rest;
}

function countNumberedItems(content: string): number {
  return content.match(/^\d+\.\s+\S/gm)?.length ?? 0;
}

function countPromptItems(content: string): number {
  return content.match(/^Prompt\s+\d+:/gim)?.length ?? 0;
}

function expectHeading(content: string, heading: string): void {
  expect(content).toMatch(new RegExp(`^## ${heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$`, "im"));
}

describe("project documentation registry", () => {
  it("defines exactly five canonical doc links for every project", () => {
    expect(Object.keys(projectDocs).sort()).toEqual(projects.map((project) => project.slug).sort());
    expect(requiredProjectDocKinds).toEqual(requiredDocs.map((doc) => doc.kind));

    for (const project of projects) {
      const docs = projectDocs[project.slug];

      expect(docs).toHaveLength(5);
      expect(docs.map((doc) => doc.kind)).toEqual(requiredDocs.map((doc) => doc.kind));
      expect(new Set(docs.map((doc) => doc.kind)).size).toBe(5);

      for (const [index, doc] of docs.entries()) {
        expect(doc.label).toBe(requiredDocs[index].label);
        expect(doc.fileName).toBe(requiredDocs[index].fileName);
        expect(doc.projectSlug).toBe(project.slug);
      }
    }
  });

  it("maps every canonical doc link to the static published href and existing repo file", () => {
    for (const project of projects) {
      const docs = projectDocs[project.slug];

      for (const requiredDoc of requiredDocs) {
        const doc = docs.find((candidate) => candidate.kind === requiredDoc.kind);
        const expectedRepoPath = repoPathFor(project.docsFolder, requiredDoc.fileName);

        expect(doc).toBeDefined();
        expect(doc?.href).toBe(`/docs/projects/${project.docsFolder}/${requiredDoc.fileName}`);
        expect(doc?.repoPath).toBe(expectedRepoPath);
        expect(existsSync(resolve(repoRoot, expectedRepoPath))).toBe(true);
      }
    }
  });

  it("keeps each project metadata record complete for V1", () => {
    for (const [index, project] of projects.entries()) {
      const metadata = project as typeof project & { order?: number };

      expect(project.title).toBeTruthy();
      expect(project.slug).toBeTruthy();
      expect(metadata.order).toBe(index + 1);
      expect(metadata.order).toBeGreaterThanOrEqual(1);
      expect(metadata.order).toBeLessThanOrEqual(5);
      expect(project.role).toBeTruthy();
      expect(project.effect).toBeTruthy();
      expect(project.difficulty).toMatch(/^Level [1-3]$/);
      expect(project.estimatedTime).toBeTruthy();
      expect(project.skills.length).toBeGreaterThanOrEqual(3);
      expect(project.skills.length).toBeLessThanOrEqual(5);
      expect(project.visualMotif).toBeTruthy();
      expect(project.docsFolder).toBeTruthy();
      expect(project.links.demo).toBe(`#/projects/${project.slug}/demo`);
      expect(project.links.source).toBe(`#/projects/${project.slug}?section=source-guide`);
      expect(project.links.docs).toBe(`#/projects/${project.slug}?section=codex-doc`);
    }
  });

  it("renders detail page links from project metadata and the centralized doc registry", () => {
    for (const project of projects) {
      const html = renderProjectDetail(project);

      expect(html).toContain(`href="${project.links.demo}"`);
      expect(html).toContain(`href="${project.links.source}"`);
      expect(html).toContain(`href="${project.links.docs}"`);

      for (const doc of projectDocs[project.slug]) {
        expect(html).toContain(`href="${doc.href}"`);
      }
    }
  });
});

describe("project markdown requirements", () => {
  it("keeps every source guide beginner-readable and runnable", () => {
    for (const project of projects) {
      const sourceGuide = projectDocs[project.slug].find((doc) => doc.kind === "source-guide");
      const content = readRepoFile(sourceGuide?.repoPath ?? "");
      const beginnerSection = extractMarkdownSection(content, "Beginner Edit Points");

      expectHeading(content, "Read These Files First");
      expectHeading(content, "What Each Core File Does");
      expectHeading(content, "Beginner Edit Points");
      expect(countNumberedItems(beginnerSection)).toBeGreaterThanOrEqual(3);
      expectHeading(content, "Build Tool And Running");
      expect(content).toMatch(/\bVite\b/);
      expect(content).toMatch(/npm run dev/);
      expect(content).toMatch(/npm run build/);
    }
  });

  it("keeps every complexity map organized around the five required categories", () => {
    const requiredCategories = ["Page Structure", "Interaction", "State", "Data", "Visual Completion"];

    for (const project of projects) {
      const complexityMap = projectDocs[project.slug].find((doc) => doc.kind === "complexity-map");
      const content = readRepoFile(complexityMap?.repoPath ?? "");

      for (const category of requiredCategories) {
        expectHeading(content, category);
      }
    }
  });

  it("keeps every FAQ at five or more questions", () => {
    for (const project of projects) {
      const faq = projectDocs[project.slug].find((doc) => doc.kind === "faq");
      const content = readRepoFile(faq?.repoPath ?? "");

      expect(content.match(/^##\s+\d+\.\s+.+\?/gm)?.length ?? 0).toBeGreaterThanOrEqual(5);
    }
  });

  it("keeps every remix prompt document split into light, medium, and deep paths", () => {
    for (const project of projects) {
      const remixPrompts = projectDocs[project.slug].find((doc) => doc.kind === "remix-prompts");
      const content = readRepoFile(remixPrompts?.repoPath ?? "");

      expectHeading(content, "Light Remix");
      expectHeading(content, "Medium Remix");
      expectHeading(content, "Deep Remix");
    }
  });

  it("keeps every Codex-from-zero guide complete enough to reproduce", () => {
    const requiredBlocks = [
      "Project Goal",
      "Preparation",
      "From An Empty Folder",
      "Starting Prompt",
      "Improvement Prompts",
      "Troubleshooting Prompts",
      "Remix Prompts",
      "Running The Project",
      "Validation Checklist"
    ];

    for (const project of projects) {
      const codexDoc = projectDocs[project.slug].find((doc) => doc.kind === "codex-from-zero");
      const content = readRepoFile(codexDoc?.repoPath ?? "");

      for (const block of requiredBlocks) {
        expectHeading(content, block);
      }

      expect(content).toMatch(/Expected output:/i);
      expect(content).toMatch(/`index\.html`/);
      expect(countPromptItems(extractMarkdownSection(content, "Improvement Prompts"))).toBeGreaterThanOrEqual(3);
      expect(countPromptItems(extractMarkdownSection(content, "Troubleshooting Prompts"))).toBeGreaterThanOrEqual(3);
      expect(countPromptItems(extractMarkdownSection(content, "Remix Prompts"))).toBeGreaterThanOrEqual(3);
    }
  });
});
