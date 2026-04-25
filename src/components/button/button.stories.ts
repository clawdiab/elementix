import { html } from 'lit';
import './button';

export default {
  title: 'Components/Button',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'danger', 'ghost'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
  },
};

const Template = ({ variant, size, disabled, label }: any) => html`
  <elx-button variant=${variant} size=${size} ?disabled=${disabled}>${label}</elx-button>
`;

export const Primary = Template.bind({});
(Primary as any).args = { variant: 'primary', size: 'md', disabled: false, label: 'Button' };

export const Secondary = Template.bind({});
(Secondary as any).args = { variant: 'secondary', size: 'md', disabled: false, label: 'Button' };

export const Danger = Template.bind({});
(Danger as any).args = { variant: 'danger', size: 'md', disabled: false, label: 'Delete' };

export const Ghost = Template.bind({});
(Ghost as any).args = { variant: 'ghost', size: 'md', disabled: false, label: 'Cancel' };

export const Small = Template.bind({});
(Small as any).args = { variant: 'primary', size: 'sm', disabled: false, label: 'Small' };

export const Large = Template.bind({});
(Large as any).args = { variant: 'primary', size: 'lg', disabled: false, label: 'Large' };

export const Disabled = Template.bind({});
(Disabled as any).args = { variant: 'primary', size: 'md', disabled: true, label: 'Disabled' };
