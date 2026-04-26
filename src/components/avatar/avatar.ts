const avatarStyles = `
  :host {
    --elx-avatar-bg: var(--elx-color-surface-muted, #f1f5f9);
    --elx-avatar-text: var(--elx-color-text, #1e293b);
    --elx-avatar-radius: var(--elx-radius-full, 9999px);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
    font-family: var(--elx-font-family, inherit);
    font-weight: 500;
    color: var(--elx-avatar-text);
    background-color: var(--elx-avatar-bg);
    border-radius: var(--elx-avatar-radius);
    overflow: hidden;
    user-select: none;
  }

  :host([size="xs"]) { width: 24px; height: 24px; font-size: 10px; }
  :host([size="sm"]) { width: 32px; height: 32px; font-size: 12px; }
  :host([size="md"]) { width: 40px; height: 40px; font-size: 14px; }
  :host([size="lg"]) { width: 48px; height: 48px; font-size: 16px; }
  :host([size="xl"]) { width: 64px; height: 64px; font-size: 20px; }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .initials {
    text-transform: uppercase;
  }
`;

export class ElxAvatar extends HTMLElement {
  static observedAttributes = ['src', 'alt', 'name', 'size'];

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

  attributeChangedCallback() {
    if (this._rendered) {
      this._render();
    }
  }

  get src(): string | null {
    return this.getAttribute('src');
  }

  set src(val: string | null) {
    if (val) this.setAttribute('src', val);
    else this.removeAttribute('src');
  }

  get alt(): string {
    return this.getAttribute('alt') || '';
  }

  set alt(val: string) {
    this.setAttribute('alt', val);
  }

  get name(): string | null {
    return this.getAttribute('name');
  }

  set name(val: string | null) {
    if (val) this.setAttribute('name', val);
    else this.removeAttribute('name');
  }

  get size(): 'xs' | 'sm' | 'md' | 'lg' | 'xl' {
    const val = this.getAttribute('size');
    return val === 'xs' || val === 'sm' || val === 'lg' || val === 'xl' ? val : 'md';
  }

  set size(val: 'xs' | 'sm' | 'md' | 'lg' | 'xl') {
    this.setAttribute('size', val);
  }

  private _getInitials(name: string): string {
    const trimmed = name.trim();
    if (!trimmed) return '';
    const words = trimmed.split(/\s+/);
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  }

  private _onImgError = () => {
    this.removeAttribute('src');
  };

  private _render() {
    const shadow = this.shadowRoot!;
    shadow.innerHTML = `<style>${avatarStyles}</style>`;

    const src = this.src;
    const name = this.name;
    const label = this.alt || (name ? name : 'Avatar');

    this.setAttribute('role', 'img');
    this.setAttribute('aria-label', label);

    if (src) {
      const img = document.createElement('img');
      img.src = src;
      img.alt = label;
      img.setAttribute('part', 'image');
      img.addEventListener('error', this._onImgError);
      shadow.appendChild(img);
    } else if (name && name.trim()) {
      const span = document.createElement('span');
      span.className = 'initials';
      span.setAttribute('part', 'fallback');
      span.textContent = this._getInitials(name);
      shadow.appendChild(span);
    }
  }
}

if (!customElements.get('elx-avatar')) {
  customElements.define('elx-avatar', ElxAvatar);
}

declare global {
  interface HTMLElementTagNameMap {
    'elx-avatar': ElxAvatar;
  }
}
