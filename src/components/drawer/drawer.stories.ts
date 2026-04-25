import type { Meta, StoryObj } from '@storybook/web-components';
import './drawer.js';

const meta: Meta = {
  title: 'Components/Drawer',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <button id="open-drawer">Open Drawer</button>
      <elx-drawer id="demo-drawer">
        <h3 slot="title">Drawer Title</h3>
        <p>This is the drawer content. You can put any content here.</p>
        <div slot="footer">
          <button onclick="document.getElementById('demo-drawer').close()">Close</button>
        </div>
      </elx-drawer>
    `;
    setTimeout(() => {
      container.querySelector('#open-drawer')?.addEventListener('click', () => {
        (container.querySelector('#demo-drawer') as any).show();
      });
    }, 0);
    return container;
  },
};

export const LeftPlacement: Story = {
  render: () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <button id="open-left">Open Left Drawer</button>
      <elx-drawer id="left-drawer" placement="left">
        <h3 slot="title">Left Drawer</h3>
        <p>This drawer slides in from the left.</p>
      </elx-drawer>
    `;
    setTimeout(() => {
      container.querySelector('#open-left')?.addEventListener('click', () => {
        (container.querySelector('#left-drawer') as any).show();
      });
    }, 0);
    return container;
  },
};

export const WithForm: Story = {
  render: () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <button id="open-form">Open Form Drawer</button>
      <elx-drawer id="form-drawer">
        <h3 slot="title">Edit Profile</h3>
        <form style="display: flex; flex-direction: column; gap: 1rem;">
          <label>
            Name
            <input type="text" placeholder="Enter your name" style="width: 100%; margin-top: 0.25rem;" />
          </label>
          <label>
            Email
            <input type="email" placeholder="Enter your email" style="width: 100%; margin-top: 0.25rem;" />
          </label>
        </form>
        <div slot="footer" style="display: flex; gap: 0.5rem;">
          <button onclick="document.getElementById('form-drawer').close()">Cancel</button>
          <button onclick="alert('Saved!')">Save</button>
        </div>
      </elx-drawer>
    `;
    setTimeout(() => {
      container.querySelector('#open-form')?.addEventListener('click', () => {
        (container.querySelector('#form-drawer') as any).show();
      });
    }, 0);
    return container;
  },
};
