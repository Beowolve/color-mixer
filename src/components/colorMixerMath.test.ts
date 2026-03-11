import { describe, expect, it } from "vitest";

import {
  DEFAULT_BACKGROUND_COLOR,
  DEFAULT_FOREGROUND_COLOR,
  MIX_MODES,
  findColors,
  mixColors,
  toShortRGB,
  toShortRGBA
} from "./colorMixerMath";

describe("colorMixerMath", () => {
  it("mixes two colors with alpha", () => {
    expect(mixColors([255, 255, 255], [0, 0, 0], 0.5)).toEqual([127, 127, 127]);
  });

  it("converts colors into short hex notation", () => {
    expect(toShortRGB([255, 0, 17])).toBe("#f01");
    expect(toShortRGBA([255, 0, 17, 170])).toBe("#f01a");
  });

  it("finds sorted top matches for single and double mix modes", () => {
    const singleResults = findColors(DEFAULT_BACKGROUND_COLOR, DEFAULT_FOREGROUND_COLOR, 10, MIX_MODES.SINGLE);
    const doubleResults = findColors(DEFAULT_BACKGROUND_COLOR, DEFAULT_FOREGROUND_COLOR, 10, MIX_MODES.DOUBLE);

    expect(singleResults.length).toBeGreaterThan(0);
    expect(singleResults.length).toBeLessThanOrEqual(25);
    expect(doubleResults.length).toBeGreaterThan(0);
    expect(doubleResults.length).toBeLessThanOrEqual(25);

    const singleIsSorted = singleResults.every((entry, index, array) => {
      return index === 0 || array[index - 1].absDiff <= entry.absDiff;
    });
    const doubleIsSorted = doubleResults.every((entry, index, array) => {
      return index === 0 || array[index - 1].absDiff <= entry.absDiff;
    });

    expect(singleIsSorted).toBe(true);
    expect(doubleIsSorted).toBe(true);
  });
});
