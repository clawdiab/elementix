import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './menu';

describe('ElxMenu', () => {
  let menu: any;

  beforeEach(() => {
    menu = document.createElement('elx-menu');
    document.body.appendChild(menu);
  });

  afterEach(() => {
    document.body.removeChild(menu);
  });

  it('renders with menu role', () => {
    const menuEl = menu.shadowRoot.querySelector('.menu');
    expect(menuEl.getAttribute('role')).toBe('menu');
  });

  it('has arrow key navigation', () => {
    const item1 = document.createElement('elx-menu-item');
    item1.textContent = 'Item 1';
    const item2 = document.createElement('elx-menu-item');
    item2.textContent = 'Item 2';
    menu.appendChild(item1);
    menu.appendChild(item2);

    menu.focusFirst();
    expect(document.activeElement).toBe(item1);

    const downEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    menu.shadowRoot.querySelector('.menu').dispatchEvent(downEvent);
    expect(document.activeElement).toBe(item2);
  });

  it('wraps navigation at boundaries', () => {
    const item1 = document.createElement('elx-menu-item');
    item1.textContent = 'Item 1';
    const item2 = document.createElement('elx-menu-item');
    item2.textContent = 'Item 2';
    menu.appendChild(item1);
    menu.appendChild(item2);

    menu.focusLast();
    expect(document.activeElement).toBe(item2);

    const downEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    menu.shadowRoot.querySelector('.menu').dispatchEvent(downEvent);
    expect(document.activeElement).toBe(item1);
  });

  it('skips disabled items in navigation', () => {
    const item1 = document.createElement('elx-menu-item');
    item1.textContent = 'Item 1';
    const item2 = document.createElement('elx-menu-item') as any;
    item2.textContent = 'Item 2';
    item2.disabled = true;
    const item3 = document.createElement('elx-menu-item');
    item3.textContent = 'Item 3';
    menu.appendChild(item1);
    menu.appendChild(item2);
    menu.appendChild(item3);

    menu.focusFirst();
    const downEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    menu.shadowRoot.querySelector('.menu').dispatchEvent(downEvent);
    expect(document.activeElement).toBe(item3);
  });
});

describe('ElxMenuItem', () => {
  let item: any;

  beforeEach(() => {
    item = document.createElement('elx-menu-item');
    item.textContent = 'Menu Item';
    document.body.appendChild(item);
  });

  afterEach(() => {
    document.body.removeChild(item);
  });

  it('renders with menuitem role', () => {
    expect(item.getAttribute('role')).toBe('menuitem');
  });

  it('has tabindex 0 by default', () => {
    expect(item.getAttribute('tabindex')).toBe('0');
  });

  it('has tabindex -1 when disabled', () => {
    item.disabled = true;
    expect(item.getAttribute('tabindex')).toBe('-1');
  });

  it('fires elx-menu-select on click', () => {
    let fired = false;
    let detail: any;
    item.addEventListener('elx-menu-select', (e: CustomEvent) => {
      fired = true;
      detail = e.detail;
    });
    item.click();
    expect(fired).toBe(true);
    expect(detail.value).toBe('Menu Item');
  });

  it('fires elx-menu-select on Enter', () => {
    let fired = false;
    item.addEventListener('elx-menu-select', () => { fired = true; });
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    item.dispatchEvent(event);
    expect(fired).toBe(true);
  });

  it('fires elx-menu-select on Space', () => {
    let fired = false;
    item.addEventListener('elx-menu-select', () => { fired = true; });
    const event = new KeyboardEvent('keydown', { key: ' ' });
    item.dispatchEvent(event);
    expect(fired).toBe(true);
  });

  it('does not fire event when disabled', () => {
    item.disabled = true;
    let fired = false;
    item.addEventListener('elx-menu-select', () => { fired = true; });
    item.click();
    expect(fired).toBe(false);
  });

  it('applies active styles', () => {
    item.active = true;
    expect(item.hasAttribute('active')).toBe(true);
  });

  it('sets aria-disabled when disabled', () => {
    item.disabled = true;
    expect(item.getAttribute('aria-disabled')).toBe('true');
  });

  it('has prefix and suffix slots', () => {
    const slots = item.shadowRoot.querySelectorAll('slot');
    const names = [...slots].map((s: any) => s.name || 'default');
    expect(names).toContain('prefix');
    expect(names).toContain('suffix');
    expect(names).toContain('default');
  });
});

describe('ElxMenuDivider', () => {
  let divider: any;

  beforeEach(() => {
    divider = document.createElement('elx-menu-divider');
    document.body.appendChild(divider);
  });

  afterEach(() => {
    document.body.removeChild(divider);
  });

  it('renders with separator role', () => {
    expect(divider.getAttribute('role')).toBe('separator');
  });

  it('renders divider element', () => {
    expect(divider.shadowRoot.querySelector('.divider')).toBeTruthy();
  });
});

describe('ElxMenuGroup', () => {
  let group: any;

  beforeEach(() => {
    group = document.createElement('elx-menu-group');
    document.body.appendChild(group);
  });

  afterEach(() => {
    document.body.removeChild(group);
  });

  it('renders with group role', () => {
    expect(group.getAttribute('role')).toBe('group');
  });

  it('displays label', () => {
    group.label = 'Actions';
    const label = group.shadowRoot.querySelector('.label');
    expect(label.textContent).toBe('Actions');
  });

  it('updates label via attribute', () => {
    group.setAttribute('label', 'File');
    const label = group.shadowRoot.querySelector('.label');
    expect(label.textContent).toBe('File');
  });

  it('sets aria-label from label', () => {
    group.label = 'Edit';
    expect(group.getAttribute('aria-label')).toBe('Edit');
  });
});
