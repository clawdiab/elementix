import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './form-field.js';

const formFieldMeta: Meta = {
  title: 'Components/FormField',
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    'helper-text': { control: 'text' },
    'error-text': { control: 'text' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};
export default formFieldMeta;

type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <elx-form-field
      label=${args.label ?? 'Email Address'}
      helper-text=${args['helper-text'] ?? 'We will never share your email'}
      error-text=${args['error-text'] ?? ''}
      size=${args.size ?? 'md'}
      ?required=${args.required}
      ?disabled=${args.disabled}
    >
      <input type="email" placeholder="you@example.com" style="padding: 8px; border: 1px solid #d4d4d4; border-radius: 6px;" />
    </elx-form-field>
  `,
};

export const Required: Story = {
  render: () => html`
    <elx-form-field label="Username" required helper-text="Choose a unique username">
      <input type="text" placeholder="johndoe" style="padding: 8px; border: 1px solid #d4d4d4; border-radius: 6px;" />
    </elx-form-field>
  `,
};

export const WithError: Story = {
  render: () => html`
    <elx-form-field label="Password" required error-text="Password must be at least 8 characters">
      <input type="password" value="123" style="padding: 8px; border: 1px solid #ef4444; border-radius: 6px;" />
    </elx-form-field>
  `,
};

export const Disabled: Story = {
  render: () => html`
    <elx-form-field label="Full Name" disabled helper-text="This field cannot be edited">
      <input type="text" value="John Doe" disabled style="padding: 8px; border: 1px solid #d4d4d4; border-radius: 6px; opacity: 0.5;" />
    </elx-form-field>
  `,
};

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <elx-form-field label="Small" size="sm" helper-text="Helper text">
        <input type="text" style="padding: 6px; font-size: 12px; border: 1px solid #d4d4d4; border-radius: 6px;" />
      </elx-form-field>
      <elx-form-field label="Medium" size="md" helper-text="Helper text">
        <input type="text" style="padding: 8px; font-size: 14px; border: 1px solid #d4d4d4; border-radius: 6px;" />
      </elx-form-field>
      <elx-form-field label="Large" size="lg" helper-text="Helper text">
        <input type="text" style="padding: 10px; font-size: 16px; border: 1px solid #d4d4d4; border-radius: 6px;" />
      </elx-form-field>
    </div>
  `,
};

export const FormExample: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
      <elx-form-field label="First Name" required>
        <input type="text" style="padding: 8px; border: 1px solid #d4d4d4; border-radius: 6px;" />
      </elx-form-field>
      <elx-form-field label="Email" required helper-text="We'll send a confirmation to this address">
        <input type="email" style="padding: 8px; border: 1px solid #d4d4d4; border-radius: 6px;" />
      </elx-form-field>
      <elx-form-field label="Bio" helper-text="Max 500 characters">
        <textarea rows="3" style="padding: 8px; border: 1px solid #d4d4d4; border-radius: 6px; resize: vertical;"></textarea>
      </elx-form-field>
    </div>
  `,
};
