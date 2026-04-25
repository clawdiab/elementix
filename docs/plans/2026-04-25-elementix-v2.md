# Elementix v2 — Improvements & New Components Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task. Create a PR for each task, request review from a subagent AND GitHub Copilot.

**Goal:** Improve DX, build quality, testing, and add 6 missing components to make Elementix a production-ready design system.

**Architecture:** Vanilla Web Components with Shadow DOM, CSS custom properties for theming, Vitest + jsdom for testing, Storybook for docs.

**Tech Stack:** TypeScript, Vite, Vitest, Storybook 8, GitHub Actions

---

## Phase 1: DX & Build Quality

### Task 1: Type Declarations & Package Exports

**Objective:** Ship `.d.ts` files so consumers get autocomplete and type checking. Add proper `exports` field to package.json.

**Branch:** `feat/type-declarations`

**Files:**
- Modify: `package.json`
- Modify: `vite.config.ts`
- Modify: `tsconfig.json`

**Step 1: Install vite-plugin-dts**

```bash
npm install -D vite-plugin-dts
```

**Step 2: Update vite.config.ts**

```ts
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      include: ['src'],
      exclude: ['src/**/*.test.ts', 'src/**/*.stories.ts', 'src/stories/**'],
    }),
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: 'index',
    },
  },
});
```

**Step 3: Fix tsconfig.json — remove noEmit conflict**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "declaration": true,
    "declarationDir": "dist"
  },
  "include": ["src"],
  "exclude": ["src/**/*.test.ts", "src/**/*.stories.ts", "src/stories/**"]
}
```

Note: `vite-plugin-dts` handles declaration emit separately, so `noEmit: true` is fine.

**Step 4: Add exports field to package.json**

```json
{
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./theme.css": "./dist/style.css"
  },
  "files": ["dist"]
}
```

**Step 5: Verify build**

```bash
npm run build
ls dist/*.d.ts
```

Expected: `dist/index.d.ts` and component `.d.ts` files exist.

**Step 6: Commit, push, create PR**

```bash
git add -A
git commit -m "feat: add type declarations and package exports"
git push origin feat/type-declarations
gh pr create --title "feat: add type declarations and package exports" --body "Ships .d.ts files for consumer autocomplete. Adds exports field for proper ESM resolution and standalone theme.css import."
```

**Step 7: Request review from subagent and GitHub Copilot**

---

### Task 2: ESLint & Prettier Setup

**Objective:** Add linting and formatting to catch issues early and enforce consistency.

**Branch:** `feat/lint-format`

**Files:**
- Create: `eslint.config.js`
- Create: `.prettierrc`
- Create: `.prettierignore`
- Modify: `package.json` (scripts + devDeps)

**Step 1: Install dependencies**

```bash
npm install -D eslint @eslint/js typescript-eslint prettier eslint-config-prettier
```

**Step 2: Create eslint.config.js (flat config)**

```js
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,
  {
    ignores: ['dist/', 'storybook-static/', 'node_modules/'],
  },
  {
    files: ['src/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
);
```

**Step 3: Create .prettierrc**

```json
{
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2
}
```

**Step 4: Create .prettierignore**

```
dist/
storybook-static/
node_modules/
```

**Step 5: Add scripts to package.json**

```json
{
  "scripts": {
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "format": "prettier --write 'src/**/*.ts'",
    "format:check": "prettier --check 'src/**/*.ts'"
  }
}
```

**Step 6: Run lint and fix any issues**

```bash
npm run lint
npm run format
```

**Step 7: Add lint to CI workflow (.github/workflows/ci.yml)**

Add after the test step:

```yaml
      - name: Lint
        run: npm run lint

      - name: Format check
        run: npm run format:check
```

**Step 8: Commit, push, create PR, request review**

---

### Task 3: Accessibility Testing

**Objective:** Add automated a11y testing with @storybook/addon-a11y and axe-core in Vitest.

**Branch:** `feat/a11y-testing`

**Files:**
- Modify: `.storybook/main.js` (add addon)
- Create: `src/test-utils/a11y.ts` (axe helper)
- Modify: `src/components/button/button.test.ts` (add a11y test as example)
- Modify: `package.json`

**Step 1: Install dependencies**

```bash
npm install -D @storybook/addon-a11y axe-core
```

**Step 2: Add addon to .storybook/main.js**

```js
const config = {
  stories: ['../src/**/*.stories.ts'],
  staticDirs: ['./public'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/web-components-vite',
    options: {},
  },
};
export default config;
```

**Step 3: Create src/test-utils/a11y.ts**

```ts
import { configureAxe, toHaveNoViolations } from 'jest-axe';

// Note: jest-axe doesn't work well with jsdom shadow DOM.
// Instead, use axe-core directly:
import axe from 'axe-core';

export async function checkA11y(element: HTMLElement): Promise<void> {
  const results = await axe.run(element);
  if (results.violations.length > 0) {
    const messages = results.violations.map(
      (v) => `[${v.impact}] ${v.id}: ${v.description}\n  ${v.nodes.map((n) => n.html).join('\n  ')}`,
    );
    throw new Error(`Accessibility violations:\n${messages.join('\n')}`);
  }
}
```

**Step 4: Add a11y test to button as example pattern**

```ts
import { checkA11y } from '../../test-utils/a11y';

it('has no accessibility violations', async () => {
  const el = document.createElement('elx-button');
  el.textContent = 'Click me';
  document.body.appendChild(el);
  await checkA11y(el);
});
```

**Step 5: Run tests, verify, commit, push, create PR, request review**

---

### Task 4: Fix README Theming Section

**Objective:** Add missing `--elx-color-warning-*` and `--elx-color-purple-*` to the README token list.

**Branch:** `fix/readme-tokens`

**Files:**
- Modify: `README.md`

**Step 1: Update the Available token categories section**

Replace:
```markdown
- **Colors**: `--elx-color-primary-*`, `--elx-color-danger-*`, `--elx-color-success-*`, `--elx-color-neutral-*`
```

With:
```markdown
- **Colors**: `--elx-color-primary-*`, `--elx-color-danger-*`, `--elx-color-success-*`, `--elx-color-warning-*`, `--elx-color-purple-*`, `--elx-color-neutral-*`
```

**Step 2: Commit, push, create PR, request review**

---

## Phase 2: New Components

Each component follows the same pattern:
1. Create branch `feat/component-name`
2. Write tests first (TDD)
3. Implement component
4. Create Storybook story
5. Export from `src/index.ts`
6. Update README component table
7. Commit, push, create PR
8. Request review from subagent + GitHub Copilot

### Task 5: Toast / Notification Component

**Objective:** Build `<elx-toast>` for transient feedback messages with auto-dismiss.

**Branch:** `feat/toast`

**Files:**
- Create: `src/components/toast/toast.ts`
- Create: `src/components/toast/toast.test.ts`
- Create: `src/components/toast/toast.stories.ts`
- Modify: `src/index.ts`
- Modify: `README.md`

**API Design:**

```html
<elx-toast variant="success" duration="3000" dismissible>
  File saved successfully
</elx-toast>
```

Attributes:
- `variant`: `info` | `success` | `warning` | `error` (default: `info`)
- `duration`: auto-dismiss in ms, `0` = persistent (default: `5000`)
- `dismissible`: show close button
- `position`: `top-right` | `top-left` | `bottom-right` | `bottom-left` | `top-center` | `bottom-center` (default: `top-right`)

Events:
- `close`: fired when toast is dismissed

Programmatic API:
```ts
ElxToast.show({ message: 'Saved!', variant: 'success', duration: 3000 });
```

**Tests to write:**
1. Renders with default props
2. Shows correct variant styling
3. Auto-dismisses after duration
4. Dismissible shows close button
5. Close button fires close event and removes element
6. duration=0 does not auto-dismiss
7. Position attribute sets correct CSS
8. Static show() method creates and appends toast
9. Multiple toasts stack correctly
10. Keyboard: Escape dismisses

**Step 1-5:** TDD cycle for each test group, then stories, export, README update.

**Step 6: Commit, push, create PR, request review**

---

### Task 6: Dropdown Menu Component

**Objective:** Build `<elx-dropdown>` for context menus and action menus.

**Branch:** `feat/dropdown`

**Files:**
- Create: `src/components/dropdown/dropdown.ts`
- Create: `src/components/dropdown/dropdown.test.ts`
- Create: `src/components/dropdown/dropdown.stories.ts`
- Modify: `src/index.ts`
- Modify: `README.md`

**API Design:**

```html
<elx-dropdown>
  <elx-button slot="trigger">Actions</elx-button>
  <elx-dropdown-item value="edit">Edit</elx-dropdown-item>
  <elx-dropdown-item value="delete" variant="danger">Delete</elx-dropdown-item>
  <elx-dropdown-separator></elx-dropdown-separator>
  <elx-dropdown-item disabled>Archived</elx-dropdown-item>
</elx-dropdown>
```

Attributes (elx-dropdown):
- `open`: boolean
- `align`: `start` | `end` (default: `start`)
- `side`: `bottom` | `top` (default: `bottom`)

Attributes (elx-dropdown-item):
- `value`: string
- `disabled`: boolean
- `variant`: `default` | `danger`

Events:
- `select`: fired with `{ detail: { value } }` when item clicked

**Tests to write:**
1. Renders trigger slot
2. Menu hidden by default
3. Click trigger opens menu
4. Click trigger again closes menu
5. Click outside closes menu
6. Escape closes menu
7. Click item fires select event with value
8. Disabled item doesn't fire select
9. Danger variant styling
10. Keyboard: ArrowDown/ArrowUp navigates items
11. Keyboard: Enter selects focused item
12. Separator renders as divider
13. Focus returns to trigger on close

**Step 1-5:** TDD cycle, stories, export, README.

**Step 6: Commit, push, create PR, request review**

---

### Task 7: Popover Component

**Objective:** Build `<elx-popover>` for general-purpose floating content.

**Branch:** `feat/popover`

**Files:**
- Create: `src/components/popover/popover.ts`
- Create: `src/components/popover/popover.test.ts`
- Create: `src/components/popover/popover.stories.ts`
- Modify: `src/index.ts`
- Modify: `README.md`

**API Design:**

```html
<elx-popover>
  <elx-button slot="trigger">Info</elx-button>
  <div slot="content">
    <h3>Popover Title</h3>
    <p>Any rich content goes here.</p>
  </div>
</elx-popover>
```

Attributes:
- `open`: boolean
- `side`: `top` | `bottom` | `left` | `right` (default: `bottom`)
- `align`: `start` | `center` | `end` (default: `center`)
- `trigger-on`: `click` | `hover` (default: `click`)

Events:
- `open`: fired when popover opens
- `close`: fired when popover closes

**Tests to write:**
1. Renders trigger and content slots
2. Content hidden by default
3. Click trigger opens popover
4. Click trigger again closes
5. Click outside closes
6. Escape closes
7. Side/align positioning
8. trigger-on="hover" opens on mouseenter, closes on mouseleave
9. Focus trap within popover content
10. ARIA attributes (aria-expanded, aria-haspopup)

**Step 1-5:** TDD cycle, stories, export, README.

**Step 6: Commit, push, create PR, request review**

---

### Task 8: Progress / Spinner Component

**Objective:** Build `<elx-progress>` for determinate progress and `<elx-spinner>` for indeterminate loading.

**Branch:** `feat/progress-spinner`

**Files:**
- Create: `src/components/progress/progress.ts`
- Create: `src/components/progress/progress.test.ts`
- Create: `src/components/progress/progress.stories.ts`
- Create: `src/components/spinner/spinner.ts`
- Create: `src/components/spinner/spinner.test.ts`
- Create: `src/components/spinner/spinner.stories.ts`
- Modify: `src/index.ts`
- Modify: `README.md`

**API Design:**

```html
<!-- Determinate progress bar -->
<elx-progress value="65" max="100" size="md" color="primary"></elx-progress>

<!-- Indeterminate spinner -->
<elx-spinner size="md" color="primary"></elx-spinner>
```

Progress attributes:
- `value`: number (0-max)
- `max`: number (default: 100)
- `size`: `sm` | `md` | `lg`
- `color`: `primary` | `success` | `danger` | `warning`
- `label`: optional text label

Spinner attributes:
- `size`: `sm` | `md` | `lg`
- `color`: `primary` | `neutral`

**Tests (Progress):**
1. Renders with default props
2. Value sets width percentage
3. Max attribute works
4. Size variants
5. Color variants use theme variables
6. ARIA: role=progressbar, aria-valuenow, aria-valuemin, aria-valuemax
7. Label displays text

**Tests (Spinner):**
1. Renders SVG animation
2. Size variants
3. Color variants
4. ARIA: role=status, aria-label

**Step 1-5:** TDD cycle, stories, export, README.

**Step 6: Commit, push, create PR, request review**

---

### Task 9: Breadcrumb Component

**Objective:** Build `<elx-breadcrumb>` for navigation hierarchy.

**Branch:** `feat/breadcrumb`

**Files:**
- Create: `src/components/breadcrumb/breadcrumb.ts`
- Create: `src/components/breadcrumb/breadcrumb.test.ts`
- Create: `src/components/breadcrumb/breadcrumb.stories.ts`
- Modify: `src/index.ts`
- Modify: `README.md`

**API Design:**

```html
<elx-breadcrumb>
  <elx-breadcrumb-item href="/">Home</elx-breadcrumb-item>
  <elx-breadcrumb-item href="/products">Products</elx-breadcrumb-item>
  <elx-breadcrumb-item current>Widget</elx-breadcrumb-item>
</elx-breadcrumb>
```

Attributes (elx-breadcrumb):
- `separator`: string (default: `/`)

Attributes (elx-breadcrumb-item):
- `href`: string (renders as link if present)
- `current`: boolean (last item, no link)

**Tests to write:**
1. Renders items with separator
2. Items with href render as links
3. Current item renders as text (no link)
4. Custom separator character
5. ARIA: nav with aria-label="Breadcrumb"
6. Current item has aria-current="page"
7. Handles single item
8. Handles dynamic item addition/removal

**Step 1-5:** TDD cycle, stories, export, README.

**Step 6: Commit, push, create PR, request review**

---

### Task 10: Pagination Component

**Objective:** Build `<elx-pagination>` for navigating paged data.

**Branch:** `feat/pagination`

**Files:**
- Create: `src/components/pagination/pagination.ts`
- Create: `src/components/pagination/pagination.test.ts`
- Create: `src/components/pagination/pagination.stories.ts`
- Modify: `src/index.ts`
- Modify: `README.md`

**API Design:**

```html
<elx-pagination total="100" page="1" per-page="10"></elx-pagination>
```

Attributes:
- `total`: total item count
- `page`: current page (1-indexed)
- `per-page`: items per page (default: 10)
- `siblings`: number of sibling pages to show (default: 1)
- `size`: `sm` | `md` | `lg`

Events:
- `page-change`: fired with `{ detail: { page } }`

**Tests to write:**
1. Renders correct page count
2. Current page highlighted
3. Previous/Next buttons
4. Previous disabled on page 1
5. Next disabled on last page
6. Click page fires page-change event
7. Ellipsis shown for large page counts
8. Siblings attribute controls visible range
9. Keyboard navigation
10. ARIA: nav with aria-label="Pagination"

**Step 1-5:** TDD cycle, stories, export, README.

**Step 6: Commit, push, create PR, request review**

---

## Phase 3: Documentation & Polish

### Task 11: Dark Mode Theme Example

**Objective:** Add a dark mode theme preset and Storybook theme switcher.

**Branch:** `feat/dark-mode`

**Files:**
- Create: `src/theme-dark.css`
- Modify: `.storybook/preview.js` (add theme switcher)
- Create: `src/stories/dark-mode.stories.ts`
- Modify: `README.md`

**Step 1: Create src/theme-dark.css**

Override all theme variables with dark values:

```css
[data-theme="dark"] {
  --elx-color-primary-50: #1e3a5f;
  --elx-color-primary-500: #60a5fa;
  --elx-color-primary-600: #3b82f6;
  --elx-color-primary-700: #2563eb;
  /* ... all other color overrides ... */
  --elx-color-neutral-50: #1f2937;
  --elx-color-neutral-100: #374151;
  --elx-color-neutral-800: #f3f4f6;
  --elx-color-neutral-900: #f9fafb;
  --elx-color-white: #111827;
  --elx-color-black: #ffffff;
}
```

**Step 2: Add Storybook toolbar theme switcher in preview.js**

**Step 3: Create dark mode story showing all components in dark theme**

**Step 4: Update README with dark mode usage example**

**Step 5: Commit, push, create PR, request review**

---

### Task 12: Getting Started Guide

**Objective:** Add a comprehensive getting started guide with framework integration examples.

**Branch:** `feat/getting-started`

**Files:**
- Create: `docs/getting-started.md`
- Create: `src/stories/getting-started.mdx` (Storybook docs page)
- Modify: `README.md` (link to guide)

**Content:**
1. Installation (npm, CDN)
2. Basic usage (vanilla HTML)
3. Framework integration (React, Vue, Svelte, Angular)
4. Theming customization
5. Dark mode setup
6. TypeScript usage
7. SSR considerations

**Step 1-3:** Write docs, create Storybook MDX page, update README.

**Step 4: Commit, push, create PR, request review**

---

## Task Summary

| # | Task | Branch | Phase |
|---|------|--------|-------|
| 1 | Type Declarations & Package Exports | `feat/type-declarations` | DX |
| 2 | ESLint & Prettier Setup | `feat/lint-format` | DX |
| 3 | Accessibility Testing | `feat/a11y-testing` | DX |
| 4 | Fix README Theming Section | `fix/readme-tokens` | DX |
| 5 | Toast / Notification Component | `feat/toast` | Components |
| 6 | Dropdown Menu Component | `feat/dropdown` | Components |
| 7 | Popover Component | `feat/popover` | Components |
| 8 | Progress / Spinner Component | `feat/progress-spinner` | Components |
| 9 | Breadcrumb Component | `feat/breadcrumb` | Components |
| 10 | Pagination Component | `feat/pagination` | Components |
| 11 | Dark Mode Theme | `feat/dark-mode` | Docs |
| 12 | Getting Started Guide | `feat/getting-started` | Docs |

## PR Workflow (Every Task)

1. Create feature branch
2. Implement with TDD
3. Run `npm test`, `npm run build`, `npm run lint` (after Task 2)
4. Push and create PR
5. Wait for CI to pass
6. Request review from subagent (delegate_task)
7. Request review from GitHub Copilot (`gh pr edit <num> --add-reviewer @copilot`)
8. Address review feedback
9. Merge when approved
