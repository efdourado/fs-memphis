import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPalette, faCircleCheck } from "@fortawesome/free-solid-svg-icons";

import { THEME_PRESETS } from "../../themePresets";

const SWATCHES = {
  midnight: "#946b2d",
  ocean: "#6f88a9",
  ember: "#c45c3e",
  forest: "#3d8f6e",
  dusk: "#9b7ec4",
};

const THEMES = THEME_PRESETS.map((t) => ({
  ...t,
  swatch: SWATCHES[t.id] || SWATCHES.midnight,
}));

function initialThemeIndex() {
  const byId = localStorage.getItem("themeId");
  if (byId) {
    const i = THEMES.findIndex((t) => t.id === byId);
    if (i !== -1) return i;
  }
  const legacy = localStorage.getItem("themeName");
  if (legacy === "ocean") {
    const i = THEMES.findIndex((t) => t.id === "ocean");
    return i !== -1 ? i : 0;
  }
  return 0;
}

const ThemePicker = () => {
  const [open, setOpen] = useState(false);
  const [themeIndex, setThemeIndex] = useState(initialThemeIndex);
  const rootRef = useRef(null);

  useEffect(() => {
    const theme = THEMES[themeIndex];
    document.body.className = theme.className;
    localStorage.setItem("themeId", theme.id);
    localStorage.setItem("themeName", theme.id === "midnight" ? "dark" : theme.id);
  }, [themeIndex]);

  useEffect(() => {
    const onDoc = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const current = THEMES[themeIndex];

  return (
    <div className="theme-picker" ref={rootRef}>
      <button
        type="button"
        className="btn-icon-only btn-ghost theme-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`Appearance: ${current.label}. Choose theme`}
      >
        <FontAwesomeIcon icon={faPalette} className="btn-icon-graphic" />
      </button>
      {open && (
        <div className="theme-picker__menu" role="listbox" aria-label="Color themes">
          {THEMES.map((t, i) => (
            <button
              key={t.id}
              type="button"
              role="option"
              aria-selected={i === themeIndex}
              className={`theme-picker__option ${i === themeIndex ? "is-active" : ""}`}
              onClick={() => {
                setThemeIndex(i);
                setOpen(false);
              }}
            >
              <span className="theme-picker__swatch" style={{ background: t.swatch }} aria-hidden />
              <span className="theme-picker__label">{t.label}</span>
              
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemePicker;
