import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
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
  imports: [CommonModule, MatIconModule],
  templateUrl: './alerts.component.html',
  styleUrl: './alerts.component.scss',
})
export class AlertsComponent {
  private readonly dashboard = inject(DashboardComponent, { optional: true });

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

  // Category counts matching screenshot
  readonly submissionCount = computed(() => this.alerts().filter((a) => a.category === 'Submission').length);
  readonly filingCount = computed(() => this.alerts().filter((a) => a.category === 'Filing').length);
  readonly approvedCount = computed(() => this.alerts().filter((a) => a.category === 'Approved').length);
  readonly declinedCount = computed(() => this.alerts().filter((a) => a.category === 'Declined').length);
}
