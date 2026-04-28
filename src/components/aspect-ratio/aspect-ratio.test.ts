import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './aspect-ratio';

describe('ElxAspectRatio', () => {
  let el: any;

  beforeEach(() => {
    el = document.createElement('elx-aspect-ratio');
    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should be defined as a custom element', () => {
    expect(customElements.get('elx-aspect-ratio')).toBeDefined();
  });

  it('should render shadow DOM with aspect-ratio wrapper', () => {
    const wrapper = el.shadowRoot!.querySelector('.aspect-ratio');
    expect(wrapper).toBeTruthy();
  });

  it('should have a content div inside wrapper', () => {
    const content = el.shadowRoot!.querySelector('.content');
    expect(content).toBeTruthy();
  });

  it('should have a slot for content', () => {
    const slot = el.shadowRoot!.querySelector('slot');
    expect(slot).toBeTruthy();
  });

  it('should default to 16/9 ratio', () => {
    expect(el.ratio).toBeCloseTo(16 / 9, 5);
  });

  it('should set ratio via attribute as number', () => {
    el.setAttribute('ratio', '2');
    expect(el.ratio).toBe(2);
  });

  it('should set ratio via attribute as fraction string', () => {
    el.setAttribute('ratio', '4/3');
    expect(el.ratio).toBeCloseTo(4 / 3, 5);
  });

  it('should set ratio via attribute as 16/9', () => {
    el.setAttribute('ratio', '16/9');
    expect(el.ratio).toBeCloseTo(16 / 9, 5);
  });

  it('should set ratio via attribute as 1/1', () => {
    el.setAttribute('ratio', '1/1');
    expect(el.ratio).toBe(1);
  });

  it('should set ratio via property', () => {
    el.ratio = 2.35;
    expect(el.ratio).toBe(2.35);
    expect(el.getAttribute('ratio')).toBe('2.35');
  });

  it('should update padding-bottom when ratio changes', () => {
    el.ratio = 1;
    const wrapper = el.shadowRoot!.querySelector('.aspect-ratio');
    expect(wrapper.style.paddingBottom).toBe('100%');
  });

  it('should set correct padding-bottom for 16/9', () => {
    el.setAttribute('ratio', '16/9');
    const wrapper = el.shadowRoot!.querySelector('.aspect-ratio');
    const expected = (9 / 16 * 100).toFixed(4);
    expect(parseFloat(wrapper.style.paddingBottom)).toBeCloseTo(parseFloat(expected), 1);
  });

  it('should set correct padding-bottom for 4/3', () => {
    el.setAttribute('ratio', '4/3');
    const wrapper = el.shadowRoot!.querySelector('.aspect-ratio');
    const expected = (3 / 4 * 100);
    expect(parseFloat(wrapper.style.paddingBottom)).toBeCloseTo(expected, 1);
  });

  it('should ignore invalid ratio attribute', () => {
    el.setAttribute('ratio', 'invalid');
    expect(el.ratio).toBeCloseTo(16 / 9, 5);
  });

  it('should ignore zero ratio', () => {
    const prevRatio = el.ratio;
    el.ratio = 0;
    expect(el.ratio).toBe(prevRatio);
  });

  it('should ignore negative ratio', () => {
    const prevRatio = el.ratio;
    el.ratio = -1;
    expect(el.ratio).toBe(prevRatio);
  });

  it('should handle ratio attribute removal gracefully', () => {
    el.setAttribute('ratio', '2');
    el.removeAttribute('ratio');
    expect(el.ratio).toBeCloseTo(16 / 9, 5);
  });

  it('should have content positioned absolutely', () => {
    const style = el.shadowRoot!.querySelector('style');
    expect(style?.textContent).toContain('position: absolute');
  });

  it('should have CSS custom properties for object-fit', () => {
    const style = el.shadowRoot!.querySelector('style');
    expect(style?.textContent).toContain('--elx-aspect-ratio-object-fit');
  });

  it('should have CSS custom properties for object-position', () => {
    const style = el.shadowRoot!.querySelector('style');
    expect(style?.textContent).toContain('--elx-aspect-ratio-object-position');
  });

  it('should not update ratio when attribute value is unchanged', () => {
    el.setAttribute('ratio', '2');
    const ratio = el.ratio;
    el.setAttribute('ratio', '2');
    expect(el.ratio).toBe(ratio);
  });

  it('should handle ratio as decimal string', () => {
    el.setAttribute('ratio', '2.35');
    expect(el.ratio).toBe(2.35);
  });

  it('should support square ratio 1:1', () => {
    el.ratio = 1;
    const wrapper = el.shadowRoot!.querySelector('.aspect-ratio');
    expect(wrapper.style.paddingBottom).toBe('100%');
  });

  it('should support portrait ratio 9:16', () => {
    el.setAttribute('ratio', '9/16');
    expect(el.ratio).toBeCloseTo(9 / 16, 5);
  });
});
