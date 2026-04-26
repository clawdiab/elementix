export class ElxBreadcrumb extends HTMLElement {
  static observedAttributes = ['separator'];

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

  get separator(): string {
    return this.getAttribute('separator') || '/';
  }
  set separator(val: string) {
    this.setAttribute('separator', val);
  }

  private _buildDom() {
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
      }

      nav {
        font-size: 14px;
      }

      .crumbs {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        list-style: none;
        margin: 0;
        padding: 0;
        gap: 4px;
      }


    `;

    const nav = document.createElement('nav');
    nav.setAttribute('part', 'nav');
    nav.setAttribute('aria-label', 'Breadcrumb');
    const ol = document.createElement('ol');
    ol.setAttribute('part', 'list');
    ol.className = 'crumbs';
    const slot = document.createElement('slot');
    ol.appendChild(slot);
    nav.appendChild(ol);

    this.shadowRoot!.appendChild(style);
    this.shadowRoot!.appendChild(nav);
  }

  private _update() {
    const items = Array.from(this.querySelectorAll('elx-breadcrumb-item'));
    items.forEach((item, i) => {
      const isLast = i === items.length - 1;
      item.setAttribute('data-separator', isLast ? '' : this.separator);
      if (isLast) {
        item.setAttribute('aria-current', 'page');
      } else {
        item.removeAttribute('aria-current');
      }
    });
  }
}

export class ElxBreadcrumbItem extends HTMLElement {
  static observedAttributes = ['href', 'data-separator'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    if (!this.shadowRoot?.querySelector('.item')) this._buildDom();
    this.setAttribute('role', 'listitem');
    this._update();
  }

  attributeChangedCallback(_name: string, oldVal: string | null, newVal: string | null) {
    if (oldVal === newVal) return;
    this._update();
  }

  get href(): string {
    return this.getAttribute('href') || '';
  }
  set href(val: string) {
    this.setAttribute('href', val);
  }

  private _buildDom() {
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }

      .item {
        display: inline-flex;
        align-items: center;
      }

      a {
        color: var(--elx-color-primary-500, #6366f1);
        text-decoration: none;
      }

      a:hover {
        text-decoration: underline;
      }

      .current {
        color: var(--elx-color-neutral-700, #404040);
      }

      .separator {
        color: var(--elx-color-neutral-400, #a3a3a3);
        user-select: none;
        margin: 0 2px;
      }
    `;

    const span = document.createElement('span');
    span.className = 'item';
    const sep = document.createElement('span');
    sep.className = 'separator';
    sep.setAttribute('aria-hidden', 'true');

    this.shadowRoot!.appendChild(style);
    this.shadowRoot!.appendChild(span);
    this.shadowRoot!.appendChild(sep);
  }

  private _update() {
    const container = this.shadowRoot?.querySelector('.item') as HTMLElement;
    const sep = this.shadowRoot?.querySelector('.separator') as HTMLElement;
    if (!container) return;

    container.innerHTML = '';

    const isCurrent = this.hasAttribute('aria-current');

    if (this.href && !isCurrent) {
      const a = document.createElement('a');
      // Sanitize href to prevent javascript: URLs
      const href = this.href;
      if (!/^javascript:/i.test(href)) {
        a.href = href;
      }
      a.appendChild(document.createElement('slot'));
      container.appendChild(a);
    } else {
      const span = document.createElement('span');
      span.className = isCurrent ? 'current' : '';
      span.appendChild(document.createElement('slot'));
      container.appendChild(span);
    }

    if (sep) {
      const sepText = this.getAttribute('data-separator') || '';
      sep.textContent = sepText;
      sep.style.display = sepText ? '' : 'none';
    }
  }
}

if (!customElements.get('elx-breadcrumb')) {
  customElements.define('elx-breadcrumb', ElxBreadcrumb);
}
if (!customElements.get('elx-breadcrumb-item')) {
  customElements.define('elx-breadcrumb-item', ElxBreadcrumbItem);
}
