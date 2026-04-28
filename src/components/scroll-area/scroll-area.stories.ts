import type { Meta, StoryObj } from '@storybook/web-components';
import './scroll-area.js';

const meta: Meta = {
  title: 'Components/ScrollArea',
  component: 'elx-scroll-area',
  tags: ['autodocs'],
  argTypes: {
    'scrollbar-x': {
      control: 'select',
      options: ['auto', 'always', 'scroll', 'hover'],
      description: 'Horizontal scrollbar visibility',
    },
    'scrollbar-y': {
      control: 'select',
      options: ['auto', 'always', 'scroll', 'hover'],
      description: 'Vertical scrollbar visibility',
    },
    'scroll-hide-delay': {
      control: 'number',
      description: 'Delay in ms before hiding scrollbars (auto mode)',
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => `
    <elx-scroll-area style="width: 300px; height: 200px; border: 1px solid #e2e8f0; border-radius: 0.375rem;">
      <div style="padding: 1rem;">
        <p>Scroll down to see more content...</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
        <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.</p>
        <p>Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
        <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.</p>
      </div>
    </elx-scroll-area>
  `,
};

export const HorizontalScroll: Story = {
  render: () => `
    <elx-scroll-area style="width: 300px; height: 100px; border: 1px solid #e2e8f0; border-radius: 0.375rem;">
      <div style="display: flex; gap: 1rem; padding: 1rem; width: max-content;">
        <div style="width: 150px; height: 60px; background: #f1f5f9; border-radius: 0.25rem; display: flex; align-items: center; justify-content: center;">Card 1</div>
        <div style="width: 150px; height: 60px; background: #f1f5f9; border-radius: 0.25rem; display: flex; align-items: center; justify-content: center;">Card 2</div>
        <div style="width: 150px; height: 60px; background: #f1f5f9; border-radius: 0.25rem; display: flex; align-items: center; justify-content: center;">Card 3</div>
        <div style="width: 150px; height: 60px; background: #f1f5f9; border-radius: 0.25rem; display: flex; align-items: center; justify-content: center;">Card 4</div>
        <div style="width: 150px; height: 60px; background: #f1f5f9; border-radius: 0.25rem; display: flex; align-items: center; justify-content: center;">Card 5</div>
      </div>
    </elx-scroll-area>
  `,
};

export const BothScrollbars: Story = {
  render: () => `
    <elx-scroll-area style="width: 300px; height: 200px; border: 1px solid #e2e8f0; border-radius: 0.375rem;">
      <div style="padding: 1rem; width: 500px;">
        <p>This content is wider and taller than the container.</p>
        <p>Both horizontal and vertical scrollbars should appear.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        <p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.</p>
        <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui.</p>
        <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem.</p>
      </div>
    </elx-scroll-area>
  `,
};

export const AlwaysVisible: Story = {
  render: () => `
    <elx-scroll-area scrollbar-x="always" scrollbar-y="always" style="width: 300px; height: 200px; border: 1px solid #e2e8f0; border-radius: 0.375rem;">
      <div style="padding: 1rem;">
        <p>Scrollbars are always visible in this mode.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        <p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.</p>
      </div>
    </elx-scroll-area>
  `,
};

export const CustomStyled: Story = {
  render: () => `
    <style>
      elx-scroll-area.custom {
        --elx-scroll-area-scrollbar-bg: rgba(59, 130, 246, 0.2);
        --elx-scroll-area-scrollbar-radius: 8px;
        --elx-scroll-area-scrollbar-size: 10px;
        --elx-scroll-area-thumb-bg: rgba(59, 130, 246, 0.6);
        --elx-scroll-area-thumb-hover-bg: rgba(59, 130, 246, 0.8);
        --elx-scroll-area-thumb-radius: 8px;
      }
    </style>
    <elx-scroll-area class="custom" style="width: 300px; height: 200px; border: 1px solid #e2e8f0; border-radius: 0.375rem;">
      <div style="padding: 1rem;">
        <p>Custom styled scrollbars using CSS custom properties.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        <p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.</p>
        <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui.</p>
      </div>
    </elx-scroll-area>
  `,
};

export const ChatInterface: Story = {
  render: () => `
    <div style="width: 350px; border: 1px solid #e2e8f0; border-radius: 0.5rem; overflow: hidden;">
      <div style="padding: 0.75rem; background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-weight: 500;">
        Chat Room
      </div>
      <elx-scroll-area style="height: 300px;">
        <div style="padding: 1rem; display: flex; flex-direction: column; gap: 0.75rem;">
          <div style="display: flex; gap: 0.5rem;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: #e2e8f0; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">A</div>
            <div>
              <div style="font-size: 0.75rem; color: #64748b;">Alice · 2:30 PM</div>
              <div style="background: #f1f5f9; padding: 0.5rem 0.75rem; border-radius: 0.5rem; margin-top: 0.25rem;">Hey everyone! 👋</div>
            </div>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: #e2e8f0; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">B</div>
            <div>
              <div style="font-size: 0.75rem; color: #64748b;">Bob · 2:31 PM</div>
              <div style="background: #f1f5f9; padding: 0.5rem 0.75rem; border-radius: 0.5rem; margin-top: 0.25rem;">Hi Alice! How's it going?</div>
            </div>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: #e2e8f0; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">A</div>
            <div>
              <div style="font-size: 0.75rem; color: #64748b;">Alice · 2:32 PM</div>
              <div style="background: #f1f5f9; padding: 0.5rem 0.75rem; border-radius: 0.5rem; margin-top: 0.25rem;">Pretty good! Working on that new project.</div>
            </div>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: #e2e8f0; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">C</div>
            <div>
              <div style="font-size: 0.75rem; color: #64748b;">Charlie · 2:33 PM</div>
              <div style="background: #f1f5f9; padding: 0.5rem 0.75rem; border-radius: 0.5rem; margin-top: 0.25rem;">Nice! Let me know if you need help.</div>
            </div>
          </div>
        </div>
      </elx-scroll-area>
      <div style="padding: 0.75rem; border-top: 1px solid #e2e8f0;">
        <input type="text" placeholder="Type a message..." style="width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #e2e8f0; border-radius: 0.375rem; outline: none;">
      </div>
    </div>
  `,
};
