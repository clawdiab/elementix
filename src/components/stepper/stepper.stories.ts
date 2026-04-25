import type { Meta, StoryObj } from '@storybook/web-components';
import './stepper.js';

const meta: Meta = {
  title: 'Components/Stepper',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => `
<elx-stepper>
  <elx-step title="Account" description="Create your account"></elx-step>
  <elx-step title="Profile" description="Set up your profile"></elx-step>
  <elx-step title="Confirm" description="Review and confirm"></elx-step>
</elx-stepper>
`,
};

export const Horizontal: Story = {
  render: () => `
<elx-stepper orientation="horizontal">
  <elx-step title="Step 1" description="First step"></elx-step>
  <elx-step title="Step 2" description="Second step"></elx-step>
  <elx-step title="Step 3" description="Third step"></elx-step>
</elx-stepper>
`,
};

export const WithActiveStep: Story = {
  render: () => `
<elx-stepper active-step="1">
  <elx-step title="Account" description="Create your account"></elx-step>
  <elx-step title="Profile" description="Set up your profile"></elx-step>
  <elx-step title="Confirm" description="Review and confirm"></elx-step>
</elx-stepper>
`,
};

export const WithError: Story = {
  render: () => `
<elx-stepper active-step="1">
  <elx-step title="Account" description="Create your account" completed></elx-step>
  <elx-step title="Profile" description="Set up your profile" error></elx-step>
  <elx-step title="Confirm" description="Review and confirm"></elx-step>
</elx-stepper>
`,
};

export const WithContent: Story = {
  render: () => `
<elx-stepper active-step="0">
  <elx-step title="Account" description="Create your account">
    <div style="padding: 1rem; border: 1px solid #e2e8f0; border-radius: 0.5rem;">
      Account form content here
    </div>
  </elx-step>
  <elx-step title="Profile" description="Set up your profile">
    <div style="padding: 1rem; border: 1px solid #e2e8f0; border-radius: 0.5rem;">
      Profile form content here
    </div>
  </elx-step>
  <elx-step title="Confirm" description="Review and confirm">
    <div style="padding: 1rem; border: 1px solid #e2e8f0; border-radius: 0.5rem;">
      Confirmation content here
    </div>
  </elx-step>
</elx-stepper>
`,
};
