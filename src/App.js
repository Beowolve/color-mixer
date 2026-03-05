import "./styles.css";

import { useEffect, useState } from "react";
import ColorMixer from "./components/ColorMixer.js";
import "./components/ColorMixer.css";

const THEME_KEY = "color-mixer.theme";
const THEME_OPTIONS = {
  SYSTEM: "system",
  LIGHT: "light",
  DARK: "dark"
};

function resolveTheme(mode) {
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

export default function App() {
  const [themeMode, setThemeMode] = useState(() => {
    const saved = window.localStorage.getItem(THEME_KEY);
    if (saved === THEME_OPTIONS.DARK || saved === THEME_OPTIONS.LIGHT || saved === THEME_OPTIONS.SYSTEM) {
      return saved;
    }

    return THEME_OPTIONS.SYSTEM;
  });

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

  return (
    <div className="App">
      <div className="top"></div>
      <header className="appHeader">
        <div className="appBrand">
          <img className="appLogo" src={`${process.env.PUBLIC_URL}/rgb.png`} alt="RGB logo" />
          <div className="appTitle">Color Mixer</div>
        </div>
        <label className="themeSwitch" htmlFor="themeMode">
          Theme
          <select
            id="themeMode"
            value={themeMode}
            onChange={(event) => setThemeMode(event.target.value)}
          >
            <option value={THEME_OPTIONS.SYSTEM}>System</option>
            <option value={THEME_OPTIONS.LIGHT}>Light</option>
            <option value={THEME_OPTIONS.DARK}>Dark</option>
          </select>
        </label>
      </header>

      <main className="content">
        <ColorMixer />
        <div className="infoText">You can click the color code to copy it.</div>
      </main>

      <footer className="footer">
        <a href="https://www.flaticon.com/free-icons/rgb" title="rgb icons">
          Rgb icons created by Freepik - Flaticon
        </a>
      </footer>
    </div>
  );
}
