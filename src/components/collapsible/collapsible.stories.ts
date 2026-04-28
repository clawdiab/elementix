import type { Meta, StoryObj } from '@storybook/web-components';
import './collapsible.js';

const meta: Meta = {
  title: 'Components/Collapsible',
  component: 'elx-collapsible',
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Whether the collapsible is expanded',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the collapsible is disabled',
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible label for the trigger',
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => `
    <elx-collapsible>
      <span slot="trigger">Click to expand</span>
      <div slot="content">
        <p>This is the collapsible content. It can contain any HTML elements.</p>
        <p>You can add paragraphs, lists, images, or any other content here.</p>
      </div>
    </elx-collapsible>
  `,
};

export const Open: Story = {
  render: () => `
    <elx-collapsible open>
      <span slot="trigger">Expanded by default</span>
      <div slot="content">
        <p>This collapsible starts in the open state.</p>
      </div>
    </elx-collapsible>
  `,
};

export const Disabled: Story = {
  render: () => `
    <elx-collapsible disabled>
      <span slot="trigger">Cannot expand</span>
      <div slot="content">
        <p>This content is not accessible because the collapsible is disabled.</p>
      </div>
    </elx-collapsible>
  `,
};

export const WithCustomLabel: Story = {
  render: () => `
    <elx-collapsible aria-label="Show more details">
      <span slot="trigger">More Details</span>
      <div slot="content">
        <p>Additional information with custom aria-label for accessibility.</p>
      </div>
    </elx-collapsible>
  `,
};

export const Multiple: Story = {
  render: () => `
    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
      <elx-collapsible>
        <span slot="trigger">Section 1</span>
        <div slot="content">
          <p>Content for section 1.</p>
        </div>
      </elx-collapsible>
      <elx-collapsible>
        <span slot="trigger">Section 2</span>
        <div slot="content">
          <p>Content for section 2.</p>
        </div>
      </elx-collapsible>
      <elx-collapsible>
        <span slot="trigger">Section 3</span>
        <div slot="content">
          <p>Content for section 3.</p>
        </div>
      </elx-collapsible>
    </div>
  `,
};

export const RichContent: Story = {
  render: () => `
    <elx-collapsible>
      <span slot="trigger">View Profile</span>
      <div slot="content">
        <div style="display: flex; align-items: center; gap: 1rem;">
          <div style="width: 48px; height: 48px; border-radius: 50%; background: #e2e8f0; display: flex; align-items: center; justify-content: center;">
            👤
          </div>
          <div>
            <strong>John Doe</strong>
            <p style="margin: 0; color: #64748b;">Software Engineer</p>
          </div>
        </div>
        <ul style="margin-top: 1rem; padding-left: 1.25rem;">
          <li>5 years of experience</li>
          <li>Specializes in frontend development</li>
          <li>Based in San Francisco</li>
        </ul>
      </div>
    </elx-collapsible>
  `,
};

export const CustomStyled: Story = {
  render: () => `
    <style>
      elx-collapsible.custom {
        --elx-collapsible-trigger-bg: #f1f5f9;
        --elx-collapsible-trigger-border: 1px solid #94a3b8;
        --elx-collapsible-trigger-radius: 0.5rem;
        --elx-collapsible-trigger-hover-bg: #e2e8f0;
        --elx-collapsible-content-bg: #f8fafc;
        --elx-collapsible-content-border: 1px solid #94a3b8;
        --elx-collapsible-content-radius: 0 0 0.5rem 0.5rem;
      }
    </style>
    <elx-collapsible class="custom">
      <span slot="trigger">Custom Styled Collapsible</span>
      <div slot="content">
        <p>This collapsible uses CSS custom properties for styling.</p>
      </div>
    </elx-collapsible>
  `,
};
