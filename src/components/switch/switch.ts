const VALID_SIZES = ['sm', 'md', 'lg'] as const;
type Size = typeof VALID_SIZES[number];

let uid = 0;

export class ElxSwitch extends HTMLElement {
  static observedAttributes = ['checked', 'disabled', 'size', 'label', 'name', 'value'];

  private _input: HTMLInputElement | null = null;
  private _track: HTMLSpanElement | null = null;
  private _thumb: HTMLSpanElement | null = null;
  private _labelEl: HTMLLabelElement | null = null;
  private _id: string = `elx-switch-${++uid}`;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() { this._buildDom(); this._update(); }
  attributeChangedCallback() { this._update(); }

  get checked(): boolean { return this.hasAttribute('checked'); }
  set checked(val: boolean) { val ? this.setAttribute('checked', '') : this.removeAttribute('checked'); }

  get disabled(): boolean { return this.hasAttribute('disabled'); }
  set disabled(val: boolean) { val ? this.setAttribute('disabled', '') : this.removeAttribute('disabled'); }

  get size(): Size {
    const val = this.getAttribute('size');
    return (VALID_SIZES as readonly string[]).indexOf(val as string) !== -1 ? (val as Size) : 'md';
  }
  set size(val: string) { this.setAttribute('size', val); }

  get name(): string { return this.getAttribute('name') ?? ''; }
  set name(val: string) { this.setAttribute('name', val); }

  get value(): string { return this.getAttribute('value') ?? 'on'; }
  set value(val: string) { this.setAttribute('value', val); }

  get label(): string { return this.getAttribute('label') ?? ''; }
  set label(val: string) { this.setAttribute('label', val); }

  focus() { this._input?.focus(); }
  blur() { this._input?.blur(); }

  private _buildDom() {
    const style = document.createElement('style');
    style.textContent = `
      :host { display: inline-block; }

      label {
        display: inline-flex;
        align-items: center;
        gap: 10px;
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
        white-space: nowrap;
        border: 0;
      }

      .track {
        position: relative;
        border-radius: var(--elx-radius-full);
        background: var(--elx-color-neutral-300);
        transition: background 0.2s ease;
        flex-shrink: 0;
      }
      .track.sm { width: 32px; height: 18px; }
      .track.md { width: 44px; height: 24px; }
      .track.lg { width: 56px; height: 30px; }

      .track.checked { background: var(--elx-color-primary-600); }
      .track.disabled { opacity: 0.5; }

      .thumb {
        position: absolute;
        top: 2px; left: 2px;
        border-radius: 50%;
        background: var(--elx-color-white);
        box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        transition: transform 0.2s ease;
      }
      .thumb.sm { width: 14px; height: 14px; }
      .thumb.md { width: 20px; height: 20px; }
      .thumb.lg { width: 26px; height: 26px; }

      .thumb.sm.checked { transform: translateX(14px); }
      .thumb.md.checked { transform: translateX(20px); }
      .thumb.lg.checked { transform: translateX(26px); }

      input:focus-visible ~ .track {
        box-shadow: 0 0 0 3px rgba(37,99,235,0.3);
      }

      .label-text.sm { font-size: 13px; }
      .label-text.md { font-size: 14px; }
      .label-text.lg { font-size: 16px; }
    `;

    this._labelEl = document.createElement('label');
    this._labelEl.htmlFor = this._id;

    this._input = document.createElement('input');
    this._input.type = 'checkbox';
    this._input.id = this._id;
    this._input.setAttribute('role', 'switch');

    this._track = document.createElement('span');
    this._track.className = 'track';

    this._thumb = document.createElement('span');
    this._thumb.className = 'thumb';
    this._track.appendChild(this._thumb);

    const labelText = document.createElement('span');
    labelText.className = 'label-text';

    this._labelEl.appendChild(this._input);
    this._labelEl.appendChild(this._track);
    this._labelEl.appendChild(labelText);

    this.shadowRoot!.appendChild(style);
    this.shadowRoot!.appendChild(this._labelEl);

    this._input.addEventListener('change', () => {
      if (this.disabled) return;
      if (this._input!.checked) {
        this.setAttribute('checked', '');
      } else {
        this.removeAttribute('checked');
      }
      this.dispatchEvent(new CustomEvent('change', {
        detail: { checked: this.checked, value: this.value },
        bubbles: true, composed: true
      }));
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
    this._input.setAttribute('aria-checked', String(isChecked));

    this._track!.className = `track ${size}${isChecked ? ' checked' : ''}${isDisabled ? ' disabled' : ''}`;
    this._thumb!.className = `thumb ${size}${isChecked ? ' checked' : ''}`;

    this._labelEl!.className = isDisabled ? 'disabled' : '';

    const labelSpan = this.shadowRoot!.querySelector('.label-text') as HTMLElement;
    if (labelSpan) {
      labelSpan.className = `label-text ${size}`;
      labelSpan.textContent = this.label;
      labelSpan.style.display = this.label ? 'inline' : 'none';
    }
  }
}

if (!customElements.get('elx-switch')) {
  customElements.define('elx-switch', ElxSwitch);
}
