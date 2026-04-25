import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import './breadcrumb';

describe('elx-breadcrumb', () => {
  beforeAll(() => {
    expect(customElements.get('elx-breadcrumb')).toBeDefined();
    expect(customElements.get('elx-breadcrumb-item')).toBeDefined();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders with shadow DOM', () => {
    const el = document.createElement('elx-breadcrumb');
    document.body.appendChild(el);
    expect(el.shadowRoot).toBeTruthy();
  });

  it('has nav with aria-label', () => {
    const el = document.createElement('elx-breadcrumb');
    document.body.appendChild(el);
    const nav = el.shadowRoot!.querySelector('nav');
    expect(nav!.getAttribute('aria-label')).toBe('Breadcrumb');
  });

  it('defaults separator to /', () => {
    const el = document.createElement('elx-breadcrumb') as any;
    document.body.appendChild(el);
    expect(el.separator).toBe('/');
  });

  it('supports custom separator', () => {
    const el = document.createElement('elx-breadcrumb') as any;
    el.separator = '>';
    document.body.appendChild(el);
    expect(el.separator).toBe('>');
  });

  it('sets aria-current=page on last item', () => {
    const el = document.createElement('elx-breadcrumb') as any;
    const item1 = document.createElement('elx-breadcrumb-item');
    item1.textContent = 'Home';
    const item2 = document.createElement('elx-breadcrumb-item');
    item2.textContent = 'Page';
    el.appendChild(item1);
    el.appendChild(item2);
    document.body.appendChild(el);
    expect(item1.hasAttribute('aria-current')).toBe(false);
    expect(item2.getAttribute('aria-current')).toBe('page');
  });

  it('sets data-separator on non-last items', () => {
    const el = document.createElement('elx-breadcrumb') as any;
    const item1 = document.createElement('elx-breadcrumb-item');
    const item2 = document.createElement('elx-breadcrumb-item');
    el.appendChild(item1);
    el.appendChild(item2);
    document.body.appendChild(el);
    expect(item1.getAttribute('data-separator')).toBe('/');
    expect(item2.getAttribute('data-separator')).toBe('');
  });
});

describe('elx-breadcrumb-item', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders with shadow DOM', () => {
    const el = document.createElement('elx-breadcrumb-item');
    document.body.appendChild(el);
    expect(el.shadowRoot).toBeTruthy();
  });

  it('renders link when href is set', () => {
    const el = document.createElement('elx-breadcrumb-item') as any;
    el.href = '/home';
    document.body.appendChild(el);
    const a = el.shadowRoot!.querySelector('a');
    expect(a).toBeTruthy();
    expect(a!.href).toContain('/home');
  });

  it('renders span when no href', () => {
    const el = document.createElement('elx-breadcrumb-item');
    document.body.appendChild(el);
    const a = el.shadowRoot!.querySelector('a');
    expect(a).toBeNull();
    const span = el.shadowRoot!.querySelector('.item span');
    expect(span).toBeTruthy();
  });

  it('renders span with current class when aria-current is set', () => {
    const el = document.createElement('elx-breadcrumb-item') as any;
    el.href = '/page';
    el.setAttribute('aria-current', 'page');
    document.body.appendChild(el);
    const a = el.shadowRoot!.querySelector('a');
    expect(a).toBeNull();
    const current = el.shadowRoot!.querySelector('.current');
    expect(current).toBeTruthy();
  });

  it('shows separator when data-separator is set', () => {
    const el = document.createElement('elx-breadcrumb-item') as any;
    el.setAttribute('data-separator', '/');
    document.body.appendChild(el);
    const sep = el.shadowRoot!.querySelector('.separator') as HTMLElement;
    expect(sep.textContent).toBe('/');
    expect(sep.style.display).not.toBe('none');
  });

  it('hides separator when data-separator is empty', () => {
    const el = document.createElement('elx-breadcrumb-item') as any;
    el.setAttribute('data-separator', '');
    document.body.appendChild(el);
    const sep = el.shadowRoot!.querySelector('.separator') as HTMLElement;
    expect(sep.style.display).toBe('none');
  });

  it('separator is aria-hidden', () => {
    const el = document.createElement('elx-breadcrumb-item');
    document.body.appendChild(el);
    const sep = el.shadowRoot!.querySelector('.separator');
    expect(sep!.getAttribute('aria-hidden')).toBe('true');
  });
});
