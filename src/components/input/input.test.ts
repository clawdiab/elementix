import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import './input';

describe('elx-input', () => {
  beforeAll(() => {
    expect(customElements.get('elx-input')).toBeDefined();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders with default props', async () => {
    const el = document.createElement('elx-input');
    document.body.appendChild(el);

    const input = el.shadowRoot!.querySelector('input');
    expect(input).toBeTruthy();
    expect(input!.type).toBe('text');
    expect(input!.classList.contains('md')).toBe(true);
  });

  it('applies type attribute', async () => {
    const el = document.createElement('elx-input');
    el.setAttribute('type', 'password');
    document.body.appendChild(el);

    const input = el.shadowRoot!.querySelector('input');
    expect(input!.type).toBe('password');
  });

  it('applies size attribute', async () => {
    const el = document.createElement('elx-input');
    el.setAttribute('size', 'lg');
    document.body.appendChild(el);

    const input = el.shadowRoot!.querySelector('input');
    expect(input!.classList.contains('lg')).toBe(true);
  });

  it('handles disabled state', async () => {
    const el = document.createElement('elx-input');
    el.setAttribute('disabled', '');
    document.body.appendChild(el);

    const input = el.shadowRoot!.querySelector('input');
    expect(input!.disabled).toBe(true);
  });

  it('handles readonly state', async () => {
    const el = document.createElement('elx-input');
    el.setAttribute('readonly', '');
    document.body.appendChild(el);

    const input = el.shadowRoot!.querySelector('input');
    expect(input!.readOnly).toBe(true);
  });

  it('handles required state', async () => {
    const el = document.createElement('elx-input');
    el.setAttribute('required', '');
    document.body.appendChild(el);

    const input = el.shadowRoot!.querySelector('input');
    expect(input!.required).toBe(true);
  });

  it('handles error state', async () => {
    const el = document.createElement('elx-input');
    el.setAttribute('error', '');
    document.body.appendChild(el);

    const input = el.shadowRoot!.querySelector('input');
    expect(input!.classList.contains('error')).toBe(true);
  });

  it('sets placeholder', async () => {
    const el = document.createElement('elx-input');
    el.setAttribute('placeholder', 'Enter text');
    document.body.appendChild(el);

    const input = el.shadowRoot!.querySelector('input');
    expect(input!.placeholder).toBe('Enter text');
  });

  it('sets name attribute', async () => {
    const el = document.createElement('elx-input');
    el.setAttribute('name', 'email');
    document.body.appendChild(el);

    const input = el.shadowRoot!.querySelector('input');
    expect(input!.name).toBe('email');
  });

  it('sets value', async () => {
    const el = document.createElement('elx-input');
    el.setAttribute('value', 'test@example.com');
    document.body.appendChild(el);

    const input = el.shadowRoot!.querySelector('input');
    expect(input!.value).toBe('test@example.com');
  });

  it('shows label when provided', async () => {
    const el = document.createElement('elx-input');
    el.setAttribute('label', 'Email');
    document.body.appendChild(el);

    const label = el.shadowRoot!.querySelector('label');
    expect(label!.style.display).not.toBe('none');
    expect(label!.textContent).toBe('Email');
  });

  it('hides label when not provided', async () => {
    const el = document.createElement('elx-input');
    document.body.appendChild(el);

    const label = el.shadowRoot!.querySelector('label');
    expect(label!.style.display).toBe('none');
  });

  // Security tests
  it('ignores invalid type values', async () => {
    const el = document.createElement('elx-input');
    el.setAttribute('type', 'invalid-type');
    document.body.appendChild(el);

    const input = el.shadowRoot!.querySelector('input');
    expect(input!.type).toBe('text'); // Falls back to default
  });

  it('ignores invalid size values', async () => {
    const el = document.createElement('elx-input');
    el.setAttribute('size', 'invalid-size');
    document.body.appendChild(el);

    const input = el.shadowRoot!.querySelector('input');
    expect(input!.classList.contains('md')).toBe(true); // Falls back to default
  });

  // Event tests
  it('dispatches input event on user input', async () => {
    const el = document.createElement('elx-input');
    document.body.appendChild(el);

    let eventFired = false;
    el.addEventListener('input', (e: any) => {
      eventFired = true;
      expect(e.detail.value).toBe('test');
    });

    const input = el.shadowRoot!.querySelector('input')!;
    input.value = 'test';
    input.dispatchEvent(new Event('input'));

    expect(eventFired).toBe(true);
  });

  it('dispatches change event', async () => {
    const el = document.createElement('elx-input');
    document.body.appendChild(el);

    let eventFired = false;
    el.addEventListener('change', () => {
      eventFired = true;
    });

    const input = el.shadowRoot!.querySelector('input')!;
    input.dispatchEvent(new Event('change'));

    expect(eventFired).toBe(true);
  });

  it('dispatches focus event', async () => {
    const el = document.createElement('elx-input');
    document.body.appendChild(el);

    let eventFired = false;
    el.addEventListener('focus', () => {
      eventFired = true;
    });

    const input = el.shadowRoot!.querySelector('input')!;
    input.dispatchEvent(new Event('focus'));

    expect(eventFired).toBe(true);
  });

  it('dispatches blur event', async () => {
    const el = document.createElement('elx-input');
    document.body.appendChild(el);

    let eventFired = false;
    el.addEventListener('blur', () => {
      eventFired = true;
    });

    const input = el.shadowRoot!.querySelector('input')!;
    input.dispatchEvent(new Event('blur'));

    expect(eventFired).toBe(true);
  });

  // DOM stability
  it('preserves input element across attribute changes', async () => {
    const el = document.createElement('elx-input');
    document.body.appendChild(el);

    const input1 = el.shadowRoot!.querySelector('input');
    el.setAttribute('size', 'lg');
    el.setAttribute('type', 'email');
    el.setAttribute('error', '');

    const input2 = el.shadowRoot!.querySelector('input');
    expect(input1).toBe(input2); // Same reference
  });

  // Focus methods
  it('has focus and blur methods', async () => {
    const el = document.createElement('elx-input');
    document.body.appendChild(el);

    // Verify focus/blur methods exist and don't throw
    expect(typeof el.focus).toBe('function');
    expect(typeof el.blur).toBe('function');
    expect(() => el.focus()).not.toThrow();
    expect(() => el.blur()).not.toThrow();
  });
});
