import { html } from 'lit';
import './alert';

export default {
  title: 'Components/Alert',
  tags: ['autodocs'],
  argTypes: {
    variant: { control: { type: 'select' }, options: ['info', 'success', 'warning', 'error'] },
    dismissible: { control: 'boolean' }
  }
};

const Template = ({ variant, dismissible }: any) => html`
  <elx-alert variant=${variant} ?dismissible=${dismissible}>
    This is an ${variant} alert message.
  </elx-alert>
`;

export const Info = Template.bind({});
(Info as any).args = { variant: 'info', dismissible: false };

export const Success = Template.bind({});
(Success as any).args = { variant: 'success', dismissible: false };

export const Warning = Template.bind({});
(Warning as any).args = { variant: 'warning', dismissible: false };

export const Error = Template.bind({});
(Error as any).args = { variant: 'error', dismissible: false };

export const Dismissible = Template.bind({});
(Dismissible as any).args = { variant: 'info', dismissible: true };

export const AllVariants = () => html`
  <div style="display:flex;flex-direction:column;gap:12px;max-width:400px">
    <elx-alert variant="info">Information message</elx-alert>
    <elx-alert variant="success">Success message</elx-alert>
    <elx-alert variant="warning">Warning message</elx-alert>
    <elx-alert variant="error">Error message</elx-alert>
  </div>
`;
