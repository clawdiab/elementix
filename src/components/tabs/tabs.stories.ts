import { html } from 'lit';
import './tabs';

export default {
  title: 'Components/Tabs',
  tags: ['autodocs'],
};

export const Default = () => html`
  <elx-tabs>
    <elx-tab-panel name="account" label="Account">
      <h3>Account Settings</h3>
      <p>Manage your account preferences and security settings.</p>
    </elx-tab-panel>
    <elx-tab-panel name="notifications" label="Notifications">
      <h3>Notification Preferences</h3>
      <p>Configure how and when you receive notifications.</p>
    </elx-tab-panel>
    <elx-tab-panel name="billing" label="Billing">
      <h3>Billing & Plans</h3>
      <p>View invoices and manage your subscription.</p>
    </elx-tab-panel>
  </elx-tabs>
`;

export const Preselected = () => html`
  <elx-tabs value="tab2">
    <elx-tab-panel name="tab1" label="First">First panel content</elx-tab-panel>
    <elx-tab-panel name="tab2" label="Second">Second panel is pre-selected</elx-tab-panel>
    <elx-tab-panel name="tab3" label="Third">Third panel content</elx-tab-panel>
  </elx-tabs>
`;
