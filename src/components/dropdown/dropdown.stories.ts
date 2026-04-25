import type { Meta, StoryObj } from '@storybook/web-components';
import './dropdown.js';

const meta: Meta = {
  title: 'Components/Dropdown',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => {
    const dropdown = document.createElement('elx-dropdown');
    const trigger = document.createElement('button');
    trigger.slot = 'trigger';
    trigger.textContent = 'Open Menu';
    dropdown.appendChild(trigger);

    ['Edit', 'Duplicate', 'Delete'].forEach((label) => {
      const item = document.createElement('elx-dropdown-item');
      item.textContent = label;
      dropdown.appendChild(item);
    });

    return dropdown;
  },
};

export const WithDisabledItem: Story = {
  render: () => {
    const dropdown = document.createElement('elx-dropdown');
    const trigger = document.createElement('button');
    trigger.slot = 'trigger';
    trigger.textContent = 'Actions';
    dropdown.appendChild(trigger);

    ['Edit', 'Duplicate'].forEach((label) => {
      const item = document.createElement('elx-dropdown-item');
      item.textContent = label;
      dropdown.appendChild(item);
    });

    const disabled = document.createElement('elx-dropdown-item');
    disabled.textContent = 'Delete';
    disabled.setAttribute('disabled', '');
    dropdown.appendChild(disabled);

    return dropdown;
  },
};

export const DisabledDropdown: Story = {
  render: () => {
    const dropdown = document.createElement('elx-dropdown');
    dropdown.setAttribute('disabled', '');
    const trigger = document.createElement('button');
    trigger.slot = 'trigger';
    trigger.textContent = 'Disabled Menu';
    dropdown.appendChild(trigger);

    const item = document.createElement('elx-dropdown-item');
    item.textContent = 'Item';
    dropdown.appendChild(item);

    return dropdown;
  },
};
