/**
 * ElxAspectRatio - A container that maintains a consistent aspect ratio
 * Useful for responsive images, videos, and other media
 */
export class ElxAspectRatio extends HTMLElement {
  private _ratio = 16 / 9;

  static observedAttributes = ['ratio'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback(): void {
    this._buildDom();
  }

  attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    this._parseRatio(newValue);
    this._updateStyle();
  }

  get ratio(): number {
    return this._ratio;
  }

  set ratio(value: number) {
    if (value > 0) {
      this._ratio = value;
      this.setAttribute('ratio', String(value));
      this._updateStyle();
    }
  }

  private _parseRatio(value: string | null): void {
    if (!value) {
      this._ratio = 16 / 9;
      return;
    }

    // Try parsing as "width/height" format first (e.g., "16/9", "4/3")
    const parts = value.split('/');
    if (parts.length === 2) {
      const width = parseFloat(parts[0]);
      const height = parseFloat(parts[1]);
      if (!isNaN(width) && !isNaN(height) && width > 0 && height > 0) {
        this._ratio = width / height;
        return;
      }
    }

    // Try parsing as number
    const num = parseFloat(value);
    if (!isNaN(num) && num > 0) {
      this._ratio = num;
      return;
    }

    // Default fallback
    this._ratio = 16 / 9;
  }

  private _buildDom(): void {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: relative;
          width: 100%;
        }

        .aspect-ratio {
          position: relative;
          width: 100%;
          padding-bottom: ${100 / this._ratio}%;
        }

        .content {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
        }

        ::slotted(*) {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        ::slotted(img),
        ::slotted(video) {
          object-fit: var(--elx-aspect-ratio-object-fit, cover);
          object-position: var(--elx-aspect-ratio-object-position, center);
        }
      </style>
      <div class="aspect-ratio">
        <div class="content">
          <slot></slot>
        </div>
      </div>
    `;
  }

  private _updateStyle(): void {
    const wrapper = this.shadowRoot?.querySelector('.aspect-ratio') as HTMLElement;
    if (wrapper) {
      wrapper.style.paddingBottom = `${100 / this._ratio}%`;
    }
  }
}

// Guard against duplicate registration
if (!customElements.get('elx-aspect-ratio')) {
  customElements.define('elx-aspect-ratio', ElxAspectRatio);
}

declare global {
  interface HTMLElementTagNameMap {
    'elx-aspect-ratio': ElxAspectRatio;
  }
}
