import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './slider.js';

const sliderMeta: Meta = {
  title: 'Components/Slider',
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100 } },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    variant: { control: 'select', options: ['primary', 'success', 'warning', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    label: { control: 'text' },
    disabled: { control: 'boolean' },
  },
};
export default sliderMeta;

type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <elx-slider
      value=${args.value ?? 50}
      min=${args.min ?? 0}
      max=${args.max ?? 100}
      step=${args.step ?? 1}
      variant=${args.variant ?? 'primary'}
      size=${args.size ?? 'md'}
      label=${args.label ?? 'Volume'}
      ?disabled=${args.disabled}
    ></elx-slider>
  `,
};

export const Variants: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <elx-slider value="25" variant="primary" label="Primary"></elx-slider>
      <elx-slider value="50" variant="success" label="Success"></elx-slider>
      <elx-slider value="75" variant="warning" label="Warning"></elx-slider>
      <elx-slider value="90" variant="danger" label="Danger"></elx-slider>
    </div>
  `,
};

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <elx-slider value="60" size="sm" label="Small"></elx-slider>
      <elx-slider value="60" size="md" label="Medium"></elx-slider>
      <elx-slider value="60" size="lg" label="Large"></elx-slider>
    </div>
  `,
};

export const Disabled: Story = {
  render: () => html`
    <elx-slider value="50" label="Disabled" disabled></elx-slider>
  `,
};

export const CustomRange: Story = {
  render: () => html`
    <elx-slider value="500" min="0" max="1000" step="50" label="Budget"></elx-slider>
  `,
};
