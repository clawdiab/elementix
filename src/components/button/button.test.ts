import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import './button';

describe('elx-button', () => {
  beforeAll(() => {
    expect(customElements.get('elx-button')).toBeDefined();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders with default props', async () => {
    const el = document.createElement('elx-button');
    document.body.appendChild(el);

    const button = el.shadowRoot!.querySelector('button');
    expect(button).toBeTruthy();
    expect(button!.classList.contains('primary')).toBe(true);
    expect(button!.classList.contains('md')).toBe(true);
  });

  it('renders slot content', async () => {
    const el = document.createElement('elx-button');
    el.textContent = 'Click me';
    document.body.appendChild(el);

    const slot = el.shadowRoot!.querySelector('slot');
    expect(slot).toBeTruthy();
  });

  it('applies variant attribute', async () => {
    const el = document.createElement('elx-button');
    el.setAttribute('variant', 'danger');
    document.body.appendChild(el);

    const button = el.shadowRoot!.querySelector('button');
    expect(button!.classList.contains('danger')).toBe(true);
  });

  it('applies size attribute', async () => {
    const el = document.createElement('elx-button');
    el.setAttribute('size', 'lg');
    document.body.appendChild(el);

    const button = el.shadowRoot!.querySelector('button');
    expect(button!.classList.contains('lg')).toBe(true);
  });

  it('handles disabled state', async () => {
    const el = document.createElement('elx-button');
    el.setAttribute('disabled', '');
    document.body.appendChild(el);

    const button = el.shadowRoot!.querySelector('button');
    expect(button!.disabled).toBe(true);
    expect(button!.getAttribute('aria-disabled')).toBe('true');
  });

  it('updates when attributes change', async () => {
    const el = document.createElement('elx-button');
    document.body.appendChild(el);

    let button = el.shadowRoot!.querySelector('button');
    expect(button!.classList.contains('primary')).toBe(true);

    el.setAttribute('variant', 'secondary');
    button = el.shadowRoot!.querySelector('button');
    expect(button!.classList.contains('secondary')).toBe(true);
  });

  // Security tests
  it('ignores invalid variant values (XSS protection)', async () => {
    const el = document.createElement('elx-button');
    el.setAttribute('variant', '<script>alert(1)</script>');
    document.body.appendChild(el);

    const button = el.shadowRoot!.querySelector('button');
    // Should fall back to default 'primary' since value is invalid
    expect(button!.classList.contains('primary')).toBe(true);
    expect(button!.classList.contains('<script>alert(1)</script>')).toBe(false);
  });

  it('ignores invalid size values', async () => {
    const el = document.createElement('elx-button');
    el.setAttribute('size', 'malicious-class');
    document.body.appendChild(el);

    const button = el.shadowRoot!.querySelector('button');
    expect(button!.classList.contains('md')).toBe(true);
    expect(button!.classList.contains('malicious-class')).toBe(false);
  });

  // Form behavior test
  it('has type="button" by default to prevent form submission', async () => {
    const el = document.createElement('elx-button');
    document.body.appendChild(el);

    const button = el.shadowRoot!.querySelector('button');
    expect(button!.type).toBe('button');
  });

  // Focus-visible test
  it('has focus-visible styles defined', async () => {
    const el = document.createElement('elx-button');
    document.body.appendChild(el);

    const style = el.shadowRoot!.querySelector('style');
    expect(style!.textContent).toContain(':focus-visible');
  });

  // DOM stability test
  it('preserves button element across attribute changes', async () => {
    const el = document.createElement('elx-button');
    document.body.appendChild(el);

    const button1 = el.shadowRoot!.querySelector('button');
    el.setAttribute('variant', 'danger');
    el.setAttribute('size', 'lg');

    const button2 = el.shadowRoot!.querySelector('button');
    expect(button1).toBe(button2); // Same reference, not recreated
  });
});
