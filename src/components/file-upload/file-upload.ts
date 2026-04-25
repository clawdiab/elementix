const fileUploadStyles = `
  :host {
    --elx-file-upload-bg: var(--elx-color-surface, #ffffff);
    --elx-file-upload-border: var(--elx-color-border, #e2e8f0);
    --elx-file-upload-border-active: var(--elx-color-primary, #3b82f6);
    --elx-file-upload-radius: var(--elx-radius-md, 0.5rem);
    --elx-file-upload-text: var(--elx-color-text, #1e293b);
    --elx-file-upload-muted: var(--elx-color-text-muted, #64748b);
    display: block;
  }

  .dropzone {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 2rem;
    border: 2px dashed var(--elx-file-upload-border);
    border-radius: var(--elx-file-upload-radius);
    background: var(--elx-file-upload-bg);
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s;
  }

  .dropzone.dragover {
    border-color: var(--elx-file-upload-border-active);
    background: color-mix(in srgb, var(--elx-file-upload-border-active) 5%, transparent);
  }

  .dropzone.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .icon {
    font-size: 2rem;
    color: var(--elx-file-upload-muted);
  }

  .label {
    font-family: var(--elx-font-family-sans, system-ui, sans-serif);
    font-size: 0.875rem;
    color: var(--elx-file-upload-text);
  }

  .hint {
    font-family: var(--elx-font-family-sans, system-ui, sans-serif);
    font-size: 0.75rem;
    color: var(--elx-file-upload-muted);
  }

  .file-list {
    list-style: none;
    margin: 0.5rem 0 0;
    padding: 0;
    width: 100%;
  }

  .file-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--elx-file-upload-border);
    border-radius: var(--elx-file-upload-radius);
    margin-top: 0.5rem;
    font-family: var(--elx-font-family-sans, system-ui, sans-serif);
    font-size: 0.8125rem;
    color: var(--elx-file-upload-text);
  }

  .file-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
  }

  .file-size {
    color: var(--elx-file-upload-muted);
    margin-left: 0.5rem;
    flex-shrink: 0;
  }

  .remove-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--elx-file-upload-muted);
    padding: 0.25rem;
    margin-left: 0.5rem;
    font-size: 1rem;
    line-height: 1;
    flex-shrink: 0;
  }

  .remove-btn:hover {
    color: var(--elx-color-danger, #ef4444);
  }

  input[type="file"] {
    display: none;
  }
`;

export class ElxFileUpload extends HTMLElement {
  static observedAttributes = ['accept', 'multiple', 'disabled', 'max-size', 'max-files'];

  private _input: HTMLInputElement | null = null;
  private _dropzone: HTMLElement | null = null;
  private _fileList: HTMLElement | null = null;
  private _files: File[] = [];
  private _rendered = false;

  private _boundDragOver: (e: DragEvent) => void;
  private _boundDragLeave: () => void;
  private _boundDrop: (e: DragEvent) => void;
  private _boundClick: () => void;
  private _boundInputChange: () => void;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._boundDragOver = this._handleDragOver.bind(this);
    this._boundDragLeave = this._handleDragLeave.bind(this);
    this._boundDrop = this._handleDrop.bind(this);
    this._boundClick = this._handleClick.bind(this);
    this._boundInputChange = this._handleInputChange.bind(this);
  }

  connectedCallback() {
    if (!this._rendered) {
      this._render();
      this._rendered = true;
    }
    this._attachListeners();
  }

  disconnectedCallback() {
    this._detachListeners();
  }

  attributeChangedCallback(name: string, oldVal: string | null, newVal: string | null) {
    if (oldVal === newVal) return;
    if (name === 'accept' && this._input) {
      this._input.accept = newVal || '';
    }
    if (name === 'multiple' && this._input) {
      this._input.multiple = newVal !== null;
    }
    if (name === 'disabled') {
      this._dropzone?.classList.toggle('disabled', newVal !== null);
    }
  }

  get accept(): string { return this.getAttribute('accept') || ''; }
  set accept(val: string) { this.setAttribute('accept', val); }

  get multiple(): boolean { return this.hasAttribute('multiple'); }
  set multiple(val: boolean) { val ? this.setAttribute('multiple', '') : this.removeAttribute('multiple'); }

  get disabled(): boolean { return this.hasAttribute('disabled'); }
  set disabled(val: boolean) { val ? this.setAttribute('disabled', '') : this.removeAttribute('disabled'); }

  get maxSize(): number {
    const val = parseInt(this.getAttribute('max-size') || '0', 10);
    return isNaN(val) || val <= 0 ? 0 : val;
  }
  set maxSize(val: number) {
    if (val > 0) this.setAttribute('max-size', String(val));
    else this.removeAttribute('max-size');
  }

  get maxFiles(): number {
    const val = parseInt(this.getAttribute('max-files') || '0', 10);
    return isNaN(val) || val <= 0 ? 0 : val;
  }
  set maxFiles(val: number) {
    if (val > 0) this.setAttribute('max-files', String(val));
    else this.removeAttribute('max-files');
  }

  get files(): File[] { return [...this._files]; }

  clearFiles() {
    this._files = [];
    this._renderFileList();
    this.dispatchEvent(new CustomEvent('elx-file-clear', { bubbles: true, composed: true }));
  }

  private _render() {
    this.shadowRoot!.innerHTML = `
      <style>${fileUploadStyles}</style>
      <div class="dropzone" role="button" tabindex="0" aria-label="Upload files">
        <span class="icon" aria-hidden="true">📁</span>
        <span class="label"><slot>Drop files here or click to browse</slot></span>
        <span class="hint"></span>
      </div>
      <input type="file">
      <ul class="file-list" role="list" aria-label="Selected files"></ul>
    `;
    this._dropzone = this.shadowRoot!.querySelector('.dropzone');
    this._input = this.shadowRoot!.querySelector('input[type="file"]');
    this._fileList = this.shadowRoot!.querySelector('.file-list');

    if (this._input) {
      this._input.accept = this.accept;
      this._input.multiple = this.multiple;
    }
    if (this.disabled) {
      this._dropzone?.classList.add('disabled');
    }
    this._updateHint();
  }

  private _attachListeners() {
    if (!this._dropzone || !this._input) return;
    this._dropzone.addEventListener('dragover', this._boundDragOver as EventListener);
    this._dropzone.addEventListener('dragleave', this._boundDragLeave);
    this._dropzone.addEventListener('drop', this._boundDrop as EventListener);
    this._dropzone.addEventListener('click', this._boundClick);
    this._dropzone.addEventListener('keydown', ((e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this._handleClick();
      }
    }) as EventListener);
    this._input.addEventListener('change', this._boundInputChange);
  }

  private _detachListeners() {
    if (!this._dropzone || !this._input) return;
    this._dropzone.removeEventListener('dragover', this._boundDragOver as EventListener);
    this._dropzone.removeEventListener('dragleave', this._boundDragLeave);
    this._dropzone.removeEventListener('drop', this._boundDrop as EventListener);
    this._dropzone.removeEventListener('click', this._boundClick);
    this._input.removeEventListener('change', this._boundInputChange);
  }

  private _handleDragOver(e: DragEvent) {
    e.preventDefault();
    if (this.disabled) return;
    this._dropzone?.classList.add('dragover');
  }

  private _handleDragLeave() {
    this._dropzone?.classList.remove('dragover');
  }

  private _handleDrop(e: DragEvent) {
    e.preventDefault();
    this._dropzone?.classList.remove('dragover');
    if (this.disabled) return;
    const files = e.dataTransfer?.files;
    if (files) this._addFiles(files);
  }

  private _handleClick() {
    if (this.disabled) return;
    this._input?.click();
  }

  private _handleInputChange() {
    const files = this._input?.files;
    if (files) this._addFiles(files);
    if (this._input) this._input.value = '';
  }

  private _addFiles(fileList: FileList) {
    const newFiles: File[] = [];
    const rejected: Array<{ file: File; reason: string }> = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];

      if (this.accept) {
        const accepted = this.accept.split(',').map(a => a.trim());
        const ext = '.' + file.name.split('.').pop()?.toLowerCase();
        const matches = accepted.some(a => {
          if (a.startsWith('.')) return ext === a.toLowerCase();
          if (a.endsWith('/*')) return file.type.startsWith(a.replace('/*', '/'));
          return file.type === a;
        });
        if (!matches) {
          rejected.push({ file, reason: 'type' });
          continue;
        }
      }

      if (this.maxSize > 0 && file.size > this.maxSize) {
        rejected.push({ file, reason: 'size' });
        continue;
      }

      newFiles.push(file);
    }

    if (this.multiple) {
      const combined = [...this._files, ...newFiles];
      if (this.maxFiles > 0 && combined.length > this.maxFiles) {
        this._files = combined.slice(0, this.maxFiles);
      } else {
        this._files = combined;
      }
    } else {
      this._files = newFiles.slice(0, 1);
    }

    this._renderFileList();

    if (rejected.length > 0) {
      this.dispatchEvent(new CustomEvent('elx-file-reject', {
        bubbles: true,
        composed: true,
        detail: { rejected },
      }));
    }

    this.dispatchEvent(new CustomEvent('elx-file-change', {
      bubbles: true,
      composed: true,
      detail: { files: this.files },
    }));
  }

  private _removeFile(index: number) {
    this._files.splice(index, 1);
    this._renderFileList();
    this.dispatchEvent(new CustomEvent('elx-file-change', {
      bubbles: true,
      composed: true,
      detail: { files: this.files },
    }));
  }

  private _renderFileList() {
    if (!this._fileList) return;
    this._fileList.innerHTML = '';

    this._files.forEach((file, index) => {
      const li = document.createElement('li');
      li.className = 'file-item';

      const name = document.createElement('span');
      name.className = 'file-name';
      name.textContent = file.name;

      const size = document.createElement('span');
      size.className = 'file-size';
      size.textContent = this._formatSize(file.size);

      const btn = document.createElement('button');
      btn.className = 'remove-btn';
      btn.type = 'button';
      btn.setAttribute('aria-label', `Remove ${file.name}`);
      btn.textContent = '✕';
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this._removeFile(index);
      });

      li.appendChild(name);
      li.appendChild(size);
      li.appendChild(btn);
      this._fileList!.appendChild(li);
    });
  }

  private _updateHint() {
    const hint = this.shadowRoot?.querySelector('.hint');
    if (!hint) return;
    const parts: string[] = [];
    if (this.accept) parts.push(this.accept);
    if (this.maxSize > 0) parts.push(`Max ${this._formatSize(this.maxSize)}`);
    if (this.maxFiles > 0) parts.push(`Up to ${this.maxFiles} files`);
    hint.textContent = parts.join(' · ');
  }

  private _formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}

if (!customElements.get('elx-file-upload')) {
  customElements.define('elx-file-upload', ElxFileUpload);
}
