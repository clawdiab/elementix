import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import './separator';

describe('elx-separator', () => {
  beforeAll(() => {
    expect(customElements.get('elx-separator')).toBeDefined();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('registers as custom element', () => {
    expect(customElements.get('elx-separator')).toBeDefined();
  });

  it('renders separator element', () => {
    const el = document.createElement('elx-separator');
    document.body.appendChild(el);
    const separator = el.shadowRoot!.querySelector('.separator');
    expect(separator).toBeTruthy();
  });

  it('has role=separator', () => {
    const el = document.createElement('elx-separator');
    document.body.appendChild(el);
    const separator = el.shadowRoot!.querySelector('.separator');
    expect(separator!.getAttribute('role')).toBe('separator');
  });

  it('defaults to horizontal orientation', () => {
    const el = document.createElement('elx-separator');
    document.body.appendChild(el);
    const separator = el.shadowRoot!.querySelector('.separator');
    expect(separator!.classList.contains('horizontal')).toBe(true);
    expect(separator!.getAttribute('aria-orientation')).toBe('horizontal');
  });

  it('accepts vertical orientation', () => {
    const el = document.createElement('elx-separator');
    el.setAttribute('orientation', 'vertical');
    document.body.appendChild(el);
    const separator = el.shadowRoot!.querySelector('.separator');
    expect(separator!.classList.contains('vertical')).toBe(true);
    expect(separator!.getAttribute('aria-orientation')).toBe('vertical');
  });

  it('falls back to horizontal for invalid orientation', () => {
    const el = document.createElement('elx-separator');
    el.setAttribute('orientation', 'diagonal');
    document.body.appendChild(el);
    const separator = el.shadowRoot!.querySelector('.separator');
    expect(separator!.classList.contains('horizontal')).toBe(true);
  });

  it('updates orientation dynamically', () => {
    const el = document.createElement('elx-separator');
    document.body.appendChild(el);
    el.setAttribute('orientation', 'vertical');
    const separator = el.shadowRoot!.querySelector('.separator');
    expect(separator!.classList.contains('vertical')).toBe(true);
    expect(separator!.getAttribute('aria-orientation')).toBe('vertical');
  });

  it('orientation getter/setter works', () => {
    const el = document.createElement('elx-separator') as any;
    el.orientation = 'vertical';
    expect(el.orientation).toBe('vertical');
    expect(el.getAttribute('orientation')).toBe('vertical');
  });

  it('orientation getter returns horizontal for invalid value', () => {
    const el = document.createElement('elx-separator') as any;
    el.setAttribute('orientation', 'nope');
    expect(el.orientation).toBe('horizontal');
  });

  it('has correct ARIA attributes', () => {
    const el = document.createElement('elx-separator');
    document.body.appendChild(el);
    const separator = el.shadowRoot!.querySelector('.separator');
    expect(separator!.getAttribute('role')).toBe('separator');
    expect(separator!.getAttribute('aria-orientation')).toBe('horizontal');
  });
});
