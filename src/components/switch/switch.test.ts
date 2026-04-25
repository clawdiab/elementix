import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import './switch';

describe('elx-switch', () => {
  beforeAll(() => {
    expect(customElements.get('elx-switch')).toBeDefined();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders with default props', () => {
    const el = document.createElement('elx-switch');
    document.body.appendChild(el);
    const input = el.shadowRoot!.querySelector('input');
    expect(input).toBeTruthy();
    expect(input!.getAttribute('role')).toBe('switch');
    expect(input!.checked).toBe(false);
  });

  it('reflects checked attribute', () => {
    const el = document.createElement('elx-switch');
    el.setAttribute('checked', '');
    document.body.appendChild(el);
    expect(el.shadowRoot!.querySelector('input')!.checked).toBe(true);
  });

  it('reflects disabled attribute', () => {
    const el = document.createElement('elx-switch');
    el.setAttribute('disabled', '');
    document.body.appendChild(el);
    expect(el.shadowRoot!.querySelector('input')!.disabled).toBe(true);
  });

  it('has role=switch on input', () => {
    const el = document.createElement('elx-switch');
    document.body.appendChild(el);
    expect(el.shadowRoot!.querySelector('input')!.getAttribute('role')).toBe('switch');
  });

  it('sets aria-checked to match checked state', () => {
    const el = document.createElement('elx-switch');
    document.body.appendChild(el);
    expect(el.shadowRoot!.querySelector('input')!.getAttribute('aria-checked')).toBe('false');
    el.setAttribute('checked', '');
    expect(el.shadowRoot!.querySelector('input')!.getAttribute('aria-checked')).toBe('true');
  });

  it('applies sm size class on track and thumb', () => {
    const el = document.createElement('elx-switch');
    el.setAttribute('size', 'sm');
    document.body.appendChild(el);
    expect(el.shadowRoot!.querySelector('.track')!.classList.contains('sm')).toBe(true);
    expect(el.shadowRoot!.querySelector('.thumb')!.classList.contains('sm')).toBe(true);
  });

  it('applies lg size class on track and thumb', () => {
    const el = document.createElement('elx-switch');
    el.setAttribute('size', 'lg');
    document.body.appendChild(el);
    expect(el.shadowRoot!.querySelector('.track')!.classList.contains('lg')).toBe(true);
    expect(el.shadowRoot!.querySelector('.thumb')!.classList.contains('lg')).toBe(true);
  });

  it('ignores invalid size, defaults to md', () => {
    const el = document.createElement('elx-switch');
    el.setAttribute('size', 'xxl');
    document.body.appendChild(el);
    expect((el as any).size).toBe('md');
  });

  it('sets name and value on input', () => {
    const el = document.createElement('elx-switch');
    el.setAttribute('name', 'darkmode');
    el.setAttribute('value', 'yes');
    document.body.appendChild(el);
    const input = el.shadowRoot!.querySelector('input')!;
    expect(input.name).toBe('darkmode');
    expect(input.value).toBe('yes');
  });

  it('shows label text', () => {
    const el = document.createElement('elx-switch');
    el.setAttribute('label', 'Dark mode');
    document.body.appendChild(el);
    const span = el.shadowRoot!.querySelector('.label-text')!;
    expect(span.textContent).toBe('Dark mode');
    expect((span as HTMLElement).style.display).not.toBe('none');
  });

  it('hides label when not provided', () => {
    const el = document.createElement('elx-switch');
    document.body.appendChild(el);
    const span = el.shadowRoot!.querySelector('.label-text') as HTMLElement;
    expect(span.style.display).toBe('none');
  });

  it('label htmlFor matches input id', () => {
    const el = document.createElement('elx-switch');
    document.body.appendChild(el);
    const label = el.shadowRoot!.querySelector('label')!;
    const input = el.shadowRoot!.querySelector('input')!;
    expect(label.htmlFor).toBe(input.id);
  });

  it('dispatches change event with detail on toggle', () => {
    const el = document.createElement('elx-switch');
    document.body.appendChild(el);
    let detail: any = null;
    el.addEventListener('change', (e: any) => {
      detail = e.detail;
    });
    const input = el.shadowRoot!.querySelector('input')!;
    input.checked = true;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    expect(detail).toBeTruthy();
    expect(detail.checked).toBe(true);
  });

  it('does not dispatch change when disabled', () => {
    const el = document.createElement('elx-switch');
    el.setAttribute('disabled', '');
    document.body.appendChild(el);
    let fired = false;
    el.addEventListener('change', () => {
      fired = true;
    });
    const input = el.shadowRoot!.querySelector('input')!;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    expect(fired).toBe(false);
  });

  it('track gets checked class when checked', () => {
    const el = document.createElement('elx-switch');
    el.setAttribute('checked', '');
    document.body.appendChild(el);
    expect(el.shadowRoot!.querySelector('.track')!.classList.contains('checked')).toBe(true);
  });

  it('thumb gets checked class when checked', () => {
    const el = document.createElement('elx-switch');
    el.setAttribute('checked', '');
    document.body.appendChild(el);
    expect(el.shadowRoot!.querySelector('.thumb')!.classList.contains('checked')).toBe(true);
  });

  it('track gets disabled class when disabled', () => {
    const el = document.createElement('elx-switch');
    el.setAttribute('disabled', '');
    document.body.appendChild(el);
    expect(el.shadowRoot!.querySelector('.track')!.classList.contains('disabled')).toBe(true);
  });

  it('preserves DOM reference across attribute updates', () => {
    const el = document.createElement('elx-switch');
    document.body.appendChild(el);
    const input1 = el.shadowRoot!.querySelector('input');
    el.setAttribute('size', 'lg');
    el.setAttribute('label', 'Updated');
    const input2 = el.shadowRoot!.querySelector('input');
    expect(input1).toBe(input2);
  });

  it('has focus and blur methods', () => {
    const el = document.createElement('elx-switch');
    document.body.appendChild(el);
    expect(() => el.focus()).not.toThrow();
    expect(() => el.blur()).not.toThrow();
  });
});
