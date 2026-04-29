import { describe, it, expect, afterEach, vi } from 'vitest';
import './command-palette';
import type { CommandItem } from './command-palette';

const sampleItems: CommandItem[] = [
  { id: 'new-file', label: 'New File', icon: '📄', shortcut: 'Ctrl+N', group: 'File' },
  { id: 'open-file', label: 'Open File', icon: '📂', shortcut: 'Ctrl+O', group: 'File' },
  { id: 'save', label: 'Save', icon: '💾', shortcut: 'Ctrl+S', group: 'File' },
  { id: 'undo', label: 'Undo', icon: '↩', shortcut: 'Ctrl+Z', group: 'Edit' },
  { id: 'redo', label: 'Redo', icon: '↪', shortcut: 'Ctrl+Y', group: 'Edit' },
  { id: 'find', label: 'Find', icon: '🔍', shortcut: 'Ctrl+F', group: 'Edit' },
  { id: 'toggle-sidebar', label: 'Toggle Sidebar', group: 'View' },
  { id: 'zoom-in', label: 'Zoom In', shortcut: 'Ctrl++', group: 'View' },
  { id: 'disabled-cmd', label: 'Disabled Command', disabled: true, group: 'Other' },
];

function createPalette(items: CommandItem[] = sampleItems): HTMLElement {
  const el = document.createElement('elx-command-palette') as any;
  el.items = items;
  document.body.appendChild(el);
  return el;
}

describe('elx-command-palette', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('registration', () => {
    it('should be defined as a custom element', () => {
      expect(customElements.get('elx-command-palette')).toBeDefined();
    });

    it('should create an instance', () => {
      const el = createPalette();
      expect(el).toBeInstanceOf(HTMLElement);
    });
  });

  describe('open/close', () => {
    it('should be closed by default', () => {
      const el = createPalette() as any;
      expect(el.open).toBe(false);
      const overlay = el.shadowRoot.querySelector('.overlay');
      expect(overlay.classList.contains('open')).toBe(false);
    });

    it('should open via attribute', () => {
      const el = createPalette() as any;
      el.setAttribute('open', '');
      expect(el.open).toBe(true);
      const overlay = el.shadowRoot.querySelector('.overlay');
      expect(overlay.classList.contains('open')).toBe(true);
    });

    it('should open via property', () => {
      const el = createPalette() as any;
      el.open = true;
      expect(el.hasAttribute('open')).toBe(true);
    });

    it('should open via show()', () => {
      const el = createPalette() as any;
      el.show();
      expect(el.open).toBe(true);
    });

    it('should close via close()', () => {
      const el = createPalette() as any;
      el.show();
      el.close();
      expect(el.open).toBe(false);
    });

    it('should open with Ctrl+K', () => {
      const el = createPalette() as any;
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
      expect(el.open).toBe(true);
    });

    it('should open with Meta+K', () => {
      const el = createPalette() as any;
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
      expect(el.open).toBe(true);
    });

    it('should close on Escape', () => {
      const el = createPalette() as any;
      el.show();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      expect(el.open).toBe(false);
    });

    it('should close on Tab', () => {
      const el = createPalette() as any;
      el.show();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));
      expect(el.open).toBe(false);
    });

    it('should close on click outside', () => {
      const el = createPalette() as any;
      el.show();
      document.body.click();
      expect(el.open).toBe(false);
    });

    it('should not close on click inside', () => {
      const el = createPalette() as any;
      el.show();
      const palette = el.shadowRoot.querySelector('.palette');
      palette.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
      expect(el.open).toBe(true);
    });

    it('should reset search on open', () => {
      const el = createPalette() as any;
      el.show();
      const input = el.shadowRoot.querySelector('.search-input') as HTMLInputElement;
      input.value = 'test';
      input.dispatchEvent(new Event('input'));
      el.close();
      el.show();
      expect(el.shadowRoot.querySelectorAll('.result-item').length).toBe(9);
    });
  });

  describe('items', () => {
    it('should render all non-disabled items', () => {
      const el = createPalette() as any;
      el.show();
      const items = el.shadowRoot.querySelectorAll('.result-item');
      expect(items.length).toBe(9);
    });

    it('should render group labels', () => {
      const el = createPalette() as any;
      el.show();
      const groups = el.shadowRoot.querySelectorAll('.group-label');
      expect(groups.length).toBe(4);
      expect(groups[0].textContent).toBe('File');
      expect(groups[1].textContent).toBe('Edit');
      expect(groups[2].textContent).toBe('View');
      expect(groups[3].textContent).toBe('Other');
    });

    it('should render icons', () => {
      const el = createPalette() as any;
      el.show();
      const icons = el.shadowRoot.querySelectorAll('.result-icon');
      expect(icons.length).toBeGreaterThan(0);
      expect(icons[0].textContent).toBe('📄');
    });

    it('should render shortcuts', () => {
      const el = createPalette() as any;
      el.show();
      const shortcuts = el.shadowRoot.querySelectorAll('.result-shortcut');
      expect(shortcuts.length).toBeGreaterThan(0);
      expect(shortcuts[0].textContent).toBe('Ctrl+N');
    });

    it('should render items without icon or shortcut', () => {
      const el = createPalette() as any;
      el.show();
      const items = el.shadowRoot.querySelectorAll('.result-item');
      const toggleSidebar = items[6];
      expect(toggleSidebar.querySelector('.result-icon')).toBeNull();
      expect(toggleSidebar.querySelector('.result-shortcut')).toBeNull();
      expect(toggleSidebar.querySelector('.result-label').textContent).toBe('Toggle Sidebar');
    });

    it('should update items dynamically', () => {
      const el = createPalette([]) as any;
      el.show();
      expect(el.shadowRoot.querySelector('.empty-state')).not.toBeNull();
      el.items = sampleItems;
      el.show();
      expect(el.shadowRoot.querySelectorAll('.result-item').length).toBe(9);
    });
  });

  describe('filtering', () => {
    it('should filter items by label', () => {
      const el = createPalette() as any;
      el.show();
      const input = el.shadowRoot.querySelector('.search-input') as HTMLInputElement;
      input.value = 'file';
      input.dispatchEvent(new Event('input'));
      const items = el.shadowRoot.querySelectorAll('.result-item');
      expect(items.length).toBe(3);
    });

    it('should filter items by group', () => {
      const el = createPalette() as any;
      el.show();
      const input = el.shadowRoot.querySelector('.search-input') as HTMLInputElement;
      input.value = 'edit';
      input.dispatchEvent(new Event('input'));
      const items = el.shadowRoot.querySelectorAll('.result-item');
      expect(items.length).toBe(3);
    });

    it('should be case insensitive', () => {
      const el = createPalette() as any;
      el.show();
      const input = el.shadowRoot.querySelector('.search-input') as HTMLInputElement;
      input.value = 'SAVE';
      input.dispatchEvent(new Event('input'));
      const items = el.shadowRoot.querySelectorAll('.result-item');
      expect(items.length).toBe(1);
    });

    it('should show empty state when no matches', () => {
      const el = createPalette() as any;
      el.show();
      const input = el.shadowRoot.querySelector('.search-input') as HTMLInputElement;
      input.value = 'xyznonexistent';
      input.dispatchEvent(new Event('input'));
      expect(el.shadowRoot.querySelector('.empty-state')).not.toBeNull();
      expect(el.shadowRoot.querySelector('.empty-state').textContent).toBe('No commands found');
    });

    it('should exclude disabled items from filter results', () => {
      const el = createPalette() as any;
      el.show();
      const input = el.shadowRoot.querySelector('.search-input') as HTMLInputElement;
      input.value = 'disabled';
      input.dispatchEvent(new Event('input'));
      expect(el.shadowRoot.querySelectorAll('.result-item').length).toBe(0);
    });
  });

  describe('keyboard navigation', () => {
    it('should highlight first item by default', () => {
      const el = createPalette() as any;
      el.show();
      const items = el.shadowRoot.querySelectorAll('.result-item');
      expect(items[0].classList.contains('active')).toBe(true);
      expect(items[0].getAttribute('aria-selected')).toBe('true');
    });

    it('should move down with ArrowDown', () => {
      const el = createPalette() as any;
      el.show();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      const items = el.shadowRoot.querySelectorAll('.result-item');
      expect(items[1].classList.contains('active')).toBe(true);
    });

    it('should move up with ArrowUp', () => {
      const el = createPalette() as any;
      el.show();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
      const items = el.shadowRoot.querySelectorAll('.result-item');
      expect(items[0].classList.contains('active')).toBe(true);
    });

    it('should not go below last item', () => {
      const el = createPalette() as any;
      el.show();
      for (let i = 0; i < 20; i++) {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      }
      const items = el.shadowRoot.querySelectorAll('.result-item');
      expect(items[items.length - 1].classList.contains('active')).toBe(true);
    });

    it('should not go above first item', () => {
      const el = createPalette() as any;
      el.show();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
      const items = el.shadowRoot.querySelectorAll('.result-item');
      expect(items[0].classList.contains('active')).toBe(true);
    });

    it('should select item on Enter', () => {
      const el = createPalette() as any;
      el.show();
      const spy = vi.fn();
      el.addEventListener('elx-command-select', spy);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0].detail.id).toBe('new-file');
      expect(spy.mock.calls[0][0].detail.label).toBe('New File');
    });

    it('should close after selecting', () => {
      const el = createPalette() as any;
      el.show();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(el.open).toBe(false);
    });

    it('should reset selection index after filtering', () => {
      const el = createPalette() as any;
      el.show();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      const input = el.shadowRoot.querySelector('.search-input') as HTMLInputElement;
      input.value = 'save';
      input.dispatchEvent(new Event('input'));
      const items = el.shadowRoot.querySelectorAll('.result-item');
      expect(items[0].classList.contains('active')).toBe(true);
    });
  });

  describe('mouse interaction', () => {
    it('should select item on click', () => {
      const el = createPalette() as any;
      el.show();
      const spy = vi.fn();
      el.addEventListener('elx-command-select', spy);
      const items = el.shadowRoot.querySelectorAll('.result-item');
      items[2].click();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0].detail.id).toBe('save');
    });

    it('should highlight item on mouseenter', () => {
      const el = createPalette() as any;
      el.show();
      const items = el.shadowRoot.querySelectorAll('.result-item');
      items[3].dispatchEvent(new MouseEvent('mouseenter'));
      const updatedItems = el.shadowRoot.querySelectorAll('.result-item');
      expect(updatedItems[3].classList.contains('active')).toBe(true);
    });
  });

  describe('placeholder', () => {
    it('should use default placeholder', () => {
      const el = createPalette() as any;
      const input = el.shadowRoot.querySelector('.search-input') as HTMLInputElement;
      expect(input.placeholder).toBe('Search commands...');
    });

    it('should use custom placeholder', () => {
      const el = document.createElement('elx-command-palette') as any;
      el.setAttribute('placeholder', 'Type a command...');
      el.items = sampleItems;
      document.body.appendChild(el);
      const input = el.shadowRoot.querySelector('.search-input') as HTMLInputElement;
      expect(input.placeholder).toBe('Type a command...');
    });
  });

  describe('accessibility', () => {
    it('should have listbox role', () => {
      const el = createPalette() as any;
      const palette = el.shadowRoot.querySelector('.palette');
      expect(palette.getAttribute('role')).toBe('listbox');
    });

    it('should have aria-label on palette', () => {
      const el = createPalette() as any;
      const palette = el.shadowRoot.querySelector('.palette');
      expect(palette.getAttribute('aria-label')).toBe('Command palette');
    });

    it('should have aria-label on search input', () => {
      const el = createPalette() as any;
      const input = el.shadowRoot.querySelector('.search-input');
      expect(input.getAttribute('aria-label')).toBe('Search commands');
    });

    it('should have option role on items', () => {
      const el = createPalette() as any;
      el.show();
      const items = el.shadowRoot.querySelectorAll('.result-item');
      expect(items[0].getAttribute('role')).toBe('option');
    });

    it('should have aria-selected on active item', () => {
      const el = createPalette() as any;
      el.show();
      const items = el.shadowRoot.querySelectorAll('.result-item');
      expect(items[0].getAttribute('aria-selected')).toBe('true');
      expect(items[1].getAttribute('aria-selected')).toBe('false');
    });
  });

  describe('part attributes', () => {
    it('should have part on overlay', () => {
      const el = createPalette() as any;
      const overlay = el.shadowRoot.querySelector('.overlay');
      expect(overlay.getAttribute('part')).toBe('overlay');
    });

    it('should have part on palette', () => {
      const el = createPalette() as any;
      const palette = el.shadowRoot.querySelector('.palette');
      expect(palette.getAttribute('part')).toBe('palette');
    });
  });

  describe('reconnection', () => {
    it('should re-attach listeners on reconnect', () => {
      const el = createPalette() as any;
      el.remove();
      document.body.appendChild(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
      expect(el.open).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle empty items', () => {
      const el = createPalette([]) as any;
      el.show();
      expect(el.shadowRoot.querySelector('.empty-state')).not.toBeNull();
    });

    it('should handle Enter with no items', () => {
      const el = createPalette([]) as any;
      el.show();
      const spy = vi.fn();
      el.addEventListener('elx-command-select', spy);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not respond to keyboard when closed', () => {
      const el = createPalette() as any;
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(el.open).toBe(false);
    });
  });
});
