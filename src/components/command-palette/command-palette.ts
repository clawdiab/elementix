const commandPaletteStyles = `
  :host {
    --elx-command-bg: var(--elx-color-surface, #ffffff);
    --elx-command-border: var(--elx-color-border, #e2e8f0);
    --elx-command-radius: var(--elx-radius-md, 0.375rem);
    --elx-command-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    --elx-command-text: var(--elx-color-text, #1e293b);
    --elx-command-text-muted: var(--elx-color-text-muted, #64748b);
    --elx-command-hover-bg: var(--elx-color-neutral-100, #f1f5f9);
    --elx-command-active-bg: var(--elx-color-primary, #3b82f6);
    --elx-command-active-text: #ffffff;
  }

  :host { display: contents; }

  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    z-index: 1000;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s ease, visibility 0.2s ease;
    padding-top: 20vh;
  }

  .overlay.open {
    opacity: 1;
    visibility: visible;
  }

  .palette {
    background: var(--elx-command-bg);
    border: 1px solid var(--elx-command-border);
    border-radius: var(--elx-command-radius);
    box-shadow: var(--elx-command-shadow);
    width: 90%;
    max-width: 600px;
    max-height: 400px;
    display: flex;
    flex-direction: column;
    font-family: var(--elx-font-family-sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif);
  }

  .search-box {
    padding: 12px 16px;
    border-bottom: 1px solid var(--elx-command-border);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .search-icon {
    color: var(--elx-command-text-muted);
    font-size: 16px;
  }

  .search-input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: 14px;
    color: var(--elx-command-text);
    font-family: inherit;
  }

  .search-input::placeholder {
    color: var(--elx-command-text-muted);
  }

  .results {
    flex: 1;
    overflow-y: auto;
    list-style: none;
    margin: 0;
    padding: 4px 0;
  }

  .result-item {
    padding: 8px 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--elx-command-text);
    font-size: 14px;
    transition: background-color 0.15s ease;
  }

  .result-item:hover {
    background-color: var(--elx-command-hover-bg);
  }

  .result-item.active {
    background-color: var(--elx-command-active-bg);
    color: var(--elx-command-active-text);
  }

  .result-icon {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    opacity: 0.6;
  }

  .result-label {
    flex: 1;
  }

  .result-shortcut {
    font-size: 12px;
    opacity: 0.6;
    font-family: monospace;
  }

  .empty-state {
    padding: 32px 16px;
    text-align: center;
    color: var(--elx-command-text-muted);
    font-size: 14px;
  }

  .group-label {
    padding: 8px 16px 4px;
    font-size: 12px;
    font-weight: 600;
    color: var(--elx-command-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`;

export interface CommandItem {
  id: string;
  label: string;
  icon?: string;
  shortcut?: string;
  group?: string;
  disabled?: boolean;
}

export class ElxCommandPalette extends HTMLElement {
  static observedAttributes = ['open', 'placeholder'];

  private _items: CommandItem[] = [];
  private _filteredItems: CommandItem[] = [];
  private _selectedIndex = 0;
  private _searchValue = '';
  private _previousActive: HTMLElement | null = null;
  private _onKeydown: (e: KeyboardEvent) => void;
  private _onClickOutside: (e: Event) => void;
  private _searchInput: HTMLInputElement | null = null;
  private _resultsList: HTMLUListElement | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._onKeydown = this._handleKeydown.bind(this);
    this._onClickOutside = this._handleClickOutside.bind(this);
  }

  connectedCallback() {
    if (!this.shadowRoot!.firstChild) {
      this._buildDom();
    }
    this._update();
    document.addEventListener('keydown', this._onKeydown);
    document.addEventListener('click', this._onClickOutside);
  }

  disconnectedCallback() {
    document.removeEventListener('keydown', this._onKeydown);
    document.removeEventListener('click', this._onClickOutside);
    this._restoreFocus();
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

  get items(): CommandItem[] {
    return this._items;
  }

  set items(val: CommandItem[]) {
    this._items = val;
    this._selectedIndex = 0;
    this._filterItems();
    if (this.open) {
      this._updateResults();
    }
  }

  private _buildDom() {
    const style = document.createElement('style');
    style.textContent = commandPaletteStyles;

    const overlay = document.createElement('div');
    overlay.setAttribute('part', 'overlay');
    overlay.className = 'overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Command palette');

    const palette = document.createElement('div');
    palette.setAttribute('part', 'palette');
    palette.className = 'palette';

    const searchBox = document.createElement('div');
    searchBox.className = 'search-box';

    const searchIcon = document.createElement('span');
    searchIcon.className = 'search-icon';
    searchIcon.textContent = '🔍';
    searchIcon.setAttribute('aria-hidden', 'true');

    const searchInput = document.createElement('input');
    searchInput.className = 'search-input';
    searchInput.type = 'text';
    searchInput.placeholder = this.getAttribute('placeholder') || 'Search commands...';
    searchInput.setAttribute('aria-label', 'Search commands');
    searchInput.setAttribute('role', 'combobox');
    searchInput.setAttribute('aria-autocomplete', 'list');
    searchInput.setAttribute('aria-controls', 'elx-cp-results');
    searchInput.setAttribute('aria-expanded', 'true');
    searchInput.addEventListener('input', (e) => {
      this._searchValue = (e.target as HTMLInputElement).value;
      this._selectedIndex = 0;
      this._filterItems();
      this._updateResults();
    });

    this._searchInput = searchInput;

    searchBox.appendChild(searchIcon);
    searchBox.appendChild(searchInput);

    const results = document.createElement('ul');
    results.className = 'results';
    results.id = 'elx-cp-results';
    results.setAttribute('role', 'listbox');

    this._resultsList = results;

    palette.appendChild(searchBox);
    palette.appendChild(results);
    overlay.appendChild(palette);

    this.shadowRoot!.appendChild(style);
    this.shadowRoot!.appendChild(overlay);
  }

  private _update() {
    const overlay = this.shadowRoot?.querySelector('.overlay');
    if (!overlay) return;

    if (this.open) {
      overlay.classList.add('open');
      this._previousActive = document.activeElement as HTMLElement;
      this._searchValue = '';
      this._selectedIndex = 0;
      if (this._searchInput) {
        this._searchInput.value = '';
        this._searchInput.placeholder = this.getAttribute('placeholder') || 'Search commands...';
      }
      this._filterItems();
      this._updateResults();
      this._searchInput?.focus();
    } else {
      overlay.classList.remove('open');
      this._restoreFocus();
    }
  }

  private _restoreFocus() {
    if (this._previousActive) {
      this._previousActive.focus();
      this._previousActive = null;
    }
  }

  private _filterItems() {
    const base: CommandItem[] = [];
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
          (item.group && item.group.toLowerCase().indexOf(query) !== -1)
      );
    }
  }

  private _updateResults() {
    if (!this._resultsList) return;

    this._resultsList.innerHTML = '';

    // Update aria-activedescendant
    const activeItem = this._filteredItems[this._selectedIndex];
    if (this._searchInput) {
      this._searchInput.setAttribute(
        'aria-activedescendant',
        activeItem ? 'elx-cp-item-' + activeItem.id : ''
      );
    }

    if (this._filteredItems.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.textContent = 'No commands found';
      this._resultsList.appendChild(empty);
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
        this._resultsList.appendChild(groupLabel);
      }

      const li = document.createElement('li');
      li.id = 'elx-cp-item-' + item.id;
      li.className = 'result-item';
      const isActive = i === this._selectedIndex;
      if (isActive) {
        li.classList.add('active');
      }
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', String(isActive));
      li.addEventListener('click', () => this._selectItem(i));
      li.addEventListener('mouseenter', () => {
        this._selectedIndex = i;
        this._updateResults();
      });

      if (item.icon) {
        const icon = document.createElement('span');
        icon.className = 'result-icon';
        icon.textContent = item.icon;
        icon.setAttribute('aria-hidden', 'true');
        li.appendChild(icon);
      }

      const label = document.createElement('span');
      label.className = 'result-label';
      label.textContent = item.label;
      li.appendChild(label);

      if (item.shortcut) {
        const shortcut = document.createElement('span');
        shortcut.className = 'result-shortcut';
        shortcut.setAttribute('aria-hidden', 'true');
        shortcut.textContent = item.shortcut;
        li.appendChild(shortcut);
      }

      this._resultsList.appendChild(li);
    }

    // Scroll active item into view
    const activeLi = this._resultsList.querySelector('.result-item.active') as HTMLElement | null;
    if (activeLi && activeLi.scrollIntoView) {
      activeLi.scrollIntoView({ block: 'nearest' });
    }
  }

  private _handleKeydown(e: KeyboardEvent) {
    if (!this.open) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        this.open = true;
      }
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      this.close();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      this._selectedIndex = Math.min(this._selectedIndex + 1, this._filteredItems.length - 1);
      this._updateResults();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this._selectedIndex = Math.max(this._selectedIndex - 1, 0);
      this._updateResults();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      this._selectItem(this._selectedIndex);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      this.close();
    }
  }

  private _handleClickOutside(e: Event) {
    if (!this.open) return;

    const path = e.composedPath();
    let isInside = false;

    for (let i = 0; i < path.length; i++) {
      if (path[i] === this) {
        isInside = true;
        break;
      }
    }

    if (!isInside) {
      this.close();
    }
  }

  private _selectItem(index: number) {
    const item = this._filteredItems[index];
    if (!item || item.disabled) return;

    this.dispatchEvent(
      new CustomEvent('elx-command-select', {
        detail: { id: item.id, label: item.label },
        bubbles: true,
        composed: true,
      })
    );

    this.close();
  }

  public show() {
    this.open = true;
  }

  public close() {
    this.open = false;
  }
}

if (!customElements.get('elx-command-palette')) {
  customElements.define('elx-command-palette', ElxCommandPalette);
}
