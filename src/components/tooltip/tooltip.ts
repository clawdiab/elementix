const VALID_POSITIONS = ['top', 'right', 'bottom', 'left'] as const;
type Position = typeof VALID_POSITIONS[number];

export class ElxTooltip extends HTMLElement {
  static observedAttributes = ['content', 'position'];

  private _tooltip: HTMLDivElement | null = null;
  private _target: HTMLElement | null = null;
  private _visible = false;
  private _timeoutId: number | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this._buildDom();
    
    // The tooltip wraps its target via a slot
    const slot = this.shadowRoot!.querySelector('slot');
    slot?.addEventListener('slotchange', () => {
      const elements = slot.assignedElements();
      if (elements.length > 0) {
        this._setupTarget(elements[0] as HTMLElement);
      }
    });
  }

  disconnectedCallback() {
    this._teardownTarget();
  }

  attributeChangedCallback(name: string, oldVal: string, newVal: string) {
    if (oldVal === newVal) return;
    if (name === 'content') {
      if (this._tooltip) this._tooltip.textContent = newVal;
    } else if (name === 'position') {
      if (this._tooltip) {
        this._tooltip.dataset.position = VALID_POSITIONS.includes(newVal as Position) ? newVal : 'top';
      }
    }
  }

  get content(): string { return this.getAttribute('content') ?? ''; }
  set content(val: string) { this.setAttribute('content', val); }

  get position(): Position { 
    const pos = this.getAttribute('position') as Position;
    return VALID_POSITIONS.includes(pos) ? pos : 'top';
  }
  set position(val: Position) { this.setAttribute('position', val); }

  private _buildDom() {
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: inline-block;
        position: relative;
      }

      .tooltip {
        position: absolute;
        z-index: 1000;
        padding: 6px 12px;
        background-color: #1f2937;
        color: white;
        font-size: 12px;
        font-family: inherit;
        border-radius: 6px;
        pointer-events: none;
        white-space: nowrap;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.2s, visibility 0.2s, transform 0.2s;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
      }

      .tooltip[aria-hidden="false"] {
        opacity: 1;
        visibility: visible;
      }

      /* Positioning */
      .tooltip[data-position="top"] {
        bottom: 100%;
        left: 50%;
        transform: translate(-50%, -8px) scale(0.95);
        margin-bottom: 8px;
      }
      .tooltip[data-position="top"][aria-hidden="false"] {
        transform: translate(-50%, 0) scale(1);
      }

      .tooltip[data-position="bottom"] {
        top: 100%;
        left: 50%;
        transform: translate(-50%, 8px) scale(0.95);
        margin-top: 8px;
      }
      .tooltip[data-position="bottom"][aria-hidden="false"] {
        transform: translate(-50%, 0) scale(1);
      }

      .tooltip[data-position="left"] {
        right: 100%;
        top: 50%;
        transform: translate(-8px, -50%) scale(0.95);
        margin-right: 8px;
      }
      .tooltip[data-position="left"][aria-hidden="false"] {
        transform: translate(0, -50%) scale(1);
      }

      .tooltip[data-position="right"] {
        left: 100%;
        top: 50%;
        transform: translate(8px, -50%) scale(0.95);
        margin-left: 8px;
      }
      .tooltip[data-position="right"][aria-hidden="false"] {
        transform: translate(0, -50%) scale(1);
      }
    `;

    this._tooltip = document.createElement('div');
    this._tooltip.className = 'tooltip';
    this._tooltip.setAttribute('role', 'tooltip');
    this._tooltip.setAttribute('aria-hidden', 'true');
    this._tooltip.dataset.position = this.position;
    this._tooltip.textContent = this.content;
    
    // Generate a unique ID for ARIA association
    this._tooltip.id = `tooltip-${Math.random().toString(36).substring(2, 9)}`;

    const slot = document.createElement('slot');

    this.shadowRoot!.appendChild(style);
    this.shadowRoot!.appendChild(this._tooltip);
    this.shadowRoot!.appendChild(slot);
  }

  private _setupTarget(target: HTMLElement) {
    this._teardownTarget();
    this._target = target;

    // Associate target with tooltip
    if (this._tooltip) {
      target.setAttribute('aria-describedby', this._tooltip.id);
    }

    target.addEventListener('mouseenter', this._onShow);
    target.addEventListener('mouseleave', this._onHide);
    target.addEventListener('focus', this._onShow);
    target.addEventListener('blur', this._onHide);
    target.addEventListener('keydown', this._onKeydown);
  }

  private _teardownTarget() {
    if (!this._target) return;
    
    this._target.removeAttribute('aria-describedby');
    this._target.removeEventListener('mouseenter', this._onShow);
    this._target.removeEventListener('mouseleave', this._onHide);
    this._target.removeEventListener('focus', this._onShow);
    this._target.removeEventListener('blur', this._onHide);
    this._target.removeEventListener('keydown', this._onKeydown);
    
    this._target = null;
  }

  private _onShow = () => {
    if (this._timeoutId) clearTimeout(this._timeoutId);
    this._visible = true;
    if (this._tooltip) {
      this._tooltip.setAttribute('aria-hidden', 'false');
    }
  };

  private _onHide = () => {
    // Add a small delay before hiding to prevent flickering
    this._timeoutId = window.setTimeout(() => {
      this._visible = false;
      if (this._tooltip) {
        this._tooltip.setAttribute('aria-hidden', 'true');
      }
    }, 100);
  };

  private _onKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this._visible) {
      e.stopPropagation();
      this._onHide();
    }
  };
}

if (!customElements.get('elx-tooltip')) {
  customElements.define('elx-tooltip', ElxTooltip);
}