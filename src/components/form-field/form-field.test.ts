import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import './form-field';

describe('elx-form-field', () => {
  beforeAll(() => {
    expect(customElements.get('elx-form-field')).toBeDefined();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders with shadow DOM', () => {
    const el = document.createElement('elx-form-field');
    document.body.appendChild(el);
    expect(el.shadowRoot).toBeTruthy();
  });

  it('renders label text', () => {
    const el = document.createElement('elx-form-field') as any;
    el.label = 'Email';
    document.body.appendChild(el);
    const label = el.shadowRoot!.querySelector('.label-text');
    expect(label!.textContent).toBe('Email');
  });

  it('hides label row when no label', () => {
    const el = document.createElement('elx-form-field') as any;
    document.body.appendChild(el);
    const labelRow = el.shadowRoot!.querySelector('.label-row') as HTMLElement;
    expect(labelRow.style.display).toBe('none');
  });

  it('shows label row when label set', () => {
    const el = document.createElement('elx-form-field') as any;
    el.label = 'Name';
    document.body.appendChild(el);
    const labelRow = el.shadowRoot!.querySelector('.label-row') as HTMLElement;
    expect(labelRow.style.display).toBe('flex');
  });

  it('shows required indicator when required', () => {
    const el = document.createElement('elx-form-field') as any;
    el.label = 'Username';
    el.required = true;
    document.body.appendChild(el);
    const asterisk = el.shadowRoot!.querySelector('.required-indicator') as HTMLElement;
    expect(asterisk.style.display).toBe('inline');
  });

  it('hides required indicator when not required', () => {
    const el = document.createElement('elx-form-field') as any;
    el.label = 'Name';
    document.body.appendChild(el);
    const asterisk = el.shadowRoot!.querySelector('.required-indicator') as HTMLElement;
    expect(asterisk.style.display).toBe('none');
  });

  it('required indicator has aria-hidden', () => {
    const el = document.createElement('elx-form-field') as any;
    el.required = true;
    document.body.appendChild(el);
    const asterisk = el.shadowRoot!.querySelector('.required-indicator');
    expect(asterisk!.getAttribute('aria-hidden')).toBe('true');
  });

  it('shows helper text', () => {
    const el = document.createElement('elx-form-field') as any;
    el.helperText = 'Enter your email address';
    document.body.appendChild(el);
    const helper = el.shadowRoot!.querySelector('.helper-text') as HTMLElement;
    expect(helper.textContent).toBe('Enter your email address');
    expect(helper.style.display).toBe('block');
  });

  it('hides helper text when empty', () => {
    const el = document.createElement('elx-form-field') as any;
    document.body.appendChild(el);
    const helper = el.shadowRoot!.querySelector('.helper-text') as HTMLElement;
    expect(helper.style.display).toBe('none');
  });

  it('shows error text', () => {
    const el = document.createElement('elx-form-field') as any;
    el.errorText = 'This field is required';
    document.body.appendChild(el);
    const error = el.shadowRoot!.querySelector('.error-text') as HTMLElement;
    expect(error.textContent).toBe('This field is required');
    expect(error.style.display).toBe('block');
  });

  it('hides error text when empty', () => {
    const el = document.createElement('elx-form-field') as any;
    document.body.appendChild(el);
    const error = el.shadowRoot!.querySelector('.error-text') as HTMLElement;
    expect(error.style.display).toBe('none');
  });

  it('hides helper when error is shown', () => {
    const el = document.createElement('elx-form-field') as any;
    el.helperText = 'Some help';
    el.errorText = 'Something went wrong';
    document.body.appendChild(el);
    const helper = el.shadowRoot!.querySelector('.helper-text') as HTMLElement;
    const error = el.shadowRoot!.querySelector('.error-text') as HTMLElement;
    expect(helper.style.display).toBe('none');
    expect(error.style.display).toBe('block');
  });

  it('error text has role=alert', () => {
    const el = document.createElement('elx-form-field') as any;
    el.errorText = 'Error!';
    document.body.appendChild(el);
    const error = el.shadowRoot!.querySelector('.error-text');
    expect(error!.getAttribute('role')).toBe('alert');
  });

  it('error text has aria-live=polite', () => {
    const el = document.createElement('elx-form-field') as any;
    document.body.appendChild(el);
    const error = el.shadowRoot!.querySelector('.error-text');
    expect(error!.getAttribute('aria-live')).toBe('polite');
  });

  it('wrapper has role=group', () => {
    const el = document.createElement('elx-form-field') as any;
    document.body.appendChild(el);
    const wrapper = el.shadowRoot!.querySelector('.form-field');
    expect(wrapper!.getAttribute('role')).toBe('group');
  });

  it('wrapper has aria-label from label', () => {
    const el = document.createElement('elx-form-field') as any;
    el.label = 'Phone';
    document.body.appendChild(el);
    const wrapper = el.shadowRoot!.querySelector('.form-field');
    expect(wrapper!.getAttribute('aria-label')).toBe('Phone');
  });

  it('applies size class to label', () => {
    const el = document.createElement('elx-form-field') as any;
    el.label = 'Test';
    el.size = 'lg';
    document.body.appendChild(el);
    const label = el.shadowRoot!.querySelector('.label-text');
    expect(label!.classList.contains('lg')).toBe(true);
  });

  it('supports disabled state', () => {
    const el = document.createElement('elx-form-field') as any;
    el.disabled = true;
    document.body.appendChild(el);
    expect(el.hasAttribute('disabled')).toBe(true);
  });

  it('has correct default values', () => {
    const el = document.createElement('elx-form-field') as any;
    document.body.appendChild(el);
    expect(el.label).toBe('');
    expect(el.helperText).toBe('');
    expect(el.errorText).toBe('');
    expect(el.required).toBe(false);
    expect(el.disabled).toBe(false);
    expect(el.size).toBe('md');
  });

  it('renders slotted content', () => {
    const el = document.createElement('elx-form-field') as any;
    el.label = 'Email';
    document.body.appendChild(el);
    const slot = el.shadowRoot!.querySelector('slot');
    expect(slot).toBeTruthy();
  });

  it('dynamically updates error text', () => {
    const el = document.createElement('elx-form-field') as any;
    document.body.appendChild(el);
    const error = el.shadowRoot!.querySelector('.error-text') as HTMLElement;
    expect(error.style.display).toBe('none');
    el.errorText = 'Required';
    expect(error.textContent).toBe('Required');
    expect(error.style.display).toBe('block');
  });

  it('shows helper again when error is cleared', () => {
    const el = document.createElement('elx-form-field') as any;
    el.helperText = 'Help';
    el.errorText = 'Error';
    document.body.appendChild(el);
    const helper = el.shadowRoot!.querySelector('.helper-text') as HTMLElement;
    expect(helper.style.display).toBe('none');
    el.errorText = '';
    el.removeAttribute('error-text');
    expect(helper.style.display).toBe('block');
  });

  it('helper text has role=note', () => {
    const el = document.createElement('elx-form-field') as any;
    document.body.appendChild(el);
    const helper = el.shadowRoot!.querySelector('.helper-text');
    expect(helper!.getAttribute('role')).toBe('note');
  });
});
