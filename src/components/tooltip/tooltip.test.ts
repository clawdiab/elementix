import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import './tooltip';

describe('elx-tooltip', () => {
  beforeAll(() => {
    expect(customElements.get('elx-tooltip')).toBeDefined();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('registers as custom element', () => {
    expect(customElements.get('elx-tooltip')).toBeDefined();
  });

  it('renders tooltip element in shadow DOM', () => {
    const el = document.createElement('elx-tooltip');
    el.setAttribute('content', 'Hello');
    document.body.appendChild(el);
    const tooltip = el.shadowRoot!.querySelector('.tooltip');
    expect(tooltip).toBeTruthy();
    expect(tooltip!.textContent).toBe('Hello');
  });

  it('has role=tooltip', () => {
    const el = document.createElement('elx-tooltip');
    el.setAttribute('content', 'Test');
    document.body.appendChild(el);
    const tooltip = el.shadowRoot!.querySelector('.tooltip');
    expect(tooltip!.getAttribute('role')).toBe('tooltip');
  });

  it('is hidden by default', () => {
    const el = document.createElement('elx-tooltip');
    el.setAttribute('content', 'Test');
    document.body.appendChild(el);
    const tooltip = el.shadowRoot!.querySelector('.tooltip');
    expect(tooltip!.getAttribute('aria-hidden')).toBe('true');
  });

  it('defaults to top position', () => {
    const el = document.createElement('elx-tooltip');
    el.setAttribute('content', 'Test');
    document.body.appendChild(el);
    const tooltip = el.shadowRoot!.querySelector('.tooltip') as HTMLElement;
    expect(tooltip.dataset.position).toBe('top');
  });

  it('accepts valid position values', () => {
    const el = document.createElement('elx-tooltip');
    el.setAttribute('content', 'Test');
    el.setAttribute('position', 'bottom');
    document.body.appendChild(el);
    const tooltip = el.shadowRoot!.querySelector('.tooltip') as HTMLElement;
    expect(tooltip.dataset.position).toBe('bottom');
  });

  it('falls back to top for invalid position', () => {
    const el = document.createElement('elx-tooltip');
    el.setAttribute('content', 'Test');
    el.setAttribute('position', 'invalid');
    document.body.appendChild(el);
    const tooltip = el.shadowRoot!.querySelector('.tooltip') as HTMLElement;
    expect(tooltip.dataset.position).toBe('top');
  });

  it('updates content dynamically', () => {
    const el = document.createElement('elx-tooltip');
    el.setAttribute('content', 'Before');
    document.body.appendChild(el);
    el.setAttribute('content', 'After');
    const tooltip = el.shadowRoot!.querySelector('.tooltip');
    expect(tooltip!.textContent).toBe('After');
  });

  it('updates position dynamically', () => {
    const el = document.createElement('elx-tooltip');
    el.setAttribute('content', 'Test');
    el.setAttribute('position', 'top');
    document.body.appendChild(el);
    el.setAttribute('position', 'right');
    const tooltip = el.shadowRoot!.querySelector('.tooltip') as HTMLElement;
    expect(tooltip.dataset.position).toBe('right');
  });

  it('has a unique tooltip id for aria-describedby', () => {
    const el = document.createElement('elx-tooltip');
    el.setAttribute('content', 'Test');
    document.body.appendChild(el);
    const tooltip = el.shadowRoot!.querySelector('.tooltip');
    expect(tooltip!.id).toMatch(/^tooltip-/);
  });

  it('content getter/setter works', () => {
    const el = document.createElement('elx-tooltip') as any;
    el.content = 'Hello';
    expect(el.content).toBe('Hello');
    expect(el.getAttribute('content')).toBe('Hello');
  });

  it('position getter/setter works', () => {
    const el = document.createElement('elx-tooltip') as any;
    el.position = 'left';
    expect(el.position).toBe('left');
    expect(el.getAttribute('position')).toBe('left');
  });

  it('position getter returns top for invalid value', () => {
    const el = document.createElement('elx-tooltip') as any;
    el.setAttribute('position', 'nope');
    expect(el.position).toBe('top');
  });
});
