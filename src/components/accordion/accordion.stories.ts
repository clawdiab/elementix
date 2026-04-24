import { html } from 'lit';
import './accordion';

export default {
  title: 'Components/Accordion',
  tags: ['autodocs'],
};

export const Default = () => html`
  <elx-accordion>
    <elx-accordion-item value="a" label="Section 1">
      Content for section 1. This can contain any elements.
    </elx-accordion-item>
    <elx-accordion-item value="b" label="Section 2">
      Content for section 2. Click the header to expand.
    </elx-accordion-item>
    <elx-accordion-item value="c" label="Section 3">
      Content for section 3. Only one section open at a time.
    </elx-accordion-item>
  </elx-accordion>
`;

export const MultipleMode = () => html`
  <elx-accordion type="multiple">
    <elx-accordion-item value="a" label="FAQ 1">
      Can multiple sections be open? Yes, in multiple mode!
    </elx-accordion-item>
    <elx-accordion-item value="b" label="FAQ 2">
      How does it work? Set type="multiple" on the accordion.
    </elx-accordion-item>
    <elx-accordion-item value="c" label="FAQ 3">
      What about keyboard navigation? Use Arrow Up/Down, Home, End.
    </elx-accordion-item>
  </elx-accordion>
`;

export const WithDisabledItem = () => html`
  <elx-accordion>
    <elx-accordion-item value="a" label="Enabled Section">
      This section can be toggled.
    </elx-accordion-item>
    <elx-accordion-item value="b" label="Disabled Section" disabled>
      This section cannot be opened.
    </elx-accordion-item>
    <elx-accordion-item value="c" label="Another Enabled Section">
      This section works fine.
    </elx-accordion-item>
  </elx-accordion>
`;
