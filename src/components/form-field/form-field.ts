export class ElxFormField extends HTMLElement {
  static observedAttributes = ['label', 'helper-text', 'error-text', 'required', 'disabled', 'size'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    if (!this.shadowRoot?.querySelector('.form-field')) this._buildDom();
    this._update();
  }

  attributeChangedCallback(_name: string, oldVal: string | null, newVal: string | null) {
    if (oldVal === newVal) return;
    this._update();
  }

  get label(): string { return this.getAttribute('label') || ''; }
  set label(val: string) { this.setAttribute('label', val); }

  get helperText(): string { return this.getAttribute('helper-text') || ''; }
  set helperText(val: string) { this.setAttribute('helper-text', val); }

  get errorText(): string { return this.getAttribute('error-text') || ''; }
  set errorText(val: string) { this.setAttribute('error-text', val); }

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
        display: block;
        width: 100%;
      }
      :host([disabled]) {
        opacity: 0.5;
        pointer-events: none;
      }

      .form-field {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .label-row {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .label-text {
        font-weight: 500;
        color: var(--elx-color-neutral-700, #404040);
        line-height: 1.4;
      }

      .label-text.sm { font-size: 12px; }
      .label-text.md { font-size: 14px; }
      .label-text.lg { font-size: 16px; }

      .required-indicator {
        color: var(--elx-color-danger-500, #ef4444);
        font-weight: 600;
      }

      .helper-text {
        font-size: 12px;
        color: var(--elx-color-neutral-500, #737373);
        line-height: 1.4;
      }

      .error-text {
        font-size: 12px;
        color: var(--elx-color-danger-500, #ef4444);
        line-height: 1.4;
      }

      :host([error-text]:not([error-text=""])) .form-field {
        /* Error state visual cue */
      }

      ::slotted(*) {
        width: 100%;
      }
    `;

    const wrapper = document.createElement('div');
    wrapper.className = 'form-field';
    wrapper.setAttribute('role', 'group');

    const labelRow = document.createElement('div');
    labelRow.className = 'label-row';

    const label = document.createElement('label');
    label.className = 'label-text';

    const asterisk = document.createElement('span');
    asterisk.className = 'required-indicator';
    asterisk.textContent = '*';
    asterisk.setAttribute('aria-hidden', 'true');

    labelRow.appendChild(label);
    labelRow.appendChild(asterisk);

    const slot = document.createElement('slot');

    const helper = document.createElement('div');
    helper.className = 'helper-text';
    helper.setAttribute('role', 'note');

    const error = document.createElement('div');
    error.className = 'error-text';
    error.setAttribute('role', 'alert');
    error.setAttribute('aria-live', 'polite');

    wrapper.appendChild(labelRow);
    wrapper.appendChild(slot);
    wrapper.appendChild(helper);
    wrapper.appendChild(error);

    this.shadowRoot!.appendChild(style);
    this.shadowRoot!.appendChild(wrapper);
  }

  private _update() {
    const label = this.shadowRoot?.querySelector('.label-text') as HTMLLabelElement;
    const labelRow = this.shadowRoot?.querySelector('.label-row') as HTMLElement;
    const asterisk = this.shadowRoot?.querySelector('.required-indicator') as HTMLElement;
    const helper = this.shadowRoot?.querySelector('.helper-text') as HTMLElement;
    const error = this.shadowRoot?.querySelector('.error-text') as HTMLElement;
    const wrapper = this.shadowRoot?.querySelector('.form-field') as HTMLElement;
    if (!label || !wrapper) return;

    label.className = `label-text ${this.size}`;
    label.textContent = this.label;

    if (labelRow) labelRow.style.display = this.label ? 'flex' : 'none';
    if (asterisk) asterisk.style.display = this.required ? 'inline' : 'none';

    if (helper) {
      helper.textContent = this.helperText;
      helper.style.display = this.helperText && !this.errorText ? 'block' : 'none';
    }

    if (error) {
      error.textContent = this.errorText;
      error.style.display = this.errorText ? 'block' : 'none';
    }

    if (this.label) {
      wrapper.setAttribute('aria-label', this.label);
    } else {
      wrapper.removeAttribute('aria-label');
    }
  }
}

if (!customElements.get('elx-form-field')) {
  customElements.define('elx-form-field', ElxFormField);
}
