import { html } from 'lit';
import './switch';

export default {
  title: 'Components/Switch',
  tags: ['autodocs'],
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    size: { control: { type: 'select' }, options: ['sm', 'md', 'lg'] },
    label: { control: 'text' },
    name: { control: 'text' },
    value: { control: 'text' }
  }
};

const Template = ({ checked, disabled, size, label, name, value }: any) => html`
  <elx-switch
    ?checked=${checked}
    ?disabled=${disabled}
    size=${size}
    label=${label}
    name=${name}
    value=${value}
  ></elx-switch>
`;

export const Default = Template.bind({});
(Default as any).args = { checked: false, disabled: false, size: 'md', label: 'Dark mode', name: 'darkmode', value: 'on' };

export const Checked = Template.bind({});
(Checked as any).args = { checked: true, disabled: false, size: 'md', label: 'Enabled', name: '', value: 'on' };

export const Disabled = Template.bind({});
(Disabled as any).args = { checked: false, disabled: true, size: 'md', label: 'Disabled', name: '', value: 'on' };

export const Small = Template.bind({});
(Small as any).args = { checked: true, disabled: false, size: 'sm', label: 'Small', name: '', value: 'on' };

export const Large = Template.bind({});
(Large as any).args = { checked: true, disabled: false, size: 'lg', label: 'Large', name: '', value: 'on' };
