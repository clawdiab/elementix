import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import './dialog';

describe('elx-dialog', () => {
  beforeAll(() => {
    expect(customElements.get('elx-dialog')).toBeDefined();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders with overlay and dialog', () => {
    const el = document.createElement('elx-dialog');
    document.body.appendChild(el);
    expect(el.shadowRoot!.querySelector('.overlay')).toBeTruthy();
    expect(el.shadowRoot!.querySelector('.dialog')).toBeTruthy();
  });

  it('is hidden by default', () => {
    const el = document.createElement('elx-dialog');
    document.body.appendChild(el);
    const overlay = el.shadowRoot!.querySelector('.overlay') as HTMLElement;
    expect(overlay.classList.contains('open')).toBe(false);
  });

  it('shows when open attribute is set', () => {
    const el = document.createElement('elx-dialog');
    el.setAttribute('open', '');
    document.body.appendChild(el);
    const overlay = el.shadowRoot!.querySelector('.overlay') as HTMLElement;
    expect(overlay.classList.contains('open')).toBe(true);
  });

  it('show() method opens dialog', () => {
    const el = document.createElement('elx-dialog');
    document.body.appendChild(el);
    (el as any).show();
    expect(el.hasAttribute('open')).toBe(true);
  });

  it('close() method closes dialog', () => {
    const el = document.createElement('elx-dialog');
    el.setAttribute('open', '');
    document.body.appendChild(el);
    (el as any).close();
    expect(el.hasAttribute('open')).toBe(false);
  });

  it('fires close event on close()', () => {
    const el = document.createElement('elx-dialog');
    el.setAttribute('open', '');
    document.body.appendChild(el);
    let fired = false;
    el.addEventListener('close', () => {
      fired = true;
    });
    (el as any).close();
    expect(fired).toBe(true);
  });

  it('closes on overlay click', () => {
    const el = document.createElement('elx-dialog');
    el.setAttribute('open', '');
    document.body.appendChild(el);
    const overlay = el.shadowRoot!.querySelector('.overlay') as HTMLElement;
    overlay.click();
    expect(el.hasAttribute('open')).toBe(false);
  });

  it('does not close when clicking dialog content', () => {
    const el = document.createElement('elx-dialog');
    el.setAttribute('open', '');
    document.body.appendChild(el);
    const dialog = el.shadowRoot!.querySelector('.dialog') as HTMLElement;
    dialog.click();
    expect(el.hasAttribute('open')).toBe(true);
  });

  it('closes on Escape key', () => {
    const el = document.createElement('elx-dialog');
    el.setAttribute('open', '');
    document.body.appendChild(el);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(el.hasAttribute('open')).toBe(false);
  });

  it('has role=dialog and aria-modal', () => {
    const el = document.createElement('elx-dialog');
    document.body.appendChild(el);
    const dialog = el.shadowRoot!.querySelector('.dialog') as HTMLElement;
    expect(dialog.getAttribute('role')).toBe('dialog');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
  });

  it('renders title, content, and footer slots', () => {
    const el = document.createElement('elx-dialog');
    document.body.appendChild(el);
    const slots = el.shadowRoot!.querySelectorAll('slot');
    expect(slots.length).toBe(3);
    expect(slots[0].name).toBe('title');
    expect(slots[1].name).toBe('');
    expect(slots[2].name).toBe('footer');
  });

  it('close button has aria-label', () => {
    const el = document.createElement('elx-dialog');
    document.body.appendChild(el);
    const btn = el.shadowRoot!.querySelector('.close-btn') as HTMLButtonElement;
    expect(btn.getAttribute('aria-label')).toBe('Close dialog');
  });
});
