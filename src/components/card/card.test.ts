import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import './card';

describe('elx-card', () => {
  beforeAll(() => {
    expect(customElements.get('elx-card')).toBeDefined();
  });

  afterEach(() => { document.body.innerHTML = ''; });

  it('renders with default props', () => {
    const el = document.createElement('elx-card');
    document.body.appendChild(el);
    const card = el.shadowRoot!.querySelector('.card');
    expect(card).toBeTruthy();
    expect(card!.classList.contains('elevated')).toBe(true);
    expect(card!.classList.contains('pad-md')).toBe(true);
  });

  it('applies outlined variant', () => {
    const el = document.createElement('elx-card');
    el.setAttribute('variant', 'outlined');
    document.body.appendChild(el);
    expect(el.shadowRoot!.querySelector('.card')!.classList.contains('outlined')).toBe(true);
  });

  it('applies filled variant', () => {
    const el = document.createElement('elx-card');
    el.setAttribute('variant', 'filled');
    document.body.appendChild(el);
    expect(el.shadowRoot!.querySelector('.card')!.classList.contains('filled')).toBe(true);
  });

  it('ignores invalid variant, defaults to elevated', () => {
    const el = document.createElement('elx-card');
    el.setAttribute('variant', 'fancy');
    document.body.appendChild(el);
    expect((el as any).variant).toBe('elevated');
  });

  it('applies padding sizes', () => {
    const sizes = ['none', 'sm', 'md', 'lg'] as const;
    sizes.forEach(size => {
      const el = document.createElement('elx-card');
      el.setAttribute('padding', size);
      document.body.appendChild(el);
      expect(el.shadowRoot!.querySelector('.card')!.classList.contains(`pad-${size}`)).toBe(true);
    });
  });

  it('ignores invalid padding, defaults to md', () => {
    const el = document.createElement('elx-card');
    el.setAttribute('padding', 'xl');
    document.body.appendChild(el);
    expect((el as any).padding).toBe('md');
  });

  it('sets interactive attributes', () => {
    const el = document.createElement('elx-card');
    el.setAttribute('interactive', '');
    document.body.appendChild(el);
    expect(el.getAttribute('role')).toBe('button');
    expect(el.getAttribute('tabindex')).toBe('0');
    expect(el.shadowRoot!.querySelector('.card')!.classList.contains('interactive')).toBe(true);
  });

  it('removes interactive attributes when false', () => {
    const el = document.createElement('elx-card');
    el.setAttribute('interactive', '');
    document.body.appendChild(el);
    el.removeAttribute('interactive');
    expect(el.getAttribute('role')).toBeNull();
    expect(el.getAttribute('tabindex')).toBeNull();
  });

  it('renders slots for header, default, footer', () => {
    const el = document.createElement('elx-card');
    document.body.appendChild(el);
    const slots = el.shadowRoot!.querySelectorAll('slot');
    expect(slots.length).toBe(3);
    expect(slots[0].name).toBe('header');
    expect(slots[1].name).toBe('');
    expect(slots[2].name).toBe('footer');
  });

  it('preserves DOM across attribute updates', () => {
    const el = document.createElement('elx-card');
    document.body.appendChild(el);
    const card1 = el.shadowRoot!.querySelector('.card');
    el.setAttribute('variant', 'outlined');
    el.setAttribute('padding', 'lg');
    const card2 = el.shadowRoot!.querySelector('.card');
    expect(card1).toBe(card2);
  });
});
