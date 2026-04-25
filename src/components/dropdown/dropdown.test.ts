import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import './dropdown';

describe('elx-dropdown', () => {
  beforeAll(() => {
    expect(customElements.get('elx-dropdown')).toBeDefined();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders with shadow DOM', () => {
    const el = document.createElement('elx-dropdown');
    document.body.appendChild(el);
    expect(el.shadowRoot).toBeTruthy();
  });

  it('is closed by default', () => {
    const el = document.createElement('elx-dropdown');
    document.body.appendChild(el);
    expect(el.hasAttribute('open')).toBe(false);
  });

  it('opens when show() is called', () => {
    const el = document.createElement('elx-dropdown') as any;
    document.body.appendChild(el);
    el.show();
    expect(el.hasAttribute('open')).toBe(true);
  });

  it('closes when hide() is called', () => {
    const el = document.createElement('elx-dropdown') as any;
    document.body.appendChild(el);
    el.show();
    el.hide();
    expect(el.hasAttribute('open')).toBe(false);
  });

  it('toggles open state', () => {
    const el = document.createElement('elx-dropdown') as any;
    document.body.appendChild(el);
    el.toggle();
    expect(el.hasAttribute('open')).toBe(true);
    el.toggle();
    expect(el.hasAttribute('open')).toBe(false);
  });

  it('does not open when disabled', () => {
    const el = document.createElement('elx-dropdown') as any;
    el.disabled = true;
    document.body.appendChild(el);
    el.show();
    expect(el.hasAttribute('open')).toBe(false);
  });

  it('closes when clicking outside', () => {
    const el = document.createElement('elx-dropdown') as any;
    document.body.appendChild(el);
    el.show();
    expect(el.hasAttribute('open')).toBe(true);
    document.body.click();
    expect(el.hasAttribute('open')).toBe(false);
  });

  it('closes on Escape key', () => {
    const el = document.createElement('elx-dropdown') as any;
    document.body.appendChild(el);
    el.show();
    expect(el.hasAttribute('open')).toBe(true);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(el.hasAttribute('open')).toBe(false);
  });

  it('has correct ARIA attributes on menu', () => {
    const el = document.createElement('elx-dropdown');
    document.body.appendChild(el);
    const menu = el.shadowRoot!.querySelector('.menu');
    expect(menu!.getAttribute('role')).toBe('menu');
    expect(menu!.getAttribute('aria-orientation')).toBe('vertical');
    expect(menu!.getAttribute('aria-hidden')).toBe('true');
  });

  it('updates aria-hidden when opened', () => {
    const el = document.createElement('elx-dropdown') as any;
    document.body.appendChild(el);
    el.show();
    const menu = el.shadowRoot!.querySelector('.menu');
    expect(menu!.getAttribute('aria-hidden')).toBe('false');
  });
});

describe('elx-dropdown-item', () => {
  beforeAll(() => {
    expect(customElements.get('elx-dropdown-item')).toBeDefined();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders with shadow DOM', () => {
    const el = document.createElement('elx-dropdown-item');
    document.body.appendChild(el);
    expect(el.shadowRoot).toBeTruthy();
  });

  it('has menuitem role', () => {
    const el = document.createElement('elx-dropdown-item');
    document.body.appendChild(el);
    const item = el.shadowRoot!.querySelector('.item');
    expect(item!.getAttribute('role')).toBe('menuitem');
  });

  it('dispatches select event on click', () => {
    const el = document.createElement('elx-dropdown-item') as any;
    document.body.appendChild(el);
    const handler = vi.fn();
    el.addEventListener('select', handler);
    el.click();
    expect(handler).toHaveBeenCalled();
  });

  it('does not dispatch select when disabled', () => {
    const el = document.createElement('elx-dropdown-item') as any;
    el.disabled = true;
    document.body.appendChild(el);
    const handler = vi.fn();
    el.addEventListener('select', handler);
    el.click();
    expect(handler).not.toHaveBeenCalled();
  });

  it('dispatches select on Enter key', () => {
    const el = document.createElement('elx-dropdown-item') as any;
    document.body.appendChild(el);
    const handler = vi.fn();
    el.addEventListener('select', handler);
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(handler).toHaveBeenCalled();
  });

  it('dispatches select on Space key', () => {
    const el = document.createElement('elx-dropdown-item') as any;
    document.body.appendChild(el);
    const handler = vi.fn();
    el.addEventListener('select', handler);
    el.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    expect(handler).toHaveBeenCalled();
  });

  it('closes parent dropdown on select', () => {
    const dropdown = document.createElement('elx-dropdown') as any;
    const item = document.createElement('elx-dropdown-item') as any;
    dropdown.appendChild(item);
    document.body.appendChild(dropdown);
    dropdown.show();
    expect(dropdown.hasAttribute('open')).toBe(true);
    item.click();
    expect(dropdown.hasAttribute('open')).toBe(false);
  });

  it('has aria-disabled attribute when disabled', () => {
    const el = document.createElement('elx-dropdown-item') as any;
    el.disabled = true;
    document.body.appendChild(el);
    const item = el.shadowRoot!.querySelector('.item');
    expect(item!.getAttribute('aria-disabled')).toBe('true');
  });
});
