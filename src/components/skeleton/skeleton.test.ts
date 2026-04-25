import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './skeleton';

describe('ElxSkeleton', () => {
  let el: any;

  beforeEach(() => {
    el = document.createElement('elx-skeleton');
    document.body.appendChild(el);
  });

  afterEach(() => {
    el.remove();
  });

  it('renders skeleton element', () => {
    const skeleton = el.shadowRoot.querySelector('.skeleton');
    expect(skeleton).toBeTruthy();
  });

  it('has aria-hidden on host', () => {
    expect(el.getAttribute('aria-hidden')).toBe('true');
  });

  it('has aria-hidden on inner skeleton', () => {
    const skeleton = el.shadowRoot.querySelector('.skeleton');
    expect(skeleton.getAttribute('aria-hidden')).toBe('true');
  });

  it('applies width attribute', () => {
    el.width = '100px';
    const skeleton = el.shadowRoot.querySelector('.skeleton');
    expect(skeleton.style.width).toBe('100px');
  });

  it('applies height attribute', () => {
    el.height = '50px';
    const skeleton = el.shadowRoot.querySelector('.skeleton');
    expect(skeleton.style.height).toBe('50px');
  });

  it('has rect variant by default', () => {
    expect(el.variant).toBe('rect');
  });

  it('applies circle variant', () => {
    el.variant = 'circle';
    expect(el.getAttribute('variant')).toBe('circle');
  });

  it('applies text variant', () => {
    el.variant = 'text';
    expect(el.getAttribute('variant')).toBe('text');
  });

  it('has shimmer animation by default', () => {
    expect(el.animation).toBe('shimmer');
  });

  it('applies pulse animation', () => {
    el.animation = 'pulse';
    expect(el.getAttribute('animation')).toBe('pulse');
  });

  it('applies none animation', () => {
    el.animation = 'none';
    expect(el.getAttribute('animation')).toBe('none');
  });

  it('updates width via attribute', () => {
    el.setAttribute('width', '200px');
    const skeleton = el.shadowRoot.querySelector('.skeleton');
    expect(skeleton.style.width).toBe('200px');
  });

  it('updates height via attribute', () => {
    el.setAttribute('height', '75px');
    const skeleton = el.shadowRoot.querySelector('.skeleton');
    expect(skeleton.style.height).toBe('75px');
  });

  it('defaults invalid variant to rect', () => {
    el.setAttribute('variant', 'invalid');
    expect(el.variant).toBe('rect');
  });

  it('defaults invalid animation to shimmer', () => {
    el.setAttribute('animation', 'invalid');
    expect(el.animation).toBe('shimmer');
  });
});
