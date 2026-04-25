import type { Meta, StoryObj } from '@storybook/web-components';
import './calendar.js';

const meta: Meta = {
  title: 'Components/Calendar',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => `
    <elx-calendar></elx-calendar>
  `,
};

export const WithValue: Story = {
  render: () => `
    <elx-calendar value="2025-06-15"></elx-calendar>
  `,
};

export const WithMinMax: Story = {
  render: () => {
    const today = new Date();
    const min = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
    const max = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
    return `
      <elx-calendar min="${min.toISOString()}" max="${max.toISOString()}"></elx-calendar>
    `;
  },
};

export const Disabled: Story = {
  render: () => `
    <elx-calendar disabled></elx-calendar>
  `,
};
