const styles = `
  :host {
    --elx-drawer-bg: var(--elx-color-surface, #ffffff);
    --elx-drawer-width: 320px;
    --elx-drawer-shadow: var(--elx-shadow-lg, 0 25px 50px -12px rgba(0, 0, 0, 0.25));
    --elx-drawer-z: var(--elx-z-modal, 1000);
    --elx-drawer-border: var(--elx-color-border, #e2e8f0);
  }

  .backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: var(--elx-drawer-z);
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s ease, visibility 0.2s ease;
  }

  :host([open]) .backdrop {
    opacity: 1;
    visibility: visible;
  }

  .drawer {
    position: fixed;
    top: 0;
    bottom: 0;
    z-index: var(--elx-drawer-z);
    background: var(--elx-drawer-bg);
    box-shadow: var(--elx-drawer-shadow);
    display: flex;
    flex-direction: column;
    max-width: 90vw;
    transition: transform 0.3s ease;
  }

  :host([placement='left']) .drawer {
    left: 0;
    border-right: 1px solid var(--elx-drawer-border);
    transform: translateX(-100%);
  }

  :host([placement='right']) .drawer {
    right: 0;
    border-left: 1px solid var(--elx-drawer-border);
    transform: translateX(100%);
  }

  :host([open]) .drawer {
    transform: translateX(0);
  }

  :host([placement='left'][open]) .drawer {
    animation: slideInLeft 0.3s ease;
  }

  :host([placement='right'][open]) .drawer {
    animation: slideInRight 0.3s ease;
  }

  @keyframes slideInLeft {
    from { transform: translateX(-100%); }
    to { transform: translateX(0); }
  }

  @keyframes slideInRight {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    border-bottom: 1px solid var(--elx-drawer-border);
    flex-shrink: 0;
  }

  .title {
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0;
  }

  .close-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 0.375rem;
    color: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .close-button:hover {
    background: var(--elx-color-neutral-100, #f1f5f9);
  }

  .close-button:focus-visible {
    outline: 2px solid var(--elx-color-primary, #3b82f6);
    outline-offset: 2px;
  }

  .content {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
  }

  .footer {
    padding: 1rem;
    border-top: 1px solid var(--elx-drawer-border);
    flex-shrink: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    .backdrop,
    .drawer {
      transition: none;
    }
    :host([open]) .drawer {
      animation: none;
    }
  }
`;

export class ElxDrawer extends HTMLElement {
  static observedAttributes = ['open', 'placement'];

  private _closeButton: HTMLButtonElement | null = null;
  private _previousActiveElement: HTMLElement | null = null;

  get open(): boolean {
    return this.hasAttribute('open');
  }

  set open(val: boolean) {
    if (val) {
      this.setAttribute('open', '');
    } else {
      this.removeAttribute('open');
    }
  }

  get placement(): 'left' | 'right' {
    return (this.getAttribute('placement') as 'left' | 'right') || 'right';
  }

  set placement(val: 'left' | 'right') {
    this.setAttribute('placement', val);
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    if (!this.hasAttribute('placement')) {
      this.setAttribute('placement', 'right');
    }
    if (!this.shadowRoot?.querySelector('.drawer')) {
      this._render();
    }
  }

  private _render() {
    const style = document.createElement('style');
    style.textContent = styles;

    const backdrop = document.createElement('div');
    backdrop.className = 'backdrop';
    backdrop.addEventListener('click', () => this.close());

    const drawer = document.createElement('div');
    drawer.className = 'drawer';
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-modal', 'true');

    const header = document.createElement('div');
    header.className = 'header';

    const title = document.createElement('h2');
    title.className = 'title';
    const titleSlot = document.createElement('slot');
    titleSlot.name = 'title';
    title.appendChild(titleSlot);

    this._closeButton = document.createElement('button');
    this._closeButton.className = 'close-button';
    this._closeButton.setAttribute('aria-label', 'Close drawer');
    this._closeButton.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 6L6 18M6 6l12 12"/>
      </svg>
    `;
    this._closeButton.addEventListener('click', () => this.close());

    header.appendChild(title);
    header.appendChild(this._closeButton);

    const content = document.createElement('div');
    content.className = 'content';
    const contentSlot = document.createElement('slot');
    content.appendChild(contentSlot);

    const footer = document.createElement('div');
    footer.className = 'footer';
    const footerSlot = document.createElement('slot');
    footerSlot.name = 'footer';
    footer.appendChild(footerSlot);

    drawer.appendChild(header);
    drawer.appendChild(content);
    drawer.appendChild(footer);

    this.shadowRoot!.appendChild(style);
    this.shadowRoot!.appendChild(backdrop);
    this.shadowRoot!.appendChild(drawer);

    this._updateOpenState();
  }

  attributeChangedCallback(name: string, oldVal: string | null, newVal: string | null) {
    if (oldVal === newVal) return;
    if (name === 'open') {
      this._updateOpenState();
    }
  }

  private _updateOpenState() {
    const drawer = this.shadowRoot?.querySelector('.drawer');
    const backdrop = this.shadowRoot?.querySelector('.backdrop');

    if (this.open) {
      drawer?.setAttribute('aria-hidden', 'false');
      backdrop?.setAttribute('aria-hidden', 'false');
      this._trapFocus();
      this._previousActiveElement = document.activeElement as HTMLElement;
    } else {
      drawer?.setAttribute('aria-hidden', 'true');
      backdrop?.setAttribute('aria-hidden', 'true');
      this._restoreFocus();
    }
  }

  private _trapFocus() {
    const drawer = this.shadowRoot?.querySelector('.drawer');
    if (!drawer) return;

    const focusableElements = drawer.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }

  private _restoreFocus() {
    if (this._previousActiveElement) {
      this._previousActiveElement.focus();
    }
  }

  public show() {
    this.open = true;
  }

  public close() {
    const wasOpen = this.open;
    this.open = false;
    if (wasOpen) {
      this.dispatchEvent(new CustomEvent('elx-drawer-close', { bubbles: true, composed: true }));
    }
  }

  public toggle() {
    this.open = !this.open;
  }
}

if (!customElements.get('elx-drawer')) {
  customElements.define('elx-drawer', ElxDrawer);
}
