export class ElxButton extends HTMLElement {
  static observedAttributes = ['variant', 'size', 'disabled'];

  private _variant: string = 'primary';
  private _size: string = 'md';

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  get variant() {
    return this.getAttribute('variant') || 'primary';
  }

  set variant(val: string) {
    this.setAttribute('variant', val);
  }

  get size() {
    return this.getAttribute('size') || 'md';
  }

  set size(val: string) {
    this.setAttribute('size', val);
  }

  private render() {
    const disabled = this.hasAttribute('disabled');

    this.shadowRoot!.innerHTML = `
      <style>
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

        /* Sizes */
        button.sm {
          padding: 6px 12px;
          font-size: 13px;
        }

        button.md {
          padding: 8px 16px;
          font-size: 14px;
        }

        button.lg {
          padding: 12px 24px;
          font-size: 16px;
        }

        /* Variants */
        button.primary {
          background: #2563eb;
          color: #fff;
        }

        button.primary:hover:not(:disabled) {
          background: #1d4ed8;
        }

        button.secondary {
          background: #e5e7eb;
          color: #1f2937;
        }

        button.secondary:hover:not(:disabled) {
          background: #d1d5db;
        }

        button.danger {
          background: #dc2626;
          color: #fff;
        }

        button.danger:hover:not(:disabled) {
          background: #b91c1c;
        }

        button.ghost {
          background: transparent;
          color: #2563eb;
        }

        button.ghost:hover:not(:disabled) {
          background: #eff6ff;
        }
      </style>
      <button
        class="${this.variant} ${this.size}"
        ${disabled ? 'disabled' : ''}
        role="button"
        aria-disabled="${disabled}"
      >
        <slot></slot>
      </button>
    `;
  }
}

customElements.define('elx-button', ElxButton);
