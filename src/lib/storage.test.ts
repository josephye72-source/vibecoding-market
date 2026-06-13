import { beforeEach, describe, expect, it } from "vitest";
import { readStorage, writeStorage } from "./storage";

describe("localStorage helpers", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns fallback data when the key is missing", () => {
    expect(readStorage("missing-key", { count: 0 })).toEqual({ count: 0 });
  });

  it("returns fallback data when stored JSON is corrupt", () => {
    localStorage.setItem("bad-json", "{not valid json");

    expect(readStorage("bad-json", ["fallback"])).toEqual(["fallback"]);
  });

  it("round-trips valid JSON values", () => {
    writeStorage("saved-value", { theme: "solar", completed: 2 });

    expect(readStorage("saved-value", { theme: "none", completed: 0 })).toEqual({
      theme: "solar",
      completed: 2
    });
  });
});
