import { html } from 'lit';
import './input';

export default {
  title: 'Components/Input',
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['text', 'password', 'email', 'number', 'tel', 'url', 'search']
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg']
    },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    required: { control: 'boolean' },
    error: { control: 'boolean' },
    placeholder: { control: 'text' },
    value: { control: 'text' },
    label: { control: 'text' },
    name: { control: 'text' }
  }
};

const Template = ({ type, size, disabled, readonly, required, error, placeholder, value, label, name }: any) => html`
  <elx-input
    type=${type}
    size=${size}
    ?disabled=${disabled}
    ?readonly=${readonly}
    ?required=${required}
    ?error=${error}
    placeholder=${placeholder}
    value=${value}
    label=${label}
    name=${name}
  ></elx-input>
`;

export const Default = Template.bind({});
(Default as any).args = { type: 'text', size: 'md', disabled: false, readonly: false, required: false, error: false, placeholder: 'Enter text...', value: '', label: '', name: '' };

export const WithLabel = Template.bind({});
(WithLabel as any).args = { type: 'text', size: 'md', disabled: false, readonly: false, required: false, error: false, placeholder: 'Enter your email', value: '', label: 'Email', name: 'email' };

export const Email = Template.bind({});
(Email as any).args = { type: 'email', size: 'md', disabled: false, readonly: false, required: true, error: false, placeholder: 'you@example.com', value: '', label: 'Email Address', name: 'email' };

export const Password = Template.bind({});
(Password as any).args = { type: 'password', size: 'md', disabled: false, readonly: false, required: true, error: false, placeholder: 'Enter password', value: '', label: 'Password', name: 'password' };

export const Error = Template.bind({});
(Error as any).args = { type: 'text', size: 'md', disabled: false, readonly: false, required: false, error: true, placeholder: 'Invalid input', value: 'bad value', label: 'Field with error', name: 'field' };

export const Disabled = Template.bind({});
(Disabled as any).args = { type: 'text', size: 'md', disabled: true, readonly: false, required: false, error: false, placeholder: 'Disabled input', value: '', label: 'Disabled', name: '' };

export const Small = Template.bind({});
(Small as any).args = { type: 'text', size: 'sm', disabled: false, readonly: false, required: false, error: false, placeholder: 'Small input', value: '', label: 'Small', name: '' };

export const Large = Template.bind({});
(Large as any).args = { type: 'text', size: 'lg', disabled: false, readonly: false, required: false, error: false, placeholder: 'Large input', value: '', label: 'Large', name: '' };
