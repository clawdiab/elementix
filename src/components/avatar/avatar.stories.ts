import { html } from 'lit';
import './avatar';

export default {
  title: 'Components/Avatar',
  tags: ['autodocs'],
  argTypes: {
    src: { control: 'text' },
    alt: { control: 'text' },
    fallback: { control: 'text' },
    size: { control: { type: 'select' }, options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    shape: { control: { type: 'select' }, options: ['circle', 'square'] },
  },
};

const Template = ({ src, alt, fallback, size, shape }: any) => html`
  <elx-avatar src=${src} alt=${alt} fallback=${fallback} size=${size} shape=${shape}></elx-avatar>
`;

export const Default = Template.bind({});
(Default as any).args = {
  src: 'https://i.pravatar.cc/150?img=1',
  alt: 'User',
  fallback: 'JD',
  size: 'md',
  shape: 'circle',
};

export const Fallback = Template.bind({});
(Fallback as any).args = { src: '', alt: '', fallback: 'AB', size: 'md', shape: 'circle' };

export const Sizes = () => html`
  <div style="display:flex;gap:12px;align-items:center">
    <elx-avatar size="xs" fallback="XS"></elx-avatar>
    <elx-avatar size="sm" fallback="SM"></elx-avatar>
    <elx-avatar size="md" fallback="MD"></elx-avatar>
    <elx-avatar size="lg" fallback="LG"></elx-avatar>
    <elx-avatar size="xl" fallback="XL"></elx-avatar>
  </div>
`;

export const Square = () => html`
  <div style="display:flex;gap:12px;align-items:center">
    <elx-avatar shape="square" size="md" fallback="SQ"></elx-avatar>
    <elx-avatar
      shape="square"
      size="lg"
      src="https://i.pravatar.cc/150?img=3"
      alt="Square avatar"
    ></elx-avatar>
  </div>
`;
