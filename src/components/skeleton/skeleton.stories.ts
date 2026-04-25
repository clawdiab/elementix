import type { Meta, StoryObj } from '@storybook/web-components';
import './skeleton.js';

const meta: Meta = {
  title: 'Components/Skeleton',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => `
    <elx-skeleton style="--elx-skeleton-width: 300px"></elx-skeleton>
  `,
};

export const Text: Story = {
  render: () => `
    <div style="display: flex; flex-direction: column; gap: 8px; width: 300px;">
      <elx-skeleton variant="text" style="--elx-skeleton-width: 100%"></elx-skeleton>
      <elx-skeleton variant="text" style="--elx-skeleton-width: 80%"></elx-skeleton>
      <elx-skeleton variant="text" style="--elx-skeleton-width: 60%"></elx-skeleton>
    </div>
  `,
};

export const Circle: Story = {
  render: () => `
    <elx-skeleton variant="circle" style="--elx-skeleton-height: 48px"></elx-skeleton>
  `,
};

export const CardPlaceholder: Story = {
  render: () => `
    <div style="display: flex; flex-direction: column; gap: 12px; width: 300px; padding: 16px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <elx-skeleton variant="circle" style="--elx-skeleton-height: 40px"></elx-skeleton>
      <elx-skeleton variant="text" style="--elx-skeleton-width: 60%; --elx-skeleton-height: 1.25rem"></elx-skeleton>
      <elx-skeleton variant="text"></elx-skeleton>
      <elx-skeleton variant="text" style="--elx-skeleton-width: 80%"></elx-skeleton>
      <elx-skeleton style="--elx-skeleton-height: 200px; --elx-skeleton-radius: 8px"></elx-skeleton>
    </div>
  `,
};

export const NoAnimation: Story = {
  render: () => `
    <elx-skeleton style="--elx-skeleton-width: 300px" aria-label="Static placeholder"></elx-skeleton>
  `,
  play: async ({ canvasElement }: any) => {
    const el = canvasElement.querySelector('elx-skeleton');
    el.animated = false;
  },
};
