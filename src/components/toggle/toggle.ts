const VALID_SIZES = ['sm', 'md', 'lg'] as const;
const VALID_VARIANTS = ['default', 'outline'] as const;

export class ElxToggle extends HTMLElement {
  static formAssociated = true;
  static observedAttributes = ['pressed', 'disabled', 'size', 'variant', 'value', 'name'];

  private _internals: ElementInternals;
  private _btn: HTMLButtonElement | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._internals = this.attachInternals?.() ?? ({} as ElementInternals);
  }

  connectedCallback() {
    this._buildDom();
    this._update();
  }

  attributeChangedCallback() {
    this._update();
  }

  get pressed(): boolean { return this.hasAttribute('pressed'); }
  set pressed(val: boolean) { val ? this.setAttribute('pressed', '') : this.removeAttribute('pressed'); }

  get disabled(): boolean { return this.hasAttribute('disabled'); }
  set disabled(val: boolean) { val ? this.setAttribute('disabled', '') : this.removeAttribute('disabled'); }

  get size(): string {
    const val = this.getAttribute('size');
    return (VALID_SIZES as readonly string[]).indexOf(val!) !== -1 ? val! : 'md';
  }
  set size(val: string) { this.setAttribute('size', val); }

  get variant(): string {
    const val = this.getAttribute('variant');
    return (VALID_VARIANTS as readonly string[]).indexOf(val!) !== -1 ? val! : 'default';
  }
  set variant(val: string) { this.setAttribute('variant', val); }

  get value(): string { return this.getAttribute('value') ?? 'on'; }
  set value(val: string) { this.setAttribute('value', val); }

  get name(): string { return this.getAttribute('name') ?? ''; }
  set name(val: string) { this.setAttribute('name', val); }

  focus() { this._btn?.focus(); }
  blur() { this._btn?.blur(); }

  private _buildDom() {
    const style = document.createElement('style');
    style.textContent = `
      :host { display: inline-block; }

      button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        border: 1px solid var(--elx-color-neutral-200);
        border-radius: var(--elx-radius-md);
        background: transparent;
        color: var(--elx-color-neutral-700);
        font-family: var(--elx-font-family-sans);
        font-weight: 500;
        cursor: pointer;
        transition: background 0.15s, color 0.15s, border-color 0.15s;
        outline: none;
        user-select: none;
      }

      button.sm { height: 28px; padding: 0 8px; font-size: 12px; }
      button.md { height: 36px; padding: 0 12px; font-size: 14px; }
      button.lg { height: 44px; padding: 0 16px; font-size: 16px; }

      button:hover:not(:disabled) { background: var(--elx-color-neutral-100); }

      button.pressed {
        background: var(--elx-color-neutral-200);
        color: var(--elx-color-neutral-900);
        border-color: var(--elx-color-neutral-300);
      }

      button.variant-outline.pressed {
        background: var(--elx-color-primary-50);
        color: var(--elx-color-primary-700);
        border-color: var(--elx-color-primary-300);
      }

      button:focus-visible {
        box-shadow: 0 0 0 3px rgba(37,99,235,0.3);
      }

      button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      ::slotted(*) { pointer-events: none; }
    `;

    this._btn = document.createElement('button');
    this._btn.setAttribute('part', 'button');
    this._btn.setAttribute('type', 'button');
    const slot = document.createElement('slot');
    this._btn.appendChild(slot);

    this.shadowRoot!.appendChild(style);
    this.shadowRoot!.appendChild(this._btn);

    this._btn.addEventListener('click', () => {
      if (this.disabled) return;
      this.pressed = !this.pressed;
      this._syncFormState();
      this.dispatchEvent(new CustomEvent('change', {
        detail: { pressed: this.pressed, value: this.value },
        bubbles: true,
        composed: true,
      }));
    });
  }

  private _update() {
    if (!this._btn) return;
    const isPressed = this.pressed;
    const isDisabled = this.disabled;
    this._btn.disabled = isDisabled;
    this._btn.setAttribute('aria-pressed', String(isPressed));
    this._btn.className = [
      this.size,
      `variant-${this.variant}`,
      isPressed ? 'pressed' : '',
    ].filter(Boolean).join(' ');
    this._syncFormState();
  }

  private _syncFormState() {
    this._internals.setFormValue?.(this.pressed ? this.value : null);
    this._internals.setValidity?.({});
  }

  formResetCallback() {
    this.pressed = false;
    this._syncFormState();
  }
}

export class ElxToggleGroup extends HTMLElement {
  static observedAttributes = ['type', 'disabled', 'value', 'aria-label'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this._buildDom();
    this._update();
    this.shadowRoot!.addEventListener('slotchange', () => this._bindToggles());
  }

  attributeChangedCallback() {
    this._update();
  }

  get type(): string { return this.getAttribute('type') ?? 'single'; }
  set type(val: string) { this.setAttribute('type', val); }

  get disabled(): boolean { return this.hasAttribute('disabled'); }
  set disabled(val: boolean) { val ? this.setAttribute('disabled', '') : this.removeAttribute('disabled'); }

  get value(): string { return this.getAttribute('value') ?? ''; }
  set value(val: string) { this.setAttribute('value', val); }

  private _buildDom() {
    const style = document.createElement('style');
    style.textContent = `
      :host { display: inline-flex; gap: 4px; flex-wrap: wrap; }
    `;
    const slot = document.createElement('slot');
    this.shadowRoot!.appendChild(style);
    this.shadowRoot!.appendChild(slot);

    this.setAttribute('role', 'group');

    this.addEventListener('change', (e: Event) => {
      const target = e.composedPath()[0] as ElxToggle;
      if (!(target instanceof ElxToggle)) return;

      if (this.type === 'single') {
        this._getToggles().forEach(t => {
          if (t !== target) t.pressed = false;
        });
        this.setAttribute('value', target.pressed ? target.value : '');
      } else {
        const vals: string[] = [];
        this._getToggles().forEach(t => { if (t.pressed) vals.push(t.value); });
        this.setAttribute('value', vals.join(','));
      }

      this.dispatchEvent(new CustomEvent('change', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }));
    });

    this.addEventListener('keydown', (e: KeyboardEvent) => this._handleKeydown(e));
  }

  private _handleKeydown(e: KeyboardEvent) {
    const toggles = this._getToggles().filter(t => !t.disabled);
    if (!toggles.length) return;
    const active = document.activeElement;
    let idx = -1;
    for (let i = 0; i < toggles.length; i++) {
      if (toggles[i] === active || toggles[i].shadowRoot!.contains(active as Node)) { idx = i; break; }
    }
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const next = toggles[(idx + 1) % toggles.length];
      (next as any).focus?.() || next.shadowRoot!.querySelector('button')?.focus();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = toggles[(idx - 1 + toggles.length) % toggles.length];
      (prev as any).focus?.() || prev.shadowRoot!.querySelector('button')?.focus();
    }
  }

  private _getToggles(): ElxToggle[] {
    const result: ElxToggle[] = [];
    const nodes = this.querySelectorAll('elx-toggle');
    for (let i = 0; i < nodes.length; i++) result.push(nodes[i] as ElxToggle);
    return result;
  }

  private _bindToggles() {
    if (this.disabled) {
      this._getToggles().forEach(t => t.setAttribute('disabled', ''));
    }
  }

  private _update() {
    if (!this.shadowRoot) return;
    this._bindToggles();
  }
}

if (!customElements.get('elx-toggle')) customElements.define('elx-toggle', ElxToggle);
if (!customElements.get('elx-toggle-group')) customElements.define('elx-toggle-group', ElxToggleGroup);
