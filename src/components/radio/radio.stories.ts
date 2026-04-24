import { html } from 'lit';
import './radio';

export default {
  title: 'Components/Radio',
  tags: ['autodocs'],
};

export const SingleRadio = () => html`
  <div style="display:flex;flex-direction:column;gap:8px">
    <elx-radio name="fruit" value="apple" label="Apple" checked></elx-radio>
    <elx-radio name="fruit" value="banana" label="Banana"></elx-radio>
    <elx-radio name="fruit" value="cherry" label="Cherry" disabled></elx-radio>
  </div>
`;

export const Sizes = () => html`
  <div style="display:flex;flex-direction:column;gap:12px">
    <elx-radio size="sm" label="Small" name="size" value="sm"></elx-radio>
    <elx-radio size="md" label="Medium" name="size" value="md" checked></elx-radio>
    <elx-radio size="lg" label="Large" name="size" value="lg"></elx-radio>
  </div>
`;

export const WithGroup = () => html`
  <elx-radio-group name="plan" value="pro">
    <elx-radio value="free" label="Free"></elx-radio>
    <elx-radio value="pro" label="Pro"></elx-radio>
    <elx-radio value="enterprise" label="Enterprise"></elx-radio>
  </elx-radio-group>
`;

export const GroupDisabled = () => html`
  <elx-radio-group name="plan" value="free" disabled>
    <elx-radio value="free" label="Free"></elx-radio>
    <elx-radio value="pro" label="Pro"></elx-radio>
  </elx-radio-group>
`;
