const VALID_SIZES = ['sm', 'md', 'lg'] as const;
const VALID_TYPES = ['text', 'password', 'email', 'number', 'tel', 'url', 'search'] as const;

type Size = (typeof VALID_SIZES)[number];
type InputType = (typeof VALID_TYPES)[number];

let uid = 0;

export class ElxInput extends HTMLElement {
  static observedAttributes = [
    'type',
    'size',
    'disabled',
    'readonly',
    'placeholder',
    'value',
    'name',
    'required',
    'error',
    'label',
  ];

  private _input: HTMLInputElement | null = null;
  private _label: HTMLLabelElement | null = null;
  private _inputId: string = `elx-input-${++uid}`;

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

  get type(): InputType {
    const val = this.getAttribute('type');
    return (VALID_TYPES as readonly string[]).indexOf(val as string) !== -1
      ? (val as InputType)
      : 'text';
  }

  set type(val: string) {
    this.setAttribute('type', val);
  }

  get size(): Size {
    const val = this.getAttribute('size');
    return (VALID_SIZES as readonly string[]).indexOf(val as string) !== -1 ? (val as Size) : 'md';
  }

  set size(val: string) {
    this.setAttribute('size', val);
  }

  get value(): string {
    return this._input?.value ?? this.getAttribute('value') ?? '';
  }

  set value(val: string) {
    if (this._input) this._input.value = val;
    this.setAttribute('value', val);
  }

  get name(): string {
    return this.getAttribute('name') ?? '';
  }
  set name(val: string) {
    this.setAttribute('name', val);
  }

  get placeholder(): string {
    return this.getAttribute('placeholder') ?? '';
  }
  set placeholder(val: string) {
    this.setAttribute('placeholder', val);
  }

  get disabled(): boolean {
    return this.hasAttribute('disabled');
  }
  set disabled(val: boolean) {
    val ? this.setAttribute('disabled', '') : this.removeAttribute('disabled');
  }

  get readonly(): boolean {
    return this.hasAttribute('readonly');
  }
  set readonly(val: boolean) {
    val ? this.setAttribute('readonly', '') : this.removeAttribute('readonly');
  }

  get required(): boolean {
    return this.hasAttribute('required');
  }
  set required(val: boolean) {
    val ? this.setAttribute('required', '') : this.removeAttribute('required');
  }

  get error(): boolean {
    return this.hasAttribute('error');
  }
  set error(val: boolean) {
    val ? this.setAttribute('error', '') : this.removeAttribute('error');
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
      :host { display: block; }
      .input-wrapper { display: flex; flex-direction: column; gap: 4px; }
      label { font-size: 14px; font-weight: var(--elx-font-weight-medium); color: var(--elx-color-neutral-700); }
      input {
        font-family: var(--elx-font-family-sans);
        border: 1px solid var(--elx-color-neutral-300);
        border-radius: var(--elx-radius-lg);
        background: var(--elx-color-white);
        color: var(--elx-color-neutral-800);
        transition: border-color 0.15s ease, box-shadow 0.15s ease;
        width: 100%;
        box-sizing: border-box;
      }
      input:focus, input:focus-visible {
        outline: none;
        border-color: var(--elx-color-primary-600);
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
      }
      input:disabled { background: var(--elx-color-neutral-100); color: var(--elx-color-neutral-400); cursor: not-allowed; }
      input:read-only { background: var(--elx-color-neutral-50); }
      input.error { border-color: var(--elx-color-danger-600); }
      input.error:focus { border-color: var(--elx-color-danger-600); box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1); }
      input.sm { padding: 6px 10px; font-size: 13px; }
      input.md { padding: 8px 12px; font-size: 14px; }
      input.lg { padding: 12px 16px; font-size: 16px; }
      input::placeholder { color: var(--elx-color-neutral-400); }
    `;

    const wrapper = document.createElement('div');
    wrapper.className = 'input-wrapper';

    this._label = document.createElement('label');
    this._label.style.display = 'none';
    this._label.htmlFor = this._inputId;

    this._input = document.createElement('input');
    this._input.id = this._inputId;

    wrapper.appendChild(this._label);
    wrapper.appendChild(this._input);
    this.shadowRoot!.appendChild(style);
    this.shadowRoot!.appendChild(wrapper);

    this._input.addEventListener('input', () => {
      this.dispatchEvent(
        new CustomEvent('input', {
          detail: { value: this._input!.value },
          bubbles: true,
          composed: true,
        }),
      );
    });

    this._input.addEventListener('change', () => {
      this.dispatchEvent(
        new CustomEvent('change', {
          detail: { value: this._input!.value },
          bubbles: true,
          composed: true,
        }),
      );
    });

    this._input.addEventListener('focus', () => {
      this.dispatchEvent(new CustomEvent('focus', { bubbles: true, composed: true }));
    });

    this._input.addEventListener('blur', () => {
      this.dispatchEvent(new CustomEvent('blur', { bubbles: true, composed: true }));
    });
  }

  private _update() {
    if (!this._input) return;

    this._input.type = this.type;
    this._input.name = this.name;
    this._input.placeholder = this.placeholder;
    this._input.disabled = this.disabled;
    this._input.readOnly = this.readonly;
    this._input.required = this.required;

    // aria-invalid for error state
    if (this.error) {
      this._input.setAttribute('aria-invalid', 'true');
    } else {
      this._input.removeAttribute('aria-invalid');
    }

    // aria-required
    if (this.required) {
      this._input.setAttribute('aria-required', 'true');
    } else {
      this._input.removeAttribute('aria-required');
    }

    // Only sync value if attribute changed (prevents cursor jump)
    const attrVal = this.getAttribute('value') ?? '';
    if (this._input.value !== attrVal) {
      this._input.value = attrVal;
    }

    // Safe class update
    this._input.className = `${this.size}${this.error ? ' error' : ''}`;

    // Label
    const labelText = this.getAttribute('label');
    if (labelText) {
      this._label!.style.display = 'block';
      this._label!.textContent = labelText;
    } else {
      this._label!.style.display = 'none';
    }
  }
}

if (!customElements.get('elx-input')) {
  customElements.define('elx-input', ElxInput);
}
