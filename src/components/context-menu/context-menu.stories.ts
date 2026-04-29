import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './context-menu.js';

const meta: Meta = {
  title: 'Components/ContextMenu',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A right-click context menu component. Right-click the trigger area to open.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <elx-context-menu label="Edit menu">
      <div style="padding: 2rem; border: 2px dashed #e2e8f0; border-radius: 0.5rem; text-align: center; color: #64748b; user-select: none;">
        Right-click here
      </div>
      <elx-context-menu-item value="copy">Copy</elx-context-menu-item>
      <elx-context-menu-item value="cut">Cut</elx-context-menu-item>
      <elx-context-menu-item value="paste">Paste</elx-context-menu-item>
      <elx-context-menu-divider></elx-context-menu-divider>
      <elx-context-menu-item value="delete">Delete</elx-context-menu-item>
    </elx-context-menu>
  `,
};

export const WithDisabledItems: Story = {
  render: () => html`
    <elx-context-menu label="Edit menu">
      <div style="padding: 2rem; border: 2px dashed #e2e8f0; border-radius: 0.5rem; text-align: center; color: #64748b; user-select: none;">
        Right-click here
      </div>
      <elx-context-menu-item value="copy">Copy</elx-context-menu-item>
      <elx-context-menu-item value="cut" disabled>Cut (disabled)</elx-context-menu-item>
      <elx-context-menu-item value="paste" disabled>Paste (disabled)</elx-context-menu-item>
      <elx-context-menu-divider></elx-context-menu-divider>
      <elx-context-menu-item value="delete">Delete</elx-context-menu-item>
    </elx-context-menu>
  `,
};

export const WithIcons: Story = {
  render: () => html`
    <elx-context-menu label="Edit menu">
      <div style="padding: 2rem; border: 2px dashed #e2e8f0; border-radius: 0.5rem; text-align: center; color: #64748b; user-select: none;">
        Right-click here
      </div>
      <elx-context-menu-item value="copy">
        <span slot="prefix">📋</span>
        Copy
      </elx-context-menu-item>
      <elx-context-menu-item value="cut">
        <span slot="prefix">✂️</span>
        Cut
      </elx-context-menu-item>
      <elx-context-menu-item value="paste">
        <span slot="prefix">📌</span>
        Paste
      </elx-context-menu-item>
      <elx-context-menu-divider></elx-context-menu-divider>
      <elx-context-menu-item value="delete">
        <span slot="prefix">🗑️</span>
        Delete
      </elx-context-menu-item>
    </elx-context-menu>
  `,
};

export const WithShortcuts: Story = {
  render: () => html`
    <elx-context-menu label="Edit menu">
      <div style="padding: 2rem; border: 2px dashed #e2e8f0; border-radius: 0.5rem; text-align: center; color: #64748b; user-select: none;">
        Right-click here
      </div>
      <elx-context-menu-item value="copy">
        Copy
        <span slot="suffix" style="font-size: 0.75rem; color: #94a3b8;">⌘C</span>
      </elx-context-menu-item>
      <elx-context-menu-item value="cut">
        Cut
        <span slot="suffix" style="font-size: 0.75rem; color: #94a3b8;">⌘X</span>
      </elx-context-menu-item>
      <elx-context-menu-item value="paste">
        Paste
        <span slot="suffix" style="font-size: 0.75rem; color: #94a3b8;">⌘V</span>
      </elx-context-menu-item>
      <elx-context-menu-divider></elx-context-menu-divider>
      <elx-context-menu-item value="select-all">
        Select All
        <span slot="suffix" style="font-size: 0.75rem; color: #94a3b8;">⌘A</span>
      </elx-context-menu-item>
    </elx-context-menu>
  `,
};
