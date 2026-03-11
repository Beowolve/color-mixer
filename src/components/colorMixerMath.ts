import colorString from "color-string";

export const DEFAULT_BACKGROUND_COLOR_TEXT = "#FFFFFF";
export const DEFAULT_FOREGROUND_COLOR_TEXT = "#000000";

export const CHANNEL_STEP = 17;
export const MAX_RESULTS = 25;

export type Rgb = readonly [number, number, number];
export type Rgba = readonly [number, number, number, number];
export type ColorDiff = readonly [number, number, number];

export const MIX_MODES = {
  SINGLE: "single",
  DOUBLE: "double"
} as const;

export type MixMode = (typeof MIX_MODES)[keyof typeof MIX_MODES];

export interface ColorMatch {
  rgbaColor: string;
  mixColor: string;
  diff: ColorDiff;
  absDiff: number;
}

export const DEFAULT_BACKGROUND_COLOR: Rgba = [255, 255, 255, 1];
export const DEFAULT_FOREGROUND_COLOR: Rgba = [0, 0, 0, 1];

function clampByte(value: number): number {
  return Math.min(255, Math.max(0, Math.round(value)));
}

function clampAlpha(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function nibbleHex(value: number): string {
  return Math.round(clampByte(value) / CHANNEL_STEP)
    .toString(16)
    .padStart(1, "0");
}

export function toShortRGB(color: Rgb): string {
  return `#${nibbleHex(color[0])}${nibbleHex(color[1])}${nibbleHex(color[2])}`;
}

export function toShortRGBA(color: readonly [number, number, number, number]): string {
  return `#${nibbleHex(color[0])}${nibbleHex(color[1])}${nibbleHex(color[2])}${nibbleHex(color[3])}`;
}

export function mixColors(bgColor: Rgb, fgColor: Rgb, alpha: number): Rgb {
  const normalizedAlpha = clampAlpha(alpha);
  const r = Math.floor(bgColor[0] * (1 - normalizedAlpha) + fgColor[0] * normalizedAlpha);
  const g = Math.floor(bgColor[1] * (1 - normalizedAlpha) + fgColor[1] * normalizedAlpha);
  const b = Math.floor(bgColor[2] * (1 - normalizedAlpha) + fgColor[2] * normalizedAlpha);
  return [r, g, b];
}

export function normalizeParsedColor(parsed: readonly number[] | null | undefined, fallback: Rgba): Rgba {
  if (!parsed || parsed.length < 3) {
    return fallback;
  }

  const alpha = typeof parsed[3] === "number" ? clampAlpha(parsed[3]) : 1;

  return [clampByte(parsed[0]), clampByte(parsed[1]), clampByte(parsed[2]), alpha];
}

export function toCssColor(color: Rgba): string {
  const [r, g, b, a] = color;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function toRgb(color: Rgba): Rgb {
  return [color[0], color[1], color[2]];
}

export function findColors(bgColor: Rgba, fgColor: Rgba, limit = 10, mixMode: MixMode = MIX_MODES.SINGLE): ColorMatch[] {
  const results: ColorMatch[] = [];
  const bgRgb = toRgb(bgColor);
  const fgRgb = toRgb(fgColor);

  for (let r = 0; r < 256; r += CHANNEL_STEP) {
    for (let g = 0; g < 256; g += CHANNEL_STEP) {
      for (let b = 0; b < 256; b += CHANNEL_STEP) {
        for (let a = 0; a < 256; a += CHANNEL_STEP) {
          const rgb: Rgb = [r, g, b];
          const alpha = a / 255;

          let mix = mixColors(bgRgb, rgb, alpha);
          if (mixMode === MIX_MODES.DOUBLE) {
            mix = mixColors(mix, rgb, alpha);
          }

          const rdiff = fgRgb[0] - mix[0];
          const gdiff = fgRgb[1] - mix[1];
          const bdiff = fgRgb[2] - mix[2];
          const absDiff = Math.abs(rdiff) + Math.abs(gdiff) + Math.abs(bdiff);

          if (absDiff < limit) {
            const rgbaColor = a < 255 ? toShortRGBA([r, g, b, a]) : toShortRGB(rgb);
            results.push({
              rgbaColor,
              mixColor: colorString.to.hex([...mix]),
              diff: [rdiff, gdiff, bdiff],
              absDiff
            });
          }
        }
      }
    }
  }

  return results.sort((a, b) => a.absDiff - b.absDiff).slice(0, MAX_RESULTS);
}
