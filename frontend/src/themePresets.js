export const THEME_PRESETS = [
  { id: "midnight", label: "Midnight", className: "theme-dark" },
  { id: "ocean", label: "Ocean", className: "theme-ocean" },
  { id: "ember", label: "Ember", className: "theme-ember" },
  { id: "forest", label: "Forest", className: "theme-forest" },
  { id: "dusk", label: "Dusk", className: "theme-dusk" },
  { id: "daylight", label: "Daylight", className: "theme-light" },
];

export function applyStoredTheme() {
  if (typeof document === "undefined") return;
  const byId = localStorage.getItem("themeId");
  let preset = byId ? THEME_PRESETS.find((t) => t.id === byId) : null;
  if (!preset) {
    const legacy = localStorage.getItem("themeName");
    if (legacy === "ocean") {
      preset = THEME_PRESETS.find((t) => t.id === "ocean");
    }
  }
  document.body.className = (preset || THEME_PRESETS[0]).className;
}
