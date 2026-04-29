export class ElxHoverCard extends HTMLElement {
  static observedAttributes = ['open', 'position', 'open-delay', 'close-delay', 'disabled'];

  private _contentId = `elx-hover-card-${Math.random().toString(36).slice(2, 9)}`;
  private _openTimer: ReturnType<typeof setTimeout> | null = null;
  private _closeTimer: ReturnType<typeof setTimeout> | null = null;
  private _onKeydown: (e: KeyboardEvent) => void;
  private _onClickOutside: (e: Event) => void;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._onKeydown = (e: KeyboardEvent) => this._handleKeydown(e);
    this._onClickOutside = (e: Event) => this._handleClickOutside(e);
  }

  connectedCallback() {
    if (!this.shadowRoot!.querySelector('.content')) this._buildDom();
    this._update();
    document.addEventListener('keydown', this._onKeydown);
    document.addEventListener('click', this._onClickOutside);
  }

  disconnectedCallback() {
    this._clearTimers();
    document.removeEventListener('keydown', this._onKeydown);
    document.removeEventListener('click', this._onClickOutside);
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

  get openDelay(): number {
    return Number(this.getAttribute('open-delay')) || 200;
  }
  set openDelay(val: number) {
    this.setAttribute('open-delay', String(val));
  }

  get closeDelay(): number {
    return Number(this.getAttribute('close-delay')) || 300;
  }
  set closeDelay(val: number) {
    this.setAttribute('close-delay', String(val));
  }

  get disabled(): boolean {
    return this.hasAttribute('disabled');
  }
  set disabled(val: boolean) {
    val ? this.setAttribute('disabled', '') : this.removeAttribute('disabled');
  }

  show() {
    if (this.disabled) return;
    this._clearTimers();
    this.open = true;
    this.dispatchEvent(new CustomEvent('open', { bubbles: true, composed: true }));
  }

  hide() {
    this._clearTimers();
    this.open = false;
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
  }

  private _clearTimers() {
    if (this._openTimer) { clearTimeout(this._openTimer); this._openTimer = null; }
    if (this._closeTimer) { clearTimeout(this._closeTimer); this._closeTimer = null; }
  }

  private _scheduleOpen() {
    if (this.disabled || this.open) return;
    this._clearTimers();
    this._openTimer = setTimeout(() => this.show(), this.openDelay);
  }

  private _scheduleClose() {
    if (!this.open) return;
    this._clearTimers();
    this._closeTimer = setTimeout(() => this.hide(), this.closeDelay);
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

  private _handleClickOutside(e: Event) {
    if (!this.open) return;
    const path = e.composedPath();
    if (path.indexOf(this) === -1) {
      this.hide();
    }
  }

  private _onTriggerMouseEnter = () => this._scheduleOpen();
  private _onTriggerMouseLeave = () => this._scheduleClose();
  private _onTriggerFocus = () => this._scheduleOpen();
  private _onTriggerBlur = () => this._scheduleClose();
  private _onContentMouseEnter = () => this._clearTimers();
  private _onContentMouseLeave = () => this._scheduleClose();

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
        min-width: var(--elx-hover-card-min-width, 260px);
        padding: var(--elx-hover-card-padding, 16px);
        background: var(--elx-color-neutral-0, #fff);
        border: 1px solid var(--elx-color-neutral-200, #e5e5e5);
        border-radius: var(--elx-radius-lg, 8px);
        box-shadow: var(--elx-hover-card-shadow, 0 4px 12px rgba(0, 0, 0, 0.15));
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

    // Hover events on trigger
    trigger.addEventListener('mouseenter', this._onTriggerMouseEnter);
    trigger.addEventListener('mouseleave', this._onTriggerMouseLeave);
    triggerSlot.addEventListener('focus', this._onTriggerFocus, true);
    triggerSlot.addEventListener('blur', this._onTriggerBlur, true);

    // Keep card open when hovering content
    content.addEventListener('mouseenter', this._onContentMouseEnter);
    content.addEventListener('mouseleave', this._onContentMouseLeave);
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

if (!customElements.get('elx-hover-card')) {
  customElements.define('elx-hover-card', ElxHoverCard);
}

declare global {
  interface HTMLElementTagNameMap {
    'elx-hover-card': ElxHoverCard;
  }
}
