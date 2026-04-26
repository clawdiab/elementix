# Elementix

[![CI](https://github.com/clawdiab/elementix/actions/workflows/ci.yml/badge.svg)](https://github.com/clawdiab/elementix/actions/workflows/ci.yml)

A Radix-inspired Web Components design system built with TypeScript, Lit, Vite, and Vitest.

## Documentation

- **Storybook**: https://clawdiab.github.io/elementix/
- **Live Demo**: https://clawdiab.github.io/elementix/demo.html

## Components

Status legend: ![stable](https://img.shields.io/badge/stable-green) ![beta](https://img.shields.io/badge/beta-yellow) ![alpha](https://img.shields.io/badge/alpha-orange)

> **Stable** — production ready, API is settled.
> **Beta** — functional and tested, minor API changes possible.
> **Alpha** — early stage, API may change significantly.

| Component | Tag | Description | Status |
|-----------|-----|-------------|--------|
| Button | `<elx-button>` | Button with variants, sizes, and states | ![stable](https://img.shields.io/badge/stable-green) |
| Input | `<elx-input>` | Text input with validation states | ![stable](https://img.shields.io/badge/stable-green) |
| Checkbox | `<elx-checkbox>` | Checkbox with indeterminate support | ![stable](https://img.shields.io/badge/stable-green) |
| Switch | `<elx-switch>` | Toggle switch component | ![stable](https://img.shields.io/badge/stable-green) |
| Radio | `<elx-radio>` | Radio button group | ![stable](https://img.shields.io/badge/stable-green) |
| Badge | `<elx-badge>` | Badge with variants and colors | ![stable](https://img.shields.io/badge/stable-green) |
| Avatar | `<elx-avatar>` | Avatar with image, fallback, and shapes | ![stable](https://img.shields.io/badge/stable-green) |
| Card | `<elx-card>` | Card container with variants | ![stable](https://img.shields.io/badge/stable-green) |
| Alert | `<elx-alert>` | Alert with variants and dismissible | ![stable](https://img.shields.io/badge/stable-green) |
| Dialog | `<elx-dialog>` | Modal dialog with focus trap | ![stable](https://img.shields.io/badge/stable-green) |
| Tabs | `<elx-tabs>` | Tabs with keyboard navigation | ![stable](https://img.shields.io/badge/stable-green) |
| Tooltip | `<elx-tooltip>` | Tooltip with positioning | ![stable](https://img.shields.io/badge/stable-green) |
| Select | `<elx-select>` | Dropdown select with search | ![stable](https://img.shields.io/badge/stable-green) |
| Separator | `<elx-separator>` | Horizontal/vertical divider | ![stable](https://img.shields.io/badge/stable-green) |
| Accordion | `<elx-accordion>` | Collapsible accordion panels | ![stable](https://img.shields.io/badge/stable-green) |
| Text | `<elx-text>` | Typography component with semantic variants | ![stable](https://img.shields.io/badge/stable-green) |
| Breadcrumb | `<elx-breadcrumb>` | Navigation breadcrumb trail | ![stable](https://img.shields.io/badge/stable-green) |
| Dropdown | `<elx-dropdown>` | Dropdown menu with trigger | ![stable](https://img.shields.io/badge/stable-green) |
| Popover | `<elx-popover>` | Floating popover with positioning | ![stable](https://img.shields.io/badge/stable-green) |
| Progress | `<elx-progress>` | Progress bar with variants | ![stable](https://img.shields.io/badge/stable-green) |
| Table | `<elx-table>` | Data table component | ![stable](https://img.shields.io/badge/stable-green) |
| Toast | `<elx-toast>` | Toast notification system | ![stable](https://img.shields.io/badge/stable-green) |
| Pagination | `<elx-pagination>` | Page navigation controls | ![stable](https://img.shields.io/badge/stable-green) |
| Drawer | `<elx-drawer>` | Side panel drawer with focus trap | ![stable](https://img.shields.io/badge/stable-green) |
| Menu | `<elx-menu>` | Accessible menu with keyboard navigation | ![stable](https://img.shields.io/badge/stable-green) |
| Skeleton | `<elx-skeleton>` | Loading skeleton placeholder | ![stable](https://img.shields.io/badge/stable-green) |
| Calendar | `<elx-calendar>` | Date picker calendar | ![beta](https://img.shields.io/badge/beta-yellow) |
| Stepper | `<elx-stepper>` | Multi-step progress indicator | ![beta](https://img.shields.io/badge/beta-yellow) |
| FileUpload | `<elx-file-upload>` | File upload with drag and drop | ![beta](https://img.shields.io/badge/beta-yellow) |
| AvatarGroup | `<elx-avatar-group>` | Stacked group of avatars | ![beta](https://img.shields.io/badge/beta-yellow) |
| Slider | `<elx-slider>` | Range input with track and thumb | ![beta](https://img.shields.io/badge/beta-yellow) |
| Label | `<elx-label>` | Accessible label for form controls | ![beta](https://img.shields.io/badge/beta-yellow) |
| FormField | `<elx-form-field>` | Layout wrapper for label + input + helper text | ![beta](https://img.shields.io/badge/beta-yellow) |

## Theming

Elementix uses CSS custom properties defined in `src/theme.css` for all design tokens (colors, typography, spacing, radii). You can customize the look and feel by overriding these variables on `:root` or any scoping selector:

```css
:root {
  --elx-color-primary-600: #your-brand-color;
  --elx-font-family-sans: 'Inter', sans-serif;
}
```

Available token categories:

- **Colors**: `--elx-color-primary-*`, `--elx-color-danger-*`, `--elx-color-success-*`, `--elx-color-warning-*`, `--elx-color-purple-*`, `--elx-color-neutral-*`
- **Typography**: `--elx-font-family-*`, `--elx-font-size-*`, `--elx-font-weight-*`, `--elx-line-height-*`
- **Border Radius**: `--elx-radius-sm`, `--elx-radius-md`, `--elx-radius-lg`, `--elx-radius-full`

See [`src/theme.css`](./src/theme.css) for the full list of available variables and their defaults.

## Installation

```bash
npm install @clawdiab/elementix
```

## Usage

```html
<script type="module">
  import '@clawdiab/elementix';
</script>

<elx-button variant="primary" size="md">Click me</elx-button>
<elx-input placeholder="Enter text..." disabled></elx-input>
<elx-badge color="green" variant="solid">New</elx-badge>
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Build for production
npm run build

# Start Storybook
npm run storybook
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

MIT
