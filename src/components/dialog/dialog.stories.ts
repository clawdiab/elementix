import { html } from 'lit';
import './dialog';

export default {
  title: 'Components/Dialog',
  tags: ['autodocs'],
};

export const Default = () => html`
  <elx-button onclick="document.querySelector('#dialog1').show()">Open Dialog</elx-button>
  <elx-dialog id="dialog1">
    <span slot="title">Dialog Title</span>
    <p>This is the dialog content. You can put anything here.</p>
    <div slot="footer">
      <elx-button variant="ghost" onclick="document.querySelector('#dialog1').close()">Cancel</elx-button>
      <elx-button onclick="document.querySelector('#dialog1').close()">Confirm</elx-button>
    </div>
  </elx-dialog>
`;

export const Simple = () => html`
  <elx-button onclick="document.querySelector('#dialog2').show()">Simple Dialog</elx-button>
  <elx-dialog id="dialog2">
    <span slot="title">Information</span>
    <p>A simple dialog with just a message and close button.</p>
  </elx-dialog>
`;
