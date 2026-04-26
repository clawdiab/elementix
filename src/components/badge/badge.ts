const VALID_VARIANTS = ['solid', 'soft', 'outline'] as const;
const VALID_COLORS = ['gray', 'red', 'green', 'blue', 'yellow', 'purple'] as const;
const VALID_SIZES = ['sm', 'md', 'lg'] as const;

type Variant = (typeof VALID_VARIANTS)[number];
type Color = (typeof VALID_COLORS)[number];
type Size = (typeof VALID_SIZES)[number];

export class ElxBadge extends HTMLElement {
  static observedAttributes = ['variant', 'color', 'size'];

  private _span: HTMLSpanElement | null = null;

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
    return (VALID_VARIANTS as readonly string[]).indexOf(val as string) !== -1
      ? (val as Variant)
      : 'solid';
  }
  set variant(val: string) {
    this.setAttribute('variant', val);
  }

  get color(): Color {
    const val = this.getAttribute('color');
    return (VALID_COLORS as readonly string[]).indexOf(val as string) !== -1
      ? (val as Color)
      : 'gray';
  }
  set color(val: string) {
    this.setAttribute('color', val);
  }

  get size(): Size {
    const val = this.getAttribute('size');
    return (VALID_SIZES as readonly string[]).indexOf(val as string) !== -1 ? (val as Size) : 'md';
  }
  set size(val: string) {
    this.setAttribute('size', val);
  }

  private _buildDom() {
    const style = document.createElement('style');
    style.textContent = `
      :host { display: inline-block; }

      .badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-family: var(--elx-font-family-sans);
        font-weight: var(--elx-font-weight-medium);
        border-radius: var(--elx-radius-full);
        white-space: nowrap;
        line-height: 1;
      }

      .badge.sm { font-size: 11px; padding: 2px 6px; }
      .badge.md { font-size: 12px; padding: 2px 8px; }
      .badge.lg { font-size: 13px; padding: 4px 10px; }

      /* Solid variants */
      .badge.solid.gray { background: var(--elx-color-neutral-600); color: var(--elx-color-white); }
      .badge.solid.red { background: var(--elx-color-danger-500); color: var(--elx-color-white); }
      .badge.solid.green { background: var(--elx-color-success-500); color: var(--elx-color-white); }
      .badge.solid.blue { background: var(--elx-color-primary-500); color: var(--elx-color-white); }
      .badge.solid.yellow { background: var(--elx-color-warning-500); color: var(--elx-color-white); }
      .badge.solid.purple { background: var(--elx-color-purple-500); color: var(--elx-color-white); }

      /* Soft variants */
      .badge.soft.gray { background: var(--elx-color-neutral-100); color: var(--elx-color-neutral-600); }
      .badge.soft.red { background: var(--elx-color-danger-50); color: var(--elx-color-danger-600); }
      .badge.soft.green { background: var(--elx-color-success-50); color: var(--elx-color-success-600); }
      .badge.soft.blue { background: var(--elx-color-primary-50); color: var(--elx-color-primary-600); }
      .badge.soft.yellow { background: var(--elx-color-warning-50); color: var(--elx-color-warning-600); }
      .badge.soft.purple { background: var(--elx-color-purple-50); color: var(--elx-color-purple-600); }

      /* Outline variants */
      .badge.outline.gray { background: transparent; color: var(--elx-color-neutral-600); border: 1px solid var(--elx-color-neutral-300); }
      .badge.outline.red { background: transparent; color: var(--elx-color-danger-600); border: 1px solid var(--elx-color-danger-500); }
      .badge.outline.green { background: transparent; color: var(--elx-color-success-600); border: 1px solid var(--elx-color-success-500); }
      .badge.outline.blue { background: transparent; color: var(--elx-color-primary-600); border: 1px solid var(--elx-color-primary-500); }
      .badge.outline.yellow { background: transparent; color: var(--elx-color-warning-600); border: 1px solid var(--elx-color-warning-500); }
      .badge.outline.purple { background: transparent; color: var(--elx-color-purple-600); border: 1px solid var(--elx-color-purple-500); }
    `;

    this._span = document.createElement('span');
    this._span.setAttribute('part', 'badge');
    this._span.className = 'badge';

    const slot = document.createElement('slot');

    this._span.appendChild(slot);
    this.shadowRoot!.appendChild(style);
    this.shadowRoot!.appendChild(this._span);
  }

  private _update() {
    if (!this._span) return;
    this._span.className = `badge ${this.size} ${this.variant} ${this.color}`;
  }
}

if (!customElements.get('elx-badge')) {
  customElements.define('elx-badge', ElxBadge);
}
