import { describe, expect, it } from "vitest";
import { projects } from "./projects";
import { sourceEntriesByProject } from "./sourceEntries";

describe("source entries", () => {
  it("provides a real source entry for every project", () => {
    for (const project of projects) {
      expect(project.links.source).toBe(sourceEntriesByProject[project.slug]?.indexHref);
      expect(project.links.source).not.toContain("?section=source-guide");
      expect(project.links.source).not.toMatch(/^#\//);
      expect(sourceEntriesByProject[project.slug]?.files.length).toBeGreaterThanOrEqual(2);
    }
  });
});
