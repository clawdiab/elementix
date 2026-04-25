# Typography and Color System Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task. Make a PR after each component/task is done, get it reviewed, and merge.

**Goal:** Establish a scalable, CSS variable-based color and typography system for the Elementix design system, and refactor existing components to use it.

**Architecture:** We will create a core `theme.css` file that exports CSS custom properties (`--elx-color-*`, `--elx-font-*`). Then we will create a dedicated `elx-text` component for typography, and update all existing components to consume these variables instead of hardcoded hex values.

**Tech Stack:** Web Components, TypeScript, CSS Variables

---

### Task 1: Create Global Theme File

**Objective:** Define the core CSS variables for colors, typography, and spacing.

**Files:**
- Create: `src/theme.css`
- Modify: `src/index.ts` to export it or document how to import it.

**Step 1: Write `src/theme.css`**

```css
:root {
  /* Colors */
  --elx-color-primary-50: #eff6ff;
  --elx-color-primary-100: #dbeafe;
  --elx-color-primary-500: #3b82f6;
  --elx-color-primary-600: #2563eb;
  --elx-color-primary-700: #1d4ed8;

  --elx-color-danger-50: #fef2f2;
  --elx-color-danger-500: #ef4444;
  --elx-color-danger-600: #dc2626;
  --elx-color-danger-700: #b91c1c;

  --elx-color-success-50: #f0fdf4;
  --elx-color-success-500: #22c55e;
  --elx-color-success-600: #16a34a;
  --elx-color-success-700: #15803d;

  --elx-color-neutral-50: #f9fafb;
  --elx-color-neutral-100: #f3f4f6;
  --elx-color-neutral-200: #e5e7eb;
  --elx-color-neutral-300: #d1d5db;
  --elx-color-neutral-400: #9ca3af;
  --elx-color-neutral-500: #6b7280;
  --elx-color-neutral-600: #4b5563;
  --elx-color-neutral-700: #374151;
  --elx-color-neutral-800: #1f2937;
  --elx-color-neutral-900: #111827;

  --elx-color-white: #ffffff;
  --elx-color-black: #000000;

  /* Typography */
  --elx-font-family-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --elx-font-family-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;

  --elx-font-size-xs: 0.75rem;     /* 12px */
  --elx-font-size-sm: 0.875rem;    /* 14px */
  --elx-font-size-base: 1rem;      /* 16px */
  --elx-font-size-lg: 1.125rem;    /* 18px */
  --elx-font-size-xl: 1.25rem;     /* 20px */
  --elx-font-size-2xl: 1.5rem;     /* 24px */
  --elx-font-size-3xl: 1.875rem;   /* 30px */
  --elx-font-size-4xl: 2.25rem;    /* 36px */

  --elx-font-weight-normal: 400;
  --elx-font-weight-medium: 500;
  --elx-font-weight-semibold: 600;
  --elx-font-weight-bold: 700;

  --elx-line-height-tight: 1.25;
  --elx-line-height-snug: 1.375;
  --elx-line-height-normal: 1.5;
  --elx-line-height-relaxed: 1.625;

  /* Border Radius */
  --elx-radius-sm: 0.125rem;
  --elx-radius-md: 0.375rem;
  --elx-radius-lg: 0.5rem;
  --elx-radius-full: 9999px;
}
```

**Step 2: Add theme to `src/index.ts` export**

Modify `src/index.ts` to include:
```typescript
import './theme.css';
```
*Note: Ensure Vite handles CSS imports correctly in the library build mode if needed, or instruct users to import `theme.css` manually. For now, Vite will bundle it if imported.*

**Step 3: Update `index.html` and `.storybook/preview.ts`**
Import `theme.css` into `index.html` and `.storybook/preview.ts` so the global variables are available during development and in Storybook.

---

### Task 2: Refactor Components to use Theme Variables (Batch 1)

**Objective:** Update Button, Badge, and Alert to use the new CSS variables.

**Files to modify:**
- `src/components/button/button.ts`
- `src/components/badge/badge.ts`
- `src/components/alert/alert.ts`

**Step 1: Replace Hardcoded Values**
For `button.ts`, change:
- `background: #2563eb;` -> `background: var(--elx-color-primary-600);`
- `border-radius: 6px;` -> `border-radius: var(--elx-radius-md);`
- `font-family: inherit;` -> `font-family: var(--elx-font-family-sans);`
Do this for all hex codes and pixel sizes across these 3 components.

**Step 2: Verify Tests**
Run `npm test` to ensure components still render correctly.

---

### Task 3: Refactor Components to use Theme Variables (Batch 2)

**Objective:** Update Input, Checkbox, Switch, Radio to use CSS variables.

**Files to modify:**
- `src/components/input/input.ts`
- `src/components/checkbox/checkbox.ts`
- `src/components/switch/switch.ts`
- `src/components/radio/radio.ts`

**Steps:** Replace hardcoded colors (`#d1d5db`, `#2563eb`, etc.) and typography with `var(--elx-...)` equivalents. Verify tests pass.

---

### Task 4: Refactor Components to use Theme Variables (Batch 3)

**Objective:** Update Avatar, Card, Dialog, Tabs, Tooltip, Select, Separator, Accordion.

**Steps:** Search through `src/components/` for `#` (hex codes), `px` values for fonts/radius, and replace them with theme variables. Verify tests pass.

---

### Task 5: Build Text/Typography Component

**Objective:** Create an `<elx-text>` component for rendering standardized typography.

**Files:**
- `src/components/text/text.ts`
- `src/components/text/text.test.ts`
- `src/components/text/text.stories.ts`

**Step 1: Write `text.ts`**
Create a component that accepts `variant` (h1, h2, h3, h4, p, span, muted, etc.), `weight` (normal, medium, bold), and `align` (left, center, right).

```typescript
// Add standard custom element definition logic mapping variants to standard tags (h1-h6, p, span) inside the shadow DOM with proper slots.
```

**Step 2: Write tests and stories**
Add complete unit tests for variant handling and Storybook stories showing all typographic scale options.

---

### Task 6: Documentation Updates

**Objective:** Update the README.md and CONTRIBUTING.md to mention theming.

**Files:**
- `README.md`
- `CONTRIBUTING.md`

**Step 1:** Document how to customize the theme by overriding CSS variables in the `:root`.

---
