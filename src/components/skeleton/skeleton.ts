const styles = `
  :host {
    display: block;
    --elx-skeleton-bg: var(--elx-color-neutral-200, #e2e8f0);
    --elx-skeleton-shine: var(--elx-color-neutral-100, #f1f5f9);
    --elx-skeleton-radius: var(--elx-radius-md, 0.375rem);
    --elx-skeleton-height: 1rem;
    --elx-skeleton-width: 100%;
  }

  .skeleton {
    background: var(--elx-skeleton-bg);
    border-radius: var(--elx-skeleton-radius);
    height: var(--elx-skeleton-height);
    width: var(--elx-skeleton-width);
    position: relative;
    overflow: hidden;
  }

  :host([variant="circle"]) .skeleton {
    border-radius: 50%;
    height: var(--elx-skeleton-height);
    width: var(--elx-skeleton-height);
  }

  :host([variant="text"]) .skeleton {
    border-radius: var(--elx-radius-sm, 0.25rem);
  }

  :host([animate]) .skeleton::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      var(--elx-skeleton-shine) 50%,
      transparent 100%
    );
    animation: shimmer 1.5s infinite;
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  @media (prefers-reduced-motion: reduce) {
    :host([animate]) .skeleton::after {
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 0; }
      50% { opacity: 0.5; }
    }
  }
`;

export class ElxSkeleton extends HTMLElement {
  static observedAttributes = ['variant', 'animate', 'width', 'height'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.setAttribute('role', 'status');
    this.setAttribute('aria-busy', 'true');
    if (!this.hasAttribute('aria-label')) {
      this.setAttribute('aria-label', 'Loading...');
    }
    if (!this.hasAttribute('animate')) {
      this.setAttribute('animate', '');
    }
    this._render();
  }

  attributeChangedCallback() {
    if (this.shadowRoot?.querySelector('.skeleton')) {
      this._updateStyles();
    }
  }

  get variant(): string {
    return this.getAttribute('variant') || 'rectangular';
  }

  set variant(val: string) {
    this.setAttribute('variant', val);
  }

  get animated(): boolean {
    return this.hasAttribute('animate');
  }

  set animated(val: boolean) {
    val ? this.setAttribute('animate', '') : this.removeAttribute('animate');
  }

  private _render() {
    const style = document.createElement('style');
    style.textContent = styles;

    const div = document.createElement('div');
    div.className = 'skeleton';
    this._applyInlineStyles(div);

    this.shadowRoot!.appendChild(style);
    this.shadowRoot!.appendChild(div);
  }

  private _applyInlineStyles(el: HTMLElement) {
    const width = this.getAttribute('width');
    const height = this.getAttribute('height');
    if (width) el.style.width = width;
    if (height) el.style.height = height;
  }

  private _updateStyles() {
    const div = this.shadowRoot!.querySelector('.skeleton') as HTMLElement;
    if (!div) return;
    div.style.width = '';
    div.style.height = '';
    this._applyInlineStyles(div);
  }
}

customElements.define('elx-skeleton', ElxSkeleton);
