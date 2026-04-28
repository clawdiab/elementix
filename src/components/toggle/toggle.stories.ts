import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './toggle.js';

const meta: Meta = {
  title: 'Components/Toggle',
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['default', 'outline'] },
    pressed: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <elx-toggle
      size=${args.size ?? 'md'}
      variant=${args.variant ?? 'default'}
      ?pressed=${args.pressed}
      ?disabled=${args.disabled}
    >Bold</elx-toggle>
  `,
};

export const Pressed: Story = {
  render: () => html`<elx-toggle pressed>Bold</elx-toggle>`,
};

export const Disabled: Story = {
  render: () => html`<elx-toggle disabled>Bold</elx-toggle>`,
};

export const Outline: Story = {
  render: () => html`
    <elx-toggle variant="outline">Normal</elx-toggle>
    <elx-toggle variant="outline" pressed>Pressed</elx-toggle>
  `,
};

export const Sizes: Story = {
  render: () => html`
    <elx-toggle size="sm">Small</elx-toggle>
    <elx-toggle size="md">Medium</elx-toggle>
    <elx-toggle size="lg">Large</elx-toggle>
  `,
};

export const Group: Story = {
  render: () => html`
    <elx-toggle-group>
      <elx-toggle value="bold">B</elx-toggle>
      <elx-toggle value="italic">I</elx-toggle>
      <elx-toggle value="underline">U</elx-toggle>
    </elx-toggle-group>
  `,
};

export const GroupMultiple: Story = {
  render: () => html`
    <elx-toggle-group type="multiple">
      <elx-toggle value="bold">B</elx-toggle>
      <elx-toggle value="italic">I</elx-toggle>
      <elx-toggle value="underline">U</elx-toggle>
    </elx-toggle-group>
  `,
};

export const GroupDisabled: Story = {
  render: () => html`
    <elx-toggle-group disabled>
      <elx-toggle value="bold">B</elx-toggle>
      <elx-toggle value="italic">I</elx-toggle>
    </elx-toggle-group>
  `,
};
