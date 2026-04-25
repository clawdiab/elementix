export class ElxTabPanel extends HTMLElement {
  static observedAttributes = ['name', 'active'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() { this._buildDom(); this._update(); }
  attributeChangedCallback() { this._update(); }

  get name(): string { return this.getAttribute('name') ?? ''; }
  set name(val: string) { this.setAttribute('name', val); }

  get active(): boolean { return this.hasAttribute('active'); }
  set active(val: boolean) { val ? this.setAttribute('active', '') : this.removeAttribute('active'); }

  private _buildDom() {
    const style = document.createElement('style');
    style.textContent = `
      :host { display: none; }
      :host([active]) { display: block; }
      .panel { padding: 16px 0; }
    `;
    const div = document.createElement('div');
    div.className = 'panel';
    div.setAttribute('role', 'tabpanel');
    const slot = document.createElement('slot');
    div.appendChild(slot);
    this.shadowRoot!.appendChild(style);
    this.shadowRoot!.appendChild(div);
  }

  private _update() {
    const panel = this.shadowRoot?.querySelector('.panel');
    if (!panel) return;
    panel.setAttribute('aria-labelledby', `tab-${this.name}`);
    panel.id = `panel-${this.name}`;
  }
}

export class ElxTabs extends HTMLElement {
  static observedAttributes = ['value'];

  private _tabList: HTMLDivElement | null = null;
  private _rendering = false;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this._buildDom();
    this._renderTabs();
  }

  attributeChangedCallback() { this._renderTabs(); }

  get value(): string { return this.getAttribute('value') ?? ''; }
  set value(val: string) { this.setAttribute('value', val); }

  private _buildDom() {
    const style = document.createElement('style');
    style.textContent = `
      :host { display: block; }

      .tab-list {
        display: flex;
        border-bottom: 1px solid var(--elx-color-neutral-200);
        gap: 0;
      }

      .tab {
        padding: 8px 16px;
        border: none;
        background: transparent;
        cursor: pointer;
        font-family: var(--elx-font-family-sans);
        font-size: 14px;
        color: var(--elx-color-neutral-500);
        border-bottom: 2px solid transparent;
        transition: color 0.15s, border-color 0.15s;
        position: relative;
        bottom: -1px;
      }

      .tab:hover { color: var(--elx-color-neutral-900); }
      .tab[aria-selected="true"] {
        color: var(--elx-color-primary-500);
        border-bottom-color: var(--elx-color-primary-500);
        font-weight: var(--elx-font-weight-medium);
      }

      .tab:focus-visible {
        outline: 2px solid var(--elx-color-primary-500);
        outline-offset: -2px;
      }
    `;

    this._tabList = document.createElement('div');
    this._tabList.className = 'tab-list';
    this._tabList.setAttribute('role', 'tablist');
    this._tabList.addEventListener('keydown', this._onKeydown);

    const panelSlot = document.createElement('slot');

    this.shadowRoot!.appendChild(style);
    this.shadowRoot!.appendChild(this._tabList);
    this.shadowRoot!.appendChild(panelSlot);
  }

  private _renderTabs() {
    if (!this._tabList || this._rendering) return;
    this._rendering = true;

    const panels: Element[] = [];
    this.querySelectorAll('elx-tab-panel').forEach(p => panels.push(p));
    const currentValue = this.value || (panels[0]?.getAttribute('name') ?? '');

    while (this._tabList.firstChild) {
      this._tabList.removeChild(this._tabList.firstChild);
    }

    panels.forEach((panel) => {
      const name = panel.getAttribute('name') ?? '';
      const label = panel.getAttribute('label') ?? name;
      const isActive = name === currentValue;

      const btn = document.createElement('button');
      btn.className = 'tab';
      btn.type = 'button';
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', String(isActive));
      btn.setAttribute('aria-controls', `panel-${name}`);
      btn.id = `tab-${name}`;
      btn.tabIndex = isActive ? 0 : -1;
      btn.textContent = label;

      btn.addEventListener('click', () => this._selectTab(name));

      this._tabList!.appendChild(btn);

      if (isActive) {
        panel.setAttribute('active', '');
      } else {
        panel.removeAttribute('active');
      }
    });

    this._rendering = false;
  }

  private _selectTab(name: string) {
    this._rendering = true;
    this.value = name;
    this._rendering = false;
    this._renderTabs();
    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: { value: name }
    }));
  }

  private _onKeydown = (e: KeyboardEvent) => {
    const tabs: HTMLButtonElement[] = [];
    this._tabList!.querySelectorAll<HTMLButtonElement>('.tab').forEach(t => tabs.push(t));
    let current = -1;
    for (let i = 0; i < tabs.length; i++) {
      if (tabs[i].getAttribute('aria-selected') === 'true') { current = i; break; }
    }
    let next = current;

    if (e.key === 'ArrowRight') {
      next = (current + 1) % tabs.length;
    } else if (e.key === 'ArrowLeft') {
      next = (current - 1 + tabs.length) % tabs.length;
    } else if (e.key === 'Home') {
      next = 0;
    } else if (e.key === 'End') {
      next = tabs.length - 1;
    } else {
      return;
    }

    e.preventDefault();
    const panels: Element[] = [];
    this.querySelectorAll('elx-tab-panel').forEach(p => panels.push(p));
    const name = panels[next]?.getAttribute('name') ?? '';
    this._selectTab(name);
    tabs[next]?.focus();
  };
}

if (!customElements.get('elx-tab-panel')) {
  customElements.define('elx-tab-panel', ElxTabPanel);
}
if (!customElements.get('elx-tabs')) {
  customElements.define('elx-tabs', ElxTabs);
}
