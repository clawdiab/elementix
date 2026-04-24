export class ElxAccordionItem extends HTMLElement {
  static observedAttributes = ['value', 'label', 'disabled'];

  private _trigger: HTMLButtonElement | null = null;
  private _content: HTMLDivElement | null = null;
  private _open = false;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this._buildDom();
  }

  attributeChangedCallback(name: string, oldVal: string, newVal: string) {
    if (oldVal === newVal) return;
    if (name === 'label' && this._trigger) {
      const span = this._trigger.querySelector('.label');
      if (span) span.textContent = newVal;
    }
    if (name === 'disabled' && this._trigger) {
      this._trigger.disabled = newVal !== null;
    }
  }

  get value(): string { return this.getAttribute('value') ?? ''; }
  set value(val: string) { this.setAttribute('value', val); }

  get label(): string { return this.getAttribute('label') ?? ''; }
  set label(val: string) { this.setAttribute('label', val); }

  get disabled(): boolean { return this.hasAttribute('disabled'); }
  set disabled(val: boolean) {
    if (val) this.setAttribute('disabled', '');
    else this.removeAttribute('disabled');
  }

  get open(): boolean { return this._open; }

  toggle(force?: boolean) {
    if (this.disabled) return;
    const next = force !== undefined ? force : !this._open;
    if (next === this._open) return;
    this._open = next;
    this._updateState();
    this.dispatchEvent(new CustomEvent('toggle', { detail: { value: this.value, open: this._open }, bubbles: true }));
  }

  private _buildDom() {
    const id = `acc-${Math.random().toString(36).substring(2, 9)}`;
    const contentId = `${id}-content`;

    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
        border-bottom: 1px solid #e5e7eb;
      }

      .trigger {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: 16px 0;
        background: none;
        border: none;
        font-size: 14px;
        font-weight: 500;
        font-family: inherit;
        cursor: pointer;
        text-align: left;
        color: inherit;
        transition: color 0.15s;
      }

      .trigger:hover:not(:disabled) {
        color: #111827;
      }

      .trigger:focus-visible {
        outline: none;
        box-shadow: 0 0 0 2px #3b82f6;
        border-radius: 4px;
      }

      .trigger:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .arrow {
        width: 16px;
        height: 16px;
        transition: transform 0.2s;
        flex-shrink: 0;
      }

      .trigger[aria-expanded="true"] .arrow {
        transform: rotate(180deg);
      }

      .content {
        overflow: hidden;
        max-height: 0;
        transition: max-height 0.2s ease-out;
      }

      .content.open {
        max-height: 500px;
        transition: max-height 0.3s ease-in;
      }

      .content-inner {
        padding: 0 0 16px 0;
        font-size: 14px;
        color: #6b7280;
      }
    `;

    this._trigger = document.createElement('button');
    this._trigger.type = 'button';
    this._trigger.className = 'trigger';
    this._trigger.setAttribute('aria-expanded', 'false');
    this._trigger.setAttribute('aria-controls', contentId);
    this._trigger.id = id;
    this._trigger.disabled = this.disabled;

    const label = document.createElement('span');
    label.className = 'label';
    label.textContent = this.label;

    const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    arrow.setAttribute('class', 'arrow');
    arrow.setAttribute('viewBox', '0 0 20 20');
    arrow.setAttribute('fill', 'currentColor');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('fill-rule', 'evenodd');
    path.setAttribute('d', 'M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z');
    path.setAttribute('clip-rule', 'evenodd');
    arrow.appendChild(path);

    this._trigger.appendChild(label);
    this._trigger.appendChild(arrow);

    this._content = document.createElement('div');
    this._content.className = 'content';
    this._content.setAttribute('role', 'region');
    this._content.setAttribute('aria-labelledby', id);
    this._content.id = contentId;

    const inner = document.createElement('div');
    inner.className = 'content-inner';
    const slot = document.createElement('slot');
    inner.appendChild(slot);
    this._content.appendChild(inner);

    this.shadowRoot!.appendChild(style);
    this.shadowRoot!.appendChild(this._trigger);
    this.shadowRoot!.appendChild(this._content);

    this._trigger.addEventListener('click', () => this.toggle());
  }

  _updateState() {
    if (!this._trigger || !this._content) return;
    this._trigger.setAttribute('aria-expanded', String(this._open));
    this._content.classList.toggle('open', this._open);
  }
}

export class ElxAccordion extends HTMLElement {
  static observedAttributes = ['type'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this._buildDom();
    this.addEventListener('toggle', this._onItemToggle as EventListener);
    this.addEventListener('keydown', this._onKeydown);
  }

  disconnectedCallback() {
    this.removeEventListener('toggle', this._onItemToggle as EventListener);
    this.removeEventListener('keydown', this._onKeydown);
  }

  get type(): 'single' | 'multiple' {
    return this.getAttribute('type') === 'multiple' ? 'multiple' : 'single';
  }
  set type(val: 'single' | 'multiple') {
    this.setAttribute('type', val);
  }

  private _buildDom() {
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
      }
    `;
    const slot = document.createElement('slot');
    this.shadowRoot!.appendChild(style);
    this.shadowRoot!.appendChild(slot);
  }

  private _getItems(): ElxAccordionItem[] {
    return Array.from(this.querySelectorAll('elx-accordion-item'));
  }

  private _onItemToggle = (e: CustomEvent) => {
    if (this.type === 'single' && e.detail.open) {
      this._getItems().forEach(item => {
        if (item !== e.target && item.open) {
          item.toggle(false);
        }
      });
    }
  };

  private _onKeydown = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('elx-accordion-item')) return;

    const items = this._getItems().filter(i => !i.disabled);
    const currentItem = (target.closest('elx-accordion-item') as ElxAccordionItem);
    const currentIndex = items.indexOf(currentItem);
    if (currentIndex === -1) return;

    let nextIndex = -1;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        nextIndex = (currentIndex + 1) % items.length;
        break;
      case 'ArrowUp':
        e.preventDefault();
        nextIndex = (currentIndex - 1 + items.length) % items.length;
        break;
      case 'Home':
        e.preventDefault();
        nextIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        nextIndex = items.length - 1;
        break;
    }

    if (nextIndex >= 0) {
      const trigger = items[nextIndex].shadowRoot?.querySelector('.trigger') as HTMLElement;
      trigger?.focus();
    }
  };
}

if (!customElements.get('elx-accordion-item')) {
  customElements.define('elx-accordion-item', ElxAccordionItem);
}
if (!customElements.get('elx-accordion')) {
  customElements.define('elx-accordion', ElxAccordion);
}