import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface ReportRecord {
  reportId: string;
  reportName: string;
  reportType: 'Monthly Submissions' | 'Overdue Report' | 'Molecule Summary' | 'Traction Report';
  scope: string;
  periodFrom: string;
  periodTo: string;
  frequency: 'Monthly' | 'Weekly' | 'Quarterly' | 'Annual';
  format: 'Excel' | 'PDF' | 'CSV';
  owner: string;
  lastGenerated: string;
  records: number;
  status: 'Generated' | 'Scheduled' | 'Pending';
}

import { ReportPopComponent } from './report-pop/report-pop.component';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    MatTooltipModule,
    ReportPopComponent,
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss',
})
export class ReportsComponent {
  // Search query
  readonly searchTerm = signal<string>('');

  // Selected filter type
  readonly selectedType = signal<string>('All');

  // Filter tabs
  readonly filterTabs = [
    'All',
    'Monthly Submissions',
    'Overdue Report',
    'Molecule Summary',
    'Traction Report',
  ];

  // Pagination state (default page size 10)
  readonly pageSize = signal<number>(10);
  readonly pageIndex = signal<number>(0);
  readonly pageSizeOptions = [5, 10, 15, 20];

  // Add Report modal state
  readonly isAddModalOpen = signal<boolean>(false);

  // New report model
  newReport: Partial<ReportRecord> = {
    reportId: '',
    reportName: '',
    reportType: 'Monthly Submissions',
    scope: 'All regions',
    periodFrom: '01 Oct 2026',
    periodTo: '31 Oct 2026',
    frequency: 'Monthly',
    format: 'Excel',
    owner: 'Regulatory Ops',
    lastGenerated: '—',
    records: 0,
    status: 'Scheduled',
  };

  // Comprehensive reports dataset (matching screenshot and expanded to 15 records)
  readonly allReports = signal<ReportRecord[]>([
    {
      reportId: 'RPT-501',
      reportName: 'September 2026 Submissions',
      reportType: 'Monthly Submissions',
      scope: 'All regions',
      periodFrom: '01 Sept 2026',
      periodTo: '30 Sept 2026',
      frequency: 'Monthly',
      format: 'Excel',
      owner: 'Regulatory Ops',
      lastGenerated: '21 Sept 2026',
      records: 46,
      status: 'Generated',
    },
    {
      reportId: 'RPT-502',
      reportName: 'Overdue Dossiers – Q3',
      reportType: 'Overdue Report',
      scope: 'Europe, Africa',
      periodFrom: '01 Jul 2026',
      periodTo: '30 Sept 2026',
      frequency: 'Weekly',
      format: 'PDF',
      owner: 'Priya Nair',
      lastGenerated: '20 Sept 2026',
      records: 12,
      status: 'Generated',
    },
    {
      reportId: 'RPT-503',
      reportName: 'Molecule Summary – Enoxaparin',
      reportType: 'Molecule Summary',
      scope: 'Enoxaparin Sodium',
      periodFrom: '01 Jan 2026',
      periodTo: '30 Sept 2026',
      frequency: 'Quarterly',
      format: 'PDF',
      owner: 'Regulatory Ops',
      lastGenerated: '01 Sept 2026',
      records: 8,
      status: 'Generated',
    },
    {
      reportId: 'RPT-504',
      reportName: 'Traction – Asia Pacific',
      reportType: 'Traction Report',
      scope: 'Asia Pacific',
      periodFrom: '01 Apr 2026',
      periodTo: '30 Sept 2026',
      frequency: 'Monthly',
      format: 'Excel',
      owner: 'Commercial Team',
      lastGenerated: '18 Sept 2026',
      records: 31,
      status: 'Generated',
    },
    {
      reportId: 'RPT-505',
      reportName: 'October 2026 Submissions',
      reportType: 'Monthly Submissions',
      scope: 'All regions',
      periodFrom: '01 Oct 2026',
      periodTo: '31 Oct 2026',
      frequency: 'Monthly',
      format: 'CSV',
      owner: 'Regulatory Ops',
      lastGenerated: '—',
      records: 0,
      status: 'Scheduled',
    },
    {
      reportId: 'RPT-506',
      reportName: 'Atorvastatin Global Compliance',
      reportType: 'Molecule Summary',
      scope: 'Atorvastatin',
      periodFrom: '01 Jan 2026',
      periodTo: '31 Dec 2026',
      frequency: 'Quarterly',
      format: 'PDF',
      owner: 'Dr. Sarah Jenkins',
      lastGenerated: '15 Sept 2026',
      records: 24,
      status: 'Generated',
    },
    {
      reportId: 'RPT-507',
      reportName: 'Latin America Filing Backlog',
      reportType: 'Overdue Report',
      scope: 'Latin America',
      periodFrom: '01 May 2026',
      periodTo: '30 Sept 2026',
      frequency: 'Weekly',
      format: 'Excel',
      owner: 'Carlos Mendoza',
      lastGenerated: '19 Sept 2026',
      records: 15,
      status: 'Generated',
    },
    {
      reportId: 'RPT-508',
      reportName: 'Quarterly Commercial Traction Q2',
      reportType: 'Traction Report',
      scope: 'Global Markets',
      periodFrom: '01 Apr 2026',
      periodTo: '30 Jun 2026',
      frequency: 'Quarterly',
      format: 'PDF',
      owner: 'Commercial Team',
      lastGenerated: '10 Jul 2026',
      records: 62,
      status: 'Generated',
    },
    {
      reportId: 'RPT-509',
      reportName: 'August 2026 Submissions Audit',
      reportType: 'Monthly Submissions',
      scope: 'North America, Europe',
      periodFrom: '01 Aug 2026',
      periodTo: '31 Aug 2026',
      frequency: 'Monthly',
      format: 'CSV',
      owner: 'Regulatory Ops',
      lastGenerated: '02 Sept 2026',
      records: 38,
      status: 'Generated',
    },
    {
      reportId: 'RPT-510',
      reportName: 'Ceftriaxone Emerging Markets',
      reportType: 'Molecule Summary',
      scope: 'Ceftriaxone',
      periodFrom: '01 Feb 2026',
      periodTo: '31 Aug 2026',
      frequency: 'Monthly',
      format: 'Excel',
      owner: 'Priya Nair',
      lastGenerated: '05 Sept 2026',
      records: 19,
      status: 'Generated',
    },
    {
      reportId: 'RPT-511',
      reportName: 'November 2026 Scheduled Filings',
      reportType: 'Monthly Submissions',
      scope: 'All regions',
      periodFrom: '01 Nov 2026',
      periodTo: '30 Nov 2026',
      frequency: 'Monthly',
      format: 'Excel',
      owner: 'Regulatory Ops',
      lastGenerated: '—',
      records: 0,
      status: 'Scheduled',
    },
    {
      reportId: 'RPT-512',
      reportName: 'Regulatory Authority Inquiry Log',
      reportType: 'Overdue Report',
      scope: 'Middle East, Africa',
      periodFrom: '01 Jun 2026',
      periodTo: '15 Sept 2026',
      frequency: 'Weekly',
      format: 'PDF',
      owner: 'Ahmed Al-Mansoor',
      lastGenerated: '16 Sept 2026',
      records: 7,
      status: 'Generated',
    },
    {
      reportId: 'RPT-513',
      reportName: 'Metformin Supply Chain Traction',
      reportType: 'Traction Report',
      scope: 'Asia Pacific, Europe',
      periodFrom: '01 Jan 2026',
      periodTo: '31 Aug 2026',
      frequency: 'Monthly',
      format: 'Excel',
      owner: 'Commercial Team',
      lastGenerated: '12 Sept 2026',
      records: 44,
      status: 'Generated',
    },
    {
      reportId: 'RPT-514',
      reportName: 'Iohexol Clinical Trial Dossiers',
      reportType: 'Molecule Summary',
      scope: 'Iohexol',
      periodFrom: '01 Mar 2026',
      periodTo: '30 Sept 2026',
      frequency: 'Quarterly',
      format: 'PDF',
      owner: 'Dr. Sarah Jenkins',
      lastGenerated: '08 Sept 2026',
      records: 11,
      status: 'Generated',
    },
    {
      reportId: 'RPT-515',
      reportName: 'December 2026 Year-End Closures',
      reportType: 'Monthly Submissions',
      scope: 'All regions',
      periodFrom: '01 Dec 2026',
      periodTo: '31 Dec 2026',
      frequency: 'Monthly',
      format: 'CSV',
      owner: 'Regulatory Ops',
      lastGenerated: '—',
      records: 0,
      status: 'Scheduled',
    },
  ]);

  // Reactive filtered reports
  readonly filteredReports = computed(() => {
    let list = this.allReports();
    const type = this.selectedType();
    const query = this.searchTerm().trim().toLowerCase();

    if (type !== 'All') {
      list = list.filter((r) => r.reportType === type);
    }

    if (query) {
      list = list.filter(
        (r) =>
          r.reportId.toLowerCase().includes(query) ||
          r.reportName.toLowerCase().includes(query) ||
          r.scope.toLowerCase().includes(query) ||
          r.owner.toLowerCase().includes(query) ||
          r.format.toLowerCase().includes(query) ||
          r.frequency.toLowerCase().includes(query)
      );
    }

    return list;
  });

  // Paginated list
  readonly paginatedReports = computed(() => {
    const list = this.filteredReports();
    const start = this.pageIndex() * this.pageSize();
    return list.slice(start, start + this.pageSize());
  });

  setTab(tab: string): void {
    this.selectedType.set(tab);
    this.pageIndex.set(0);
  }

  onSearch(term: string): void {
    this.searchTerm.set(term);
    this.pageIndex.set(0);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  openAddModal(): void {
    const nextNum = 501 + this.allReports().length;
    this.newReport = {
      reportId: `RPT-${nextNum}`,
      reportName: '',
      reportType: 'Monthly Submissions',
      scope: 'All regions',
      periodFrom: '01 Oct 2026',
      periodTo: '31 Oct 2026',
      frequency: 'Monthly',
      format: 'Excel',
      owner: 'Regulatory Ops',
      lastGenerated: '—',
      records: 0,
      status: 'Scheduled',
    };
    this.isAddModalOpen.set(true);
  }

  closeAddModal(): void {
    this.isAddModalOpen.set(false);
  }

  saveReport(data?: Partial<ReportRecord>): void {
    const input = data || this.newReport;
    if (!input.reportName || !input.scope) {
      return;
    }
    const report: ReportRecord = {
      reportId: input.reportId || `RPT-${501 + this.allReports().length}`,
      reportName: input.reportName,
      reportType: (input.reportType as any) || 'Monthly Submissions',
      scope: input.scope || 'All regions',
      periodFrom: input.periodFrom || '01 Oct 2026',
      periodTo: input.periodTo || '31 Oct 2026',
      frequency: (input.frequency as any) || 'Monthly',
      format: (input.format as any) || 'Excel',
      owner: input.owner || 'Regulatory Ops',
      lastGenerated: input.lastGenerated || '—',
      records: Number(input.records) || 0,
      status: (input.status as any) || 'Scheduled',
    };

    this.allReports.update((list) => [report, ...list]);
    this.closeAddModal();
  }
}
