const VALID_ORIENTATIONS = ['horizontal', 'vertical'] as const;
type Orientation = typeof VALID_ORIENTATIONS[number];

export class ElxSeparator extends HTMLElement {
  static observedAttributes = ['orientation'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this._buildDom();
  }

  attributeChangedCallback(name: string, oldVal: string, newVal: string) {
    if (oldVal === newVal) return;
    if (name === 'orientation') {
      this._updateOrientation();
    }
  }

  get orientation(): Orientation {
    const val = this.getAttribute('orientation') as Orientation;
    return VALID_ORIENTATIONS.includes(val) ? val : 'horizontal';
  }
  set orientation(val: Orientation) {
    this.setAttribute('orientation', val);
  }

  private _buildDom() {
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
      }

      :host([orientation="vertical"]) {
        display: inline-block;
        height: inherit;
        vertical-align: middle;
      }

      .separator {
        border: none;
        background-color: #e5e7eb;
      }

      .separator.horizontal {
        width: 100%;
        height: 1px;
      }

      .separator.vertical {
        width: 1px;
        height: 100%;
      }
    `;

    const separator = document.createElement('div');
    separator.className = `separator ${this.orientation}`;
    separator.setAttribute('role', 'separator');
    separator.setAttribute('aria-orientation', this.orientation);

    this.shadowRoot!.appendChild(style);
    this.shadowRoot!.appendChild(separator);
  }

  private _updateOrientation() {
    const separator = this.shadowRoot?.querySelector('.separator');
    if (!separator) return;
    
    separator.className = `separator ${this.orientation}`;
    separator.setAttribute('aria-orientation', this.orientation);
  }
}

if (!customElements.get('elx-separator')) {
  customElements.define('elx-separator', ElxSeparator);
}