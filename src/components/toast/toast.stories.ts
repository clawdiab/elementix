import type { Meta, StoryObj } from '@storybook/web-components';
import './toast.js';

const meta: Meta = {
  title: 'Components/Toast',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Info: Story = {
  render: () => {
    const container = document.createElement('elx-toast-container');
    const toast = document.createElement('elx-toast') as any;
    toast.setAttribute('variant', 'info');
    toast.textContent = 'This is an info message';
    container.appendChild(toast);
    setTimeout(() => toast.show(), 100);
    return container;
  },
};

export const Success: Story = {
  render: () => {
    const container = document.createElement('elx-toast-container');
    const toast = document.createElement('elx-toast') as any;
    toast.setAttribute('variant', 'success');
    toast.textContent = 'Operation completed successfully!';
    container.appendChild(toast);
    setTimeout(() => toast.show(), 100);
    return container;
  },
};

export const Warning: Story = {
  render: () => {
    const container = document.createElement('elx-toast-container');
    const toast = document.createElement('elx-toast') as any;
    toast.setAttribute('variant', 'warning');
    toast.textContent = 'Please review before continuing';
    container.appendChild(toast);
    setTimeout(() => toast.show(), 100);
    return container;
  },
};

export const Error: Story = {
  render: () => {
    const container = document.createElement('elx-toast-container');
    const toast = document.createElement('elx-toast') as any;
    toast.setAttribute('variant', 'error');
    toast.textContent = 'Something went wrong. Please try again.';
    container.appendChild(toast);
    setTimeout(() => toast.show(), 100);
    return container;
  },
};

export const Dismissible: Story = {
  render: () => {
    const container = document.createElement('elx-toast-container');
    const toast = document.createElement('elx-toast') as any;
    toast.setAttribute('variant', 'info');
    toast.setAttribute('dismissible', '');
    toast.textContent = 'Click the X to dismiss';
    container.appendChild(toast);
    setTimeout(() => toast.show(), 100);
    return container;
  },
};

export const AutoDismiss: Story = {
  render: () => {
    const container = document.createElement('elx-toast-container');
    const toast = document.createElement('elx-toast') as any;
    toast.setAttribute('variant', 'success');
    toast.setAttribute('duration', '3000');
    toast.textContent = 'This will auto-dismiss in 3 seconds';
    container.appendChild(toast);
    setTimeout(() => toast.show(), 100);
    return container;
  },
};

export const ContainerPositions: Story = {
  render: () => {
    const div = document.createElement('div');
    div.innerHTML = `
      <p style="margin-bottom: 16px; font-family: sans-serif;">
        Positions: top-right (default), top-left, top-center, bottom-right, bottom-left, bottom-center
      </p>
    `;
    
    const container = document.createElement('elx-toast-container') as any;
    container.position = 'bottom-right';
    const toast = document.createElement('elx-toast') as any;
    toast.setAttribute('variant', 'info');
    toast.setAttribute('dismissible', '');
    toast.textContent = 'Bottom-right positioned toast';
    container.appendChild(toast);
    setTimeout(() => toast.show(), 100);
    
    div.appendChild(container);
    return div;
  },
};

export const ImperativeAPI: Story = {
  render: () => {
    const div = document.createElement('div');
    div.innerHTML = `
      <div style="display: flex; gap: 8px; margin-bottom: 16px; font-family: sans-serif;">
        <button id="info-btn">Info</button>
        <button id="success-btn">Success</button>
        <button id="warning-btn">Warning</button>
        <button id="error-btn">Error</button>
      </div>
    `;
    
    const container = document.createElement('elx-toast-container') as any;
    div.appendChild(container);
    
    setTimeout(() => {
      div.querySelector('#info-btn')?.addEventListener('click', () => {
        container.toast('Info message', { variant: 'info' });
      });
      div.querySelector('#success-btn')?.addEventListener('click', () => {
        container.toast('Success!', { variant: 'success' });
      });
      div.querySelector('#warning-btn')?.addEventListener('click', () => {
        container.toast('Warning!', { variant: 'warning' });
      });
      div.querySelector('#error-btn')?.addEventListener('click', () => {
        container.toast('Error!', { variant: 'error' });
      });
    }, 0);
    
    return div;
  },
};
