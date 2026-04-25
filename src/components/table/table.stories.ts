import type { Meta, StoryObj } from '@storybook/web-components';
import './table.js';

const meta: Meta = {
  title: 'Components/Table',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => {
    const table = document.createElement('elx-table');

    const header = document.createElement('elx-table-header');
    const headerRow = document.createElement('elx-table-row');
    ['Name', 'Email', 'Role'].forEach((text) => {
      const cell = document.createElement('elx-table-header-cell');
      cell.textContent = text;
      headerRow.appendChild(cell);
    });
    header.appendChild(headerRow);

    const body = document.createElement('elx-table-body');
    const data = [
      ['Alice', 'alice@example.com', 'Admin'],
      ['Bob', 'bob@example.com', 'Editor'],
      ['Charlie', 'charlie@example.com', 'Viewer'],
    ];
    data.forEach((row) => {
      const tr = document.createElement('elx-table-row');
      row.forEach((text) => {
        const td = document.createElement('elx-table-cell');
        td.textContent = text;
        tr.appendChild(td);
      });
      body.appendChild(tr);
    });

    table.appendChild(header);
    table.appendChild(body);
    return table;
  },
};

export const Striped: Story = {
  render: () => {
    const table = document.createElement('elx-table');
    table.setAttribute('striped', '');

    const header = document.createElement('elx-table-header');
    const headerRow = document.createElement('elx-table-row');
    ['Name', 'Status', 'Amount'].forEach((text) => {
      const cell = document.createElement('elx-table-header-cell');
      cell.textContent = text;
      headerRow.appendChild(cell);
    });
    header.appendChild(headerRow);

    const body = document.createElement('elx-table-body');
    const data = [
      ['Invoice #001', 'Paid', '$250.00'],
      ['Invoice #002', 'Pending', '$150.00'],
      ['Invoice #003', 'Paid', '$350.00'],
      ['Invoice #004', 'Overdue', '$450.00'],
    ];
    data.forEach((row) => {
      const tr = document.createElement('elx-table-row');
      row.forEach((text) => {
        const td = document.createElement('elx-table-cell');
        td.textContent = text;
        tr.appendChild(td);
      });
      body.appendChild(tr);
    });

    table.appendChild(header);
    table.appendChild(body);
    return table;
  },
};

export const Sortable: Story = {
  render: () => {
    const table = document.createElement('elx-table');
    table.setAttribute('hoverable', '');

    const header = document.createElement('elx-table-header');
    const headerRow = document.createElement('elx-table-row');
    ['Name', 'Age', 'City'].forEach((text) => {
      const cell = document.createElement('elx-table-header-cell');
      cell.setAttribute('sortable', '');
      cell.textContent = text;
      headerRow.appendChild(cell);
    });
    header.appendChild(headerRow);

    const body = document.createElement('elx-table-body');
    const data = [
      ['Alice', '28', 'Jakarta'],
      ['Bob', '34', 'Bandung'],
      ['Charlie', '22', 'Surabaya'],
    ];
    data.forEach((row) => {
      const tr = document.createElement('elx-table-row');
      row.forEach((text) => {
        const td = document.createElement('elx-table-cell');
        td.textContent = text;
        tr.appendChild(td);
      });
      body.appendChild(tr);
    });

    table.appendChild(header);
    table.appendChild(body);
    return table;
  },
};

export const WithSelection: Story = {
  render: () => {
    const table = document.createElement('elx-table');
    table.setAttribute('bordered', '');

    const header = document.createElement('elx-table-header');
    const headerRow = document.createElement('elx-table-row');
    ['Product', 'Price', 'Stock'].forEach((text) => {
      const cell = document.createElement('elx-table-header-cell');
      cell.textContent = text;
      headerRow.appendChild(cell);
    });
    header.appendChild(headerRow);

    const body = document.createElement('elx-table-body');
    const data = [
      ['Widget A', '$10.00', '100', false, false],
      ['Widget B', '$20.00', '50', true, false],
      ['Widget C', '$15.00', '0', false, true],
    ];
    data.forEach(([name, price, stock, selected, disabled]) => {
      const tr = document.createElement('elx-table-row');
      if (selected) tr.setAttribute('selected', '');
      if (disabled) tr.setAttribute('disabled', '');
      [name, price, stock].forEach((text) => {
        const td = document.createElement('elx-table-cell');
        td.textContent = text as string;
        tr.appendChild(td);
      });
      body.appendChild(tr);
    });

    table.appendChild(header);
    table.appendChild(body);
    return table;
  },
};
