export class ElxPopover extends HTMLElement {
  static observedAttributes = ['open', 'position', 'disabled'];

  private _onClickOutside: (e: Event) => void;
  private _onKeydown: (e: KeyboardEvent) => void;
  private _contentId = `elx-popover-${Math.random().toString(36).slice(2, 9)}`;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._onClickOutside = (e: Event) => this._handleClickOutside(e);
    this._onKeydown = (e: KeyboardEvent) => this._handleKeydown(e);
  }

  connectedCallback() {
    if (!this.shadowRoot?.querySelector('.content')) this._buildDom();
    this._update();
    document.addEventListener('click', this._onClickOutside);
    document.addEventListener('keydown', this._onKeydown as EventListener);
  }

  disconnectedCallback() {
    document.removeEventListener('click', this._onClickOutside);
    document.removeEventListener('keydown', this._onKeydown);
    const triggerSlot = this.shadowRoot?.querySelector('slot[name="trigger"]');
    if (triggerSlot) {
      triggerSlot.removeEventListener('click', this._onTriggerClick);
      triggerSlot.removeEventListener('keydown', this._onTriggerKeydown as EventListener);
    }
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

  get position(): string {
    return this.getAttribute('position') || 'bottom';
  }
  set position(val: string) {
    this.setAttribute('position', val);
  }

  get disabled(): boolean {
    return this.hasAttribute('disabled');
  }
  set disabled(val: boolean) {
    val ? this.setAttribute('disabled', '') : this.removeAttribute('disabled');
  }

  show() {
    if (!this.disabled) {
      this.open = true;
      this.dispatchEvent(new CustomEvent('open', { bubbles: true, composed: true }));
      const content = this.shadowRoot?.querySelector('.content') as HTMLElement;
      content?.focus();
    }
  }

  hide() {
    this.open = false;
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
  }

  toggle() {
    this.open ? this.hide() : this.show();
  }

  private _handleClickOutside(e: Event) {
    if (!this.open) return;
    const path = e.composedPath();
    if (path.indexOf(this) === -1) {
      this.hide();
    }
  }

  private _handleKeydown(e: KeyboardEvent) {
    if (!this.open) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      this.hide();
      const trigger = this.querySelector('[slot="trigger"]') as HTMLElement;
      trigger?.focus();
    }
  }

  private _onTriggerClick = (e: Event) => {
    if (this.disabled) return;
    e.preventDefault();
    this.toggle();
  };

  private _onTriggerKeydown = (e: KeyboardEvent) => {
    if (this.disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.toggle();
    }
  };

  private _getPositionStyles(pos: string): string {
    const positions: Record<string, string> = {
      top: 'bottom: 100%; left: 50%; transform: translateX(-50%); margin-bottom: 8px;',
      'top-start': 'bottom: 100%; left: 0; margin-bottom: 8px;',
      'top-end': 'bottom: 100%; right: 0; margin-bottom: 8px;',
      bottom: 'top: 100%; left: 50%; transform: translateX(-50%); margin-top: 8px;',
      'bottom-start': 'top: 100%; left: 0; margin-top: 8px;',
      'bottom-end': 'top: 100%; right: 0; margin-top: 8px;',
      left: 'right: 100%; top: 50%; transform: translateY(-50%); margin-right: 8px;',
      right: 'left: 100%; top: 50%; transform: translateY(-50%); margin-left: 8px;',
    };
    return positions[pos] || positions['bottom'];
  }

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

      .content {
        position: absolute;
        min-width: 200px;
        padding: 12px 16px;
        background: var(--elx-color-neutral-0, #fff);
        border: 1px solid var(--elx-color-neutral-200, #e5e5e5);
        border-radius: var(--elx-radius-lg, 8px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transition: opacity 150ms ease, visibility 150ms;
      }

      :host([open]) .content {
        opacity: 1;
        visibility: visible;
      }

      :host([disabled]) {
        opacity: 0.5;
        pointer-events: none;
      }

      ::slotted([slot="trigger"]) {
        cursor: pointer;
      }
    `;

    const trigger = document.createElement('div');
    trigger.setAttribute('part', 'trigger');
    trigger.className = 'trigger';
    const triggerSlot = document.createElement('slot');
    triggerSlot.name = 'trigger';
    trigger.appendChild(triggerSlot);

    const content = document.createElement('div');
    content.setAttribute('part', 'content');
    content.className = 'content';
    content.id = this._contentId;
    content.setAttribute('tabindex', '-1');
    content.setAttribute('role', 'dialog');
    content.setAttribute('aria-modal', 'false');
    const contentSlot = document.createElement('slot');
    content.appendChild(contentSlot);

    this.shadowRoot!.appendChild(style);
    this.shadowRoot!.appendChild(trigger);
    this.shadowRoot!.appendChild(content);

    triggerSlot.addEventListener('click', this._onTriggerClick);
    triggerSlot.addEventListener('keydown', this._onTriggerKeydown as EventListener);
  }

  private _update() {
    const content = this.shadowRoot?.querySelector('.content') as HTMLElement;
    if (content) {
      content.setAttribute('aria-hidden', String(!this.open));
      content.style.cssText = this._getPositionStyles(this.position);
    }
    const trigger = this.querySelector('[slot="trigger"]') as HTMLElement;
    if (trigger) {
      trigger.setAttribute('aria-haspopup', 'dialog');
      trigger.setAttribute('aria-expanded', String(this.open));
      trigger.setAttribute('aria-controls', this._contentId);
    }
  }
}

if (!customElements.get('elx-popover')) {
  customElements.define('elx-popover', ElxPopover);
}
