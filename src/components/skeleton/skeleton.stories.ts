import type { Meta, StoryObj } from '@storybook/web-components';
import './skeleton.js';

const meta: Meta = {
  title: 'Components/Skeleton',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => `<elx-skeleton width="200px" height="20px"></elx-skeleton>`,
};

export const Circle: Story = {
  render: () => `<elx-skeleton variant="circle" width="48px" height="48px"></elx-skeleton>`,
};

export const Text: Story = {
  render: () => `
    <div style="display:flex;flex-direction:column;gap:4px;width:300px">
      <elx-skeleton variant="text" height="16px"></elx-skeleton>
      <elx-skeleton variant="text" height="16px" width="80%"></elx-skeleton>
      <elx-skeleton variant="text" height="16px" width="60%"></elx-skeleton>
    </div>
  `,
};

export const Pulse: Story = {
  render: () => `<elx-skeleton animation="pulse" width="200px" height="20px"></elx-skeleton>`,
};

export const CardPlaceholder: Story = {
  render: () => `
    <div style="display:flex;gap:12px;align-items:center">
      <elx-skeleton variant="circle" width="48px" height="48px"></elx-skeleton>
      <div style="display:flex;flex-direction:column;gap:4px;flex:1">
        <elx-skeleton variant="text" height="16px" width="60%"></elx-skeleton>
        <elx-skeleton variant="text" height="14px" width="40%"></elx-skeleton>
      </div>
    </div>
  `,
};
