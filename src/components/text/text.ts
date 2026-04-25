const VALID_TAGS = ['h1', 'h2', 'h3', 'h4', 'p', 'span', 'small'] as const;
const VALID_SIZES = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl'] as const;
const VALID_WEIGHTS = ['normal', 'medium', 'semibold', 'bold'] as const;
const VALID_COLORS = ['default', 'muted', 'primary', 'danger', 'success'] as const;
const VALID_ALIGNS = ['left', 'center', 'right'] as const;

type Tag = typeof VALID_TAGS[number];
type Size = typeof VALID_SIZES[number];
type Weight = typeof VALID_WEIGHTS[number];
type Color = typeof VALID_COLORS[number];
type Align = typeof VALID_ALIGNS[number];

const DEFAULT_SIZES: Record<Tag, Size> = {
  h1: '4xl',
  h2: '3xl',
  h3: '2xl',
  h4: 'xl',
  p: 'base',
  span: 'base',
  small: 'sm',
};

const COLOR_MAP: Record<Color, string> = {
  default: 'var(--elx-color-neutral-900)',
  muted: 'var(--elx-color-neutral-500)',
  primary: 'var(--elx-color-primary-600)',
  danger: 'var(--elx-color-danger-600)',
  success: 'var(--elx-color-success-600)',
};

export class ElxText extends HTMLElement {
  static observedAttributes = ['as', 'size', 'weight', 'color', 'align'];

  private _element: HTMLElement | null = null;

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

  get as(): Tag {
    const val = this.getAttribute('as');
    return VALID_TAGS.includes(val as Tag) ? (val as Tag) : 'p';
  }

  set as(val: string) {
    this.setAttribute('as', val);
  }

  get size(): Size {
    const val = this.getAttribute('size');
    if (val && VALID_SIZES.includes(val as Size)) {
      return val as Size;
    }
    return DEFAULT_SIZES[this.as];
  }

  set size(val: string) {
    this.setAttribute('size', val);
  }

  get weight(): Weight {
    const val = this.getAttribute('weight');
    if (val && VALID_WEIGHTS.includes(val as Weight)) {
      return val as Weight;
    }
    // h1-h4 default to semibold
    if (['h1', 'h2', 'h3', 'h4'].includes(this.as)) {
      return 'semibold';
    }
    return 'normal';
  }

  set weight(val: string) {
    this.setAttribute('weight', val);
  }

  get color(): Color {
    const val = this.getAttribute('color');
    return VALID_COLORS.includes(val as Color) ? (val as Color) : 'default';
  }

  set color(val: string) {
    this.setAttribute('color', val);
  }

  get align(): Align {
    const val = this.getAttribute('align');
    return VALID_ALIGNS.includes(val as Align) ? (val as Align) : 'left';
  }

  set align(val: string) {
    this.setAttribute('align', val);
  }

  private _buildDom() {
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
      }

      ::slotted(*) {
        margin: 0;
      }
    `;

    this._element = document.createElement(this.as);
    this._element.appendChild(document.createElement('slot'));

    this.shadowRoot!.appendChild(style);
    this.shadowRoot!.appendChild(this._element);
  }

  private _update() {
    if (!this._element) return;

    // Update tag if 'as' changed
    if (this._element.tagName.toLowerCase() !== this.as) {
      const newElement = document.createElement(this.as);
      newElement.appendChild(document.createElement('slot'));
      this._element.replaceWith(newElement);
      this._element = newElement;
    }

    this._element.style.fontSize = `var(--elx-font-size-${this.size})`;
    this._element.style.fontWeight = `var(--elx-font-weight-${this.weight})`;
    this._element.style.color = COLOR_MAP[this.color];
    this._element.style.textAlign = this.align;
  }
}

if (!customElements.get('elx-text')) {
  customElements.define('elx-text', ElxText);
}
