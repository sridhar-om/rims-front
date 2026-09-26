import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, signal, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DashboardComponent } from '../dashboard.component';
import { INITIAL_MOLECULE_RECORDS, MoleculeRecord } from '../models/dashboard.model';
import { GridScrollerComponent } from '../../shared/grid-scroller/grid-scroller.component';
import { PaginatorComponent } from '../../shared/paginator/paginator.component';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    GridScrollerComponent,
    PaginatorComponent,
  ],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss',
})
export class PortfolioComponent {
  @ViewChild('tableContainer') tableContainer!: ElementRef<HTMLDivElement>;

  private readonly dashboard = inject(DashboardComponent, { optional: true });

  // Horizontal table scrolling
  scrollLeft(): void {
    if (this.tableContainer?.nativeElement) {
      this.tableContainer.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }

  scrollRight(): void {
    if (this.tableContainer?.nativeElement) {
      this.tableContainer.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }

  updateScrollState(): void { }

  // Optional inputs for standalone usage
  readonly filterMolecule = input<string>('All molecule');
  readonly filterProduct = input<string>('All product');
  readonly filterCountry = input<string>('All country');
  readonly filterRegion = input<string>('All region');
  readonly filterRegulatoryContext = input<string>('All regulatory context');

  // Pagination State (Default 10 rows)
  readonly pageSize = signal<number>(10);
  readonly currentPage = signal<number>(1);

  // 15 Molecule Records
  readonly allRecords = signal<MoleculeRecord[]>(INITIAL_MOLECULE_RECORDS);

  // Filtered List
  readonly filteredRecords = computed(() => {
    let list = this.allRecords();
    const mol = this.dashboard ? this.dashboard.filterMolecule() : this.filterMolecule();

    if (mol && mol !== 'All molecule') {
      list = list.filter((r) => r.molecule === mol);
    }
    return list;
  });

  // Sorting State
  readonly sortColumn = signal<string>('');
  readonly sortDirection = signal<'asc' | 'desc' | ''>('');

  readonly columns: { key: keyof MoleculeRecord; label: string; align: 'left' | 'center' }[] = [
    { key: 'molecule', label: 'Molecule', align: 'left' },
    { key: 'submittedCountries', label: 'Submitted Countries', align: 'center' },
    { key: 'notSubmittedCountries', label: 'Not Submitted Countries', align: 'center' },
    { key: 'products', label: 'Products', align: 'center' },
    { key: 'variantsSku', label: 'Variants (SKU)', align: 'center' },
    { key: 'submissions', label: 'Submissions', align: 'center' },
    { key: 'rejections', label: 'Rejections', align: 'center' },
    { key: 'overdueActivity', label: 'Overdue Activity', align: 'center' },
    { key: 'blackout', label: 'Blackout', align: 'center' },
    { key: 'healthy', label: 'Healthy', align: 'center' },
  ];

  onSort(colKey: string): void {
    if (this.sortColumn() === colKey) {
      if (this.sortDirection() === 'asc') {
        this.sortDirection.set('desc');
      } else if (this.sortDirection() === 'desc') {
        this.sortDirection.set('');
        this.sortColumn.set('');
      } else {
        this.sortDirection.set('asc');
      }
    } else {
      this.sortColumn.set(colKey);
      this.sortDirection.set('asc');
    }
  }

  readonly sortedRecords = computed(() => {
    let list = [...this.filteredRecords()];
    const col = this.sortColumn();
    const dir = this.sortDirection();
    if (col && dir) {
      list.sort((a, b) => {
        const valA = (a as unknown as Record<string, unknown>)[col];
        const valB = (b as unknown as Record<string, unknown>)[col];
        if (valA === valB) return 0;
        if (valA === null || valA === undefined || valA === '') return 1;
        if (valB === null || valB === undefined || valB === '') return -1;
        let comp = 0;
        if (typeof valA === 'number' && typeof valB === 'number') {
          comp = valA - valB;
        } else {
          comp = String(valA).localeCompare(String(valB));
        }
        return dir === 'asc' ? comp : -comp;
      });
    }
    return list;
  });

  // Summary Metrics
  readonly metricMolecules = computed(() => this.filteredRecords().length);
  readonly metricProducts = signal<number>(14);
  readonly metricTotalSubmissions = signal<number>(257);
  readonly metricOverdueActivity = signal<number>(16);

  // Pagination Computations
  readonly totalPages = computed(() => {
    const count = this.sortedRecords().length;
    const size = this.pageSize();
    return Math.max(1, Math.ceil(count / size));
  });

  readonly paginatedRecords = computed(() => {
    const list = this.sortedRecords();
    const size = this.pageSize();
    const page = Math.min(this.currentPage(), this.totalPages());
    const start = (page - 1) * size;
    return list.slice(start, start + size);
  });

  readonly startItemIndex = computed(() => {
    const total = this.filteredRecords().length;
    if (total === 0) return 0;
    const page = Math.min(this.currentPage(), this.totalPages());
    return (page - 1) * this.pageSize() + 1;
  });

  readonly endItemIndex = computed(() => {
    const total = this.filteredRecords().length;
    const page = Math.min(this.currentPage(), this.totalPages());
    return Math.min(page * this.pageSize(), total);
  });

  onPageSizeChange(newSize: number): void {
    this.pageSize.set(Number(newSize));
    this.currentPage.set(1);
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((p) => p - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((p) => p + 1);
    }
  }
}
