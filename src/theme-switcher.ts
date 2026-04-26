/**
 * Theme switcher utility for Elementix.
 *
 * Usage:
 *   import { setTheme, getTheme, toggleTheme } from '@clawdiab/elementix';
 *
 *   setTheme('dark');       // force dark
 *   setTheme('light');      // force light
 *   setTheme('system');     // follow OS preference (default)
 *   toggleTheme();          // toggle between light and dark
 */

export type Theme = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'elx-theme';
const VALID_THEMES: Theme[] = ['light', 'dark', 'system'];

function isBrowser(): boolean {
  return typeof document !== 'undefined' && typeof window !== 'undefined';
}

export function getTheme(): Theme {
  if (!isBrowser() || typeof localStorage === 'undefined') return 'system';
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored && VALID_THEMES.includes(stored as Theme) ? (stored as Theme) : 'system';
}

export function setTheme(theme: Theme): void {
  if (!isBrowser()) return;
  const root = document.documentElement;

  if (theme === 'system') {
    root.removeAttribute('data-theme');
    root.classList.remove('elx-dark', 'elx-light');
    localStorage.removeItem(STORAGE_KEY);
  } else {
    root.setAttribute('data-theme', theme);
    root.classList.toggle('elx-dark', theme === 'dark');
    root.classList.toggle('elx-light', theme === 'light');
    localStorage.setItem(STORAGE_KEY, theme);
  }

  root.dispatchEvent(new CustomEvent('elx-theme-change', { detail: { theme } }));
}

export function toggleTheme(): void {
  if (!isBrowser()) return;
  const current = getResolvedTheme();
  setTheme(current === 'dark' ? 'light' : 'dark');
}

export function getResolvedTheme(): 'light' | 'dark' {
  if (!isBrowser()) return 'light';
  const stored = getTheme();
  if (stored !== 'system') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/** Initialize theme from localStorage on page load. */
export function initTheme(): void {
  if (!isBrowser()) return;
  const stored = getTheme();
  if (stored !== 'system') {
    setTheme(stored);
  }
}
