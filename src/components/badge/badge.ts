const VALID_VARIANTS = ['solid', 'soft', 'outline'] as const;
const VALID_COLORS = ['gray', 'red', 'green', 'blue', 'yellow', 'purple'] as const;
const VALID_SIZES = ['sm', 'md', 'lg'] as const;

type Variant = typeof VALID_VARIANTS[number];
type Color = typeof VALID_COLORS[number];
type Size = typeof VALID_SIZES[number];

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
    return (VALID_VARIANTS as readonly string[]).indexOf(val as string) !== -1 ? (val as Variant) : 'solid';
  }
  set variant(val: string) { this.setAttribute('variant', val); }

  get color(): Color {
    const val = this.getAttribute('color');
    return (VALID_COLORS as readonly string[]).indexOf(val as string) !== -1 ? (val as Color) : 'gray';
  }
  set color(val: string) { this.setAttribute('color', val); }

  get size(): Size {
    const val = this.getAttribute('size');
    return (VALID_SIZES as readonly string[]).indexOf(val as string) !== -1 ? (val as Size) : 'md';
  }
  set size(val: string) { this.setAttribute('size', val); }

  private _buildDom() {
    const style = document.createElement('style');
    style.textContent = `
      :host { display: inline-block; }

      .badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-family: inherit;
        font-weight: 500;
        border-radius: 9999px;
        white-space: nowrap;
        line-height: 1;
      }

      .badge.sm { font-size: 11px; padding: 2px 6px; }
      .badge.md { font-size: 12px; padding: 2px 8px; }
      .badge.lg { font-size: 13px; padding: 4px 10px; }

      /* Solid variants */
      .badge.solid.gray { background: #4b5563; color: #fff; }
      .badge.solid.red { background: #ef4444; color: #fff; }
      .badge.solid.green { background: #22c55e; color: #fff; }
      .badge.solid.blue { background: #3b82f6; color: #fff; }
      .badge.solid.yellow { background: #eab308; color: #fff; }
      .badge.solid.purple { background: #a855f7; color: #fff; }

      /* Soft variants */
      .badge.soft.gray { background: #f3f4f6; color: #4b5563; }
      .badge.soft.red { background: #fef2f2; color: #dc2626; }
      .badge.soft.green { background: #f0fdf4; color: #16a34a; }
      .badge.soft.blue { background: #eff6ff; color: #2563eb; }
      .badge.soft.yellow { background: #fefce8; color: #ca8a04; }
      .badge.soft.purple { background: #faf5ff; color: #9333ea; }

      /* Outline variants */
      .badge.outline.gray { background: transparent; color: #4b5563; border: 1px solid #d1d5db; }
      .badge.outline.red { background: transparent; color: #dc2626; border: 1px solid #fca5a5; }
      .badge.outline.green { background: transparent; color: #16a34a; border: 1px solid #86efac; }
      .badge.outline.blue { background: transparent; color: #2563eb; border: 1px solid #93c5fd; }
      .badge.outline.yellow { background: transparent; color: #ca8a04; border: 1px solid #fde047; }
      .badge.outline.purple { background: transparent; color: #9333ea; border: 1px solid #d8b4fe; }
    `;

    this._span = document.createElement('span');
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
