import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DashboardComponent } from '../dashboard.component';

export interface MapSubmissionRecord {
  recordId: string;
  molecule: string;
  product: string;
  country: string;
  region: string;
  regulatoryContext: string;
  stage: 'Submission' | 'Filing' | 'Approval' | 'Billing';
  status: 'Approved' | 'Filed' | 'Submitted' | 'Declined';
  submittedOn: string;
  decisionOn: string;
  valueUsd: string;
}

export interface MapCountryMarker {
  name: string;
  x: number;
  y: number;
  status: 'Approved' | 'Filed' | 'Submitted' | 'Declined';
  color: string;
  submissionsCount: number;
  hasActivity: boolean;
}

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule, NgxChartsModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent {
  private readonly dashboard = inject(DashboardComponent, { optional: true });

  // Top KPI metrics
  readonly metricSubmissions = signal<number>(221);
  readonly metricFilings = signal<number>(154);
  readonly metricApprovals = signal<number>(92);
  readonly metricDeclined = signal<number>(16);

  // Status Legend & color definitions
  readonly legendStatuses = [
    { label: 'Approved', color: '#10b981' },
    { label: 'Filed', color: '#0284c7' },
    { label: 'Submitted', color: '#f59e0b' },
    { label: 'Declined', color: '#ef4444' },
    { label: 'Selected', color: '#1e293b' },
  ];

  // Selected filters
  readonly selectedCountry = signal<string | null>(null);
  readonly selectedStatus = signal<string | null>(null);

  // Country markers plotted on realistic SVG world map (viewBox 30.767 241.591 784.077 458.627)
  readonly countryMarkers: MapCountryMarker[] = [
    { name: 'United States', x: 195, y: 420, status: 'Approved', color: '#10b981', submissionsCount: 18, hasActivity: true },
    { name: 'Canada', x: 200, y: 345, status: 'Filed', color: '#0284c7', submissionsCount: 12, hasActivity: true },
    { name: 'Mexico', x: 167, y: 465, status: 'Submitted', color: '#f59e0b', submissionsCount: 8, hasActivity: true },
    { name: 'Brazil', x: 275, y: 570, status: 'Declined', color: '#ef4444', submissionsCount: 14, hasActivity: true },
    { name: 'Argentina', x: 262, y: 638, status: 'Submitted', color: '#f59e0b', submissionsCount: 0, hasActivity: false },
    { name: 'United Kingdom', x: 402, y: 382, status: 'Approved', color: '#10b981', submissionsCount: 15, hasActivity: true },
    { name: 'Germany', x: 430, y: 393, status: 'Declined', color: '#ef4444', submissionsCount: 11, hasActivity: true },
    { name: 'France', x: 411, y: 406, status: 'Filed', color: '#0284c7', submissionsCount: 9, hasActivity: true },
    { name: 'Spain', x: 400, y: 426, status: 'Approved', color: '#10b981', submissionsCount: 10, hasActivity: true },
    { name: 'Poland', x: 448, y: 389, status: 'Declined', color: '#ef4444', submissionsCount: 0, hasActivity: false },
    { name: 'South Africa', x: 465, y: 606, status: 'Approved', color: '#10b981', submissionsCount: 8, hasActivity: true },
    { name: 'Kenya', x: 500, y: 530, status: 'Declined', color: '#ef4444', submissionsCount: 6, hasActivity: true },
    { name: 'Nigeria', x: 428, y: 509, status: 'Submitted', color: '#f59e0b', submissionsCount: 7, hasActivity: true },
    { name: 'Egypt', x: 479, y: 462, status: 'Filed', color: '#0284c7', submissionsCount: 8, hasActivity: true },
    { name: 'Saudi Arabia', x: 513, y: 468, status: 'Submitted', color: '#f59e0b', submissionsCount: 9, hasActivity: true },
    { name: 'UAE', x: 534, y: 467, status: 'Filed', color: '#0284c7', submissionsCount: 0, hasActivity: false },
    { name: 'India', x: 602, y: 473, status: 'Submitted', color: '#f59e0b', submissionsCount: 19, hasActivity: true },
    { name: 'China', x: 635, y: 416, status: 'Filed', color: '#0284c7', submissionsCount: 22, hasActivity: true },
    { name: 'Japan', x: 710, y: 428, status: 'Filed', color: '#0284c7', submissionsCount: 13, hasActivity: true },
    { name: 'Australia', x: 718, y: 615, status: 'Approved', color: '#10b981', submissionsCount: 0, hasActivity: false },
    { name: 'Vietnam', x: 661, y: 485, status: 'Approved', color: '#10b981', submissionsCount: 6, hasActivity: true },
    { name: 'Philippines', x: 697, y: 500, status: 'Declined', color: '#ef4444', submissionsCount: 7, hasActivity: true },
  ];

  // Countries with activities
  readonly countriesWithActivities = computed(() =>
    this.countryMarkers.filter((m) => m.hasActivity)
  );

  // Countries without activities
  readonly countriesWithoutActivities = computed(() =>
    this.countryMarkers.filter((m) => !m.hasActivity)
  );

  // 66 Submissions and Filings Records matching screenshot
  readonly allRecords = signal<MapSubmissionRecord[]>([
    { recordId: 'REC-4001', molecule: 'Enoxaparin Sodium', product: 'Enoxalow 40 mg', country: 'United States', region: 'North America', regulatoryContext: 'Highly Regulated', stage: 'Submission', status: 'Approved', submittedOn: '01 Jan 2026', decisionOn: '01 Sept 2026', valueUsd: '$1.4M' },
    { recordId: 'REC-4002', molecule: 'Atorvastatin', product: 'Atorvex 20 mg', country: 'United States', region: 'North America', regulatoryContext: 'Highly Regulated', stage: 'Filing', status: 'Filed', submittedOn: '05 Feb 2026', decisionOn: '—', valueUsd: '$980K' },
    { recordId: 'REC-4003', molecule: 'Ceftriaxone', product: 'Ceftrimax 500 mg', country: 'United States', region: 'North America', regulatoryContext: 'Highly Regulated', stage: 'Approval', status: 'Submitted', submittedOn: '18 Mar 2026', decisionOn: '—', valueUsd: '$1.1M' },
    { recordId: 'REC-4004', molecule: 'Enoxaparin Sodium', product: 'Enoxalow 40 mg', country: 'Canada', region: 'North America', regulatoryContext: 'Highly Regulated', stage: 'Filing', status: 'Declined', submittedOn: '04 Apr 2026', decisionOn: '10 Aug 2026', valueUsd: '$750K' },
    { recordId: 'REC-4005', molecule: 'Atorvastatin', product: 'Atorvex 20 mg', country: 'Canada', region: 'North America', regulatoryContext: 'Highly Regulated', stage: 'Submission', status: 'Submitted', submittedOn: '12 May 2026', decisionOn: '—', valueUsd: '$890K' },
    { recordId: 'REC-4006', molecule: 'Ceftriaxone', product: 'Ceftrimax 1 g', country: 'Canada', region: 'North America', regulatoryContext: 'Highly Regulated', stage: 'Approval', status: 'Approved', submittedOn: '03 Jun 2026', decisionOn: '05 Nov 2026', valueUsd: '$1.6M' },

    { recordId: 'REC-4007', molecule: 'Enoxaparin Sodium', product: 'Enoxalow 40 mg', country: 'Mexico', region: 'Latin America', regulatoryContext: 'Semi Regulated', stage: 'Approval', status: 'Filed', submittedOn: '15 Jul 2026', decisionOn: '—', valueUsd: '$620K' },
    { recordId: 'REC-4008', molecule: 'Atorvastatin', product: 'Atorvex 20 mg', country: 'Mexico', region: 'Latin America', regulatoryContext: 'Semi Regulated', stage: 'Filing', status: 'Submitted', submittedOn: '05 Aug 2026', decisionOn: '—', valueUsd: '$540K' },
    { recordId: 'REC-4009', molecule: 'Ceftriaxone', product: 'Ceftrimax 500 mg', country: 'Mexico', region: 'Latin America', regulatoryContext: 'Semi Regulated', stage: 'Submission', status: 'Declined', submittedOn: '22 Aug 2026', decisionOn: '01 Nov 2026', valueUsd: '$810K' },
    { recordId: 'REC-4010', molecule: 'Enoxaparin Sodium', product: 'Enoxalow 40 mg', country: 'Brazil', region: 'Latin America', regulatoryContext: 'Semi Regulated', stage: 'Filing', status: 'Submitted', submittedOn: '10 Jan 2026', decisionOn: '—', valueUsd: '$1.3M' },
    { recordId: 'REC-4011', molecule: 'Atorvastatin', product: 'Atorvex 20 mg', country: 'Brazil', region: 'Latin America', regulatoryContext: 'Semi Regulated', stage: 'Approval', status: 'Approved', submittedOn: '11 Feb 2026', decisionOn: '11 Jun 2026', valueUsd: '$1.5M' },
    { recordId: 'REC-4012', molecule: 'Ceftriaxone', product: 'Ceftrimax 1 g', country: 'Brazil', region: 'Latin America', regulatoryContext: 'Semi Regulated', stage: 'Filing', status: 'Filed', submittedOn: '15 Mar 2026', decisionOn: '—', valueUsd: '$920K' },

    { recordId: 'REC-4013', molecule: 'Enoxaparin Sodium', product: 'Enoxalow 40 mg', country: 'Argentina', region: 'Latin America', regulatoryContext: 'Semi Regulated', stage: 'Submission', status: 'Submitted', submittedOn: '12 Apr 2026', decisionOn: '—', valueUsd: '$480K' },
    { recordId: 'REC-4014', molecule: 'Atorvastatin', product: 'Atorvex 20 mg', country: 'Argentina', region: 'Latin America', regulatoryContext: 'Semi Regulated', stage: 'Filing', status: 'Declined', submittedOn: '14 May 2026', decisionOn: '14 Sep 2026', valueUsd: '$520K' },
    { recordId: 'REC-4015', molecule: 'Ceftriaxone', product: 'Ceftrimax 500 mg', country: 'Argentina', region: 'Latin America', regulatoryContext: 'Semi Regulated', stage: 'Approval', status: 'Approved', submittedOn: '15 Jun 2026', decisionOn: '—', valueUsd: '$710K' },

    { recordId: 'REC-4016', molecule: 'Enoxaparin Sodium', product: 'Enoxalow 40 mg', country: 'United Kingdom', region: 'Europe', regulatoryContext: 'Highly Regulated', stage: 'Filing', status: 'Approved', submittedOn: '16 Jul 2026', decisionOn: '20 Oct 2026', valueUsd: '$2.1M' },
    { recordId: 'REC-4017', molecule: 'Atorvastatin', product: 'Atorvex 20 mg', country: 'United Kingdom', region: 'Europe', regulatoryContext: 'Highly Regulated', stage: 'Submission', status: 'Filed', submittedOn: '17 Aug 2026', decisionOn: '—', valueUsd: '$1.8M' },
    { recordId: 'REC-4018', molecule: 'Ceftriaxone', product: 'Ceftrimax 1 g', country: 'United Kingdom', region: 'Europe', regulatoryContext: 'Highly Regulated', stage: 'Filing', status: 'Submitted', submittedOn: '18 Sep 2026', decisionOn: '—', valueUsd: '$1.4M' },

    { recordId: 'REC-4019', molecule: 'Enoxaparin Sodium', product: 'Enoxalow 40 mg', country: 'Germany', region: 'Europe', regulatoryContext: 'Highly Regulated', stage: 'Approval', status: 'Declined', submittedOn: '19 Jan 2026', decisionOn: '19 Sept 2026', valueUsd: '$1.7M' },
    { recordId: 'REC-4020', molecule: 'Atorvastatin', product: 'Atorvex 20 mg', country: 'Germany', region: 'Europe', regulatoryContext: 'Highly Regulated', stage: 'Filing', status: 'Submitted', submittedOn: '20 Feb 2026', decisionOn: '—', valueUsd: '$910K' },
    { recordId: 'REC-4021', molecule: 'Ceftriaxone', product: 'Ceftrimax 500 mg', country: 'Germany', region: 'Europe', regulatoryContext: 'Highly Regulated', stage: 'Submission', status: 'Approved', submittedOn: '21 Mar 2026', decisionOn: '28 Sept 2026', valueUsd: '$1.5M' },

    { recordId: 'REC-4022', molecule: 'Enoxaparin Sodium', product: 'Enoxalow 40 mg', country: 'France', region: 'Europe', regulatoryContext: 'Highly Regulated', stage: 'Filing', status: 'Filed', submittedOn: '22 Apr 2026', decisionOn: '—', valueUsd: '$1.2M' },
    { recordId: 'REC-4023', molecule: 'Atorvastatin', product: 'Atorvex 20 mg', country: 'France', region: 'Europe', regulatoryContext: 'Highly Regulated', stage: 'Approval', status: 'Submitted', submittedOn: '23 May 2026', decisionOn: '—', valueUsd: '$1.1M' },
    { recordId: 'REC-4024', molecule: 'Ceftriaxone', product: 'Ceftrimax 1 g', country: 'France', region: 'Europe', regulatoryContext: 'Highly Regulated', stage: 'Filing', status: 'Declined', submittedOn: '24 Jun 2026', decisionOn: '14 Oct 2026', valueUsd: '$750K' },

    { recordId: 'REC-4025', molecule: 'Enoxaparin Sodium', product: 'Enoxalow 40 mg', country: 'Spain', region: 'Europe', regulatoryContext: 'Highly Regulated', stage: 'Submission', status: 'Submitted', submittedOn: '25 Jul 2026', decisionOn: '—', valueUsd: '$840K' },
    { recordId: 'REC-4026', molecule: 'Atorvastatin', product: 'Atorvex 20 mg', country: 'Spain', region: 'Europe', regulatoryContext: 'Highly Regulated', stage: 'Filing', status: 'Approved', submittedOn: '26 Aug 2026', decisionOn: '16 Nov 2026', valueUsd: '$1.3M' },
    { recordId: 'REC-4027', molecule: 'Ceftriaxone', product: 'Ceftrimax 500 mg', country: 'Spain', region: 'Europe', regulatoryContext: 'Highly Regulated', stage: 'Approval', status: 'Filed', submittedOn: '27 Sep 2026', decisionOn: '—', valueUsd: '$960K' },

    { recordId: 'REC-4028', molecule: 'Enoxaparin Sodium', product: 'Enoxalow 40 mg', country: 'Poland', region: 'Europe', regulatoryContext: 'Semi Regulated', stage: 'Filing', status: 'Submitted', submittedOn: '01 Jan 2026', decisionOn: '—', valueUsd: '$720K' },
    { recordId: 'REC-4029', molecule: 'Atorvastatin', product: 'Atorvex 20 mg', country: 'Poland', region: 'Europe', regulatoryContext: 'Semi Regulated', stage: 'Submission', status: 'Declined', submittedOn: '02 Feb 2026', decisionOn: '02 Sept 2026', valueUsd: '$680K' },
    { recordId: 'REC-4030', molecule: 'Ceftriaxone', product: 'Ceftrimax 1 g', country: 'Poland', region: 'Europe', regulatoryContext: 'Semi Regulated', stage: 'Filing', status: 'Approved', submittedOn: '03 Mar 2026', decisionOn: '—', valueUsd: '$1.1M' },

    { recordId: 'REC-4031', molecule: 'Enoxaparin Sodium', product: 'Enoxalow 40 mg', country: 'South Africa', region: 'Africa', regulatoryContext: 'Semi Regulated', stage: 'Approval', status: 'Approved', submittedOn: '04 Apr 2026', decisionOn: '04 Sept 2026', valueUsd: '$1.3M' },
    { recordId: 'REC-4032', molecule: 'Atorvastatin', product: 'Atorvex 20 mg', country: 'South Africa', region: 'Africa', regulatoryContext: 'Semi Regulated', stage: 'Filing', status: 'Filed', submittedOn: '05 May 2026', decisionOn: '—', valueUsd: '$890K' },
    { recordId: 'REC-4033', molecule: 'Ceftriaxone', product: 'Ceftrimax 500 mg', country: 'South Africa', region: 'Africa', regulatoryContext: 'Semi Regulated', stage: 'Submission', status: 'Submitted', submittedOn: '06 Jun 2026', decisionOn: '—', valueUsd: '$780K' },

    { recordId: 'REC-4034', molecule: 'Enoxaparin Sodium', product: 'Enoxalow 40 mg', country: 'Kenya', region: 'Africa', regulatoryContext: 'Lightly Regulated', stage: 'Filing', status: 'Declined', submittedOn: '07 Jul 2026', decisionOn: '07 Sept 2026', valueUsd: '$590K' },
    { recordId: 'REC-4035', molecule: 'Atorvastatin', product: 'Atorvex 20 mg', country: 'Kenya', region: 'Africa', regulatoryContext: 'Lightly Regulated', stage: 'Approval', status: 'Submitted', submittedOn: '08 Aug 2026', decisionOn: '—', valueUsd: '$640K' },
    { recordId: 'REC-4036', molecule: 'Ceftriaxone', product: 'Ceftrimax 1 g', country: 'Kenya', region: 'Africa', regulatoryContext: 'Lightly Regulated', stage: 'Filing', status: 'Approved', submittedOn: '09 Sep 2026', decisionOn: '09 Nov 2026', valueUsd: '$820K' },

    { recordId: 'REC-4037', molecule: 'Enoxaparin Sodium', product: 'Enoxalow 40 mg', country: 'Nigeria', region: 'Africa', regulatoryContext: 'Lightly Regulated', stage: 'Submission', status: 'Filed', submittedOn: '10 Jan 2026', decisionOn: '—', valueUsd: '$610K' },
    { recordId: 'REC-4038', molecule: 'Atorvastatin', product: 'Atorvex 20 mg', country: 'Nigeria', region: 'Africa', regulatoryContext: 'Lightly Regulated', stage: 'Filing', status: 'Submitted', submittedOn: '11 Feb 2026', decisionOn: '—', valueUsd: '$570K' },
    { recordId: 'REC-4039', molecule: 'Ceftriaxone', product: 'Ceftrimax 500 mg', country: 'Nigeria', region: 'Africa', regulatoryContext: 'Lightly Regulated', stage: 'Approval', status: 'Approved', submittedOn: '12 Mar 2026', decisionOn: '12 Sept 2026', valueUsd: '$930K' },

    { recordId: 'REC-4040', molecule: 'Enoxaparin Sodium', product: 'Enoxalow 40 mg', country: 'Egypt', region: 'Africa', regulatoryContext: 'Semi Regulated', stage: 'Filing', status: 'Declined', submittedOn: '13 Apr 2026', decisionOn: '—', valueUsd: '$680K' },
    { recordId: 'REC-4041', molecule: 'Atorvastatin', product: 'Atorvex 20 mg', country: 'Egypt', region: 'Africa', regulatoryContext: 'Semi Regulated', stage: 'Submission', status: 'Approved', submittedOn: '14 May 2026', decisionOn: '14 Sept 2026', valueUsd: '$1.1M' },
    { recordId: 'REC-4042', molecule: 'Ceftriaxone', product: 'Ceftrimax 1 g', country: 'Egypt', region: 'Africa', regulatoryContext: 'Semi Regulated', stage: 'Filing', status: 'Filed', submittedOn: '15 Jun 2026', decisionOn: '—', valueUsd: '$840K' },

    { recordId: 'REC-4043', molecule: 'Enoxaparin Sodium', product: 'Enoxalow 40 mg', country: 'Saudi Arabia', region: 'Middle East', regulatoryContext: 'Semi Regulated', stage: 'Approval', status: 'Submitted', submittedOn: '16 Jul 2026', decisionOn: '—', valueUsd: '$1.4M' },
    { recordId: 'REC-4044', molecule: 'Atorvastatin', product: 'Atorvex 20 mg', country: 'Saudi Arabia', region: 'Middle East', regulatoryContext: 'Semi Regulated', stage: 'Filing', status: 'Filed', submittedOn: '17 Aug 2026', decisionOn: '17 Nov 2026', valueUsd: '$1.2M' },
    { recordId: 'REC-4045', molecule: 'Ceftriaxone', product: 'Ceftrimax 500 mg', country: 'Saudi Arabia', region: 'Middle East', regulatoryContext: 'Semi Regulated', stage: 'Submission', status: 'Approved', submittedOn: '18 Sep 2026', decisionOn: '—', valueUsd: '$1.6M' },

    { recordId: 'REC-4046', molecule: 'Enoxaparin Sodium', product: 'Enoxalow 40 mg', country: 'UAE', region: 'Middle East', regulatoryContext: 'Semi Regulated', stage: 'Filing', status: 'Submitted', submittedOn: '19 Jan 2026', decisionOn: '19 Jun 2026', valueUsd: '$950K' },
    { recordId: 'REC-4047', molecule: 'Atorvastatin', product: 'Atorvex 20 mg', country: 'UAE', region: 'Middle East', regulatoryContext: 'Semi Regulated', stage: 'Approval', status: 'Filed', submittedOn: '20 Feb 2026', decisionOn: '—', valueUsd: '$880K' },
    { recordId: 'REC-4048', molecule: 'Ceftriaxone', product: 'Ceftrimax 1 g', country: 'UAE', region: 'Middle East', regulatoryContext: 'Semi Regulated', stage: 'Filing', status: 'Approved', submittedOn: '21 Mar 2026', decisionOn: '—', valueUsd: '$1.3M' },

    { recordId: 'REC-4049', molecule: 'Enoxaparin Sodium', product: 'Enoxalow 40 mg', country: 'India', region: 'Asia Pacific', regulatoryContext: 'Semi Regulated', stage: 'Submission', status: 'Declined', submittedOn: '22 Apr 2026', decisionOn: '22 Sept 2026', valueUsd: '$1.9M' },
    { recordId: 'REC-4050', molecule: 'Atorvastatin', product: 'Atorvex 20 mg', country: 'India', region: 'Asia Pacific', regulatoryContext: 'Semi Regulated', stage: 'Filing', status: 'Submitted', submittedOn: '23 May 2026', decisionOn: '—', valueUsd: '$1.4M' },
    { recordId: 'REC-4051', molecule: 'Ceftriaxone', product: 'Ceftrimax 500 mg', country: 'India', region: 'Asia Pacific', regulatoryContext: 'Semi Regulated', stage: 'Approval', status: 'Approved', submittedOn: '24 Jun 2026', decisionOn: '24 Oct 2026', valueUsd: '$2.3M' },

    { recordId: 'REC-4052', molecule: 'Enoxaparin Sodium', product: 'Enoxalow 40 mg', country: 'China', region: 'Asia Pacific', regulatoryContext: 'Highly Regulated', stage: 'Filing', status: 'Filed', submittedOn: '25 Jul 2026', decisionOn: '—', valueUsd: '$2.8M' },
    { recordId: 'REC-4053', molecule: 'Atorvastatin', product: 'Atorvex 20 mg', country: 'China', region: 'Asia Pacific', regulatoryContext: 'Highly Regulated', stage: 'Submission', status: 'Submitted', submittedOn: '26 Aug 2026', decisionOn: '—', valueUsd: '$2.1M' },
    { recordId: 'REC-4054', molecule: 'Ceftriaxone', product: 'Ceftrimax 1 g', country: 'China', region: 'Asia Pacific', regulatoryContext: 'Highly Regulated', stage: 'Filing', status: 'Approved', submittedOn: '27 Sep 2026', decisionOn: '27 Nov 2026', valueUsd: '$3.4M' },

    { recordId: 'REC-4055', molecule: 'Enoxaparin Sodium', product: 'Enoxalow 40 mg', country: 'Japan', region: 'Asia Pacific', regulatoryContext: 'Highly Regulated', stage: 'Approval', status: 'Submitted', submittedOn: '01 Jan 2026', decisionOn: '—', valueUsd: '$1.8M' },
    { recordId: 'REC-4056', molecule: 'Atorvastatin', product: 'Atorvex 20 mg', country: 'Japan', region: 'Asia Pacific', regulatoryContext: 'Highly Regulated', stage: 'Filing', status: 'Approved', submittedOn: '02 Feb 2026', decisionOn: '02 Sept 2026', valueUsd: '$2.0M' },
    { recordId: 'REC-4057', molecule: 'Ceftriaxone', product: 'Ceftrimax 500 mg', country: 'Japan', region: 'Asia Pacific', regulatoryContext: 'Highly Regulated', stage: 'Submission', status: 'Filed', submittedOn: '03 Mar 2026', decisionOn: '—', valueUsd: '$1.5M' },

    { recordId: 'REC-4058', molecule: 'Enoxaparin Sodium', product: 'Enoxalow 40 mg', country: 'Australia', region: 'Asia Pacific', regulatoryContext: 'Highly Regulated', stage: 'Filing', status: 'Declined', submittedOn: '04 Apr 2026', decisionOn: '—', valueUsd: '$890K' },
    { recordId: 'REC-4059', molecule: 'Atorvastatin', product: 'Atorvex 20 mg', country: 'Australia', region: 'Asia Pacific', regulatoryContext: 'Highly Regulated', stage: 'Approval', status: 'Approved', submittedOn: '05 May 2026', decisionOn: '18 Sept 2026', valueUsd: '$1.4M' },
    { recordId: 'REC-4060', molecule: 'Ceftriaxone', product: 'Ceftrimax 1 g', country: 'Australia', region: 'Asia Pacific', regulatoryContext: 'Highly Regulated', stage: 'Filing', status: 'Submitted', submittedOn: '06 Jun 2026', decisionOn: '—', valueUsd: '$960K' },

    { recordId: 'REC-4061', molecule: 'Enoxaparin Sodium', product: 'Enoxalow 40 mg', country: 'Vietnam', region: 'Asia Pacific', regulatoryContext: 'Lightly Regulated', stage: 'Approval', status: 'Approved', submittedOn: '07 Jul 2026', decisionOn: '07 Sept 2026', valueUsd: '$780K' },
    { recordId: 'REC-4062', molecule: 'Atorvastatin', product: 'Atorvex 20 mg', country: 'Vietnam', region: 'Asia Pacific', regulatoryContext: 'Lightly Regulated', stage: 'Filing', status: 'Filed', submittedOn: '08 Aug 2026', decisionOn: '—', valueUsd: '$650K' },
    { recordId: 'REC-4063', molecule: 'Ceftriaxone', product: 'Ceftrimax 500 mg', country: 'Vietnam', region: 'Asia Pacific', regulatoryContext: 'Lightly Regulated', stage: 'Submission', status: 'Submitted', submittedOn: '09 Sep 2026', decisionOn: '—', valueUsd: '$830K' },

    { recordId: 'REC-4064', molecule: 'Enoxaparin Sodium', product: 'Enoxalow 40 mg', country: 'Philippines', region: 'Asia Pacific', regulatoryContext: 'Lightly Regulated', stage: 'Submission', status: 'Declined', submittedOn: '10 Jan 2026', decisionOn: '10 Sept 2026', valueUsd: '$610K' },
    { recordId: 'REC-4065', molecule: 'Atorvastatin', product: 'Atorvex 20 mg', country: 'Philippines', region: 'Asia Pacific', regulatoryContext: 'Lightly Regulated', stage: 'Submission', status: 'Submitted', submittedOn: '11 Feb 2026', decisionOn: '—', valueUsd: '$590K' },
    { recordId: 'REC-4066', molecule: 'Ceftriaxone', product: 'Ceftrimax 1 g', country: 'Philippines', region: 'Asia Pacific', regulatoryContext: 'Lightly Regulated', stage: 'Filing', status: 'Approved', submittedOn: '12 Mar 2026', decisionOn: '12 Sept 2026', valueUsd: '$920K' },
  ]);

  // Filtered Records based on global filters + map interactive selection
  readonly filteredRecords = computed(() => {
    let list = this.allRecords();
    const mol = this.dashboard ? this.dashboard.filterMolecule() : 'All molecule';
    const globalCountry = this.dashboard ? this.dashboard.filterCountry() : 'All country';
    const region = this.dashboard ? this.dashboard.filterRegion() : 'All region';
    const regContext = this.dashboard ? this.dashboard.filterRegulatoryContext() : 'All regulatory context';

    // Global filters
    if (mol && mol !== 'All molecule') {
      list = list.filter((r) => r.molecule.toLowerCase().includes(mol.toLowerCase()));
    }
    if (globalCountry && globalCountry !== 'All country') {
      list = list.filter((r) => r.country.toLowerCase() === globalCountry.toLowerCase());
    }
    if (region && region !== 'All region') {
      list = list.filter((r) => r.region.toLowerCase() === region.toLowerCase());
    }
    if (regContext && regContext !== 'All regulatory context') {
      list = list.filter((r) => r.regulatoryContext.toLowerCase().includes(regContext.toLowerCase()));
    }

    // Local map pin / country filter
    const activeCountry = this.selectedCountry();
    if (activeCountry) {
      list = list.filter((r) => r.country.toLowerCase() === activeCountry.toLowerCase());
    }

    // Local status filter
    const activeStatus = this.selectedStatus();
    if (activeStatus && activeStatus !== 'Selected') {
      list = list.filter((r) => r.status.toLowerCase() === activeStatus.toLowerCase());
    }

    return list;
  });

  // Country selection toggle
  selectCountry(countryName: string): void {
    if (this.selectedCountry() === countryName) {
      this.selectedCountry.set(null);
    } else {
      this.selectedCountry.set(countryName);
    }
  }

  // Status filter toggle
  toggleStatusFilter(status: string): void {
    if (this.selectedStatus() === status) {
      this.selectedStatus.set(null);
    } else {
      this.selectedStatus.set(status);
    }
  }

  // Clear all local map filters
  clearMapFilters(): void {
    this.selectedCountry.set(null);
    this.selectedStatus.set(null);
  }
}
