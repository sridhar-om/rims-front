import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
})
export class PaginatorComponent {
  /** Total count of records */
  @Input() totalItems: number = 0;

  /** Number of items per page */
  @Input() pageSize: number = 10;

  /** Current active page index (1-based) */
  @Input() currentPage: number = 1;

  /** Dropdown options for items per page */
  @Input() pageSizeOptions: number[] = [5, 10, 25, 50];

  /** Emitted when page number changes */
  @Output() pageChange = new EventEmitter<number>();

  /** Emitted when page size is changed */
  @Output() pageSizeChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalItems / this.pageSize));
  }

  get startItemIndex(): number {
    if (this.totalItems === 0) return 0;
    const page = Math.min(this.currentPage, this.totalPages);
    return (page - 1) * this.pageSize + 1;
  }

  get endItemIndex(): number {
    if (this.totalItems === 0) return 0;
    const page = Math.min(this.currentPage, this.totalPages);
    return Math.min(page * this.pageSize, this.totalItems);
  }

  get countDisplay(): string {
    if (this.totalItems === 0) return '0 of 0';
    return `${this.startItemIndex} - ${this.endItemIndex} of ${this.totalItems}`;
  }

  onSelectPageSize(size: any): void {
    const numSize = Number(size);
    this.pageSizeChange.emit(numSize);
    const newTotalPages = Math.max(1, Math.ceil(this.totalItems / numSize));
    if (this.currentPage > newTotalPages) {
      this.pageChange.emit(1);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.pageChange.emit(this.currentPage + 1);
    }
  }
}
