import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { GridScrollerComponent } from '../../shared/grid-scroller/grid-scroller.component';
import { PaginatorComponent } from '../../shared/paginator/paginator.component';
import { DashboardComponent } from '../dashboard.component';

export interface AlertItem {
  id: string;
  category: 'Submission' | 'Filing' | 'Declined' | 'Approved';
  severity: 'High' | 'Medium' | 'Low';
  message: string;
  molecule: string;
  product: string;
  country: string;
  regulatoryContext: string;
  raisedOn: string;
  status: 'Open' | 'Escalated' | 'Closed' | 'In Progress' | 'Overdue';
}

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule, MatIconModule, GridScrollerComponent, PaginatorComponent],
  templateUrl: './alerts.component.html',
  styleUrl: './alerts.component.scss',
})
export class AlertsComponent {
  private readonly dashboard = inject(DashboardComponent, { optional: true });

  // Sorting & pagination signals
  readonly sortColumn = signal<string>('');
  readonly sortDirection = signal<'asc' | 'desc' | ''>('');
  readonly pageSize = signal<number>(10);
  readonly currentPage = signal<number>(1);

  // Column definitions
  readonly columns: { key: keyof AlertItem; label: string }[] = [
    { key: 'id', label: 'Alert ID' },
    { key: 'category', label: 'Category' },
    { key: 'severity', label: 'Severity' },
    { key: 'message', label: 'Message' },
    { key: 'molecule', label: 'Molecule' },
    { key: 'product', label: 'Product' },
    { key: 'country', label: 'Country' },
    { key: 'regulatoryContext', label: 'Regulatory Context' },
    { key: 'raisedOn', label: 'Raised On' },
    { key: 'status', label: 'Status' },
  ];

  readonly alerts = signal<AlertItem[]>([
    {
      id: 'ALR-701',
      category: 'Submission',
      severity: 'High',
      message: 'Submission dossier incomplete - Module 3 missing',
      molecule: 'Enoxaparin Sodium',
      product: 'Enoxalow 40 mg',
      country: 'Spain',
      regulatoryContext: 'Highly Regulated',
      raisedOn: '19 Sept 2026',
      status: 'Open',
    },
    {
      id: 'ALR-702',
      category: 'Filing',
      severity: 'Medium',
      message: 'Filing fee payment pending beyond 15 days',
      molecule: 'Atorvastatin',
      product: 'Atorvex 20 mg',
      country: 'Poland',
      regulatoryContext: 'Semi Regulated',
      raisedOn: '14 Sept 2026',
      status: 'Open',
    },
    {
      id: 'ALR-703',
      category: 'Declined',
      severity: 'High',
      message: 'Application declined - bioequivalence data rejected',
      molecule: 'Ceftriaxone',
      product: 'Ceftrimax 500 mg',
      country: 'Nigeria',
      regulatoryContext: 'Lightly Regulated',
      raisedOn: '22 Jul 2026',
      status: 'Escalated',
    },
    {
      id: 'ALR-704',
      category: 'Approved',
      severity: 'Low',
      message: 'Approval received - update launch plan',
      molecule: 'Metformin HCl',
      product: 'Metfosure 1000 XR',
      country: 'India',
      regulatoryContext: 'Semi Regulated',
      raisedOn: '28 Aug 2026',
      status: 'Closed',
    },
    {
      id: 'ALR-705',
      category: 'Submission',
      severity: 'Medium',
      message: 'Blackout - no authority response for 90 days',
      molecule: 'Iohexol',
      product: 'Iolexa Inject 300',
      country: 'Saudi Arabia',
      regulatoryContext: 'Semi Regulated',
      raisedOn: '30 Jun 2026',
      status: 'Open',
    },
    {
      id: 'ALR-706',
      category: 'Filing',
      severity: 'Medium',
      message: 'Filing due in 7 days - documents not uploaded',
      molecule: 'Ondansetron',
      product: 'Onsetra 8 mg',
      country: 'Mexico',
      regulatoryContext: 'Semi Regulated',
      raisedOn: '17 Sept 2026',
      status: 'Open',
    },
    {
      id: 'ALR-707',
      category: 'Approved',
      severity: 'Low',
      message: 'Approval letter pending upload to dossier',
      molecule: 'Atorvastatin',
      product: 'Atorvex 10 mg',
      country: 'United States',
      regulatoryContext: 'Highly Regulated',
      raisedOn: '20 Aug 2026',
      status: 'In Progress',
    },
    {
      id: 'ALR-708',
      category: 'Declined',
      severity: 'High',
      message: 'Second deficiency letter - response overdue',
      molecule: 'Ceftriaxone',
      product: 'Ceftrimax 1 g',
      country: 'Kenya',
      regulatoryContext: 'Lightly Regulated',
      raisedOn: '05 Sept 2026',
      status: 'Overdue',
    },
    {
      id: 'ALR-709',
      category: 'Submission',
      severity: 'Medium',
      message: 'Stability data query from Health Canada pending response',
      molecule: 'Enoxaparin Sodium',
      product: 'Enoxalow 60 mg',
      country: 'Canada',
      regulatoryContext: 'Highly Regulated',
      raisedOn: '01 Sept 2026',
      status: 'In Progress',
    },
    {
      id: 'ALR-710',
      category: 'Filing',
      severity: 'Low',
      message: 'Administrative certificate renewal required before year end',
      molecule: 'Atorvastatin',
      product: 'Atorvex 20 mg',
      country: 'Brazil',
      regulatoryContext: 'Semi Regulated',
      raisedOn: '25 Aug 2026',
      status: 'Open',
    },
    {
      id: 'ALR-711',
      category: 'Approved',
      severity: 'Low',
      message: 'Marketing authorization issued - upload final artwork',
      molecule: 'Ceftriaxone',
      product: 'Ceftrimax 500 mg',
      country: 'United Kingdom',
      regulatoryContext: 'Highly Regulated',
      raisedOn: '18 Aug 2026',
      status: 'Closed',
    },
    {
      id: 'ALR-712',
      category: 'Declined',
      severity: 'High',
      message: 'DMF review fee rejected - payment reconciliation overdue',
      molecule: 'Iohexol',
      product: 'Iolexa Inject 300',
      country: 'Egypt',
      regulatoryContext: 'Lightly Regulated',
      raisedOn: '11 Aug 2026',
      status: 'Escalated',
    },
    {
      id: 'ALR-713',
      category: 'Submission',
      severity: 'High',
      message: 'Clinical expert statement missing in Module 2 submission',
      molecule: 'Ondansetron',
      product: 'Onsetra 8 mg',
      country: 'Germany',
      regulatoryContext: 'Highly Regulated',
      raisedOn: '04 Aug 2026',
      status: 'Open',
    },
    {
      id: 'ALR-714',
      category: 'Filing',
      severity: 'Medium',
      message: 'Batch manufacturing records request from Saudi FDA',
      molecule: 'Metformin HCl',
      product: 'Metfosure 1000 XR',
      country: 'Saudi Arabia',
      regulatoryContext: 'Semi Regulated',
      raisedOn: '29 Jul 2026',
      status: 'In Progress',
    },
    {
      id: 'ALR-715',
      category: 'Approved',
      severity: 'Low',
      message: 'Post-approval variation commitment completed',
      molecule: 'Enoxaparin Sodium',
      product: 'Enoxalow 80 mg',
      country: 'United States',
      regulatoryContext: 'Highly Regulated',
      raisedOn: '21 Jul 2026',
      status: 'Closed',
    },
  ]);

  // Reactive filtering using global dashboard filters
  readonly filteredAlerts = computed(() => {
    let list = this.alerts();
    const mol = this.dashboard ? this.dashboard.filterMolecule() : 'All molecule';
    const country = this.dashboard ? this.dashboard.filterCountry() : 'All country';

    if (mol && mol !== 'All molecule') {
      list = list.filter((a) => a.molecule.toLowerCase().includes(mol.toLowerCase()));
    }
    if (country && country !== 'All country') {
      list = list.filter((a) => a.country.toLowerCase() === country.toLowerCase());
    }
    return list;
  });

  // Column sorting handler
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

  // Sorted alerts
  readonly sortedAlerts = computed(() => {
    let list = [...this.filteredAlerts()];
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

  // Paginated alerts
  readonly paginatedAlerts = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.sortedAlerts().slice(start, start + this.pageSize());
  });

  onPageSizeChange(newSize: number): void {
    this.pageSize.set(newSize);
    this.currentPage.set(1);
  }

  // Category counts matching screenshot
  readonly submissionCount = computed(() => this.alerts().filter((a) => a.category === 'Submission').length);
  readonly filingCount = computed(() => this.alerts().filter((a) => a.category === 'Filing').length);
  readonly approvedCount = computed(() => this.alerts().filter((a) => a.category === 'Approved').length);
  readonly declinedCount = computed(() => this.alerts().filter((a) => a.category === 'Declined').length);
}
