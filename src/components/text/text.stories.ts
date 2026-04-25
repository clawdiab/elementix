import { html } from 'lit';
import './text';

export default {
  title: 'Components/Text',
  tags: ['autodocs'],
  argTypes: {
    as: {
      control: { type: 'select' },
      options: ['h1', 'h2', 'h3', 'h4', 'p', 'span', 'small'],
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl'],
    },
    weight: {
      control: { type: 'select' },
      options: ['normal', 'medium', 'semibold', 'bold'],
    },
    color: {
      control: { type: 'select' },
      options: ['default', 'muted', 'primary', 'danger', 'success'],
    },
    align: {
      control: { type: 'select' },
      options: ['left', 'center', 'right'],
    },
    label: { control: 'text' },
  },
};

const Template = ({ as, size, weight, color, align, label }: any) => html`
  <elx-text as=${as} size=${size} weight=${weight} color=${color} align=${align}>${label}</elx-text>
`;

export const Paragraph = Template.bind({});
(Paragraph as any).args = {
  as: 'p',
  size: 'base',
  weight: 'normal',
  color: 'default',
  align: 'left',
  label: 'This is a paragraph of text.',
};

export const Heading1 = Template.bind({});
(Heading1 as any).args = {
  as: 'h1',
  size: '4xl',
  weight: 'semibold',
  color: 'default',
  align: 'left',
  label: 'Heading 1',
};

export const Heading2 = Template.bind({});
(Heading2 as any).args = {
  as: 'h2',
  size: '3xl',
  weight: 'semibold',
  color: 'default',
  align: 'left',
  label: 'Heading 2',
};

export const Muted = Template.bind({});
(Muted as any).args = {
  as: 'p',
  size: 'sm',
  weight: 'normal',
  color: 'muted',
  align: 'left',
  label: 'Muted helper text',
};

export const Primary = Template.bind({});
(Primary as any).args = {
  as: 'span',
  size: 'base',
  weight: 'medium',
  color: 'primary',
  align: 'left',
  label: 'Primary colored text',
};

export const Danger = Template.bind({});
(Danger as any).args = {
  as: 'p',
  size: 'base',
  weight: 'medium',
  color: 'danger',
  align: 'left',
  label: 'Something went wrong.',
};

export const Centered = Template.bind({});
(Centered as any).args = {
  as: 'p',
  size: 'lg',
  weight: 'normal',
  color: 'default',
  align: 'center',
  label: 'Centered text',
};
