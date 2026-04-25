import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import './popover';

describe('elx-popover', () => {
  beforeAll(() => {
    expect(customElements.get('elx-popover')).toBeDefined();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders with shadow DOM', () => {
    const el = document.createElement('elx-popover');
    document.body.appendChild(el);
    expect(el.shadowRoot).toBeTruthy();
  });

  it('is closed by default', () => {
    const el = document.createElement('elx-popover');
    document.body.appendChild(el);
    expect(el.hasAttribute('open')).toBe(false);
  });

  it('opens when show() is called', () => {
    const el = document.createElement('elx-popover') as any;
    document.body.appendChild(el);
    el.show();
    expect(el.hasAttribute('open')).toBe(true);
  });

  it('closes when hide() is called', () => {
    const el = document.createElement('elx-popover') as any;
    document.body.appendChild(el);
    el.show();
    el.hide();
    expect(el.hasAttribute('open')).toBe(false);
  });

  it('toggles open state', () => {
    const el = document.createElement('elx-popover') as any;
    document.body.appendChild(el);
    el.toggle();
    expect(el.hasAttribute('open')).toBe(true);
    el.toggle();
    expect(el.hasAttribute('open')).toBe(false);
  });

  it('does not open when disabled', () => {
    const el = document.createElement('elx-popover') as any;
    el.disabled = true;
    document.body.appendChild(el);
    el.show();
    expect(el.hasAttribute('open')).toBe(false);
  });

  it('closes when clicking outside', () => {
    const el = document.createElement('elx-popover') as any;
    document.body.appendChild(el);
    el.show();
    expect(el.hasAttribute('open')).toBe(true);
    document.body.click();
    expect(el.hasAttribute('open')).toBe(false);
  });

  it('closes on Escape key', () => {
    const el = document.createElement('elx-popover') as any;
    document.body.appendChild(el);
    el.show();
    expect(el.hasAttribute('open')).toBe(true);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(el.hasAttribute('open')).toBe(false);
  });

  it('has correct ARIA attributes on content', () => {
    const el = document.createElement('elx-popover');
    document.body.appendChild(el);
    const content = el.shadowRoot!.querySelector('.content');
    expect(content!.getAttribute('role')).toBe('dialog');
    expect(content!.getAttribute('aria-modal')).toBe('false');
    expect(content!.getAttribute('aria-hidden')).toBe('true');
  });

  it('updates aria-hidden when opened', () => {
    const el = document.createElement('elx-popover') as any;
    document.body.appendChild(el);
    el.show();
    const content = el.shadowRoot!.querySelector('.content');
    expect(content!.getAttribute('aria-hidden')).toBe('false');
  });

  it('sets aria-haspopup and aria-expanded on trigger', () => {
    const el = document.createElement('elx-popover') as any;
    const btn = document.createElement('button');
    btn.slot = 'trigger';
    el.appendChild(btn);
    document.body.appendChild(el);
    expect(btn.getAttribute('aria-haspopup')).toBe('dialog');
    expect(btn.getAttribute('aria-expanded')).toBe('false');
    el.show();
    expect(btn.getAttribute('aria-expanded')).toBe('true');
  });

  it('dispatches open and close events', () => {
    const el = document.createElement('elx-popover') as any;
    document.body.appendChild(el);
    const openHandler = vi.fn();
    const closeHandler = vi.fn();
    el.addEventListener('open', openHandler);
    el.addEventListener('close', closeHandler);
    el.show();
    expect(openHandler).toHaveBeenCalled();
    el.hide();
    expect(closeHandler).toHaveBeenCalled();
  });

  it('defaults to bottom position', () => {
    const el = document.createElement('elx-popover') as any;
    document.body.appendChild(el);
    expect(el.position).toBe('bottom');
  });

  it('applies position attribute', () => {
    const el = document.createElement('elx-popover') as any;
    el.position = 'top';
    document.body.appendChild(el);
    expect(el.position).toBe('top');
    const content = el.shadowRoot!.querySelector('.content') as HTMLElement;
    expect(content.style.bottom).toBe('100%');
  });
});
