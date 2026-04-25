const VALID_SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
const VALID_SHAPES = ['circle', 'square'] as const;

type Size = (typeof VALID_SIZES)[number];
type Shape = (typeof VALID_SHAPES)[number];

export class ElxAvatar extends HTMLElement {
  static observedAttributes = ['src', 'alt', 'fallback', 'size', 'shape'];

  private _img: HTMLImageElement | null = null;
  private _fallback: HTMLSpanElement | null = null;
  private _hasError = false;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this._buildDom();
    this._update();
  }
  attributeChangedCallback() {
    this._update();
  }

  get src(): string {
    return this.getAttribute('src') ?? '';
  }
  set src(val: string) {
    this.setAttribute('src', val);
  }

  get alt(): string {
    return this.getAttribute('alt') ?? '';
  }
  set alt(val: string) {
    this.setAttribute('alt', val);
  }

  get fallback(): string {
    return this.getAttribute('fallback') ?? '';
  }
  set fallback(val: string) {
    this.setAttribute('fallback', val);
  }

  get size(): Size {
    const val = this.getAttribute('size');
    return (VALID_SIZES as readonly string[]).indexOf(val as string) !== -1 ? (val as Size) : 'md';
  }
  set size(val: string) {
    this.setAttribute('size', val);
  }

  get shape(): Shape {
    const val = this.getAttribute('shape');
    return (VALID_SHAPES as readonly string[]).indexOf(val as string) !== -1
      ? (val as Shape)
      : 'circle';
  }
  set shape(val: string) {
    this.setAttribute('shape', val);
  }

  private _buildDom() {
    const style = document.createElement('style');
    style.textContent = `
      :host { display: inline-block; }

      .avatar {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        background: var(--elx-color-neutral-200);
        flex-shrink: 0;
      }

      .avatar.circle { border-radius: 50%; }
      .avatar.square { border-radius: var(--elx-radius-md); }

      .avatar.xs { width: 24px; height: 24px; }
      .avatar.sm { width: 32px; height: 32px; }
      .avatar.md { width: 40px; height: 40px; }
      .avatar.lg { width: 48px; height: 48px; }
      .avatar.xl { width: 64px; height: 64px; }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .fallback {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        color: var(--elx-color-neutral-500);
        font-family: var(--elx-font-family-sans);
        font-weight: var(--elx-font-weight-medium);
        text-transform: uppercase;
      }

      .fallback.xs { font-size: 10px; }
      .fallback.sm { font-size: 12px; }
      .fallback.md { font-size: 14px; }
      .fallback.lg { font-size: 16px; }
      .fallback.xl { font-size: 20px; }
    `;

    const wrapper = document.createElement('span');
    wrapper.className = 'avatar';

    this._img = document.createElement('img');
    this._img.addEventListener('error', () => this._handleError());

    this._fallback = document.createElement('span');
    this._fallback.className = 'fallback';

    wrapper.appendChild(this._img);
    wrapper.appendChild(this._fallback);

    this.shadowRoot!.appendChild(style);
    this.shadowRoot!.appendChild(wrapper);
  }

  private _update() {
    if (!this._img) return;

    const size = this.size;
    const shape = this.shape;
    const src = this.src;
    const alt = this.alt;
    const fb = this.fallback;

    const wrapper = this.shadowRoot!.querySelector('.avatar') as HTMLElement;
    wrapper.className = `avatar ${size} ${shape}`;

    this._img.src = src;
    this._img.alt = alt;

    this._fallback!.className = `fallback ${size}`;
    this._fallback!.textContent = fb.slice(0, 2);

    if (!src || this._hasError) {
      this._img.style.display = 'none';
      this._fallback!.style.display = 'flex';
    } else {
      this._img.style.display = 'block';
      this._fallback!.style.display = 'none';
    }
  }

  private _handleError() {
    this._hasError = true;
    this._update();
  }
}

if (!customElements.get('elx-avatar')) {
  customElements.define('elx-avatar', ElxAvatar);
}
