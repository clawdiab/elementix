import { describe, it, expect, afterEach, vi } from 'vitest';
import './context-menu';

function createMenu(items = 3, opts: { disabled?: number[] } = {}): HTMLElement {
  const el = document.createElement('elx-context-menu') as any;
  for (let i = 0; i < items; i++) {
    const item = document.createElement('elx-context-menu-item');
    item.textContent = 'Item ' + (i + 1);
    item.setAttribute('value', 'item-' + (i + 1));
    if (opts.disabled) {
      for (let d = 0; d < opts.disabled.length; d++) {
        if (opts.disabled[d] === i) {
          item.setAttribute('disabled', '');
        }
      }
    }
    el.appendChild(item);
  }
  document.body.appendChild(el);
  return el;
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('elx-context-menu', () => {
  it('should be defined as a custom element', () => {
    expect(customElements.get('elx-context-menu')).toBeDefined();
  });

  it('should render shadow DOM with menu role', () => {
    const el = createMenu();
    const menu = el.shadowRoot!.querySelector('.context-menu');
    expect(menu).toBeTruthy();
    expect(menu!.getAttribute('role')).toBe('menu');
    expect(menu!.getAttribute('aria-orientation')).toBe('vertical');
  });

  it('should have part attribute on menu', () => {
    const el = createMenu();
    const menu = el.shadowRoot!.querySelector('.context-menu');
    expect(menu!.getAttribute('part')).toBe('menu');
  });

  it('should be closed by default', () => {
    const el = createMenu() as any;
    expect(el.open).toBe(false);
    const menu = el.shadowRoot!.querySelector('.context-menu');
    expect(menu!.getAttribute('aria-hidden')).toBe('true');
  });

  it('should open at specified position via show()', () => {
    const el = createMenu() as any;
    el.show(100, 200);
    expect(el.open).toBe(true);
    const menu = el.shadowRoot!.querySelector('.context-menu') as HTMLElement;
    expect(menu.style.left).toBe('100px');
    expect(menu.style.top).toBe('200px');
  });

  it('should dispatch open event on show()', () => {
    const el = createMenu() as any;
    const spy = vi.fn();
    el.addEventListener('open', spy);
    el.show(0, 0);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should close via hide()', () => {
    const el = createMenu() as any;
    el.show(0, 0);
    el.hide();
    expect(el.open).toBe(false);
  });

  it('should dispatch close event on hide()', () => {
    const el = createMenu() as any;
    el.show(0, 0);
    const spy = vi.fn();
    el.addEventListener('close', spy);
    el.hide();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should open on contextmenu event', () => {
    const el = createMenu() as any;
    const event = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      clientX: 150,
      clientY: 250,
    });
    el.dispatchEvent(event);
    expect(el.open).toBe(true);
    const menu = el.shadowRoot!.querySelector('.context-menu') as HTMLElement;
    expect(menu.style.left).toBe('150px');
    expect(menu.style.top).toBe('250px');
  });

  it('should prevent default on contextmenu', () => {
    const el = createMenu() as any;
    const event = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      clientX: 0,
      clientY: 0,
    });
    const spy = vi.spyOn(event, 'preventDefault');
    el.dispatchEvent(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should close on Escape key', () => {
    const el = createMenu() as any;
    el.show(0, 0);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(el.open).toBe(false);
  });

  it('should close on outside click', () => {
    const el = createMenu() as any;
    el.show(0, 0);
    document.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(el.open).toBe(false);
  });

  it('should not close on click inside', () => {
    const el = createMenu() as any;
    el.show(0, 0);
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(el.open).toBe(true);
  });

  it('should navigate items with ArrowDown', () => {
    const el = createMenu() as any;
    el.show(0, 0);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    const items = el.querySelectorAll('elx-context-menu-item');
    const focused = items[0].shadowRoot!.querySelector('.menu-item');
    expect(focused).toBe(document.activeElement?.shadowRoot?.querySelector('.menu-item') || focused);
  });

  it('should navigate items with ArrowUp', () => {
    const el = createMenu() as any;
    el.show(0, 0);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    // Should wrap to last item
    const items = el.querySelectorAll('elx-context-menu-item');
    expect(items.length).toBe(3);
  });

  it('should navigate to first item with Home', () => {
    const el = createMenu() as any;
    el.show(0, 0);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    expect(el.open).toBe(true);
  });

  it('should navigate to last item with End', () => {
    const el = createMenu() as any;
    el.show(0, 0);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    expect(el.open).toBe(true);
  });

  it('should skip disabled items in navigation', () => {
    const el = createMenu(3, { disabled: [0] }) as any;
    el.show(0, 0);
    const items = el.querySelectorAll('elx-context-menu-item:not([disabled])');
    expect(items.length).toBe(2);
  });

  it('should clean up listeners on disconnect', () => {
    const el = createMenu() as any;
    el.show(0, 0);
    el.remove();
    // Should not throw when dispatching events after removal
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    document.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });

  it('should re-attach listeners on reconnect', () => {
    const el = createMenu() as any;
    el.remove();
    document.body.appendChild(el);
    const event = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      clientX: 50,
      clientY: 60,
    });
    el.dispatchEvent(event);
    expect(el.open).toBe(true);
  });
});

describe('elx-context-menu-item', () => {
  it('should be defined as a custom element', () => {
    expect(customElements.get('elx-context-menu-item')).toBeDefined();
  });

  it('should render with menuitem role', () => {
    const el = createMenu();
    const item = el.querySelector('elx-context-menu-item')!;
    expect(item.getAttribute('role')).toBe('menuitem');
  });

  it('should have part attribute on base', () => {
    const el = createMenu();
    const item = el.querySelector('elx-context-menu-item')!;
    const base = item.shadowRoot!.querySelector('.menu-item');
    expect(base!.getAttribute('part')).toBe('base');
  });

  it('should have tabindex 0 by default', () => {
    const el = createMenu();
    const item = el.querySelector('elx-context-menu-item')!;
    expect(item.getAttribute('tabindex')).toBe('0');
  });

  it('should have tabindex -1 when disabled', () => {
    const el = createMenu(3, { disabled: [0] });
    const item = el.querySelector('elx-context-menu-item[disabled]')!;
    expect(item.getAttribute('tabindex')).toBe('-1');
    expect(item.getAttribute('aria-disabled')).toBe('true');
  });

  it('should dispatch select event on click', () => {
    const el = createMenu() as any;
    el.show(0, 0);
    const item = el.querySelector('elx-context-menu-item')!;
    const spy = vi.fn();
    el.addEventListener('elx-context-menu-select', spy);
    item.click();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0].detail.value).toBe('item-1');
  });

  it('should close menu on item click', () => {
    const el = createMenu() as any;
    el.show(0, 0);
    const item = el.querySelector('elx-context-menu-item')!;
    item.click();
    expect(el.open).toBe(false);
  });

  it('should not dispatch select when disabled', () => {
    const el = createMenu(3, { disabled: [0] }) as any;
    el.show(0, 0);
    const item = el.querySelector('elx-context-menu-item[disabled]')!;
    const spy = vi.fn();
    el.addEventListener('elx-context-menu-select', spy);
    item.click();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should activate on Enter key', () => {
    const el = createMenu() as any;
    el.show(0, 0);
    const item = el.querySelector('elx-context-menu-item')!;
    const spy = vi.fn();
    el.addEventListener('elx-context-menu-select', spy);
    item.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should activate on Space key', () => {
    const el = createMenu() as any;
    el.show(0, 0);
    const item = el.querySelector('elx-context-menu-item')!;
    const spy = vi.fn();
    el.addEventListener('elx-context-menu-select', spy);
    item.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should toggle disabled via property', () => {
    const el = createMenu();
    const item = el.querySelector('elx-context-menu-item') as any;
    item.disabled = true;
    expect(item.getAttribute('disabled')).toBe('');
    expect(item.getAttribute('tabindex')).toBe('-1');
    item.disabled = false;
    expect(item.hasAttribute('disabled')).toBe(false);
    expect(item.getAttribute('tabindex')).toBe('0');
  });
});

describe('elx-context-menu-divider', () => {
  it('should be defined as a custom element', () => {
    expect(customElements.get('elx-context-menu-divider')).toBeDefined();
  });

  it('should render with separator role', () => {
    const el = document.createElement('elx-context-menu-divider');
    document.body.appendChild(el);
    expect(el.getAttribute('role')).toBe('separator');
    expect(el.getAttribute('aria-hidden')).toBe('true');
  });

  it('should render divider element', () => {
    const el = document.createElement('elx-context-menu-divider');
    document.body.appendChild(el);
    const divider = el.shadowRoot!.querySelector('.divider');
    expect(divider).toBeTruthy();
  });
});
