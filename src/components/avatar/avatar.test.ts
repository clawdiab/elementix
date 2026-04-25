import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import './avatar';

describe('elx-avatar', () => {
  beforeAll(() => {
    expect(customElements.get('elx-avatar')).toBeDefined();
  });

  afterEach(() => { document.body.innerHTML = ''; });

  it('renders with default props', () => {
    const el = document.createElement('elx-avatar');
    document.body.appendChild(el);
    const wrapper = el.shadowRoot!.querySelector('.avatar');
    expect(wrapper).toBeTruthy();
    expect(wrapper!.classList.contains('md')).toBe(true);
    expect(wrapper!.classList.contains('circle')).toBe(true);
  });

  it('shows fallback when no src', () => {
    const el = document.createElement('elx-avatar');
    el.setAttribute('fallback', 'JD');
    document.body.appendChild(el);
    const fb = el.shadowRoot!.querySelector('.fallback') as HTMLElement;
    expect(fb.textContent).toBe('JD');
    expect(fb.style.display).toBe('flex');
    expect((el.shadowRoot!.querySelector('img') as HTMLElement).style.display).toBe('none');
  });

  it('shows image when src is set', () => {
    const el = document.createElement('elx-avatar');
    el.setAttribute('src', 'https://example.com/photo.jpg');
    el.setAttribute('alt', 'User photo');
    document.body.appendChild(el);
    const img = el.shadowRoot!.querySelector('img') as HTMLImageElement;
    expect(img.src).toBe('https://example.com/photo.jpg');
    expect(img.alt).toBe('User photo');
    expect(img.style.display).toBe('block');
  });

  it('truncates fallback to 2 characters', () => {
    const el = document.createElement('elx-avatar');
    el.setAttribute('fallback', 'ABCDEF');
    document.body.appendChild(el);
    expect(el.shadowRoot!.querySelector('.fallback')!.textContent).toBe('AB');
  });

  it('applies xs size', () => {
    const el = document.createElement('elx-avatar');
    el.setAttribute('size', 'xs');
    document.body.appendChild(el);
    expect(el.shadowRoot!.querySelector('.avatar')!.classList.contains('xs')).toBe(true);
  });

  it('applies xl size', () => {
    const el = document.createElement('elx-avatar');
    el.setAttribute('size', 'xl');
    document.body.appendChild(el);
    expect(el.shadowRoot!.querySelector('.avatar')!.classList.contains('xl')).toBe(true);
  });

  it('ignores invalid size, defaults to md', () => {
    const el = document.createElement('elx-avatar');
    el.setAttribute('size', 'huge');
    document.body.appendChild(el);
    expect((el as any).size).toBe('md');
  });

  it('applies square shape', () => {
    const el = document.createElement('elx-avatar');
    el.setAttribute('shape', 'square');
    document.body.appendChild(el);
    expect(el.shadowRoot!.querySelector('.avatar')!.classList.contains('square')).toBe(true);
  });

  it('ignores invalid shape, defaults to circle', () => {
    const el = document.createElement('elx-avatar');
    el.setAttribute('shape', 'triangle');
    document.body.appendChild(el);
    expect((el as any).shape).toBe('circle');
  });

  it('preserves DOM reference across attribute updates', () => {
    const el = document.createElement('elx-avatar');
    document.body.appendChild(el);
    const img1 = el.shadowRoot!.querySelector('img');
    el.setAttribute('size', 'lg');
    el.setAttribute('shape', 'square');
    const img2 = el.shadowRoot!.querySelector('img');
    expect(img1).toBe(img2);
  });

  it('shows fallback on image error', () => {
    const el = document.createElement('elx-avatar');
    el.setAttribute('src', 'bad.jpg');
    el.setAttribute('fallback', 'FB');
    document.body.appendChild(el);
    const img = el.shadowRoot!.querySelector('img') as HTMLImageElement;
    img.dispatchEvent(new Event('error'));
    const fb = el.shadowRoot!.querySelector('.fallback') as HTMLElement;
    expect(fb.style.display).toBe('flex');
    expect(img.style.display).toBe('none');
  });
});
