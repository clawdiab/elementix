import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import './select';
import { ElxSelect, SelectOption } from './select';

describe('elx-select', () => {
  beforeAll(() => {
    expect(customElements.get('elx-select')).toBeDefined();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  const defaultOptions: SelectOption[] = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
  ];

  it('registers as custom element', () => {
    expect(customElements.get('elx-select')).toBeDefined();
  });

  it('renders trigger button', () => {
    const el = document.createElement('elx-select') as ElxSelect;
    el.options = defaultOptions;
    document.body.appendChild(el);
    const button = el.shadowRoot!.querySelector('.trigger');
    expect(button).toBeTruthy();
  });

  it('shows placeholder by default', () => {
    const el = document.createElement('elx-select') as ElxSelect;
    el.options = defaultOptions;
    document.body.appendChild(el);
    const text = el.shadowRoot!.querySelector('.trigger-text');
    expect(text?.textContent).toBe('Select...');
    expect(text?.classList.contains('placeholder')).toBe(true);
  });

  it('accepts custom placeholder', () => {
    const el = document.createElement('elx-select') as ElxSelect;
    el.options = defaultOptions;
    el.placeholder = 'Choose fruit...';
    document.body.appendChild(el);
    const text = el.shadowRoot!.querySelector('.trigger-text');
    expect(text?.textContent).toBe('Choose fruit...');
  });

  it('renders options in listbox', () => {
    const el = document.createElement('elx-select') as ElxSelect;
    el.options = defaultOptions;
    document.body.appendChild(el);
    const options = el.shadowRoot!.querySelectorAll('.option');
    expect(options.length).toBe(3);
    expect(options[0].textContent).toBe('Apple');
  });

  it('opens listbox on click', () => {
    const el = document.createElement('elx-select') as ElxSelect;
    el.options = defaultOptions;
    document.body.appendChild(el);
    const button = el.shadowRoot!.querySelector('.trigger') as HTMLButtonElement;
    button.click();
    const listbox = el.shadowRoot!.querySelector('.listbox');
    expect(listbox?.classList.contains('open')).toBe(true);
  });

  it('closes listbox on second click', () => {
    const el = document.createElement('elx-select') as ElxSelect;
    el.options = defaultOptions;
    document.body.appendChild(el);
    const button = el.shadowRoot!.querySelector('.trigger') as HTMLButtonElement;
    button.click();
    button.click();
    const listbox = el.shadowRoot!.querySelector('.listbox');
    expect(listbox?.classList.contains('open')).toBe(false);
  });

  it('selects option on click', () => {
    const el = document.createElement('elx-select') as ElxSelect;
    el.options = defaultOptions;
    document.body.appendChild(el);
    const button = el.shadowRoot!.querySelector('.trigger') as HTMLButtonElement;
    button.click();
    const option = el.shadowRoot!.querySelector('[data-value="banana"]') as HTMLElement;
    option.click();
    expect((el as any).value).toBe('banana');
    const text = el.shadowRoot!.querySelector('.trigger-text');
    expect(text?.textContent).toBe('Banana');
  });

  it('closes after selection', () => {
    const el = document.createElement('elx-select') as ElxSelect;
    el.options = defaultOptions;
    document.body.appendChild(el);
    const button = el.shadowRoot!.querySelector('.trigger') as HTMLButtonElement;
    button.click();
    const option = el.shadowRoot!.querySelector('[data-value="apple"]') as HTMLElement;
    option.click();
    const listbox = el.shadowRoot!.querySelector('.listbox');
    expect(listbox?.classList.contains('open')).toBe(false);
  });

  it('dispatches change event on selection', () => {
    const el = document.createElement('elx-select') as ElxSelect;
    el.options = defaultOptions;
    document.body.appendChild(el);
    const handler = vi.fn();
    el.addEventListener('change', handler);
    const button = el.shadowRoot!.querySelector('.trigger') as HTMLButtonElement;
    button.click();
    const option = el.shadowRoot!.querySelector('[data-value="cherry"]') as HTMLElement;
    option.click();
    expect(handler).toHaveBeenCalled();
    expect(handler.mock.calls[0][0].detail.value).toBe('cherry');
  });

  it('marks selected option with class', () => {
    const el = document.createElement('elx-select') as ElxSelect;
    el.options = defaultOptions;
    el.value = 'banana';
    document.body.appendChild(el);
    const option = el.shadowRoot!.querySelector('[data-value="banana"]');
    expect(option?.classList.contains('selected')).toBe(true);
  });

  it('respects disabled attribute', () => {
    const el = document.createElement('elx-select') as ElxSelect;
    el.options = defaultOptions;
    el.disabled = true;
    document.body.appendChild(el);
    const button = el.shadowRoot!.querySelector('.trigger') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it('does not open when disabled', () => {
    const el = document.createElement('elx-select') as ElxSelect;
    el.options = defaultOptions;
    el.disabled = true;
    document.body.appendChild(el);
    const button = el.shadowRoot!.querySelector('.trigger') as HTMLButtonElement;
    button.click();
    const listbox = el.shadowRoot!.querySelector('.listbox');
    expect(listbox?.classList.contains('open')).toBe(false);
  });

  it('supports disabled options', () => {
    const optionsWithDisabled: SelectOption[] = [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B', disabled: true },
      { value: 'c', label: 'C' },
    ];
    const el = document.createElement('elx-select') as ElxSelect;
    el.options = optionsWithDisabled;
    document.body.appendChild(el);
    const option = el.shadowRoot!.querySelector('[data-value="b"]');
    expect(option?.classList.contains('disabled')).toBe(true);
    expect(option?.hasAttribute('aria-disabled')).toBe(true);
  });

  it('does not select disabled option', () => {
    const optionsWithDisabled: SelectOption[] = [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B', disabled: true },
    ];
    const el = document.createElement('elx-select') as ElxSelect;
    el.options = optionsWithDisabled;
    document.body.appendChild(el);
    const button = el.shadowRoot!.querySelector('.trigger') as HTMLButtonElement;
    button.click();
    const option = el.shadowRoot!.querySelector('[data-value="b"]') as HTMLElement;
    option.click();
    expect((el as any).value).toBe('');
  });

  it('closes on Escape key', () => {
    const el = document.createElement('elx-select') as ElxSelect;
    el.options = defaultOptions;
    document.body.appendChild(el);
    const button = el.shadowRoot!.querySelector('.trigger') as HTMLButtonElement;
    button.click();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    const listbox = el.shadowRoot!.querySelector('.listbox');
    expect(listbox?.classList.contains('open')).toBe(false);
  });

  it('closes on outside click', () => {
    const el = document.createElement('elx-select') as ElxSelect;
    el.options = defaultOptions;
    document.body.appendChild(el);
    const button = el.shadowRoot!.querySelector('.trigger') as HTMLButtonElement;
    button.click();
    document.body.click();
    const listbox = el.shadowRoot!.querySelector('.listbox');
    expect(listbox?.classList.contains('open')).toBe(false);
  });

  it('opens on Enter key', () => {
    const el = document.createElement('elx-select') as ElxSelect;
    el.options = defaultOptions;
    document.body.appendChild(el);
    const button = el.shadowRoot!.querySelector('.trigger') as HTMLButtonElement;
    button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    const listbox = el.shadowRoot!.querySelector('.listbox');
    expect(listbox?.classList.contains('open')).toBe(true);
  });

  it('opens on Space key', () => {
    const el = document.createElement('elx-select') as ElxSelect;
    el.options = defaultOptions;
    document.body.appendChild(el);
    const button = el.shadowRoot!.querySelector('.trigger') as HTMLButtonElement;
    button.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    const listbox = el.shadowRoot!.querySelector('.listbox');
    expect(listbox?.classList.contains('open')).toBe(true);
  });

  it('has correct ARIA attributes', () => {
    const el = document.createElement('elx-select') as ElxSelect;
    el.options = defaultOptions;
    document.body.appendChild(el);
    const button = el.shadowRoot!.querySelector('.trigger');
    const listbox = el.shadowRoot!.querySelector('.listbox');
    expect(button?.getAttribute('role')).toBe('combobox');
    expect(button?.getAttribute('aria-haspopup')).toBe('listbox');
    expect(button?.getAttribute('aria-expanded')).toBe('false');
    expect(listbox?.getAttribute('role')).toBe('listbox');
  });

  it('updates aria-expanded on open/close', () => {
    const el = document.createElement('elx-select') as ElxSelect;
    el.options = defaultOptions;
    document.body.appendChild(el);
    const button = el.shadowRoot!.querySelector('.trigger') as HTMLButtonElement;
    button.click();
    expect(button.getAttribute('aria-expanded')).toBe('true');
    button.click();
    expect(button.getAttribute('aria-expanded')).toBe('false');
  });

  it('value getter/setter works', () => {
    const el = document.createElement('elx-select') as ElxSelect;
    el.options = defaultOptions;
    el.value = 'apple';
    expect((el as any).value).toBe('apple');
    expect(el.getAttribute('value')).toBe('apple');
  });

  it('placeholder getter/setter works', () => {
    const el = document.createElement('elx-select') as ElxSelect;
    el.placeholder = 'Pick one...';
    expect(el.placeholder).toBe('Pick one...');
    expect(el.getAttribute('placeholder')).toBe('Pick one...');
  });

  it('disabled getter/setter works', () => {
    const el = document.createElement('elx-select') as ElxSelect;
    el.disabled = true;
    expect(el.disabled).toBe(true);
    expect(el.hasAttribute('disabled')).toBe(true);
    el.disabled = false;
    expect(el.disabled).toBe(false);
  });
});
