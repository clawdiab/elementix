import { describe, it, expect, beforeAll } from 'vitest';
import './button';

describe('elx-button', () => {
  beforeAll(() => {
    // Ensure custom element is registered
    expect(customElements.get('elx-button')).toBeDefined();
  });

  it('renders with default props', async () => {
    const el = document.createElement('elx-button');
    document.body.appendChild(el);

    const button = el.shadowRoot!.querySelector('button');
    expect(button).toBeTruthy();
    expect(button!.classList.contains('primary')).toBe(true);
    expect(button!.classList.contains('md')).toBe(true);

    el.remove();
  });

  it('renders slot content', async () => {
    const el = document.createElement('elx-button');
    el.textContent = 'Click me';
    document.body.appendChild(el);

    const slot = el.shadowRoot!.querySelector('slot');
    expect(slot).toBeTruthy();

    el.remove();
  });

  it('applies variant attribute', async () => {
    const el = document.createElement('elx-button');
    el.setAttribute('variant', 'danger');
    document.body.appendChild(el);

    const button = el.shadowRoot!.querySelector('button');
    expect(button!.classList.contains('danger')).toBe(true);

    el.remove();
  });

  it('applies size attribute', async () => {
    const el = document.createElement('elx-button');
    el.setAttribute('size', 'lg');
    document.body.appendChild(el);

    const button = el.shadowRoot!.querySelector('button');
    expect(button!.classList.contains('lg')).toBe(true);

    el.remove();
  });

  it('handles disabled state', async () => {
    const el = document.createElement('elx-button');
    el.setAttribute('disabled', '');
    document.body.appendChild(el);

    const button = el.shadowRoot!.querySelector('button');
    expect(button!.disabled).toBe(true);
    expect(button!.getAttribute('aria-disabled')).toBe('true');

    el.remove();
  });

  it('updates when attributes change', async () => {
    const el = document.createElement('elx-button');
    document.body.appendChild(el);

    let button = el.shadowRoot!.querySelector('button');
    expect(button!.classList.contains('primary')).toBe(true);

    el.setAttribute('variant', 'secondary');
    button = el.shadowRoot!.querySelector('button');
    expect(button!.classList.contains('secondary')).toBe(true);

    el.remove();
  });
});
