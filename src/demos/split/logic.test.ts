import { describe, expect, it } from "vitest";
import { calculateSplit, copyableSplitSummary, parseItemAmounts } from "./logic";

describe("Split Console logic", () => {
  it("splits a total across participants immediately", () => {
    const result = calculateSplit({ total: 120, people: 3 });

    expect(result).toMatchObject({
      isValid: true,
      total: 120,
      people: 3,
      perPerson: 40
    });
  });

  it("splits multiple item amounts across named participants", () => {
    const result = calculateSplit({
      itemAmounts: [12.5, 7.5, 30],
      participants: ["Ava", "Bo"]
    });

    expect(result).toMatchObject({
      isValid: true,
      total: 50,
      people: 2,
      perPerson: 25
    });
  });

  it("parses multiple item input from commas, spaces, or new lines", () => {
    expect(parseItemAmounts("12, 8\n5  5.5")).toEqual({
      amounts: [12, 8, 5, 5.5],
      error: null,
      hasInput: true
    });
  });

  it("rejects invalid or non-positive item tokens instead of silently filtering them", () => {
    const parsed = parseItemAmounts("12, abc, -8, 8");

    expect(parsed).toEqual({
      amounts: [],
      error: "Fix item amounts before calculating. Use positive numbers only.",
      hasInput: true
    });

    const result = calculateSplit({
      itemAmounts: parsed,
      participants: ["Ava", "Bo"]
    });

    expect(result.isValid).toBe(false);
    expect(result.error).toBe("Fix item amounts before calculating. Use positive numbers only.");
    expect(result.perPerson).toBeNull();
  });

  it("blocks invalid input with a message and no wrong result", () => {
    const badAmount = calculateSplit({ total: -20, people: 2 });
    const badPeople = calculateSplit({ total: 20, people: 0 });

    expect(badAmount.isValid).toBe(false);
    expect(badAmount.error).toBe("Enter a positive total or at least one positive item.");
    expect(badAmount.perPerson).toBeNull();
    expect(badPeople.isValid).toBe(false);
    expect(badPeople.error).toBe("Enter at least one participant.");
    expect(badPeople.perPerson).toBeNull();
  });

  it("creates a copyable result summary", () => {
    const result = calculateSplit({
      total: 99,
      participants: ["Ava", "Bo", "Cy"]
    });

    expect(copyableSplitSummary(result)).toBe("Split $99.00 between Ava, Bo, Cy: $33.00 each.");
  });
});
