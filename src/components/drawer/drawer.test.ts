import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './drawer';

describe('ElxDrawer', () => {
  let el: any;

  beforeEach(() => {
    el = document.createElement('elx-drawer');
    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders drawer structure', () => {
    expect(el.shadowRoot.querySelector('.drawer')).toBeTruthy();
    expect(el.shadowRoot.querySelector('.backdrop')).toBeTruthy();
    expect(el.shadowRoot.querySelector('.header')).toBeTruthy();
    expect(el.shadowRoot.querySelector('.content')).toBeTruthy();
    expect(el.shadowRoot.querySelector('.footer')).toBeTruthy();
  });

  it('has dialog role and aria-modal', () => {
    const drawer = el.shadowRoot.querySelector('.drawer');
    expect(drawer.getAttribute('role')).toBe('dialog');
    expect(drawer.getAttribute('aria-modal')).toBe('true');
  });

  it('defaults to right placement', () => {
    expect(el.placement).toBe('right');
    expect(el.getAttribute('placement')).toBe('right');
  });

  it('supports left placement', () => {
    el.placement = 'left';
    expect(el.getAttribute('placement')).toBe('left');
  });

  it('is closed by default', () => {
    expect(el.open).toBe(false);
    const drawer = el.shadowRoot.querySelector('.drawer');
    expect(drawer.getAttribute('aria-hidden')).toBe('true');
  });

  it('opens via show()', () => {
    el.show();
    expect(el.open).toBe(true);
    expect(el.hasAttribute('open')).toBe(true);
  });

  it('closes via close()', () => {
    el.show();
    el.close();
    expect(el.open).toBe(false);
  });

  it('toggles via toggle()', () => {
    el.toggle();
    expect(el.open).toBe(true);
    el.toggle();
    expect(el.open).toBe(false);
  });

  it('dispatches elx-drawer-close event on close', () => {
    let fired = false;
    el.addEventListener('elx-drawer-close', () => { fired = true; });
    el.show();
    el.close();
    expect(fired).toBe(true);
  });

  it('does not dispatch close event when already closed', () => {
    let fired = false;
    el.addEventListener('elx-drawer-close', () => { fired = true; });
    el.close();
    expect(fired).toBe(false);
  });

  it('has close button with aria-label', () => {
    const btn = el.shadowRoot.querySelector('.close-button');
    expect(btn).toBeTruthy();
    expect(btn.getAttribute('aria-label')).toBe('Close drawer');
  });

  it('closes when close button clicked', () => {
    el.show();
    const btn = el.shadowRoot.querySelector('.close-button');
    btn.click();
    expect(el.open).toBe(false);
  });

  it('closes when backdrop clicked', () => {
    el.show();
    const backdrop = el.shadowRoot.querySelector('.backdrop');
    backdrop.click();
    expect(el.open).toBe(false);
  });

  it('has title, default, and footer slots', () => {
    const slots = el.shadowRoot.querySelectorAll('slot');
    const names = [...el.shadowRoot.querySelectorAll('slot')].map((s: any) => s.name || 'default');
    expect(names).toContain('title');
    expect(names).toContain('default');
    expect(names).toContain('footer');
  });

  it('does not duplicate content on reconnect', () => {
    const count = el.shadowRoot.querySelectorAll('.drawer').length;
    document.body.removeChild(el);
    document.body.appendChild(el);
    expect(el.shadowRoot.querySelectorAll('.drawer').length).toBe(count);
  });

  it('closes on Escape key', () => {
    el.show();
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);
    expect(el.open).toBe(false);
  });

  it('does not close on Escape when closed', () => {
    let fired = false;
    el.addEventListener('elx-drawer-close', () => { fired = true; });
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);
    expect(fired).toBe(false);
  });
});
