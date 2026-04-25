const VALID_VARIANTS = ['info', 'success', 'warning', 'error'] as const;

type Variant = typeof VALID_VARIANTS[number];

const ICONS: Record<Variant, string> = {
  info: 'ℹ️',
  success: '✓',
  warning: '⚠',
  error: '✕'
};

export class ElxAlert extends HTMLElement {
  static observedAttributes = ['variant', 'dismissible'];

  private _closeBtn: HTMLButtonElement | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() { this._buildDom(); this._update(); }
  disconnectedCallback() { this._closeBtn?.removeEventListener('click', this._onClose); }

  attributeChangedCallback() { this._update(); }

  get variant(): Variant {
    const val = this.getAttribute('variant');
    return (VALID_VARIANTS as readonly string[]).indexOf(val as string) !== -1 ? (val as Variant) : 'info';
  }
  set variant(val: string) { this.setAttribute('variant', val); }

  get dismissible(): boolean { return this.hasAttribute('dismissible'); }
  set dismissible(val: boolean) { val ? this.setAttribute('dismissible', '') : this.removeAttribute('dismissible'); }

  private _onClose = () => {
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
    this.remove();
  };

  private _buildDom() {
    const style = document.createElement('style');
    style.textContent = `
      :host { display: block; }

      .alert {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 12px 16px;
        border-radius: var(--elx-radius-lg);
        font-family: var(--elx-font-family-sans);
        font-size: 14px;
      }

      .alert.info { background: var(--elx-color-primary-50); border: 1px solid var(--elx-color-primary-100); color: var(--elx-color-primary-700); }
      .alert.success { background: var(--elx-color-success-50); border: 1px solid var(--elx-color-success-500, #a7f3d0); color: var(--elx-color-success-700); }
      .alert.warning { background: var(--elx-color-warning-50); border: 1px solid var(--elx-color-warning-100); color: var(--elx-color-warning-700); }
      .alert.error { background: var(--elx-color-danger-50); border: 1px solid var(--elx-color-danger-500, #fecaca); color: var(--elx-color-danger-700); }

      .icon { flex-shrink: 0; font-size: 16px; line-height: 1; }
      .content { flex: 1; min-width: 0; }
      .close-btn {
        flex-shrink: 0;
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 0;
        font-size: 16px;
        line-height: 1;
        opacity: 0.6;
        color: inherit;
      }
      .close-btn:hover { opacity: 1; }
    `;

    const wrapper = document.createElement('div');
    wrapper.className = 'alert';

    const icon = document.createElement('span');
    icon.className = 'icon';

    const content = document.createElement('div');
    content.className = 'content';
    const slot = document.createElement('slot');
    content.appendChild(slot);

    this._closeBtn = document.createElement('button');
    this._closeBtn.className = 'close-btn';
    this._closeBtn.type = 'button';
    this._closeBtn.setAttribute('aria-label', 'Dismiss alert');
    this._closeBtn.addEventListener('click', this._onClose);

    wrapper.appendChild(icon);
    wrapper.appendChild(content);
    wrapper.appendChild(this._closeBtn);

    this.shadowRoot!.appendChild(style);
    this.shadowRoot!.appendChild(wrapper);
  }

  private _update() {
    const wrapper = this.shadowRoot?.querySelector('.alert');
    const icon = this.shadowRoot?.querySelector('.icon');
    if (!wrapper || !icon) return;

    const variant = this.variant;
    wrapper.className = `alert ${variant}`;
    icon.textContent = ICONS[variant];

    if (this.dismissible) {
      this._closeBtn!.style.display = 'block';
      this._closeBtn!.textContent = '✕';
    } else {
      this._closeBtn!.style.display = 'none';
    }
  }
}

if (!customElements.get('elx-alert')) {
  customElements.define('elx-alert', ElxAlert);
}
