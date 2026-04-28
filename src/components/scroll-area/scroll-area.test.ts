import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './scroll-area';

describe('ElxScrollArea', () => {
  let el: any;

  beforeEach(() => {
    el = document.createElement('elx-scroll-area');
    el.style.width = '200px';
    el.style.height = '200px';
    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should be defined as a custom element', () => {
    expect(customElements.get('elx-scroll-area')).toBeDefined();
  });

  it('should render shadow DOM with viewport and scrollbars', () => {
    const viewport = el.shadowRoot!.querySelector('.viewport');
    const scrollbarX = el.shadowRoot!.querySelector('.scrollbar-x');
    const scrollbarY = el.shadowRoot!.querySelector('.scrollbar-y');
    expect(viewport).toBeTruthy();
    expect(scrollbarX).toBeTruthy();
    expect(scrollbarY).toBeTruthy();
  });

  it('should have a default slot for content', () => {
    const slot = el.shadowRoot!.querySelector('slot');
    expect(slot).toBeTruthy();
  });

  it('should have scrollbar-x attribute default to auto', () => {
    expect(el.scrollbarX).toBe('auto');
  });

  it('should have scrollbar-y attribute default to auto', () => {
    expect(el.scrollbarY).toBe('auto');
  });

  it('should set scrollbar-x via attribute', () => {
    el.setAttribute('scrollbar-x', 'always');
    expect(el.scrollbarX).toBe('always');
  });

  it('should set scrollbar-y via attribute', () => {
    el.setAttribute('scrollbar-y', 'always');
    expect(el.scrollbarY).toBe('always');
  });

  it('should set scrollbar-x via property', () => {
    el.scrollbarX = 'hover';
    expect(el.getAttribute('scrollbar-x')).toBe('hover');
  });

  it('should set scrollbar-y via property', () => {
    el.scrollbarY = 'scroll';
    expect(el.getAttribute('scrollbar-y')).toBe('scroll');
  });

  it('should have scrollHideDelay default to 600', () => {
    expect(el.scrollHideDelay).toBe(600);
  });

  it('should set scrollHideDelay via attribute', () => {
    el.setAttribute('scroll-hide-delay', '1000');
    expect(el.scrollHideDelay).toBe(1000);
  });

  it('should set scrollHideDelay via property', () => {
    el.scrollHideDelay = 800;
    expect(el.getAttribute('scroll-hide-delay')).toBe('800');
  });

  it('should show scrollbars when scrollbar-x is always', () => {
    el.scrollbarX = 'always';
    const scrollbarX = el.shadowRoot!.querySelector('.scrollbar-x');
    expect(scrollbarX.classList.contains('visible')).toBe(true);
  });

  it('should show scrollbars when scrollbar-y is always', () => {
    el.scrollbarY = 'always';
    const scrollbarY = el.shadowRoot!.querySelector('.scrollbar-y');
    expect(scrollbarY.classList.contains('visible')).toBe(true);
  });

  it('should have thumb elements in scrollbars', () => {
    const thumbX = el.shadowRoot!.querySelector('.thumb-x');
    const thumbY = el.shadowRoot!.querySelector('.thumb-y');
    expect(thumbX).toBeTruthy();
    expect(thumbY).toBeTruthy();
  });

  it('should have corner element', () => {
    const corner = el.shadowRoot!.querySelector('.corner');
    expect(corner).toBeTruthy();
  });

  it('should expose scrollLeft property', () => {
    expect(el.scrollLeft).toBe(0);
  });

  it('should expose scrollTop property', () => {
    expect(el.scrollTop).toBe(0);
  });

  it('should expose scrollWidth property', () => {
    expect(typeof el.scrollWidth).toBe('number');
  });

  it('should expose scrollHeight property', () => {
    expect(typeof el.scrollHeight).toBe('number');
  });

  it('should have scrollTo method', () => {
    expect(typeof el.scrollTo).toBe('function');
  });

  it('should have scrollBy method', () => {
    expect(typeof el.scrollBy).toBe('function');
  });

  it('should dispatch elx-scroll event on scroll', () => {
    let eventFired = false;
    el.addEventListener('elx-scroll', () => { eventFired = true; });
    const viewport = el.shadowRoot!.querySelector('.viewport');
    viewport.dispatchEvent(new Event('scroll'));
    expect(eventFired).toBe(true);
  });

  it('should include scroll position in event detail', () => {
    let detail: any = null;
    el.addEventListener('elx-scroll', (e: CustomEvent) => { detail = e.detail; });
    const viewport = el.shadowRoot!.querySelector('.viewport');
    viewport.dispatchEvent(new Event('scroll'));
    expect(detail).toHaveProperty('scrollLeft');
    expect(detail).toHaveProperty('scrollTop');
  });

  it('should handle invalid scrollbar-x value gracefully', () => {
    el.setAttribute('scrollbar-x', 'invalid');
    expect(el.scrollbarX).toBe('auto');
  });

  it('should handle invalid scrollbar-y value gracefully', () => {
    el.setAttribute('scrollbar-y', 'invalid');
    expect(el.scrollbarY).toBe('auto');
  });

  it('should handle invalid scrollHideDelay gracefully', () => {
    el.setAttribute('scroll-hide-delay', 'not-a-number');
    expect(el.scrollHideDelay).toBe(600);
  });

  it('should clean up listeners on disconnect', () => {
    const viewport = el.shadowRoot!.querySelector('.viewport');
    document.body.removeChild(el);
    // Should not throw when scrolling after disconnect
    expect(() => viewport.dispatchEvent(new Event('scroll'))).not.toThrow();
  });

  it('should have CSS custom properties for theming', () => {
    const style = el.shadowRoot!.querySelector('style');
    expect(style?.textContent).toContain('--elx-scroll-area-scrollbar-bg');
    expect(style?.textContent).toContain('--elx-scroll-area-thumb-bg');
  });
});
