import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './label.js';

const labelMeta: Meta = {
  title: 'Components/Label',
  tags: ['autodocs'],
  argTypes: {
    for: { control: 'text' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};
export default labelMeta;

type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <elx-label
      for=${args.for ?? ''}
      size=${args.size ?? 'md'}
      ?required=${args.required}
      ?disabled=${args.disabled}
    >Email Address</elx-label>
  `,
};

export const Required: Story = {
  render: () => html`
    <elx-label required>Username</elx-label>
  `,
};

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 8px;">
      <elx-label size="sm">Small Label</elx-label>
      <elx-label size="md">Medium Label</elx-label>
      <elx-label size="lg">Large Label</elx-label>
    </div>
  `,
};

export const Disabled: Story = {
  render: () => html`
    <elx-label disabled>Disabled Label</elx-label>
  `,
};

export const WithInput: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 4px;">
      <elx-label for="email-input" required>Email</elx-label>
      <input id="email-input" type="email" placeholder="you@example.com" />
    </div>
  `,
};
