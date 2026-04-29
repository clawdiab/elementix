const menubarStyles = `
  :host {
    --elx-menubar-bg: var(--elx-color-surface, #ffffff);
    --elx-menubar-border: var(--elx-color-border, #e2e8f0);
    --elx-menubar-radius: var(--elx-radius-md, 0.5rem);
    --elx-menubar-item-hover: var(--elx-color-surface-hover, #f1f5f9);
    --elx-menubar-item-active: var(--elx-color-primary, #3b82f6);
    --elx-menubar-item-active-bg: var(--elx-color-primary-light, #eff6ff);
    --elx-menubar-item-padding: 0.375rem 0.75rem;
    --elx-menubar-gap: 0.25rem;
    display: block;
  }

  .menubar {
    display: flex;
    align-items: center;
    gap: var(--elx-menubar-gap);
    background: var(--elx-menubar-bg);
    border: 1px solid var(--elx-menubar-border);
    border-radius: var(--elx-menubar-radius);
    padding: 0.25rem;
  }
`;

const menubarMenuStyles = `
  :host {
    position: relative;
    display: inline-block;
  }

  .trigger {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: var(--elx-menubar-item-padding, 0.375rem 0.75rem);
    border: none;
    background: none;
    font: inherit;
    color: inherit;
    cursor: pointer;
    border-radius: var(--elx-radius-sm, 0.25rem);
    transition: background-color 0.15s;
    outline: none;
    white-space: nowrap;
    font-size: 0.875rem;
  }

  .trigger:hover,
  .trigger:focus-visible {
    background: var(--elx-menubar-item-hover, #f1f5f9);
  }

  .trigger:focus-visible {
    outline: 2px solid var(--elx-color-primary-500, #3b82f6);
    outline-offset: -2px;
  }

  :host([open]) .trigger {
    background: var(--elx-menubar-item-active-bg, #eff6ff);
    color: var(--elx-menubar-item-active, #3b82f6);
  }

  :host([disabled]) .trigger {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  .menu {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    min-width: 180px;
    background: var(--elx-menubar-bg, #ffffff);
    border: 1px solid var(--elx-menubar-border, #e2e8f0);
    border-radius: var(--elx-menubar-radius, 0.5rem);
    box-shadow: var(--elx-shadow-lg, 0 10px 15px -3px rgba(0,0,0,0.1));
    padding: 0.25rem 0;
    z-index: 1000;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-4px);
    transition: opacity 150ms ease, visibility 150ms ease, transform 150ms ease;
  }

  :host([open]) .menu {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
`;

const menubarItemStyles = `
  :host {
    display: block;
  }

  .item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    cursor: pointer;
    border: none;
    background: none;
    width: 100%;
    text-align: start;
    font: inherit;
    font-size: 0.875rem;
    color: inherit;
    outline: none;
    transition: background-color 0.15s;
  }

  .item:hover,
  .item:focus-visible {
    background: var(--elx-menubar-item-hover, #f1f5f9);
  }

  .item:focus-visible {
    outline: 2px solid var(--elx-color-primary-500, #3b82f6);
    outline-offset: -2px;
  }

  :host([disabled]) .item {
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

const menubarSeparatorStyles = `
  :host {
    display: block;
  }

  .separator {
    height: 1px;
    background: var(--elx-menubar-border, #e2e8f0);
    margin: 0.25rem 0;
  }
`;

export class ElxMenubar extends HTMLElement {
  private _rendered = false;
  private _onClickOutside: (e: Event) => void;
  private _onKeydown: (e: KeyboardEvent) => void;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._onClickOutside = (e: Event) => this._handleClickOutside(e);
    this._onKeydown = (e: KeyboardEvent) => this._handleKeydown(e);
  }

  connectedCallback() {
    if (!this._rendered) {
      this._buildDom();
      this._rendered = true;
    }
    document.addEventListener('click', this._onClickOutside);
    document.addEventListener('keydown', this._onKeydown);
  }

  disconnectedCallback() {
    document.removeEventListener('click', this._onClickOutside);
    document.removeEventListener('keydown', this._onKeydown);
  }

  private _getMenus(): ElxMenubarMenu[] {
    const menus: ElxMenubarMenu[] = [];
    this.querySelectorAll('elx-menubar-menu').forEach(el => {
      menus.push(el as ElxMenubarMenu);
    });
    return menus;
  }

  private _handleClickOutside(e: Event) {
    const path = e.composedPath();
    let found = false;
    for (let i = 0; i < path.length; i++) {
      if (path[i] === this) {
        found = true;
        break;
      }
    }
    if (!found) {
      this._closeAll();
    }
  }

  private _handleKeydown(e: KeyboardEvent) {
    const menus = this._getMenus();
    if (menus.length === 0) return;

    // Find which menu (or its child) is currently focused/open
    let activeIndex = -1;
    for (let i = 0; i < menus.length; i++) {
      if (menus[i].open || menus[i].contains(document.activeElement) ||
          menus[i].shadowRoot?.contains(document.activeElement)) {
        activeIndex = i;
        break;
      }
    }

    if (activeIndex === -1) return;

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const wasOpen = menus[activeIndex].open;
      this._closeAll();
      const next = (activeIndex + 1) % menus.length;
      menus[next].focusTrigger();
      if (wasOpen) menus[next].show();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const wasOpen = menus[activeIndex].open;
      this._closeAll();
      const prev = (activeIndex - 1 + menus.length) % menus.length;
      menus[prev].focusTrigger();
      if (wasOpen) menus[prev].show();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      const wasOpen = menus[activeIndex].open;
      this._closeAll();
      if (wasOpen) menus[activeIndex].focusTrigger();
    }
  }

  closeAll() {
    this._closeAll();
  }

  private _closeAll() {
    const menus = this._getMenus();
    for (let i = 0; i < menus.length; i++) {
      menus[i].hide();
    }
  }

  private _buildDom() {
    const style = document.createElement('style');
    style.textContent = menubarStyles;

    const bar = document.createElement('div');
    bar.className = 'menubar';
    bar.setAttribute('role', 'menubar');
    bar.setAttribute('aria-orientation', 'horizontal');
    bar.setAttribute('part', 'base');
    const slot = document.createElement('slot');
    bar.appendChild(slot);

    this.shadowRoot!.appendChild(style);
    this.shadowRoot!.appendChild(bar);
  }
}

export class ElxMenubarMenu extends HTMLElement {
  static observedAttributes = ['open', 'disabled', 'label'];

  private _rendered = false;
  private _triggerEl: HTMLElement | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    if (!this._rendered) {
      this._buildDom();
      this._rendered = true;
    }
    this._update();
  }

  attributeChangedCallback() {
    if (this._rendered) this._update();
  }

  get open(): boolean {
    return this.hasAttribute('open');
  }

  set open(val: boolean) {
    val ? this.setAttribute('open', '') : this.removeAttribute('open');
  }

  get disabled(): boolean {
    return this.hasAttribute('disabled');
  }

  set disabled(val: boolean) {
    val ? this.setAttribute('disabled', '') : this.removeAttribute('disabled');
  }

  get label(): string {
    return this.getAttribute('label') || '';
  }

  set label(val: string) {
    this.setAttribute('label', val);
  }

  show() {
    if (this.disabled) return;
    this.open = true;
    this.dispatchEvent(new CustomEvent('open', { bubbles: true, composed: true }));
    this._focusFirstItem();
  }

  hide() {
    if (!this.open) return;
    this.open = false;
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
  }

  focusTrigger() {
    this._triggerEl?.focus();
  }

  private _focusFirstItem() {
    const items = this._getItems();
    if (items.length > 0) {
      const inner = items[0].shadowRoot?.querySelector('.item') as HTMLElement;
      inner?.focus();
    }
  }

  private _getItems(): ElxMenubarItem[] {
    const items: ElxMenubarItem[] = [];
    this.querySelectorAll('elx-menubar-item:not([disabled])').forEach(el => {
      items.push(el as ElxMenubarItem);
    });
    return items;
  }

  private _onTriggerClick = () => {
    if (this.disabled) return;
    this.open ? this.hide() : this.show();
  };

  private _onTriggerKeydown = (e: KeyboardEvent) => {
    if (this.disabled) return;
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      if (!this.open) this.show();
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!this.open) {
        this.show();
        // Focus last item
        const items = this._getItems();
        if (items.length > 0) {
          const inner = items[items.length - 1].shadowRoot?.querySelector('.item') as HTMLElement;
          inner?.focus();
        }
      }
    }
  };

  private _onMenuKeydown = (e: KeyboardEvent) => {
    if (!this.open) return;
    const items = this._getItems();
    if (items.length === 0) return;

    const active = document.activeElement as HTMLElement;
    let currentIndex = -1;
    for (let i = 0; i < items.length; i++) {
      if (items[i].shadowRoot?.contains(active)) {
        currentIndex = i;
        break;
      }
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
      const inner = items[next].shadowRoot?.querySelector('.item') as HTMLElement;
      inner?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
      const inner = items[prev].shadowRoot?.querySelector('.item') as HTMLElement;
      inner?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      const inner = items[0].shadowRoot?.querySelector('.item') as HTMLElement;
      inner?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      const inner = items[items.length - 1].shadowRoot?.querySelector('.item') as HTMLElement;
      inner?.focus();
    }
  };

  private _buildDom() {
    const style = document.createElement('style');
    style.textContent = menubarMenuStyles;

    const trigger = document.createElement('button');
    trigger.className = 'trigger';
    trigger.setAttribute('part', 'trigger');
    trigger.setAttribute('aria-haspopup', 'menu');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('type', 'button');
    const triggerSlot = document.createElement('slot');
    triggerSlot.name = 'trigger';
    trigger.appendChild(triggerSlot);
    this._triggerEl = trigger;

    const menu = document.createElement('div');
    menu.className = 'menu';
    menu.setAttribute('role', 'menu');
    menu.setAttribute('aria-orientation', 'vertical');
    menu.setAttribute('part', 'menu');
    const menuSlot = document.createElement('slot');
    menu.appendChild(menuSlot);

    trigger.addEventListener('click', this._onTriggerClick);
    trigger.addEventListener('keydown', this._onTriggerKeydown);
    menu.addEventListener('keydown', this._onMenuKeydown);

    this.shadowRoot!.appendChild(style);
    this.shadowRoot!.appendChild(trigger);
    this.shadowRoot!.appendChild(menu);
  }

  private _update() {
    const trigger = this.shadowRoot?.querySelector('.trigger');
    const menu = this.shadowRoot?.querySelector('.menu');
    if (trigger) {
      trigger.setAttribute('aria-expanded', String(this.open));
      trigger.setAttribute('aria-label', this.label);
      if (this.disabled) {
        trigger.setAttribute('disabled', '');
      } else {
        trigger.removeAttribute('disabled');
      }
    }
    if (menu) {
      menu.setAttribute('aria-hidden', String(!this.open));
    }
  }
}

export class ElxMenubarItem extends HTMLElement {
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
    this.dispatchEvent(new CustomEvent('elx-menubar-select', {
      bubbles: true,
      composed: true,
      detail: { value: this.getAttribute('value') || this.textContent?.trim() },
    }));
    const menu = this.closest('elx-menubar-menu') as ElxMenubarMenu;
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
      <style>${menubarItemStyles}</style>
      <div class="item" part="base">
        <slot name="prefix"></slot>
        <slot></slot>
        <slot name="suffix"></slot>
      </div>
    `;
  }
}

export class ElxMenubarSeparator extends HTMLElement {
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
      <style>${menubarSeparatorStyles}</style>
      <div class="separator"></div>
    `;
  }
}

if (!customElements.get('elx-menubar')) {
  customElements.define('elx-menubar', ElxMenubar);
}
if (!customElements.get('elx-menubar-menu')) {
  customElements.define('elx-menubar-menu', ElxMenubarMenu);
}
if (!customElements.get('elx-menubar-item')) {
  customElements.define('elx-menubar-item', ElxMenubarItem);
}
if (!customElements.get('elx-menubar-separator')) {
  customElements.define('elx-menubar-separator', ElxMenubarSeparator);
}
