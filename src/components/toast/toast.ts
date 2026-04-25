const VALID_VARIANTS = ['info', 'success', 'warning', 'error'] as const;

type Variant = (typeof VALID_VARIANTS)[number];

const ICONS: Record<Variant, string> = {
  info: 'ℹ️',
  success: '✓',
  warning: '⚠',
  error: '✕',
};

export class ElxToast extends HTMLElement {
  static observedAttributes = ['variant', 'duration', 'dismissible', 'open'];

  private _timer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this._buildDom();
    this._update();
  }

  disconnectedCallback() {
    this._clearTimer();
    const closeBtn = this.shadowRoot?.querySelector('.close-btn');
    closeBtn?.removeEventListener('click', this._onClose);
  }

  attributeChangedCallback(_name: string) {
    if (_name === 'open') {
      this._handleOpenChange();
    }
    this._update();
  }

  get variant(): Variant {
    const val = this.getAttribute('variant');
    return (VALID_VARIANTS as readonly string[]).indexOf(val as string) !== -1
      ? (val as Variant)
      : 'info';
  }
  set variant(val: string) {
    this.setAttribute('variant', val);
  }

  get duration(): number {
    const val = parseInt(this.getAttribute('duration') ?? '');
    return isNaN(val) ? 5000 : val;
  }
  set duration(val: number) {
    this.setAttribute('duration', String(val));
  }

  get dismissible(): boolean {
    return this.hasAttribute('dismissible');
  }
  set dismissible(val: boolean) {
    val ? this.setAttribute('dismissible', '') : this.removeAttribute('dismissible');
  }

  get open(): boolean {
    return this.hasAttribute('open');
  }
  set open(val: boolean) {
    val ? this.setAttribute('open', '') : this.removeAttribute('open');
  }

  show() {
    this.open = true;
  }

  hide() {
    this.open = false;
  }

  private _handleOpenChange() {
    this._clearTimer();
    if (this.open && this.duration > 0) {
      this._timer = setTimeout(() => this.hide(), this.duration);
    }
    if (!this.open) {
      this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
    }
  }

  private _clearTimer() {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
  }

  private _onClose = () => {
    this.hide();
  };

  private _buildDom() {
    const style = document.createElement('style');
    style.textContent = `
      :host { display: none; }
      :host([open]) { display: block; }

      .toast {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 16px;
        border-radius: var(--elx-radius-lg, 8px);
        font-family: var(--elx-font-family-sans, sans-serif);
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        pointer-events: auto;
      }

      .toast.info { background: var(--elx-color-primary-50); border: 1px solid var(--elx-color-primary-100); color: var(--elx-color-primary-700); }
      .toast.success { background: var(--elx-color-success-50); border: 1px solid var(--elx-color-success-500, #a7f3d0); color: var(--elx-color-success-700); }
      .toast.warning { background: var(--elx-color-warning-50); border: 1px solid var(--elx-color-warning-100); color: var(--elx-color-warning-700); }
      .toast.error { background: var(--elx-color-danger-50); border: 1px solid var(--elx-color-danger-500, #fecaca); color: var(--elx-color-danger-700); }

      .icon { flex-shrink: 0; font-size: 16px; line-height: 1; }
      .content { flex: 1; min-width: 0; }
      .close-btn {
        flex-shrink: 0;
        background: transparent;
        border: none;
        cursor: pointer;
        font-size: 16px;
        color: inherit;
        padding: 0;
        line-height: 1;
        opacity: 0.7;
      }
      .close-btn:hover { opacity: 1; }
      .close-btn:not(.visible) { display: none; }
    `;

    const container = document.createElement('div');
    container.className = 'toast';
    container.setAttribute('role', 'alert');
    container.setAttribute('aria-atomic', 'true');

    const icon = document.createElement('span');
    icon.className = 'icon';

    const content = document.createElement('div');
    content.className = 'content';
    const slot = document.createElement('slot');
    content.appendChild(slot);

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'close-btn';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.textContent = '✕';
    closeBtn.addEventListener('click', this._onClose);

    container.appendChild(icon);
    container.appendChild(content);
    container.appendChild(closeBtn);

    this.shadowRoot!.appendChild(style);
    this.shadowRoot!.appendChild(container);
  }

  private _update() {
    const container = this.shadowRoot?.querySelector('.toast');
    if (!container) return;

    container.className = `toast ${this.variant}`;
    const liveValue = this.variant === 'error' || this.variant === 'warning' ? 'assertive' : 'polite';
    container.setAttribute('aria-live', liveValue);

    const icon = container.querySelector('.icon');
    if (icon) icon.textContent = ICONS[this.variant];

    const closeBtn = container.querySelector('.close-btn');
    if (closeBtn) {
      closeBtn.classList.toggle('visible', this.dismissible);
    }
  }
}

export class ElxToastContainer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this._buildDom();
  }

  get position(): string {
    const val = this.getAttribute('position');
    const valid = [
      'top-right',
      'top-left',
      'top-center',
      'bottom-right',
      'bottom-left',
      'bottom-center',
    ];
    return valid.includes(val ?? '') ? val! : 'top-right';
  }
  set position(val: string) {
    this.setAttribute('position', val);
  }

  toast(message: string, options: { variant?: string; duration?: number; dismissible?: boolean } = {}) {
    const toast = document.createElement('elx-toast') as ElxToast;
    toast.variant = options.variant ?? 'info';
    toast.duration = options.duration ?? 5000;
    if (options.dismissible !== false) toast.dismissible = true;
    toast.textContent = message;
    toast.addEventListener('close', () => toast.remove(), { once: true });
    this.appendChild(toast);
    // Trigger show after append so connectedCallback runs first
    requestAnimationFrame(() => toast.show());
    return toast;
  }

  private _buildDom() {
    const style = document.createElement('style');
    style.textContent = `
      :host {
        position: fixed;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 16px;
        pointer-events: none;
        max-width: 420px;
        width: 100%;
      }

      :host([position="top-right"]), :host(:not([position])) { top: 0; right: 0; }
      :host([position="top-left"]) { top: 0; left: 0; }
      :host([position="top-center"]) { top: 0; left: 50%; transform: translateX(-50%); }
      :host([position="bottom-right"]) { bottom: 0; right: 0; }
      :host([position="bottom-left"]) { bottom: 0; left: 0; }
      :host([position="bottom-center"]) { bottom: 0; left: 50%; transform: translateX(-50%); }
    `;

    const slot = document.createElement('slot');
    this.shadowRoot!.appendChild(style);
    this.shadowRoot!.appendChild(slot);
  }
}

if (!customElements.get('elx-toast')) {
  customElements.define('elx-toast', ElxToast);
}
if (!customElements.get('elx-toast-container')) {
  customElements.define('elx-toast-container', ElxToastContainer);
}
