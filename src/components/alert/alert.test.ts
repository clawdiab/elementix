import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import './alert';

describe('elx-alert', () => {
  beforeAll(() => {
    expect(customElements.get('elx-alert')).toBeDefined();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders with default variant (info)', () => {
    const el = document.createElement('elx-alert');
    document.body.appendChild(el);
    const alert = el.shadowRoot!.querySelector('.alert');
    expect(alert!.classList.contains('info')).toBe(true);
  });

  it('applies success variant', () => {
    const el = document.createElement('elx-alert');
    el.setAttribute('variant', 'success');
    document.body.appendChild(el);
    expect(el.shadowRoot!.querySelector('.alert')!.classList.contains('success')).toBe(true);
  });

  it('applies warning variant', () => {
    const el = document.createElement('elx-alert');
    el.setAttribute('variant', 'warning');
    document.body.appendChild(el);
    expect(el.shadowRoot!.querySelector('.alert')!.classList.contains('warning')).toBe(true);
  });

  it('applies error variant', () => {
    const el = document.createElement('elx-alert');
    el.setAttribute('variant', 'error');
    document.body.appendChild(el);
    expect(el.shadowRoot!.querySelector('.alert')!.classList.contains('error')).toBe(true);
  });

  it('ignores invalid variant, defaults to info', () => {
    const el = document.createElement('elx-alert');
    el.setAttribute('variant', 'critical');
    document.body.appendChild(el);
    expect((el as any).variant).toBe('info');
  });

  it('shows close button when dismissible', () => {
    const el = document.createElement('elx-alert');
    el.setAttribute('dismissible', '');
    document.body.appendChild(el);
    const btn = el.shadowRoot!.querySelector('.close-btn') as HTMLButtonElement;
    expect(btn.style.display).toBe('block');
  });

  it('hides close button when not dismissible', () => {
    const el = document.createElement('elx-alert');
    document.body.appendChild(el);
    const btn = el.shadowRoot!.querySelector('.close-btn') as HTMLButtonElement;
    expect(btn.style.display).toBe('none');
  });

  it('fires close event and removes on dismiss click', () => {
    const el = document.createElement('elx-alert');
    el.setAttribute('dismissible', '');
    document.body.appendChild(el);
    let fired = false;
    el.addEventListener('close', () => {
      fired = true;
    });
    const btn = el.shadowRoot!.querySelector('.close-btn') as HTMLButtonElement;
    btn.click();
    expect(fired).toBe(true);
    expect(document.body.contains(el)).toBe(false);
  });

  it('renders slot content', () => {
    const el = document.createElement('elx-alert');
    el.innerHTML = '<span id="msg">Alert message</span>';
    document.body.appendChild(el);
    const slot = el.shadowRoot!.querySelector('slot') as HTMLSlotElement;
    expect(slot).toBeTruthy();
  });

  it('shows correct icon for each variant', () => {
    const icons: Record<string, string> = { info: 'ℹ️', success: '✓', warning: '⚠', error: '✕' };
    Object.entries(icons).forEach(([variant, icon]) => {
      const el = document.createElement('elx-alert');
      el.setAttribute('variant', variant);
      document.body.appendChild(el);
      const iconEl = el.shadowRoot!.querySelector('.icon') as HTMLElement;
      expect(iconEl.textContent).toBe(icon);
    });
  });

  it('preserves DOM across attribute updates', () => {
    const el = document.createElement('elx-alert');
    document.body.appendChild(el);
    const alert1 = el.shadowRoot!.querySelector('.alert');
    el.setAttribute('variant', 'error');
    el.setAttribute('dismissible', '');
    const alert2 = el.shadowRoot!.querySelector('.alert');
    expect(alert1).toBe(alert2);
  });
});
