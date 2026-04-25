import type { Meta, StoryObj } from '@storybook/web-components';
import './file-upload.js';

const meta: Meta = {
  title: 'Components/FileUpload',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => `<elx-file-upload></elx-file-upload>`,
};

export const AcceptImages: Story = {
  render: () => `<elx-file-upload accept=".png,.jpg,.gif" multiple></elx-file-upload>`,
};

export const WithMaxSize: Story = {
  render: () => `<elx-file-upload accept=".pdf" max-size="5242880" multiple max-files="3"></elx-file-upload>`,
};

export const Disabled: Story = {
  render: () => `<elx-file-upload disabled></elx-file-upload>`,
};
