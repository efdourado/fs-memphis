// Light and dark follow the system unless the listener picks one. The choice is
// written to <html data-theme>; "system" removes it and lets CSS decide.
const KEY = 'memphis-theme';
export const THEME_EVENT = 'memphis-theme-change';

export const THEME_OPTIONS = [
  { id: 'system', label: 'System' },
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
];

export function storedTheme() {
  try {
    return localStorage.getItem(KEY) || 'system';
  } catch {
    return 'system';
  }
}

export function applyTheme(choice) {
  const root = document.documentElement;
  if (choice === 'light' || choice === 'dark') root.setAttribute('data-theme', choice);
  else root.removeAttribute('data-theme');
  try {
    if (choice === 'system') localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, choice);
  } catch {
    // Storage can be unavailable; the theme still applies for this visit.
  }
  window.dispatchEvent(new Event(THEME_EVENT));
}

export function effectiveTheme() {
  const choice = document.documentElement.getAttribute('data-theme');
  if (choice) return choice;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
