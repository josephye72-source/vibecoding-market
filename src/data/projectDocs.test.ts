import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { renderProjectDetail } from "../components/ProjectDetail";
import { getLocalizedProjectDocs, projectDocs, requiredProjectDocKinds } from "./projectDocs";
import { projects } from "./projects";
import { sourceEntriesByProject } from "./sourceEntries";

function filePathFromImportMetaUrl(importMetaUrl: string): string {
  const url = new URL(importMetaUrl);

  if (url.protocol === "file:") {
    return fileURLToPath(url);
  }

  if (url.pathname.startsWith("/@fs/")) {
    return decodeURIComponent(url.pathname.slice("/@fs/".length));
  }

  throw new Error(`Unsupported import.meta.url for filesystem tests: ${importMetaUrl}`);
}

const repoRoot = resolve(dirname(filePathFromImportMetaUrl(import.meta.url)), "../..");

const requiredDocs = [
  {
    kind: "codex-from-zero",
    fileName: "codex-from-zero.md",
    labels: { zh: "Codex 从 0 到 1", en: "Codex From Zero" }
  },
  { kind: "source-guide", fileName: "source-guide.md", labels: { zh: "源码导览", en: "Source Guide" } },
  { kind: "complexity-map", fileName: "complexity-map.md", labels: { zh: "复杂度拆解", en: "Complexity Map" } },
  { kind: "faq", fileName: "faq.md", labels: { zh: "常见问题", en: "FAQ" } },
  { kind: "remix-prompts", fileName: "remix-prompts.md", labels: { zh: "二创任务", en: "Remix Prompts" } }
] as const;

function repoPathFor(projectFolder: string, fileName: string): string {
  return `docs/projects/${projectFolder}/${fileName}`;
}

function readRepoFile(repoPath: string): string {
  return readFileSync(resolve(repoRoot, repoPath), "utf8");
}

function readJsonFile<T>(repoPath: string): T {
  return JSON.parse(readRepoFile(repoPath)) as T;
}

type TsconfigShape = {
  extends?: string;
  compilerOptions?: {
    lib?: string[];
    types?: string[];
  };
  include?: string[];
  exclude?: string[];
};

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
  return content.match(/^Prompt\s+\d+[:：]/gim)?.length ?? 0;
}

function expectHeading(content: string, heading: string): void {
  expect(content).toMatch(new RegExp(`^## ${heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$`, "im"));
}

function expectNoHeading(content: string, heading: string): void {
  expect(content).not.toMatch(new RegExp(`^## ${heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$`, "im"));
}

describe("project documentation registry", () => {
  it("keeps browser app and test TypeScript programs separated", () => {
    const appConfig = readJsonFile<TsconfigShape>("tsconfig.json");
    const testConfigPath = resolve(repoRoot, "tsconfig.test.json");

    expect(appConfig.compilerOptions?.lib ?? []).toEqual(
      expect.arrayContaining(["DOM", "DOM.Iterable"])
    );
    expect(appConfig.compilerOptions?.types ?? []).not.toContain("node");
    expect(appConfig.compilerOptions?.types ?? []).not.toContain("vitest/globals");
    expect(appConfig.include ?? []).toEqual(["src/**/*.ts"]);
    expect(appConfig.exclude ?? []).toEqual(
      expect.arrayContaining(["src/**/*.test.ts", "src/test/**", "tests/**", "playwright.config.ts"])
    );

    expect(existsSync(testConfigPath)).toBe(true);

    const testConfig = readJsonFile<TsconfigShape>("tsconfig.test.json");

    expect(testConfig.extends).toBe("./tsconfig.json");
    expect(testConfig.compilerOptions?.types ?? []).toEqual(
      expect.arrayContaining(["vitest/globals", "node"])
    );
    expect(testConfig.include ?? []).toEqual(
      expect.arrayContaining([
        "src/**/*.test.ts",
        "src/test/**/*.ts",
        "tests/**/*.ts",
        "playwright.config.ts"
      ])
    );
  });

  it("defines exactly five canonical doc links for every project", () => {
    expect(Object.keys(projectDocs).sort()).toEqual(projects.map((project) => project.slug).sort());
    expect(requiredProjectDocKinds).toEqual(requiredDocs.map((doc) => doc.kind));

    for (const project of projects) {
      const docs = projectDocs[project.slug];

      expect(docs).toHaveLength(5);
      expect(docs.map((doc) => doc.kind)).toEqual(requiredDocs.map((doc) => doc.kind));
      expect(new Set(docs.map((doc) => doc.kind)).size).toBe(5);

      for (const [index, doc] of docs.entries()) {
        expect(doc.fileName).toBe(requiredDocs[index].fileName);
        expect(doc.projectSlug).toBe(project.slug);
      }

      for (const locale of ["zh", "en"] as const) {
        const localizedDocs = getLocalizedProjectDocs(project.slug, locale);

        expect(localizedDocs.map((doc) => doc.label)).toEqual(
          requiredDocs.map((doc) => doc.labels[locale])
        );
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
      expect(project.links.source).toBe(sourceEntriesByProject[project.slug]?.indexHref);
      expect(project.links.source).not.toContain("?section=source-guide");
      expect(project.links.source).not.toMatch(/^#\//);
      expect(project.links.docs).toBe(`#/projects/${project.slug}?section=codex-doc`);
    }
  });

  it("renders detail page links from project metadata and the centralized doc registry", () => {
    for (const project of projects) {
      const html = renderProjectDetail(project, "zh");

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
      const beginnerSection = extractMarkdownSection(content, "新手可改位置");

      expectHeading(content, "先看这些文件");
      expectHeading(content, "核心文件做什么");
      expectHeading(content, "新手可改位置");
      expect(countNumberedItems(beginnerSection)).toBeGreaterThanOrEqual(3);
      expectHeading(content, "构建工具与运行");
      expectNoHeading(content, "Read These Files First");
      expectNoHeading(content, "What Each Core File Does");
      expectNoHeading(content, "Beginner Edit Points");
      expectNoHeading(content, "Build Tool And Running");
      expect(content).toMatch(/\bVite\b/);
      expect(content).toMatch(/npm run dev/);
      expect(content).toMatch(/npm run build/);
    }
  });

  it("keeps every complexity map organized around the five required categories", () => {
    const requiredCategories = ["页面结构", "交互", "状态", "数据", "视觉完成度"];

    for (const project of projects) {
      const complexityMap = projectDocs[project.slug].find((doc) => doc.kind === "complexity-map");
      const content = readRepoFile(complexityMap?.repoPath ?? "");

      for (const category of requiredCategories) {
        expectHeading(content, category);
      }

      for (const oldCategory of ["Page Structure", "Interaction", "State", "Data", "Visual Completion"]) {
        expectNoHeading(content, oldCategory);
      }
    }
  });

  it("keeps every FAQ at five or more questions", () => {
    for (const project of projects) {
      const faq = projectDocs[project.slug].find((doc) => doc.kind === "faq");
      const content = readRepoFile(faq?.repoPath ?? "");

      expect(content.match(/^##\s+\d+\.\s+.+[？?]/gm)?.length ?? 0).toBeGreaterThanOrEqual(5);
    }
  });

  it("keeps every remix prompt document split into light, medium, and deep paths", () => {
    for (const project of projects) {
      const remixPrompts = projectDocs[project.slug].find((doc) => doc.kind === "remix-prompts");
      const content = readRepoFile(remixPrompts?.repoPath ?? "");

      expectHeading(content, "轻改");
      expectHeading(content, "中改");
      expectHeading(content, "深改");
      expectNoHeading(content, "Light Remix");
      expectNoHeading(content, "Medium Remix");
      expectNoHeading(content, "Deep Remix");
    }
  });

  it("keeps every Codex-from-zero guide complete enough to reproduce", () => {
    const requiredBlocks = [
      "项目目标",
      "准备",
      "从空文件夹开始",
      "起步 Prompt",
      "改进 Prompt",
      "排错 Prompt",
      "二创 Prompt",
      "运行项目",
      "验收清单"
    ];

    for (const project of projects) {
      const codexDoc = projectDocs[project.slug].find((doc) => doc.kind === "codex-from-zero");
      const content = readRepoFile(codexDoc?.repoPath ?? "");

      for (const block of requiredBlocks) {
        expectHeading(content, block);
      }

      for (const oldBlock of [
        "Project Goal",
        "Preparation",
        "From An Empty Folder",
        "Starting Prompt",
        "Improvement Prompts",
        "Troubleshooting Prompts",
        "Remix Prompts",
        "Running The Project",
        "Validation Checklist"
      ]) {
        expectNoHeading(content, oldBlock);
      }

      expect(content).toMatch(/Expected output:|预期输出：?/i);
      expect(content).toMatch(/`index\.html`/);
      expect(content).toMatch(/npm run dev/);
      expect(content).toMatch(/npm run build/);
      expect(countPromptItems(extractMarkdownSection(content, "改进 Prompt"))).toBeGreaterThanOrEqual(3);
      expect(countPromptItems(extractMarkdownSection(content, "排错 Prompt"))).toBeGreaterThanOrEqual(3);
      expect(countPromptItems(extractMarkdownSection(content, "二创 Prompt"))).toBeGreaterThanOrEqual(3);
    }
  });
});
