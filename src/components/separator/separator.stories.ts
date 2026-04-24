import { html } from 'lit';
import './separator';

export default {
  title: 'Components/Separator',
  tags: ['autodocs'],
  argTypes: {
    orientation: { 
      control: { type: 'select' }, 
      options: ['horizontal', 'vertical'] 
    },
  },
};

export const Horizontal = () => html`
  <div>
    <p>Content above</p>
    <elx-separator></elx-separator>
    <p>Content below</p>
  </div>
`;

export const Vertical = () => html`
  <div style="display: flex; align-items: center; height: 40px;">
    <span>Left</span>
    <elx-separator orientation="vertical" style="height: 24px;"></elx-separator>
    <span>Right</span>
  </div>
`;
