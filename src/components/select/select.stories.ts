import './select';

export default {
  title: 'Components/Select',
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
  },
};

const fruits = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date' },
  { value: 'elderberry', label: 'Elderberry' },
];

export const Default = () => {
  const el = document.createElement('elx-select') as any;
  el.options = fruits;
  return el;
};

export const WithPlaceholder = () => {
  const el = document.createElement('elx-select') as any;
  el.placeholder = 'Choose a fruit...';
  el.options = fruits;
  return el;
};

export const Preselected = () => {
  const el = document.createElement('elx-select') as any;
  el.options = fruits;
  el.value = 'cherry';
  return el;
};

export const Disabled = () => {
  const el = document.createElement('elx-select') as any;
  el.options = fruits;
  el.disabled = true;
  return el;
};

export const WithDisabledOptions = () => {
  const el = document.createElement('elx-select') as any;
  el.options = [
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B (disabled)', disabled: true },
    { value: 'c', label: 'Option C' },
  ];
  return el;
};
