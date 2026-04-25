export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export class ElxSelect extends HTMLElement {
  static observedAttributes = ['value', 'placeholder', 'disabled'];

  private _options: SelectOption[] = [];
  private _value: string = '';
  private _open = false;
  private _focusedIndex = -1;
  private _button: HTMLButtonElement | null = null;
  private _listbox: HTMLDivElement | null = null;
  private _id = `select-${Math.random().toString(36).substring(2, 9)}`;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this._buildDom();
    this._updateDisplay();
    document.addEventListener('click', this._onOutsideClick);
  }

  disconnectedCallback() {
    document.removeEventListener('click', this._onOutsideClick);
    document.removeEventListener('keydown', this._onDocumentKeydown);
  }

  attributeChangedCallback(name: string, oldVal: string, newVal: string) {
    if (oldVal === newVal) return;
    if (name === 'value') {
      this._value = newVal;
      this._updateDisplay();
    } else if (name === 'disabled') {
      if (this._button) {
        this._button.disabled = newVal !== null;
      }
    }
  }

  get options(): SelectOption[] { return this._options; }
  set options(val: SelectOption[]) {
    this._options = val;
    this._renderOptions();
    this._updateDisplay();
  }

  get value(): string { return this._value; }
  set value(val: string) {
    this._value = val;
    this.setAttribute('value', val);
    this._updateDisplay();
  }

  get placeholder(): string { return this.getAttribute('placeholder') ?? 'Select...'; }
  set placeholder(val: string) { this.setAttribute('placeholder', val); }

  get disabled(): boolean { return this.hasAttribute('disabled'); }
  set disabled(val: boolean) {
    if (val) this.setAttribute('disabled', '');
    else this.removeAttribute('disabled');
  }

  private _buildDom() {
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: inline-block;
        position: relative;
        font-family: var(--elx-font-family-sans);
      }

      .trigger {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 8px 12px;
        min-width: 160px;
        background: var(--elx-color-white);
        border: 1px solid var(--elx-color-neutral-300);
        border-radius: var(--elx-radius-lg);
        font-size: 14px;
        cursor: pointer;
        text-align: left;
        transition: border-color 0.15s, box-shadow 0.15s;
      }

      .trigger:hover:not(:disabled) {
        border-color: var(--elx-color-neutral-400);
      }

      .trigger:focus-visible {
        outline: none;
        border-color: var(--elx-color-primary-500);
        box-shadow: 0 0 0 3px rgb(59 130 246 / 0.2);
      }

      .trigger:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .trigger-text {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .trigger-text.placeholder {
        color: var(--elx-color-neutral-400);
      }

      .arrow {
        width: 16px;
        height: 16px;
        transition: transform 0.2s;
      }

      .trigger[aria-expanded="true"] .arrow {
        transform: rotate(180deg);
      }

      .listbox {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        margin-top: 4px;
        background: var(--elx-color-white);
        border: 1px solid var(--elx-color-neutral-300);
        border-radius: var(--elx-radius-lg);
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        max-height: 240px;
        overflow-y: auto;
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transform: translateY(-4px);
        transition: opacity 0.15s, visibility 0.15s, transform 0.15s;
      }

      .listbox.open {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }

      .option {
        padding: 8px 12px;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.1s;
      }

      .option:hover,
      .option.focused {
        background-color: var(--elx-color-neutral-100);
      }

      .option.selected {
        background-color: var(--elx-color-primary-50);
        color: var(--elx-color-primary-600);
      }

      .option.disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    `;

    this._button = document.createElement('button');
    this._button.type = 'button';
    this._button.className = 'trigger';
    this._button.setAttribute('role', 'combobox');
    this._button.setAttribute('aria-haspopup', 'listbox');
    this._button.setAttribute('aria-expanded', 'false');
    this._button.setAttribute('aria-controls', this._id);
    this._button.disabled = this.disabled;

    const text = document.createElement('span');
    text.className = 'trigger-text placeholder';
    text.textContent = this.placeholder;

    const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    arrow.setAttribute('class', 'arrow');
    arrow.setAttribute('viewBox', '0 0 20 20');
    arrow.setAttribute('fill', 'currentColor');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('fill-rule', 'evenodd');
    path.setAttribute('d', 'M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z');
    path.setAttribute('clip-rule', 'evenodd');
    arrow.appendChild(path);

    this._button.appendChild(text);
    this._button.appendChild(arrow);

    this._listbox = document.createElement('div');
    this._listbox.className = 'listbox';
    this._listbox.setAttribute('role', 'listbox');
    this._listbox.setAttribute('id', this._id);
    this._listbox.setAttribute('aria-label', 'Options');

    this.shadowRoot!.appendChild(style);
    this.shadowRoot!.appendChild(this._button);
    this.shadowRoot!.appendChild(this._listbox);

    this._button.addEventListener('click', this._onToggle);
    this._button.addEventListener('keydown', this._onKeydown);
    this._renderOptions();
  }

  private _renderOptions() {
    if (!this._listbox) return;
    this._listbox.innerHTML = '';

    this._options.forEach((opt, index) => {
      const option = document.createElement('div');
      option.className = 'option';
      option.setAttribute('role', 'option');
      option.setAttribute('data-value', opt.value);
      option.setAttribute('data-index', String(index));
      option.textContent = opt.label;

      if (opt.disabled) {
        option.classList.add('disabled');
        option.setAttribute('aria-disabled', 'true');
      }

      if (opt.value === this._value) {
        option.classList.add('selected');
        option.setAttribute('aria-selected', 'true');
      }

      option.addEventListener('click', () => this._selectOption(opt));
      option.addEventListener('mouseenter', () => this._focusOption(index));

      this._listbox!.appendChild(option);
    });
  }

  private _updateDisplay() {
    if (!this._button) return;
    const text = this._button.querySelector('.trigger-text');
    if (!text) return;

    const selected = this._options.find(o => o.value === this._value);
    if (selected) {
      text.textContent = selected.label;
      text.classList.remove('placeholder');
    } else {
      text.textContent = this.placeholder;
      text.classList.add('placeholder');
    }

    // Update selected state in listbox
    this._listbox?.querySelectorAll('.option').forEach(opt => {
      const val = opt.getAttribute('data-value');
      if (val === this._value) {
        opt.classList.add('selected');
        opt.setAttribute('aria-selected', 'true');
      } else {
        opt.classList.remove('selected');
        opt.removeAttribute('aria-selected');
      }
    });
  }

  private _onToggle = () => {
    if (this.disabled) return;
    this._open ? this._close() : this._openList();
  };

  private _openList() {
    this._open = true;
    this._button?.setAttribute('aria-expanded', 'true');
    this._listbox?.classList.add('open');
    document.addEventListener('keydown', this._onDocumentKeydown);

    // Focus first selected or first option
    const selectedIndex = this._options.findIndex(o => o.value === this._value);
    this._focusOption(selectedIndex >= 0 ? selectedIndex : 0);
  }

  private _close() {
    this._open = false;
    this._button?.setAttribute('aria-expanded', 'false');
    this._listbox?.classList.remove('open');
    document.removeEventListener('keydown', this._onDocumentKeydown);
    this._focusedIndex = -1;
    this._listbox?.querySelectorAll('.option').forEach(o => o.classList.remove('focused'));
  }

  private _selectOption(opt: SelectOption) {
    if (opt.disabled) return;
    this._value = opt.value;
    this.setAttribute('value', opt.value);
    this._updateDisplay();
    this._close();
    this.dispatchEvent(new CustomEvent('change', { detail: { value: opt.value }, bubbles: true }));
  }

  private _focusOption(index: number) {
    if (!this._listbox) return;
    this._focusedIndex = index;
    this._listbox.querySelectorAll('.option').forEach((opt, i) => {
      opt.classList.toggle('focused', i === index);
    });
  }

  private _onKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._onToggle();
    }
  };

  private _onDocumentKeydown = (e: KeyboardEvent) => {
    if (!this._open) return;

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        this._close();
        break;
      case 'ArrowDown':
        e.preventDefault();
        this._focusNext();
        break;
      case 'ArrowUp':
        e.preventDefault();
        this._focusPrev();
        break;
      case 'Enter':
        e.preventDefault();
        if (this._focusedIndex >= 0) {
          const opt = this._options[this._focusedIndex];
          if (!opt.disabled) this._selectOption(opt);
        }
        break;
      case 'Home':
        e.preventDefault();
        this._focusOption(0);
        break;
      case 'End':
        e.preventDefault();
        this._focusOption(this._options.length - 1);
        break;
    }
  };

  private _focusNext() {
    let next = this._focusedIndex + 1;
    while (next < this._options.length && this._options[next].disabled) next++;
    if (next < this._options.length) this._focusOption(next);
  }

  private _focusPrev() {
    let prev = this._focusedIndex - 1;
    while (prev >= 0 && this._options[prev].disabled) prev--;
    if (prev >= 0) this._focusOption(prev);
  }

  private _onOutsideClick = (e: MouseEvent) => {
    const path = e.composedPath();
    if (!path.includes(this)) {
      this._close();
    }
  };
}

if (!customElements.get('elx-select')) {
  customElements.define('elx-select', ElxSelect);
}