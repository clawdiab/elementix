export class ElxSlider extends HTMLElement {
  static observedAttributes = ['value', 'min', 'max', 'step', 'disabled', 'label', 'size', 'variant'];

  private _boundHandleInput: (e: Event) => void;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._boundHandleInput = this._handleInput.bind(this);
  }

  connectedCallback() {
    if (!this.shadowRoot?.querySelector('.slider-track')) this._buildDom();
    this._update();
    const input = this.shadowRoot!.querySelector('input') as HTMLInputElement;
    input.addEventListener('input', this._boundHandleInput);
  }

  disconnectedCallback() {
    const input = this.shadowRoot?.querySelector('input') as HTMLInputElement;
    if (input) {
      input.removeEventListener('input', this._boundHandleInput);
    }
  }

  attributeChangedCallback(_name: string, oldVal: string | null, newVal: string | null) {
    if (oldVal === newVal) return;
    this._update();
  }

  get value(): number { return Number(this.getAttribute('value')) || 0; }
  set value(val: number) { this.setAttribute('value', String(val)); }

  get min(): number { return Number(this.getAttribute('min')) || 0; }
  set min(val: number) { this.setAttribute('min', String(val)); }

  get max(): number {
    const v = Number(this.getAttribute('max'));
    return isNaN(v) || v <= 0 ? 100 : v;
  }
  set max(val: number) { this.setAttribute('max', String(val)); }

  get step(): number { return Number(this.getAttribute('step')) || 1; }
  set step(val: number) { this.setAttribute('step', String(val)); }

  get disabled(): boolean { return this.hasAttribute('disabled'); }
  set disabled(val: boolean) { val ? this.setAttribute('disabled', '') : this.removeAttribute('disabled'); }

  get label(): string { return this.getAttribute('label') || ''; }
  set label(val: string) { this.setAttribute('label', val); }

  get size(): string { return this.getAttribute('size') || 'md'; }
  set size(val: string) { this.setAttribute('size', val); }

  get variant(): string { return this.getAttribute('variant') || 'primary'; }
  set variant(val: string) { this.setAttribute('variant', val); }

  private _handleInput(e: Event) {
    const input = e.target as HTMLInputElement;
    this.setAttribute('value', input.value);
    this._updateFill();
    this.dispatchEvent(new CustomEvent('elx-change', {
      detail: { value: Number(input.value) },
      bubbles: true,
      composed: true,
    }));
  }

  private _buildDom() {
    const style = document.createElement('style');
    style.textContent = `
      :host { display: block; width: 100%; }
      :host([disabled]) { opacity: 0.5; pointer-events: none; }

      .slider-label {
        display: flex;
        justify-content: space-between;
        margin-bottom: 6px;
        font-size: 14px;
        color: var(--elx-color-neutral-700, #404040);
      }

      .slider-track {
        position: relative;
        display: flex;
        align-items: center;
      }

      .track-bg {
        position: absolute;
        left: 0; right: 0;
        border-radius: var(--elx-radius-full, 9999px);
        background: var(--elx-color-neutral-200, #e5e5e5);
        pointer-events: none;
      }

      .track-fill {
        position: absolute;
        left: 0;
        border-radius: var(--elx-radius-full, 9999px);
        pointer-events: none;
        transition: width 100ms ease;
      }

      .track-fill.primary { background: var(--elx-color-primary-500, #6366f1); }
      .track-fill.success { background: var(--elx-color-success-500, #22c55e); }
      .track-fill.warning { background: var(--elx-color-warning-500, #f59e0b); }
      .track-fill.danger  { background: var(--elx-color-danger-500, #ef4444); }

      .slider-track.sm .track-bg,
      .slider-track.sm .track-fill { height: 4px; }
      .slider-track.md .track-bg,
      .slider-track.md .track-fill { height: 6px; }
      .slider-track.lg .track-bg,
      .slider-track.lg .track-fill { height: 8px; }

      input[type="range"] {
        -webkit-appearance: none;
        appearance: none;
        width: 100%;
        background: transparent;
        cursor: pointer;
        position: relative;
        z-index: 1;
        margin: 0;
      }

      input[type="range"]:focus { outline: none; }
      input[type="range"]:focus-visible::-webkit-slider-thumb {
        box-shadow: 0 0 0 3px var(--elx-color-primary-200, #c7d2fe);
      }
      input[type="range"]:focus-visible::-moz-range-thumb {
        box-shadow: 0 0 0 3px var(--elx-color-primary-200, #c7d2fe);
      }

      input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        border-radius: 50%;
        background: #fff;
        border: 2px solid var(--elx-color-primary-500, #6366f1);
        cursor: pointer;
        transition: transform 150ms ease;
      }
      input[type="range"]::-moz-range-thumb {
        border-radius: 50%;
        background: #fff;
        border: 2px solid var(--elx-color-primary-500, #6366f1);
        cursor: pointer;
      }

      .slider-track.sm input[type="range"] { height: 16px; }
      .slider-track.sm input[type="range"]::-webkit-slider-thumb { width: 14px; height: 14px; }
      .slider-track.sm input[type="range"]::-moz-range-thumb    { width: 14px; height: 14px; }

      .slider-track.md input[type="range"] { height: 20px; }
      .slider-track.md input[type="range"]::-webkit-slider-thumb { width: 18px; height: 18px; }
      .slider-track.md input[type="range"]::-moz-range-thumb    { width: 18px; height: 18px; }

      .slider-track.lg input[type="range"] { height: 24px; }
      .slider-track.lg input[type="range"]::-webkit-slider-thumb { width: 22px; height: 22px; }
      .slider-track.lg input[type="range"]::-moz-range-thumb    { width: 22px; height: 22px; }
    `;

    const labelDiv = document.createElement('div');
    labelDiv.className = 'slider-label';
    const labelText = document.createElement('span');
    labelText.className = 'label-text';
    const labelValue = document.createElement('span');
    labelValue.className = 'label-value';
    labelDiv.appendChild(labelText);
    labelDiv.appendChild(labelValue);

    const track = document.createElement('div');
    track.className = 'slider-track';

    const trackBg = document.createElement('div');
    trackBg.className = 'track-bg';

    const trackFill = document.createElement('div');
    trackFill.className = 'track-fill';

    const input = document.createElement('input');
    input.type = 'range';

    track.appendChild(trackBg);
    track.appendChild(trackFill);
    track.appendChild(input);

    this.shadowRoot!.appendChild(style);
    this.shadowRoot!.appendChild(labelDiv);
    this.shadowRoot!.appendChild(track);
  }

  private _updateFill() {
    const input = this.shadowRoot?.querySelector('input') as HTMLInputElement;
    const fill = this.shadowRoot?.querySelector('.track-fill') as HTMLElement;
    const labelValue = this.shadowRoot?.querySelector('.label-value') as HTMLElement;
    if (!input || !fill) return;
    const pct = ((Number(input.value) - this.min) / (this.max - this.min)) * 100;
    fill.style.width = `${Math.max(0, Math.min(100, pct))}%`;
    if (labelValue) labelValue.textContent = input.value;
  }

  private _update() {
    const input = this.shadowRoot?.querySelector('input') as HTMLInputElement;
    const track = this.shadowRoot?.querySelector('.slider-track') as HTMLElement;
    const fill = this.shadowRoot?.querySelector('.track-fill') as HTMLElement;
    const labelText = this.shadowRoot?.querySelector('.label-text') as HTMLElement;
    const labelDiv = this.shadowRoot?.querySelector('.slider-label') as HTMLElement;
    if (!input || !track) return;

    input.min = String(this.min);
    input.max = String(this.max);
    input.step = String(this.step);
    input.value = String(this.value);
    input.disabled = this.disabled;
    input.setAttribute('aria-valuemin', String(this.min));
    input.setAttribute('aria-valuemax', String(this.max));
    input.setAttribute('aria-valuenow', String(this.value));
    if (this.label) input.setAttribute('aria-label', this.label);

    track.className = `slider-track ${this.size}`;
    if (fill) fill.className = `track-fill ${this.variant}`;

    if (labelText) labelText.textContent = this.label;
    if (labelDiv) labelDiv.style.display = this.label ? 'flex' : 'none';

    this._updateFill();
  }
}

if (!customElements.get('elx-slider')) {
  customElements.define('elx-slider', ElxSlider);
}
