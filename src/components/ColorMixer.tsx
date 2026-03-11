import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, CSSProperties, FocusEvent } from "react";
import colorString from "color-string";

import {
  DEFAULT_BACKGROUND_COLOR,
  DEFAULT_BACKGROUND_COLOR_TEXT,
  DEFAULT_FOREGROUND_COLOR,
  DEFAULT_FOREGROUND_COLOR_TEXT,
  MIX_MODES,
  findColors,
  normalizeParsedColor,
  toCssColor,
  type MixMode,
  type Rgba
} from "./colorMixerMath";

const MIX_MODE_KEY = "color-mixer.mix-mode";
const SINGLE_MODE_TOOLTIP = "Single mode applies one overlay blend pass.";
const DOUBLE_MODE_TOOLTIP = "Double mode applies the same overlay blend pass twice for stacked overlay simulation.";

type CopyFeedbackType = "success" | "error";

interface CopyFeedbackState {
  message: string;
  type: CopyFeedbackType;
}

function readInitialMixMode(): MixMode {
  if (typeof window === "undefined") {
    return MIX_MODES.SINGLE;
  }

  const savedMixMode = window.localStorage.getItem(MIX_MODE_KEY);
  if (savedMixMode === MIX_MODES.SINGLE || savedMixMode === MIX_MODES.DOUBLE) {
    return savedMixMode;
  }

  return MIX_MODES.SINGLE;
}

export default function ColorMixer() {
  const [backgroundColor, setBackgroundColor] = useState(DEFAULT_BACKGROUND_COLOR_TEXT);
  const [foregroundColor, setForegroundColor] = useState(DEFAULT_FOREGROUND_COLOR_TEXT);
  const [rgbBackgroundColor, setRgbBackgroundColor] = useState<Rgba>(DEFAULT_BACKGROUND_COLOR);
  const [rgbForegroundColor, setRgbForegroundColor] = useState<Rgba>(DEFAULT_FOREGROUND_COLOR);
  const [mixMode, setMixMode] = useState<MixMode>(readInitialMixMode);
  const [copyFeedback, setCopyFeedback] = useState<CopyFeedbackState | null>(null);

  const copyFeedbackTimeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(MIX_MODE_KEY, mixMode);
    }
  }, [mixMode]);

  useEffect(() => {
    return () => {
      if (copyFeedbackTimeoutRef.current !== undefined) {
        window.clearTimeout(copyFeedbackTimeoutRef.current);
      }
    };
  }, []);

  const colors = useMemo(
    () => findColors(rgbBackgroundColor, rgbForegroundColor, 10, mixMode),
    [rgbBackgroundColor, rgbForegroundColor, mixMode]
  );

  const handleBackgroundColorChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextColor = event.target.value;
    const parsedColor = colorString.get.rgb(nextColor.trim());
    setBackgroundColor(nextColor);
    setRgbBackgroundColor(normalizeParsedColor(parsedColor, DEFAULT_BACKGROUND_COLOR));
  };

  const handleForegroundColorChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextColor = event.target.value;
    const parsedColor = colorString.get.rgb(nextColor.trim());
    setForegroundColor(nextColor);
    setRgbForegroundColor(normalizeParsedColor(parsedColor, DEFAULT_FOREGROUND_COLOR));
  };

  const clearBackgroundColor = () => {
    setBackgroundColor("");
    setRgbBackgroundColor(DEFAULT_BACKGROUND_COLOR);
  };

  const clearForegroundColor = () => {
    setForegroundColor("");
    setRgbForegroundColor(DEFAULT_FOREGROUND_COLOR);
  };

  const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    event.target.select();
  };

  const handleMixModeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMixMode(event.target.checked ? MIX_MODES.DOUBLE : MIX_MODES.SINGLE);
  };

  const copyColor = async (colorCode: string) => {
    const value = colorCode.toUpperCase();

    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard API unavailable.");
      }

      await navigator.clipboard.writeText(value);
      setCopyFeedback({ message: `Copied ${value} to clipboard.`, type: "success" });
    } catch {
      setCopyFeedback({ message: "Copy failed. Please copy manually.", type: "error" });
    }

    if (copyFeedbackTimeoutRef.current !== undefined) {
      window.clearTimeout(copyFeedbackTimeoutRef.current);
    }

    copyFeedbackTimeoutRef.current = window.setTimeout(() => {
      setCopyFeedback(null);
    }, 2000);
  };

  const backgroundPreviewColor = toCssColor(rgbBackgroundColor);
  const targetPreviewColor = toCssColor(rgbForegroundColor);
  const isDoubleMixEnabled = mixMode === MIX_MODES.DOUBLE;

  return (
    <div>
      <div className="colorInputContainer">
        <div className="colorInput">
          <label htmlFor="bgColor">Background</label>
          <div
            className="inputColorSwatch"
            aria-label="Background color preview"
            style={{ "--preview-color": backgroundPreviewColor } as CSSProperties}
          ></div>
          <input
            id="bgColor"
            name="bgColor"
            className="backgroundColor colorInputField"
            type="text"
            placeholder={DEFAULT_BACKGROUND_COLOR_TEXT}
            value={backgroundColor}
            onFocus={handleFocus}
            onChange={handleBackgroundColorChange}
          />
          {backgroundColor && (
            <button
              type="button"
              aria-label="Clear background color"
              onClick={clearBackgroundColor}
              className="clearInputBtn"
            >
              x
            </button>
          )}
        </div>
        <div className="colorInput">
          <label htmlFor="targetColor">Target</label>
          <div
            className="inputColorSwatch"
            aria-label="Target color preview"
            style={{ "--preview-color": targetPreviewColor } as CSSProperties}
          ></div>
          <input
            id="targetColor"
            name="targetColor"
            className="foregroundColor colorInputField"
            type="text"
            placeholder={DEFAULT_FOREGROUND_COLOR_TEXT}
            value={foregroundColor}
            onFocus={handleFocus}
            onChange={handleForegroundColorChange}
          />
          {foregroundColor && (
            <button
              type="button"
              aria-label="Clear target color"
              onClick={clearForegroundColor}
              className="clearInputBtn"
            >
              x
            </button>
          )}
        </div>
        <div className="mixModeControl">
          <div className="mixModeText">
            <span className="mixModeHint" title={SINGLE_MODE_TOOLTIP} aria-label={SINGLE_MODE_TOOLTIP}>
              single
            </span>
            <span className="mixModeSeparator"> / </span>
            <span className="mixModeHint" title={DOUBLE_MODE_TOOLTIP} aria-label={DOUBLE_MODE_TOOLTIP}>
              double
            </span>
          </div>
          <label
            className="mixModeSwitch"
            htmlFor="mixModeSwitch"
            title="Switch between single and double overlay blending."
          >
            <input
              id="mixModeSwitch"
              type="checkbox"
              checked={isDoubleMixEnabled}
              onChange={handleMixModeChange}
              aria-label="Toggle between single and double overlay blending"
            />
            <span className="mixModeSlider"></span>
          </label>
        </div>
      </div>

      {copyFeedback && (
        <div className={`copyToast copyToast--${copyFeedback.type}`} role="status" aria-live="polite">
          {copyFeedback.message}
        </div>
      )}

      <div className="colors-list">
        <div className="color-row header-row">
          <div className="tHeader">Code</div>
          <div className="tHeader">Red</div>
          <div className="tHeader">Green</div>
          <div className="tHeader">Blue</div>
          <div className="tHeader">Diff</div>
        </div>
        {colors.map((value, index) => {
          return (
            <div className="color-row" key={`col_${value.rgbaColor}_${index}`}>
              <div className="colorItem">
                <button
                  style={{ "--color": value.mixColor } as CSSProperties}
                  onClick={() => copyColor(value.rgbaColor)}
                  className="colors-list__color"
                  type="button"
                  value={value.rgbaColor}
                >
                  {value.rgbaColor}
                </button>
              </div>
              <div className="rDiff">{value.diff[0]}</div>
              <div className="gDiff">{value.diff[1]}</div>
              <div className="bDiff">{value.diff[2]}</div>
              <div className="absDiff">{value.absDiff}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
