import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './avatar';

describe('ElxAvatar', () => {
  let el: any;

  beforeEach(() => {
    el = document.createElement('elx-avatar');
    document.body.appendChild(el);
  });

  afterEach(() => {
    el.remove();
  });

  it('registers as custom element', () => {
    expect(customElements.get('elx-avatar')).toBeDefined();
  });

  it('renders with shadow DOM', () => {
    expect(el.shadowRoot).toBeTruthy();
  });

  it('renders image when src is set', () => {
    el.src = 'https://example.com/photo.jpg';
    const img = el.shadowRoot.querySelector('img');
    expect(img).toBeTruthy();
    expect(img.getAttribute('src')).toBe('https://example.com/photo.jpg');
  });

  it('uses alt text on image', () => {
    el.src = 'https://example.com/photo.jpg';
    el.alt = 'User photo';
    const img = el.shadowRoot.querySelector('img');
    expect(img.getAttribute('alt')).toBe('User photo');
  });

  it('falls back to name for alt', () => {
    el.src = 'https://example.com/photo.jpg';
    el.name = 'John Doe';
    const img = el.shadowRoot.querySelector('img');
    expect(img.getAttribute('alt')).toBe('John Doe');
  });

  it('renders initials from name', () => {
    el.name = 'John Doe';
    const initials = el.shadowRoot.querySelector('.initials');
    expect(initials).toBeTruthy();
    expect(initials.textContent).toBe('JD');
  });

  it('renders single initial for single name', () => {
    el.name = 'John';
    const initials = el.shadowRoot.querySelector('.initials');
    expect(initials.textContent).toBe('J');
  });

  it('defaults size to md', () => {
    expect(el.size).toBe('md');
  });

  it('accepts valid sizes', () => {
    el.size = 'lg';
    expect(el.size).toBe('lg');
  });

  it('defaults invalid size to md', () => {
    el.setAttribute('size', 'invalid');
    expect(el.size).toBe('md');
  });

  it('prefers src over name', () => {
    el.src = 'https://example.com/photo.jpg';
    el.name = 'John Doe';
    const img = el.shadowRoot.querySelector('img');
    const initials = el.shadowRoot.querySelector('.initials');
    expect(img).toBeTruthy();
    expect(initials).toBeFalsy();
  });

  it('renders empty when no src or name', () => {
    const img = el.shadowRoot.querySelector('img');
    const initials = el.shadowRoot.querySelector('.initials');
    expect(img).toBeFalsy();
    expect(initials).toBeFalsy();
  });

  it('updates when src changes', () => {
    el.name = 'John Doe';
    expect(el.shadowRoot.querySelector('.initials')).toBeTruthy();
    el.src = 'https://example.com/photo.jpg';
    expect(el.shadowRoot.querySelector('img')).toBeTruthy();
    expect(el.shadowRoot.querySelector('.initials')).toBeFalsy();
  });

  it('removes src via property', () => {
    el.src = 'https://example.com/photo.jpg';
    expect(el.shadowRoot.querySelector('img')).toBeTruthy();
    el.src = null;
    expect(el.shadowRoot.querySelector('img')).toBeFalsy();
  });
});
