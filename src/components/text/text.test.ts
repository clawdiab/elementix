import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import './text';

describe('elx-text', () => {
  beforeAll(() => {
    expect(customElements.get('elx-text')).toBeDefined();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders with default tag (p)', async () => {
    const el = document.createElement('elx-text');
    document.body.appendChild(el);

    const inner = el.shadowRoot!.querySelector('p');
    expect(inner).toBeTruthy();
  });

  it('renders with different tags', async () => {
    const tags = ['h1', 'h2', 'h3', 'h4', 'span', 'small'] as const;

    for (const tag of tags) {
      document.body.innerHTML = '';
      const el = document.createElement('elx-text');
      el.setAttribute('as', tag);
      document.body.appendChild(el);

      const inner = el.shadowRoot!.querySelector(tag);
      expect(inner, `expected <${tag}> to be rendered`).toBeTruthy();
    }
  });

  it('applies size prop correctly', async () => {
    const el = document.createElement('elx-text');
    el.setAttribute('size', 'xl');
    document.body.appendChild(el);

    const inner = el.shadowRoot!.querySelector('p');
    expect(inner!.style.fontSize).toBe('var(--elx-font-size-xl)');
  });

  it('applies weight prop correctly', async () => {
    const el = document.createElement('elx-text');
    el.setAttribute('weight', 'bold');
    document.body.appendChild(el);

    const inner = el.shadowRoot!.querySelector('p');
    expect(inner!.style.fontWeight).toBe('var(--elx-font-weight-bold)');
  });

  it('applies color prop correctly', async () => {
    const colorMap: Record<string, string> = {
      default: 'var(--elx-color-neutral-900)',
      muted: 'var(--elx-color-neutral-500)',
      primary: 'var(--elx-color-primary-600)',
      danger: 'var(--elx-color-danger-600)',
      success: 'var(--elx-color-success-600)',
    };

    for (const [color, cssVar] of Object.entries(colorMap)) {
      document.body.innerHTML = '';
      const el = document.createElement('elx-text');
      el.setAttribute('color', color);
      document.body.appendChild(el);

      const inner = el.shadowRoot!.querySelector('p');
      expect(inner!.style.color, `color="${color}" should map to ${cssVar}`).toBe(cssVar);
    }
  });

  it('applies align prop correctly', async () => {
    const el = document.createElement('elx-text');
    el.setAttribute('align', 'center');
    document.body.appendChild(el);

    const inner = el.shadowRoot!.querySelector('p');
    expect(inner!.style.textAlign).toBe('center');
  });

  it('renders slot content', async () => {
    const el = document.createElement('elx-text');
    el.textContent = 'Hello world';
    document.body.appendChild(el);

    const slot = el.shadowRoot!.querySelector('slot');
    expect(slot).toBeTruthy();
  });

  it('defaults h1-h4 weight to semibold', async () => {
    for (const tag of ['h1', 'h2', 'h3', 'h4'] as const) {
      document.body.innerHTML = '';
      const el = document.createElement('elx-text');
      el.setAttribute('as', tag);
      document.body.appendChild(el);

      const inner = el.shadowRoot!.querySelector(tag);
      expect(inner!.style.fontWeight, `${tag} should default to semibold`).toBe('var(--elx-font-weight-semibold)');
    }
  });

  it('defaults size based on as prop', async () => {
    const sizeMap: Record<string, string> = {
      h1: '4xl',
      h2: '3xl',
      h3: '2xl',
      h4: 'xl',
      p: 'base',
      span: 'base',
      small: 'sm',
    };

    for (const [tag, size] of Object.entries(sizeMap)) {
      document.body.innerHTML = '';
      const el = document.createElement('elx-text');
      el.setAttribute('as', tag);
      document.body.appendChild(el);

      const inner = el.shadowRoot!.querySelector(tag) as HTMLElement;
      expect(inner!.style.fontSize, `as="${tag}" should default to size ${size}`).toBe(`var(--elx-font-size-${size})`);
    }
  });

  it('ignores invalid as values', async () => {
    const el = document.createElement('elx-text');
    el.setAttribute('as', '<script>alert(1)</script>');
    document.body.appendChild(el);

    const inner = el.shadowRoot!.querySelector('p');
    expect(inner).toBeTruthy();
  });

  it('updates when attributes change', async () => {
    const el = document.createElement('elx-text');
    document.body.appendChild(el);

    el.setAttribute('as', 'h1');
    const h1 = el.shadowRoot!.querySelector('h1');
    expect(h1).toBeTruthy();

    el.setAttribute('color', 'danger');
    const inner = el.shadowRoot!.querySelector('h1');
    expect(inner!.style.color).toBe('var(--elx-color-danger-600)');
  });
});
