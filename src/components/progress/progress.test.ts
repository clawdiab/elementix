import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import './progress';

describe('elx-progress', () => {
  beforeAll(() => {
    expect(customElements.get('elx-progress')).toBeDefined();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders with shadow DOM', () => {
    const el = document.createElement('elx-progress');
    document.body.appendChild(el);
    expect(el.shadowRoot).toBeTruthy();
  });

  it('defaults to 0 value and 100 max', () => {
    const el = document.createElement('elx-progress') as any;
    document.body.appendChild(el);
    expect(el.value).toBe(0);
    expect(el.max).toBe(100);
  });

  it('renders bar width based on value', () => {
    const el = document.createElement('elx-progress') as any;
    el.value = 50;
    document.body.appendChild(el);
    const bar = el.shadowRoot!.querySelector('.bar') as HTMLElement;
    expect(bar.style.width).toBe('50%');
  });

  it('clamps percentage between 0 and 100', () => {
    const el = document.createElement('elx-progress') as any;
    el.value = 200;
    document.body.appendChild(el);
    const bar = el.shadowRoot!.querySelector('.bar') as HTMLElement;
    expect(bar.style.width).toBe('100%');
  });

  it('supports custom max', () => {
    const el = document.createElement('elx-progress') as any;
    el.max = 50;
    el.value = 25;
    document.body.appendChild(el);
    const bar = el.shadowRoot!.querySelector('.bar') as HTMLElement;
    expect(bar.style.width).toBe('50%');
  });

  it('applies variant class to bar', () => {
    const el = document.createElement('elx-progress') as any;
    el.variant = 'success';
    document.body.appendChild(el);
    const bar = el.shadowRoot!.querySelector('.bar') as HTMLElement;
    expect(bar.classList.contains('success')).toBe(true);
  });

  it('applies size class to track', () => {
    const el = document.createElement('elx-progress') as any;
    el.size = 'lg';
    document.body.appendChild(el);
    const track = el.shadowRoot!.querySelector('.progress') as HTMLElement;
    expect(track.classList.contains('lg')).toBe(true);
  });

  it('has correct ARIA attributes', () => {
    const el = document.createElement('elx-progress') as any;
    el.value = 30;
    el.max = 100;
    document.body.appendChild(el);
    const track = el.shadowRoot!.querySelector('.progress');
    expect(track!.getAttribute('role')).toBe('progressbar');
    expect(track!.getAttribute('aria-valuenow')).toBe('30');
    expect(track!.getAttribute('aria-valuemin')).toBe('0');
    expect(track!.getAttribute('aria-valuemax')).toBe('100');
  });

  it('uses label for aria-label when provided', () => {
    const el = document.createElement('elx-progress') as any;
    el.value = 50;
    el.label = 'Upload progress';
    document.body.appendChild(el);
    const track = el.shadowRoot!.querySelector('.progress');
    expect(track!.getAttribute('aria-label')).toBe('Upload progress');
  });

  it('shows percentage in label area', () => {
    const el = document.createElement('elx-progress') as any;
    el.value = 75;
    el.label = 'Loading';
    document.body.appendChild(el);
    const percent = el.shadowRoot!.querySelector('.label-percent');
    expect(percent!.textContent).toBe('75%');
  });

  it('hides label when not set', () => {
    const el = document.createElement('elx-progress') as any;
    el.value = 50;
    document.body.appendChild(el);
    const labelDiv = el.shadowRoot!.querySelector('.progress-label') as HTMLElement;
    expect(labelDiv.style.display).toBe('none');
  });

  it('handles max=0 by defaulting to 100', () => {
    const el = document.createElement('elx-progress') as any;
    el.value = 50;
    el.max = 0;
    document.body.appendChild(el);
    expect(el.max).toBe(100);
    const bar = el.shadowRoot!.querySelector('.bar') as HTMLElement;
    expect(bar.style.width).toBe('50%');
  });

  it('updates bar when value changes', () => {
    const el = document.createElement('elx-progress') as any;
    el.value = 20;
    document.body.appendChild(el);
    const bar = el.shadowRoot!.querySelector('.bar') as HTMLElement;
    expect(bar.style.width).toBe('20%');
    el.value = 80;
    expect(bar.style.width).toBe('80%');
  });
});

describe('elx-spinner', () => {
  beforeAll(() => {
    expect(customElements.get('elx-spinner')).toBeDefined();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders with shadow DOM', () => {
    const el = document.createElement('elx-spinner');
    document.body.appendChild(el);
    expect(el.shadowRoot).toBeTruthy();
  });

  it('has role=status', () => {
    const el = document.createElement('elx-spinner');
    document.body.appendChild(el);
    const spinner = el.shadowRoot!.querySelector('.spinner');
    expect(spinner!.getAttribute('role')).toBe('status');
  });

  it('defaults to Loading aria-label', () => {
    const el = document.createElement('elx-spinner');
    document.body.appendChild(el);
    const spinner = el.shadowRoot!.querySelector('.spinner');
    expect(spinner!.getAttribute('aria-label')).toBe('Loading');
  });

  it('applies custom label', () => {
    const el = document.createElement('elx-spinner') as any;
    el.label = 'Processing';
    document.body.appendChild(el);
    const spinner = el.shadowRoot!.querySelector('.spinner');
    expect(spinner!.getAttribute('aria-label')).toBe('Processing');
  });

  it('applies size class', () => {
    const el = document.createElement('elx-spinner') as any;
    el.size = 'lg';
    document.body.appendChild(el);
    const spinner = el.shadowRoot!.querySelector('.spinner');
    expect(spinner!.classList.contains('lg')).toBe(true);
  });

  it('applies variant class', () => {
    const el = document.createElement('elx-spinner') as any;
    el.variant = 'danger';
    document.body.appendChild(el);
    const spinner = el.shadowRoot!.querySelector('.spinner');
    expect(spinner!.classList.contains('danger')).toBe(true);
  });

  it('has aria-busy=true', () => {
    const el = document.createElement('elx-spinner');
    document.body.appendChild(el);
    const spinner = el.shadowRoot!.querySelector('.spinner');
    expect(spinner!.getAttribute('aria-busy')).toBe('true');
  });

  it('defaults to md size and primary variant', () => {
    const el = document.createElement('elx-spinner') as any;
    document.body.appendChild(el);
    expect(el.size).toBe('md');
    expect(el.variant).toBe('primary');
  });
});
