import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

export interface MoleculeRecord {
  id: number;
  molecule: string;
  submittedCountries: number;
  notSubmittedCountries: number;
  products: number;
  variantsSku: number;
  submissions: number;
  rejections: number;
  overdueActivity: number;
  blackout: string;
  healthy: number;
}

import { KanbanComponent } from './kanban/kanban.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    KanbanComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  // Navigation View Tab
  activeTab = signal<string>('Portfolio');

  readonly tabs = [
    { label: 'Portfolio', icon: 'folder' },
    { label: 'Kanban', icon: 'view_kanban' },
    { label: 'Calendar', icon: 'calendar_today' },
    { label: 'Map', icon: 'public' },
    { label: 'Tree', icon: 'account_tree' },
    { label: 'Alerts', icon: 'warning_amber' },
    { label: 'Pipeline', icon: 'timeline' },
    { label: 'Approval', icon: 'check_circle_outline' },
  ];

  // Global Filters
  filterMolecule = signal<string>('All molecule');
  filterProduct = signal<string>('All product');
  filterCountry = signal<string>('All country');
  filterRegion = signal<string>('All region');
  filterRegulatoryContext = signal<string>('All regulatory context');

  // Pagination State (Default 10 rows)
  pageSize = signal<number>(10);
  currentPage = signal<number>(1);

  // 15 Molecule Records
  readonly allRecords = signal<MoleculeRecord[]>([
    {
      id: 1,
      molecule: 'Enoxaparin Sodium',
      submittedCountries: 40,
      notSubmittedCountries: 12,
      products: 3,
      variantsSku: 9,
      submissions: 52,
      rejections: 3,
      overdueActivity: 4,
      blackout: '2/40',
      healthy: 86,
    },
    {
      id: 2,
      molecule: 'Atorvastatin',
      submittedCountries: 34,
      notSubmittedCountries: 18,
      products: 3,
      variantsSku: 12,
      submissions: 61,
      rejections: 5,
      overdueActivity: 2,
      blackout: '1/34',
      healthy: 91,
    },
    {
      id: 3,
      molecule: 'Ceftriaxone',
      submittedCountries: 22,
      notSubmittedCountries: 30,
      products: 2,
      variantsSku: 6,
      submissions: 29,
      rejections: 4,
      overdueActivity: 6,
      blackout: '3/22',
      healthy: 72,
    },
    {
      id: 4,
      molecule: 'Iohexol',
      submittedCountries: 18,
      notSubmittedCountries: 34,
      products: 2,
      variantsSku: 4,
      submissions: 24,
      rejections: 1,
      overdueActivity: 1,
      blackout: '0/18',
      healthy: 94,
    },
    {
      id: 5,
      molecule: 'Ondansetron',
      submittedCountries: 27,
      notSubmittedCountries: 25,
      products: 2,
      variantsSku: 5,
      submissions: 33,
      rejections: 2,
      overdueActivity: 3,
      blackout: '1/27',
      healthy: 83,
    },
    {
      id: 6,
      molecule: 'Metformin HCl',
      submittedCountries: 44,
      notSubmittedCountries: 8,
      products: 2,
      variantsSku: 7,
      submissions: 58,
      rejections: 2,
      overdueActivity: 0,
      blackout: '0/44',
      healthy: 96,
    },
    {
      id: 7,
      molecule: 'Amlodipine Besylate',
      submittedCountries: 38,
      notSubmittedCountries: 14,
      products: 3,
      variantsSku: 8,
      submissions: 48,
      rejections: 1,
      overdueActivity: 2,
      blackout: '1/38',
      healthy: 92,
    },
    {
      id: 8,
      molecule: 'Pantoprazole',
      submittedCountries: 31,
      notSubmittedCountries: 21,
      products: 2,
      variantsSku: 6,
      submissions: 39,
      rejections: 3,
      overdueActivity: 1,
      blackout: '2/31',
      healthy: 88,
    },
    {
      id: 9,
      molecule: 'Rosuvastatin',
      submittedCountries: 29,
      notSubmittedCountries: 23,
      products: 3,
      variantsSku: 10,
      submissions: 45,
      rejections: 2,
      overdueActivity: 4,
      blackout: '1/29',
      healthy: 85,
    },
    {
      id: 10,
      molecule: 'Levofloxacin',
      submittedCountries: 25,
      notSubmittedCountries: 27,
      products: 2,
      variantsSku: 5,
      submissions: 31,
      rejections: 4,
      overdueActivity: 5,
      blackout: '2/25',
      healthy: 79,
    },
    {
      id: 11,
      molecule: 'Azithromycin',
      submittedCountries: 42,
      notSubmittedCountries: 10,
      products: 4,
      variantsSku: 11,
      submissions: 56,
      rejections: 1,
      overdueActivity: 1,
      blackout: '0/42',
      healthy: 95,
    },
    {
      id: 12,
      molecule: 'Paracetamol',
      submittedCountries: 48,
      notSubmittedCountries: 4,
      products: 3,
      variantsSku: 8,
      submissions: 64,
      rejections: 0,
      overdueActivity: 0,
      blackout: '0/48',
      healthy: 99,
    },
    {
      id: 13,
      molecule: 'Ibuprofen',
      submittedCountries: 36,
      notSubmittedCountries: 16,
      products: 2,
      variantsSku: 7,
      submissions: 42,
      rejections: 2,
      overdueActivity: 2,
      blackout: '1/36',
      healthy: 90,
    },
    {
      id: 14,
      molecule: 'Omeprazole',
      submittedCountries: 33,
      notSubmittedCountries: 19,
      products: 3,
      variantsSku: 9,
      submissions: 44,
      rejections: 3,
      overdueActivity: 3,
      blackout: '2/33',
      healthy: 84,
    },
    {
      id: 15,
      molecule: 'Clopidogrel',
      submittedCountries: 35,
      notSubmittedCountries: 17,
      products: 2,
      variantsSku: 6,
      submissions: 40,
      rejections: 1,
      overdueActivity: 1,
      blackout: '1/35',
      healthy: 93,
    },
  ]);

  // Filtered List
  filteredRecords = computed(() => {
    let list = this.allRecords();
    const mol = this.filterMolecule();

    if (mol && mol !== 'All molecule') {
      list = list.filter((r) => r.molecule === mol);
    }
    return list;
  });

  // Summary Metrics
  metricMolecules = computed(() => this.filteredRecords().length);
  metricProducts = signal<number>(14);
  metricTotalSubmissions = signal<number>(257);
  metricOverdueActivity = signal<number>(16);

  // Pagination Computations
  totalPages = computed(() => {
    const count = this.filteredRecords().length;
    const size = this.pageSize();
    return Math.max(1, Math.ceil(count / size));
  });

  paginatedRecords = computed(() => {
    const list = this.filteredRecords();
    const size = this.pageSize();
    const page = Math.min(this.currentPage(), this.totalPages());
    const start = (page - 1) * size;
    return list.slice(start, start + size);
  });

  startItemIndex = computed(() => {
    const total = this.filteredRecords().length;
    if (total === 0) return 0;
    const page = Math.min(this.currentPage(), this.totalPages());
    return (page - 1) * this.pageSize() + 1;
  });

  endItemIndex = computed(() => {
    const total = this.filteredRecords().length;
    const page = Math.min(this.currentPage(), this.totalPages());
    return Math.min(page * this.pageSize(), total);
  });

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  ngOnInit(): void {
    const tabParam = this.route.snapshot.queryParams['tab'];
    if (tabParam) {
      const matched = this.tabs.find((t) => t.label.toLowerCase() === tabParam.toLowerCase());
      if (matched) {
        this.activeTab.set(matched.label);
      }
    }
  }

  setTab(tab: string): void {
    this.activeTab.set(tab);
    this.router.navigate([], { queryParams: { tab }, queryParamsHandling: 'merge' });
  }

  resetFilters(): void {
    this.filterMolecule.set('All molecule');
    this.filterProduct.set('All product');
    this.filterCountry.set('All country');
    this.filterRegion.set('All region');
    this.filterRegulatoryContext.set('All regulatory context');
    this.currentPage.set(1);
  }

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
