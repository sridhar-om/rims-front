import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DashboardComponent } from '../dashboard.component';

export interface PipelineRecord {
  recordId: string;
  molecule: string;
  product: string;
  country: string;
  region: string;
  regulatoryContext: string;
  stage: 'Submission' | 'Filing' | 'Approval' | 'Billing';
  status: 'Approved' | 'Filed' | 'Submitted' | 'Declined';
  submittedOn: string;
}

export interface LegendItem {
  label: string;
  count: number;
  color: string;
}

@Component({
  selector: 'app-pipeline',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './pipeline.component.html',
  styleUrl: './pipeline.component.scss',
})
export class PipelineComponent {
  private readonly dashboard = inject(DashboardComponent, { optional: true });

  // Funnel Metrics
  readonly funnelStages = [
    { name: 'Submission', percent: 40, records: 20, color: '#2563eb' },
    { name: 'Filing', percent: 30, records: 15, color: '#0284c7' },
    { name: 'Approval', percent: 20, records: 10, color: '#059669' },
    { name: 'Billing', percent: 10, records: 5, color: '#d97706' },
  ];

  // Breakdown Switcher
  readonly selectedBreakdown = signal<'Country' | 'Region' | 'Regulatory Context'>('Country');

  // Country Legend Items (22 countries, 3 records each = 66 records)
  readonly countryLegend: LegendItem[] = [
    { label: 'United States', count: 3, color: '#2563eb' },
    { label: 'Canada', count: 3, color: '#3b82f6' },
    { label: 'Mexico', count: 3, color: '#0284c7' },
    { label: 'Brazil', count: 3, color: '#06b6d4' },
    { label: 'Argentina', count: 3, color: '#0d9488' },
    { label: 'United Kingdom', count: 3, color: '#059669' },
    { label: 'Germany', count: 3, color: '#16a34a' },
    { label: 'France', count: 3, color: '#65a30d' },
    { label: 'Spain', count: 3, color: '#ca8a04' },
    { label: 'Poland', count: 3, color: '#d97706' },
    { label: 'South Africa', count: 3, color: '#ea580c' },
    { label: 'Kenya', count: 3, color: '#dc2626' },
    { label: 'Nigeria', count: 3, color: '#db2777' },
    { label: 'Egypt', count: 3, color: '#c026d3' },
    { label: 'Saudi Arabia', count: 3, color: '#9333ea' },
    { label: 'UAE', count: 3, color: '#7c3aed' },
    { label: 'India', count: 3, color: '#4f46e5' },
    { label: 'China', count: 3, color: '#4338ca' },
    { label: 'Japan', count: 3, color: '#3730a3' },
    { label: 'Australia', count: 3, color: '#0369a1' },
    { label: 'Vietnam', count: 3, color: '#047857' },
    { label: 'Philippines', count: 3, color: '#b45309' },
  ];

  readonly regionLegend: LegendItem[] = [
    { label: 'North America', count: 6, color: '#2563eb' },
    { label: 'Latin America', count: 9, color: '#0284c7' },
    { label: 'Europe', count: 15, color: '#059669' },
    { label: 'Africa', count: 12, color: '#ea580c' },
    { label: 'Middle East', count: 6, color: '#9333ea' },
    { label: 'Asia Pacific', count: 18, color: '#4f46e5' },
  ];

  readonly regContextLegend: LegendItem[] = [
    { label: 'Highly Regulated', count: 28, color: '#2563eb' },
    { label: 'Semi Regulated', count: 24, color: '#0284c7' },
    { label: 'Lightly Regulated', count: 14, color: '#059669' },
  ];

  readonly activeLegend = computed(() => {
    switch (this.selectedBreakdown()) {
      case 'Region':
        return this.regionLegend;
      case 'Regulatory Context':
        return this.regContextLegend;
      default:
        return this.countryLegend;
    }
  });

  // SVG Donut Slices Computed
  readonly donutSegments = computed(() => {
    const items = this.activeLegend();
    const total = items.reduce((acc, curr) => acc + curr.count, 0);
    const radius = 64;
    const circumference = 2 * Math.PI * radius; // ~402.12
    let accumulatedAngle = 0;

    return items.map((item) => {
      const fraction = item.count / total;
      const strokeLength = fraction * circumference;
      const strokeGap = circumference - strokeLength;
      const rotation = (accumulatedAngle / total) * 360 - 90;
      accumulatedAngle += item.count;

      return {
        ...item,
        strokeDasharray: `${strokeLength} ${strokeGap}`,
        rotation: `rotate(${rotation} 100 100)`,
      };
    });
  });

  // 66 Stage Records (3 records per each of 22 countries)
  readonly allRecords = signal<PipelineRecord[]>([
    { recordId: 'REC-4100', molecule: 'Enoxaparin Sodium', product: 'Enoxalow 40 mg', country: 'United States', region: 'North America', regulatoryContext: 'Highly Regulated', stage: 'Approval', status: 'Approved', submittedOn: '12 Jan 2026' },
    { recordId: 'REC-4101', molecule: 'Atorvastatin', product: 'Atorvex 20 mg', country: 'United States', region: 'North America', regulatoryContext: 'Highly Regulated', stage: 'Filing', status: 'Filed', submittedOn: '05 Feb 2026' },
    { recordId: 'REC-4102', molecule: 'Ceftriaxone', product: 'Ceftrimax 500 mg', country: 'United States', region: 'North America', regulatoryContext: 'Highly Regulated', stage: 'Submission', status: 'Submitted', submittedOn: '18 Mar 2026' },

    { recordId: 'REC-4103', molecule: 'Enoxaparin Sodium', product: 'Enoxalow 40 mg', country: 'Canada', region: 'North America', regulatoryContext: 'Highly Regulated', stage: 'Billing', status: 'Declined', submittedOn: '04 Apr 2026' },
    { recordId: 'REC-4104', molecule: 'Atorvastatin', product: 'Atorvex 20 mg', country: 'Canada', region: 'North America', regulatoryContext: 'Highly Regulated', stage: 'Submission', status: 'Submitted', submittedOn: '12 May 2026' },
    { recordId: 'REC-4105', molecule: 'Ceftriaxone', product: 'Ceftrimax 500 mg', country: 'Canada', region: 'North America', regulatoryContext: 'Highly Regulated', stage: 'Approval', status: 'Approved', submittedOn: '03 Jun 2026' },

    { recordId: 'REC-4106', molecule: 'Enoxaparin Sodium', product: 'Enoxalow 40 mg', country: 'Mexico', region: 'Latin America', regulatoryContext: 'Semi Regulated', stage: 'Approval', status: 'Approved', submittedOn: '15 Jul 2026' },
    { recordId: 'REC-4107', molecule: 'Atorvastatin', product: 'Atorvex 20 mg', country: 'Mexico', region: 'Latin America', regulatoryContext: 'Semi Regulated', stage: 'Filing', status: 'Submitted', submittedOn: '05 Aug 2026' },
    { recordId: 'REC-4108', molecule: 'Ceftriaxone', product: 'Ceftrimax 500 mg', country: 'Mexico', region: 'Latin America', regulatoryContext: 'Semi Regulated', stage: 'Submission', status: 'Declined', submittedOn: '22 Aug 2026' },

    { recordId: 'REC-4109', molecule: 'Enoxaparin Sodium', product: 'Enoxalow 40 mg', country: 'Brazil', region: 'Latin America', regulatoryContext: 'Semi Regulated', stage: 'Filing', status: 'Submitted', submittedOn: '10 Jan 2026' },
    { recordId: 'REC-4110', molecule: 'Atorvastatin', product: 'Atorvex 20 mg', country: 'Brazil', region: 'Latin America', regulatoryContext: 'Semi Regulated', stage: 'Submission', status: 'Approved', submittedOn: '11 Feb 2026' },
    { recordId: 'REC-4111', molecule: 'Ceftriaxone', product: 'Ceftrimax 1 g', country: 'Brazil', region: 'Latin America', regulatoryContext: 'Semi Regulated', stage: 'Billing', status: 'Filed', submittedOn: '15 Mar 2026' },

    { recordId: 'REC-4112', molecule: 'Enoxaparin Sodium', product: 'Enoxalow 60 mg', country: 'Argentina', region: 'Latin America', regulatoryContext: 'Semi Regulated', stage: 'Submission', status: 'Submitted', submittedOn: '12 Apr 2026' },
    { recordId: 'REC-4113', molecule: 'Atorvastatin', product: 'Atorvex 20 mg', country: 'Argentina', region: 'Latin America', regulatoryContext: 'Semi Regulated', stage: 'Filing', status: 'Declined', submittedOn: '14 May 2026' },
    { recordId: 'REC-4114', molecule: 'Ceftriaxone', product: 'Ceftrimax 500 mg', country: 'Argentina', region: 'Latin America', regulatoryContext: 'Semi Regulated', stage: 'Approval', status: 'Approved', submittedOn: '18 Jun 2026' },

    { recordId: 'REC-4115', molecule: 'Enoxaparin Sodium', product: 'Enoxalow 40 mg', country: 'United Kingdom', region: 'Europe', regulatoryContext: 'Highly Regulated', stage: 'Billing', status: 'Approved', submittedOn: '16 Jul 2026' },
    { recordId: 'REC-4116', molecule: 'Atorvastatin', product: 'Atorvex 20 mg', country: 'United Kingdom', region: 'Europe', regulatoryContext: 'Highly Regulated', stage: 'Submission', status: 'Filed', submittedOn: '17 Aug 2026' },
    { recordId: 'REC-4117', molecule: 'Ceftriaxone', product: 'Ceftrimax 1 g', country: 'United Kingdom', region: 'Europe', regulatoryContext: 'Highly Regulated', stage: 'Filing', status: 'Submitted', submittedOn: '18 Sep 2026' },

    { recordId: 'REC-4118', molecule: 'Enoxaparin Sodium', product: 'Enoxalow 40 mg', country: 'Germany', region: 'Europe', regulatoryContext: 'Highly Regulated', stage: 'Approval', status: 'Declined', submittedOn: '14 Jan 2026' },
    { recordId: 'REC-4119', molecule: 'Atorvastatin', product: 'Atorvex 20 mg', country: 'Germany', region: 'Europe', regulatoryContext: 'Highly Regulated', stage: 'Billing', status: 'Approved', submittedOn: '20 Feb 2026' },
    { recordId: 'REC-4120', molecule: 'Ceftriaxone', product: 'Ceftrimax 500 mg', country: 'Germany', region: 'Europe', regulatoryContext: 'Highly Regulated', stage: 'Submission', status: 'Submitted', submittedOn: '15 Mar 2026' },

    { recordId: 'REC-4121', molecule: 'Enoxaparin Sodium', product: 'Enoxalow 60 mg', country: 'France', region: 'Europe', regulatoryContext: 'Highly Regulated', stage: 'Filing', status: 'Filed', submittedOn: '22 Apr 2026' },
    { recordId: 'REC-4122', molecule: 'Atorvastatin', product: 'Atorvex 10 mg', country: 'France', region: 'Europe', regulatoryContext: 'Highly Regulated', stage: 'Submission', status: 'Submitted', submittedOn: '12 May 2026' },
    { recordId: 'REC-4123', molecule: 'Ceftriaxone', product: 'Ceftrimax 1 g', country: 'France', region: 'Europe', regulatoryContext: 'Highly Regulated', stage: 'Billing', status: 'Approved', submittedOn: '24 Jun 2026' },

    { recordId: 'REC-4124', molecule: 'Enoxaparin Sodium', product: 'Enoxalow 40 mg', country: 'Spain', region: 'Europe', regulatoryContext: 'Highly Regulated', stage: 'Submission', status: 'Submitted', submittedOn: '15 Jul 2026' },
    { recordId: 'REC-4125', molecule: 'Atorvastatin', product: 'Atorvex 20 mg', country: 'Spain', region: 'Europe', regulatoryContext: 'Highly Regulated', stage: 'Billing', status: 'Approved', submittedOn: '25 Aug 2026' },
    { recordId: 'REC-4126', molecule: 'Ceftriaxone', product: 'Ceftrimax 500 mg', country: 'Spain', region: 'Europe', regulatoryContext: 'Highly Regulated', stage: 'Approval', status: 'Filed', submittedOn: '10 Sep 2026' },

    { recordId: 'REC-4127', molecule: 'Enoxaparin Sodium', product: 'Enoxalow 40 mg', country: 'Poland', region: 'Europe', regulatoryContext: 'Semi Regulated', stage: 'Billing', status: 'Submitted', submittedOn: '01 Jan 2026' },
    { recordId: 'REC-4128', molecule: 'Atorvastatin', product: 'Atorvex 20 mg', country: 'Poland', region: 'Europe', regulatoryContext: 'Semi Regulated', stage: 'Submission', status: 'Declined', submittedOn: '12 Feb 2026' },
    { recordId: 'REC-4129', molecule: 'Ceftriaxone', product: 'Ceftrimax 1 g', country: 'Poland', region: 'Europe', regulatoryContext: 'Semi Regulated', stage: 'Filing', status: 'Approved', submittedOn: '05 Mar 2026' },

    { recordId: 'REC-4130', molecule: 'Enoxaparin Sodium', product: 'Enoxalow 40 mg', country: 'South Africa', region: 'Africa', regulatoryContext: 'Semi Regulated', stage: 'Approval', status: 'Approved', submittedOn: '12 Apr 2026' },
    { recordId: 'REC-4131', molecule: 'Atorvastatin', product: 'Atorvex 20 mg', country: 'South Africa', region: 'Africa', regulatoryContext: 'Semi Regulated', stage: 'Filing', status: 'Filed', submittedOn: '05 May 2026' },
    { recordId: 'REC-4132', molecule: 'Ceftriaxone', product: 'Ceftrimax 500 mg', country: 'South Africa', region: 'Africa', regulatoryContext: 'Semi Regulated', stage: 'Submission', status: 'Submitted', submittedOn: '12 Jun 2026' },

    { recordId: 'REC-4133', molecule: 'Enoxaparin Sodium', product: 'Enoxalow 40 mg', country: 'Kenya', region: 'Africa', regulatoryContext: 'Lightly Regulated', stage: 'Filing', status: 'Declined', submittedOn: '07 Jul 2026' },
    { recordId: 'REC-4134', molecule: 'Atorvastatin', product: 'Atorvex 20 mg', country: 'Kenya', region: 'Africa', regulatoryContext: 'Lightly Regulated', stage: 'Submission', status: 'Submitted', submittedOn: '14 Aug 2026' },
    { recordId: 'REC-4135', molecule: 'Ceftriaxone', product: 'Ceftrimax 1 g', country: 'Kenya', region: 'Africa', regulatoryContext: 'Lightly Regulated', stage: 'Billing', status: 'Approved', submittedOn: '01 Sep 2026' },

    { recordId: 'REC-4136', molecule: 'Enoxaparin Sodium', product: 'Enoxalow 40 mg', country: 'Nigeria', region: 'Africa', regulatoryContext: 'Lightly Regulated', stage: 'Submission', status: 'Filed', submittedOn: '11 Jan 2026' },
    { recordId: 'REC-4137', molecule: 'Atorvastatin', product: 'Atorvex 20 mg', country: 'Nigeria', region: 'Africa', regulatoryContext: 'Lightly Regulated', stage: 'Filing', status: 'Submitted', submittedOn: '17 Feb 2026' },
    { recordId: 'REC-4138', molecule: 'Ceftriaxone', product: 'Ceftrimax 500 mg', country: 'Nigeria', region: 'Africa', regulatoryContext: 'Lightly Regulated', stage: 'Approval', status: 'Declined', submittedOn: '04 Mar 2026' },

    { recordId: 'REC-4139', molecule: 'Enoxaparin Sodium', product: 'Enoxalow 40 mg', country: 'Egypt', region: 'Africa', regulatoryContext: 'Semi Regulated', stage: 'Billing', status: 'Approved', submittedOn: '12 Apr 2026' },
    { recordId: 'REC-4140', molecule: 'Atorvastatin', product: 'Atorvex 20 mg', country: 'Egypt', region: 'Africa', regulatoryContext: 'Semi Regulated', stage: 'Approval', status: 'Approved', submittedOn: '15 May 2026' },
    { recordId: 'REC-4141', molecule: 'Ceftriaxone', product: 'Ceftrimax 1 g', country: 'Egypt', region: 'Africa', regulatoryContext: 'Semi Regulated', stage: 'Filing', status: 'Filed', submittedOn: '10 Jun 2026' },

    { recordId: 'REC-4142', molecule: 'Enoxaparin Sodium', product: 'Enoxalow 40 mg', country: 'Saudi Arabia', region: 'Middle East', regulatoryContext: 'Semi Regulated', stage: 'Approval', status: 'Submitted', submittedOn: '14 Jul 2026' },
    { recordId: 'REC-4143', molecule: 'Atorvastatin', product: 'Atorvex 20 mg', country: 'Saudi Arabia', region: 'Middle East', regulatoryContext: 'Semi Regulated', stage: 'Filing', status: 'Declined', submittedOn: '17 Aug 2026' },
    { recordId: 'REC-4144', molecule: 'Ceftriaxone', product: 'Ceftrimax 500 mg', country: 'Saudi Arabia', region: 'Middle East', regulatoryContext: 'Semi Regulated', stage: 'Submission', status: 'Submitted', submittedOn: '19 Sep 2026' },

    { recordId: 'REC-4145', molecule: 'Enoxaparin Sodium', product: 'Enoxalow 40 mg', country: 'UAE', region: 'Middle East', regulatoryContext: 'Semi Regulated', stage: 'Billing', status: 'Approved', submittedOn: '15 Jan 2026' },
    { recordId: 'REC-4146', molecule: 'Atorvastatin', product: 'Atorvex 20 mg', country: 'UAE', region: 'Middle East', regulatoryContext: 'Semi Regulated', stage: 'Filing', status: 'Filed', submittedOn: '19 Feb 2026' },
    { recordId: 'REC-4147', molecule: 'Ceftriaxone', product: 'Ceftrimax 1 g', country: 'UAE', region: 'Middle East', regulatoryContext: 'Semi Regulated', stage: 'Billing', status: 'Submitted', submittedOn: '27 Mar 2026' },

    { recordId: 'REC-4148', molecule: 'Enoxaparin Sodium', product: 'Enoxalow 40 mg', country: 'India', region: 'Asia Pacific', regulatoryContext: 'Semi Regulated', stage: 'Submission', status: 'Declined', submittedOn: '18 Apr 2026' },
    { recordId: 'REC-4149', molecule: 'Atorvastatin', product: 'Atorvex 20 mg', country: 'India', region: 'Asia Pacific', regulatoryContext: 'Semi Regulated', stage: 'Filing', status: 'Submitted', submittedOn: '22 May 2026' },
    { recordId: 'REC-4150', molecule: 'Ceftriaxone', product: 'Ceftrimax 500 mg', country: 'India', region: 'Asia Pacific', regulatoryContext: 'Semi Regulated', stage: 'Approval', status: 'Approved', submittedOn: '11 Jun 2026' },

    { recordId: 'REC-4151', molecule: 'Enoxaparin Sodium', product: 'Enoxalow 40 mg', country: 'China', region: 'Asia Pacific', regulatoryContext: 'Highly Regulated', stage: 'Filing', status: 'Filed', submittedOn: '25 Jul 2026' },
    { recordId: 'REC-4152', molecule: 'Atorvastatin', product: 'Atorvex 20 mg', country: 'China', region: 'Asia Pacific', regulatoryContext: 'Highly Regulated', stage: 'Submission', status: 'Submitted', submittedOn: '19 Aug 2026' },
    { recordId: 'REC-4153', molecule: 'Ceftriaxone', product: 'Ceftrimax 1 g', country: 'China', region: 'Asia Pacific', regulatoryContext: 'Highly Regulated', stage: 'Filing', status: 'Declined', submittedOn: '27 Sep 2026' },

    { recordId: 'REC-4154', molecule: 'Enoxaparin Sodium', product: 'Enoxalow 40 mg', country: 'Japan', region: 'Asia Pacific', regulatoryContext: 'Highly Regulated', stage: 'Approval', status: 'Submitted', submittedOn: '13 Jan 2026' },
    { recordId: 'REC-4155', molecule: 'Atorvastatin', product: 'Atorvex 20 mg', country: 'Japan', region: 'Asia Pacific', regulatoryContext: 'Highly Regulated', stage: 'Billing', status: 'Approved', submittedOn: '02 Feb 2026' },
    { recordId: 'REC-4156', molecule: 'Ceftriaxone', product: 'Ceftrimax 500 mg', country: 'Japan', region: 'Asia Pacific', regulatoryContext: 'Highly Regulated', stage: 'Submission', status: 'Filed', submittedOn: '15 Mar 2026' },

    { recordId: 'REC-4157', molecule: 'Enoxaparin Sodium', product: 'Enoxalow 40 mg', country: 'Australia', region: 'Asia Pacific', regulatoryContext: 'Highly Regulated', stage: 'Billing', status: 'Declined', submittedOn: '04 Apr 2026' },
    { recordId: 'REC-4158', molecule: 'Atorvastatin', product: 'Atorvex 20 mg', country: 'Australia', region: 'Asia Pacific', regulatoryContext: 'Highly Regulated', stage: 'Approval', status: 'Approved', submittedOn: '18 May 2026' },
    { recordId: 'REC-4159', molecule: 'Ceftriaxone', product: 'Ceftrimax 1 g', country: 'Australia', region: 'Asia Pacific', regulatoryContext: 'Highly Regulated', stage: 'Filing', status: 'Submitted', submittedOn: '05 Jun 2026' },

    { recordId: 'REC-4160', molecule: 'Enoxaparin Sodium', product: 'Enoxalow 40 mg', country: 'Vietnam', region: 'Asia Pacific', regulatoryContext: 'Lightly Regulated', stage: 'Approval', status: 'Approved', submittedOn: '03 Jul 2026' },
    { recordId: 'REC-4161', molecule: 'Atorvastatin', product: 'Atorvex 20 mg', country: 'Vietnam', region: 'Asia Pacific', regulatoryContext: 'Lightly Regulated', stage: 'Filing', status: 'Filed', submittedOn: '08 Aug 2026' },
    { recordId: 'REC-4162', molecule: 'Ceftriaxone', product: 'Ceftrimax 500 mg', country: 'Vietnam', region: 'Asia Pacific', regulatoryContext: 'Lightly Regulated', stage: 'Submission', status: 'Submitted', submittedOn: '12 Sep 2026' },

    { recordId: 'REC-4163', molecule: 'Enoxaparin Sodium', product: 'Enoxalow 40 mg', country: 'Philippines', region: 'Asia Pacific', regulatoryContext: 'Lightly Regulated', stage: 'Submission', status: 'Declined', submittedOn: '10 Jan 2026' },
    { recordId: 'REC-4164', molecule: 'Atorvastatin', product: 'Atorvex 20 mg', country: 'Philippines', region: 'Asia Pacific', regulatoryContext: 'Lightly Regulated', stage: 'Submission', status: 'Submitted', submittedOn: '19 Feb 2026' },
    { recordId: 'REC-4165', molecule: 'Ceftriaxone', product: 'Ceftrimax 1 g', country: 'Philippines', region: 'Asia Pacific', regulatoryContext: 'Lightly Regulated', stage: 'Filing', status: 'Approved', submittedOn: '12 Mar 2026' },
  ]);

  // Reactive filtering using global dashboard filters
  readonly filteredRecords = computed(() => {
    let list = this.allRecords();
    const mol = this.dashboard ? this.dashboard.filterMolecule() : 'All molecule';
    const country = this.dashboard ? this.dashboard.filterCountry() : 'All country';
    const region = this.dashboard ? this.dashboard.filterRegion() : 'All region';
    const regContext = this.dashboard ? this.dashboard.filterRegulatoryContext() : 'All regulatory context';

    if (mol && mol !== 'All molecule') {
      list = list.filter((r) => r.molecule.toLowerCase().includes(mol.toLowerCase()));
    }
    if (country && country !== 'All country') {
      list = list.filter((r) => r.country.toLowerCase() === country.toLowerCase());
    }
    if (region && region !== 'All region') {
      list = list.filter((r) => r.region.toLowerCase() === region.toLowerCase());
    }
    if (regContext && regContext !== 'All regulatory context') {
      list = list.filter((r) => r.regulatoryContext.toLowerCase().includes(regContext.toLowerCase()));
    }
    return list;
  });

  setBreakdown(view: 'Country' | 'Region' | 'Regulatory Context'): void {
    this.selectedBreakdown.set(view);
  }
}
