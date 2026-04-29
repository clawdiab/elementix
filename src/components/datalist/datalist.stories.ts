import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './datalist.js';

const meta: Meta = {
  title: 'Components/DataList',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A filterable list component for selecting items from a dataset.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const fruits = [
  { id: 'apple', label: 'Apple', description: 'Red or green fruit', group: 'Fruits' },
  { id: 'banana', label: 'Banana', description: 'Yellow tropical fruit', group: 'Fruits' },
  { id: 'cherry', label: 'Cherry', description: 'Small red fruit', group: 'Fruits' },
  { id: 'mango', label: 'Mango', description: 'Sweet tropical fruit', group: 'Fruits' },
  { id: 'carrot', label: 'Carrot', description: 'Orange root vegetable', group: 'Vegetables' },
  { id: 'broccoli', label: 'Broccoli', description: 'Green cruciferous vegetable', group: 'Vegetables' },
  { id: 'spinach', label: 'Spinach', description: 'Leafy green vegetable', group: 'Vegetables' },
];

export const Default: Story = {
  render: () => {
    const setup = () => {
      const el = document.querySelector('#default-dl') as any;
      if (el) {
        el.items = fruits;
        el.addEventListener('elx-datalist-select', (e: CustomEvent) => {
          console.log('Selected:', e.detail);
        });
      }
    };
    setTimeout(setup, 0);
    return html`
      <div style="max-width: 400px;">
        <elx-datalist id="default-dl" label="Select a food"></elx-datalist>
      </div>
    `;
  },
};

export const WithCustomPlaceholder: Story = {
  render: () => {
    const setup = () => {
      const el = document.querySelector('#placeholder-dl') as any;
      if (el) el.items = fruits;
    };
    setTimeout(setup, 0);
    return html`
      <div style="max-width: 400px;">
        <elx-datalist id="placeholder-dl" placeholder="Search foods..." label="Select a food"></elx-datalist>
      </div>
    `;
  },
};

export const SimpleList: Story = {
  render: () => {
    const countries = [
      { id: 'us', label: 'United States' },
      { id: 'uk', label: 'United Kingdom' },
      { id: 'ca', label: 'Canada' },
      { id: 'au', label: 'Australia' },
      { id: 'de', label: 'Germany' },
      { id: 'fr', label: 'France' },
      { id: 'jp', label: 'Japan' },
    ];
    const setup = () => {
      const el = document.querySelector('#simple-dl') as any;
      if (el) el.items = countries;
    };
    setTimeout(setup, 0);
    return html`
      <div style="max-width: 400px;">
        <elx-datalist id="simple-dl" label="Select a country" placeholder="Search countries..."></elx-datalist>
      </div>
    `;
  },
};
