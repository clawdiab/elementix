export class ElxProgress extends HTMLElement {
  static observedAttributes = ['value', 'max', 'variant', 'size', 'label'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    if (!this.shadowRoot?.querySelector('.progress')) this._buildDom();
    this._update();
  }

  attributeChangedCallback(_name: string, oldVal: string | null, newVal: string | null) {
    if (oldVal === newVal) return;
    this._update();
  }

  get value(): number {
    return Number(this.getAttribute('value')) || 0;
  }
  set value(val: number) {
    this.setAttribute('value', String(val));
  }

  get max(): number {
    return Number(this.getAttribute('max')) || 100;
  }
  set max(val: number) {
    this.setAttribute('max', String(val));
  }

  get variant(): string {
    return this.getAttribute('variant') || 'primary';
  }
  set variant(val: string) {
    this.setAttribute('variant', val);
  }

  get size(): string {
    return this.getAttribute('size') || 'md';
  }
  set size(val: string) {
    this.setAttribute('size', val);
  }

  get label(): string {
    return this.getAttribute('label') || '';
  }
  set label(val: string) {
    this.setAttribute('label', val);
  }

  private _buildDom() {
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
        width: 100%;
      }

      .progress-label {
        display: flex;
        justify-content: space-between;
        margin-bottom: 4px;
        font-size: 14px;
        color: var(--elx-color-neutral-700, #404040);
      }

      .progress {
        width: 100%;
        background: var(--elx-color-neutral-100, #f5f5f5);
        border-radius: var(--elx-radius-full, 9999px);
        overflow: hidden;
      }

      .progress.sm { height: 4px; }
      .progress.md { height: 8px; }
      .progress.lg { height: 12px; }

      .bar {
        height: 100%;
        border-radius: var(--elx-radius-full, 9999px);
        transition: width 300ms ease;
      }

      .bar.primary { background: var(--elx-color-primary-500, #6366f1); }
      .bar.success { background: var(--elx-color-success-500, #22c55e); }
      .bar.warning { background: var(--elx-color-warning-500, #f59e0b); }
      .bar.danger { background: var(--elx-color-danger-500, #ef4444); }
    `;

    const labelDiv = document.createElement('div');
    labelDiv.className = 'progress-label';
    const labelText = document.createElement('span');
    labelText.className = 'label-text';
    const labelPercent = document.createElement('span');
    labelPercent.className = 'label-percent';
    labelDiv.appendChild(labelText);
    labelDiv.appendChild(labelPercent);

    const track = document.createElement('div');
    track.className = 'progress';
    track.setAttribute('role', 'progressbar');
    const bar = document.createElement('div');
    bar.className = 'bar';
    track.appendChild(bar);

    this.shadowRoot!.appendChild(style);
    this.shadowRoot!.appendChild(labelDiv);
    this.shadowRoot!.appendChild(track);
  }

  private _update() {
    const track = this.shadowRoot?.querySelector('.progress') as HTMLElement;
    const bar = this.shadowRoot?.querySelector('.bar') as HTMLElement;
    const labelText = this.shadowRoot?.querySelector('.label-text') as HTMLElement;
    const labelPercent = this.shadowRoot?.querySelector('.label-percent') as HTMLElement;
    if (!track || !bar) return;

    const percent = Math.min(100, Math.max(0, (this.value / this.max) * 100));

    track.className = `progress ${this.size}`;
    track.setAttribute('aria-valuenow', String(this.value));
    track.setAttribute('aria-valuemin', '0');
    track.setAttribute('aria-valuemax', String(this.max));
    track.setAttribute('aria-label', this.label || `${Math.round(percent)}% complete`);

    bar.className = `bar ${this.variant}`;
    bar.style.width = `${percent}%`;

    if (labelText) {
      labelText.textContent = this.label;
      const labelDiv = this.shadowRoot?.querySelector('.progress-label') as HTMLElement;
      if (labelDiv) labelDiv.style.display = this.label ? 'flex' : 'none';
    }
    if (labelPercent) {
      labelPercent.textContent = `${Math.round(percent)}%`;
    }
  }
}

export class ElxSpinner extends HTMLElement {
  static observedAttributes = ['size', 'variant', 'label'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    if (!this.shadowRoot?.querySelector('.spinner')) this._buildDom();
    this._update();
  }

  attributeChangedCallback(_name: string, oldVal: string | null, newVal: string | null) {
    if (oldVal === newVal) return;
    this._update();
  }

  get size(): string {
    return this.getAttribute('size') || 'md';
  }
  set size(val: string) {
    this.setAttribute('size', val);
  }

  get variant(): string {
    return this.getAttribute('variant') || 'primary';
  }
  set variant(val: string) {
    this.setAttribute('variant', val);
  }

  get label(): string {
    return this.getAttribute('label') || 'Loading';
  }
  set label(val: string) {
    this.setAttribute('label', val);
  }

  private _buildDom() {
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      .spinner {
        border-radius: 50%;
        border-style: solid;
        border-color: var(--elx-color-neutral-200, #e5e5e5);
        animation: spin 0.75s linear infinite;
      }

      .spinner.sm { width: 16px; height: 16px; border-width: 2px; }
      .spinner.md { width: 24px; height: 24px; border-width: 3px; }
      .spinner.lg { width: 36px; height: 36px; border-width: 4px; }

      .spinner.primary { border-top-color: var(--elx-color-primary-500, #6366f1); }
      .spinner.success { border-top-color: var(--elx-color-success-500, #22c55e); }
      .spinner.warning { border-top-color: var(--elx-color-warning-500, #f59e0b); }
      .spinner.danger { border-top-color: var(--elx-color-danger-500, #ef4444); }
    `;

    const spinner = document.createElement('div');
    spinner.className = 'spinner';

    this.shadowRoot!.appendChild(style);
    this.shadowRoot!.appendChild(spinner);
  }

  private _update() {
    const spinner = this.shadowRoot?.querySelector('.spinner') as HTMLElement;
    if (!spinner) return;
    spinner.className = `spinner ${this.size} ${this.variant}`;
    spinner.setAttribute('role', 'status');
    spinner.setAttribute('aria-label', this.label);
  }
}

if (!customElements.get('elx-progress')) {
  customElements.define('elx-progress', ElxProgress);
}
if (!customElements.get('elx-spinner')) {
  customElements.define('elx-spinner', ElxSpinner);
}
