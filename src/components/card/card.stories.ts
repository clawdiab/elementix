import { html } from 'lit';
import './card';

export default {
  title: 'Components/Card',
  tags: ['autodocs'],
  argTypes: {
    variant: { control: { type: 'select' }, options: ['elevated', 'outlined', 'filled'] },
    padding: { control: { type: 'select' }, options: ['none', 'sm', 'md', 'lg'] },
    interactive: { control: 'boolean' },
  },
};

const Template = ({ variant, padding, interactive }: any) => html`
  <elx-card variant=${variant} padding=${padding} ?interactive=${interactive}>
    <h3 slot="header">Card Title</h3>
    <p>This is the card content. It can contain any elements.</p>
    <div slot="footer">Footer content</div>
  </elx-card>
`;

export const Default = Template.bind({});
(Default as any).args = { variant: 'elevated', padding: 'md', interactive: false };

export const Outlined = Template.bind({});
(Outlined as any).args = { variant: 'outlined', padding: 'md', interactive: false };

export const Filled = Template.bind({});
(Filled as any).args = { variant: 'filled', padding: 'md', interactive: false };

export const Interactive = Template.bind({});
(Interactive as any).args = { variant: 'elevated', padding: 'md', interactive: true };

export const AllVariants = () => html`
  <div style="display:flex;gap:16px;flex-direction:column;max-width:400px">
    <elx-card variant="elevated">
      <strong>Elevated</strong>
      <p>Default shadow style</p>
    </elx-card>
    <elx-card variant="outlined">
      <strong>Outlined</strong>
      <p>Border only, no shadow</p>
    </elx-card>
    <elx-card variant="filled">
      <strong>Filled</strong>
      <p>Background color, no border</p>
    </elx-card>
  </div>
`;
