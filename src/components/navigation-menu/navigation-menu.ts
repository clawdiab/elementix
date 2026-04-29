// ── Styles ──────────────────────────────────────────────────────────

const navMenuStyles = `
  :host {
    --elx-nav-menu-bg: var(--elx-color-surface, #ffffff);
    --elx-nav-menu-border: var(--elx-color-border, #e2e8f0);
    --elx-nav-menu-gap: 0.25rem;
    display: block;
  }

  .nav-menu {
    display: flex;
    align-items: center;
    gap: var(--elx-nav-menu-gap);
    list-style: none;
    margin: 0;
    padding: 0;
  }
`;

const navMenuItemStyles = `
  :host {
    position: relative;
    display: inline-block;
  }

  .trigger {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: var(--elx-nav-menu-item-padding, 0.5rem 0.75rem);
    border: none;
    background: none;
    font: inherit;
    color: inherit;
    cursor: pointer;
    border-radius: var(--elx-radius-md, 0.375rem);
    transition: background-color 0.15s;
    outline: none;
    white-space: nowrap;
  }

  .trigger:hover,
  .trigger:focus-visible {
    background: var(--elx-nav-menu-item-hover, var(--elx-color-surface-hover, #f1f5f9));
  }

  :host([open]) .trigger {
    background: var(--elx-nav-menu-item-hover, var(--elx-color-surface-hover, #f1f5f9));
  }

  :host([disabled]) .trigger {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  .arrow {
    display: inline-block;
    width: 10px;
    height: 10px;
    transition: transform 0.2s;
  }

  .arrow svg {
    display: block;
    width: 100%;
    height: 100%;
  }

  :host([open]) .arrow {
    transform: rotate(180deg);
  }
`;

const navMenuContentStyles = `
  :host {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1000;
    display: none;
    min-width: var(--elx-nav-menu-content-min-width, 200px);
    padding: var(--elx-nav-menu-content-padding, 0.75rem);
    margin-top: 0.25rem;
    background: var(--elx-nav-menu-bg, var(--elx-color-surface, #ffffff));
    border: 1px solid var(--elx-nav-menu-border, var(--elx-color-border, #e2e8f0));
    border-radius: var(--elx-radius-lg, 0.5rem);
    box-shadow: var(--elx-nav-menu-shadow, var(--elx-shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1)));
    opacity: 0;
    transition: opacity 150ms ease;
  }

  :host([visible]) {
    display: block;
    opacity: 1;
  }
`;

// ── ElxNavigationMenu ───────────────────────────────────────────────

export class ElxNavigationMenu extends HTMLElement {
  private _boundKeydown: (e: KeyboardEvent) => void;
  private _boundClickOutside: (e: Event) => void;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._boundKeydown = this._handleKeydown.bind(this);
    this._boundClickOutside = this._handleClickOutside.bind(this);
  }

  connectedCallback() {
    if (!this.shadowRoot!.querySelector('.nav-menu')) this._buildDom();
    document.addEventListener('keydown', this._boundKeydown);
    document.addEventListener('click', this._boundClickOutside);
  }

  disconnectedCallback() {
    document.removeEventListener('keydown', this._boundKeydown);
    document.removeEventListener('click', this._boundClickOutside);
  }

  private _buildDom() {
    const style = document.createElement('style');
    style.textContent = navMenuStyles;

    const nav = document.createElement('nav');
    nav.setAttribute('part', 'nav');
    nav.setAttribute('aria-label', this.getAttribute('aria-label') || 'Main navigation');

    const list = document.createElement('div');
    list.className = 'nav-menu';
    list.setAttribute('role', 'menubar');
    list.setAttribute('part', 'list');
    const slot = document.createElement('slot');
    list.appendChild(slot);

    nav.appendChild(list);
    this.shadowRoot!.appendChild(style);
    this.shadowRoot!.appendChild(nav);
  }

  private _getItems(): HTMLElement[] {
    const items: HTMLElement[] = [];
    this.querySelectorAll('elx-navigation-menu-item:not([disabled])').forEach(el => items.push(el as HTMLElement));
    return items;
  }

  private _handleKeydown(e: KeyboardEvent) {
    const items = this._getItems();
    if (items.length === 0) return;

    const active = document.activeElement;
    // Check if focus is within one of our items
    let currentIdx = -1;
    for (let i = 0; i < items.length; i++) {
      if (items[i] === active || items[i].contains(active as Node)) {
        currentIdx = i;
        break;
      }
    }
    if (currentIdx === -1) return;

    const currentItem = items[currentIdx] as any;

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      currentItem.close?.();
      const next = currentIdx < items.length - 1 ? currentIdx + 1 : 0;
      (items[next] as any).focusTrigger?.();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      currentItem.close?.();
      const prev = currentIdx > 0 ? currentIdx - 1 : items.length - 1;
      (items[prev] as any).focusTrigger?.();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      currentItem.close?.();
      currentItem.focusTrigger?.();
    }
  }

  private _handleClickOutside(e: Event) {
    const path = e.composedPath();
    if (path.indexOf(this) === -1) {
      this.closeAll();
    }
  }

  closeAll() {
    this._getItems().forEach(item => (item as any).close?.());
  }
}

// ── ElxNavigationMenuItem ───────────────────────────────────────────

export class ElxNavigationMenuItem extends HTMLElement {
  static observedAttributes = ['open', 'disabled'];

  private _contentId = `elx-nav-content-${Math.random().toString(36).slice(2, 9)}`;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    if (!this.shadowRoot!.querySelector('.trigger')) this._buildDom();
    this._update();
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'none');
    }
  }

  disconnectedCallback() {
    // Listeners are on shadow DOM elements, cleaned up automatically
  }

  attributeChangedCallback(_name: string, oldVal: string | null, newVal: string | null) {
    if (oldVal === newVal) return;
    this._update();
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

  show() {
    if (this.disabled || this.open) return;
    // Close siblings
    const parent = this.closest('elx-navigation-menu') as any;
    if (parent) parent.closeAll();
    this.open = true;
    this.dispatchEvent(new CustomEvent('open', { bubbles: true, composed: true }));
    // Show content
    const content = this.querySelector('elx-navigation-menu-content') as HTMLElement;
    if (content) content.setAttribute('visible', '');
  }

  close() {
    if (!this.open) return;
    this.open = false;
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
    const content = this.querySelector('elx-navigation-menu-content') as HTMLElement;
    if (content) content.removeAttribute('visible');
  }

  toggle() {
    this.open ? this.close() : this.show();
  }

  focusTrigger() {
    const trigger = this.shadowRoot?.querySelector('.trigger') as HTMLElement;
    trigger?.focus();
  }

  private _onTriggerClick = () => {
    if (this.disabled) return;
    this.toggle();
  };

  private _onTriggerKeydown = (e: KeyboardEvent) => {
    if (this.disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.toggle();
    } else if (e.key === 'ArrowDown' && !this.open) {
      e.preventDefault();
      this.show();
    }
  };

  private _onMouseEnter = () => {
    if (!this.disabled) this.show();
  };

  private _onMouseLeave = () => {
    this.close();
  };

  private _hasContent(): boolean {
    return !!this.querySelector('elx-navigation-menu-content');
  }

  private _buildDom() {
    const style = document.createElement('style');
    style.textContent = navMenuItemStyles;

    const trigger = document.createElement('button');
    trigger.className = 'trigger';
    trigger.setAttribute('part', 'trigger');
    trigger.setAttribute('role', 'menuitem');

    const labelSlot = document.createElement('slot');
    labelSlot.name = 'trigger';
    trigger.appendChild(labelSlot);

    // Arrow indicator for items with content
    const arrow = document.createElement('span');
    arrow.className = 'arrow';
    arrow.setAttribute('aria-hidden', 'true');
    arrow.innerHTML = '<svg viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    trigger.appendChild(arrow);

    const contentSlot = document.createElement('slot');

    this.shadowRoot!.appendChild(style);
    this.shadowRoot!.appendChild(trigger);
    this.shadowRoot!.appendChild(contentSlot);

    trigger.addEventListener('click', this._onTriggerClick);
    trigger.addEventListener('keydown', this._onTriggerKeydown);

    // Hover to open/close
    this.addEventListener('mouseenter', this._onMouseEnter);
    this.addEventListener('mouseleave', this._onMouseLeave);
  }

  private _update() {
    const trigger = this.shadowRoot?.querySelector('.trigger') as HTMLElement;
    if (!trigger) return;

    const hasContent = this._hasContent();
    trigger.setAttribute('aria-expanded', String(this.open));
    if (hasContent) {
      trigger.setAttribute('aria-haspopup', 'true');
      trigger.setAttribute('aria-controls', this._contentId);
    }

    // Hide arrow if no content
    const arrow = this.shadowRoot?.querySelector('.arrow') as HTMLElement;
    if (arrow) {
      arrow.style.display = hasContent ? 'inline-block' : 'none';
    }

    // Sync content visibility
    const content = this.querySelector('elx-navigation-menu-content') as HTMLElement;
    if (content) {
      content.id = this._contentId;
      if (this.open) {
        content.setAttribute('visible', '');
      } else {
        content.removeAttribute('visible');
      }
    }
  }
}

// ── ElxNavigationMenuContent ────────────────────────────────────────

export class ElxNavigationMenuContent extends HTMLElement {
  static observedAttributes = ['visible'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    if (!this.shadowRoot!.querySelector('slot')) this._buildDom();
    this.setAttribute('role', 'menu');
    this.setAttribute('aria-hidden', String(!this.hasAttribute('visible')));
  }

  attributeChangedCallback(_name: string, oldVal: string | null, newVal: string | null) {
    if (oldVal === newVal) return;
    this.setAttribute('aria-hidden', String(!this.hasAttribute('visible')));
  }

  private _buildDom() {
    const style = document.createElement('style');
    style.textContent = navMenuContentStyles;

    const wrapper = document.createElement('div');
    wrapper.setAttribute('part', 'content');
    const slot = document.createElement('slot');
    wrapper.appendChild(slot);

    this.shadowRoot!.appendChild(style);
    this.shadowRoot!.appendChild(wrapper);
  }
}

// ── Registration ────────────────────────────────────────────────────

if (!customElements.get('elx-navigation-menu')) {
  customElements.define('elx-navigation-menu', ElxNavigationMenu);
}
if (!customElements.get('elx-navigation-menu-item')) {
  customElements.define('elx-navigation-menu-item', ElxNavigationMenuItem);
}
if (!customElements.get('elx-navigation-menu-content')) {
  customElements.define('elx-navigation-menu-content', ElxNavigationMenuContent);
}

declare global {
  interface HTMLElementTagNameMap {
    'elx-navigation-menu': ElxNavigationMenu;
    'elx-navigation-menu-item': ElxNavigationMenuItem;
    'elx-navigation-menu-content': ElxNavigationMenuContent;
  }
}
