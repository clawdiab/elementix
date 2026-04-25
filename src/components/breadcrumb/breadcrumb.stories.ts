import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './breadcrumb.js';

const meta: Meta = {
  title: 'Components/Breadcrumb',
  tags: ['autodocs'],
  argTypes: {
    separator: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <elx-breadcrumb>
      <elx-breadcrumb-item href="/">Home</elx-breadcrumb-item>
      <elx-breadcrumb-item href="/products">Products</elx-breadcrumb-item>
      <elx-breadcrumb-item>Current Page</elx-breadcrumb-item>
    </elx-breadcrumb>
  `,
};

export const CustomSeparator: Story = {
  render: () => html`
    <elx-breadcrumb separator=">">
      <elx-breadcrumb-item href="/">Home</elx-breadcrumb-item>
      <elx-breadcrumb-item href="/docs">Docs</elx-breadcrumb-item>
      <elx-breadcrumb-item>API Reference</elx-breadcrumb-item>
    </elx-breadcrumb>
  `,
};

export const ArrowSeparator: Story = {
  render: () => html`
    <elx-breadcrumb separator="→">
      <elx-breadcrumb-item href="/">Home</elx-breadcrumb-item>
      <elx-breadcrumb-item href="/settings">Settings</elx-breadcrumb-item>
      <elx-breadcrumb-item href="/settings/profile">Profile</elx-breadcrumb-item>
      <elx-breadcrumb-item>Edit</elx-breadcrumb-item>
    </elx-breadcrumb>
  `,
};
