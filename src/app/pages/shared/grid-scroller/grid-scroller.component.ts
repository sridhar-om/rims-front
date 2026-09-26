import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-grid-scroller',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './grid-scroller.component.html',
  styleUrl: './grid-scroller.component.scss',
})
export class GridScrollerComponent {
  /** Target scrollable HTML element (e.g. table container wrapper) */
  @Input() target?: HTMLElement | null;

  /** Amount of pixels to scroll per click */
  @Input() scrollStep: number = 320;

  /** Tooltip for the left scroll button */
  @Input() leftTooltip: string = 'Scroll table left';

  /** Tooltip for the right scroll button */
  @Input() rightTooltip: string = 'Scroll table right';

  /** Event emitted when left button is clicked */
  @Output() scrollLeftClick = new EventEmitter<void>();

  /** Event emitted when right button is clicked */
  @Output() scrollRightClick = new EventEmitter<void>();

  scrollLeft(): void {
    if (this.target) {
      this.target.scrollBy({ left: -this.scrollStep, behavior: 'smooth' });
    }
    this.scrollLeftClick.emit();
  }

  scrollRight(): void {
    if (this.target) {
      this.target.scrollBy({ left: this.scrollStep, behavior: 'smooth' });
    }
    this.scrollRightClick.emit();
  }
}
