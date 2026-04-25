import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './progress.js';

const progressMeta: Meta = {
  title: 'Components/Progress',
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100 } },
    max: { control: 'number' },
    variant: { control: 'select', options: ['primary', 'success', 'warning', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    label: { control: 'text' },
  },
};
export default progressMeta;

type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <elx-progress
      value=${args.value || 60}
      max=${args.max || 100}
      variant=${args.variant || 'primary'}
      size=${args.size || 'md'}
      label=${args.label || 'Upload progress'}
    ></elx-progress>
  `,
};

export const Variants: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <elx-progress value="25" variant="primary" label="Primary"></elx-progress>
      <elx-progress value="50" variant="success" label="Success"></elx-progress>
      <elx-progress value="75" variant="warning" label="Warning"></elx-progress>
      <elx-progress value="90" variant="danger" label="Danger"></elx-progress>
    </div>
  `,
};

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <elx-progress value="60" size="sm" label="Small"></elx-progress>
      <elx-progress value="60" size="md" label="Medium"></elx-progress>
      <elx-progress value="60" size="lg" label="Large"></elx-progress>
    </div>
  `,
};

export const Spinner: Story = {
  render: () => html`
    <div style="display: flex; gap: 24px; align-items: center;">
      <elx-spinner size="sm"></elx-spinner>
      <elx-spinner size="md"></elx-spinner>
      <elx-spinner size="lg"></elx-spinner>
    </div>
  `,
};

export const SpinnerVariants: Story = {
  render: () => html`
    <div style="display: flex; gap: 24px; align-items: center;">
      <elx-spinner variant="primary"></elx-spinner>
      <elx-spinner variant="success"></elx-spinner>
      <elx-spinner variant="warning"></elx-spinner>
      <elx-spinner variant="danger"></elx-spinner>
    </div>
  `,
};
