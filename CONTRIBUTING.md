# Contributing to Elementix

Thanks for your interest in contributing! This document will help you get started.

## Development Setup

1. Fork and clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── components/          # Web Components
│   ├── button/
│   │   ├── button.ts       # Component implementation
│   │   ├── button.test.ts  # Vitest tests
│   │   └── button.stories.ts # Storybook stories
│   └── ...
└── index.ts             # Exports all components
```

## Component Guidelines

### Naming Convention
- Component class: `ElxComponentName`
- Custom element tag: `elx-component-name`
- File: `component-name.ts`

### Implementation Pattern
```typescript
export class ElxExample extends HTMLElement {
  static observedAttributes = ['value'];
  
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  
  connectedCallback() {
    this._buildDom();
  }
  
  // ... rest of implementation
}

if (!customElements.get('elx-example')) {
  customElements.define('elx-example', ElxExample);
}
```

### Security Best Practices
- Use `textContent` instead of `innerHTML` for user content
- Validate attribute values against whitelists
- Use DOM APIs for element creation
- Never inject untrusted HTML

### Accessibility Requirements
- Include appropriate ARIA attributes
- Support keyboard navigation
- Ensure focus management
- Test with screen readers

## Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

### Test Requirements
- All new components must have tests
- Aim for high coverage of public API
- Test accessibility attributes
- Test keyboard interactions

## Storybook

Start Storybook:
```bash
npm run storybook
```

Build Storybook:
```bash
npm run build-storybook
```

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Ensure all tests pass: `npm test`
4. Build succeeds: `npm run build`
5. Create a pull request
6. Wait for CI to pass and code review

### Commit Messages
Use conventional commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `test:` - Adding tests
- `refactor:` - Code refactoring
- `ci:` - CI/CD changes

## Code Style

- Use TypeScript for all source files
- Format code with consistent indentation (2 spaces)
- Use meaningful variable and function names
- Add JSDoc comments for public APIs

## Questions?

Open an issue on GitHub for bugs, features, or questions.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
