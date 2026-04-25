import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './skeleton';

describe('ElxSkeleton', () => {
  let el: any;

  beforeEach(() => {
    el = document.createElement('elx-skeleton');
    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders skeleton div', () => {
    const div = el.shadowRoot.querySelector('.skeleton');
    expect(div).toBeTruthy();
  });

  it('has role=status and aria-busy', () => {
    expect(el.getAttribute('role')).toBe('status');
    expect(el.getAttribute('aria-busy')).toBe('true');
  });

  it('has default aria-label', () => {
    expect(el.getAttribute('aria-label')).toBe('Loading...');
  });

  it('preserves custom aria-label', () => {
    document.body.innerHTML = '';
    el = document.createElement('elx-skeleton');
    el.setAttribute('aria-label', 'Loading profile');
    document.body.appendChild(el);
    expect(el.getAttribute('aria-label')).toBe('Loading profile');
  });

  it('defaults to animate', () => {
    expect(el.hasAttribute('animate')).toBe(true);
  });

  it('can disable animation', () => {
    el.animated = false;
    expect(el.hasAttribute('animate')).toBe(false);
  });

  it('does not duplicate content on reconnect', () => {
    const skeletonCount = el.shadowRoot.querySelectorAll('.skeleton').length;
    document.body.removeChild(el);
    document.body.appendChild(el);
    expect(el.shadowRoot.querySelectorAll('.skeleton').length).toBe(skeletonCount);
  });

  it('clears width style when attribute removed', () => {
    el.setAttribute('width', '200px');
    const div = el.shadowRoot.querySelector('.skeleton');
    expect(div.style.width).toBe('200px');
    el.removeAttribute('width');
    expect(div.style.width).toBe('');
  });

  it('defaults to rectangular variant', () => {
    expect(el.variant).toBe('rectangular');
  });

  it('supports circle variant', () => {
    el.variant = 'circle';
    expect(el.getAttribute('variant')).toBe('circle');
  });

  it('supports text variant', () => {
    el.variant = 'text';
    expect(el.getAttribute('variant')).toBe('text');
  });

  it('applies custom width', () => {
    el.setAttribute('width', '200px');
    const div = el.shadowRoot.querySelector('.skeleton');
    expect(div.style.width).toBe('200px');
  });

  it('applies custom height', () => {
    el.setAttribute('height', '3rem');
    const div = el.shadowRoot.querySelector('.skeleton');
    expect(div.style.height).toBe('3rem');
  });

  it('updates styles on attribute change', () => {
    el.setAttribute('width', '100px');
    const div = el.shadowRoot.querySelector('.skeleton');
    expect(div.style.width).toBe('100px');
    el.setAttribute('width', '200px');
    expect(div.style.width).toBe('200px');
  });
});
