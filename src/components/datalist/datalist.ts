const dataListStyles = `
  :host {
    --elx-datalist-bg: var(--elx-color-surface, #ffffff);
    --elx-datalist-border: var(--elx-color-border, #e2e8f0);
    --elx-datalist-radius: var(--elx-radius-md, 0.375rem);
    --elx-datalist-text: var(--elx-color-text, #1e293b);
    --elx-datalist-text-muted: var(--elx-color-text-muted, #64748b);
    --elx-datalist-hover-bg: var(--elx-color-neutral-100, #f1f5f9);
    --elx-datalist-active-bg: var(--elx-color-primary, #3b82f6);
    --elx-datalist-active-text: #ffffff;
    display: block;
  }

  .container {
    background: var(--elx-datalist-bg);
    border: 1px solid var(--elx-datalist-border);
    border-radius: var(--elx-datalist-radius);
    overflow: hidden;
    font-family: var(--elx-font-family-sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif);
  }

  .search-box {
    padding: 8px 12px;
    border-bottom: 1px solid var(--elx-datalist-border);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .search-icon {
    color: var(--elx-datalist-text-muted);
    font-size: 14px;
  }

  .search-input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: 14px;
    color: var(--elx-datalist-text);
    font-family: inherit;
    padding: 4px 0;
  }

  .search-input::placeholder {
    color: var(--elx-datalist-text-muted);
  }

  .list {
    list-style: none;
    margin: 0;
    padding: 0;
    max-height: 300px;
    overflow-y: auto;
  }

  .list-item {
    padding: 8px 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--elx-datalist-text);
    font-size: 14px;
    transition: background-color 0.15s ease;
  }

  .list-item:hover {
    background-color: var(--elx-datalist-hover-bg);
  }

  .list-item.active {
    background-color: var(--elx-datalist-active-bg);
    color: var(--elx-datalist-active-text);
  }

  .list-item.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .list-item-label {
    flex: 1;
  }

  .list-item-description {
    font-size: 12px;
    color: var(--elx-datalist-text-muted);
  }

  .list-item.active .list-item-description {
    color: inherit;
    opacity: 0.8;
  }

  .empty-state {
    padding: 24px 12px;
    text-align: center;
    color: var(--elx-datalist-text-muted);
    font-size: 14px;
  }

  .group-label {
    padding: 8px 12px 4px;
    font-size: 12px;
    font-weight: 600;
    color: var(--elx-datalist-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`;

export interface DataListItem {
  id: string;
  label: string;
  description?: string;
  group?: string;
  disabled?: boolean;
}

export class ElxDataList extends HTMLElement {
  static observedAttributes = ['placeholder', 'label'];

  private _items: DataListItem[] = [];
  private _filteredItems: DataListItem[] = [];
  private _selectedIndex = -1;
  private _searchValue = '';
  private _searchInput: HTMLInputElement | null = null;
  private _listElement: HTMLUListElement | null = null;
  private _onKeydown: (e: KeyboardEvent) => void;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._onKeydown = this._handleKeydown.bind(this);
  }

  connectedCallback() {
    if (!this.shadowRoot!.firstChild) {
      this._buildDom();
    }
    this._filterItems();
    this._updateList();
    this.addEventListener('keydown', this._onKeydown);
  }

  disconnectedCallback() {
    this.removeEventListener('keydown', this._onKeydown);
  }

  attributeChangedCallback() {
    if (this._searchInput) {
      this._searchInput.placeholder = this.getAttribute('placeholder') || 'Filter...';
    }
    const container = this.shadowRoot?.querySelector('.container');
    if (container) {
      const lbl = this.getAttribute('label');
      if (lbl) {
        container.setAttribute('aria-label', lbl);
      } else {
        container.removeAttribute('aria-label');
      }
    }
  }

  get items(): DataListItem[] {
    return this._items;
  }

  set items(val: DataListItem[]) {
    this._items = val;
    this._selectedIndex = -1;
    this._filterItems();
    this._updateList();
  }

  get selectedItem(): DataListItem | null {
    if (this._selectedIndex >= 0 && this._selectedIndex < this._filteredItems.length) {
      return this._filteredItems[this._selectedIndex];
    }
    return null;
  }

  get value(): string {
    const item = this.selectedItem;
    return item ? item.id : '';
  }

  private _buildDom() {
    const style = document.createElement('style');
    style.textContent = dataListStyles;

    const container = document.createElement('div');
    container.setAttribute('part', 'container');
    container.className = 'container';
    container.setAttribute('role', 'listbox');
    const lbl = this.getAttribute('label');
    if (lbl) {
      container.setAttribute('aria-label', lbl);
    }

    const searchBox = document.createElement('div');
    searchBox.setAttribute('part', 'search');
    searchBox.className = 'search-box';

    const searchIcon = document.createElement('span');
    searchIcon.className = 'search-icon';
    searchIcon.textContent = '🔍';
    searchIcon.setAttribute('aria-hidden', 'true');

    const searchInput = document.createElement('input');
    searchInput.className = 'search-input';
    searchInput.type = 'text';
    searchInput.placeholder = this.getAttribute('placeholder') || 'Filter...';
    searchInput.setAttribute('aria-label', 'Filter list');
    searchInput.addEventListener('input', (e) => {
      this._searchValue = (e.target as HTMLInputElement).value;
      this._selectedIndex = -1;
      this._filterItems();
      this._updateList();
    });

    this._searchInput = searchInput;

    searchBox.appendChild(searchIcon);
    searchBox.appendChild(searchInput);

    const list = document.createElement('ul');
    list.setAttribute('part', 'list');
    list.className = 'list';
    list.setAttribute('role', 'presentation');

    this._listElement = list;

    container.appendChild(searchBox);
    container.appendChild(list);

    this.shadowRoot!.appendChild(style);
    this.shadowRoot!.appendChild(container);
  }

  private _filterItems() {
    const base: DataListItem[] = [];
    for (let i = 0; i < this._items.length; i++) {
      if (!this._items[i].disabled) {
        base.push(this._items[i]);
      }
    }
    if (!this._searchValue) {
      this._filteredItems = base;
    } else {
      const query = this._searchValue.toLowerCase();
      this._filteredItems = base.filter(
        (item) =>
          item.label.toLowerCase().indexOf(query) !== -1 ||
          (item.description && item.description.toLowerCase().indexOf(query) !== -1) ||
          (item.group && item.group.toLowerCase().indexOf(query) !== -1)
      );
    }
  }

  private _updateList() {
    if (!this._listElement) return;

    this._listElement.innerHTML = '';

    if (this._filteredItems.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.textContent = 'No items found';
      this._listElement.appendChild(empty);
      return;
    }

    let currentGroup = '';

    for (let i = 0; i < this._filteredItems.length; i++) {
      const item = this._filteredItems[i];

      if (item.group && item.group !== currentGroup) {
        currentGroup = item.group;
        const groupLabel = document.createElement('div');
        groupLabel.className = 'group-label';
        groupLabel.setAttribute('aria-hidden', 'true');
        groupLabel.textContent = currentGroup;
        this._listElement.appendChild(groupLabel);
      }

      const li = document.createElement('li');
      li.id = 'elx-dl-item-' + item.id;
      li.className = 'list-item';
      const isActive = i === this._selectedIndex;
      if (isActive) {
        li.classList.add('active');
      }
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', String(isActive));
      li.addEventListener('click', () => this._selectItem(i));

      const label = document.createElement('span');
      label.className = 'list-item-label';
      label.textContent = item.label;
      li.appendChild(label);

      if (item.description) {
        const desc = document.createElement('span');
        desc.className = 'list-item-description';
        desc.textContent = item.description;
        li.appendChild(desc);
      }

      this._listElement.appendChild(li);
    }

    // Scroll active item into view
    const activeLi = this._listElement.querySelector('.list-item.active') as HTMLElement | null;
    if (activeLi && activeLi.scrollIntoView) {
      activeLi.scrollIntoView({ block: 'nearest' });
    }
  }

  private _handleKeydown(e: KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this._selectedIndex = Math.min(this._selectedIndex + 1, this._filteredItems.length - 1);
      this._updateList();
      this._emitChange();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (this._selectedIndex > 0) {
        this._selectedIndex = this._selectedIndex - 1;
        this._updateList();
        this._emitChange();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (this._selectedIndex >= 0) {
        this._selectItem(this._selectedIndex);
      }
    }
  }

  private _selectItem(index: number) {
    const item = this._filteredItems[index];
    if (!item || item.disabled) return;

    this._selectedIndex = index;
    this._updateList();

    this.dispatchEvent(
      new CustomEvent('elx-datalist-select', {
        detail: { id: item.id, label: item.label },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _emitChange() {
    const item = this.selectedItem;
    if (item) {
      this.dispatchEvent(
        new CustomEvent('elx-datalist-change', {
          detail: { id: item.id, label: item.label },
          bubbles: true,
          composed: true,
        })
      );
    }
  }
}

if (!customElements.get('elx-datalist')) {
  customElements.define('elx-datalist', ElxDataList);
}
