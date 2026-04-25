const VALID_VARIANTS = ['elevated', 'outlined', 'filled'] as const;
const VALID_PADDINGS = ['none', 'sm', 'md', 'lg'] as const;

type Variant = typeof VALID_VARIANTS[number];
type Padding = typeof VALID_PADDINGS[number];

export class ElxCard extends HTMLElement {
  static observedAttributes = ['variant', 'padding', 'interactive'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() { this._buildDom(); this._update(); }
  attributeChangedCallback() { this._update(); }

  get variant(): Variant {
    const val = this.getAttribute('variant');
    return (VALID_VARIANTS as readonly string[]).indexOf(val as string) !== -1 ? (val as Variant) : 'elevated';
  }
  set variant(val: string) { this.setAttribute('variant', val); }

  get padding(): Padding {
    const val = this.getAttribute('padding');
    return (VALID_PADDINGS as readonly string[]).indexOf(val as string) !== -1 ? (val as Padding) : 'md';
  }
  set padding(val: string) { this.setAttribute('padding', val); }

  get interactive(): boolean { return this.hasAttribute('interactive'); }
  set interactive(val: boolean) { val ? this.setAttribute('interactive', '') : this.removeAttribute('interactive'); }

  private _buildDom() {
    const style = document.createElement('style');
    style.textContent = `
      :host { display: block; }

      .card {
        border-radius: var(--elx-radius-lg);
        font-family: var(--elx-font-family-sans);
        transition: box-shadow 0.15s ease, transform 0.15s ease;
      }

      .card.elevated {
        background: var(--elx-color-white);
        box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08);
      }
      .card.outlined {
        background: var(--elx-color-white);
        border: 1px solid var(--elx-color-neutral-200);
      }
      .card.filled {
        background: var(--elx-color-neutral-100);
      }

      .card.pad-none { padding: 0; }
      .card.pad-sm { padding: 8px; }
      .card.pad-md { padding: 16px; }
      .card.pad-lg { padding: 24px; }

      .card.interactive { cursor: pointer; }
      .card.interactive:hover {
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transform: translateY(-1px);
      }
      .card.interactive:active {
        transform: translateY(0);
      }

      :host(:focus-visible) .card.interactive {
        outline: 2px solid var(--elx-color-primary-500);
        outline-offset: 2px;
      }

      ::slotted([slot="header"]) {
        margin-bottom: 8px;
      }
      ::slotted([slot="footer"]) {
        margin-top: 12px;
      }
    `;

    const wrapper = document.createElement('div');
    wrapper.className = 'card';

    const headerSlot = document.createElement('slot');
    headerSlot.name = 'header';

    const defaultSlot = document.createElement('slot');

    const footerSlot = document.createElement('slot');
    footerSlot.name = 'footer';

    wrapper.appendChild(headerSlot);
    wrapper.appendChild(defaultSlot);
    wrapper.appendChild(footerSlot);

    this.shadowRoot!.appendChild(style);
    this.shadowRoot!.appendChild(wrapper);
  }

  private _update() {
    const wrapper = this.shadowRoot?.querySelector('.card');
    if (!wrapper) return;

    wrapper.className = `card ${this.variant} pad-${this.padding}${this.interactive ? ' interactive' : ''}`;

    if (this.interactive) {
      this.setAttribute('role', 'button');
      this.setAttribute('tabindex', '0');
    } else {
      this.removeAttribute('role');
      this.removeAttribute('tabindex');
    }
  }
}

if (!customElements.get('elx-card')) {
  customElements.define('elx-card', ElxCard);
}
