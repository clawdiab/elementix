import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './stepper';

describe('ElxStepper', () => {
  let stepper: any;

  beforeEach(() => {
    stepper = document.createElement('elx-stepper');
    for (let i = 0; i < 3; i++) {
      const step = document.createElement('elx-step');
      step.setAttribute('title', `Step ${i + 1}`);
      step.setAttribute('description', `Description ${i + 1}`);
      stepper.appendChild(step);
    }
    document.body.appendChild(stepper);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('is defined', () => {
    expect(customElements.get('elx-stepper')).toBeDefined();
    expect(customElements.get('elx-step')).toBeDefined();
  });

  it('renders with navigation role', () => {
    const nav = stepper.shadowRoot.querySelector('.stepper');
    expect(nav.getAttribute('role')).toBe('navigation');
    expect(nav.getAttribute('aria-label')).toBe('Progress steps');
  });

  it('defaults to vertical orientation', () => {
    expect(stepper.orientation).toBe('vertical');
    const container = stepper.shadowRoot.querySelector('.stepper');
    expect(container.classList.contains('horizontal')).toBe(false);
  });

  it('switches to horizontal orientation', () => {
    stepper.orientation = 'horizontal';
    const container = stepper.shadowRoot.querySelector('.stepper');
    expect(container.classList.contains('horizontal')).toBe(true);
  });

  it('sets first step as active by default', () => {
    const steps = stepper.querySelectorAll('elx-step');
    expect(steps[0].hasAttribute('active')).toBe(true);
    expect(steps[1].hasAttribute('active')).toBe(false);
  });

  it('marks previous steps as completed', () => {
    stepper.activeStep = 2;
    const steps = stepper.querySelectorAll('elx-step');
    expect(steps[0].hasAttribute('completed')).toBe(true);
    expect(steps[1].hasAttribute('completed')).toBe(true);
    expect(steps[2].hasAttribute('active')).toBe(true);
  });

  it('navigates with next()', () => {
    stepper.next();
    expect(stepper.activeStep).toBe(1);
    const steps = stepper.querySelectorAll('elx-step');
    expect(steps[1].hasAttribute('active')).toBe(true);
  });

  it('navigates with prev()', () => {
    stepper.activeStep = 2;
    stepper.prev();
    expect(stepper.activeStep).toBe(1);
  });

  it('does not go below 0 with prev()', () => {
    stepper.prev();
    expect(stepper.activeStep).toBe(0);
  });

  it('does not exceed step count with next()', () => {
    stepper.activeStep = 2;
    stepper.next();
    expect(stepper.activeStep).toBe(2);
  });

  it('navigates with goTo()', () => {
    stepper.goTo(2);
    expect(stepper.activeStep).toBe(2);
  });

  it('ignores invalid goTo index', () => {
    stepper.goTo(-1);
    expect(stepper.activeStep).toBe(0);
    stepper.goTo(10);
    expect(stepper.activeStep).toBe(0);
  });

  it('dispatches elx-stepper-change event', () => {
    let detail: any = null;
    stepper.addEventListener('elx-stepper-change', (e: CustomEvent) => {
      detail = e.detail;
    });
    stepper.next();
    expect(detail).toEqual({ activeStep: 1 });
  });
});

describe('ElxStep', () => {
  let step: any;

  beforeEach(() => {
    step = document.createElement('elx-step');
    step.setAttribute('title', 'Test Step');
    step.setAttribute('description', 'Test description');
    document.body.appendChild(step);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders title and description', () => {
    const title = step.shadowRoot.querySelector('.step-title');
    const desc = step.shadowRoot.querySelector('.step-description');
    expect(title.textContent).toBe('Test Step');
    expect(desc.textContent).toBe('Test description');
  });

  it('has listitem role', () => {
    const el = step.shadowRoot.querySelector('.step');
    expect(el.getAttribute('role')).toBe('listitem');
  });

  it('sets aria-current=step when active', () => {
    step.active = true;
    const el = step.shadowRoot.querySelector('.step');
    expect(el.getAttribute('aria-current')).toBe('step');
  });

  it('sets aria-current=false when not active', () => {
    step.active = false;
    const el = step.shadowRoot.querySelector('.step');
    expect(el.getAttribute('aria-current')).toBe('false');
  });

  it('adds completed class', () => {
    step.completed = true;
    const el = step.shadowRoot.querySelector('.step');
    expect(el.classList.contains('completed')).toBe(true);
  });

  it('adds error class', () => {
    step.error = true;
    const el = step.shadowRoot.querySelector('.step');
    expect(el.classList.contains('error')).toBe(true);
  });

  it('updates title dynamically', () => {
    step.title = 'Updated';
    const title = step.shadowRoot.querySelector('.step-title');
    expect(title.textContent).toBe('Updated');
  });

  it('updates description dynamically', () => {
    step.description = 'New desc';
    const desc = step.shadowRoot.querySelector('.step-description');
    expect(desc.textContent).toBe('New desc');
  });
});
