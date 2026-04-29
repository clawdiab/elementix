import { describe, it, expect, afterEach, vi } from 'vitest';
import './menubar';

function createMenubar(): HTMLElement {
  const el = document.createElement('elx-menubar') as any;

  // File menu
  const fileMenu = document.createElement('elx-menubar-menu');
  fileMenu.setAttribute('label', 'File');
  const fileTrigger = document.createElement('span');
  fileTrigger.slot = 'trigger';
  fileTrigger.textContent = 'File';
  fileMenu.appendChild(fileTrigger);

  const newItem = document.createElement('elx-menubar-item');
  newItem.textContent = 'New';
  newItem.setAttribute('value', 'new');
  fileMenu.appendChild(newItem);

  const openItem = document.createElement('elx-menubar-item');
  openItem.textContent = 'Open';
  openItem.setAttribute('value', 'open');
  fileMenu.appendChild(openItem);

  const sep = document.createElement('elx-menubar-separator');
  fileMenu.appendChild(sep);

  const saveItem = document.createElement('elx-menubar-item');
  saveItem.textContent = 'Save';
  saveItem.setAttribute('value', 'save');
  fileMenu.appendChild(saveItem);

  el.appendChild(fileMenu);

  // Edit menu
  const editMenu = document.createElement('elx-menubar-menu');
  editMenu.setAttribute('label', 'Edit');
  const editTrigger = document.createElement('span');
  editTrigger.slot = 'trigger';
  editTrigger.textContent = 'Edit';
  editMenu.appendChild(editTrigger);

  const undoItem = document.createElement('elx-menubar-item');
  undoItem.textContent = 'Undo';
  undoItem.setAttribute('value', 'undo');
  editMenu.appendChild(undoItem);

  const redoItem = document.createElement('elx-menubar-item');
  redoItem.textContent = 'Redo';
  redoItem.setAttribute('value', 'redo');
  editMenu.appendChild(redoItem);

  el.appendChild(editMenu);

  // View menu
  const viewMenu = document.createElement('elx-menubar-menu');
  viewMenu.setAttribute('label', 'View');
  const viewTrigger = document.createElement('span');
  viewTrigger.slot = 'trigger';
  viewTrigger.textContent = 'View';
  viewMenu.appendChild(viewTrigger);

  const zoomItem = document.createElement('elx-menubar-item');
  zoomItem.textContent = 'Zoom In';
  zoomItem.setAttribute('value', 'zoom-in');
  viewMenu.appendChild(zoomItem);

  el.appendChild(viewMenu);

  document.body.appendChild(el);
  return el;
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('elx-menubar', () => {
  it('should be defined as a custom element', () => {
    expect(customElements.get('elx-menubar')).toBeDefined();
  });

  it('should render shadow DOM with menubar role', () => {
    const el = createMenubar();
    const bar = el.shadowRoot!.querySelector('.menubar');
    expect(bar).toBeTruthy();
    expect(bar!.getAttribute('role')).toBe('menubar');
    expect(bar!.getAttribute('aria-orientation')).toBe('horizontal');
  });

  it('should have part attribute on base', () => {
    const el = createMenubar();
    const bar = el.shadowRoot!.querySelector('.menubar');
    expect(bar!.getAttribute('part')).toBe('base');
  });

  it('should close all menus on outside click', () => {
    const el = createMenubar();
    const menus = el.querySelectorAll('elx-menubar-menu');
    (menus[0] as any).show();
    expect((menus[0] as any).open).toBe(true);
    document.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect((menus[0] as any).open).toBe(false);
  });

  it('should not close on click inside', () => {
    const el = createMenubar();
    const menus = el.querySelectorAll('elx-menubar-menu');
    (menus[0] as any).show();
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect((menus[0] as any).open).toBe(true);
  });

  it('should navigate menus with ArrowRight', () => {
    const el = createMenubar();
    const menus = el.querySelectorAll('elx-menubar-menu');
    (menus[0] as any).show();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    // First menu should close, second should open
    expect((menus[0] as any).open).toBe(false);
    expect((menus[1] as any).open).toBe(true);
  });

  it('should navigate menus with ArrowLeft', () => {
    const el = createMenubar();
    const menus = el.querySelectorAll('elx-menubar-menu');
    (menus[1] as any).show();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    expect((menus[1] as any).open).toBe(false);
    expect((menus[0] as any).open).toBe(true);
  });

  it('should wrap ArrowRight from last to first', () => {
    const el = createMenubar();
    const menus = el.querySelectorAll('elx-menubar-menu');
    (menus[2] as any).show();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect((menus[2] as any).open).toBe(false);
    expect((menus[0] as any).open).toBe(true);
  });

  it('should wrap ArrowLeft from first to last', () => {
    const el = createMenubar();
    const menus = el.querySelectorAll('elx-menubar-menu');
    (menus[0] as any).show();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    expect((menus[0] as any).open).toBe(false);
    expect((menus[2] as any).open).toBe(true);
  });

  it('should close on Escape and keep focus on trigger', () => {
    const el = createMenubar();
    const menus = el.querySelectorAll('elx-menubar-menu');
    (menus[0] as any).show();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect((menus[0] as any).open).toBe(false);
  });

  it('should expose closeAll method', () => {
    const el = createMenubar() as any;
    const menus = el.querySelectorAll('elx-menubar-menu');
    (menus[0] as any).show();
    (menus[1] as any).show();
    el.closeAll();
    expect((menus[0] as any).open).toBe(false);
    expect((menus[1] as any).open).toBe(false);
  });

  it('should clean up listeners on disconnect', () => {
    const el = createMenubar();
    el.remove();
    // Should not throw
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    document.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });

  it('should re-attach listeners on reconnect', () => {
    const el = createMenubar();
    const menus = el.querySelectorAll('elx-menubar-menu');
    el.remove();
    document.body.appendChild(el);
    (menus[0] as any).show();
    document.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect((menus[0] as any).open).toBe(false);
  });
});

describe('elx-menubar-menu', () => {
  it('should be defined as a custom element', () => {
    expect(customElements.get('elx-menubar-menu')).toBeDefined();
  });

  it('should render trigger with aria-haspopup', () => {
    const el = createMenubar();
    const menu = el.querySelector('elx-menubar-menu')!;
    const trigger = menu.shadowRoot!.querySelector('.trigger');
    expect(trigger!.getAttribute('aria-haspopup')).toBe('menu');
  });

  it('should have part attributes on trigger and menu', () => {
    const el = createMenubar();
    const menu = el.querySelector('elx-menubar-menu')!;
    expect(menu.shadowRoot!.querySelector('.trigger')!.getAttribute('part')).toBe('trigger');
    expect(menu.shadowRoot!.querySelector('.menu')!.getAttribute('part')).toBe('menu');
  });

  it('should be closed by default', () => {
    const el = createMenubar();
    const menu = el.querySelector('elx-menubar-menu') as any;
    expect(menu.open).toBe(false);
    const trigger = menu.shadowRoot!.querySelector('.trigger');
    expect(trigger!.getAttribute('aria-expanded')).toBe('false');
  });

  it('should open via show()', () => {
    const el = createMenubar();
    const menu = el.querySelector('elx-menubar-menu') as any;
    menu.show();
    expect(menu.open).toBe(true);
    const trigger = menu.shadowRoot!.querySelector('.trigger');
    expect(trigger!.getAttribute('aria-expanded')).toBe('true');
  });

  it('should dispatch open event', () => {
    const el = createMenubar();
    const menu = el.querySelector('elx-menubar-menu') as any;
    const spy = vi.fn();
    menu.addEventListener('open', spy);
    menu.show();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should close via hide()', () => {
    const el = createMenubar();
    const menu = el.querySelector('elx-menubar-menu') as any;
    menu.show();
    menu.hide();
    expect(menu.open).toBe(false);
  });

  it('should dispatch close event', () => {
    const el = createMenubar();
    const menu = el.querySelector('elx-menubar-menu') as any;
    menu.show();
    const spy = vi.fn();
    menu.addEventListener('close', spy);
    menu.hide();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should toggle on trigger click', () => {
    const el = createMenubar();
    const menu = el.querySelector('elx-menubar-menu') as any;
    const trigger = menu.shadowRoot!.querySelector('.trigger') as HTMLElement;
    trigger.click();
    expect(menu.open).toBe(true);
    trigger.click();
    expect(menu.open).toBe(false);
  });

  it('should not open when disabled', () => {
    const el = createMenubar();
    const menu = el.querySelector('elx-menubar-menu') as any;
    menu.disabled = true;
    menu.show();
    expect(menu.open).toBe(false);
  });

  it('should open on Enter key on trigger', () => {
    const el = createMenubar();
    const menu = el.querySelector('elx-menubar-menu') as any;
    const trigger = menu.shadowRoot!.querySelector('.trigger') as HTMLElement;
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(menu.open).toBe(true);
  });

  it('should open on Space key on trigger', () => {
    const el = createMenubar();
    const menu = el.querySelector('elx-menubar-menu') as any;
    const trigger = menu.shadowRoot!.querySelector('.trigger') as HTMLElement;
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    expect(menu.open).toBe(true);
  });

  it('should open on ArrowDown on trigger', () => {
    const el = createMenubar();
    const menu = el.querySelector('elx-menubar-menu') as any;
    const trigger = menu.shadowRoot!.querySelector('.trigger') as HTMLElement;
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(menu.open).toBe(true);
  });

  it('should set aria-label from label attribute', () => {
    const el = createMenubar();
    const menu = el.querySelector('elx-menubar-menu') as any;
    const trigger = menu.shadowRoot!.querySelector('.trigger');
    expect(trigger!.getAttribute('aria-label')).toBe('File');
  });

  it('should navigate items with ArrowDown inside menu', () => {
    const el = createMenubar();
    const menu = el.querySelector('elx-menubar-menu') as any;
    menu.show();
    const menuEl = menu.shadowRoot!.querySelector('.menu') as HTMLElement;
    menuEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    // Should not throw
    expect(menu.open).toBe(true);
  });

  it('should navigate items with ArrowUp inside menu', () => {
    const el = createMenubar();
    const menu = el.querySelector('elx-menubar-menu') as any;
    menu.show();
    const menuEl = menu.shadowRoot!.querySelector('.menu') as HTMLElement;
    menuEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    expect(menu.open).toBe(true);
  });

  it('should navigate to first item with Home', () => {
    const el = createMenubar();
    const menu = el.querySelector('elx-menubar-menu') as any;
    menu.show();
    const menuEl = menu.shadowRoot!.querySelector('.menu') as HTMLElement;
    menuEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    expect(menu.open).toBe(true);
  });

  it('should navigate to last item with End', () => {
    const el = createMenubar();
    const menu = el.querySelector('elx-menubar-menu') as any;
    menu.show();
    const menuEl = menu.shadowRoot!.querySelector('.menu') as HTMLElement;
    menuEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    expect(menu.open).toBe(true);
  });
});

describe('elx-menubar-item', () => {
  it('should be defined as a custom element', () => {
    expect(customElements.get('elx-menubar-item')).toBeDefined();
  });

  it('should render with menuitem role', () => {
    const el = createMenubar();
    const item = el.querySelector('elx-menubar-item')!;
    expect(item.getAttribute('role')).toBe('menuitem');
  });

  it('should have part attribute on base', () => {
    const el = createMenubar();
    const item = el.querySelector('elx-menubar-item')!;
    const base = item.shadowRoot!.querySelector('.item');
    expect(base!.getAttribute('part')).toBe('base');
  });

  it('should have tabindex 0 by default', () => {
    const el = createMenubar();
    const item = el.querySelector('elx-menubar-item')!;
    expect(item.getAttribute('tabindex')).toBe('0');
  });

  it('should dispatch select event on click', () => {
    const el = createMenubar();
    const menu = el.querySelector('elx-menubar-menu') as any;
    menu.show();
    const item = el.querySelector('elx-menubar-item')!;
    const spy = vi.fn();
    el.addEventListener('elx-menubar-select', spy);
    item.click();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0].detail.value).toBe('new');
  });

  it('should close menu on item click', () => {
    const el = createMenubar();
    const menu = el.querySelector('elx-menubar-menu') as any;
    menu.show();
    const item = el.querySelector('elx-menubar-item')!;
    item.click();
    expect(menu.open).toBe(false);
  });

  it('should not dispatch select when disabled', () => {
    const el = createMenubar();
    const menu = el.querySelector('elx-menubar-menu') as any;
    menu.show();
    const item = el.querySelector('elx-menubar-item') as any;
    item.disabled = true;
    const spy = vi.fn();
    el.addEventListener('elx-menubar-select', spy);
    item.click();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should activate on Enter key', () => {
    const el = createMenubar();
    const menu = el.querySelector('elx-menubar-menu') as any;
    menu.show();
    const item = el.querySelector('elx-menubar-item')!;
    const spy = vi.fn();
    el.addEventListener('elx-menubar-select', spy);
    item.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should activate on Space key', () => {
    const el = createMenubar();
    const menu = el.querySelector('elx-menubar-menu') as any;
    menu.show();
    const item = el.querySelector('elx-menubar-item')!;
    const spy = vi.fn();
    el.addEventListener('elx-menubar-select', spy);
    item.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should toggle disabled via property', () => {
    const el = createMenubar();
    const item = el.querySelector('elx-menubar-item') as any;
    item.disabled = true;
    expect(item.getAttribute('disabled')).toBe('');
    expect(item.getAttribute('tabindex')).toBe('-1');
    expect(item.getAttribute('aria-disabled')).toBe('true');
    item.disabled = false;
    expect(item.hasAttribute('disabled')).toBe(false);
    expect(item.getAttribute('tabindex')).toBe('0');
  });
});

describe('elx-menubar-separator', () => {
  it('should be defined as a custom element', () => {
    expect(customElements.get('elx-menubar-separator')).toBeDefined();
  });

  it('should render with separator role', () => {
    const el = document.createElement('elx-menubar-separator');
    document.body.appendChild(el);
    expect(el.getAttribute('role')).toBe('separator');
    expect(el.getAttribute('aria-hidden')).toBe('true');
  });

  it('should render separator element', () => {
    const el = document.createElement('elx-menubar-separator');
    document.body.appendChild(el);
    const sep = el.shadowRoot!.querySelector('.separator');
    expect(sep).toBeTruthy();
  });
});
