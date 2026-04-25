const calendarStyles = `
  :host {
    --elx-calendar-bg: var(--elx-color-surface, #ffffff);
    --elx-calendar-border: var(--elx-color-border, #e2e8f0);
    --elx-calendar-text: var(--elx-color-text, #1e293b);
    --elx-calendar-text-muted: var(--elx-color-text-muted, #64748b);
    --elx-calendar-primary: var(--elx-color-primary, #3b82f6);
    --elx-calendar-primary-text: var(--elx-color-on-primary, #ffffff);
    --elx-calendar-radius: var(--elx-radius-md, 0.5rem);
    --elx-calendar-today-bg: var(--elx-color-primary-light, #dbeafe);
    display: block;
    font-family: inherit;
  }

  .calendar {
    background: var(--elx-calendar-bg);
    border: 1px solid var(--elx-calendar-border);
    border-radius: var(--elx-calendar-radius);
    padding: 1rem;
    width: fit-content;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  .month-year {
    font-weight: 600;
    color: var(--elx-calendar-text);
  }

  .nav-buttons {
    display: flex;
    gap: 0.25rem;
  }

  .nav-btn {
    background: transparent;
    border: 1px solid var(--elx-calendar-border);
    border-radius: var(--elx-radius-sm, 0.25rem);
    padding: 0.25rem 0.5rem;
    cursor: pointer;
    color: var(--elx-calendar-text);
    font-size: 0.875rem;
  }

  .nav-btn:hover {
    background: var(--elx-calendar-today-bg);
  }

  .nav-btn:focus-visible {
    outline: 2px solid var(--elx-calendar-primary);
    outline-offset: 2px;
  }

  .weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 0.25rem;
    margin-bottom: 0.5rem;
  }

  .weekday {
    text-align: center;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--elx-calendar-text-muted);
    padding: 0.25rem;
  }

  .days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 0.25rem;
  }

  .day {
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    border-radius: var(--elx-radius-sm, 0.25rem);
    cursor: pointer;
    font-size: 0.875rem;
    color: var(--elx-calendar-text);
    min-width: 2rem;
  }

  .day:hover:not(.disabled):not(.selected) {
    background: var(--elx-calendar-today-bg);
  }

  .day:focus-visible {
    outline: 2px solid var(--elx-calendar-primary);
    outline-offset: 2px;
  }

  .day.other-month {
    color: var(--elx-calendar-text-muted);
    opacity: 0.5;
  }

  .day.today {
    background: var(--elx-calendar-today-bg);
    font-weight: 600;
  }

  .day.selected {
    background: var(--elx-calendar-primary);
    color: var(--elx-calendar-primary-text);
  }

  .day.disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }
`;

export class ElxCalendar extends HTMLElement {
  static observedAttributes = ['value', 'min', 'max', 'disabled'];

  private _value: Date | null = null;
  private _min: Date | null = null;
  private _max: Date | null = null;
  private _currentMonth: number;
  private _currentYear: number;
  private _rendered = false;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    const now = new Date();
    this._currentMonth = now.getMonth();
    this._currentYear = now.getFullYear();
  }

  get value(): Date | null {
    return this._value;
  }

  set value(val: Date | null) {
    if (val) {
      this._value = new Date(val.getTime());
      this._currentMonth = this._value.getMonth();
      this._currentYear = this._value.getFullYear();
    } else {
      this._value = null;
    }
    this._updateSelected();
  }

  get min(): Date | null {
    return this._min;
  }

  set min(val: Date | null) {
    this._min = val ? new Date(val.getTime()) : null;
    this._updateDisabled();
  }

  get max(): Date | null {
    return this._max;
  }

  set max(val: Date | null) {
    this._max = val ? new Date(val.getTime()) : null;
    this._updateDisabled();
  }

  get disabled(): boolean {
    return this.hasAttribute('disabled');
  }

  set disabled(val: boolean) {
    if (val) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }
  }

  connectedCallback() {
    if (!this._rendered) {
      this._render();
      this._rendered = true;
    }
  }

  attributeChangedCallback(name: string, _oldVal: string | null, newVal: string | null) {
    if (name === 'value' && newVal) {
      this.value = new Date(newVal);
    } else if (name === 'min' && newVal) {
      this.min = new Date(newVal);
    } else if (name === 'max' && newVal) {
      this.max = new Date(newVal);
    } else if (name === 'disabled') {
      this._updateDisabled();
    }
  }

  private _render() {
    this.shadowRoot!.innerHTML = `
      <style>${calendarStyles}</style>
      <div class="calendar" role="grid" aria-label="Calendar">
        <div class="header">
          <span class="month-year" aria-live="polite"></span>
          <div class="nav-buttons">
            <button class="nav-btn prev" aria-label="Previous month">&lt;</button>
            <button class="nav-btn next" aria-label="Next month">&gt;</button>
          </div>
        </div>
        <div class="weekdays" role="row"></div>
        <div class="days" role="rowgroup"></div>
      </div>
    `;

    this._renderWeekdays();
    this._renderDays();
    this._attachListeners();
  }

  private _renderWeekdays() {
    const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const container = this.shadowRoot!.querySelector('.weekdays');
    if (!container) return;

    container.innerHTML = weekdays.map(day => 
      `<div class="weekday" role="columnheader">${day}</div>`
    ).join('');
  }

  private _renderDays() {
    const container = this.shadowRoot!.querySelector('.days');
    const monthYear = this.shadowRoot!.querySelector('.month-year');
    if (!container || !monthYear) return;

    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'];
    monthYear.textContent = `${months[this._currentMonth]} ${this._currentYear}`;

    const firstDay = new Date(this._currentYear, this._currentMonth, 1);
    const lastDay = new Date(this._currentYear, this._currentMonth + 1, 0);
    const startDay = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let html = '';

    // Previous month days
    const prevMonthLastDay = new Date(this._currentYear, this._currentMonth, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      html += `<button class="day other-month" data-day="${day}" tabindex="-1">${day}</button>`;
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(this._currentYear, this._currentMonth, i);
      const isToday = date.getTime() === today.getTime();
      const isSelected = this._value && 
        this._value.getDate() === i && 
        this._value.getMonth() === this._currentMonth && 
        this._value.getFullYear() === this._currentYear;
      const isDisabled = this._isDisabled(date);

      let classes = 'day';
      if (isToday) classes += ' today';
      if (isSelected) classes += ' selected';
      if (isDisabled) classes += ' disabled';

      html += `<button class="${classes}" data-day="${i}" role="gridcell" aria-label="${months[this._currentMonth]} ${i}, ${this._currentYear}">${i}</button>`;
    }

    // Next month days
    const remaining = 42 - (startDay + totalDays);
    for (let i = 1; i <= remaining; i++) {
      html += `<button class="day other-month" data-day="${i}" tabindex="-1">${i}</button>`;
    }

    container.innerHTML = html;
  }

  private _isDisabled(date: Date): boolean {
    if (this.disabled) return true;
    const time = date.getTime();
    if (this._min && time < this._min.getTime()) return true;
    if (this._max && time > this._max.getTime()) return true;
    return false;
  }

  private _attachListeners() {
    const prevBtn = this.shadowRoot!.querySelector('.prev');
    const nextBtn = this.shadowRoot!.querySelector('.next');
    const daysContainer = this.shadowRoot!.querySelector('.days');

    prevBtn?.addEventListener('click', () => this._prevMonth());
    nextBtn?.addEventListener('click', () => this._nextMonth());
    daysContainer?.addEventListener('click', (e) => this._handleDayClick(e as MouseEvent));
  }

  private _prevMonth() {
    if (this._currentMonth === 0) {
      this._currentMonth = 11;
      this._currentYear--;
    } else {
      this._currentMonth--;
    }
    this._renderDays();
  }

  private _nextMonth() {
    if (this._currentMonth === 11) {
      this._currentMonth = 0;
      this._currentYear++;
    } else {
      this._currentMonth++;
    }
    this._renderDays();
  }

  private _handleDayClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (!target.classList.contains('day')) return;
    if (target.classList.contains('disabled')) return;
    if (target.classList.contains('other-month')) return;

    const day = parseInt(target.dataset.day || '0', 10);
    this._value = new Date(this._currentYear, this._currentMonth, day);
    this._updateSelected();

    this.dispatchEvent(new CustomEvent('elx-calendar-change', {
      detail: { value: this._value },
      bubbles: true,
      composed: true
    }));
  }

  private _updateSelected() {
    const days = this.shadowRoot!.querySelectorAll('.day:not(.other-month)');
    days.forEach(day => {
      const dayNum = parseInt((day as HTMLElement).dataset.day || '0', 10);
      const isSelected = this._value && 
        this._value.getDate() === dayNum && 
        this._value.getMonth() === this._currentMonth && 
        this._value.getFullYear() === this._currentYear;
      day.classList.toggle('selected', isSelected);
      if (isSelected) {
        day.setAttribute('aria-selected', 'true');
      } else {
        day.removeAttribute('aria-selected');
      }
    });
  }

  private _updateDisabled() {
    const days = this.shadowRoot!.querySelectorAll('.day:not(.other-month)');
    days.forEach(day => {
      const dayNum = parseInt((day as HTMLElement).dataset.day || '0', 10);
      const date = new Date(this._currentYear, this._currentMonth, dayNum);
      day.classList.toggle('disabled', this._isDisabled(date));
    });
  }
}

if (!customElements.get('elx-calendar')) {
  customElements.define('elx-calendar', ElxCalendar);
}
