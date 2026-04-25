import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import './badge';

describe('elx-badge', () => {
  beforeAll(() => {
    expect(customElements.get('elx-badge')).toBeDefined();
  });

  afterEach(() => { document.body.innerHTML = ''; });

  it('renders with default props', () => {
    const el = document.createElement('elx-badge');
    document.body.appendChild(el);
    const span = el.shadowRoot!.querySelector('.badge');
    expect(span).toBeTruthy();
    expect(span!.classList.contains('solid')).toBe(true);
    expect(span!.classList.contains('gray')).toBe(true);
    expect(span!.classList.contains('md')).toBe(true);
  });

  it('uses slot for content', () => {
    const el = document.createElement('elx-badge');
    document.body.appendChild(el);
    expect(el.shadowRoot!.querySelector('slot')).toBeTruthy();
  });

  it('applies solid variant', () => {
    const el = document.createElement('elx-badge');
    el.setAttribute('variant', 'solid');
    document.body.appendChild(el);
    expect(el.shadowRoot!.querySelector('.badge')!.classList.contains('solid')).toBe(true);
  });

  it('applies soft variant', () => {
    const el = document.createElement('elx-badge');
    el.setAttribute('variant', 'soft');
    document.body.appendChild(el);
    expect(el.shadowRoot!.querySelector('.badge')!.classList.contains('soft')).toBe(true);
  });

  it('applies outline variant', () => {
    const el = document.createElement('elx-badge');
    el.setAttribute('variant', 'outline');
    document.body.appendChild(el);
    expect(el.shadowRoot!.querySelector('.badge')!.classList.contains('outline')).toBe(true);
  });

  it('ignores invalid variant, defaults to solid', () => {
    const el = document.createElement('elx-badge');
    el.setAttribute('variant', 'fancy');
    document.body.appendChild(el);
    expect((el as any).variant).toBe('solid');
  });

  it('applies red color', () => {
    const el = document.createElement('elx-badge');
    el.setAttribute('color', 'red');
    document.body.appendChild(el);
    expect(el.shadowRoot!.querySelector('.badge')!.classList.contains('red')).toBe(true);
  });

  it('applies green color', () => {
    const el = document.createElement('elx-badge');
    el.setAttribute('color', 'green');
    document.body.appendChild(el);
    expect(el.shadowRoot!.querySelector('.badge')!.classList.contains('green')).toBe(true);
  });

  it('applies blue color', () => {
    const el = document.createElement('elx-badge');
    el.setAttribute('color', 'blue');
    document.body.appendChild(el);
    expect(el.shadowRoot!.querySelector('.badge')!.classList.contains('blue')).toBe(true);
  });

  it('ignores invalid color, defaults to gray', () => {
    const el = document.createElement('elx-badge');
    el.setAttribute('color', 'neon');
    document.body.appendChild(el);
    expect((el as any).color).toBe('gray');
  });

  it('applies sm size', () => {
    const el = document.createElement('elx-badge');
    el.setAttribute('size', 'sm');
    document.body.appendChild(el);
    expect(el.shadowRoot!.querySelector('.badge')!.classList.contains('sm')).toBe(true);
  });

  it('applies lg size', () => {
    const el = document.createElement('elx-badge');
    el.setAttribute('size', 'lg');
    document.body.appendChild(el);
    expect(el.shadowRoot!.querySelector('.badge')!.classList.contains('lg')).toBe(true);
  });

  it('ignores invalid size, defaults to md', () => {
    const el = document.createElement('elx-badge');
    el.setAttribute('size', 'xxl');
    document.body.appendChild(el);
    expect((el as any).size).toBe('md');
  });

  it('updates class when attributes change', () => {
    const el = document.createElement('elx-badge');
    document.body.appendChild(el);
    el.setAttribute('variant', 'outline');
    el.setAttribute('color', 'purple');
    el.setAttribute('size', 'lg');
    const span = el.shadowRoot!.querySelector('.badge')!;
    expect(span.classList.contains('outline')).toBe(true);
    expect(span.classList.contains('purple')).toBe(true);
    expect(span.classList.contains('lg')).toBe(true);
  });

  it('preserves DOM reference across attribute updates', () => {
    const el = document.createElement('elx-badge');
    document.body.appendChild(el);
    const span1 = el.shadowRoot!.querySelector('.badge');
    el.setAttribute('color', 'blue');
    el.setAttribute('size', 'sm');
    const span2 = el.shadowRoot!.querySelector('.badge');
    expect(span1).toBe(span2);
  });
});
