import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './file-upload';

describe('ElxFileUpload', () => {
  let el: any;

  beforeEach(() => {
    el = document.createElement('elx-file-upload');
    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('is defined', () => {
    expect(customElements.get('elx-file-upload')).toBeDefined();
  });

  it('renders dropzone with role=button', () => {
    const dropzone = el.shadowRoot.querySelector('.dropzone');
    expect(dropzone).toBeTruthy();
    expect(dropzone.getAttribute('role')).toBe('button');
    expect(dropzone.getAttribute('tabindex')).toBe('0');
  });

  it('renders hidden file input', () => {
    const input = el.shadowRoot.querySelector('input[type="file"]');
    expect(input).toBeTruthy();
  });

  it('reflects accept attribute to input', () => {
    el.accept = '.png,.jpg';
    const input = el.shadowRoot.querySelector('input[type="file"]');
    expect(input.accept).toBe('.png,.jpg');
  });

  it('reflects multiple attribute to input', () => {
    el.multiple = true;
    const input = el.shadowRoot.querySelector('input[type="file"]');
    expect(input.multiple).toBe(true);
  });

  it('adds disabled class when disabled', () => {
    el.disabled = true;
    const dropzone = el.shadowRoot.querySelector('.dropzone');
    expect(dropzone.classList.contains('disabled')).toBe(true);
  });

  it('sets aria-disabled when disabled', () => {
    el.disabled = true;
    const dropzone = el.shadowRoot.querySelector('.dropzone');
    expect(dropzone.getAttribute('aria-disabled')).toBe('true');
    el.disabled = false;
    expect(dropzone.getAttribute('aria-disabled')).toBe('false');
  });

  it('does not open file dialog when disabled', () => {
    el.disabled = true;
    const input = el.shadowRoot.querySelector('input[type="file"]');
    let clicked = false;
    input.click = () => { clicked = true; };
    el.shadowRoot.querySelector('.dropzone').click();
    expect(clicked).toBe(false);
  });

  it('adds dragover class on dragover', () => {
    const dropzone = el.shadowRoot.querySelector('.dropzone');
    dropzone.dispatchEvent(new Event('dragover', { bubbles: true }));
    expect(dropzone.classList.contains('dragover')).toBe(true);
  });

  it('removes dragover class on dragleave', () => {
    const dropzone = el.shadowRoot.querySelector('.dropzone');
    dropzone.dispatchEvent(new Event('dragover', { bubbles: true }));
    dropzone.dispatchEvent(new Event('dragleave', { bubbles: true }));
    expect(dropzone.classList.contains('dragover')).toBe(false);
  });

  it('returns files array', () => {
    expect(el.files).toEqual([]);
  });

  it('clears files and dispatches event', () => {
    let cleared = false;
    el.addEventListener('elx-file-clear', () => { cleared = true; });
    el.clearFiles();
    expect(cleared).toBe(true);
    expect(el.files).toEqual([]);
  });

  it('renders file list with aria-label', () => {
    const list = el.shadowRoot.querySelector('.file-list');
    expect(list.getAttribute('role')).toBe('list');
    expect(list.getAttribute('aria-label')).toBe('Selected files');
  });

  it('sets maxSize property', () => {
    el.maxSize = 1024;
    expect(el.getAttribute('max-size')).toBe('1024');
    el.maxSize = 0;
    expect(el.hasAttribute('max-size')).toBe(false);
  });

  it('sets maxFiles property', () => {
    el.maxFiles = 5;
    expect(el.getAttribute('max-files')).toBe('5');
    el.maxFiles = 0;
    expect(el.hasAttribute('max-files')).toBe(false);
  });

  it('cleans up listeners on disconnect', () => {
    document.body.removeChild(el);
    document.body.appendChild(el);
    const dropzone = el.shadowRoot.querySelector('.dropzone');
    expect(dropzone).toBeTruthy();
  });
});
