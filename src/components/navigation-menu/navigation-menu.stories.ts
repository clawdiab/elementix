import type { Meta, StoryObj } from '@storybook/web-components';
import './navigation-menu.js';

const meta: Meta = {
  title: 'Components/NavigationMenu',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => `
    <elx-navigation-menu>
      <elx-navigation-menu-item>
        <span slot="trigger">Home</span>
      </elx-navigation-menu-item>
      <elx-navigation-menu-item>
        <span slot="trigger">Products</span>
        <elx-navigation-menu-content>
          <a href="#" style="display: block; padding: 0.5rem 0.75rem; text-decoration: none; color: inherit;">Electronics</a>
          <a href="#" style="display: block; padding: 0.5rem 0.75rem; text-decoration: none; color: inherit;">Clothing</a>
          <a href="#" style="display: block; padding: 0.5rem 0.75rem; text-decoration: none; color: inherit;">Books</a>
        </elx-navigation-menu-content>
      </elx-navigation-menu-item>
      <elx-navigation-menu-item>
        <span slot="trigger">Services</span>
        <elx-navigation-menu-content>
          <a href="#" style="display: block; padding: 0.5rem 0.75rem; text-decoration: none; color: inherit;">Consulting</a>
          <a href="#" style="display: block; padding: 0.5rem 0.75rem; text-decoration: none; color: inherit;">Support</a>
        </elx-navigation-menu-content>
      </elx-navigation-menu-item>
      <elx-navigation-menu-item>
        <span slot="trigger">About</span>
      </elx-navigation-menu-item>
    </elx-navigation-menu>
  `,
};

export const WithIcons: Story = {
  render: () => `
    <elx-navigation-menu>
      <elx-navigation-menu-item>
        <span slot="trigger">🏠 Home</span>
      </elx-navigation-menu-item>
      <elx-navigation-menu-item>
        <span slot="trigger">📦 Products</span>
        <elx-navigation-menu-content>
          <a href="#" style="display: block; padding: 0.5rem 0.75rem; text-decoration: none; color: inherit;">⚡ Electronics</a>
          <a href="#" style="display: block; padding: 0.5rem 0.75rem; text-decoration: none; color: inherit;">👕 Clothing</a>
          <a href="#" style="display: block; padding: 0.5rem 0.75rem; text-decoration: none; color: inherit;">📚 Books</a>
        </elx-navigation-menu-content>
      </elx-navigation-menu-item>
      <elx-navigation-menu-item>
        <span slot="trigger">🛠️ Services</span>
        <elx-navigation-menu-content>
          <a href="#" style="display: block; padding: 0.5rem 0.75rem; text-decoration: none; color: inherit;">💼 Consulting</a>
          <a href="#" style="display: block; padding: 0.5rem 0.75rem; text-decoration: none; color: inherit;">🎧 Support</a>
        </elx-navigation-menu-content>
      </elx-navigation-menu-item>
      <elx-navigation-menu-item>
        <span slot="trigger">ℹ️ About</span>
      </elx-navigation-menu-item>
    </elx-navigation-menu>
  `,
};

export const NestedDropdowns: Story = {
  render: () => `
    <elx-navigation-menu>
      <elx-navigation-menu-item>
        <span slot="trigger">Developers</span>
        <elx-navigation-menu-content>
          <a href="#" style="display: block; padding: 0.5rem 0.75rem; text-decoration: none; color: inherit;">Documentation</a>
          <a href="#" style="display: block; padding: 0.5rem 0.75rem; text-decoration: none; color: inherit;">API Reference</a>
          <a href="#" style="display: block; padding: 0.5rem 0.75rem; text-decoration: none; color: inherit;">SDKs</a>
          <a href="#" style="display: block; padding: 0.5rem 0.75rem; text-decoration: none; color: inherit;">Code Examples</a>
        </elx-navigation-menu-content>
      </elx-navigation-menu-item>
      <elx-navigation-menu-item>
        <span slot="trigger">Company</span>
        <elx-navigation-menu-content>
          <a href="#" style="display: block; padding: 0.5rem 0.75rem; text-decoration: none; color: inherit;">About Us</a>
          <a href="#" style="display: block; padding: 0.5rem 0.75rem; text-decoration: none; color: inherit;">Blog</a>
          <a href="#" style="display: block; padding: 0.5rem 0.75rem; text-decoration: none; color: inherit;">Careers</a>
          <a href="#" style="display: block; padding: 0.5rem 0.75rem; text-decoration: none; color: inherit;">Contact</a>
        </elx-navigation-menu-content>
      </elx-navigation-menu-item>
      <elx-navigation-menu-item>
        <span slot="trigger">Resources</span>
        <elx-navigation-menu-content>
          <a href="#" style="display: block; padding: 0.5rem 0.75rem; text-decoration: none; color: inherit;">Guides</a>
          <a href="#" style="display: block; padding: 0.5rem 0.75rem; text-decoration: none; color: inherit;">Tutorials</a>
          <a href="#" style="display: block; padding: 0.5rem 0.75rem; text-decoration: none; color: inherit;">FAQ</a>
        </elx-navigation-menu-content>
      </elx-navigation-menu-item>
    </elx-navigation-menu>
  `,
};

export const Disabled: Story = {
  render: () => `
    <elx-navigation-menu>
      <elx-navigation-menu-item>
        <span slot="trigger">Home</span>
      </elx-navigation-menu-item>
      <elx-navigation-menu-item disabled>
        <span slot="trigger">Disabled Menu</span>
        <elx-navigation-menu-content>
          <a href="#" style="display: block; padding: 0.5rem 0.75rem; text-decoration: none; color: inherit;">This won't open</a>
        </elx-navigation-menu-content>
      </elx-navigation-menu-item>
      <elx-navigation-menu-item>
        <span slot="trigger">About</span>
      </elx-navigation-menu-item>
    </elx-navigation-menu>
  `,
};

export const RichContent: Story = {
  render: () => `
    <elx-navigation-menu>
      <elx-navigation-menu-item>
        <span slot="trigger">Solutions</span>
        <elx-navigation-menu-content style="min-width: 300px;">
          <div style="padding: 0.75rem;">
            <div style="margin-bottom: 1rem;">
              <strong style="display: block; margin-bottom: 0.5rem;">For Enterprise</strong>
              <a href="#" style="display: block; padding: 0.25rem 0; text-decoration: none; color: #0066cc; font-size: 0.875rem;">Large-scale deployments</a>
              <a href="#" style="display: block; padding: 0.25rem 0; text-decoration: none; color: #0066cc; font-size: 0.875rem;">Advanced security</a>
            </div>
            <div>
              <strong style="display: block; margin-bottom: 0.5rem;">For Startups</strong>
              <a href="#" style="display: block; padding: 0.25rem 0; text-decoration: none; color: #0066cc; font-size: 0.875rem;">Quick setup</a>
              <a href="#" style="display: block; padding: 0.25rem 0; text-decoration: none; color: #0066cc; font-size: 0.875rem;">Flexible pricing</a>
            </div>
          </div>
        </elx-navigation-menu-content>
      </elx-navigation-menu-item>
      <elx-navigation-menu-item>
        <span slot="trigger">Learn</span>
        <elx-navigation-menu-content style="min-width: 280px;">
          <div style="padding: 0.75rem;">
            <div style="margin-bottom: 0.75rem;">
              <a href="#" style="display: block; padding: 0.5rem; text-decoration: none; color: inherit; border-radius: 0.375rem; transition: background 0.15s;" onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background='transparent'">
                <strong>Getting Started</strong>
                <p style="margin: 0.25rem 0 0; font-size: 0.875rem; color: #666;">Learn the basics in 5 minutes</p>
              </a>
            </div>
            <div>
              <a href="#" style="display: block; padding: 0.5rem; text-decoration: none; color: inherit; border-radius: 0.375rem; transition: background 0.15s;" onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background='transparent'">
                <strong>Advanced Topics</strong>
                <p style="margin: 0.25rem 0 0; font-size: 0.875rem; color: #666;">Deep dive into features</p>
              </a>
            </div>
          </div>
        </elx-navigation-menu-content>
      </elx-navigation-menu-item>
    </elx-navigation-menu>
  `,
};

export const ManyItems: Story = {
  render: () => `
    <elx-navigation-menu>
      <elx-navigation-menu-item>
        <span slot="trigger">File</span>
        <elx-navigation-menu-content>
          <a href="#" style="display: block; padding: 0.5rem 0.75rem; text-decoration: none; color: inherit;">New</a>
          <a href="#" style="display: block; padding: 0.5rem 0.75rem; text-decoration: none; color: inherit;">Open</a>
          <a href="#" style="display: block; padding: 0.5rem 0.75rem; text-decoration: none; color: inherit;">Save</a>
          <a href="#" style="display: block; padding: 0.5rem 0.75rem; text-decoration: none; color: inherit;">Exit</a>
        </elx-navigation-menu-content>
      </elx-navigation-menu-item>
      <elx-navigation-menu-item>
        <span slot="trigger">Edit</span>
        <elx-navigation-menu-content>
          <a href="#" style="display: block; padding: 0.5rem 0.75rem; text-decoration: none; color: inherit;">Undo</a>
          <a href="#" style="display: block; padding: 0.5rem 0.75rem; text-decoration: none; color: inherit;">Redo</a>
          <a href="#" style="display: block; padding: 0.5rem 0.75rem; text-decoration: none; color: inherit;">Cut</a>
          <a href="#" style="display: block; padding: 0.5rem 0.75rem; text-decoration: none; color: inherit;">Copy</a>
          <a href="#" style="display: block; padding: 0.5rem 0.75rem; text-decoration: none; color: inherit;">Paste</a>
        </elx-navigation-menu-content>
      </elx-navigation-menu-item>
      <elx-navigation-menu-item>
        <span slot="trigger">View</span>
        <elx-navigation-menu-content>
          <a href="#" style="display: block; padding: 0.5rem 0.75rem; text-decoration: none; color: inherit;">Zoom In</a>
          <a href="#" style="display: block; padding: 0.5rem 0.75rem; text-decoration: none; color: inherit;">Zoom Out</a>
          <a href="#" style="display: block; padding: 0.5rem 0.75rem; text-decoration: none; color: inherit;">Reset</a>
        </elx-navigation-menu-content>
      </elx-navigation-menu-item>
      <elx-navigation-menu-item>
        <span slot="trigger">Help</span>
        <elx-navigation-menu-content>
          <a href="#" style="display: block; padding: 0.5rem 0.75rem; text-decoration: none; color: inherit;">Documentation</a>
          <a href="#" style="display: block; padding: 0.5rem 0.75rem; text-decoration: none; color: inherit;">About</a>
        </elx-navigation-menu-content>
      </elx-navigation-menu-item>
    </elx-navigation-menu>
  `,
};
