export class ElxTable extends HTMLElement {
  static observedAttributes = ['striped', 'hoverable', 'bordered'];

  private _table: HTMLTableElement | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this._buildDom();
  }

  get striped(): boolean {
    return this.hasAttribute('striped');
  }
  set striped(val: boolean) {
    if (val) this.setAttribute('striped', '');
    else this.removeAttribute('striped');
  }

  get hoverable(): boolean {
    return this.hasAttribute('hoverable');
  }
  set hoverable(val: boolean) {
    if (val) this.setAttribute('hoverable', '');
    else this.removeAttribute('hoverable');
  }

  get bordered(): boolean {
    return this.hasAttribute('bordered');
  }
  set bordered(val: boolean) {
    if (val) this.setAttribute('bordered', '');
    else this.removeAttribute('bordered');
  }

  private _buildDom() {
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
        width: 100%;
        overflow-x: auto;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        font-size: var(--elx-font-size-sm, 14px);
        font-family: var(--elx-font-family-sans, inherit);
      }

      :host([bordered]) table {
        border: 1px solid var(--elx-color-neutral-200, #e5e7eb);
      }

      :host([bordered]) th,
      :host([bordered]) td {
        border: 1px solid var(--elx-color-neutral-200, #e5e7eb);
      }

      th {
        padding: 12px 16px;
        text-align: left;
        font-weight: var(--elx-font-weight-semibold, 600);
        color: var(--elx-color-neutral-700, #374151);
        background: var(--elx-color-neutral-50, #f9fafb);
        border-bottom: 2px solid var(--elx-color-neutral-200, #e5e7eb);
      }

      td {
        padding: 12px 16px;
        color: var(--elx-color-neutral-900, #111827);
        border-bottom: 1px solid var(--elx-color-neutral-200, #e5e7eb);
      }

      :host([striped]) tbody tr:nth-child(even) {
        background: var(--elx-color-neutral-50, #f9fafb);
      }

      :host([hoverable]) tbody tr:hover {
        background: var(--elx-color-neutral-100, #f3f4f6);
      }

      tbody tr:last-child td {
        border-bottom: none;
      }
    `;

    this._table = document.createElement('table');
    this._table.setAttribute('role', 'table');

    const slot = document.createElement('slot');
    this._table.appendChild(slot);

    this.shadowRoot!.appendChild(style);
    this.shadowRoot!.appendChild(this._table);
  }
}

export class ElxTableHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.setAttribute('role', 'rowgroup');
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: table-header-group;
      }
    `;
    const slot = document.createElement('slot');
    this.shadowRoot!.appendChild(style);
    this.shadowRoot!.appendChild(slot);
  }
}

export class ElxTableBody extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.setAttribute('role', 'rowgroup');
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: table-row-group;
      }
    `;
    const slot = document.createElement('slot');
    this.shadowRoot!.appendChild(style);
    this.shadowRoot!.appendChild(slot);
  }
}

export class ElxTableRow extends HTMLElement {
  static observedAttributes = ['selected', 'disabled'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.setAttribute('role', 'row');
    this._buildDom();
  }

  attributeChangedCallback(name: string, oldVal: string, newVal: string) {
    if (oldVal === newVal) return;
    if (name === 'selected' || name === 'disabled') {
      this._updateState();
    }
  }

  get selected(): boolean {
    return this.hasAttribute('selected');
  }
  set selected(val: boolean) {
    if (val) this.setAttribute('selected', '');
    else this.removeAttribute('selected');
  }

  get disabled(): boolean {
    return this.hasAttribute('disabled');
  }
  set disabled(val: boolean) {
    if (val) this.setAttribute('disabled', '');
    else this.removeAttribute('disabled');
  }

  private _buildDom() {
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: table-row;
      }

      :host([selected]) {
        background: var(--elx-color-primary-50, #eff6ff) !important;
      }

      :host([disabled]) {
        opacity: 0.5;
        pointer-events: none;
      }
    `;
    const slot = document.createElement('slot');
    this.shadowRoot!.appendChild(style);
    this.shadowRoot!.appendChild(slot);
  }

  private _updateState() {
    this.setAttribute('aria-selected', String(this.selected));
    this.setAttribute('aria-disabled', String(this.disabled));
  }
}

export class ElxTableCell extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.setAttribute('role', 'cell');
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: table-cell;
      }
    `;
    const slot = document.createElement('slot');
    this.shadowRoot!.appendChild(style);
    this.shadowRoot!.appendChild(slot);
  }
}

export class ElxTableHeaderCell extends HTMLElement {
  static observedAttributes = ['sortable', 'sort-direction'];

  private _button: HTMLButtonElement | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.setAttribute('role', 'columnheader');
    this._buildDom();
  }

  attributeChangedCallback(name: string, oldVal: string, newVal: string) {
    if (oldVal === newVal) return;
    if (name === 'sortable' || name === 'sort-direction') {
      this._updateSortState();
    }
  }

  get sortable(): boolean {
    return this.hasAttribute('sortable');
  }
  set sortable(val: boolean) {
    if (val) this.setAttribute('sortable', '');
    else this.removeAttribute('sortable');
  }

  get sortDirection(): 'asc' | 'desc' | 'none' {
    const val = this.getAttribute('sort-direction');
    if (val === 'asc' || val === 'desc') return val;
    return 'none';
  }
  set sortDirection(val: 'asc' | 'desc' | 'none') {
    if (val === 'none') this.removeAttribute('sort-direction');
    else this.setAttribute('sort-direction', val);
  }

  private _buildDom() {
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: table-cell;
      }

      .header-content {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      button {
        display: flex;
        align-items: center;
        gap: 4px;
        background: none;
        border: none;
        padding: 0;
        font: inherit;
        color: inherit;
        cursor: pointer;
      }

      button:focus-visible {
        outline: none;
        box-shadow: 0 0 0 2px var(--elx-color-primary-500, #3b82f6);
        border-radius: var(--elx-radius-sm, 4px);
      }

      .sort-icon {
        width: 14px;
        height: 14px;
        opacity: 0.3;
        transition: opacity 0.15s, transform 0.15s;
      }

      button:hover .sort-icon {
        opacity: 0.7;
      }

      button[aria-sort="ascending"] .sort-icon,
      button[aria-sort="descending"] .sort-icon {
        opacity: 1;
      }

      button[aria-sort="descending"] .sort-icon {
        transform: rotate(180deg);
      }
    `;

    const slot = document.createElement('slot');

    if (this.sortable) {
      this._button = document.createElement('button');
      this._button.type = 'button';
      this._button.className = 'header-content';
      const textSpan = document.createElement('span');
      textSpan.appendChild(slot);

      const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      icon.setAttribute('class', 'sort-icon');
      icon.setAttribute('viewBox', '0 0 20 20');
      icon.setAttribute('fill', 'currentColor');
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('fill-rule', 'evenodd');
      path.setAttribute('d', 'M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z');
      path.setAttribute('clip-rule', 'evenodd');
      icon.appendChild(path);

      this._button.appendChild(textSpan);
      this._button.appendChild(icon);

      this._button.addEventListener('click', () => this._handleSortClick());

      this.shadowRoot!.appendChild(style);
      this.shadowRoot!.appendChild(this._button);
    } else {
      this.shadowRoot!.appendChild(style);
      this.shadowRoot!.appendChild(slot);
    }
  }

  private _updateSortState() {
    if (!this._button) return;
    const direction = this.sortDirection;
    if (direction === 'none') {
      this._button.removeAttribute('aria-sort');
    } else {
      this._button.setAttribute('aria-sort', direction === 'asc' ? 'ascending' : 'descending');
    }
  }

  private _handleSortClick() {
    const nextDirection = this.sortDirection === 'none' ? 'asc' : this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.dispatchEvent(
      new CustomEvent('sort', {
        detail: { direction: nextDirection },
        bubbles: true,
        composed: true,
      }),
    );
  }
}

if (!customElements.get('elx-table')) {
  customElements.define('elx-table', ElxTable);
}
if (!customElements.get('elx-table-header')) {
  customElements.define('elx-table-header', ElxTableHeader);
}
if (!customElements.get('elx-table-body')) {
  customElements.define('elx-table-body', ElxTableBody);
}
if (!customElements.get('elx-table-row')) {
  customElements.define('elx-table-row', ElxTableRow);
}
if (!customElements.get('elx-table-cell')) {
  customElements.define('elx-table-cell', ElxTableCell);
}
if (!customElements.get('elx-table-header-cell')) {
  customElements.define('elx-table-header-cell', ElxTableHeaderCell);
}
