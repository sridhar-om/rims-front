import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface CalendarDayCell {
  day: number | null;
  count: number | null;
}

export interface CalendarCategory {
  id: string;
  title: string;
  headerClass: string;
  highlightClass: string;
  countColorClass: string;
  cells: CalendarDayCell[];
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent {
  // Top 6 Metrics
  readonly metrics = signal({
    new: 247,
    verified: 189,
    authorized: 163,
    scheduled: 312,
    completed: 278,
    claimed: 141,
  });

  readonly currentMonth = signal<string>('Sep 2026');
  readonly selectedDay = signal<number>(22);

  readonly weekdays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  // Months for navigation
  private readonly months = ['Aug 2026', 'Sep 2026', 'Oct 2026', 'Nov 2026'];
  private currentMonthIdx = 1;

  // 4 Category Calendars
  readonly categories: CalendarCategory[] = [
    {
      id: 'filing',
      title: 'FILING',
      headerClass: 'header-filing',
      highlightClass: 'highlight-filing',
      countColorClass: 'count-filing',
      cells: [
        { day: null, count: null },
        { day: 1, count: 8 },
        { day: 2, count: 15 },
        { day: 3, count: 3 },
        { day: 4, count: 10 },
        { day: 5, count: 17 },
        { day: 6, count: 5 },
        { day: 7, count: 12 },
        { day: 8, count: 19 },
        { day: 9, count: 7 },
        { day: 10, count: 14 },
        { day: 11, count: 21 },
        { day: 12, count: 9 },
        { day: 13, count: 16 },
        { day: 14, count: 4 },
        { day: 15, count: 11 },
        { day: 16, count: 18 },
        { day: 17, count: 6 },
        { day: 18, count: 13 },
        { day: 19, count: 20 },
        { day: 20, count: 8 },
        { day: 21, count: 15 },
        { day: 22, count: 3 },
        { day: 23, count: 10 },
        { day: 24, count: 17 },
        { day: 25, count: 5 },
        { day: 26, count: 12 },
        { day: 27, count: 19 },
        { day: 28, count: 7 },
        { day: 29, count: 14 },
        { day: 30, count: 21 },
        { day: null, count: null },
        { day: null, count: null },
        { day: null, count: null },
        { day: null, count: null },
      ],
    },
    {
      id: 'submission',
      title: 'SUBMISSION',
      headerClass: 'header-submission',
      highlightClass: 'highlight-submission',
      countColorClass: 'count-submission',
      cells: [
        { day: null, count: null },
        { day: 1, count: 13 },
        { day: 2, count: 20 },
        { day: 3, count: 8 },
        { day: 4, count: 15 },
        { day: 5, count: 3 },
        { day: 6, count: 10 },
        { day: 7, count: 17 },
        { day: 8, count: 5 },
        { day: 9, count: 12 },
        { day: 10, count: 19 },
        { day: 11, count: 7 },
        { day: 12, count: 14 },
        { day: 13, count: 21 },
        { day: 14, count: 9 },
        { day: 15, count: 16 },
        { day: 16, count: 4 },
        { day: 17, count: 11 },
        { day: 18, count: 18 },
        { day: 19, count: 6 },
        { day: 20, count: 13 },
        { day: 21, count: 20 },
        { day: 22, count: 8 },
        { day: 23, count: 15 },
        { day: 24, count: 3 },
        { day: 25, count: 10 },
        { day: 26, count: 17 },
        { day: 27, count: 5 },
        { day: 28, count: 12 },
        { day: 29, count: 19 },
        { day: 30, count: 7 },
        { day: null, count: null },
        { day: null, count: null },
        { day: null, count: null },
        { day: null, count: null },
      ],
    },
    {
      id: 'approved',
      title: 'APPROVED',
      headerClass: 'header-approved',
      highlightClass: 'highlight-approved',
      countColorClass: 'count-approved',
      cells: [
        { day: null, count: null },
        { day: 1, count: 18 },
        { day: 2, count: 6 },
        { day: 3, count: 13 },
        { day: 4, count: 20 },
        { day: 5, count: 8 },
        { day: 6, count: 15 },
        { day: 7, count: 3 },
        { day: 8, count: 10 },
        { day: 9, count: 17 },
        { day: 10, count: 5 },
        { day: 11, count: 12 },
        { day: 12, count: 19 },
        { day: 13, count: 7 },
        { day: 14, count: 14 },
        { day: 15, count: 21 },
        { day: 16, count: 9 },
        { day: 17, count: 16 },
        { day: 18, count: 4 },
        { day: 19, count: 11 },
        { day: 20, count: 18 },
        { day: 21, count: 6 },
        { day: 22, count: 13 },
        { day: 23, count: 20 },
        { day: 24, count: 8 },
        { day: 25, count: 15 },
        { day: 26, count: 3 },
        { day: 27, count: 10 },
        { day: 28, count: 17 },
        { day: 29, count: 5 },
        { day: 30, count: 12 },
        { day: null, count: null },
        { day: null, count: null },
        { day: null, count: null },
        { day: null, count: null },
      ],
    },
    {
      id: 'due',
      title: 'DUE',
      headerClass: 'header-due',
      highlightClass: 'highlight-due',
      countColorClass: 'count-due',
      cells: [
        { day: null, count: null },
        { day: 1, count: 4 },
        { day: 2, count: 11 },
        { day: 3, count: 18 },
        { day: 4, count: 6 },
        { day: 5, count: 13 },
        { day: 6, count: 20 },
        { day: 7, count: 8 },
        { day: 8, count: 15 },
        { day: 9, count: 3 },
        { day: 10, count: 10 },
        { day: 11, count: 17 },
        { day: 12, count: 5 },
        { day: 13, count: 12 },
        { day: 14, count: 19 },
        { day: 15, count: 7 },
        { day: 16, count: 14 },
        { day: 17, count: 21 },
        { day: 18, count: 9 },
        { day: 19, count: 16 },
        { day: 20, count: 4 },
        { day: 21, count: 11 },
        { day: 22, count: 18 },
        { day: 23, count: 6 },
        { day: 24, count: 13 },
        { day: 25, count: 20 },
        { day: 26, count: 8 },
        { day: 27, count: 15 },
        { day: 28, count: 3 },
        { day: 29, count: 10 },
        { day: 30, count: 17 },
        { day: null, count: null },
        { day: null, count: null },
        { day: null, count: null },
        { day: null, count: null },
      ],
    },
  ];

  selectDay(day: number | null): void {
    if (day !== null) {
      this.selectedDay.set(day);
    }
  }

  prevMonth(): void {
    if (this.currentMonthIdx > 0) {
      this.currentMonthIdx--;
      this.currentMonth.set(this.months[this.currentMonthIdx]);
    }
  }

  nextMonth(): void {
    if (this.currentMonthIdx < this.months.length - 1) {
      this.currentMonthIdx++;
      this.currentMonth.set(this.months[this.currentMonthIdx]);
    }
  }
}
