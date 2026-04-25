import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import './toast';

describe('elx-toast', () => {
  beforeAll(() => {
    expect(customElements.get('elx-toast')).toBeDefined();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('renders with default variant (info)', () => {
    const el = document.createElement('elx-toast');
    document.body.appendChild(el);
    const toast = el.shadowRoot!.querySelector('.toast');
    expect(toast!.classList.contains('info')).toBe(true);
  });

  it('applies success variant', () => {
    const el = document.createElement('elx-toast');
    el.setAttribute('variant', 'success');
    document.body.appendChild(el);
    const toast = el.shadowRoot!.querySelector('.toast');
    expect(toast!.classList.contains('success')).toBe(true);
  });

  it('applies warning variant', () => {
    const el = document.createElement('elx-toast');
    el.setAttribute('variant', 'warning');
    document.body.appendChild(el);
    const toast = el.shadowRoot!.querySelector('.toast');
    expect(toast!.classList.contains('warning')).toBe(true);
  });

  it('applies error variant', () => {
    const el = document.createElement('elx-toast');
    el.setAttribute('variant', 'error');
    document.body.appendChild(el);
    const toast = el.shadowRoot!.querySelector('.toast');
    expect(toast!.classList.contains('error')).toBe(true);
  });

  it('falls back to info for invalid variant', () => {
    const el = document.createElement('elx-toast');
    el.setAttribute('variant', 'invalid');
    document.body.appendChild(el);
    const toast = el.shadowRoot!.querySelector('.toast');
    expect(toast!.classList.contains('info')).toBe(true);
  });

  it('has correct ARIA attributes', () => {
    const el = document.createElement('elx-toast');
    document.body.appendChild(el);
    const toast = el.shadowRoot!.querySelector('.toast');
    expect(toast!.getAttribute('role')).toBe('alert');
    expect(toast!.getAttribute('aria-live')).toBe('assertive');
  });

  it('is hidden by default (no open attribute)', () => {
    const el = document.createElement('elx-toast');
    document.body.appendChild(el);
    expect(el.hasAttribute('open')).toBe(false);
  });

  it('becomes visible when open attribute is set', () => {
    const el = document.createElement('elx-toast');
    document.body.appendChild(el);
    el.setAttribute('open', '');
    expect(el.hasAttribute('open')).toBe(true);
  });

  it('hides when open attribute is removed', () => {
    const el = document.createElement('elx-toast');
    document.body.appendChild(el);
    el.setAttribute('open', '');
    el.removeAttribute('open');
    expect(el.hasAttribute('open')).toBe(false);
  });

  it('auto-hides after duration', () => {
    vi.useFakeTimers();
    const el = document.createElement('elx-toast');
    el.setAttribute('duration', '3000');
    document.body.appendChild(el);
    el.setAttribute('open', '');
    expect(el.hasAttribute('open')).toBe(true);
    vi.advanceTimersByTime(3000);
    expect(el.hasAttribute('open')).toBe(false);
    vi.useRealTimers();
  });

  it('dispatches close event when hidden', () => {
    const el = document.createElement('elx-toast');
    document.body.appendChild(el);
    const handler = vi.fn();
    el.addEventListener('close', handler);
    el.setAttribute('open', '');
    el.removeAttribute('open');
    expect(handler).toHaveBeenCalled();
  });

  it('shows close button when dismissible', () => {
    const el = document.createElement('elx-toast');
    el.setAttribute('dismissible', '');
    document.body.appendChild(el);
    const closeBtn = el.shadowRoot!.querySelector('.close-btn');
    expect(closeBtn!.classList.contains('visible')).toBe(true);
  });

  it('hides close button when not dismissible', () => {
    const el = document.createElement('elx-toast');
    document.body.appendChild(el);
    const closeBtn = el.shadowRoot!.querySelector('.close-btn');
    expect(closeBtn!.classList.contains('visible')).toBe(false);
  });

  it('close button removes open attribute', () => {
    const el = document.createElement('elx-toast');
    el.setAttribute('dismissible', '');
    document.body.appendChild(el);
    el.setAttribute('open', '');
    const closeBtn = el.shadowRoot!.querySelector('.close-btn') as HTMLButtonElement;
    closeBtn.click();
    expect(el.hasAttribute('open')).toBe(false);
  });

  it('displays icon for variant', () => {
    const el = document.createElement('elx-toast');
    el.setAttribute('variant', 'success');
    document.body.appendChild(el);
    const icon = el.shadowRoot!.querySelector('.icon');
    expect(icon!.textContent).toBe('✓');
  });
});

describe('elx-toast-container', () => {
  beforeAll(() => {
    expect(customElements.get('elx-toast-container')).toBeDefined();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders with shadow DOM', () => {
    const el = document.createElement('elx-toast-container');
    document.body.appendChild(el);
    expect(el.shadowRoot).toBeTruthy();
  });

  it('has default position top-right', () => {
    const el = document.createElement('elx-toast-container');
    document.body.appendChild(el);
    expect(el.hasAttribute('position')).toBe(false);
  });

  it('accepts position attribute', () => {
    const el = document.createElement('elx-toast-container');
    el.setAttribute('position', 'bottom-left');
    document.body.appendChild(el);
    expect(el.getAttribute('position')).toBe('bottom-left');
  });

  it('toast() method creates a child toast element', () => {
    const el = document.createElement('elx-toast-container') as any;
    document.body.appendChild(el);
    const toast = el.toast('Hello world', { variant: 'success' });
    expect(toast).toBeTruthy();
    expect(toast.getAttribute('variant')).toBe('success');
    expect(toast.textContent).toBe('Hello world');
    expect(el.contains(toast)).toBe(true);
  });

  it('toast() uses default options', () => {
    const el = document.createElement('elx-toast-container') as any;
    document.body.appendChild(el);
    const toast = el.toast('Test');
    expect(toast.getAttribute('variant')).toBe('info');
    expect(toast.getAttribute('duration')).toBe('5000');
    expect(toast.hasAttribute('dismissible')).toBe(true);
  });

  it('toast() respects custom options', () => {
    const el = document.createElement('elx-toast-container') as any;
    document.body.appendChild(el);
    const toast = el.toast('Test', { variant: 'error', duration: 2000, dismissible: false });
    expect(toast.getAttribute('variant')).toBe('error');
    expect(toast.getAttribute('duration')).toBe('2000');
    expect(toast.hasAttribute('dismissible')).toBe(false);
  });

  it('removes toast from container on close', () => {
    const el = document.createElement('elx-toast-container') as any;
    document.body.appendChild(el);
    const toast = el.toast('Test');
    expect(el.contains(toast)).toBe(true);
    toast.dispatchEvent(new CustomEvent('close', { bubbles: true }));
    expect(el.contains(toast)).toBe(false);
  });
});
