import { describe, expect, it } from "vitest";
import { projects } from "./projects";

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
});
