export class ElxPagination extends HTMLElement {
  static observedAttributes = ['page', 'total', 'per-page', 'sibling-count'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    if (!this.shadowRoot?.querySelector('nav')) this._buildDom();
    this._update();
  }

  attributeChangedCallback(_name: string, oldVal: string | null, newVal: string | null) {
    if (oldVal === newVal) return;
    this._update();
  }

  get page(): number {
    return Math.max(1, Number(this.getAttribute('page')) || 1);
  }
  set page(val: number) {
    this.setAttribute('page', String(val));
  }

  get total(): number {
    return Math.max(0, Number(this.getAttribute('total')) || 0);
  }
  set total(val: number) {
    this.setAttribute('total', String(val));
  }

  get perPage(): number {
    return Math.max(1, Number(this.getAttribute('per-page')) || 10);
  }
  set perPage(val: number) {
    this.setAttribute('per-page', String(val));
  }

  get siblingCount(): number {
    return Math.max(0, Number(this.getAttribute('sibling-count')) || 1);
  }
  set siblingCount(val: number) {
    this.setAttribute('sibling-count', String(val));
  }

  get totalPages(): number {
    return Math.ceil(this.total / this.perPage);
  }

  private _buildDom() {
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
      }

      nav {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 32px;
        height: 32px;
        padding: 0 8px;
        border: 1px solid var(--elx-color-neutral-200, #e5e5e5);
        border-radius: var(--elx-radius-md, 6px);
        background: var(--elx-color-neutral-0, #ffffff);
        color: var(--elx-color-neutral-700, #404040);
        font-size: 14px;
        cursor: pointer;
        transition: all 150ms ease;
      }

      button:hover:not(:disabled) {
        background: var(--elx-color-neutral-50, #fafafa);
      }

      button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      button.active {
        background: var(--elx-color-primary-500, #6366f1);
        border-color: var(--elx-color-primary-500, #6366f1);
        color: white;
      }

      .ellipsis {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 32px;
        height: 32px;
        color: var(--elx-color-neutral-400, #a3a3a3);
      }
    `;

    const nav = document.createElement('nav');
    nav.setAttribute('aria-label', 'Pagination');

    this.shadowRoot!.appendChild(style);
    this.shadowRoot!.appendChild(nav);
  }

  private _update() {
    const nav = this.shadowRoot?.querySelector('nav');
    if (!nav) return;

    nav.innerHTML = '';

    const totalPages = this.totalPages;
    if (totalPages <= 1) return;

    // Previous button
    const prevBtn = this._createButton('Previous', this.page > 1, () => this._goToPage(this.page - 1));
    prevBtn.setAttribute('aria-label', 'Go to previous page');
    nav.appendChild(prevBtn);

    // Page numbers
    const pages = this._getPages();
    pages.forEach((p) => {
      if (p === 'ellipsis') {
        const ellipsis = document.createElement('span');
        ellipsis.className = 'ellipsis';
        ellipsis.textContent = '...';
        ellipsis.setAttribute('aria-hidden', 'true');
        nav.appendChild(ellipsis);
      } else {
        const btn = this._createButton(String(p), true, () => this._goToPage(p as number));
        if (p === this.page) {
          btn.classList.add('active');
          btn.setAttribute('aria-current', 'page');
        }
        btn.setAttribute('aria-label', `Page ${p}`);
        nav.appendChild(btn);
      }
    });

    // Next button
    const nextBtn = this._createButton('Next', this.page < totalPages, () => this._goToPage(this.page + 1));
    nextBtn.setAttribute('aria-label', 'Go to next page');
    nav.appendChild(nextBtn);
  }

  private _createButton(text: string, enabled: boolean, onClick: () => void): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.disabled = !enabled;
    if (enabled) {
      btn.addEventListener('click', onClick);
    }
    return btn;
  }

  private _getPages(): (number | 'ellipsis')[] {
    const totalPages = this.totalPages;
    const page = this.page;
    const siblingCount = this.siblingCount;

    // Always show first and last
    const first = 1;
    const last = totalPages;

    // Calculate range around current page
    const leftSibling = Math.max(first, page - siblingCount);
    const rightSibling = Math.min(last, page + siblingCount);

    const pages: (number | 'ellipsis')[] = [];

    // First page
    pages.push(first);

    // Left ellipsis
    if (leftSibling > first + 1) {
      pages.push('ellipsis');
    } else if (leftSibling === first + 1) {
      pages.push(first + 1);
    }

    // Pages between left and right sibling (excluding first and last)
    for (let i = Math.max(first + 1, leftSibling); i <= Math.min(last - 1, rightSibling); i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    // Right ellipsis
    if (rightSibling < last - 1) {
      pages.push('ellipsis');
    } else if (rightSibling === last - 1) {
      pages.push(last - 1);
    }

    // Last page
    if (last > first) {
      pages.push(last);
    }

    return pages;
  }

  private _goToPage(newPage: number) {
    const clampedPage = Math.max(1, Math.min(this.totalPages, newPage));
    this.page = clampedPage;
    this.dispatchEvent(new CustomEvent('change', { detail: { page: clampedPage }, bubbles: true, composed: true }));
  }
}

if (!customElements.get('elx-pagination')) {
  customElements.define('elx-pagination', ElxPagination);
}
