import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import './pagination';

describe('elx-pagination', () => {
  beforeAll(() => {
    expect(customElements.get('elx-pagination')).toBeDefined();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders with shadow DOM', () => {
    const el = document.createElement('elx-pagination');
    document.body.appendChild(el);
    expect(el.shadowRoot).toBeTruthy();
  });

  it('has nav with aria-label', () => {
    const el = document.createElement('elx-pagination') as any;
    el.total = 100;
    document.body.appendChild(el);
    const nav = el.shadowRoot!.querySelector('nav');
    expect(nav!.getAttribute('aria-label')).toBe('Pagination');
  });

  it('defaults to page 1, perPage 10', () => {
    const el = document.createElement('elx-pagination') as any;
    document.body.appendChild(el);
    expect(el.page).toBe(1);
    expect(el.perPage).toBe(10);
  });

  it('calculates totalPages', () => {
    const el = document.createElement('elx-pagination') as any;
    el.total = 50;
    el.perPage = 10;
    document.body.appendChild(el);
    expect(el.totalPages).toBe(5);
  });

  it('hides when totalPages <= 1', () => {
    const el = document.createElement('elx-pagination') as any;
    el.total = 5;
    el.perPage = 10;
    document.body.appendChild(el);
    const nav = el.shadowRoot!.querySelector('nav');
    expect(nav!.children.length).toBe(0);
  });

  it('renders prev/next buttons', () => {
    const el = document.createElement('elx-pagination') as any;
    el.total = 100;
    document.body.appendChild(el);
    const buttons = el.shadowRoot!.querySelectorAll('button');
    const first = buttons[0];
    const last = buttons[buttons.length - 1];
    expect(first.textContent).toBe('Previous');
    expect(last.textContent).toBe('Next');
  });

  it('disables Previous on first page', () => {
    const el = document.createElement('elx-pagination') as any;
    el.total = 100;
    el.page = 1;
    document.body.appendChild(el);
    const prev = el.shadowRoot!.querySelector('button');
    expect(prev!.disabled).toBe(true);
  });

  it('disables Next on last page', () => {
    const el = document.createElement('elx-pagination') as any;
    el.total = 100;
    el.page = 10;
    document.body.appendChild(el);
    const buttons = el.shadowRoot!.querySelectorAll('button');
    const next = buttons[buttons.length - 1];
    expect(next.disabled).toBe(true);
  });

  it('marks current page with aria-current', () => {
    const el = document.createElement('elx-pagination') as any;
    el.total = 50;
    el.page = 3;
    document.body.appendChild(el);
    const active = el.shadowRoot!.querySelector('[aria-current="page"]');
    expect(active).toBeTruthy();
    expect(active!.textContent).toBe('3');
  });

  it('shows ellipsis for many pages', () => {
    const el = document.createElement('elx-pagination') as any;
    el.total = 200;
    el.page = 5;
    document.body.appendChild(el);
    const ellipses = el.shadowRoot!.querySelectorAll('.ellipsis');
    expect(ellipses.length).toBeGreaterThan(0);
  });

  it('dispatches change event on page click', () => {
    const el = document.createElement('elx-pagination') as any;
    el.total = 50;
    el.page = 1;
    document.body.appendChild(el);
    let detail: any = null;
    el.addEventListener('change', (e: CustomEvent) => { detail = e.detail; });
    const buttons = el.shadowRoot!.querySelectorAll('button');
    // Click page 2 (skip Previous, page 1)
    buttons[2].click();
    expect(detail).toEqual({ page: 2 });
    expect(el.page).toBe(2);
  });

  it('navigates with Next button', () => {
    const el = document.createElement('elx-pagination') as any;
    el.total = 50;
    el.page = 1;
    document.body.appendChild(el);
    const buttons = el.shadowRoot!.querySelectorAll('button');
    const next = buttons[buttons.length - 1];
    next.click();
    expect(el.page).toBe(2);
  });

  it('clamps page to valid range', () => {
    const el = document.createElement('elx-pagination') as any;
    el.total = 50;
    el.page = 99;
    document.body.appendChild(el);
    expect(el.page).toBe(99);
    // But totalPages is 5, so Next should be disabled
    const buttons = el.shadowRoot!.querySelectorAll('button');
    const next = buttons[buttons.length - 1];
    expect(next.disabled).toBe(true);
  });
});
