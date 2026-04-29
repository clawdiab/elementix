import { describe, it, expect, afterEach, vi } from 'vitest';
import './datalist';
import type { DataListItem } from './datalist';

const sampleItems: DataListItem[] = [
  { id: 'apple', label: 'Apple', description: 'Red fruit', group: 'Fruits' },
  { id: 'banana', label: 'Banana', description: 'Yellow fruit', group: 'Fruits' },
  { id: 'cherry', label: 'Cherry', description: 'Small red fruit', group: 'Fruits' },
  { id: 'carrot', label: 'Carrot', description: 'Orange vegetable', group: 'Vegetables' },
  { id: 'broccoli', label: 'Broccoli', description: 'Green vegetable', group: 'Vegetables' },
  { id: 'spinach', label: 'Spinach', group: 'Vegetables' },
  { id: 'disabled-item', label: 'Disabled', disabled: true, group: 'Other' },
];

function createDataList(items: DataListItem[] = sampleItems): HTMLElement {
  const el = document.createElement('elx-datalist') as any;
  el.items = items;
  document.body.appendChild(el);
  return el;
}

describe('elx-datalist', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('registration', () => {
    it('should be defined as a custom element', () => {
      expect(customElements.get('elx-datalist')).toBeDefined();
    });

    it('should create an instance', () => {
      const el = createDataList();
      expect(el).toBeInstanceOf(HTMLElement);
    });
  });

  describe('items', () => {
    it('should render all items including disabled', () => {
      const el = createDataList() as any;
      const items = el.shadowRoot.querySelectorAll('.list-item');
      expect(items.length).toBe(7);
    });

    it('should render group labels', () => {
      const el = createDataList() as any;
      const groups = el.shadowRoot.querySelectorAll('.group-label');
      expect(groups.length).toBe(3);
      expect(groups[0].textContent).toBe('Fruits');
      expect(groups[1].textContent).toBe('Vegetables');
      expect(groups[2].textContent).toBe('Other');
    });

    it('should render descriptions', () => {
      const el = createDataList() as any;
      const descs = el.shadowRoot.querySelectorAll('.list-item-description');
      expect(descs.length).toBe(5);
    });

    it('should update items dynamically', () => {
      const el = createDataList([]) as any;
      expect(el.shadowRoot.querySelector('.empty-state')).not.toBeNull();
      el.items = sampleItems;
      expect(el.shadowRoot.querySelectorAll('.list-item').length).toBe(7);
    });
  });

  describe('filtering', () => {
    it('should filter items by label', () => {
      const el = createDataList() as any;
      const input = el.shadowRoot.querySelector('.search-input') as HTMLInputElement;
      input.value = 'apple';
      input.dispatchEvent(new Event('input'));
      const items = el.shadowRoot.querySelectorAll('.list-item');
      expect(items.length).toBe(1);
    });

    it('should filter items by description', () => {
      const el = createDataList() as any;
      const input = el.shadowRoot.querySelector('.search-input') as HTMLInputElement;
      input.value = 'orange';
      input.dispatchEvent(new Event('input'));
      const items = el.shadowRoot.querySelectorAll('.list-item');
      expect(items.length).toBe(1);
      expect(items[0].querySelector('.list-item-label').textContent).toBe('Carrot');
    });

    it('should filter items by group', () => {
      const el = createDataList() as any;
      const input = el.shadowRoot.querySelector('.search-input') as HTMLInputElement;
      input.value = 'fruit';
      input.dispatchEvent(new Event('input'));
      const items = el.shadowRoot.querySelectorAll('.list-item');
      expect(items.length).toBe(3);
    });

    it('should be case insensitive', () => {
      const el = createDataList() as any;
      const input = el.shadowRoot.querySelector('.search-input') as HTMLInputElement;
      input.value = 'BANANA';
      input.dispatchEvent(new Event('input'));
      const items = el.shadowRoot.querySelectorAll('.list-item');
      expect(items.length).toBe(1);
    });

    it('should show empty state when no matches', () => {
      const el = createDataList() as any;
      const input = el.shadowRoot.querySelector('.search-input') as HTMLInputElement;
      input.value = 'xyznonexistent';
      input.dispatchEvent(new Event('input'));
      expect(el.shadowRoot.querySelector('.empty-state')).not.toBeNull();
    });
  });

  describe('keyboard navigation', () => {
    it('should have no selection by default', () => {
      const el = createDataList() as any;
      const items = el.shadowRoot.querySelectorAll('.list-item');
      expect(items[0].classList.contains('active')).toBe(false);
    });

    it('should select first item on ArrowDown', () => {
      const el = createDataList() as any;
      el.focus();
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      const items = el.shadowRoot.querySelectorAll('.list-item');
      expect(items[0].classList.contains('active')).toBe(true);
    });

    it('should move down with ArrowDown', () => {
      const el = createDataList() as any;
      el.focus();
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      const items = el.shadowRoot.querySelectorAll('.list-item');
      expect(items[1].classList.contains('active')).toBe(true);
    });

    it('should move up with ArrowUp', () => {
      const el = createDataList() as any;
      el.focus();
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
      const items = el.shadowRoot.querySelectorAll('.list-item');
      expect(items[0].classList.contains('active')).toBe(true);
    });

    it('should not go above first item', () => {
      const el = createDataList() as any;
      el.focus();
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
      const items = el.shadowRoot.querySelectorAll('.list-item');
      expect(items[0].classList.contains('active')).toBe(false);
    });

    it('should not go below last item', () => {
      const el = createDataList() as any;
      el.focus();
      for (let i = 0; i < 20; i++) {
        el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      }
      const items = el.shadowRoot.querySelectorAll('.list-item');
      expect(items[items.length - 1].classList.contains('active')).toBe(true);
    });

    it('should dispatch change event on arrow', () => {
      const el = createDataList() as any;
      const spy = vi.fn();
      el.addEventListener('elx-datalist-change', spy);
      el.focus();
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0].detail.id).toBe('apple');
    });

    it('should dispatch select event on Enter', () => {
      const el = createDataList() as any;
      const spy = vi.fn();
      el.addEventListener('elx-datalist-select', spy);
      el.focus();
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0].detail.id).toBe('apple');
    });

    it('should clear selection on Escape', () => {
      const el = createDataList() as any;
      el.focus();
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      const items = el.shadowRoot.querySelectorAll('.list-item');
      expect(items[0].classList.contains('active')).toBe(false);
    });

    it('should jump to first item on Home', () => {
      const el = createDataList() as any;
      el.focus();
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));
      const items = el.shadowRoot.querySelectorAll('.list-item');
      expect(items[0].classList.contains('active')).toBe(true);
    });

    it('should jump to last item on End', () => {
      const el = createDataList() as any;
      el.focus();
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
      const items = el.shadowRoot.querySelectorAll('.list-item');
      expect(items[items.length - 1].classList.contains('active')).toBe(true);
    });
  });

  describe('mouse interaction', () => {
    it('should select item on click', () => {
      const el = createDataList() as any;
      const spy = vi.fn();
      el.addEventListener('elx-datalist-select', spy);
      const items = el.shadowRoot.querySelectorAll('.list-item');
      items[2].click();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0].detail.id).toBe('cherry');
    });
  });

  describe('selectedItem and value', () => {
    it('should return null when nothing selected', () => {
      const el = createDataList() as any;
      expect(el.selectedItem).toBeNull();
      expect(el.value).toBe('');
    });

    it('should return selected item after keyboard navigation', () => {
      const el = createDataList() as any;
      el.focus();
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      expect(el.selectedItem).not.toBeNull();
      expect(el.selectedItem.id).toBe('apple');
      expect(el.value).toBe('apple');
    });
  });

  describe('placeholder', () => {
    it('should use default placeholder', () => {
      const el = createDataList() as any;
      const input = el.shadowRoot.querySelector('.search-input') as HTMLInputElement;
      expect(input.placeholder).toBe('Filter...');
    });

    it('should use custom placeholder', () => {
      const el = document.createElement('elx-datalist') as any;
      el.setAttribute('placeholder', 'Search items...');
      el.items = sampleItems;
      document.body.appendChild(el);
      const input = el.shadowRoot.querySelector('.search-input') as HTMLInputElement;
      expect(input.placeholder).toBe('Search items...');
    });
  });

  describe('accessibility', () => {
    it('should have listbox role', () => {
      const el = createDataList() as any;
      const container = el.shadowRoot.querySelector('.container');
      expect(container.getAttribute('role')).toBe('listbox');
    });

    it('should have aria-label when label attribute set', () => {
      const el = document.createElement('elx-datalist') as any;
      el.setAttribute('label', 'Select a fruit');
      el.items = sampleItems;
      document.body.appendChild(el);
      const container = el.shadowRoot.querySelector('.container');
      expect(container.getAttribute('aria-label')).toBe('Select a fruit');
    });

    it('should have option role on items', () => {
      const el = createDataList() as any;
      const items = el.shadowRoot.querySelectorAll('.list-item');
      expect(items[0].getAttribute('role')).toBe('option');
    });

    it('should have aria-selected on active item', () => {
      const el = createDataList() as any;
      el.focus();
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      const items = el.shadowRoot.querySelectorAll('.list-item');
      expect(items[0].getAttribute('aria-selected')).toBe('true');
      expect(items[1].getAttribute('aria-selected')).toBe('false');
    });

    it('should have aria-disabled on disabled items', () => {
      const el = createDataList() as any;
      const items = el.shadowRoot.querySelectorAll('.list-item');
      let disabledItem: any = null;
      for (let i = 0; i < items.length; i++) {
        if (items[i].textContent.indexOf('Disabled') !== -1) {
          disabledItem = items[i];
          break;
        }
      }
      expect(disabledItem?.getAttribute('aria-disabled')).toBe('true');
    });

    it('should update aria-activedescendant on keyboard nav', () => {
      const el = createDataList() as any;
      const container = el.shadowRoot.querySelector('.container');
      el.focus();
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      const items = el.shadowRoot.querySelectorAll('.list-item');
      expect(container.getAttribute('aria-activedescendant')).toBe(items[0].id);
    });

    it('should remove aria-activedescendant on Escape', () => {
      const el = createDataList() as any;
      const container = el.shadowRoot.querySelector('.container');
      el.focus();
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      expect(container.getAttribute('aria-activedescendant')).toBeNull();
    });
  });

  describe('part attributes', () => {
    it('should have part on container', () => {
      const el = createDataList() as any;
      const container = el.shadowRoot.querySelector('.container');
      expect(container.getAttribute('part')).toBe('container');
    });

    it('should have part on list', () => {
      const el = createDataList() as any;
      const list = el.shadowRoot.querySelector('.list');
      expect(list.getAttribute('part')).toBe('list');
    });
  });

  describe('reconnection', () => {
    it('should not duplicate DOM on reconnect', () => {
      const el = createDataList() as any;
      el.remove();
      document.body.appendChild(el);
      const containers = el.shadowRoot.querySelectorAll('.container');
      expect(containers.length).toBe(1);
    });
  });

  describe('edge cases', () => {
    it('should handle empty items', () => {
      const el = createDataList([]) as any;
      expect(el.shadowRoot.querySelector('.empty-state')).not.toBeNull();
    });

    it('should handle Enter with no selection', () => {
      const el = createDataList() as any;
      const spy = vi.fn();
      el.addEventListener('elx-datalist-select', spy);
      el.focus();
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(spy).not.toHaveBeenCalled();
    });
  });
});
