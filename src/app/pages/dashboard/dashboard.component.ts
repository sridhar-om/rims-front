import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { INITIAL_MOLECULE_RECORDS, MoleculeRecord } from './models/dashboard.model';

export type { MoleculeRecord } from './models/dashboard.model';

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
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private readonly router = inject(Router);

  // Navigation View Tab
  readonly activeTab = signal<string>('Portfolio');

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
  readonly filterMolecule = signal<string>('All molecule');
  readonly filterProduct = signal<string>('All product');
  readonly filterCountry = signal<string>('All country');
  readonly filterRegion = signal<string>('All region');
  readonly filterRegulatoryContext = signal<string>('All regulatory context');

  // Molecule records for global filter dropdown
  readonly allRecords = signal<MoleculeRecord[]>(INITIAL_MOLECULE_RECORDS);

  ngOnInit(): void {
    this.updateActiveTab(this.router.url);
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.updateActiveTab(event.urlAfterRedirects);
      });
  }

  private updateActiveTab(url: string): void {
    const matched = this.tabs.find((t) => url.toLowerCase().includes(`/${t.label.toLowerCase()}`));
    if (matched) {
      this.activeTab.set(matched.label);
    }
  }

  setTab(tab: string): void {
    this.activeTab.set(tab);
    this.router.navigate([`/dashboard/${tab.toLowerCase()}`]);
  }

  resetFilters(): void {
    this.filterMolecule.set('All molecule');
    this.filterProduct.set('All product');
    this.filterCountry.set('All country');
    this.filterRegion.set('All region');
    this.filterRegulatoryContext.set('All regulatory context');
  }
}
