import { html } from 'lit';
import './badge';

export default {
  title: 'Components/Badge',
  tags: ['autodocs'],
  argTypes: {
    variant: { control: { type: 'select' }, options: ['solid', 'soft', 'outline'] },
    color: { control: { type: 'select' }, options: ['gray', 'red', 'green', 'blue', 'yellow', 'purple'] },
    size: { control: { type: 'select' }, options: ['sm', 'md', 'lg'] },
    text: { control: 'text' }
  }
};

const Template = ({ variant, color, size, text }: any) => html`
  <elx-badge variant=${variant} color=${color} size=${size}>${text}</elx-badge>
`;

export const Default = Template.bind({});
(Default as any).args = { variant: 'solid', color: 'gray', size: 'md', text: 'Badge' };

export const Colors = () => html`
  <div style="display:flex;gap:8px;flex-wrap:wrap">
    <elx-badge color="gray">Gray</elx-badge>
    <elx-badge color="red">Red</elx-badge>
    <elx-badge color="green">Green</elx-badge>
    <elx-badge color="blue">Blue</elx-badge>
    <elx-badge color="yellow">Yellow</elx-badge>
    <elx-badge color="purple">Purple</elx-badge>
  </div>
`;

export const Soft = () => html`
  <div style="display:flex;gap:8px;flex-wrap:wrap">
    <elx-badge variant="soft" color="gray">Gray</elx-badge>
    <elx-badge variant="soft" color="red">Red</elx-badge>
    <elx-badge variant="soft" color="green">Green</elx-badge>
    <elx-badge variant="soft" color="blue">Blue</elx-badge>
    <elx-badge variant="soft" color="yellow">Yellow</elx-badge>
    <elx-badge variant="soft" color="purple">Purple</elx-badge>
  </div>
`;

export const Outline = () => html`
  <div style="display:flex;gap:8px;flex-wrap:wrap">
    <elx-badge variant="outline" color="gray">Gray</elx-badge>
    <elx-badge variant="outline" color="red">Red</elx-badge>
    <elx-badge variant="outline" color="green">Green</elx-badge>
    <elx-badge variant="outline" color="blue">Blue</elx-badge>
    <elx-badge variant="outline" color="yellow">Yellow</elx-badge>
    <elx-badge variant="outline" color="purple">Purple</elx-badge>
  </div>
`;

export const Sizes = () => html`
  <div style="display:flex;gap:8px;align-items:center">
    <elx-badge size="sm" color="blue">Small</elx-badge>
    <elx-badge size="md" color="blue">Medium</elx-badge>
    <elx-badge size="lg" color="blue">Large</elx-badge>
  </div>
`;
