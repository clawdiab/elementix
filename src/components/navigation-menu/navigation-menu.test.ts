import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import './navigation-menu';

function makeMenu(html = '') {
  const el = document.createElement('elx-navigation-menu') as any;
  el.innerHTML = html;
  document.body.appendChild(el);
  return el;
}

function makeItem(withContent = false) {
  const item = document.createElement('elx-navigation-menu-item') as any;
  const trigger = document.createElement('span');
  trigger.slot = 'trigger';
  trigger.textContent = 'Item';
  item.appendChild(trigger);
  if (withContent) {
    const content = document.createElement('elx-navigation-menu-content');
    content.textContent = 'Content';
    item.appendChild(content);
  }
  return item;
}

describe('ElxNavigationMenu', () => {
  beforeAll(() => {
    expect(customElements.get('elx-navigation-menu')).toBeDefined();
    expect(customElements.get('elx-navigation-menu-item')).toBeDefined();
    expect(customElements.get('elx-navigation-menu-content')).toBeDefined();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  // === ElxNavigationMenu ===

  it('renders with shadow DOM', () => {
    const el = makeMenu();
    expect(el.shadowRoot).toBeTruthy();
  });

  it('has part="nav" on nav element', () => {
    const el = makeMenu();
    expect(el.shadowRoot!.querySelector('nav')!.getAttribute('part')).toBe('nav');
  });

  it('has part="list" on list element', () => {
    const el = makeMenu();
    expect(el.shadowRoot!.querySelector('.nav-menu')!.getAttribute('part')).toBe('list');
  });

  it('has role="menubar" on list', () => {
    const el = makeMenu();
    expect(el.shadowRoot!.querySelector('.nav-menu')!.getAttribute('role')).toBe('menubar');
  });

  it('does not rebuild DOM on re-connection', () => {
    const el = makeMenu();
    const nav = el.shadowRoot!.querySelector('nav');
    document.body.removeChild(el);
    document.body.appendChild(el);
    expect(el.shadowRoot!.querySelector('nav')).toBe(nav);
  });

  it('closeAll() closes all open items', () => {
    const el = makeMenu();
    const item1 = makeItem(true);
    const item2 = makeItem(true);
    el.appendChild(item1);
    el.appendChild(item2);
    item1.show();
    item2.show();
    el.closeAll();
    expect(item1.open).toBe(false);
    expect(item2.open).toBe(false);
  });

  it('closes all items when clicking outside', () => {
    const el = makeMenu();
    const item = makeItem(true);
    el.appendChild(item);
    item.show();
    expect(item.open).toBe(true);
    document.body.click();
    expect(item.open).toBe(false);
  });

  it('closes open item on Escape key', () => {
    const el = makeMenu();
    const item = makeItem(true);
    el.appendChild(item);
    item.show();
    const trigger = item.shadowRoot!.querySelector('.trigger') as HTMLElement;
    trigger.focus();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(item.open).toBe(false);
  });

  // === ElxNavigationMenuItem ===

  it('renders item with shadow DOM', () => {
    const item = makeItem();
    document.body.appendChild(item);
    expect(item.shadowRoot).toBeTruthy();
  });

  it('has trigger button in shadow DOM', () => {
    const item = makeItem();
    document.body.appendChild(item);
    expect(item.shadowRoot!.querySelector('.trigger')).toBeTruthy();
  });

  it('has part="trigger" on trigger button', () => {
    const item = makeItem();
    document.body.appendChild(item);
    expect(item.shadowRoot!.querySelector('.trigger')!.getAttribute('part')).toBe('trigger');
  });

  it('is closed by default', () => {
    const item = makeItem(true);
    document.body.appendChild(item);
    expect(item.open).toBe(false);
  });

  it('opens when show() is called', () => {
    const item = makeItem(true);
    document.body.appendChild(item);
    item.show();
    expect(item.open).toBe(true);
  });

  it('closes when close() is called', () => {
    const item = makeItem(true);
    document.body.appendChild(item);
    item.show();
    item.close();
    expect(item.open).toBe(false);
  });

  it('toggles open state', () => {
    const item = makeItem(true);
    document.body.appendChild(item);
    item.toggle();
    expect(item.open).toBe(true);
    item.toggle();
    expect(item.open).toBe(false);
  });

  it('does not open when disabled', () => {
    const item = makeItem(true);
    item.disabled = true;
    document.body.appendChild(item);
    item.show();
    expect(item.open).toBe(false);
  });

  it('dispatches "open" event when shown', () => {
    const item = makeItem(true);
    document.body.appendChild(item);
    let fired = false;
    item.addEventListener('open', () => { fired = true; });
    item.show();
    expect(fired).toBe(true);
  });

  it('dispatches "close" event when closed', () => {
    const item = makeItem(true);
    document.body.appendChild(item);
    item.show();
    let fired = false;
    item.addEventListener('close', () => { fired = true; });
    item.close();
    expect(fired).toBe(true);
  });

  it('opens on trigger click', () => {
    const item = makeItem(true);
    document.body.appendChild(item);
    const trigger = item.shadowRoot!.querySelector('.trigger') as HTMLElement;
    trigger.click();
    expect(item.open).toBe(true);
  });

  it('opens on trigger Enter key', () => {
    const item = makeItem(true);
    document.body.appendChild(item);
    const trigger = item.shadowRoot!.querySelector('.trigger') as HTMLElement;
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(item.open).toBe(true);
  });

  it('opens on trigger Space key', () => {
    const item = makeItem(true);
    document.body.appendChild(item);
    const trigger = item.shadowRoot!.querySelector('.trigger') as HTMLElement;
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    expect(item.open).toBe(true);
  });

  it('opens on ArrowDown key', () => {
    const item = makeItem(true);
    document.body.appendChild(item);
    const trigger = item.shadowRoot!.querySelector('.trigger') as HTMLElement;
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(item.open).toBe(true);
  });

  it('sets aria-expanded on trigger', () => {
    const item = makeItem(true);
    document.body.appendChild(item);
    const trigger = item.shadowRoot!.querySelector('.trigger') as HTMLElement;
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    item.show();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('sets aria-haspopup on trigger when content present', () => {
    const item = makeItem(true);
    document.body.appendChild(item);
    const trigger = item.shadowRoot!.querySelector('.trigger') as HTMLElement;
    expect(trigger.getAttribute('aria-haspopup')).toBe('true');
  });

  it('sets aria-controls on trigger matching content id', () => {
    const item = makeItem(true);
    document.body.appendChild(item);
    const trigger = item.shadowRoot!.querySelector('.trigger') as HTMLElement;
    const content = item.querySelector('elx-navigation-menu-content') as HTMLElement;
    expect(trigger.getAttribute('aria-controls')).toBe(content.id);
  });

  it('shows content when item opens', () => {
    const item = makeItem(true);
    document.body.appendChild(item);
    item.show();
    const content = item.querySelector('elx-navigation-menu-content') as HTMLElement;
    expect(content.hasAttribute('visible')).toBe(true);
  });

  it('hides content when item closes', () => {
    const item = makeItem(true);
    document.body.appendChild(item);
    item.show();
    item.close();
    const content = item.querySelector('elx-navigation-menu-content') as HTMLElement;
    expect(content.hasAttribute('visible')).toBe(false);
  });

  it('closes siblings when opening a new item', () => {
    const el = makeMenu();
    const item1 = makeItem(true);
    const item2 = makeItem(true);
    el.appendChild(item1);
    el.appendChild(item2);
    item1.show();
    expect(item1.open).toBe(true);
    item2.show();
    expect(item1.open).toBe(false);
    expect(item2.open).toBe(true);
  });

  it('opens on mouseenter', () => {
    const item = makeItem(true);
    document.body.appendChild(item);
    item.dispatchEvent(new MouseEvent('mouseenter'));
    expect(item.open).toBe(true);
  });

  it('closes on mouseleave', () => {
    const item = makeItem(true);
    document.body.appendChild(item);
    item.show();
    item.dispatchEvent(new MouseEvent('mouseleave'));
    expect(item.open).toBe(false);
  });

  it('does not rebuild DOM on re-connection', () => {
    const item = makeItem(true);
    document.body.appendChild(item);
    const trigger = item.shadowRoot!.querySelector('.trigger');
    document.body.removeChild(item);
    document.body.appendChild(item);
    expect(item.shadowRoot!.querySelector('.trigger')).toBe(trigger);
  });

  // === ElxNavigationMenuContent ===

  it('renders content with shadow DOM', () => {
    const content = document.createElement('elx-navigation-menu-content');
    document.body.appendChild(content);
    expect(content.shadowRoot).toBeTruthy();
  });

  it('has role="menu" on content', () => {
    const content = document.createElement('elx-navigation-menu-content');
    document.body.appendChild(content);
    expect(content.getAttribute('role')).toBe('menu');
  });

  it('has aria-hidden="true" when not visible', () => {
    const content = document.createElement('elx-navigation-menu-content');
    document.body.appendChild(content);
    expect(content.getAttribute('aria-hidden')).toBe('true');
  });

  it('has aria-hidden="false" when visible', () => {
    const content = document.createElement('elx-navigation-menu-content');
    document.body.appendChild(content);
    content.setAttribute('visible', '');
    expect(content.getAttribute('aria-hidden')).toBe('false');
  });

  it('has part="content" on wrapper', () => {
    const content = document.createElement('elx-navigation-menu-content');
    document.body.appendChild(content);
    expect(content.shadowRoot!.querySelector('[part="content"]')).toBeTruthy();
  });
});
