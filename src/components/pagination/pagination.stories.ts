import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './pagination.js';

const meta: Meta = {
  title: 'Components/Pagination',
  tags: ['autodocs'],
  argTypes: {
    page: { control: 'number' },
    total: { control: 'number' },
    perPage: { control: 'number' },
    siblingCount: { control: 'number' },
  },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <elx-pagination
      page=${args.page || 1}
      total=${args.total || 100}
      per-page=${args.perPage || 10}
    ></elx-pagination>
  `,
};

export const ManyPages: Story = {
  render: () => html`
    <elx-pagination page="5" total="200" per-page="10"></elx-pagination>
  `,
};

export const FewPages: Story = {
  render: () => html`
    <elx-pagination page="2" total="30" per-page="10"></elx-pagination>
  `,
};

export const LastPage: Story = {
  render: () => html`
    <elx-pagination page="10" total="100" per-page="10"></elx-pagination>
  `,
};
