import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import './slider';

describe('elx-slider', () => {
  beforeAll(() => {
    expect(customElements.get('elx-slider')).toBeDefined();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders with shadow DOM', () => {
    const el = document.createElement('elx-slider');
    document.body.appendChild(el);
    expect(el.shadowRoot).toBeTruthy();
  });

  it('defaults to 0 value, 0 min, 100 max', () => {
    const el = document.createElement('elx-slider') as any;
    document.body.appendChild(el);
    expect(el.value).toBe(0);
    expect(el.min).toBe(0);
    expect(el.max).toBe(100);
  });

  it('sets input attributes correctly', () => {
    const el = document.createElement('elx-slider') as any;
    el.value = 50;
    el.min = 10;
    el.max = 90;
    el.step = 5;
    document.body.appendChild(el);
    const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
    expect(input.min).toBe('10');
    expect(input.max).toBe('90');
    expect(input.step).toBe('5');
    expect(input.value).toBe('50');
  });

  it('applies size class to track', () => {
    const el = document.createElement('elx-slider') as any;
    el.size = 'lg';
    document.body.appendChild(el);
    const track = el.shadowRoot!.querySelector('.slider-track') as HTMLElement;
    expect(track.classList.contains('lg')).toBe(true);
  });

  it('applies variant class to fill', () => {
    const el = document.createElement('elx-slider') as any;
    el.variant = 'success';
    document.body.appendChild(el);
    const fill = el.shadowRoot!.querySelector('.track-fill') as HTMLElement;
    expect(fill.classList.contains('success')).toBe(true);
  });

  it('has correct ARIA attributes', () => {
    const el = document.createElement('elx-slider') as any;
    el.value = 30;
    el.min = 0;
    el.max = 100;
    document.body.appendChild(el);
    const input = el.shadowRoot!.querySelector('input');
    expect(input!.getAttribute('role')).toBe('slider');
    expect(input!.getAttribute('aria-valuemin')).toBe('0');
    expect(input!.getAttribute('aria-valuemax')).toBe('100');
    expect(input!.getAttribute('aria-valuenow')).toBe('30');
  });

  it('uses label for aria-label when provided', () => {
    const el = document.createElement('elx-slider') as any;
    el.label = 'Volume';
    document.body.appendChild(el);
    const input = el.shadowRoot!.querySelector('input');
    expect(input!.getAttribute('aria-label')).toBe('Volume');
  });

  it('shows label when set', () => {
    const el = document.createElement('elx-slider') as any;
    el.label = 'Brightness';
    document.body.appendChild(el);
    const labelDiv = el.shadowRoot!.querySelector('.slider-label') as HTMLElement;
    expect(labelDiv.style.display).toBe('flex');
    const labelText = el.shadowRoot!.querySelector('.label-text');
    expect(labelText!.textContent).toBe('Brightness');
  });

  it('hides label when not set', () => {
    const el = document.createElement('elx-slider') as any;
    document.body.appendChild(el);
    const labelDiv = el.shadowRoot!.querySelector('.slider-label') as HTMLElement;
    expect(labelDiv.style.display).toBe('none');
  });

  it('calculates fill width correctly', () => {
    const el = document.createElement('elx-slider') as any;
    el.value = 50;
    el.min = 0;
    el.max = 100;
    document.body.appendChild(el);
    const fill = el.shadowRoot!.querySelector('.track-fill') as HTMLElement;
    expect(fill.style.width).toBe('50%');
  });

  it('dispatches elx-change event on input', () => {
    const el = document.createElement('elx-slider') as any;
    el.value = 25;
    document.body.appendChild(el);
    let eventDetail: any = null;
    el.addEventListener('elx-change', (e: CustomEvent) => {
      eventDetail = e.detail;
    });
    const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
    input.value = '75';
    input.dispatchEvent(new Event('input'));
    expect(eventDetail).toBeTruthy();
    expect(eventDetail.value).toBe(75);
  });

  it('supports disabled state', () => {
    const el = document.createElement('elx-slider') as any;
    el.disabled = true;
    document.body.appendChild(el);
    const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
    expect(input.disabled).toBe(true);
    expect(el.hasAttribute('disabled')).toBe(true);
  });

  it('handles max=0 by defaulting to 100', () => {
    const el = document.createElement('elx-slider') as any;
    el.max = 0;
    document.body.appendChild(el);
    expect(el.max).toBe(100);
  });

  it('updates fill when value changes', () => {
    const el = document.createElement('elx-slider') as any;
    el.value = 20;
    document.body.appendChild(el);
    const fill = el.shadowRoot!.querySelector('.track-fill') as HTMLElement;
    expect(fill.style.width).toBe('20%');
    el.value = 80;
    expect(fill.style.width).toBe('80%');
  });

  it('clamps fill width between 0 and 100', () => {
    const el = document.createElement('elx-slider') as any;
    el.value = 150;
    el.max = 100;
    document.body.appendChild(el);
    const fill = el.shadowRoot!.querySelector('.track-fill') as HTMLElement;
    expect(fill.style.width).toBe('100%');
  });

  it('shows current value in label area', () => {
    const el = document.createElement('elx-slider') as any;
    el.value = 42;
    el.label = 'Test';
    document.body.appendChild(el);
    const labelValue = el.shadowRoot!.querySelector('.label-value');
    expect(labelValue!.textContent).toBe('42');
  });
});
