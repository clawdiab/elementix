# Elementix

[![CI](https://github.com/clawdiab/elementix/actions/workflows/ci.yml/badge.svg)](https://github.com/clawdiab/elementix/actions/workflows/ci.yml)

A Radix-inspired Web Components design system built with TypeScript, Lit, Vite, and Vitest.

## Documentation

- **Storybook**: https://clawdiab.github.io/elementix/
- **Live Demo**: https://clawdiab.github.io/elementix/demo.html

## Components

| Component | Tag | Description |
|-----------|-----|-------------|
| Button | `<elx-button>` | Button with variants, sizes, and states |
| Input | `<elx-input>` | Text input with validation states |
| Checkbox | `<elx-checkbox>` | Checkbox with indeterminate support |
| Switch | `<elx-switch>` | Toggle switch component |
| Radio | `<elx-radio>` | Radio button group |
| Badge | `<elx-badge>` | Badge with variants and colors |
| Avatar | `<elx-avatar>` | Avatar with image, fallback, and shapes |
| Card | `<elx-card>` | Card container with variants |
| Alert | `<elx-alert>` | Alert with variants and dismissible |
| Dialog | `<elx-dialog>` | Modal dialog |
| Tabs | `<elx-tabs>` | Tabs with keyboard navigation |
| Tooltip | `<elx-tooltip>` | Tooltip with positioning |
| Select | `<elx-select>` | Dropdown select with search |
| Separator | `<elx-separator>` | Horizontal/vertical divider |
| Accordion | `<elx-accordion>` | Collapsible accordion panels |
| Text | `<elx-text>` | Typography component with semantic variants |

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
