import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import './checkbox';

describe('elx-checkbox', () => {
  beforeAll(() => {
    expect(customElements.get('elx-checkbox')).toBeDefined();
  });

  afterEach(() => { document.body.innerHTML = ''; });

  it('renders with default props', () => {
    const el = document.createElement('elx-checkbox');
    document.body.appendChild(el);
    const input = el.shadowRoot!.querySelector('input');
    expect(input).toBeTruthy();
    expect(input!.type).toBe('checkbox');
    expect(input!.checked).toBe(false);
  });

  it('reflects checked attribute', () => {
    const el = document.createElement('elx-checkbox');
    el.setAttribute('checked', '');
    document.body.appendChild(el);
    expect(el.shadowRoot!.querySelector('input')!.checked).toBe(true);
  });

  it('reflects disabled attribute', () => {
    const el = document.createElement('elx-checkbox');
    el.setAttribute('disabled', '');
    document.body.appendChild(el);
    expect(el.shadowRoot!.querySelector('input')!.disabled).toBe(true);
  });

  it('reflects indeterminate attribute', () => {
    const el = document.createElement('elx-checkbox');
    el.setAttribute('indeterminate', '');
    document.body.appendChild(el);
    expect(el.shadowRoot!.querySelector('input')!.indeterminate).toBe(true);
  });

  it('sets aria-checked=mixed for indeterminate', () => {
    const el = document.createElement('elx-checkbox');
    el.setAttribute('indeterminate', '');
    document.body.appendChild(el);
    expect(el.shadowRoot!.querySelector('input')!.getAttribute('aria-checked')).toBe('mixed');
  });

  it('applies sm size class on checkbox-box', () => {
    const el = document.createElement('elx-checkbox');
    el.setAttribute('size', 'sm');
    document.body.appendChild(el);
    const box = el.shadowRoot!.querySelector('.checkbox-box');
    expect(box!.classList.contains('sm')).toBe(true);
  });

  it('applies lg size class on checkbox-box', () => {
    const el = document.createElement('elx-checkbox');
    el.setAttribute('size', 'lg');
    document.body.appendChild(el);
    const box = el.shadowRoot!.querySelector('.checkbox-box');
    expect(box!.classList.contains('lg')).toBe(true);
  });

  it('ignores invalid size, defaults to md', () => {
    const el = document.createElement('elx-checkbox');
    el.setAttribute('size', 'xxl');
    document.body.appendChild(el);
    expect(el.size).toBe('md');
  });

  it('sets name and value on input', () => {
    const el = document.createElement('elx-checkbox');
    el.setAttribute('name', 'terms');
    el.setAttribute('value', 'agree');
    document.body.appendChild(el);
    const input = el.shadowRoot!.querySelector('input')!;
    expect(input.name).toBe('terms');
    expect(input.value).toBe('agree');
  });

  it('shows label text', () => {
    const el = document.createElement('elx-checkbox');
    el.setAttribute('label', 'Accept terms');
    document.body.appendChild(el);
    const span = el.shadowRoot!.querySelector('.label-text')!;
    expect(span.textContent).toBe('Accept terms');
    expect((span as HTMLElement).style.display).not.toBe('none');
  });

  it('hides label when not provided', () => {
    const el = document.createElement('elx-checkbox');
    document.body.appendChild(el);
    const span = el.shadowRoot!.querySelector('.label-text') as HTMLElement;
    expect(span.style.display).toBe('none');
  });

  it('label htmlFor matches input id', () => {
    const el = document.createElement('elx-checkbox');
    document.body.appendChild(el);
    const label = el.shadowRoot!.querySelector('label')!;
    const input = el.shadowRoot!.querySelector('input')!;
    expect(label.htmlFor).toBe(input.id);
  });

  it('dispatches change event with detail on toggle', () => {
    const el = document.createElement('elx-checkbox');
    document.body.appendChild(el);
    let detail: any = null;
    el.addEventListener('change', (e: any) => { detail = e.detail; });
    const input = el.shadowRoot!.querySelector('input')!;
    input.checked = true;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    expect(detail).toBeTruthy();
    expect(detail.checked).toBe(true);
  });

  it('does not dispatch change when disabled', () => {
    const el = document.createElement('elx-checkbox');
    el.setAttribute('disabled', '');
    document.body.appendChild(el);
    let fired = false;
    el.addEventListener('change', () => { fired = true; });
    const input = el.shadowRoot!.querySelector('input')!;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    expect(fired).toBe(false);
  });

  it('preserves DOM reference across attribute updates', () => {
    const el = document.createElement('elx-checkbox');
    document.body.appendChild(el);
    const input1 = el.shadowRoot!.querySelector('input');
    el.setAttribute('size', 'lg');
    el.setAttribute('label', 'Updated');
    const input2 = el.shadowRoot!.querySelector('input');
    expect(input1).toBe(input2);
  });

  it('has focus and blur methods', () => {
    const el = document.createElement('elx-checkbox');
    document.body.appendChild(el);
    expect(() => el.focus()).not.toThrow();
    expect(() => el.blur()).not.toThrow();
  });

  it('checked class applied to box when checked', () => {
    const el = document.createElement('elx-checkbox');
    el.setAttribute('checked', '');
    document.body.appendChild(el);
    expect(el.shadowRoot!.querySelector('.checkbox-box')!.classList.contains('checked')).toBe(true);
  });

  it('disabled class applied to box when disabled', () => {
    const el = document.createElement('elx-checkbox');
    el.setAttribute('disabled', '');
    document.body.appendChild(el);
    expect(el.shadowRoot!.querySelector('.checkbox-box')!.classList.contains('disabled')).toBe(true);
  });

  it('removes aria-checked when not indeterminate', () => {
    const el = document.createElement('elx-checkbox');
    el.setAttribute('indeterminate', '');
    document.body.appendChild(el);
    expect(el.shadowRoot!.querySelector('input')!.getAttribute('aria-checked')).toBe('mixed');
    el.removeAttribute('indeterminate');
    expect(el.shadowRoot!.querySelector('input')!.getAttribute('aria-checked')).toBeNull();
  });
});
