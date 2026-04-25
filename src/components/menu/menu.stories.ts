import type { Meta, StoryObj } from '@storybook/web-components';
import './menu.js';

const meta: Meta = {
  title: 'Components/Menu',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => `
    <elx-menu>
      <elx-menu-item>Cut</elx-menu-item>
      <elx-menu-item>Copy</elx-menu-item>
      <elx-menu-item>Paste</elx-menu-item>
    </elx-menu>
  `,
};

export const WithDividers: Story = {
  render: () => `
    <elx-menu>
      <elx-menu-item>Undo</elx-menu-item>
      <elx-menu-item>Redo</elx-menu-item>
      <elx-menu-divider></elx-menu-divider>
      <elx-menu-item>Cut</elx-menu-item>
      <elx-menu-item>Copy</elx-menu-item>
      <elx-menu-item>Paste</elx-menu-item>
    </elx-menu>
  `,
};

export const WithGroups: Story = {
  render: () => `
    <elx-menu>
      <elx-menu-group label="File">
        <elx-menu-item>New</elx-menu-item>
        <elx-menu-item>Open</elx-menu-item>
        <elx-menu-item>Save</elx-menu-item>
      </elx-menu-group>
      <elx-menu-divider></elx-menu-divider>
      <elx-menu-group label="Edit">
        <elx-menu-item>Undo</elx-menu-item>
        <elx-menu-item>Redo</elx-menu-item>
      </elx-menu-group>
    </elx-menu>
  `,
};

export const WithDisabledItems: Story = {
  render: () => `
    <elx-menu>
      <elx-menu-item>Cut</elx-menu-item>
      <elx-menu-item disabled>Copy</elx-menu-item>
      <elx-menu-item>Paste</elx-menu-item>
      <elx-menu-item disabled>Delete</elx-menu-item>
    </elx-menu>
  `,
};

export const WithActiveItem: Story = {
  render: () => `
    <elx-menu>
      <elx-menu-item>Dashboard</elx-menu-item>
      <elx-menu-item active>Settings</elx-menu-item>
      <elx-menu-item>Profile</elx-menu-item>
    </elx-menu>
  `,
};
