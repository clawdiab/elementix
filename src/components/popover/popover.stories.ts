import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './popover.js';

const meta: Meta = {
  title: 'Components/Popover',
  tags: ['autodocs'],
  argTypes: {
    position: {
      control: 'select',
      options: ['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'right'],
    },
    disabled: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <div style="padding: 100px; display: flex; justify-content: center;">
      <elx-popover position=${args.position || 'bottom'} ?disabled=${args.disabled}>
        <button slot="trigger">Click me</button>
        <div>
          <p style="margin: 0 0 8px;">Popover content</p>
          <p style="margin: 0; color: #666; font-size: 14px;">This is a popover with some helpful information.</p>
        </div>
      </elx-popover>
    </div>
  `,
};

export const TopPosition: Story = {
  render: () => html`
    <div style="padding: 150px; display: flex; justify-content: center;">
      <elx-popover position="top">
        <button slot="trigger">Show above</button>
        <div>This popover appears above the trigger.</div>
      </elx-popover>
    </div>
  `,
};

export const LeftRight: Story = {
  render: () => html`
    <div style="padding: 100px; display: flex; gap: 40px; justify-content: center;">
      <elx-popover position="left">
        <button slot="trigger">Left</button>
        <div>Left popover</div>
      </elx-popover>
      <elx-popover position="right">
        <button slot="trigger">Right</button>
        <div>Right popover</div>
      </elx-popover>
    </div>
  `,
};

export const Disabled: Story = {
  render: () => html`
    <elx-popover disabled>
      <button slot="trigger">Disabled</button>
      <div>You should not see this.</div>
    </elx-popover>
  `,
};

export const RichContent: Story = {
  render: () => html`
    <div style="padding: 100px; display: flex; justify-content: center;">
      <elx-popover position="bottom-start">
        <button slot="trigger">User info</button>
        <div>
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
            <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--elx-color-primary-500, #6366f1); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">J</div>
            <div>
              <div style="font-weight: 600;">Jane Doe</div>
              <div style="font-size: 13px; color: #666;">jane@example.com</div>
            </div>
          </div>
          <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 8px 0;">
          <div style="font-size: 14px; color: #666;">Member since 2024</div>
        </div>
      </elx-popover>
    </div>
  `,
};
