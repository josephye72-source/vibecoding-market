import { describe, expect, it } from "vitest";
import { projects } from "./projects";
import { sourceEntriesByProject } from "./sourceEntries";

describe("V1 project metadata", () => {
  it("contains exactly five projects", () => {
    expect(projects).toHaveLength(5);
  });

  it("includes at least one game project", () => {
    expect(projects.some((project) => project.kind === "game")).toBe(true);
  });

  it("includes the required beginner-facing fields for every project", () => {
    for (const project of projects) {
      expect(project.slug).toBeTruthy();
      expect(project.title).toBeTruthy();
      expect(project.difficulty).toBeTruthy();
      expect(project.estimatedTime).toBeTruthy();
      expect(project.skills.length).toBeGreaterThan(0);
      expect(project.visualMotif).toBeTruthy();
    }
  });

  it("defines explicit demo, source, and docs links for every project", () => {
    for (const project of projects) {
      const links = (project as { links?: { demo?: string; source?: string; docs?: string } }).links;

      expect(links?.demo).toBe(`#/projects/${project.slug}/demo`);
      expect(links?.source).toBe(sourceEntriesByProject[project.slug]?.indexHref);
      expect(links?.source).not.toContain("?section=source-guide");
      expect(links?.source).not.toMatch(/^#\//);
      expect(links?.docs).toBeTruthy();
    }
  });
});
