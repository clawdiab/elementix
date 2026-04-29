const contextMenuStyles = `
  :host {
    --elx-context-menu-bg: var(--elx-color-surface, #ffffff);
    --elx-context-menu-border: var(--elx-color-border, #e2e8f0);
    --elx-context-menu-radius: var(--elx-radius-md, 0.5rem);
    --elx-context-menu-shadow: var(--elx-shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1));
    --elx-context-menu-item-hover: var(--elx-color-surface-hover, #f1f5f9);
    --elx-context-menu-item-padding: 0.5rem 0.75rem;
    --elx-context-menu-item-gap: 0.5rem;
    --elx-context-menu-divider: var(--elx-color-border, #e2e8f0);
    display: contents;
  }

  .context-menu {
    position: fixed;
    background: var(--elx-context-menu-bg);
    border: 1px solid var(--elx-context-menu-border);
    border-radius: var(--elx-context-menu-radius);
    box-shadow: var(--elx-context-menu-shadow);
    padding: 0.25rem 0;
    min-width: 160px;
    z-index: 10000;
    opacity: 0;
    visibility: hidden;
    transform: scale(0.95);
    transform-origin: top left;
    transition: opacity 150ms ease, visibility 150ms ease, transform 150ms ease;
  }

  :host([open]) .context-menu {
    opacity: 1;
    visibility: visible;
    transform: scale(1);
  }

  ::slotted(elx-context-menu-item) {
    display: block;
  }

  ::slotted(elx-context-menu-divider) {
    display: block;
  }
`;

const contextMenuItemStyles = `
  :host {
    display: block;
  }

  .menu-item {
    display: flex;
    align-items: center;
    gap: var(--elx-context-menu-item-gap, 0.5rem);
    padding: var(--elx-context-menu-item-padding, 0.5rem 0.75rem);
    cursor: pointer;
    border: none;
    background: none;
    width: 100%;
    text-align: start;
    font: inherit;
    color: inherit;
    outline: none;
    transition: background-color 0.15s;
  }

  .menu-item:hover,
  .menu-item:focus-visible {
    background: var(--elx-context-menu-item-hover, #f1f5f9);
  }

  .menu-item:focus-visible {
    outline: 2px solid var(--elx-color-primary-500, #3b82f6);
    outline-offset: -2px;
  }

  :host([disabled]) .menu-item {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  ::slotted([slot="prefix"]) {
    flex-shrink: 0;
  }

  ::slotted([slot="suffix"]) {
    flex-shrink: 0;
    margin-inline-start: auto;
  }
`;

const contextMenuDividerStyles = `
  :host {
    display: block;
  }

  .divider {
    height: 1px;
    background: var(--elx-context-menu-divider, #e2e8f0);
    margin: 0.25rem 0;
  }
`;

export class ElxContextMenu extends HTMLElement {
  static observedAttributes = ['open', 'label'];

  private _onContextMenu: (e: Event) => void;
  private _onClickOutside: (e: Event) => void;
  private _onKeydown: (e: KeyboardEvent) => void;
  private _menuElement: HTMLElement | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._onContextMenu = (e: Event) => this._handleContextMenu(e);
    this._onClickOutside = (e: Event) => this._handleClickOutside(e);
    this._onKeydown = (e: KeyboardEvent) => this._handleKeydown(e);
  }

  connectedCallback() {
    this._buildDom();
    this._update();
    this.addEventListener('contextmenu', this._onContextMenu);
    document.addEventListener('click', this._onClickOutside);
    document.addEventListener('keydown', this._onKeydown);
  }

  disconnectedCallback() {
    this.removeEventListener('contextmenu', this._onContextMenu);
    document.removeEventListener('click', this._onClickOutside);
    document.removeEventListener('keydown', this._onKeydown);
  }

  attributeChangedCallback() {
    this._update();
  }

  get open(): boolean {
    return this.hasAttribute('open');
  }

  set open(val: boolean) {
    val ? this.setAttribute('open', '') : this.removeAttribute('open');
  }

  show(x: number, y: number) {
    this.open = true;
    if (this._menuElement) {
      this._menuElement.style.left = x + 'px';
      this._menuElement.style.top = y + 'px';
      // Adjust for viewport overflow after paint
      requestAnimationFrame(() => {
        if (!this._menuElement) return;
        const rect = this._menuElement.getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        if (rect.right > vw) {
          this._menuElement.style.left = Math.max(0, x - rect.width) + 'px';
        }
        if (rect.bottom > vh) {
          this._menuElement.style.top = Math.max(0, y - rect.height) + 'px';
        }
      });
    }
    this.dispatchEvent(new CustomEvent('open', { bubbles: true, composed: true }));
    this._focusFirst();
  }

  hide() {
    this.open = false;
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
  }

  private _handleContextMenu(e: Event) {
    const evt = e as MouseEvent;
    evt.preventDefault();
    this.show(evt.clientX, evt.clientY);
  }

  private _handleClickOutside(e: Event) {
    if (!this.open) return;
    const path = e.composedPath();
    let found = false;
    for (let i = 0; i < path.length; i++) {
      if (path[i] === this) {
        found = true;
        break;
      }
    }
    if (!found) {
      this.hide();
    }
  }

  private _handleKeydown(e: KeyboardEvent) {
    if (!this.open) return;
    if (e.key === 'Escape' || e.key === 'Tab') {
      e.preventDefault();
      this.hide();
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this._focusItem(1);
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      this._focusItem(-1);
    }
    if (e.key === 'Home') {
      e.preventDefault();
      this._focusItem(0, true);
    }
    if (e.key === 'End') {
      e.preventDefault();
      this._focusItem(-1, true);
    }
  }

  private _getItems(): ElxContextMenuItem[] {
    const items: ElxContextMenuItem[] = [];
    this.querySelectorAll('elx-context-menu-item:not([disabled])').forEach(el => {
      items.push(el as ElxContextMenuItem);
    });
    return items;
  }

  private _focusItem(direction: number, absolute = false) {
    const items = this._getItems();
    if (items.length === 0) return;
    const active = document.activeElement as HTMLElement;
    let currentIndex = -1;
    for (let i = 0; i < items.length; i++) {
      if (items[i] === active) {
        currentIndex = i;
        break;
      }
    }
    let nextIndex: number;
    if (absolute) {
      nextIndex = direction >= 0 ? 0 : items.length - 1;
    } else if (currentIndex === -1) {
      nextIndex = direction > 0 ? 0 : items.length - 1;
    } else {
      nextIndex = (currentIndex + direction + items.length) % items.length;
    }
    const item = items[nextIndex];
    const inner = item.shadowRoot?.querySelector('.menu-item') as HTMLElement;
    inner?.focus();
  }

  private _focusFirst() {
    const items = this._getItems();
    if (items.length > 0) {
      const inner = items[0].shadowRoot?.querySelector('.menu-item') as HTMLElement;
      inner?.focus();
    }
  }

  private _buildDom() {
    const style = document.createElement('style');
    style.textContent = contextMenuStyles;

    const menu = document.createElement('div');
    menu.className = 'context-menu';
    menu.setAttribute('role', 'menu');
    menu.setAttribute('aria-orientation', 'vertical');
    menu.setAttribute('part', 'menu');
    const label = this.getAttribute('label');
    if (label) {
      menu.setAttribute('aria-label', label);
    }
    const slot = document.createElement('slot');
    menu.appendChild(slot);

    this._menuElement = menu;

    this.shadowRoot!.appendChild(style);
    this.shadowRoot!.appendChild(menu);
  }

  private _update() {
    const menu = this.shadowRoot?.querySelector('.context-menu');
    if (menu) {
      menu.setAttribute('aria-hidden', String(!this.open));
      const label = this.getAttribute('label');
      if (label) {
        menu.setAttribute('aria-label', label);
      } else {
        menu.removeAttribute('aria-label');
      }
    }
  }
}

export class ElxContextMenuItem extends HTMLElement {
  static observedAttributes = ['disabled'];

  private _rendered = false;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    if (!this._rendered) {
      this._render();
      this._rendered = true;
    }
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'menuitem');
    }
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', this.hasAttribute('disabled') ? '-1' : '0');
    }
    if (this.hasAttribute('disabled')) {
      this.setAttribute('aria-disabled', 'true');
    }
    this.addEventListener('click', this._handleClick);
    this.addEventListener('keydown', this._handleKeydown);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this._handleClick);
    this.removeEventListener('keydown', this._handleKeydown);
  }

  get disabled(): boolean {
    return this.hasAttribute('disabled');
  }

  set disabled(val: boolean) {
    if (val) {
      this.setAttribute('disabled', '');
      this.setAttribute('tabindex', '-1');
    } else {
      this.removeAttribute('disabled');
      this.setAttribute('tabindex', '0');
    }
  }

  attributeChangedCallback(_name: string, oldVal: string | null, newVal: string | null) {
    if (oldVal === newVal) return;
    if (_name === 'disabled') {
      this.setAttribute('tabindex', newVal !== null ? '-1' : '0');
      if (newVal !== null) {
        this.setAttribute('aria-disabled', 'true');
      } else {
        this.removeAttribute('aria-disabled');
      }
    }
  }

  private _handleClick = () => {
    if (this.disabled) return;
    this.dispatchEvent(new CustomEvent('elx-context-menu-select', {
      bubbles: true,
      composed: true,
      detail: { value: this.getAttribute('value') || this.textContent?.trim() },
    }));
    const menu = this.closest('elx-context-menu') as ElxContextMenu;
    menu?.hide();
  };

  private _handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._handleClick();
    }
  };

  private _render() {
    this.shadowRoot!.innerHTML = `
      <style>${contextMenuItemStyles}</style>
      <div class="menu-item" part="base">
        <slot name="prefix"></slot>
        <slot></slot>
        <slot name="suffix"></slot>
      </div>
    `;
  }
}

export class ElxContextMenuDivider extends HTMLElement {
  private _rendered = false;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    if (!this._rendered) {
      this._render();
      this._rendered = true;
    }
    this.setAttribute('role', 'separator');
    this.setAttribute('aria-hidden', 'true');
  }

  private _render() {
    this.shadowRoot!.innerHTML = `
      <style>${contextMenuDividerStyles}</style>
      <div class="divider"></div>
    `;
  }
}

if (!customElements.get('elx-context-menu')) {
  customElements.define('elx-context-menu', ElxContextMenu);
}
if (!customElements.get('elx-context-menu-item')) {
  customElements.define('elx-context-menu-item', ElxContextMenuItem);
}
if (!customElements.get('elx-context-menu-divider')) {
  customElements.define('elx-context-menu-divider', ElxContextMenuDivider);
}
