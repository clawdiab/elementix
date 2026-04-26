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

  it('sets for attribute on inner label', () => {
    const el = document.createElement('elx-label') as any;
    el.for = 'my-input';
    document.body.appendChild(el);
    const label = el.shadowRoot!.querySelector('label');
    expect(label!.getAttribute('for')).toBe('my-input');
  });

  it('removes for attribute when empty', () => {
    const el = document.createElement('elx-label') as any;
    el.for = 'test';
    document.body.appendChild(el);
    el.for = '';
    el.removeAttribute('for');
    const label = el.shadowRoot!.querySelector('label');
    expect(label!.hasAttribute('for')).toBe(false);
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
    const label = el.shadowRoot!.querySelector('.label');
    expect(label!.classList.contains('lg')).toBe(true);
  });

  it('defaults to md size', () => {
    const el = document.createElement('elx-label') as any;
    document.body.appendChild(el);
    expect(el.size).toBe('md');
    const label = el.shadowRoot!.querySelector('.label');
    expect(label!.classList.contains('md')).toBe(true);
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

  it('has label element inside shadow DOM', () => {
    const el = document.createElement('elx-label');
    document.body.appendChild(el);
    const label = el.shadowRoot!.querySelector('label');
    expect(label).toBeTruthy();
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
});
