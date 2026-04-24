import { html } from 'lit';
import './tooltip';

export default {
  title: 'Components/Tooltip',
  tags: ['autodocs'],
  argTypes: {
    content: { control: 'text' },
    position: { control: { type: 'select' }, options: ['top', 'right', 'bottom', 'left'] },
  },
};

export const Default = () => html`
  <elx-tooltip content="This is a tooltip">
    <button>Hover me</button>
  </elx-tooltip>
`;

export const Positions = () => html`
  <div style="display: flex; gap: 32px; padding: 64px;">
    <elx-tooltip content="Top tooltip" position="top">
      <button>Top</button>
    </elx-tooltip>
    <elx-tooltip content="Right tooltip" position="right">
      <button>Right</button>
    </elx-tooltip>
    <elx-tooltip content="Bottom tooltip" position="bottom">
      <button>Bottom</button>
    </elx-tooltip>
    <elx-tooltip content="Left tooltip" position="left">
      <button>Left</button>
    </elx-tooltip>
  </div>
`;
