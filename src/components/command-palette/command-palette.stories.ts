import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './command-palette.js';

const meta: Meta = {
  title: 'Components/CommandPalette',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A searchable command palette component for quick access to commands. Opens with Ctrl+K or programmatically.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const defaultCommands = [
  { id: 'new-file', label: 'New File', icon: '📄', shortcut: 'Ctrl+N', group: 'File' },
  { id: 'open-file', label: 'Open File', icon: '📂', shortcut: 'Ctrl+O', group: 'File' },
  { id: 'save', label: 'Save', icon: '💾', shortcut: 'Ctrl+S', group: 'File' },
  { id: 'save-as', label: 'Save As...', icon: '💾', shortcut: 'Ctrl+Shift+S', group: 'File' },
  { id: 'undo', label: 'Undo', icon: '↩', shortcut: 'Ctrl+Z', group: 'Edit' },
  { id: 'redo', label: 'Redo', icon: '↪', shortcut: 'Ctrl+Y', group: 'Edit' },
  { id: 'find', label: 'Find', icon: '🔍', shortcut: 'Ctrl+F', group: 'Edit' },
  { id: 'replace', label: 'Find and Replace', icon: '🔄', shortcut: 'Ctrl+H', group: 'Edit' },
  { id: 'toggle-sidebar', label: 'Toggle Sidebar', group: 'View' },
  { id: 'zoom-in', label: 'Zoom In', shortcut: 'Ctrl++', group: 'View' },
  { id: 'zoom-out', label: 'Zoom Out', shortcut: 'Ctrl+-', group: 'View' },
  { id: 'settings', label: 'Open Settings', icon: '⚙', group: 'Preferences' },
];

export const Default: Story = {
  render: () => {
    const setupPalette = () => {
      const palette = document.querySelector('#default-palette') as any;
      if (palette) {
        palette.items = defaultCommands;
      }
    };
    setTimeout(setupPalette, 0);
    return html`
      <p style="margin-bottom: 1rem; color: #64748b;">
        Press <kbd style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-family: monospace;">Ctrl+K</kbd> 
        to open the command palette, or click the button below.
      </p>
      <button 
        onclick="document.querySelector('#default-palette').show()"
        style="padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px;">
        Open Command Palette
      </button>
      <elx-command-palette id="default-palette"></elx-command-palette>
    `;
  },
};

export const WithCustomPlaceholder: Story = {
  render: () => {
    const setupPalette = () => {
      const palette = document.querySelector('#placeholder-palette') as any;
      if (palette) {
        palette.items = defaultCommands;
      }
    };
    setTimeout(setupPalette, 0);
    return html`
      <button 
        onclick="document.querySelector('#placeholder-palette').show()"
        style="padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px;">
        Open
      </button>
      <elx-command-palette id="placeholder-palette" placeholder="Type a command or search..."></elx-command-palette>
    `;
  },
};

export const MinimalCommands: Story = {
  render: () => {
    const minimalCommands = [
      { id: 'copy', label: 'Copy' },
      { id: 'paste', label: 'Paste' },
      { id: 'cut', label: 'Cut' },
    ];
    const setupPalette = () => {
      const palette = document.querySelector('#minimal-palette') as any;
      if (palette) {
        palette.items = minimalCommands;
      }
    };
    setTimeout(setupPalette, 0);
    return html`
      <button 
        onclick="document.querySelector('#minimal-palette').show()"
        style="padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px;">
        Open Minimal Palette
      </button>
      <elx-command-palette id="minimal-palette"></elx-command-palette>
    `;
  },
};

export const WithDisabledCommands: Story = {
  render: () => {
    const commandsWithDisabled = [
      { id: 'undo', label: 'Undo', icon: '↩', shortcut: 'Ctrl+Z', group: 'Edit' },
      { id: 'redo', label: 'Redo (disabled)', icon: '↪', disabled: true, group: 'Edit' },
      { id: 'cut', label: 'Cut', icon: '✂', shortcut: 'Ctrl+X', group: 'Edit' },
      { id: 'copy', label: 'Copy', icon: '📋', shortcut: 'Ctrl+C', group: 'Edit' },
    ];
    const setupPalette = () => {
      const palette = document.querySelector('#disabled-palette') as any;
      if (palette) {
        palette.items = commandsWithDisabled;
      }
    };
    setTimeout(setupPalette, 0);
    return html`
      <button 
        onclick="document.querySelector('#disabled-palette').show()"
        style="padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px;">
        Open Palette with Disabled Command
      </button>
      <elx-command-palette id="disabled-palette"></elx-command-palette>
    `;
  },
};
