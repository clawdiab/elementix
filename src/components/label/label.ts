export class ElxLabel extends HTMLElement {
  static observedAttributes = ['for', 'required', 'disabled', 'size'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    if (!this.shadowRoot?.querySelector('.label')) this._buildDom();
    this._update();
  }

  attributeChangedCallback(_name: string, oldVal: string | null, newVal: string | null) {
    if (oldVal === newVal) return;
    this._update();
  }

  get for(): string { return this.getAttribute('for') || ''; }
  set for(val: string) { this.setAttribute('for', val); }

  get required(): boolean { return this.hasAttribute('required'); }
  set required(val: boolean) { val ? this.setAttribute('required', '') : this.removeAttribute('required'); }

  get disabled(): boolean { return this.hasAttribute('disabled'); }
  set disabled(val: boolean) { val ? this.setAttribute('disabled', '') : this.removeAttribute('disabled'); }

  get size(): string { return this.getAttribute('size') || 'md'; }
  set size(val: string) { this.setAttribute('size', val); }

  private _buildDom() {
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }
      :host([disabled]) {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .label {
        font-weight: 500;
        color: var(--elx-color-neutral-700, #404040);
        cursor: default;
        user-select: none;
        line-height: 1.4;
      }

      .label.sm { font-size: 12px; }
      .label.md { font-size: 14px; }
      .label.lg { font-size: 16px; }

      .required-indicator {
        color: var(--elx-color-danger-500, #ef4444);
        font-weight: 600;
      }
    `;

    const label = document.createElement('label');
    label.className = 'label';

    const slot = document.createElement('slot');
    label.appendChild(slot);

    const asterisk = document.createElement('span');
    asterisk.className = 'required-indicator';
    asterisk.textContent = '*';
    asterisk.setAttribute('aria-hidden', 'true');

    this.shadowRoot!.appendChild(style);
    this.shadowRoot!.appendChild(label);
    this.shadowRoot!.appendChild(asterisk);
  }

  private _update() {
    const label = this.shadowRoot?.querySelector('.label') as HTMLLabelElement;
    const asterisk = this.shadowRoot?.querySelector('.required-indicator') as HTMLElement;
    if (!label) return;

    label.className = `label ${this.size}`;
    if (this.for) {
      label.setAttribute('for', this.for);
    } else {
      label.removeAttribute('for');
    }

    if (asterisk) {
      asterisk.style.display = this.required ? 'inline' : 'none';
    }
  }
}

if (!customElements.get('elx-label')) {
  customElements.define('elx-label', ElxLabel);
}
