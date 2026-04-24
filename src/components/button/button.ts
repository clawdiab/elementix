const VALID_VARIANTS = ['primary', 'secondary', 'danger', 'ghost'] as const;
const VALID_SIZES = ['sm', 'md', 'lg'] as const;

type Variant = typeof VALID_VARIANTS[number];
type Size = typeof VALID_SIZES[number];

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
        font-family: inherit;
        cursor: pointer;
        border: none;
        border-radius: 6px;
        font-weight: 500;
        transition: background-color 0.15s ease, opacity 0.15s ease;
        line-height: 1;
      }

      button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      button:focus-visible {
        outline: 2px solid #2563eb;
        outline-offset: 2px;
      }

      /* Sizes */
      button.sm { padding: 6px 12px; font-size: 13px; }
      button.md { padding: 8px 16px; font-size: 14px; }
      button.lg { padding: 12px 24px; font-size: 16px; }

      /* Variants */
      button.primary { background: #2563eb; color: #fff; }
      button.primary:hover:not(:disabled) { background: #1d4ed8; }

      button.secondary { background: #e5e7eb; color: #1f2937; }
      button.secondary:hover:not(:disabled) { background: #d1d5db; }

      button.danger { background: #dc2626; color: #fff; }
      button.danger:hover:not(:disabled) { background: #b91c1c; }

      button.ghost { background: transparent; color: #2563eb; }
      button.ghost:hover:not(:disabled) { background: #eff6ff; }
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
