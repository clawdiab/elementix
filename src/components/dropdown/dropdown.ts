export class ElxDropdown extends HTMLElement {
  static observedAttributes = ['open', 'disabled'];

  private _onClickOutside: (e: Event) => void;
  private _onKeydown: (e: KeyboardEvent) => void;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._onClickOutside = (e: Event) => this._handleClickOutside(e);
    this._onKeydown = (e: KeyboardEvent) => this._handleKeydown(e);
  }

  connectedCallback() {
    this._buildDom();
    this._update();
    document.addEventListener('click', this._onClickOutside);
    document.addEventListener('keydown', this._onKeydown);
  }

  disconnectedCallback() {
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

  get disabled(): boolean {
    return this.hasAttribute('disabled');
  }
  set disabled(val: boolean) {
    val ? this.setAttribute('disabled', '') : this.removeAttribute('disabled');
  }

  show() {
    if (!this.disabled) this.open = true;
  }

  hide() {
    this.open = false;
  }

  toggle() {
    this.open ? this.hide() : this.show();
  }

  private _handleClickOutside(e: Event) {
    if (!this.open) return;
    const target = e.target as Node;
    if (!this.contains(target)) {
      this.hide();
    }
  }

  private _handleKeydown(e: KeyboardEvent) {
    if (!this.open) return;
    if (e.key === 'Escape') {
      this.hide();
      this._focusTrigger();
    }
  }

  private _focusTrigger() {
    const trigger = this.querySelector('[slot="trigger"]') as HTMLElement;
    trigger?.focus();
  }

  private _onTriggerClick = (e: Event) => {
    e.preventDefault();
    if (this.disabled) return;
    this.toggle();
  };

  private _onTriggerKeydown = (e: KeyboardEvent) => {
    if (this.disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.toggle();
    }
    if (e.key === 'ArrowDown' && !this.open) {
      e.preventDefault();
      this.show();
    }
  };

  private _buildDom() {
    const style = document.createElement('style');
    style.textContent = `
      :host {
        position: relative;
        display: inline-block;
      }

      .trigger {
        display: contents;
      }

      .menu {
        position: absolute;
        top: 100%;
        left: 0;
        min-width: 180px;
        margin-top: 4px;
        padding: 4px 0;
        background: var(--elx-color-neutral-0, #fff);
        border: 1px solid var(--elx-color-neutral-200, #e5e5e5);
        border-radius: var(--elx-radius-lg, 8px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transform: translateY(-8px);
        transition: opacity 150ms ease, transform 150ms ease, visibility 150ms;
      }

      :host([open]) .menu {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }

      :host([disabled]) {
        opacity: 0.5;
        pointer-events: none;
      }

      ::slotted([slot="trigger"]) {
        cursor: pointer;
      }

      ::slotted(elx-dropdown-item) {
        display: block;
      }
    `;

    const trigger = document.createElement('div');
    trigger.className = 'trigger';
    const triggerSlot = document.createElement('slot');
    triggerSlot.name = 'trigger';
    trigger.appendChild(triggerSlot);

    const menu = document.createElement('div');
    menu.className = 'menu';
    menu.setAttribute('role', 'menu');
    menu.setAttribute('aria-orientation', 'vertical');
    const menuSlot = document.createElement('slot');
    menu.appendChild(menuSlot);

    this.shadowRoot!.appendChild(style);
    this.shadowRoot!.appendChild(trigger);
    this.shadowRoot!.appendChild(menu);

    // Attach event listeners to trigger slot
    triggerSlot.addEventListener('click', this._onTriggerClick);
    triggerSlot.addEventListener('keydown', this._onTriggerKeydown);
  }

  private _update() {
    const menu = this.shadowRoot?.querySelector('.menu');
    if (menu) {
      menu.setAttribute('aria-hidden', String(!this.open));
    }
  }
}

export class ElxDropdownItem extends HTMLElement {
  static observedAttributes = ['disabled'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this._buildDom();
    this._update();
    this.addEventListener('click', this._onClick);
    this.addEventListener('keydown', this._onKeydown);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this._onClick);
    this.removeEventListener('keydown', this._onKeydown);
  }

  attributeChangedCallback() {
    this._update();
  }

  get disabled(): boolean {
    return this.hasAttribute('disabled');
  }
  set disabled(val: boolean) {
    val ? this.setAttribute('disabled', '') : this.removeAttribute('disabled');
  }

  private _onClick = () => {
    if (this.disabled) return;
    this.dispatchEvent(new CustomEvent('select', { bubbles: true, composed: true }));
    // Close parent dropdown
    const dropdown = this.closest('elx-dropdown') as ElxDropdown;
    dropdown?.hide();
  };

  private _onKeydown = (e: KeyboardEvent) => {
    if (this.disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._onClick();
    }
  };

  private _buildDom() {
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
      }

      .item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        font-family: var(--elx-font-family-sans, sans-serif);
        font-size: 14px;
        color: var(--elx-color-neutral-900, #171717);
        cursor: pointer;
        transition: background-color 100ms ease;
      }

      .item:hover {
        background: var(--elx-color-neutral-100, #f5f5f5);
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

      .icon {
        flex-shrink: 0;
        width: 16px;
        height: 16px;
      }

      .content {
        flex: 1;
      }
    `;

    const item = document.createElement('div');
    item.className = 'item';
    item.setAttribute('role', 'menuitem');
    item.setAttribute('tabindex', '0');

    const icon = document.createElement('span');
    icon.className = 'icon';
    const iconSlot = document.createElement('slot');
    iconSlot.name = 'icon';
    icon.appendChild(iconSlot);

    const content = document.createElement('span');
    content.className = 'content';
    const contentSlot = document.createElement('slot');
    content.appendChild(contentSlot);

    item.appendChild(icon);
    item.appendChild(content);

    this.shadowRoot!.appendChild(style);
    this.shadowRoot!.appendChild(item);
  }

  private _update() {
    const item = this.shadowRoot?.querySelector('.item');
    if (item) {
      item.setAttribute('aria-disabled', String(this.disabled));
    }
  }
}

if (!customElements.get('elx-dropdown')) {
  customElements.define('elx-dropdown', ElxDropdown);
}
if (!customElements.get('elx-dropdown-item')) {
  customElements.define('elx-dropdown-item', ElxDropdownItem);
}
