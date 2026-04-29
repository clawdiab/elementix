import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import './hover-card';

describe('ElxHoverCard', () => {
  beforeAll(() => {
    expect(customElements.get('elx-hover-card')).toBeDefined();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.useRealTimers();
  });

  // === Rendering ===
  it('renders with shadow DOM', () => {
    const el = document.createElement('elx-hover-card');
    document.body.appendChild(el);
    expect(el.shadowRoot).toBeTruthy();
  });

  it('has part="trigger" on trigger wrapper', () => {
    const el = document.createElement('elx-hover-card');
    document.body.appendChild(el);
    const trigger = el.shadowRoot!.querySelector('.trigger');
    expect(trigger!.getAttribute('part')).toBe('trigger');
  });

  it('has part="content" on content wrapper', () => {
    const el = document.createElement('elx-hover-card');
    document.body.appendChild(el);
    const content = el.shadowRoot!.querySelector('.content');
    expect(content!.getAttribute('part')).toBe('content');
  });

  it('does not rebuild DOM on re-connection', () => {
    const el = document.createElement('elx-hover-card');
    document.body.appendChild(el);
    const content = el.shadowRoot!.querySelector('.content');
    document.body.removeChild(el);
    document.body.appendChild(el);
    const contentAfter = el.shadowRoot!.querySelector('.content');
    expect(contentAfter).toBe(content);
  });

  // === Default State ===
  it('is closed by default', () => {
    const el = document.createElement('elx-hover-card');
    document.body.appendChild(el);
    expect(el.hasAttribute('open')).toBe(false);
  });

  it('has default position of bottom', () => {
    const el = document.createElement('elx-hover-card') as any;
    document.body.appendChild(el);
    expect(el.position).toBe('bottom');
  });

  it('has default open-delay of 200ms', () => {
    const el = document.createElement('elx-hover-card') as any;
    document.body.appendChild(el);
    expect(el.openDelay).toBe(200);
  });

  it('has default close-delay of 300ms', () => {
    const el = document.createElement('elx-hover-card') as any;
    document.body.appendChild(el);
    expect(el.closeDelay).toBe(300);
  });

  // === Properties ===
  it('sets position property', () => {
    const el = document.createElement('elx-hover-card') as any;
    el.position = 'top';
    document.body.appendChild(el);
    expect(el.position).toBe('top');
    expect(el.getAttribute('position')).toBe('top');
  });

  it('sets open-delay property', () => {
    const el = document.createElement('elx-hover-card') as any;
    el.openDelay = 500;
    document.body.appendChild(el);
    expect(el.openDelay).toBe(500);
  });

  it('sets close-delay property', () => {
    const el = document.createElement('elx-hover-card') as any;
    el.closeDelay = 400;
    document.body.appendChild(el);
    expect(el.closeDelay).toBe(400);
  });

  it('sets disabled property', () => {
    const el = document.createElement('elx-hover-card') as any;
    el.disabled = true;
    document.body.appendChild(el);
    expect(el.disabled).toBe(true);
    expect(el.hasAttribute('disabled')).toBe(true);
  });

  // === Show/Hide Methods ===
  it('opens when show() is called', () => {
    const el = document.createElement('elx-hover-card') as any;
    document.body.appendChild(el);
    el.show();
    expect(el.hasAttribute('open')).toBe(true);
  });

  it('closes when hide() is called', () => {
    const el = document.createElement('elx-hover-card') as any;
    document.body.appendChild(el);
    el.show();
    el.hide();
    expect(el.hasAttribute('open')).toBe(false);
  });

  it('does not open when disabled', () => {
    const el = document.createElement('elx-hover-card') as any;
    el.disabled = true;
    document.body.appendChild(el);
    el.show();
    expect(el.hasAttribute('open')).toBe(false);
  });

  // === Events ===
  it('dispatches "open" event when shown', () => {
    const el = document.createElement('elx-hover-card') as any;
    document.body.appendChild(el);
    const handler = vi.fn();
    el.addEventListener('open', handler);
    el.show();
    expect(handler).toHaveBeenCalled();
  });

  it('dispatches "close" event when hidden', () => {
    const el = document.createElement('elx-hover-card') as any;
    document.body.appendChild(el);
    el.show();
    const handler = vi.fn();
    el.addEventListener('close', handler);
    el.hide();
    expect(handler).toHaveBeenCalled();
  });

  // === Hover Behavior ===
  it('schedules open on trigger mouseenter', () => {
    vi.useFakeTimers();
    const el = document.createElement('elx-hover-card') as any;
    const btn = document.createElement('button');
    btn.slot = 'trigger';
    el.appendChild(btn);
    document.body.appendChild(el);

    const trigger = el.shadowRoot!.querySelector('.trigger') as HTMLElement;
    trigger.dispatchEvent(new MouseEvent('mouseenter'));
    expect(el.hasAttribute('open')).toBe(false);

    vi.advanceTimersByTime(200);
    expect(el.hasAttribute('open')).toBe(true);
  });

  it('schedules close on trigger mouseleave', () => {
    vi.useFakeTimers();
    const el = document.createElement('elx-hover-card') as any;
    const btn = document.createElement('button');
    btn.slot = 'trigger';
    el.appendChild(btn);
    document.body.appendChild(el);

    el.show();
    const trigger = el.shadowRoot!.querySelector('.trigger') as HTMLElement;
    trigger.dispatchEvent(new MouseEvent('mouseleave'));

    vi.advanceTimersByTime(300);
    expect(el.hasAttribute('open')).toBe(false);
  });

  it('cancels close timer when re-entering content', () => {
    vi.useFakeTimers();
    const el = document.createElement('elx-hover-card') as any;
    const btn = document.createElement('button');
    btn.slot = 'trigger';
    el.appendChild(btn);
    document.body.appendChild(el);

    el.show();
    const content = el.shadowRoot!.querySelector('.content') as HTMLElement;
    content.dispatchEvent(new MouseEvent('mouseleave'));
    content.dispatchEvent(new MouseEvent('mouseenter'));

    vi.advanceTimersByTime(300);
    expect(el.hasAttribute('open')).toBe(true);
  });

  // === Focus Behavior ===
  it('schedules open on trigger focus', () => {
    vi.useFakeTimers();
    const el = document.createElement('elx-hover-card') as any;
    const btn = document.createElement('button');
    btn.slot = 'trigger';
    el.appendChild(btn);
    document.body.appendChild(el);

    btn.focus();
    vi.advanceTimersByTime(200);
    expect(el.hasAttribute('open')).toBe(true);
  });

  it('schedules close on trigger blur', () => {
    vi.useFakeTimers();
    const el = document.createElement('elx-hover-card') as any;
    const btn = document.createElement('button');
    btn.slot = 'trigger';
    el.appendChild(btn);
    document.body.appendChild(el);

    el.show();
    btn.dispatchEvent(new FocusEvent('blur'));
    vi.advanceTimersByTime(300);
    expect(el.hasAttribute('open')).toBe(false);
  });

  // === Keyboard ===
  it('closes on Escape key', () => {
    const el = document.createElement('elx-hover-card') as any;
    document.body.appendChild(el);
    el.show();
    expect(el.hasAttribute('open')).toBe(true);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(el.hasAttribute('open')).toBe(false);
  });

  // === Click Outside ===
  it('closes when clicking outside', () => {
    const el = document.createElement('elx-hover-card') as any;
    document.body.appendChild(el);
    el.show();
    expect(el.hasAttribute('open')).toBe(true);
    document.body.click();
    expect(el.hasAttribute('open')).toBe(false);
  });

  it('does not close when clicking inside', () => {
    const el = document.createElement('elx-hover-card') as any;
    document.body.appendChild(el);
    el.show();
    const content = el.shadowRoot!.querySelector('.content') as HTMLElement;
    content.click();
    expect(el.hasAttribute('open')).toBe(true);
  });

  // === ARIA ===
  it('has correct ARIA attributes on content', () => {
    const el = document.createElement('elx-hover-card');
    document.body.appendChild(el);
    const content = el.shadowRoot!.querySelector('.content');
    expect(content!.getAttribute('role')).toBe('dialog');
    expect(content!.getAttribute('aria-modal')).toBe('false');
    expect(content!.getAttribute('aria-hidden')).toBe('true');
  });

  it('updates aria-hidden when opened', () => {
    const el = document.createElement('elx-hover-card') as any;
    document.body.appendChild(el);
    el.show();
    const content = el.shadowRoot!.querySelector('.content');
    expect(content!.getAttribute('aria-hidden')).toBe('false');
  });

  it('sets aria-haspopup and aria-expanded on trigger', () => {
    const el = document.createElement('elx-hover-card') as any;
    const btn = document.createElement('button');
    btn.slot = 'trigger';
    el.appendChild(btn);
    document.body.appendChild(el);
    expect(btn.getAttribute('aria-haspopup')).toBe('dialog');
    expect(btn.getAttribute('aria-expanded')).toBe('false');
  });

  it('updates aria-expanded when opened', () => {
    const el = document.createElement('elx-hover-card') as any;
    const btn = document.createElement('button');
    btn.slot = 'trigger';
    el.appendChild(btn);
    document.body.appendChild(el);
    el.show();
    expect(btn.getAttribute('aria-expanded')).toBe('true');
  });

  it('sets aria-controls on trigger', () => {
    const el = document.createElement('elx-hover-card') as any;
    const btn = document.createElement('button');
    btn.slot = 'trigger';
    el.appendChild(btn);
    document.body.appendChild(el);
    const contentId = el.shadowRoot!.querySelector('.content')!.id;
    expect(btn.getAttribute('aria-controls')).toBe(contentId);
  });

  // === Positioning ===
  it('positions content at bottom by default', () => {
    const el = document.createElement('elx-hover-card') as any;
    document.body.appendChild(el);
    const content = el.shadowRoot!.querySelector('.content') as HTMLElement;
    expect(content.style.cssText).toContain('top: 100%');
  });

  it('positions content at top when position="top"', () => {
    const el = document.createElement('elx-hover-card') as any;
    el.position = 'top';
    document.body.appendChild(el);
    const content = el.shadowRoot!.querySelector('.content') as HTMLElement;
    expect(content.style.cssText).toContain('bottom: 100%');
  });

  it('positions content at left when position="left"', () => {
    const el = document.createElement('elx-hover-card') as any;
    el.position = 'left';
    document.body.appendChild(el);
    const content = el.shadowRoot!.querySelector('.content') as HTMLElement;
    expect(content.style.cssText).toContain('right: 100%');
  });

  it('positions content at right when position="right"', () => {
    const el = document.createElement('elx-hover-card') as any;
    el.position = 'right';
    document.body.appendChild(el);
    const content = el.shadowRoot!.querySelector('.content') as HTMLElement;
    expect(content.style.cssText).toContain('left: 100%');
  });

  // === Disabled State ===
  it('has disabled attribute when disabled', () => {
    const el = document.createElement('elx-hover-card') as any;
    el.disabled = true;
    document.body.appendChild(el);
    expect(el.hasAttribute('disabled')).toBe(true);
  });

  it('does not schedule open when disabled', () => {
    vi.useFakeTimers();
    const el = document.createElement('elx-hover-card') as any;
    el.disabled = true;
    const btn = document.createElement('button');
    btn.slot = 'trigger';
    el.appendChild(btn);
    document.body.appendChild(el);

    const trigger = el.shadowRoot!.querySelector('.trigger') as HTMLElement;
    trigger.dispatchEvent(new MouseEvent('mouseenter'));
    vi.advanceTimersByTime(200);
    expect(el.hasAttribute('open')).toBe(false);
  });
});
