import { html } from 'lit';
import './checkbox';

export default {
  title: 'Components/Checkbox',
  tags: ['autodocs'],
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    size: { control: { type: 'select' }, options: ['sm', 'md', 'lg'] },
    label: { control: 'text' },
    name: { control: 'text' },
    value: { control: 'text' }
  }
};

const Template = ({ checked, disabled, indeterminate, size, label, name, value }: any) => html`
  <elx-checkbox
    ?checked=${checked}
    ?disabled=${disabled}
    ?indeterminate=${indeterminate}
    size=${size}
    label=${label}
    name=${name}
    value=${value}
  ></elx-checkbox>
`;

export const Default = Template.bind({});
(Default as any).args = { checked: false, disabled: false, indeterminate: false, size: 'md', label: 'Accept terms', name: 'terms', value: 'on' };

export const Checked = Template.bind({});
(Checked as any).args = { checked: true, disabled: false, indeterminate: false, size: 'md', label: 'Checked', name: '', value: 'on' };

export const Indeterminate = Template.bind({});
(Indeterminate as any).args = { checked: false, disabled: false, indeterminate: true, size: 'md', label: 'Indeterminate', name: '', value: 'on' };

export const Disabled = Template.bind({});
(Disabled as any).args = { checked: false, disabled: true, indeterminate: false, size: 'md', label: 'Disabled', name: '', value: 'on' };

export const Small = Template.bind({});
(Small as any).args = { checked: false, disabled: false, indeterminate: false, size: 'sm', label: 'Small', name: '', value: 'on' };

export const Large = Template.bind({});
(Large as any).args = { checked: false, disabled: false, indeterminate: false, size: 'lg', label: 'Large', name: '', value: 'on' };
