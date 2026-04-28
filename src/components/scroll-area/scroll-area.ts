/**
 * ElxScrollArea - A custom scrollable container with styled scrollbars
 * Provides cross-browser consistent scrollbar styling
 */
export class ElxScrollArea extends HTMLElement {
  private _viewport: HTMLDivElement | null = null;
  private _scrollbarX: HTMLDivElement | null = null;
  private _scrollbarY: HTMLDivElement | null = null;
  private _thumbX: HTMLDivElement | null = null;
  private _thumbY: HTMLDivElement | null = null;
  private _boundHandleScroll: () => void;
  private _boundHandleResize: () => void;
  private _hideTimeoutId: ReturnType<typeof setTimeout> | null = null;

  static observedAttributes = ['scrollbar-x', 'scrollbar-y', 'scroll-hide-delay'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._boundHandleScroll = this._handleScroll.bind(this);
    this._boundHandleResize = this._updateThumbs.bind(this);
  }

  connectedCallback(): void {
    this._buildDom();
    this._updateThumbs();
    window.addEventListener('resize', this._boundHandleResize);
  }

  disconnectedCallback(): void {
    if (this._viewport) {
      this._viewport.removeEventListener('scroll', this._boundHandleScroll);
    }
    window.removeEventListener('resize', this._boundHandleResize);
    if (this._hideTimeoutId !== null) {
      clearTimeout(this._hideTimeoutId);
      this._hideTimeoutId = null;
    }
  }

  attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    this._updateScrollbarVisibility();
  }

  get scrollbarX(): 'auto' | 'always' | 'scroll' | 'hover' {
    const value = this.getAttribute('scrollbar-x') || 'auto';
    if (value === 'always' || value === 'scroll' || value === 'hover') return value;
    return 'auto';
  }

  set scrollbarX(value: 'auto' | 'always' | 'scroll' | 'hover') {
    this.setAttribute('scrollbar-x', value);
  }

  get scrollbarY(): 'auto' | 'always' | 'scroll' | 'hover' {
    const value = this.getAttribute('scrollbar-y') || 'auto';
    if (value === 'always' || value === 'scroll' || value === 'hover') return value;
    return 'auto';
  }

  set scrollbarY(value: 'auto' | 'always' | 'scroll' | 'hover') {
    this.setAttribute('scrollbar-y', value);
  }

  get scrollHideDelay(): number {
    const value = parseInt(this.getAttribute('scroll-hide-delay') || '600', 10);
    return isNaN(value) ? 600 : value;
  }

  set scrollHideDelay(value: number) {
    this.setAttribute('scroll-hide-delay', String(value));
  }

  private _buildDom(): void {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: relative;
          overflow: hidden;
        }

        .scroll-area {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .viewport {
          width: 100%;
          height: 100%;
          overflow: scroll;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .viewport::-webkit-scrollbar {
          display: none;
        }

        .content {
          display: inline-block;
          min-width: 100%;
        }

        .scrollbar {
          position: absolute;
          background: var(--elx-scroll-area-scrollbar-bg, rgba(0, 0, 0, 0.1));
          border-radius: var(--elx-scroll-area-scrollbar-radius, 4px);
          opacity: 0;
          transition: opacity 0.15s;
          user-select: none;
        }

        .scrollbar.visible {
          opacity: 1;
        }

        .scrollbar-x {
          bottom: 0;
          left: 0;
          right: 0;
          height: var(--elx-scroll-area-scrollbar-size, 8px);
        }

        .scrollbar-y {
          top: 0;
          right: 0;
          bottom: 0;
          width: var(--elx-scroll-area-scrollbar-size, 8px);
        }

        :host([scrollbar-x="hover"]) .scrollbar-x,
        :host([scrollbar-y="hover"]) .scrollbar-y {
          opacity: 0;
          transition: opacity 0.15s;
        }

        :host([scrollbar-x="hover"]):hover .scrollbar-x,
        :host([scrollbar-y="hover"]):hover .scrollbar-y {
          opacity: 1;
        }

        :host([scrollbar-x="always"]) .scrollbar-x,
        :host([scrollbar-y="always"]) .scrollbar-y {
          opacity: 1;
        }

        .thumb {
          background: var(--elx-scroll-area-thumb-bg, rgba(0, 0, 0, 0.5));
          border-radius: var(--elx-scroll-area-thumb-radius, 4px);
          transition: background 0.15s;
        }

        .thumb:hover {
          background: var(--elx-scroll-area-thumb-hover-bg, rgba(0, 0, 0, 0.7));
        }

        .thumb-x {
          height: 100%;
        }

        .thumb-y {
          width: 100%;
        }

        .corner {
          position: absolute;
          bottom: 0;
          right: 0;
          width: var(--elx-scroll-area-scrollbar-size, 8px);
          height: var(--elx-scroll-area-scrollbar-size, 8px);
          background: var(--elx-scroll-area-corner-bg, transparent);
        }
      </style>
      <div class="scroll-area">
        <div class="viewport" tabindex="0" role="region" aria-label="Scrollable content">
          <div class="content">
            <slot></slot>
          </div>
        </div>
        <div class="scrollbar scrollbar-x" role="scrollbar" aria-orientation="horizontal" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
          <div class="thumb thumb-x"></div>
        </div>
        <div class="scrollbar scrollbar-y" role="scrollbar" aria-orientation="vertical" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
          <div class="thumb thumb-y"></div>
        </div>
        <div class="corner"></div>
      </div>
    `;

    this._viewport = this.shadowRoot.querySelector('.viewport');
    this._scrollbarX = this.shadowRoot.querySelector('.scrollbar-x');
    this._scrollbarY = this.shadowRoot.querySelector('.scrollbar-y');
    this._thumbX = this.shadowRoot.querySelector('.thumb-x');
    this._thumbY = this.shadowRoot.querySelector('.thumb-y');

    if (this._viewport) {
      this._viewport.addEventListener('scroll', this._boundHandleScroll);
    }

    this._updateScrollbarVisibility();
  }

  private _updateScrollbarVisibility(): void {
    if (!this._scrollbarX || !this._scrollbarY) return;

    const showX = this.scrollbarX === 'always';
    const showY = this.scrollbarY === 'always';

    this._scrollbarX.classList.toggle('visible', showX);
    this._scrollbarY.classList.toggle('visible', showY);
  }

  private _handleScroll(): void {
    this._updateThumbs();
    this._showScrollbars();

    this.dispatchEvent(new CustomEvent('elx-scroll', {
      bubbles: true,
      composed: true,
      detail: {
        scrollLeft: this._viewport?.scrollLeft || 0,
        scrollTop: this._viewport?.scrollTop || 0
      }
    }));
  }

  private _updateThumbs(): void {
    if (!this._viewport || !this._thumbX || !this._thumbY || !this._scrollbarX || !this._scrollbarY) return;

    const { scrollWidth, scrollHeight, clientWidth, clientHeight, scrollLeft, scrollTop } = this._viewport;

    // Horizontal thumb
    if (scrollWidth > clientWidth) {
      const thumbWidthPercent = (clientWidth / scrollWidth) * 100;
      const scrollPercentX = Math.round((scrollLeft / (scrollWidth - clientWidth)) * 100);
      this._thumbX.style.width = thumbWidthPercent + '%';
      this._thumbX.style.transform = `translateX(${(scrollLeft / (scrollWidth - clientWidth)) * (100 - thumbWidthPercent)}%)`;
      this._scrollbarX.classList.add('visible');
      this._scrollbarX.setAttribute('aria-valuenow', String(scrollPercentX));
    } else {
      this._scrollbarX.classList.remove('visible');
    }

    // Vertical thumb
    if (scrollHeight > clientHeight) {
      const thumbHeightPercent = (clientHeight / scrollHeight) * 100;
      const scrollPercentY = Math.round((scrollTop / (scrollHeight - clientHeight)) * 100);
      this._thumbY.style.height = thumbHeightPercent + '%';
      this._thumbY.style.transform = `translateY(${(scrollTop / (scrollHeight - clientHeight)) * (100 - thumbHeightPercent)}%)`;
      this._scrollbarY.classList.add('visible');
      this._scrollbarY.setAttribute('aria-valuenow', String(scrollPercentY));
    } else {
      this._scrollbarY.classList.remove('visible');
    }
  }

  private _showScrollbars(): void {
    if (!this._scrollbarX || !this._scrollbarY) return;

    this._scrollbarX.classList.add('visible');
    this._scrollbarY.classList.add('visible');

    // Clear any existing timeout
    if (this._hideTimeoutId !== null) {
      clearTimeout(this._hideTimeoutId);
    }

    // Auto-hide after delay (for auto mode)
    if (this.scrollbarX === 'auto' || this.scrollbarY === 'auto') {
      this._hideTimeoutId = setTimeout(() => {
        if (this.scrollbarX !== 'always') this._scrollbarX?.classList.remove('visible');
        if (this.scrollbarY !== 'always') this._scrollbarY?.classList.remove('visible');
        this._hideTimeoutId = null;
      }, this.scrollHideDelay);
    }
  }

  public scrollTo(options?: ScrollToOptions): void;
  public scrollTo(x: number, y: number): void;
  public scrollTo(optionsOrX?: ScrollToOptions | number, y?: number): void {
    if (this._viewport) {
      if (typeof optionsOrX === 'number') {
        this._viewport.scrollTo(optionsOrX, y!);
      } else {
        this._viewport.scrollTo(optionsOrX);
      }
    }
  }

  public scrollBy(options?: ScrollToOptions): void;
  public scrollBy(x: number, y: number): void;
  public scrollBy(optionsOrX?: ScrollToOptions | number, y?: number): void {
    if (this._viewport) {
      if (typeof optionsOrX === 'number') {
        this._viewport.scrollBy(optionsOrX, y!);
      } else {
        this._viewport.scrollBy(optionsOrX);
      }
    }
  }

  public get scrollLeft(): number {
    return this._viewport?.scrollLeft || 0;
  }

  public get scrollTop(): number {
    return this._viewport?.scrollTop || 0;
  }

  public get scrollWidth(): number {
    return this._viewport?.scrollWidth || 0;
  }

  public get scrollHeight(): number {
    return this._viewport?.scrollHeight || 0;
  }
}

// Guard against duplicate registration
if (!customElements.get('elx-scroll-area')) {
  customElements.define('elx-scroll-area', ElxScrollArea);
}

declare global {
  interface HTMLElementTagNameMap {
    'elx-scroll-area': ElxScrollArea;
  }
}
