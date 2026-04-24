import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import './accordion';
import { ElxAccordion, ElxAccordionItem } from './accordion';

describe('elx-accordion', () => {
  beforeAll(() => {
    expect(customElements.get('elx-accordion')).toBeDefined();
    expect(customElements.get('elx-accordion-item')).toBeDefined();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('registers accordion and accordion-item', () => {
    expect(customElements.get('elx-accordion')).toBeDefined();
    expect(customElements.get('elx-accordion-item')).toBeDefined();
  });

  it('renders accordion item with label', () => {
    const item = document.createElement('elx-accordion-item') as ElxAccordionItem;
    item.label = 'Section 1';
    document.body.appendChild(item);
    const label = item.shadowRoot!.querySelector('.label');
    expect(label?.textContent).toBe('Section 1');
  });

  it('is closed by default', () => {
    const item = document.createElement('elx-accordion-item') as ElxAccordionItem;
    document.body.appendChild(item);
    const trigger = item.shadowRoot!.querySelector('.trigger');
    expect(trigger?.getAttribute('aria-expanded')).toBe('false');
  });

  it('opens on click', () => {
    const item = document.createElement('elx-accordion-item') as ElxAccordionItem;
    document.body.appendChild(item);
    const trigger = item.shadowRoot!.querySelector('.trigger') as HTMLButtonElement;
    trigger.click();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(item.open).toBe(true);
  });

  it('closes on second click', () => {
    const item = document.createElement('elx-accordion-item') as ElxAccordionItem;
    document.body.appendChild(item);
    const trigger = item.shadowRoot!.querySelector('.trigger') as HTMLButtonElement;
    trigger.click();
    trigger.click();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(item.open).toBe(false);
  });

  it('dispatches toggle event', () => {
    const item = document.createElement('elx-accordion-item') as ElxAccordionItem;
    item.value = 'a';
    document.body.appendChild(item);
    const handler = vi.fn();
    item.addEventListener('toggle', handler);
    const trigger = item.shadowRoot!.querySelector('.trigger') as HTMLButtonElement;
    trigger.click();
    expect(handler).toHaveBeenCalled();
    expect(handler.mock.calls[0][0].detail.value).toBe('a');
    expect(handler.mock.calls[0][0].detail.open).toBe(true);
  });

  it('respects disabled attribute', () => {
    const item = document.createElement('elx-accordion-item') as ElxAccordionItem;
    item.disabled = true;
    document.body.appendChild(item);
    const trigger = item.shadowRoot!.querySelector('.trigger') as HTMLButtonElement;
    expect(trigger.disabled).toBe(true);
  });

  it('does not open when disabled', () => {
    const item = document.createElement('elx-accordion-item') as ElxAccordionItem;
    item.disabled = true;
    document.body.appendChild(item);
    const trigger = item.shadowRoot!.querySelector('.trigger') as HTMLButtonElement;
    trigger.click();
    expect(item.open).toBe(false);
  });

  it('toggle method works', () => {
    const item = document.createElement('elx-accordion-item') as ElxAccordionItem;
    document.body.appendChild(item);
    item.toggle(true);
    expect(item.open).toBe(true);
    item.toggle(false);
    expect(item.open).toBe(false);
  });

  it('has correct ARIA attributes', () => {
    const item = document.createElement('elx-accordion-item') as ElxAccordionItem;
    document.body.appendChild(item);
    const trigger = item.shadowRoot!.querySelector('.trigger');
    const content = item.shadowRoot!.querySelector('.content');
    expect(trigger?.getAttribute('aria-expanded')).toBe('false');
    expect(content?.getAttribute('role')).toBe('region');
  });

  it('value getter/setter works', () => {
    const item = document.createElement('elx-accordion-item') as ElxAccordionItem;
    item.value = 'test-value';
    expect(item.value).toBe('test-value');
    expect(item.getAttribute('value')).toBe('test-value');
  });

  it('label getter/setter works', () => {
    const item = document.createElement('elx-accordion-item') as ElxAccordionItem;
    item.label = 'My Label';
    expect(item.label).toBe('My Label');
    expect(item.getAttribute('label')).toBe('My Label');
  });

  it('disabled getter/setter works', () => {
    const item = document.createElement('elx-accordion-item') as ElxAccordionItem;
    item.disabled = true;
    expect(item.disabled).toBe(true);
    expect(item.hasAttribute('disabled')).toBe(true);
  });
});

describe('elx-accordion single mode', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('closes other items when one opens (single mode)', () => {
    const accordion = document.createElement('elx-accordion') as ElxAccordion;
    const item1 = document.createElement('elx-accordion-item') as ElxAccordionItem;
    const item2 = document.createElement('elx-accordion-item') as ElxAccordionItem;
    item1.label = 'Item 1';
    item2.label = 'Item 2';
    accordion.appendChild(item1);
    accordion.appendChild(item2);
    document.body.appendChild(accordion);

    // Open first
    item1.toggle(true);
    expect(item1.open).toBe(true);

    // Open second
    item2.toggle(true);
    expect(item2.open).toBe(true);
    expect(item1.open).toBe(false);
  });

  it('type defaults to single', () => {
    const accordion = document.createElement('elx-accordion') as ElxAccordion;
    expect(accordion.type).toBe('single');
  });

  it('type getter/setter works', () => {
    const accordion = document.createElement('elx-accordion') as ElxAccordion;
    accordion.type = 'multiple';
    expect(accordion.type).toBe('multiple');
    expect(accordion.getAttribute('type')).toBe('multiple');
  });
});

describe('elx-accordion multiple mode', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('allows multiple items open in multiple mode', () => {
    const accordion = document.createElement('elx-accordion') as ElxAccordion;
    accordion.type = 'multiple';
    const item1 = document.createElement('elx-accordion-item') as ElxAccordionItem;
    const item2 = document.createElement('elx-accordion-item') as ElxAccordionItem;
    accordion.appendChild(item1);
    accordion.appendChild(item2);
    document.body.appendChild(accordion);

    item1.toggle(true);
    item2.toggle(true);
    expect(item1.open).toBe(true);
    expect(item2.open).toBe(true);
  });
});
