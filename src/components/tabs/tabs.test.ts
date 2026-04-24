import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import './tabs';

describe('elx-tabs', () => {
  beforeAll(() => {
    expect(customElements.get('elx-tabs')).toBeDefined();
    expect(customElements.get('elx-tab-panel')).toBeDefined();
  });

  afterEach(() => { document.body.innerHTML = ''; });

  it('renders tab list and panels', () => {
    const el = document.createElement('elx-tabs');
    el.innerHTML = `
      <elx-tab-panel name="a" label="Tab A">Content A</elx-tab-panel>
      <elx-tab-panel name="b" label="Tab B">Content B</elx-tab-panel>
    `;
    document.body.appendChild(el);
    expect(el.shadowRoot!.querySelector('.tab-list')).toBeTruthy();
    expect(el.querySelectorAll('elx-tab-panel').length).toBe(2);
  });

  it('renders tab buttons with labels', () => {
    const el = document.createElement('elx-tabs');
    el.innerHTML = `
      <elx-tab-panel name="a" label="Tab A">Content A</elx-tab-panel>
      <elx-tab-panel name="b" label="Tab B">Content B</elx-tab-panel>
    `;
    document.body.appendChild(el);
    const tabs = el.shadowRoot!.querySelectorAll('.tab');
    expect(tabs.length).toBe(2);
    expect(tabs[0].textContent).toBe('Tab A');
    expect(tabs[1].textContent).toBe('Tab B');
  });

  it('selects first tab by default', () => {
    const el = document.createElement('elx-tabs');
    el.innerHTML = `
      <elx-tab-panel name="a" label="A">A</elx-tab-panel>
      <elx-tab-panel name="b" label="B">B</elx-tab-panel>
    `;
    document.body.appendChild(el);
    const tabs = el.shadowRoot!.querySelectorAll<HTMLButtonElement>('.tab');
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(tabs[1].getAttribute('aria-selected')).toBe('false');
    expect(el.querySelectorAll('elx-tab-panel')[0].hasAttribute('active')).toBe(true);
  });

  it('selects tab by value attribute', () => {
    const el = document.createElement('elx-tabs');
    el.setAttribute('value', 'b');
    el.innerHTML = `
      <elx-tab-panel name="a" label="A">A</elx-tab-panel>
      <elx-tab-panel name="b" label="B">B</elx-tab-panel>
    `;
    document.body.appendChild(el);
    const tabs = el.shadowRoot!.querySelectorAll<HTMLButtonElement>('.tab');
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
    expect(el.querySelectorAll('elx-tab-panel')[1].hasAttribute('active')).toBe(true);
  });

  it('changes tab on click', () => {
    const el = document.createElement('elx-tabs');
    el.innerHTML = `
      <elx-tab-panel name="a" label="A">A</elx-tab-panel>
      <elx-tab-panel name="b" label="B">B</elx-tab-panel>
    `;
    document.body.appendChild(el);
    el.shadowRoot!.querySelectorAll<HTMLButtonElement>('.tab')[1].click();
    const tabs = el.shadowRoot!.querySelectorAll<HTMLButtonElement>('.tab');
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
    expect(tabs[0].getAttribute('aria-selected')).toBe('false');
    expect(el.value).toBe('b');
  });

  it('fires change event on tab selection', () => {
    const el = document.createElement('elx-tabs');
    el.innerHTML = `
      <elx-tab-panel name="a" label="A">A</elx-tab-panel>
      <elx-tab-panel name="b" label="B">B</elx-tab-panel>
    `;
    document.body.appendChild(el);
    let detail: any = null;
    el.addEventListener('change', (e: any) => { detail = e.detail; });
    const tabs = el.shadowRoot!.querySelectorAll<HTMLButtonElement>('.tab');
    tabs[1].click();
    expect(detail.value).toBe('b');
  });

  it('has correct ARIA attributes', () => {
    const el = document.createElement('elx-tabs');
    el.innerHTML = `
      <elx-tab-panel name="a" label="A">A</elx-tab-panel>
    `;
    document.body.appendChild(el);
    const tabList = el.shadowRoot!.querySelector('.tab-list');
    expect(tabList!.getAttribute('role')).toBe('tablist');
    const tab = el.shadowRoot!.querySelector('.tab');
    expect(tab!.getAttribute('role')).toBe('tab');
    expect(tab!.getAttribute('aria-controls')).toBe('panel-a');
    expect(tab!.id).toBe('tab-a');
  });

  it('uses name as label when label not provided', () => {
    const el = document.createElement('elx-tabs');
    el.innerHTML = `<elx-tab-panel name="mytab">Content</elx-tab-panel>`;
    document.body.appendChild(el);
    const tab = el.shadowRoot!.querySelector('.tab');
    expect(tab!.textContent).toBe('mytab');
  });

  it('ArrowRight moves to next tab', () => {
    const el = document.createElement('elx-tabs');
    el.innerHTML = `
      <elx-tab-panel name="a" label="A">A</elx-tab-panel>
      <elx-tab-panel name="b" label="B">B</elx-tab-panel>
    `;
    document.body.appendChild(el);
    const tabs = el.shadowRoot!.querySelectorAll<HTMLButtonElement>('.tab');
    tabs[0].focus();
    el.shadowRoot!.querySelector('.tab-list')!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })
    );
    expect(el.value).toBe('b');
  });

  it('ArrowLeft moves to previous tab', () => {
    const el = document.createElement('elx-tabs');
    el.setAttribute('value', 'b');
    el.innerHTML = `
      <elx-tab-panel name="a" label="A">A</elx-tab-panel>
      <elx-tab-panel name="b" label="B">B</elx-tab-panel>
    `;
    document.body.appendChild(el);
    const tabs = el.shadowRoot!.querySelectorAll<HTMLButtonElement>('.tab');
    tabs[1].focus();
    el.shadowRoot!.querySelector('.tab-list')!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true })
    );
    expect(el.value).toBe('a');
  });

  it('Home key selects first tab', () => {
    const el = document.createElement('elx-tabs');
    el.setAttribute('value', 'b');
    el.innerHTML = `
      <elx-tab-panel name="a" label="A">A</elx-tab-panel>
      <elx-tab-panel name="b" label="B">B</elx-tab-panel>
    `;
    document.body.appendChild(el);
    el.shadowRoot!.querySelector('.tab-list')!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Home', bubbles: true })
    );
    expect(el.value).toBe('a');
  });

  it('End key selects last tab', () => {
    const el = document.createElement('elx-tabs');
    el.innerHTML = `
      <elx-tab-panel name="a" label="A">A</elx-tab-panel>
      <elx-tab-panel name="b" label="B">B</elx-tab-panel>
      <elx-tab-panel name="c" label="C">C</elx-tab-panel>
    `;
    document.body.appendChild(el);
    el.shadowRoot!.querySelector('.tab-list')!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'End', bubbles: true })
    );
    expect(el.value).toBe('c');
  });
});

describe('elx-tab-panel', () => {
  beforeAll(() => {
    expect(customElements.get('elx-tab-panel')).toBeDefined();
  });

  afterEach(() => { document.body.innerHTML = ''; });

  it('is hidden by default', () => {
    const el = document.createElement('elx-tab-panel');
    el.setAttribute('name', 'test');
    document.body.appendChild(el);
    expect(el.hasAttribute('active')).toBe(false);
  });

  it('is visible when active', () => {
    const el = document.createElement('elx-tab-panel');
    el.setAttribute('name', 'test');
    el.setAttribute('active', '');
    document.body.appendChild(el);
    expect(el.hasAttribute('active')).toBe(true);
  });

  it('has role=tabpanel', () => {
    const el = document.createElement('elx-tab-panel');
    el.setAttribute('name', 'test');
    document.body.appendChild(el);
    const panel = el.shadowRoot!.querySelector('.panel');
    expect(panel!.getAttribute('role')).toBe('tabpanel');
    expect(panel!.id).toBe('panel-test');
  });
});
