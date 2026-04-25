const VALID_SIZES = ['sm', 'md', 'lg'] as const;
type Size = (typeof VALID_SIZES)[number];

let uid = 0;

export class ElxCheckbox extends HTMLElement {
  static observedAttributes = [
    'checked',
    'disabled',
    'indeterminate',
    'size',
    'label',
    'name',
    'value',
  ];

  private _input: HTMLInputElement | null = null;
  private _labelEl: HTMLLabelElement | null = null;
  private _checkmark: HTMLSpanElement | null = null;
  private _id: string = `elx-checkbox-${++uid}`;

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

  get indeterminate(): boolean {
    return this.hasAttribute('indeterminate');
  }
  set indeterminate(val: boolean) {
    val ? this.setAttribute('indeterminate', '') : this.removeAttribute('indeterminate');
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
    return this.getAttribute('value') ?? 'on';
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

      .checkbox-box {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 2px solid var(--elx-color-neutral-300);
        border-radius: var(--elx-radius-md);
        background: var(--elx-color-white);
        transition: all 0.15s ease;
        flex-shrink: 0;
      }

      .checkbox-box.sm { width: 14px; height: 14px; }
      .checkbox-box.md { width: 18px; height: 18px; }
      .checkbox-box.lg { width: 22px; height: 22px; }

      .checkbox-box.checked {
        background: var(--elx-color-primary-600);
        border-color: var(--elx-color-primary-600);
      }

      .checkbox-box.indeterminate {
        background: var(--elx-color-primary-600);
        border-color: var(--elx-color-primary-600);
      }

      .checkbox-box.disabled {
        background: var(--elx-color-neutral-100);
        border-color: var(--elx-color-neutral-200);
      }

      .checkbox-box.checked.disabled {
        background: #93c5fd;
        border-color: #93c5fd;
      }

      .checkmark {
        display: none;
        color: var(--elx-color-white);
      }

      .checkmark.visible { display: block; }

      .checkmark svg { display: block; }

      .label-text.sm { font-size: 13px; }
      .label-text.md { font-size: 14px; }
      .label-text.lg { font-size: 16px; }

      input {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }

      input:focus-visible + .checkbox-box {
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.3);
        border-color: var(--elx-color-primary-600);
      }
    `;

    this._labelEl = document.createElement('label');
    this._labelEl.htmlFor = this._id;

    this._input = document.createElement('input');
    this._input.type = 'checkbox';
    this._input.id = this._id;

    const box = document.createElement('span');
    box.className = 'checkbox-box';

    this._checkmark = document.createElement('span');
    this._checkmark.className = 'checkmark';

    box.appendChild(this._checkmark);

    const labelText = document.createElement('span');
    labelText.className = 'label-text';

    this._labelEl.appendChild(this._input);
    this._labelEl.appendChild(box);
    this._labelEl.appendChild(labelText);

    this.shadowRoot!.appendChild(style);
    this.shadowRoot!.appendChild(this._labelEl);

    this._input.addEventListener('change', () => {
      if (this.disabled) return;
      this.removeAttribute('indeterminate');
      if (this._input!.checked) {
        this.setAttribute('checked', '');
      } else {
        this.removeAttribute('checked');
      }
      this.dispatchEvent(
        new CustomEvent('change', {
          detail: { checked: this.checked, value: this.value },
          bubbles: true,
          composed: true,
        }),
      );
    });
  }

  private _update() {
    if (!this._input) return;

    const size = this.size;
    const isChecked = this.checked;
    const isDisabled = this.disabled;
    const isIndeterminate = this.indeterminate;

    this._input.checked = isChecked;
    this._input.disabled = isDisabled;
    this._input.name = this.name;
    this._input.value = this.value;
    this._input.indeterminate = isIndeterminate;

    // aria
    if (isIndeterminate) {
      this._input.setAttribute('aria-checked', 'mixed');
    } else {
      this._input.removeAttribute('aria-checked');
    }

    // checkbox box
    const box = this.shadowRoot!.querySelector('.checkbox-box') as HTMLSpanElement;
    if (box) {
      box.className = `checkbox-box ${size}${isChecked ? ' checked' : ''}${isDisabled ? ' disabled' : ''}${isIndeterminate ? ' indeterminate' : ''}`;
    }

    // checkmark SVG
    if (this._checkmark) {
      if (isIndeterminate) {
        this._checkmark.className = 'checkmark visible';
        this._checkmark.innerHTML = '';
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', size === 'sm' ? '8' : size === 'lg' ? '14' : '10');
        svg.setAttribute('height', size === 'sm' ? '8' : size === 'lg' ? '14' : '10');
        svg.setAttribute('viewBox', '0 0 10 10');
        svg.setAttribute('fill', 'none');
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', '2');
        line.setAttribute('y1', '5');
        line.setAttribute('x2', '8');
        line.setAttribute('y2', '5');
        line.setAttribute('stroke', 'currentColor');
        line.setAttribute('stroke-width', '2');
        line.setAttribute('stroke-linecap', 'round');
        svg.appendChild(line);
        this._checkmark.appendChild(svg);
      } else if (isChecked) {
        this._checkmark.className = 'checkmark visible';
        this._checkmark.innerHTML = '';
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', size === 'sm' ? '8' : size === 'lg' ? '14' : '10');
        svg.setAttribute('height', size === 'sm' ? '8' : size === 'lg' ? '14' : '10');
        svg.setAttribute('viewBox', '0 0 10 10');
        svg.setAttribute('fill', 'none');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M2 5L4.5 7.5L8 2.5');
        path.setAttribute('stroke', 'currentColor');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');
        svg.appendChild(path);
        this._checkmark.appendChild(svg);
      } else {
        this._checkmark.className = 'checkmark';
        this._checkmark.innerHTML = '';
      }
    }

    // label
    this._labelEl!.className = isDisabled ? 'disabled' : '';
    const labelSpan = this.shadowRoot!.querySelector('.label-text') as HTMLSpanElement;
    if (labelSpan) {
      labelSpan.className = `label-text ${size}`;
      labelSpan.textContent = this.label;
      labelSpan.style.display = this.label ? 'inline' : 'none';
    }
  }
}

if (!customElements.get('elx-checkbox')) {
  customElements.define('elx-checkbox', ElxCheckbox);
}
