import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './calendar';

describe('ElxCalendar', () => {
  let el: any;

  beforeEach(() => {
    el = document.createElement('elx-calendar');
    document.body.appendChild(el);
  });

  afterEach(() => {
    el.remove();
  });

  it('registers custom element', () => {
    expect(customElements.get('elx-calendar')).toBeDefined();
  });

  it('renders with grid role', () => {
    const grid = el.shadowRoot.querySelector('.calendar');
    expect(grid.getAttribute('role')).toBe('grid');
    expect(grid.getAttribute('aria-label')).toBe('Calendar');
  });

  it('renders weekday headers', () => {
    const weekdays = el.shadowRoot.querySelectorAll('.weekday');
    expect(weekdays.length).toBe(7);
    expect(weekdays[0].textContent).toBe('Su');
    expect(weekdays[6].textContent).toBe('Sa');
  });

  it('renders day buttons', () => {
    const days = el.shadowRoot.querySelectorAll('.day:not(.other-month)');
    expect(days.length).toBeGreaterThan(27);
    expect(days.length).toBeLessThan(32);
  });

  it('shows month and year in header', () => {
    const monthYear = el.shadowRoot.querySelector('.month-year');
    expect(monthYear.textContent).toMatch(/\w+ \d{4}/);
  });

  it('navigates to previous month', () => {
    const prevBtn = el.shadowRoot.querySelector('.prev');
    const monthYear = el.shadowRoot.querySelector('.month-year');
    const initial = monthYear.textContent;
    prevBtn.click();
    expect(monthYear.textContent).not.toBe(initial);
  });

  it('navigates to next month', () => {
    const nextBtn = el.shadowRoot.querySelector('.next');
    const monthYear = el.shadowRoot.querySelector('.month-year');
    const initial = monthYear.textContent;
    nextBtn.click();
    expect(monthYear.textContent).not.toBe(initial);
  });

  it('wraps from January to December', () => {
    el._currentMonth = 0;
    el._currentYear = 2025;
    el._prevMonth();
    expect(el._currentMonth).toBe(11);
    expect(el._currentYear).toBe(2024);
  });

  it('wraps from December to January', () => {
    el._currentMonth = 11;
    el._currentYear = 2024;
    el._nextMonth();
    expect(el._currentMonth).toBe(0);
    expect(el._currentYear).toBe(2025);
  });

  it('selects a day on click', () => {
    const days = el.shadowRoot.querySelectorAll('.day:not(.other-month):not(.disabled)');
    let changed = false;
    el.addEventListener('elx-calendar-change', () => { changed = true; });
    days[10].click();
    expect(days[10].classList.contains('selected')).toBe(true);
    expect(changed).toBe(true);
    expect(el.value).toBeInstanceOf(Date);
  });

  it('sets aria-selected on selected day', () => {
    const days = el.shadowRoot.querySelectorAll('.day:not(.other-month):not(.disabled)');
    days[5].click();
    expect(days[5].getAttribute('aria-selected')).toBe('true');
  });

  it('does not select disabled days', () => {
    el.min = new Date(2099, 0, 1);
    el._currentMonth = 0;
    el._currentYear = 2025;
    el._renderDays();
    const days = el.shadowRoot.querySelectorAll('.day:not(.other-month)');
    let changed = false;
    el.addEventListener('elx-calendar-change', () => { changed = true; });
    days[0].click();
    expect(changed).toBe(false);
  });

  it('does not select other-month days', () => {
    const otherDays = el.shadowRoot.querySelectorAll('.day.other-month');
    if (otherDays.length > 0) {
      let changed = false;
      el.addEventListener('elx-calendar-change', () => { changed = true; });
      otherDays[0].click();
      expect(changed).toBe(false);
    }
  });

  it('sets value programmatically', () => {
    el.value = new Date(2025, 5, 15);
    expect(el._currentMonth).toBe(5);
    expect(el._currentYear).toBe(2025);
  });

  it('disables days before min', () => {
    el._currentMonth = 0;
    el._currentYear = 2025;
    el._renderDays();
    el.min = new Date(2025, 0, 15);
    const days = el.shadowRoot.querySelectorAll('.day:not(.other-month)');
    expect(days[0].classList.contains('disabled')).toBe(true);
    expect(days[14].classList.contains('disabled')).toBe(false);
  });

  it('disables days after max', () => {
    el._currentMonth = 0;
    el._currentYear = 2025;
    el._renderDays();
    el.max = new Date(2025, 0, 15);
    const days = el.shadowRoot.querySelectorAll('.day:not(.other-month)');
    expect(days[14].classList.contains('disabled')).toBe(false);
    expect(days[20].classList.contains('disabled')).toBe(true);
  });

  it('disables all days when disabled attribute set', () => {
    el.disabled = true;
    el._renderDays();
    const days = el.shadowRoot.querySelectorAll('.day:not(.other-month)');
    const allDisabled = Array.prototype.every.call(days, (d: Element) => d.classList.contains('disabled'));
    expect(allDisabled).toBe(true);
  });

  it('highlights today', () => {
    const today = new Date();
    el._currentMonth = today.getMonth();
    el._currentYear = today.getFullYear();
    el._renderDays();
    const todayEl = el.shadowRoot.querySelector('.day.today');
    expect(todayEl).not.toBeNull();
    expect(todayEl.textContent).toBe(String(today.getDate()));
  });

  it('has aria-label on day buttons', () => {
    const days = el.shadowRoot.querySelectorAll('.day:not(.other-month)');
    expect(days[0].getAttribute('aria-label')).toMatch(/\w+ \d+, \d{4}/);
  });

  it('has aria-live on month-year', () => {
    const monthYear = el.shadowRoot.querySelector('.month-year');
    expect(monthYear.getAttribute('aria-live')).toBe('polite');
  });

  it('prev button has aria-label', () => {
    const prev = el.shadowRoot.querySelector('.prev');
    expect(prev.getAttribute('aria-label')).toBe('Previous month');
  });

  it('next button has aria-label', () => {
    const next = el.shadowRoot.querySelector('.next');
    expect(next.getAttribute('aria-label')).toBe('Next month');
  });

  it('sets value to null', () => {
    el.value = new Date(2025, 0, 1);
    el.value = null;
    expect(el.value).toBeNull();
  });

  it('responds to value attribute', () => {
    el.setAttribute('value', '2025-06-15');
    expect(el._currentMonth).toBe(5);
  });
});
