export class ElxLabel extends HTMLElement {
  static observedAttributes = ['for', 'required', 'disabled', 'size'];

  private _boundHandleClick: (e: MouseEvent) => void;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._boundHandleClick = this._handleClick.bind(this);
  }

  connectedCallback() {
    if (!this.shadowRoot?.querySelector('.label-wrapper')) this._buildDom();
    this._update();
    this.addEventListener('click', this._boundHandleClick);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this._boundHandleClick);
  }

  attributeChangedCallback(_name: string, oldVal: string | null, newVal: string | null) {
    if (oldVal === newVal) return;
    this._update();
  }

  get for(): string { return this.getAttribute('for') || ''; }
  set for(val: string) { val ? this.setAttribute('for', val) : this.removeAttribute('for'); }

  get required(): boolean { return this.hasAttribute('required'); }
  set required(val: boolean) { val ? this.setAttribute('required', '') : this.removeAttribute('required'); }

  get disabled(): boolean { return this.hasAttribute('disabled'); }
  set disabled(val: boolean) { val ? this.setAttribute('disabled', '') : this.removeAttribute('disabled'); }

  get size(): string { return this.getAttribute('size') || 'md'; }
  set size(val: string) { this.setAttribute('size', val); }

  /**
   * Forwards click to the associated control (resolving the shadow-DOM boundary).
   * A plain `<label for="...">` inside shadow DOM cannot reach a light-DOM target,
   * so we programmatically focus/click the target ourselves.
   */
  private _handleClick(e: MouseEvent) {
    if (!this.for) return;
    // Avoid infinite loop: only act when the click is on the host, not on the target
    const target = document.getElementById(this.for);
    if (target && !e.composedPath().includes(target)) {
      target.focus();
      if (target instanceof HTMLInputElement && (target.type === 'checkbox' || target.type === 'radio')) {
        target.click();
      }
    }
  }

  private _buildDom() {
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        cursor: default;
      }
      :host([disabled]) {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .label-wrapper {
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }

      .label-text {
        font-weight: 500;
        color: var(--elx-color-neutral-700, #404040);
        user-select: none;
        line-height: 1.4;
      }

      .label-text.sm { font-size: 12px; }
      .label-text.md { font-size: 14px; }
      .label-text.lg { font-size: 16px; }

      .required-indicator {
        color: var(--elx-color-danger-500, #ef4444);
        font-weight: 600;
      }
    `;

    const wrapper = document.createElement('span');
    wrapper.className = 'label-wrapper';
    // Use span (not label) — the association is handled by the click handler above
    // to properly cross the shadow DOM boundary

    const textSpan = document.createElement('span');
    textSpan.setAttribute('part', 'label');
    textSpan.className = 'label-text';

    const slot = document.createElement('slot');
    textSpan.appendChild(slot);

    const asterisk = document.createElement('span');
    asterisk.className = 'required-indicator';
    asterisk.textContent = '*';
    asterisk.setAttribute('aria-hidden', 'true');

    wrapper.appendChild(textSpan);
    wrapper.appendChild(asterisk);

    this.shadowRoot!.appendChild(style);
    this.shadowRoot!.appendChild(wrapper);
  }

  private _update() {
    const textSpan = this.shadowRoot?.querySelector('.label-text') as HTMLElement;
    const asterisk = this.shadowRoot?.querySelector('.required-indicator') as HTMLElement;
    if (!textSpan) return;

    textSpan.className = `label-text ${this.size}`;

    // Update host role/aria so AT can announce the label's target
    if (this.for) {
      this.setAttribute('role', 'label');
    } else {
      this.removeAttribute('role');
    }

    if (asterisk) {
      asterisk.style.display = this.required ? 'inline' : 'none';
    }
  }
}

if (!customElements.get('elx-label')) {
  customElements.define('elx-label', ElxLabel);
}
