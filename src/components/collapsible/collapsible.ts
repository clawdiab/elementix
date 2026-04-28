/**
 * ElxCollapsible - A collapsible content container
 * Expands/collapses content with smooth animation
 */
let collapsibleIdCounter = 0;

export class ElxCollapsible extends HTMLElement {
  private _trigger: HTMLButtonElement | null = null;
  private _content: HTMLDivElement | null = null;
  private _open = false;
  private _disabled = false;
  private _id = '';
  private _boundHandleClick: () => void;

  static observedAttributes = ['open', 'disabled', 'aria-label'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._boundHandleClick = this._handleClick.bind(this);
  }

  connectedCallback(): void {
    this._id = 'elx-collapsible-' + (++collapsibleIdCounter);
    this._buildDom();
    this._update();
  }

  disconnectedCallback(): void {
    if (this._trigger) {
      this._trigger.removeEventListener('click', this._boundHandleClick);
    }
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    
    if (name === 'open') {
      this._open = newValue !== null;
      this._update();
    } else if (name === 'disabled') {
      this._disabled = newValue !== null;
      this._update();
    } else if (name === 'aria-label') {
      this._update();
    }
  }

  get open(): boolean {
    return this._open;
  }

  set open(value: boolean) {
    this._open = value;
    if (value) {
      this.setAttribute('open', '');
    } else {
      this.removeAttribute('open');
    }
  }

  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = value;
    if (value) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }
  }

  private _buildDom(): void {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }

        .trigger {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
          padding: var(--elx-collapsible-trigger-padding, 0.75rem 1rem);
          background: var(--elx-collapsible-trigger-bg, transparent);
          border: var(--elx-collapsible-trigger-border, 1px solid #e2e8f0);
          border-radius: var(--elx-collapsible-trigger-radius, 0.375rem);
          cursor: pointer;
          font-size: var(--elx-collapsible-trigger-font-size, 0.875rem);
          font-weight: var(--elx-collapsible-trigger-font-weight, 500);
          color: var(--elx-collapsible-trigger-color, #1e293b);
          transition: background 0.15s, border-color 0.15s;
        }

        .trigger:hover:not(:disabled) {
          background: var(--elx-collapsible-trigger-hover-bg, #f8fafc);
          border-color: var(--elx-collapsible-trigger-hover-border-color, #cbd5e1);
        }

        .trigger:focus-visible {
          outline: 2px solid var(--elx-collapsible-focus-ring, #3b82f6);
          outline-offset: 2px;
        }

        .trigger:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .icon {
          width: 1rem;
          height: 1rem;
          transition: transform 0.2s ease;
          flex-shrink: 0;
        }

        :host([open]) .icon {
          transform: rotate(180deg);
        }

        .content-wrapper {
          overflow: hidden;
          height: 0;
          transition: height 0.2s ease;
        }

        .content {
          padding: var(--elx-collapsible-content-padding, 1rem);
          border: var(--elx-collapsible-content-border, 1px solid #e2e8f0);
          border-top: none;
          border-radius: var(--elx-collapsible-content-radius, 0 0 0.375rem 0.375rem);
          background: var(--elx-collapsible-content-bg, #ffffff);
        }
      </style>
      <button class="trigger" type="button" aria-expanded="false" id="${this._id}-trigger" aria-controls="${this._id}-content">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
        <slot name="trigger">Toggle</slot>
      </button>
      <div class="content-wrapper" id="${this._id}-content" role="region" aria-labelledby="${this._id}-trigger">
        <div class="content">
          <slot name="content"></slot>
        </div>
      </div>
    `;

    this._trigger = this.shadowRoot.querySelector('.trigger');
    this._content = this.shadowRoot.querySelector('.content-wrapper');

    if (this._trigger) {
      this._trigger.addEventListener('click', this._boundHandleClick);
    }
  }

  private _update(): void {
    if (!this._trigger || !this._content) return;

    // Update trigger
    this._trigger.setAttribute('aria-expanded', String(this._open));
    this._trigger.disabled = this._disabled;
    
    const label = this.getAttribute('aria-label');
    if (label) {
      this._trigger.setAttribute('aria-label', label);
    } else {
      this._trigger.removeAttribute('aria-label');
    }

    // Update content visibility
    if (this._open) {
      this._content.style.height = 'auto';
      const height = this._content.scrollHeight;
      this._content.style.height = '0';
      // Force reflow
      this._content.offsetHeight;
      this._content.style.height = height + 'px';
    } else {
      this._content.style.height = this._content.scrollHeight + 'px';
      // Force reflow
      this._content.offsetHeight;
      this._content.style.height = '0';
    }

    // Update aria-hidden
    this._content.setAttribute('aria-hidden', String(!this._open));
  }

  private _handleClick(): void {
    if (this._disabled) return;
    this.toggle();
  }

  public toggle(): void {
    this.open = !this._open;
    this._dispatchToggleEvent();
  }

  public show(): void {
    if (!this._open) {
      this.open = true;
      this._dispatchToggleEvent();
    }
  }

  public hide(): void {
    if (this._open) {
      this.open = false;
      this._dispatchToggleEvent();
    }
  }

  private _dispatchToggleEvent(): void {
    this.dispatchEvent(new CustomEvent('elx-collapsible-toggle', {
      bubbles: true,
      composed: true,
      detail: { open: this._open }
    }));
  }
}

// Guard against duplicate registration
if (!customElements.get('elx-collapsible')) {
  customElements.define('elx-collapsible', ElxCollapsible);
}

declare global {
  interface HTMLElementTagNameMap {
    'elx-collapsible': ElxCollapsible;
  }
}
