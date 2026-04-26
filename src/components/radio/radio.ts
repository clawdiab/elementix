const VALID_SIZES = ['sm', 'md', 'lg'] as const;
type Size = (typeof VALID_SIZES)[number];

let uid = 0;

export class ElxRadio extends HTMLElement {
  static observedAttributes = ['checked', 'disabled', 'size', 'label', 'name', 'value'];

  private _input: HTMLInputElement | null = null;
  private _labelEl: HTMLLabelElement | null = null;
  private _dot: HTMLSpanElement | null = null;
  private _id: string = `elx-radio-${++uid}`;

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

  get checked(): boolean {
    return this.hasAttribute('checked');
  }
  set checked(val: boolean) {
    val ? this.setAttribute('checked', '') : this.removeAttribute('checked');
  }

  get disabled(): boolean {
    return this.hasAttribute('disabled');
  }
  set disabled(val: boolean) {
    val ? this.setAttribute('disabled', '') : this.removeAttribute('disabled');
  }

  get size(): Size {
    const val = this.getAttribute('size');
    return (VALID_SIZES as readonly string[]).indexOf(val as string) !== -1 ? (val as Size) : 'md';
  }
  set size(val: string) {
    this.setAttribute('size', val);
  }

  get name(): string {
    return this.getAttribute('name') ?? '';
  }
  set name(val: string) {
    this.setAttribute('name', val);
  }

  get value(): string {
    return this.getAttribute('value') ?? '';
  }
  set value(val: string) {
    this.setAttribute('value', val);
  }

  get label(): string {
    return this.getAttribute('label') ?? '';
  }
  set label(val: string) {
    this.setAttribute('label', val);
  }

  focus() {
    this._input?.focus();
  }
  blur() {
    this._input?.blur();
  }

  private _buildDom() {
    const style = document.createElement('style');
    style.textContent = `
      :host { display: inline-block; }

      label {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        user-select: none;
        font-family: var(--elx-font-family-sans);
        color: var(--elx-color-neutral-800);
      }
      label.disabled { cursor: not-allowed; color: var(--elx-color-neutral-400); }

      input {
        position: absolute;
        width: 1px; height: 1px;
        padding: 0; margin: -1px;
        overflow: hidden;
        clip: rect(0,0,0,0);
        white-space: nowrap; border: 0;
      }

      .radio-circle {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 2px solid var(--elx-color-neutral-300);
        border-radius: 50%;
        background: var(--elx-color-white);
        transition: all 0.15s ease;
        flex-shrink: 0;
      }
      .radio-circle.sm { width: 14px; height: 14px; }
      .radio-circle.md { width: 18px; height: 18px; }
      .radio-circle.lg { width: 22px; height: 22px; }

      .radio-circle.checked { border-color: var(--elx-color-primary-600); }
      .radio-circle.disabled { background: var(--elx-color-neutral-100); border-color: var(--elx-color-neutral-200); }
      .radio-circle.checked.disabled { border-color: #93c5fd; }

      .dot {
        border-radius: 50%;
        background: var(--elx-color-primary-600);
        display: none;
      }
      .dot.visible { display: block; }
      .dot.sm { width: 6px; height: 6px; }
      .dot.md { width: 8px; height: 8px; }
      .dot.lg { width: 10px; height: 10px; }
      .dot.disabled { background: #93c5fd; }

      input:focus-visible + .radio-circle {
        box-shadow: 0 0 0 3px rgba(37,99,235,0.3);
        border-color: var(--elx-color-primary-600);
      }

      .label-text.sm { font-size: 13px; }
      .label-text.md { font-size: 14px; }
      .label-text.lg { font-size: 16px; }
    `;

    this._labelEl = document.createElement('label');
    this._labelEl.setAttribute('part', 'label');
    this._labelEl.htmlFor = this._id;

    this._input = document.createElement('input');
    this._input.setAttribute('part', 'input');
    this._input.type = 'radio';
    this._input.id = this._id;

    const circle = document.createElement('span');
    circle.className = 'radio-circle';

    this._dot = document.createElement('span');
    this._dot.className = 'dot';
    circle.appendChild(this._dot);

    const labelText = document.createElement('span');
    labelText.className = 'label-text';

    this._labelEl.appendChild(this._input);
    this._labelEl.appendChild(circle);
    this._labelEl.appendChild(labelText);

    this.shadowRoot!.appendChild(style);
    this.shadowRoot!.appendChild(this._labelEl);

    this._input.addEventListener('change', () => {
      if (this.disabled) return;
      this.setAttribute('checked', '');
      // Uncheck siblings in same group
      this._uncheckSiblings();
      this.dispatchEvent(
        new CustomEvent('change', {
          detail: { value: this.value, name: this.name },
          bubbles: true,
          composed: true,
        }),
      );
    });
  }

  private _uncheckSiblings() {
    const parent = this.parentElement;
    if (!parent) return;
    const siblings = parent.querySelectorAll(`elx-radio[name="${this.name}"]`);
    siblings.forEach((sib) => {
      if (sib !== this && sib.hasAttribute('checked')) {
        sib.removeAttribute('checked');
      }
    });
  }

  private _update() {
    if (!this._input) return;

    const size = this.size;
    const isChecked = this.checked;
    const isDisabled = this.disabled;

    this._input.checked = isChecked;
    this._input.disabled = isDisabled;
    this._input.name = this.name;
    this._input.value = this.value;

    const circle = this.shadowRoot!.querySelector('.radio-circle') as HTMLSpanElement;
    if (circle) {
      circle.className = `radio-circle ${size}${isChecked ? ' checked' : ''}${isDisabled ? ' disabled' : ''}`;
    }

    if (this._dot) {
      this._dot.className = `dot ${size}${isChecked ? ' visible' : ''}${isDisabled ? ' disabled' : ''}`;
    }

    this._labelEl!.className = isDisabled ? 'disabled' : '';

    const labelSpan = this.shadowRoot!.querySelector('.label-text') as HTMLElement;
    if (labelSpan) {
      labelSpan.className = `label-text ${size}`;
      labelSpan.textContent = this.label;
      labelSpan.style.display = this.label ? 'inline' : 'none';
    }
  }
}

export class ElxRadioGroup extends HTMLElement {
  static observedAttributes = ['name', 'value', 'disabled', 'orientation'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this._buildDom();
    this._propagateAttrs();
    this.addEventListener('change', this._handleChange.bind(this) as EventListener);
  }

  attributeChangedCallback() {
    this._propagateAttrs();
  }

  get name(): string {
    return this.getAttribute('name') ?? '';
  }
  set name(val: string) {
    this.setAttribute('name', val);
  }

  get value(): string {
    return this.getAttribute('value') ?? '';
  }
  set value(val: string) {
    this.setAttribute('value', val);
    this._syncChecked();
  }

  get disabled(): boolean {
    return this.hasAttribute('disabled');
  }
  set disabled(val: boolean) {
    val ? this.setAttribute('disabled', '') : this.removeAttribute('disabled');
  }

  get orientation(): string {
    return this.getAttribute('orientation') ?? 'vertical';
  }
  set orientation(val: string) {
    this.setAttribute('orientation', val);
  }

  private _buildDom() {
    const style = document.createElement('style');
    style.textContent = `
      :host { display: block; }
      ::slotted(*) { display: block; }
      :host([orientation="horizontal"]) ::slotted(*) { display: inline-block; margin-right: 16px; }
    `;
    const slot = document.createElement('slot');
    this.shadowRoot!.appendChild(style);
    this.shadowRoot!.appendChild(slot);
  }

  private _propagateAttrs() {
    const radios = this.querySelectorAll('elx-radio');
    radios.forEach((radio) => {
      if (this.name) radio.setAttribute('name', this.name);
      if (this.disabled) radio.setAttribute('disabled', '');
    });
    this._syncChecked();
  }

  private _syncChecked() {
    const radios = this.querySelectorAll('elx-radio');
    radios.forEach((radio) => {
      if (radio.getAttribute('value') === this.value) {
        radio.setAttribute('checked', '');
      } else {
        radio.removeAttribute('checked');
      }
    });
  }

  private _handleChange(e: CustomEvent) {
    if (e.detail?.value) {
      this.setAttribute('value', e.detail.value);
    }
  }
}

if (!customElements.get('elx-radio')) {
  customElements.define('elx-radio', ElxRadio);
}
if (!customElements.get('elx-radio-group')) {
  customElements.define('elx-radio-group', ElxRadioGroup);
}
