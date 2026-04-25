import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import './radio';

describe('elx-radio', () => {
  beforeAll(() => {
    expect(customElements.get('elx-radio')).toBeDefined();
    expect(customElements.get('elx-radio-group')).toBeDefined();
  });

  afterEach(() => { document.body.innerHTML = ''; });

  it('renders with default props', () => {
    const el = document.createElement('elx-radio');
    document.body.appendChild(el);
    const input = el.shadowRoot!.querySelector('input');
    expect(input).toBeTruthy();
    expect(input!.type).toBe('radio');
    expect(input!.checked).toBe(false);
  });

  it('reflects checked attribute', () => {
    const el = document.createElement('elx-radio');
    el.setAttribute('checked', '');
    document.body.appendChild(el);
    expect(el.shadowRoot!.querySelector('input')!.checked).toBe(true);
  });

  it('reflects disabled attribute', () => {
    const el = document.createElement('elx-radio');
    el.setAttribute('disabled', '');
    document.body.appendChild(el);
    expect(el.shadowRoot!.querySelector('input')!.disabled).toBe(true);
  });

  it('applies sm size class', () => {
    const el = document.createElement('elx-radio');
    el.setAttribute('size', 'sm');
    document.body.appendChild(el);
    expect(el.shadowRoot!.querySelector('.radio-circle')!.classList.contains('sm')).toBe(true);
  });

  it('applies lg size class', () => {
    const el = document.createElement('elx-radio');
    el.setAttribute('size', 'lg');
    document.body.appendChild(el);
    expect(el.shadowRoot!.querySelector('.radio-circle')!.classList.contains('lg')).toBe(true);
  });

  it('ignores invalid size, defaults to md', () => {
    const el = document.createElement('elx-radio');
    el.setAttribute('size', 'xlarge');
    document.body.appendChild(el);
    expect((el as any).size).toBe('md');
  });

  it('dot is visible when checked', () => {
    const el = document.createElement('elx-radio');
    el.setAttribute('checked', '');
    document.body.appendChild(el);
    expect(el.shadowRoot!.querySelector('.dot')!.classList.contains('visible')).toBe(true);
  });

  it('dot is hidden when not checked', () => {
    const el = document.createElement('elx-radio');
    document.body.appendChild(el);
    expect(el.shadowRoot!.querySelector('.dot')!.classList.contains('visible')).toBe(false);
  });

  it('checked class on radio-circle when checked', () => {
    const el = document.createElement('elx-radio');
    el.setAttribute('checked', '');
    document.body.appendChild(el);
    expect(el.shadowRoot!.querySelector('.radio-circle')!.classList.contains('checked')).toBe(true);
  });

  it('disabled class on radio-circle when disabled', () => {
    const el = document.createElement('elx-radio');
    el.setAttribute('disabled', '');
    document.body.appendChild(el);
    expect(el.shadowRoot!.querySelector('.radio-circle')!.classList.contains('disabled')).toBe(true);
  });

  it('sets name and value on input', () => {
    const el = document.createElement('elx-radio');
    el.setAttribute('name', 'fruit');
    el.setAttribute('value', 'apple');
    document.body.appendChild(el);
    const input = el.shadowRoot!.querySelector('input')!;
    expect(input.name).toBe('fruit');
    expect(input.value).toBe('apple');
  });

  it('shows label text', () => {
    const el = document.createElement('elx-radio');
    el.setAttribute('label', 'Option A');
    document.body.appendChild(el);
    const span = el.shadowRoot!.querySelector('.label-text')!;
    expect(span.textContent).toBe('Option A');
    expect((span as HTMLElement).style.display).not.toBe('none');
  });

  it('hides label when not provided', () => {
    const el = document.createElement('elx-radio');
    document.body.appendChild(el);
    const span = el.shadowRoot!.querySelector('.label-text') as HTMLElement;
    expect(span.style.display).toBe('none');
  });

  it('label htmlFor matches input id', () => {
    const el = document.createElement('elx-radio');
    document.body.appendChild(el);
    expect(el.shadowRoot!.querySelector('label')!.htmlFor).toBe(el.shadowRoot!.querySelector('input')!.id);
  });

  it('dispatches change event on selection', () => {
    const el = document.createElement('elx-radio');
    el.setAttribute('value', 'apple');
    el.setAttribute('name', 'fruit');
    document.body.appendChild(el);
    let detail: any = null;
    el.addEventListener('change', (e: any) => { detail = e.detail; });
    el.shadowRoot!.querySelector('input')!.dispatchEvent(new Event('change', { bubbles: true }));
    expect(detail).toBeTruthy();
    expect(detail.value).toBe('apple');
    expect(detail.name).toBe('fruit');
  });

  it('does not dispatch change when disabled', () => {
    const el = document.createElement('elx-radio');
    el.setAttribute('disabled', '');
    document.body.appendChild(el);
    let fired = false;
    el.addEventListener('change', () => { fired = true; });
    el.shadowRoot!.querySelector('input')!.dispatchEvent(new Event('change', { bubbles: true }));
    expect(fired).toBe(false);
  });

  it('preserves DOM reference across attribute updates', () => {
    const el = document.createElement('elx-radio');
    document.body.appendChild(el);
    const input1 = el.shadowRoot!.querySelector('input');
    el.setAttribute('size', 'lg');
    el.setAttribute('label', 'Updated');
    expect(el.shadowRoot!.querySelector('input')).toBe(input1);
  });

  it('has focus and blur methods', () => {
    const el = document.createElement('elx-radio');
    document.body.appendChild(el);
    expect(() => el.focus()).not.toThrow();
    expect(() => el.blur()).not.toThrow();
  });
});

describe('elx-radio-group', () => {
  afterEach(() => { document.body.innerHTML = ''; });

  it('renders with slot', () => {
    const group = document.createElement('elx-radio-group');
    document.body.appendChild(group);
    expect(group.shadowRoot!.querySelector('slot')).toBeTruthy();
  });

  it('propagates name to children', () => {
    const group = document.createElement('elx-radio-group');
    group.setAttribute('name', 'color');
    const r1 = document.createElement('elx-radio');
    r1.setAttribute('value', 'red');
    const r2 = document.createElement('elx-radio');
    r2.setAttribute('value', 'blue');
    group.appendChild(r1);
    group.appendChild(r2);
    document.body.appendChild(group);
    expect(r1.getAttribute('name')).toBe('color');
    expect(r2.getAttribute('name')).toBe('color');
  });

  it('syncs checked state via value attribute', () => {
    const group = document.createElement('elx-radio-group');
    group.setAttribute('name', 'color');
    group.setAttribute('value', 'blue');
    const r1 = document.createElement('elx-radio');
    r1.setAttribute('value', 'red');
    const r2 = document.createElement('elx-radio');
    r2.setAttribute('value', 'blue');
    group.appendChild(r1);
    group.appendChild(r2);
    document.body.appendChild(group);
    expect(r2.hasAttribute('checked')).toBe(true);
    expect(r1.hasAttribute('checked')).toBe(false);
  });

  it('propagates disabled to children', () => {
    const group = document.createElement('elx-radio-group');
    group.setAttribute('name', 'color');
    group.setAttribute('disabled', '');
    const r1 = document.createElement('elx-radio');
    r1.setAttribute('value', 'red');
    group.appendChild(r1);
    document.body.appendChild(group);
    expect(r1.hasAttribute('disabled')).toBe(true);
  });
});
