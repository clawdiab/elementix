import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './menubar.js';

const meta: Meta = {
  title: 'Components/Menubar',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A horizontal menu bar component with dropdown menus, keyboard navigation, and ARIA support.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <elx-menubar>
      <elx-menubar-menu label="File">
        <span slot="trigger">File</span>
        <elx-menubar-item value="new">New</elx-menubar-item>
        <elx-menubar-item value="open">Open</elx-menubar-item>
        <elx-menubar-separator></elx-menubar-separator>
        <elx-menubar-item value="save">Save</elx-menubar-item>
        <elx-menubar-item value="save-as">Save As...</elx-menubar-item>
        <elx-menubar-separator></elx-menubar-separator>
        <elx-menubar-item value="exit">Exit</elx-menubar-item>
      </elx-menubar-menu>
      <elx-menubar-menu label="Edit">
        <span slot="trigger">Edit</span>
        <elx-menubar-item value="undo">Undo</elx-menubar-item>
        <elx-menubar-item value="redo">Redo</elx-menubar-item>
        <elx-menubar-separator></elx-menubar-separator>
        <elx-menubar-item value="cut">Cut</elx-menubar-item>
        <elx-menubar-item value="copy">Copy</elx-menubar-item>
        <elx-menubar-item value="paste">Paste</elx-menubar-item>
      </elx-menubar-menu>
      <elx-menubar-menu label="View">
        <span slot="trigger">View</span>
        <elx-menubar-item value="zoom-in">Zoom In</elx-menubar-item>
        <elx-menubar-item value="zoom-out">Zoom Out</elx-menubar-item>
        <elx-menubar-separator></elx-menubar-separator>
        <elx-menubar-item value="fullscreen">Fullscreen</elx-menubar-item>
      </elx-menubar-menu>
    </elx-menubar>
  `,
};

export const WithDisabledItems: Story = {
  render: () => html`
    <elx-menubar>
      <elx-menubar-menu label="File">
        <span slot="trigger">File</span>
        <elx-menubar-item value="new">New</elx-menubar-item>
        <elx-menubar-item value="open">Open</elx-menubar-item>
        <elx-menubar-item value="save" disabled>Save (disabled)</elx-menubar-item>
      </elx-menubar-menu>
      <elx-menubar-menu label="Edit" disabled>
        <span slot="trigger">Edit (disabled)</span>
        <elx-menubar-item value="undo">Undo</elx-menubar-item>
      </elx-menubar-menu>
    </elx-menubar>
  `,
};

export const WithShortcuts: Story = {
  render: () => html`
    <elx-menubar>
      <elx-menubar-menu label="File">
        <span slot="trigger">File</span>
        <elx-menubar-item value="new">
          New
          <span slot="suffix" style="font-size: 0.75rem; color: #94a3b8;">⌘N</span>
        </elx-menubar-item>
        <elx-menubar-item value="open">
          Open
          <span slot="suffix" style="font-size: 0.75rem; color: #94a3b8;">⌘O</span>
        </elx-menubar-item>
        <elx-menubar-separator></elx-menubar-separator>
        <elx-menubar-item value="save">
          Save
          <span slot="suffix" style="font-size: 0.75rem; color: #94a3b8;">⌘S</span>
        </elx-menubar-item>
      </elx-menubar-menu>
      <elx-menubar-menu label="Edit">
        <span slot="trigger">Edit</span>
        <elx-menubar-item value="undo">
          Undo
          <span slot="suffix" style="font-size: 0.75rem; color: #94a3b8;">⌘Z</span>
        </elx-menubar-item>
        <elx-menubar-item value="redo">
          Redo
          <span slot="suffix" style="font-size: 0.75rem; color: #94a3b8;">⇧⌘Z</span>
        </elx-menubar-item>
      </elx-menubar-menu>
    </elx-menubar>
  `,
};
