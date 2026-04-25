const menuStyles = `
  :host {
    --elx-menu-bg: var(--elx-color-surface, #ffffff);
    --elx-menu-border: var(--elx-color-border, #e2e8f0);
    --elx-menu-radius: var(--elx-radius-md, 0.5rem);
    --elx-menu-shadow: var(--elx-shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1));
    --elx-menu-item-hover: var(--elx-color-surface-hover, #f1f5f9);
    --elx-menu-item-active: var(--elx-color-primary, #3b82f6);
    --elx-menu-item-active-bg: var(--elx-color-primary-light, #eff6ff);
    --elx-menu-item-padding: 0.5rem 0.75rem;
    --elx-menu-item-gap: 0.5rem;
    --elx-menu-divider: var(--elx-color-border, #e2e8f0);
    display: inline-block;
    position: relative;
  }

  .menu {
    background: var(--elx-menu-bg);
    border: 1px solid var(--elx-menu-border);
    border-radius: var(--elx-menu-radius);
    box-shadow: var(--elx-menu-shadow);
    padding: 0.25rem 0;
    min-width: 160px;
    outline: none;
  }
`;

const menuItemStyles = `
  :host {
    display: block;
  }

  .menu-item {
    display: flex;
    align-items: center;
    gap: var(--elx-menu-item-gap, 0.5rem);
    padding: var(--elx-menu-item-padding, 0.5rem 0.75rem);
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
    background: var(--elx-menu-item-hover, #f1f5f9);
  }

  :host([active]) .menu-item {
    color: var(--elx-menu-item-active, #3b82f6);
    background: var(--elx-menu-item-active-bg, #eff6ff);
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

const menuDividerStyles = `
  :host {
    display: block;
  }

  .divider {
    height: 1px;
    background: var(--elx-menu-divider, #e2e8f0);
    margin: 0.25rem 0;
  }
`;

const menuGroupStyles = `
  :host {
    display: block;
  }

  .label {
    padding: 0.5rem 0.75rem 0.25rem;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--elx-color-text-muted, #64748b);
  }
`;

export class ElxMenu extends HTMLElement {
  private _rendered = false;
  private _boundHandleKeydown: (e: KeyboardEvent) => void;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._boundHandleKeydown = this._handleKeydown.bind(this);
  }

  connectedCallback() {
    if (!this._rendered) {
      this._render();
      this._rendered = true;
    }
    this.shadowRoot!.querySelector('.menu')?.addEventListener('keydown', this._boundHandleKeydown);
  }

  disconnectedCallback() {
    this.shadowRoot!.querySelector('.menu')?.removeEventListener('keydown', this._boundHandleKeydown);
  }

  private _render() {
    this.shadowRoot!.innerHTML = `
      <style>${menuStyles}</style>
      <div class="menu" role="menu" tabindex="-1">
        <slot></slot>
      </div>
    `;
  }

  private _getItems(): HTMLElement[] {
    const items: HTMLElement[] = [];
    this.querySelectorAll('elx-menu-item:not([disabled])').forEach(el => items.push(el as HTMLElement));
    return items;
  }

  private _handleKeydown(e: KeyboardEvent) {
    const items = this._getItems();
    if (items.length === 0) return;

    const current = items.indexOf(document.activeElement as HTMLElement);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = current < items.length - 1 ? current + 1 : 0;
      items[next].focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = current > 0 ? current - 1 : items.length - 1;
      items[prev].focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      items[0].focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      items[items.length - 1].focus();
    }
  }

  focusFirst() {
    const items = this._getItems();
    if (items.length > 0) items[0].focus();
  }

  focusLast() {
    const items = this._getItems();
    if (items.length > 0) items[items.length - 1].focus();
  }
}

export class ElxMenuItem extends HTMLElement {
  static observedAttributes = ['disabled', 'active'];

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

  get active(): boolean {
    return this.hasAttribute('active');
  }

  set active(val: boolean) {
    if (val) {
      this.setAttribute('active', '');
    } else {
      this.removeAttribute('active');
    }
  }

  attributeChangedCallback(_name: string, oldVal: string | null, newVal: string | null) {
    if (oldVal === newVal) return;
    if (_name === 'disabled') {
      this.setAttribute('tabindex', newVal !== null ? '-1' : '0');
    }
  }

  private _handleClick = () => {
    if (this.disabled) return;
    this.dispatchEvent(new CustomEvent('elx-menu-select', {
      bubbles: true,
      composed: true,
      detail: { value: this.getAttribute('value') || this.textContent?.trim() },
    }));
  };

  private _handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._handleClick();
    }
  };

  private _render() {
    this.shadowRoot!.innerHTML = `
      <style>${menuItemStyles}</style>
      <div class="menu-item" part="base">
        <slot name="prefix"></slot>
        <slot></slot>
        <slot name="suffix"></slot>
      </div>
    `;
  }
}

export class ElxMenuDivider extends HTMLElement {
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
  }

  private _render() {
    this.shadowRoot!.innerHTML = `
      <style>${menuDividerStyles}</style>
      <div class="divider"></div>
    `;
  }
}

export class ElxMenuGroup extends HTMLElement {
  static observedAttributes = ['label'];

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
    this.setAttribute('role', 'group');
  }

  get label(): string {
    return this.getAttribute('label') || '';
  }

  set label(val: string) {
    this.setAttribute('label', val);
  }

  attributeChangedCallback(_name: string, oldVal: string | null, newVal: string | null) {
    if (oldVal === newVal) return;
    if (_name === 'label') {
      const labelEl = this.shadowRoot?.querySelector('.label');
      if (labelEl) labelEl.textContent = newVal || '';
      if (newVal) {
        this.setAttribute('aria-label', newVal);
      } else {
        this.removeAttribute('aria-label');
      }
    }
  }

  private _render() {
    this.shadowRoot!.innerHTML = `
      <style>${menuGroupStyles}</style>
      <div class="label" aria-hidden="true">${this.label}</div>
      <slot></slot>
    `;
    if (this.label) {
      this.setAttribute('aria-label', this.label);
    }
  }
}

if (!customElements.get('elx-menu')) {
  customElements.define('elx-menu', ElxMenu);
}
if (!customElements.get('elx-menu-item')) {
  customElements.define('elx-menu-item', ElxMenuItem);
}
if (!customElements.get('elx-menu-divider')) {
  customElements.define('elx-menu-divider', ElxMenuDivider);
}
if (!customElements.get('elx-menu-group')) {
  customElements.define('elx-menu-group', ElxMenuGroup);
}
