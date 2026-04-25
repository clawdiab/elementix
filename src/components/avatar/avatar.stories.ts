import type { Meta, StoryObj } from '@storybook/web-components';
import './avatar.js';

const meta: Meta = {
  title: 'Components/Avatar',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const WithImage: Story = {
  render: () => `<elx-avatar src="https://i.pravatar.cc/150?img=1" alt="User"></elx-avatar>`,
};

export const WithInitials: Story = {
  render: () => `<elx-avatar name="John Doe"></elx-avatar>`,
};

export const SingleName: Story = {
  render: () => `<elx-avatar name="John"></elx-avatar>`,
};

export const Sizes: Story = {
  render: () => `
    <elx-avatar name="XS" size="xs"></elx-avatar>
    <elx-avatar name="SM" size="sm"></elx-avatar>
    <elx-avatar name="MD" size="md"></elx-avatar>
    <elx-avatar name="LG" size="lg"></elx-avatar>
    <elx-avatar name="XL" size="xl"></elx-avatar>
  `,
};
