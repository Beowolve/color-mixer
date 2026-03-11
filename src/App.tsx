import "./styles.css";

import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import ColorMixer from "./components/ColorMixer";
import "./components/ColorMixer.css";

const THEME_KEY = "color-mixer.theme";
const THEME_OPTIONS = {
  SYSTEM: "system",
  LIGHT: "light",
  DARK: "dark"
} as const;

type ThemeMode = (typeof THEME_OPTIONS)[keyof typeof THEME_OPTIONS];

function resolveTheme(mode: ThemeMode): Exclude<ThemeMode, "system"> {
  if (mode === THEME_OPTIONS.DARK) {
    return THEME_OPTIONS.DARK;
  }

  if (mode === THEME_OPTIONS.LIGHT) {
    return THEME_OPTIONS.LIGHT;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? THEME_OPTIONS.DARK
    : THEME_OPTIONS.LIGHT;
}

function readInitialThemeMode(): ThemeMode {
  if (typeof window === "undefined") {
    return THEME_OPTIONS.SYSTEM;
  }

  const saved = window.localStorage.getItem(THEME_KEY);
  if (saved === THEME_OPTIONS.DARK || saved === THEME_OPTIONS.LIGHT || saved === THEME_OPTIONS.SYSTEM) {
    return saved;
  }

  return THEME_OPTIONS.SYSTEM;
}

export default function App() {
  const [themeMode, setThemeMode] = useState<ThemeMode>(readInitialThemeMode);

  useEffect(() => {
    const applyTheme = () => {
      document.documentElement.setAttribute("data-theme", resolveTheme(themeMode));
    };

    applyTheme();
    window.localStorage.setItem(THEME_KEY, themeMode);

    if (themeMode !== THEME_OPTIONS.SYSTEM) {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", applyTheme);

    return () => {
      mediaQuery.removeEventListener("change", applyTheme);
    };
  }, [themeMode]);

  const handleThemeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextTheme = event.target.value;

    if (nextTheme === THEME_OPTIONS.DARK || nextTheme === THEME_OPTIONS.LIGHT || nextTheme === THEME_OPTIONS.SYSTEM) {
      setThemeMode(nextTheme);
    }
  };

  return (
    <div className="App">
      <div className="top"></div>
      <header className="appHeader">
        <div className="appBrand">
          <img className="appLogo" src={`${import.meta.env.BASE_URL}rgb.png`} alt="RGB logo" />
          <div className="appBrandMeta">
            <div className="appTitle">Color Mixer</div>
            <div className="appVersion" aria-label="Application version">
              v{__APP_VERSION__}
            </div>
          </div>
        </div>
        <label className="themeSwitch" htmlFor="themeMode">
          Theme
          <select id="themeMode" value={themeMode} onChange={handleThemeChange}>
            <option value={THEME_OPTIONS.SYSTEM}>System</option>
            <option value={THEME_OPTIONS.LIGHT}>Light</option>
            <option value={THEME_OPTIONS.DARK}>Dark</option>
          </select>
        </label>
      </header>

      <main className="content">
        <ColorMixer />
        <div className="infoText">Click a color code to copy it to the clipboard.</div>
      </main>

      <footer className="footer">
        <a href="https://www.flaticon.com/free-icons/rgb" title="rgb icons">
          Rgb icons created by Freepik - Flaticon
        </a>
      </footer>
    </div>
  );
}
