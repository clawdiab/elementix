import type { Meta, StoryObj } from '@storybook/web-components';
import './hover-card.js';

const meta: Meta = {
  title: 'Components/HoverCard',
  tags: ['autodocs'],
  argTypes: {
    position: {
      control: 'select',
      options: ['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'right'],
    },
    'open-delay': { control: 'number' },
    'close-delay': { control: 'number' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => `
    <elx-hover-card>
      <button slot="trigger">Hover me</button>
      <div>
        <strong>Preview Card</strong>
        <p style="margin: 8px 0 0; color: #666;">This is a hover card with rich content that appears on hover.</p>
      </div>
    </elx-hover-card>
  `,
};

export const UserProfile: Story = {
  render: () => `
    <elx-hover-card>
      <a href="#" slot="trigger" style="color: #0066cc; text-decoration: underline;">@johndoe</a>
      <div style="display: flex; gap: 12px; align-items: flex-start;">
        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=johndoe" alt="John Doe avatar" width="48" height="48" style="border-radius: 50%;" />
        <div>
          <strong>John Doe</strong>
          <p style="margin: 4px 0; color: #666; font-size: 14px;">Full-stack developer. Open source enthusiast.</p>
          <div style="display: flex; gap: 16px; font-size: 12px; color: #999;">
            <span>42 repos</span>
            <span>128 followers</span>
          </div>
        </div>
      </div>
    </elx-hover-card>
  `,
};

export const LinkPreview: Story = {
  render: () => `
    <p style="line-height: 1.8;">
      Check out the 
      <elx-hover-card position="top">
        <a href="https://developer.mozilla.org" slot="trigger" style="color: #0066cc;">MDN Web Docs</a>
        <div>
          <strong>MDN Web Docs</strong>
          <p style="margin: 8px 0; color: #666; font-size: 14px;">Resources for developers, by developers. Documentation for web technologies including HTML, CSS, and JavaScript.</p>
          <span style="font-size: 12px; color: #999;">developer.mozilla.org</span>
        </div>
      </elx-hover-card>
      for web development references.
    </p>
  `,
};

export const PositionTop: Story = {
  render: () => `
    <div style="padding-top: 200px;">
      <elx-hover-card position="top">
        <button slot="trigger">Hover (top)</button>
        <div>
          <strong>Top Position</strong>
          <p style="margin: 8px 0 0; color: #666;">Card appears above the trigger.</p>
        </div>
      </elx-hover-card>
    </div>
  `,
};

export const PositionLeft: Story = {
  render: () => `
    <div style="padding-left: 300px;">
      <elx-hover-card position="left">
        <button slot="trigger">Hover (left)</button>
        <div>
          <strong>Left Position</strong>
          <p style="margin: 8px 0 0; color: #666;">Card appears to the left.</p>
        </div>
      </elx-hover-card>
    </div>
  `,
};

export const PositionRight: Story = {
  render: () => `
    <elx-hover-card position="right">
      <button slot="trigger">Hover (right)</button>
      <div>
        <strong>Right Position</strong>
        <p style="margin: 8px 0 0; color: #666;">Card appears to the right.</p>
      </div>
    </elx-hover-card>
  `,
};

export const CustomDelay: Story = {
  render: () => `
    <elx-hover-card open-delay="500" close-delay="1000">
      <button slot="trigger">Slow hover (500ms open, 1s close)</button>
      <div>
        <strong>Custom Delays</strong>
        <p style="margin: 8px 0 0; color: #666;">This card has a longer open delay and an even longer close delay.</p>
      </div>
    </elx-hover-card>
  `,
};

export const Disabled: Story = {
  render: () => `
    <elx-hover-card disabled>
      <button slot="trigger">Hover me (disabled)</button>
      <div>
        <p>This content will not appear.</p>
      </div>
    </elx-hover-card>
  `,
};

export const RichContent: Story = {
  render: () => `
    <elx-hover-card>
      <button slot="trigger" style="padding: 8px 16px; border-radius: 6px; border: 1px solid #ddd; background: white; cursor: pointer;">
        View Product
      </button>
      <div style="width: 280px;">
        <img src="https://picsum.photos/280/140" alt="Product preview image" style="width: 100%; border-radius: 4px; margin-bottom: 8px;" />
        <strong>Wireless Headphones</strong>
        <p style="margin: 4px 0; color: #666; font-size: 14px;">Premium noise-cancelling headphones with 30-hour battery life.</p>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
          <span style="font-weight: bold; font-size: 18px;">$299</span>
          <span style="color: #22c55e; font-size: 12px;">In Stock</span>
        </div>
      </div>
    </elx-hover-card>
  `,
};

export const InlineText: Story = {
  render: () => `
    <p style="line-height: 2; max-width: 500px;">
      The project was started by 
      <elx-hover-card>
        <a href="#" slot="trigger" style="color: #0066cc; text-decoration: underline;">Alice</a>
        <div style="display: flex; gap: 12px;">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=alice" alt="Alice avatar" width="40" height="40" style="border-radius: 50%;" />
          <div>
            <strong>Alice Chen</strong>
            <p style="margin: 2px 0 0; color: #666; font-size: 13px;">Lead Engineer · San Francisco</p>
          </div>
        </div>
      </elx-hover-card>
      and later joined by 
      <elx-hover-card>
        <a href="#" slot="trigger" style="color: #0066cc; text-decoration: underline;">Bob</a>
        <div style="display: flex; gap: 12px;">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=bob" alt="Bob avatar" width="40" height="40" style="border-radius: 50%;" />
          <div>
            <strong>Bob Martinez</strong>
            <p style="margin: 2px 0 0; color: #666; font-size: 13px;">Senior Developer · Austin</p>
          </div>
        </div>
      </elx-hover-card>
      to build the design system.
    </p>
  `,
};
