import { describe, expect, it } from "vitest";
import { DESTINATIONS, bestSpots, searchDestinations } from "@/lib/data";

describe("parking rules", () => {
  const d = DESTINATIONS[0]!;
  it("search is case-insensitive partial", () => {
    expect(searchDestinations("casc").map((x) => x.name)).toEqual(["Cascade"]);
  });
  it("shows at most 3 spots sorted by chance", () => {
    const s = bestSpots(d, "All", false);
    expect(s.length).toBe(3);
    expect(s[0]!.chance).toBeGreaterThanOrEqual(s[1]!.chance);
  });
  it("prefer free filters to free spots", () => {
    expect(bestSpots(d, "All", true).every((s) => s.price === "Free")).toBe(true);
  });
});
