import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './collapsible';

describe('ElxCollapsible', () => {
  let el: any;

  beforeEach(() => {
    el = document.createElement('elx-collapsible');
    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should be defined as a custom element', () => {
    expect(customElements.get('elx-collapsible')).toBeDefined();
  });

  it('should render shadow DOM with trigger and content', () => {
    const trigger = el.shadowRoot!.querySelector('.trigger');
    const content = el.shadowRoot!.querySelector('.content-wrapper');
    expect(trigger).toBeTruthy();
    expect(content).toBeTruthy();
  });

  it('should be closed by default', () => {
    expect(el.open).toBe(false);
    const trigger = el.shadowRoot!.querySelector('.trigger');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('should open when open attribute is set', () => {
    el.setAttribute('open', '');
    expect(el.open).toBe(true);
    const trigger = el.shadowRoot!.querySelector('.trigger');
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('should open via property setter', () => {
    el.open = true;
    expect(el.hasAttribute('open')).toBe(true);
    const trigger = el.shadowRoot!.querySelector('.trigger');
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('should close when open attribute is removed', () => {
    el.setAttribute('open', '');
    el.removeAttribute('open');
    expect(el.open).toBe(false);
    const trigger = el.shadowRoot!.querySelector('.trigger');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('should toggle on trigger click', () => {
    const trigger = el.shadowRoot!.querySelector('.trigger');
    trigger.click();
    expect(el.open).toBe(true);
    trigger.click();
    expect(el.open).toBe(false);
  });

  it('should dispatch elx-collapsible-toggle event on toggle', () => {
    let detail: any = null;
    el.addEventListener('elx-collapsible-toggle', (e: CustomEvent) => {
      detail = e.detail;
    });
    const trigger = el.shadowRoot!.querySelector('.trigger');
    trigger.click();
    expect(detail).toEqual({ open: true });
  });

  it('should not toggle when disabled', () => {
    el.disabled = true;
    const trigger = el.shadowRoot!.querySelector('.trigger');
    trigger.click();
    expect(el.open).toBe(false);
  });

  it('should set disabled attribute on trigger when disabled', () => {
    el.disabled = true;
    const trigger = el.shadowRoot!.querySelector('.trigger');
    expect(trigger.disabled).toBe(true);
  });

  it('should reflect disabled property to attribute', () => {
    el.disabled = true;
    expect(el.hasAttribute('disabled')).toBe(true);
    el.disabled = false;
    expect(el.hasAttribute('disabled')).toBe(false);
  });

  it('should set aria-hidden on content', () => {
    const content = el.shadowRoot!.querySelector('.content-wrapper');
    expect(content.getAttribute('aria-hidden')).toBe('true');
    el.open = true;
    expect(content.getAttribute('aria-hidden')).toBe('false');
  });

  it('should have role="region" on content', () => {
    const content = el.shadowRoot!.querySelector('.content-wrapper');
    expect(content.getAttribute('role')).toBe('region');
  });

  it('should have aria-controls on trigger', () => {
    const trigger = el.shadowRoot!.querySelector('.trigger');
    expect(trigger.getAttribute('aria-controls')).toBe('content');
  });

  it('should forward aria-label to trigger', () => {
    el.setAttribute('aria-label', 'Toggle section');
    const trigger = el.shadowRoot!.querySelector('.trigger');
    expect(trigger.getAttribute('aria-label')).toBe('Toggle section');
  });

  it('should toggle via toggle() method', () => {
    el.toggle();
    expect(el.open).toBe(true);
    el.toggle();
    expect(el.open).toBe(false);
  });

  it('should open via show() method', () => {
    el.show();
    expect(el.open).toBe(true);
    // Calling show again should not dispatch event
    let eventCount = 0;
    el.addEventListener('elx-collapsible-toggle', () => eventCount++);
    el.show();
    expect(eventCount).toBe(0);
  });

  it('should close via hide() method', () => {
    el.open = true;
    el.hide();
    expect(el.open).toBe(false);
    // Calling hide again should not dispatch event
    let eventCount = 0;
    el.addEventListener('elx-collapsible-toggle', () => eventCount++);
    el.hide();
    expect(eventCount).toBe(0);
  });

  it('should render chevron icon', () => {
    const icon = el.shadowRoot!.querySelector('.icon');
    expect(icon).toBeTruthy();
    expect(icon.tagName.toLowerCase()).toBe('svg');
  });

  it('should have trigger slot', () => {
    const slot = el.shadowRoot!.querySelector('slot[name="trigger"]');
    expect(slot).toBeTruthy();
  });

  it('should have content slot', () => {
    const slot = el.shadowRoot!.querySelector('slot[name="content"]');
    expect(slot).toBeTruthy();
  });

  it('should handle keyboard Enter on trigger', () => {
    const trigger = el.shadowRoot!.querySelector('.trigger');
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(el.open).toBe(true);
  });

  it('should handle keyboard Space on trigger', () => {
    const trigger = el.shadowRoot!.querySelector('.trigger');
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    expect(el.open).toBe(true);
  });

  it('should not toggle on keyboard when disabled', () => {
    el.disabled = true;
    const trigger = el.shadowRoot!.querySelector('.trigger');
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(el.open).toBe(false);
  });

  it('should clean up listeners on disconnect', () => {
    document.body.removeChild(el);
    // Should not throw
    expect(() => el.toggle()).not.toThrow();
  });

  it('should not update when attribute value is unchanged', () => {
    el.setAttribute('open', '');
    const trigger = el.shadowRoot!.querySelector('.trigger');
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    // Setting same value again should be a no-op
    el.setAttribute('open', '');
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });
});
