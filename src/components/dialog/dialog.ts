export class ElxDialog extends HTMLElement {
  static observedAttributes = ['open'];

  private _previousActive: HTMLElement | null = null;
  private _focusableSelector =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this._buildDom();
    this._update();
  }
  disconnectedCallback() {
    this._restoreFocus();
    document.removeEventListener('keydown', this._onKeydown);
  }

  attributeChangedCallback() {
    this._update();
  }

  get open(): boolean {
    return this.hasAttribute('open');
  }
  set open(val: boolean) {
    val ? this.setAttribute('open', '') : this.removeAttribute('open');
  }

  private _buildDom() {
    const style = document.createElement('style');
    style.textContent = `
      :host { display: contents; }

      .overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.2s ease, visibility 0.2s ease;
      }

      .overlay.open {
        opacity: 1;
        visibility: visible;
      }

      .dialog {
        background: var(--elx-color-white);
        border-radius: var(--elx-radius-lg);
        box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
        max-width: 90vw;
        max-height: 90vh;
        overflow: auto;
        font-family: var(--elx-font-family-sans);
      }

      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px;
        border-bottom: 1px solid var(--elx-color-neutral-200);
      }

      .title {
        font-size: 18px;
        font-weight: var(--elx-font-weight-semibold);
        margin: 0;
      }

      .close-btn {
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 4px;
        font-size: 20px;
        line-height: 1;
        color: var(--elx-color-neutral-500);
      }
      .close-btn:hover { color: var(--elx-color-neutral-900); }

      .content { padding: 16px; }
      .footer {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        padding: 16px;
        border-top: 1px solid var(--elx-color-neutral-200);
      }
    `;

    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) this.close();
    });

    const dialog = document.createElement('div');
    dialog.className = 'dialog';
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');

    const header = document.createElement('div');
    header.className = 'header';

    const title = document.createElement('h2');
    title.className = 'title';
    const titleSlot = document.createElement('slot');
    titleSlot.name = 'title';
    title.appendChild(titleSlot);

    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-btn';
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'Close dialog');
    closeBtn.textContent = '✕';
    closeBtn.addEventListener('click', () => this.close());

    header.appendChild(title);
    header.appendChild(closeBtn);

    const content = document.createElement('div');
    content.className = 'content';
    const defaultSlot = document.createElement('slot');
    content.appendChild(defaultSlot);

    const footer = document.createElement('div');
    footer.className = 'footer';
    const footerSlot = document.createElement('slot');
    footerSlot.name = 'footer';
    footer.appendChild(footerSlot);

    dialog.appendChild(header);
    dialog.appendChild(content);
    dialog.appendChild(footer);
    overlay.appendChild(dialog);

    this.shadowRoot!.appendChild(style);
    this.shadowRoot!.appendChild(overlay);

    document.addEventListener('keydown', this._onKeydown);
  }

  private _update() {
    const overlay = this.shadowRoot?.querySelector('.overlay');
    if (!overlay) return;

    if (this.open) {
      overlay.classList.add('open');
      this._trapFocus();
    } else {
      overlay.classList.remove('open');
      this._restoreFocus();
    }
  }

  private _onKeydown = (e: KeyboardEvent) => {
    if (!this.open) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      this.close();
    }
    if (e.key === 'Tab') {
      this._handleTab(e);
    }
  };

  private _handleTab(e: KeyboardEvent) {
    const dialog = this.shadowRoot!.querySelector('.dialog') as HTMLElement;
    const focusables = dialog.querySelectorAll<HTMLElement>(this._focusableSelector);
    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  private _trapFocus() {
    this._previousActive = document.activeElement as HTMLElement;
    const dialog = this.shadowRoot!.querySelector('.dialog') as HTMLElement;
    const firstFocusable = dialog.querySelector<HTMLElement>(this._focusableSelector);
    if (firstFocusable) {
      firstFocusable.focus();
    }
  }

  private _restoreFocus() {
    if (this._previousActive) {
      this._previousActive.focus();
      this._previousActive = null;
    }
  }

  public show() {
    this.open = true;
  }
  public close() {
    this.open = false;
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
  }
}

if (!customElements.get('elx-dialog')) {
  customElements.define('elx-dialog', ElxDialog);
}
