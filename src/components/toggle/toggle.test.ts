import './toggle';

describe('ElxToggle', () => {
  let el: HTMLElement;

  beforeEach(() => {
    el = document.createElement('elx-toggle');
    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders a button element', () => {
    const btn = el.shadowRoot!.querySelector('button');
    expect(btn).toBeTruthy();
  });

  it('has default size md', () => {
    expect((el as any).size).toBe('md');
  });

  it('has default variant default', () => {
    expect((el as any).variant).toBe('default');
  });

  it('toggles pressed state on click', () => {
    const btn = el.shadowRoot!.querySelector('button') as HTMLButtonElement;
    btn.click();
    expect((el as any).pressed).toBe(true);
    btn.click();
    expect((el as any).pressed).toBe(false);
  });

  it('sets aria-pressed attribute', () => {
    const btn = el.shadowRoot!.querySelector('button')!;
    expect(btn.getAttribute('aria-pressed')).toBe('false');
    (el as any).pressed = true;
    expect(btn.getAttribute('aria-pressed')).toBe('true');
  });

  it('does not toggle when disabled', () => {
    (el as any).disabled = true;
    const btn = el.shadowRoot!.querySelector('button') as HTMLButtonElement;
    btn.click();
    expect((el as any).pressed).toBe(false);
  });

  it('applies size class', () => {
    (el as any).size = 'lg';
    const btn = el.shadowRoot!.querySelector('button')!;
    expect(btn.classList.contains('lg')).toBe(true);
  });

  it('applies variant class', () => {
    (el as any).variant = 'outline';
    const btn = el.shadowRoot!.querySelector('button')!;
    expect(btn.classList.contains('variant-outline')).toBe(true);
  });

  it('applies pressed class when pressed', () => {
    (el as any).pressed = true;
    const btn = el.shadowRoot!.querySelector('button')!;
    expect(btn.classList.contains('pressed')).toBe(true);
  });

  it('dispatches change event with detail', () => {
    let detail: any;
    el.addEventListener('change', (e: Event) => {
      detail = (e as CustomEvent).detail;
    });
    const btn = el.shadowRoot!.querySelector('button') as HTMLButtonElement;
    btn.click();
    expect(detail.pressed).toBe(true);
    expect(detail.value).toBe('on');
  });

  it('uses custom value attribute', () => {
    (el as any).value = 'bold';
    let detail: any;
    el.addEventListener('change', (e: Event) => {
      detail = (e as CustomEvent).detail;
    });
    const btn = el.shadowRoot!.querySelector('button') as HTMLButtonElement;
    btn.click();
    expect(detail.value).toBe('bold');
  });

  it('has type="button" to prevent form submission', () => {
    const btn = el.shadowRoot!.querySelector('button')!;
    expect(btn.getAttribute('type')).toBe('button');
  });

  it('resets pressed state on form reset', () => {
    (el as any).pressed = true;
    (el as any).formResetCallback();
    expect((el as any).pressed).toBe(false);
  });

  it('has role="button" implicitly via button element', () => {
    const btn = el.shadowRoot!.querySelector('button')!;
    expect(btn.tagName).toBe('BUTTON');
  });
});

describe('ElxToggleGroup', () => {
  let group: HTMLElement;

  beforeEach(() => {
    group = document.createElement('elx-toggle-group');
    group.innerHTML = `
      <elx-toggle value="bold"></elx-toggle>
      <elx-toggle value="italic"></elx-toggle>
      <elx-toggle value="underline"></elx-toggle>
    `;
    document.body.appendChild(group);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders slot content', () => {
    const toggles = group.querySelectorAll('elx-toggle');
    expect(toggles.length).toBe(3);
  });

  it('has default type single', () => {
    expect((group as any).type).toBe('single');
  });

  it('allows only one toggle pressed in single mode', () => {
    const toggles = group.querySelectorAll('elx-toggle') as any;
    toggles[0].shadowRoot!.querySelector('button').click();
    expect(toggles[0].pressed).toBe(true);
    toggles[1].shadowRoot!.querySelector('button').click();
    expect(toggles[0].pressed).toBe(false);
    expect(toggles[1].pressed).toBe(true);
  });

  it('allows multiple toggles pressed in multiple mode', () => {
    (group as any).type = 'multiple';
    const toggles = group.querySelectorAll('elx-toggle') as any;
    toggles[0].shadowRoot!.querySelector('button').click();
    toggles[1].shadowRoot!.querySelector('button').click();
    expect(toggles[0].pressed).toBe(true);
    expect(toggles[1].pressed).toBe(true);
  });

  it('updates value attribute in single mode', () => {
    const toggles = group.querySelectorAll('elx-toggle') as any;
    toggles[0].shadowRoot!.querySelector('button').click();
    expect((group as any).value).toBe('bold');
  });

  it('updates value attribute with comma-separated values in multiple mode', () => {
    (group as any).type = 'multiple';
    const toggles = group.querySelectorAll('elx-toggle') as any;
    toggles[0].shadowRoot!.querySelector('button').click();
    toggles[2].shadowRoot!.querySelector('button').click();
    expect((group as any).value).toBe('bold,underline');
  });

  it('has role="group"', () => {
    expect(group.getAttribute('role')).toBe('group');
  });

  it('dispatches change event with group value', () => {
    let detail: any;
    group.addEventListener('change', (e: Event) => {
      detail = (e as CustomEvent).detail;
    });
    const toggles = group.querySelectorAll('elx-toggle') as any;
    toggles[0].shadowRoot!.querySelector('button').click();
    expect(detail.value).toBe('bold');
  });

  it('supports aria-label attribute', () => {
    group.setAttribute('aria-label', 'Text formatting');
    expect(group.getAttribute('aria-label')).toBe('Text formatting');
  });

  it('sets value via setter', () => {
    (group as any).value = 'test';
    expect(group.getAttribute('value')).toBe('test');
  });
});
