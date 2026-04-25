const VALID_VARIANTS = ['primary', 'secondary', 'danger', 'ghost'] as const;
const VALID_SIZES = ['sm', 'md', 'lg'] as const;

type Variant = (typeof VALID_VARIANTS)[number];
type Size = (typeof VALID_SIZES)[number];

export class ElxButton extends HTMLElement {
  static observedAttributes = ['variant', 'size', 'disabled'];

  private _button: HTMLButtonElement | null = null;
  private _slot: HTMLSlotElement | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this._buildDom();
    this._update();
  }

  attributeChangedCallback() {
    this._update();
  }

  get variant(): Variant {
    const val = this.getAttribute('variant');
    return VALID_VARIANTS.includes(val as Variant) ? (val as Variant) : 'primary';
  }

  set variant(val: string) {
    this.setAttribute('variant', val);
  }

  get size(): Size {
    const val = this.getAttribute('size');
    return VALID_SIZES.includes(val as Size) ? (val as Size) : 'md';
  }

  set size(val: string) {
    this.setAttribute('size', val);
  }

  private _buildDom() {
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: inline-block;
      }

      button {
        font-family: var(--elx-font-family-sans);
        cursor: pointer;
        border: none;
        border-radius: var(--elx-radius-lg);
        font-weight: var(--elx-font-weight-medium);
        transition: background-color 0.15s ease, opacity 0.15s ease;
        line-height: 1;
      }

      button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      button:focus-visible {
        outline: 2px solid var(--elx-color-primary-600);
        outline-offset: 2px;
      }

      /* Sizes */
      button.sm { padding: 6px 12px; font-size: 13px; }
      button.md { padding: 8px 16px; font-size: 14px; }
      button.lg { padding: 12px 24px; font-size: 16px; }

      /* Variants */
      button.primary { background: var(--elx-color-primary-600); color: var(--elx-color-white); }
      button.primary:hover:not(:disabled) { background: var(--elx-color-primary-700); }

      button.secondary { background: var(--elx-color-neutral-200); color: var(--elx-color-neutral-800); }
      button.secondary:hover:not(:disabled) { background: var(--elx-color-neutral-300); }

      button.danger { background: var(--elx-color-danger-600); color: var(--elx-color-white); }
      button.danger:hover:not(:disabled) { background: var(--elx-color-danger-700); }

      button.ghost { background: transparent; color: var(--elx-color-primary-600); }
      button.ghost:hover:not(:disabled) { background: var(--elx-color-primary-50); }
    `;

    this._button = document.createElement('button');
    this._button.type = 'button';

    this._slot = document.createElement('slot');
    this._button.appendChild(this._slot);

    this.shadowRoot!.appendChild(style);
    this.shadowRoot!.appendChild(this._button);
  }

  private _update() {
    if (!this._button) return;

    const disabled = this.hasAttribute('disabled');

    // Safe class update — only whitelisted values
    this._button.className = `${this.variant} ${this.size}`;
    this._button.disabled = disabled;
    this._button.setAttribute('aria-disabled', String(disabled));
  }
}

if (!customElements.get('elx-button')) {
  customElements.define('elx-button', ElxButton);
}
