const stepperStyles = `
  :host {
    --elx-stepper-bg: var(--elx-color-surface, #ffffff);
    --elx-stepper-border: var(--elx-color-border, #e2e8f0);
    --elx-stepper-text: var(--elx-color-text, #1e293b);
    --elx-stepper-muted: var(--elx-color-text-muted, #64748b);
    --elx-stepper-primary: var(--elx-color-primary, #3b82f6);
    --elx-stepper-success: var(--elx-color-success, #22c55e);
    --elx-stepper-radius: var(--elx-radius-md, 0.5rem);
    display: block;
  }

  .stepper {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .stepper.horizontal {
    flex-direction: row;
    align-items: flex-start;
  }

  .step {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    flex: 1;
    position: relative;
  }

  .horizontal .step {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .step:not(:last-child)::after {
    content: '';
    position: absolute;
    left: 1rem;
    top: 2.5rem;
    bottom: 0;
    width: 2px;
    background: var(--elx-stepper-border);
  }

  .horizontal .step:not(:last-child)::after {
    left: auto;
    top: 1rem;
    right: 0;
    bottom: auto;
    width: calc(100% - 2rem);
    height: 2px;
    transform: translateX(50%);
  }

  .step.completed::after {
    background: var(--elx-stepper-primary);
  }

  .step-indicator {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--elx-font-family-sans, system-ui, sans-serif);
    font-size: 0.875rem;
    font-weight: 600;
    flex-shrink: 0;
    background: var(--elx-stepper-bg);
    border: 2px solid var(--elx-stepper-border);
    color: var(--elx-stepper-muted);
    transition: all 0.2s;
  }

  .step.active .step-indicator {
    border-color: var(--elx-stepper-primary);
    color: var(--elx-stepper-primary);
  }

  .step.completed .step-indicator {
    background: var(--elx-stepper-primary);
    border-color: var(--elx-stepper-primary);
    color: white;
  }

  .step.error .step-indicator {
    background: var(--elx-color-danger, #ef4444);
    border-color: var(--elx-color-danger, #ef4444);
    color: white;
  }

  .step-content {
    flex: 1;
    padding-bottom: 1rem;
  }

  .horizontal .step-content {
    padding-bottom: 0;
    padding-top: 0.5rem;
  }

  .step-title {
    font-family: var(--elx-font-family-sans, system-ui, sans-serif);
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--elx-stepper-text);
    margin: 0;
  }

  .step-description {
    font-family: var(--elx-font-family-sans, system-ui, sans-serif);
    font-size: 0.75rem;
    color: var(--elx-stepper-muted);
    margin: 0.25rem 0 0;
  }

  .step-panel {
    display: none;
    padding: 1rem 0 0 2.75rem;
  }

  .horizontal .step-panel {
    padding: 1rem 0 0 0;
  }

  .step.active .step-panel {
    display: block;
  }

  .check-icon {
    display: none;
  }

  .step.completed .check-icon {
    display: block;
  }

  .step.completed .step-number {
    display: none;
  }
`;

export class ElxStepper extends HTMLElement {
  static observedAttributes = ['orientation', 'active-step'];

  private _steps: HTMLElement[] = [];
  private _rendered = false;
  private _boundSlotChange: () => void;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._boundSlotChange = this._handleSlotChange.bind(this);
  }

  connectedCallback() {
    if (!this._rendered) {
      this._render();
      this._rendered = true;
    }
    this._updateSteps();
    const slot = this.shadowRoot?.querySelector('slot');
    if (slot) {
      slot.addEventListener('slotchange', this._boundSlotChange);
    }
  }

  disconnectedCallback() {
    const slot = this.shadowRoot?.querySelector('slot');
    if (slot) {
      slot.removeEventListener('slotchange', this._boundSlotChange);
    }
  }

  private _handleSlotChange() {
    this._updateSteps();
  }

  attributeChangedCallback(name: string, oldVal: string | null, newVal: string | null) {
    if (oldVal === newVal) return;
    if (name === 'orientation') {
      this._updateOrientation();
    }
    if (name === 'active-step') {
      this._updateActiveStep();
    }
  }

  get orientation(): 'horizontal' | 'vertical' {
    return this.getAttribute('orientation') === 'horizontal' ? 'horizontal' : 'vertical';
  }
  set orientation(val: 'horizontal' | 'vertical') {
    this.setAttribute('orientation', val);
  }

  get activeStep(): number {
    const val = parseInt(this.getAttribute('active-step') || '0', 10);
    return isNaN(val) || val < 0 ? 0 : val;
  }
  set activeStep(val: number) {
    this.setAttribute('active-step', String(val));
  }

  next() {
    if (this.activeStep < this._steps.length - 1) {
      this.activeStep++;
    }
  }

  prev() {
    if (this.activeStep > 0) {
      this.activeStep--;
    }
  }

  goTo(index: number) {
    if (index >= 0 && index < this._steps.length) {
      this.activeStep = index;
    }
  }

  private _render() {
    this.shadowRoot!.innerHTML = `
      <style>${stepperStyles}</style>
      <div class="stepper" role="list" aria-label="Progress steps">
        <slot></slot>
      </div>
    `;
  }

  private _updateSteps() {
    this._steps = Array.from(this.querySelectorAll('elx-step')) as HTMLElement[];
    this._steps.forEach((step, index) => {
      step.setAttribute('data-index', String(index));
      if (index === this.activeStep) {
        step.setAttribute('active', '');
      } else {
        step.removeAttribute('active');
      }
      if (index < this.activeStep) {
        step.setAttribute('completed', '');
      } else {
        step.removeAttribute('completed');
      }
    });
    this._updateOrientation();
  }

  private _updateOrientation() {
    const container = this.shadowRoot?.querySelector('.stepper');
    if (container) {
      container.classList.toggle('horizontal', this.orientation === 'horizontal');
    }
  }

  private _updateActiveStep() {
    this._steps.forEach((step, index) => {
      if (index === this.activeStep) {
        step.setAttribute('active', '');
      } else {
        step.removeAttribute('active');
      }
      if (index < this.activeStep) {
        step.setAttribute('completed', '');
      } else {
        step.removeAttribute('completed');
      }
    });
    this.dispatchEvent(new CustomEvent('elx-stepper-change', {
      bubbles: true,
      composed: true,
      detail: { activeStep: this.activeStep },
    }));
  }
}

const stepStyles = `
  :host {
    display: block;
  }

  :host(:last-child) .step::after {
    display: none;
  }
`;

export class ElxStep extends HTMLElement {
  static observedAttributes = ['title', 'description', 'active', 'completed', 'error'];

  private _rendered = false;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    if (!this._rendered) {
      this._render();
      this._rendered = true;
    }
  }

  attributeChangedCallback(name: string, oldVal: string | null, newVal: string | null) {
    if (oldVal === newVal) return;
    if (name === 'title' || name === 'description') {
      this._updateContent();
    }
    if (name === 'active' || name === 'completed' || name === 'error') {
      this._updateState();
    }
  }

  get title(): string { return this.getAttribute('title') || ''; }
  set title(val: string) { this.setAttribute('title', val); }

  get description(): string { return this.getAttribute('description') || ''; }
  set description(val: string) { this.setAttribute('description', val); }

  get active(): boolean { return this.hasAttribute('active'); }
  set active(val: boolean) { val ? this.setAttribute('active', '') : this.removeAttribute('active'); }

  get completed(): boolean { return this.hasAttribute('completed'); }
  set completed(val: boolean) { val ? this.setAttribute('completed', '') : this.removeAttribute('completed'); }

  get error(): boolean { return this.hasAttribute('error'); }
  set error(val: boolean) { val ? this.setAttribute('error', '') : this.removeAttribute('error'); }

  private _render() {
    const index = this.getAttribute('data-index') || '0';
    this.shadowRoot!.innerHTML = `
      <style>${stepStyles}</style>
      <div class="step" role="listitem" aria-current="false">
        <div class="step-indicator" aria-hidden="true">
          <span class="step-number">${parseInt(index, 10) + 1}</span>
          <svg class="check-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <div class="step-content">
          <p class="step-title"></p>
          <p class="step-description"></p>
        </div>
        <div class="step-panel">
          <slot></slot>
        </div>
      </div>
    `;
    this._updateContent();
    this._updateState();
  }

  private _updateContent() {
    const titleEl = this.shadowRoot?.querySelector('.step-title');
    const descEl = this.shadowRoot?.querySelector('.step-description');
    if (titleEl) titleEl.textContent = this.title;
    if (descEl) descEl.textContent = this.description;
  }

  private _updateState() {
    const step = this.shadowRoot?.querySelector('.step');
    if (!step) return;
    step.classList.toggle('active', this.active);
    step.classList.toggle('completed', this.completed);
    step.classList.toggle('error', this.error);
    step.setAttribute('aria-current', this.active ? 'step' : 'false');
  }
}

if (!customElements.get('elx-stepper')) {
  customElements.define('elx-stepper', ElxStepper);
}
if (!customElements.get('elx-step')) {
  customElements.define('elx-step', ElxStep);
}
