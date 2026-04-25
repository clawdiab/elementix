# Contributing to Elementix

Thanks for your interest in contributing! Here's how to get started.

## Development Setup

```bash
# Clone the repo
git clone https://github.com/clawdiab/elementix.git
cd elementix

# Install dependencies
npm install
```

## Common Commands

```bash
# Run tests
npm test

# Run Storybook
npm run storybook

# Build for production
npm run build

# Start dev server
npm run dev
```

## Component Structure

Each component lives in its own directory under `src/components/`:

```
src/components/my-component/
├── my-component.ts        # Component implementation
├── my-component.test.ts   # Tests
└── my-component.stories.ts # Storybook stories
```

Components are built with [Lit](https://lit.dev/) and use CSS custom properties from `src/theme.css` for theming tokens.

## TDD Workflow

We follow a test-driven development approach:

1. Write a failing test for the new behavior
2. Implement the minimal code to make the test pass
3. Refactor while keeping tests green
4. Repeat

Run tests in watch mode during development:

```bash
npm run test:watch
```

## Pull Request Requirements

- All CI checks must pass (lint, tests, build)
- Include tests for new components or features
- Update Storybook stories if adding/changing UI
- Follow existing code style and naming conventions
- Use theme CSS variables from `src/theme.css` rather than hardcoded values

## Theming

All design tokens (colors, typography, radii) are defined as CSS custom properties in `src/theme.css`. When building or modifying components, always reference these variables instead of hardcoding values. This ensures consistent theming and allows consumers to customize the design system.
