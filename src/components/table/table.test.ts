import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './table';

describe('ElxTable', () => {
  let el: any;

  beforeEach(() => {
    el = document.createElement('elx-table');
    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders with table role', () => {
    const table = el.shadowRoot.querySelector('table');
    expect(table).toBeTruthy();
    expect(table.getAttribute('role')).toBe('table');
  });

  it('renders slot for content', () => {
    const slot = el.shadowRoot.querySelector('slot');
    expect(slot).toBeTruthy();
  });

  it('has striped attribute', () => {
    el.striped = true;
    expect(el.hasAttribute('striped')).toBe(true);
    expect(el.striped).toBe(true);
  });

  it('has hoverable attribute', () => {
    el.hoverable = true;
    expect(el.hasAttribute('hoverable')).toBe(true);
    expect(el.hoverable).toBe(true);
  });

  it('has bordered attribute', () => {
    el.bordered = true;
    expect(el.hasAttribute('bordered')).toBe(true);
    expect(el.bordered).toBe(true);
  });
});

describe('ElxTableHeader', () => {
  let el: any;

  beforeEach(() => {
    el = document.createElement('elx-table-header');
    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders slot', () => {
    const slot = el.shadowRoot.querySelector('slot');
    expect(slot).toBeTruthy();
  });

  it('has rowgroup role', () => {
    expect(el.getAttribute('role')).toBe('rowgroup');
  });
});

describe('ElxTableBody', () => {
  let el: any;

  beforeEach(() => {
    el = document.createElement('elx-table-body');
    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders slot', () => {
    const slot = el.shadowRoot.querySelector('slot');
    expect(slot).toBeTruthy();
  });

  it('has rowgroup role', () => {
    expect(el.getAttribute('role')).toBe('rowgroup');
  });
});

describe('ElxTableRow', () => {
  let el: any;

  beforeEach(() => {
    el = document.createElement('elx-table-row');
    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders slot', () => {
    const slot = el.shadowRoot.querySelector('slot');
    expect(slot).toBeTruthy();
  });

  it('has row role', () => {
    expect(el.getAttribute('role')).toBe('row');
  });

  it('has selected attribute', () => {
    el.selected = true;
    expect(el.hasAttribute('selected')).toBe(true);
    expect(el.selected).toBe(true);
    expect(el.getAttribute('aria-selected')).toBe('true');
  });

  it('has disabled attribute', () => {
    el.disabled = true;
    expect(el.hasAttribute('disabled')).toBe(true);
    expect(el.disabled).toBe(true);
    expect(el.getAttribute('aria-disabled')).toBe('true');
  });
});

describe('ElxTableCell', () => {
  let el: any;

  beforeEach(() => {
    el = document.createElement('elx-table-cell');
    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders slot', () => {
    const slot = el.shadowRoot.querySelector('slot');
    expect(slot).toBeTruthy();
  });

  it('has cell role', () => {
    expect(el.getAttribute('role')).toBe('cell');
  });
});

describe('ElxTableHeaderCell', () => {
  let el: any;

  beforeEach(() => {
    el = document.createElement('elx-table-header-cell');
    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders slot', () => {
    const slot = el.shadowRoot.querySelector('slot');
    expect(slot).toBeTruthy();
  });

  it('has columnheader role', () => {
    expect(el.getAttribute('role')).toBe('columnheader');
  });

  it('has sortable attribute', () => {
    el.sortable = true;
    expect(el.hasAttribute('sortable')).toBe(true);
    expect(el.sortable).toBe(true);
  });

  it('has sortDirection attribute', () => {
    el.sortDirection = 'asc';
    expect(el.sortDirection).toBe('asc');
    el.sortDirection = 'desc';
    expect(el.sortDirection).toBe('desc');
    el.sortDirection = 'none';
    expect(el.sortDirection).toBe('none');
  });

  it('renders sort button when sortable', () => {
    el.sortable = true;
    document.body.innerHTML = '';
    el = document.createElement('elx-table-header-cell');
    el.sortable = true;
    document.body.appendChild(el);
    const button = el.shadowRoot.querySelector('button');
    expect(button).toBeTruthy();
  });

  it('does not render sort button when not sortable', () => {
    const button = el.shadowRoot.querySelector('button');
    expect(button).toBeNull();
  });

  it('dispatches sort event on button click', async () => {
    el.sortable = true;
    document.body.innerHTML = '';
    el = document.createElement('elx-table-header-cell');
    el.sortable = true;
    document.body.appendChild(el);

    const button = el.shadowRoot.querySelector('button');
    let eventDetail: any = null;
    el.addEventListener('sort', (e: CustomEvent) => {
      eventDetail = e.detail;
    });

    button.click();
    expect(eventDetail).toBeTruthy();
    expect(eventDetail.direction).toBe('asc');
  });

  it('cycles sort direction on repeated clicks', async () => {
    el.sortable = true;
    document.body.innerHTML = '';
    el = document.createElement('elx-table-header-cell');
    el.sortable = true;
    document.body.appendChild(el);

    const button = el.shadowRoot.querySelector('button');
    const directions: string[] = [];

    el.addEventListener('sort', (e: CustomEvent) => {
      directions.push(e.detail.direction);
    });

    button.click();
    el.sortDirection = 'asc';
    button.click();
    el.sortDirection = 'desc';
    button.click();

    expect(directions).toEqual(['asc', 'desc', 'asc']);
  });

  it('updates aria-sort based on sortDirection', () => {
    el.sortable = true;
    document.body.innerHTML = '';
    el = document.createElement('elx-table-header-cell');
    el.sortable = true;
    document.body.appendChild(el);

    const button = el.shadowRoot.querySelector('button');

    el.sortDirection = 'asc';
    expect(button.getAttribute('aria-sort')).toBe('ascending');

    el.sortDirection = 'desc';
    expect(button.getAttribute('aria-sort')).toBe('descending');

    el.sortDirection = 'none';
    expect(button.hasAttribute('aria-sort')).toBe(false);
  });
});
