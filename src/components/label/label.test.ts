import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import './label';

describe('elx-label', () => {
  beforeAll(() => {
    expect(customElements.get('elx-label')).toBeDefined();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders with shadow DOM', () => {
    const el = document.createElement('elx-label');
    document.body.appendChild(el);
    expect(el.shadowRoot).toBeTruthy();
  });

  it('renders slot content', () => {
    const el = document.createElement('elx-label');
    el.textContent = 'Email';
    document.body.appendChild(el);
    const slot = el.shadowRoot!.querySelector('slot');
    expect(slot).toBeTruthy();
  });

  it('sets for attribute on host', () => {
    const el = document.createElement('elx-label') as any;
    el.for = 'my-input';
    document.body.appendChild(el);
    expect(el.getAttribute('for')).toBe('my-input');
  });

  it('removes for attribute when empty', () => {
    const el = document.createElement('elx-label') as any;
    el.for = 'test';
    document.body.appendChild(el);
    el.for = '';
    expect(el.hasAttribute('for')).toBe(false);
  });

  it('shows required indicator when required', () => {
    const el = document.createElement('elx-label') as any;
    el.required = true;
    document.body.appendChild(el);
    const asterisk = el.shadowRoot!.querySelector('.required-indicator') as HTMLElement;
    expect(asterisk.style.display).toBe('inline');
  });

  it('hides required indicator when not required', () => {
    const el = document.createElement('elx-label') as any;
    document.body.appendChild(el);
    const asterisk = el.shadowRoot!.querySelector('.required-indicator') as HTMLElement;
    expect(asterisk.style.display).toBe('none');
  });

  it('required indicator has aria-hidden', () => {
    const el = document.createElement('elx-label') as any;
    el.required = true;
    document.body.appendChild(el);
    const asterisk = el.shadowRoot!.querySelector('.required-indicator');
    expect(asterisk!.getAttribute('aria-hidden')).toBe('true');
  });

  it('applies size class', () => {
    const el = document.createElement('elx-label') as any;
    el.size = 'lg';
    document.body.appendChild(el);
    const textSpan = el.shadowRoot!.querySelector('.label-text');
    expect(textSpan!.classList.contains('lg')).toBe(true);
  });

  it('defaults to md size', () => {
    const el = document.createElement('elx-label') as any;
    document.body.appendChild(el);
    expect(el.size).toBe('md');
    const textSpan = el.shadowRoot!.querySelector('.label-text');
    expect(textSpan!.classList.contains('md')).toBe(true);
  });

  it('applies disabled state', () => {
    const el = document.createElement('elx-label') as any;
    el.disabled = true;
    document.body.appendChild(el);
    expect(el.hasAttribute('disabled')).toBe(true);
  });

  it('toggles disabled', () => {
    const el = document.createElement('elx-label') as any;
    el.disabled = true;
    document.body.appendChild(el);
    expect(el.disabled).toBe(true);
    el.disabled = false;
    expect(el.hasAttribute('disabled')).toBe(false);
  });

  it('has span wrapper inside shadow DOM (not label element)', () => {
    const el = document.createElement('elx-label');
    document.body.appendChild(el);
    const label = el.shadowRoot!.querySelector('label');
    expect(label).toBeNull();
    const wrapper = el.shadowRoot!.querySelector('.label-wrapper');
    expect(wrapper).toBeTruthy();
  });

  it('property getters return correct defaults', () => {
    const el = document.createElement('elx-label') as any;
    document.body.appendChild(el);
    expect(el.for).toBe('');
    expect(el.required).toBe(false);
    expect(el.disabled).toBe(false);
    expect(el.size).toBe('md');
  });

  it('toggles required indicator dynamically', () => {
    const el = document.createElement('elx-label') as any;
    document.body.appendChild(el);
    const asterisk = el.shadowRoot!.querySelector('.required-indicator') as HTMLElement;
    expect(asterisk.style.display).toBe('none');
    el.required = true;
    expect(asterisk.style.display).toBe('inline');
    el.required = false;
    expect(asterisk.style.display).toBe('none');
  });

  it('clicking label with for attribute focuses target input', () => {
    const input = document.createElement('input');
    input.id = 'target-input';
    document.body.appendChild(input);

    const el = document.createElement('elx-label') as any;
    el.for = 'target-input';
    el.textContent = 'Label';
    document.body.appendChild(el);

    el.click();
    expect(document.activeElement).toBe(input);
  });

  it('clicking label without for does not throw', () => {
    const el = document.createElement('elx-label') as any;
    el.textContent = 'Label';
    document.body.appendChild(el);

    expect(() => el.click()).not.toThrow();
  });
});
