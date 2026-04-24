const VALID_SIZES = ['sm', 'md', 'lg'] as const;
const VALID_TYPES = ['text', 'password', 'email', 'number', 'tel', 'url', 'search'] as const;

type Size = typeof VALID_SIZES[number];
type InputType = typeof VALID_TYPES[number];

export class ElxInput extends HTMLElement {
  static observedAttributes = ['type', 'size', 'disabled', 'readonly', 'placeholder', 'value', 'name', 'required', 'error'];

  private _input: HTMLInputElement | null = null;
  private _label: HTMLLabelElement | null = null;

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
    return (VALID_TYPES as readonly string[]).indexOf(val as string) !== -1 ? (val as InputType) : 'text';
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
    if (this._input) {
      this._input.value = val;
    }
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
    if (val) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }
  }

  get readonly(): boolean {
    return this.hasAttribute('readonly');
  }

  set readonly(val: boolean) {
    if (val) {
      this.setAttribute('readonly', '');
    } else {
      this.removeAttribute('readonly');
    }
  }

  get required(): boolean {
    return this.hasAttribute('required');
  }

  set required(val: boolean) {
    if (val) {
      this.setAttribute('required', '');
    } else {
      this.removeAttribute('required');
    }
  }

  get error(): boolean {
    return this.hasAttribute('error');
  }

  set error(val: boolean) {
    if (val) {
      this.setAttribute('error', '');
    } else {
      this.removeAttribute('error');
    }
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
      :host {
        display: block;
      }

      .input-wrapper {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      label {
        font-size: 14px;
        font-weight: 500;
        color: #374151;
      }

      input {
        font-family: inherit;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        background: #fff;
        color: #1f2937;
        transition: border-color 0.15s ease, box-shadow 0.15s ease;
        width: 100%;
      }

      input:focus {
        outline: none;
        border-color: #2563eb;
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
      }

      input:focus-visible {
        outline: none;
        border-color: #2563eb;
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
      }

      input:disabled {
        background: #f3f4f6;
        color: #9ca3af;
        cursor: not-allowed;
      }

      input:read-only {
        background: #f9fafb;
      }

      input.error {
        border-color: #dc2626;
      }

      input.error:focus {
        border-color: #dc2626;
        box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
      }

      /* Sizes */
      input.sm { padding: 6px 10px; font-size: 13px; }
      input.md { padding: 8px 12px; font-size: 14px; }
      input.lg { padding: 12px 16px; font-size: 16px; }

      input::placeholder {
        color: #9ca3af;
      }
    `;

    const wrapper = document.createElement('div');
    wrapper.className = 'input-wrapper';

    this._label = document.createElement('label');
    this._label.style.display = 'none';

    this._input = document.createElement('input');

    wrapper.appendChild(this._label);
    wrapper.appendChild(this._input);

    this.shadowRoot!.appendChild(style);
    this.shadowRoot!.appendChild(wrapper);

    // Event forwarding
    this._input.addEventListener('input', (e) => {
      this.dispatchEvent(new CustomEvent('input', { 
        detail: { value: this._input!.value },
        bubbles: true,
        composed: true
      }));
    });

    this._input.addEventListener('change', (e) => {
      this.dispatchEvent(new CustomEvent('change', { 
        detail: { value: this._input!.value },
        bubbles: true,
        composed: true
      }));
    });

    this._input.addEventListener('focus', (e) => {
      this.dispatchEvent(new CustomEvent('focus', { bubbles: true, composed: true }));
    });

    this._input.addEventListener('blur', (e) => {
      this.dispatchEvent(new CustomEvent('blur', { bubbles: true, composed: true }));
    });
  }

  private _update() {
    if (!this._input) return;

    const size = this.size;
    const hasError = this.error;

    this._input.type = this.type;
    this._input.name = this.name;
    this._input.placeholder = this.placeholder;
    this._input.disabled = this.disabled;
    this._input.readOnly = this.readonly;
    this._input.required = this.required;

    // Update value only if different (prevents cursor jump)
    if (this._input.value !== (this.getAttribute('value') ?? '')) {
      this._input.value = this.getAttribute('value') ?? '';
    }

    // Safe class update
    this._input.className = `${size}${hasError ? ' error' : ''}`;

    // Update label visibility
    const labelText = this.getAttribute('label');
    if (labelText) {
      this._label!.style.display = 'block';
      this._label!.textContent = labelText;
      this._label!.htmlFor = this._input.id || '';
    } else {
      this._label!.style.display = 'none';
    }
  }
}

if (!customElements.get('elx-input')) {
  customElements.define('elx-input', ElxInput);
}
