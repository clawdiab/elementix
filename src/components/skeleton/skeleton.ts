const skeletonStyles = `
  :host {
    --elx-skeleton-bg: var(--elx-color-surface-muted, #f1f5f9);
    --elx-skeleton-shine: var(--elx-color-surface, #ffffff);
    --elx-skeleton-radius: var(--elx-radius, 0.375rem);
    display: block;
  }

  .skeleton {
    background: var(--elx-skeleton-bg);
    border-radius: var(--elx-skeleton-radius);
    position: relative;
    overflow: hidden;
    min-height: 1em;
    min-width: 3em;
  }

  .skeleton::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent,
      var(--elx-skeleton-shine) 50%,
      transparent
    );
    animation: shimmer 1.5s infinite;
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  :host([variant='circle']) .skeleton {
    border-radius: 50%;
  }

  :host([variant='text']) .skeleton {
    border-radius: 0.25em;
    margin-bottom: 0.25em;
  }

  :host([animation='none']) .skeleton::after {
    animation: none;
  }

  :host([animation='pulse']) .skeleton::after {
    animation: pulse 1.5s ease-in-out infinite;
    background: var(--elx-skeleton-shine);
    opacity: 0;
  }

  @keyframes pulse {
    0%, 100% { opacity: 0; }
    50% { opacity: 0.5; }
  }
  @media (prefers-reduced-motion: reduce) {
    .skeleton::after {
      animation: none !important;
    }
  }
`;

export class ElxSkeleton extends HTMLElement {
  static observedAttributes = ['width', 'height', 'variant', 'animation'];

  private _rendered = false;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    if (!this._rendered) {
      this.setAttribute('aria-hidden', 'true');
      this._render();
      this._rendered = true;
    }
  }

  attributeChangedCallback(name: string, _oldVal: string | null, newVal: string | null) {
    if (!this._rendered) return;
    
    const skeleton = this.shadowRoot?.querySelector('.skeleton') as HTMLElement | null;
    if (!skeleton) return;

    if (name === 'width') {
      skeleton.style.width = newVal || '';
    }
    if (name === 'height') {
      skeleton.style.height = newVal || '';
    }
  }

  get width(): string {
    return this.getAttribute('width') || '';
  }

  set width(val: string) {
    if (val) this.setAttribute('width', val);
    else this.removeAttribute('width');
  }

  get height(): string {
    return this.getAttribute('height') || '';
  }

  set height(val: string) {
    if (val) this.setAttribute('height', val);
    else this.removeAttribute('height');
  }

  get variant(): 'rect' | 'circle' | 'text' {
    const val = this.getAttribute('variant');
    return val === 'circle' || val === 'text' ? val : 'rect';
  }

  set variant(val: 'rect' | 'circle' | 'text') {
    this.setAttribute('variant', val);
  }

  get animation(): 'shimmer' | 'pulse' | 'none' {
    const val = this.getAttribute('animation');
    return val === 'pulse' || val === 'none' ? val : 'shimmer';
  }

  set animation(val: 'shimmer' | 'pulse' | 'none') {
    this.setAttribute('animation', val);
  }

  private _render() {
    const width = this.getAttribute('width') || '';
    const height = this.getAttribute('height') || '';

    this.shadowRoot!.innerHTML = `
      <style>${skeletonStyles}</style>
      <div class="skeleton" style="${width ? `width:${width};` : ''}${height ? `height:${height};` : ''}" aria-hidden="true"></div>
    `;
  }
}

if (!customElements.get('elx-skeleton')) {
  customElements.define('elx-skeleton', ElxSkeleton);
}

declare global {
  interface HTMLElementTagNameMap {
    'elx-skeleton': ElxSkeleton;
  }
}
