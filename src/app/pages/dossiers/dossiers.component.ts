import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface DossierRecord {
  dossierId: string;
  dateOfSubmission: string;
  moleculeName: string;
  productName: string;
  strength: string;
  fillVolume: string;
  country: string;
  region: string;
  marketType: 'Regulated' | 'Semi-Regulated' | 'Emerging';
  status: 'Under Review' | 'Approved' | 'Query Raised' | 'Submitted';
  lastUpdated: string;
  eta: string;
}

@Component({
  selector: 'app-dossiers',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatDialogModule,
  ],
  templateUrl: './dossiers.component.html',
  styleUrl: './dossiers.component.scss',
})
export class DossiersComponent {
  // Search query
  readonly searchTerm = signal<string>('');

  // Pagination state (default page size is 10 as requested)
  readonly pageSize = signal<number>(10);
  readonly pageIndex = signal<number>(0);
  readonly pageSizeOptions = [5, 10, 15, 20];

  // Add Dossier modal visibility
  readonly isAddModalOpen = signal<boolean>(false);

  // New Dossier form model
  newDossier: Partial<DossierRecord> = {
    dossierId: '',
    moleculeName: '',
    productName: '',
    strength: '',
    fillVolume: '',
    country: '',
    region: 'Europe',
    marketType: 'Regulated',
    status: 'Submitted',
    dateOfSubmission: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    lastUpdated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    eta: '31 Dec 2026',
  };

  // 15 comprehensive dossier records matching screenshot
  readonly allDossiers = signal<DossierRecord[]>([
    {
      dossierId: 'DOS-1041',
      dateOfSubmission: '14 Jan 2026',
      moleculeName: 'Enoxaparin Sodium',
      productName: 'Enoxalow',
      strength: '40 mg/0.4 mL',
      fillVolume: '0.4 mL',
      country: 'Germany',
      region: 'Europe',
      marketType: 'Regulated',
      status: 'Under Review',
      lastUpdated: '08 Sept 2026',
      eta: '30 Nov 2026',
    },
    {
      dossierId: 'DOS-1042',
      dateOfSubmission: '02 Nov 2025',
      moleculeName: 'Atorvastatin',
      productName: 'Atorvex',
      strength: '20 mg',
      fillVolume: 'N/A (tablet)',
      country: 'United States',
      region: 'North America',
      marketType: 'Regulated',
      status: 'Approved',
      lastUpdated: '21 Aug 2026',
      eta: '30 Sept 2026',
    },
    {
      dossierId: 'DOS-1043',
      dateOfSubmission: '27 Mar 2026',
      moleculeName: 'Ceftriaxone',
      productName: 'Ceftrimax',
      strength: '1 g',
      fillVolume: '10 mL vial',
      country: 'Kenya',
      region: 'Africa',
      marketType: 'Emerging',
      status: 'Query Raised',
      lastUpdated: '15 Sept 2026',
      eta: '15 Dec 2026',
    },
    {
      dossierId: 'DOS-1044',
      dateOfSubmission: '09 May 2026',
      moleculeName: 'Iohexol',
      productName: 'Iohexa Inject',
      strength: '350 mg I/mL',
      fillVolume: '100 mL',
      country: 'Japan',
      region: 'Asia Pacific',
      marketType: 'Regulated',
      status: 'Submitted',
      lastUpdated: '18 Sept 2026',
      eta: '28 Feb 2027',
    },
    {
      dossierId: 'DOS-1045',
      dateOfSubmission: '01 Jul 2026',
      moleculeName: 'Ondansetron',
      productName: 'Onsetra',
      strength: '8 mg/4 mL',
      fillVolume: '4 mL ampoule',
      country: 'Brazil',
      region: 'Latin America',
      marketType: 'Semi-Regulated',
      status: 'Under Review',
      lastUpdated: '12 Sept 2026',
      eta: '20 Jan 2027',
    },
    {
      dossierId: 'DOS-1046',
      dateOfSubmission: '18 Feb 2026',
      moleculeName: 'Metformin HCl',
      productName: 'Metfosure XR',
      strength: '1000 mg',
      fillVolume: 'N/A (tablet)',
      country: 'India',
      region: 'Asia Pacific',
      marketType: 'Emerging',
      status: 'Approved',
      lastUpdated: '30 Aug 2026',
      eta: '31 Oct 2026',
    },
    {
      dossierId: 'DOS-1047',
      dateOfSubmission: '11 Apr 2026',
      moleculeName: 'Amlodipine Besylate',
      productName: 'Amlonorm',
      strength: '5 mg',
      fillVolume: 'N/A (tablet)',
      country: 'United Kingdom',
      region: 'Europe',
      marketType: 'Regulated',
      status: 'Under Review',
      lastUpdated: '05 Sept 2026',
      eta: '15 Jan 2027',
    },
    {
      dossierId: 'DOS-1048',
      dateOfSubmission: '24 May 2026',
      moleculeName: 'Pantoprazole',
      productName: 'Pantoplus',
      strength: '40 mg',
      fillVolume: 'N/A (tablet)',
      country: 'Canada',
      region: 'North America',
      marketType: 'Regulated',
      status: 'Approved',
      lastUpdated: '10 Sept 2026',
      eta: '28 Dec 2026',
    },
    {
      dossierId: 'DOS-1049',
      dateOfSubmission: '15 Jun 2026',
      moleculeName: 'Rosuvastatin',
      productName: 'Rosuvid',
      strength: '10 mg',
      fillVolume: 'N/A (tablet)',
      country: 'France',
      region: 'Europe',
      marketType: 'Regulated',
      status: 'Query Raised',
      lastUpdated: '19 Sept 2026',
      eta: '10 Feb 2027',
    },
    {
      dossierId: 'DOS-1050',
      dateOfSubmission: '03 Feb 2026',
      moleculeName: 'Levofloxacin',
      productName: 'Levoquin',
      strength: '500 mg',
      fillVolume: '100 mL infusion',
      country: 'South Africa',
      region: 'Africa',
      marketType: 'Semi-Regulated',
      status: 'Submitted',
      lastUpdated: '14 Aug 2026',
      eta: '25 Nov 2026',
    },
    {
      dossierId: 'DOS-1051',
      dateOfSubmission: '19 Mar 2026',
      moleculeName: 'Azithromycin',
      productName: 'Azithrocin',
      strength: '250 mg',
      fillVolume: 'N/A (suspension)',
      country: 'Australia',
      region: 'Asia Pacific',
      marketType: 'Regulated',
      status: 'Approved',
      lastUpdated: '02 Sept 2026',
      eta: '12 Jan 2027',
    },
    {
      dossierId: 'DOS-1052',
      dateOfSubmission: '08 Jan 2026',
      moleculeName: 'Paracetamol',
      productName: 'Paramol',
      strength: '650 mg',
      fillVolume: 'N/A (tablet)',
      country: 'Spain',
      region: 'Europe',
      marketType: 'Regulated',
      status: 'Under Review',
      lastUpdated: '28 Aug 2026',
      eta: '18 Nov 2026',
    },
    {
      dossierId: 'DOS-1053',
      dateOfSubmission: '22 Feb 2026',
      moleculeName: 'Ibuprofen',
      productName: 'Ibuact',
      strength: '400 mg',
      fillVolume: 'N/A (tablet)',
      country: 'Mexico',
      region: 'Latin America',
      marketType: 'Semi-Regulated',
      status: 'Query Raised',
      lastUpdated: '16 Sept 2026',
      eta: '05 Jan 2027',
    },
    {
      dossierId: 'DOS-1054',
      dateOfSubmission: '05 May 2026',
      moleculeName: 'Omeprazole',
      productName: 'Omezest',
      strength: '20 mg',
      fillVolume: 'N/A (capsule)',
      country: 'Saudi Arabia',
      region: 'Middle East',
      marketType: 'Semi-Regulated',
      status: 'Submitted',
      lastUpdated: '09 Sept 2026',
      eta: '14 Feb 2027',
    },
    {
      dossierId: 'DOS-1055',
      dateOfSubmission: '12 Jun 2026',
      moleculeName: 'Clopidogrel',
      productName: 'Clopifast',
      strength: '75 mg',
      fillVolume: 'N/A (tablet)',
      country: 'Vietnam',
      region: 'Asia Pacific',
      marketType: 'Emerging',
      status: 'Approved',
      lastUpdated: '17 Sept 2026',
      eta: '22 Mar 2027',
    },
  ]);

  // Reactive search filtered list
  readonly filteredDossiers = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) {
      return this.allDossiers();
    }
    return this.allDossiers().filter(
      (d) =>
        d.dossierId.toLowerCase().includes(term) ||
        d.moleculeName.toLowerCase().includes(term) ||
        d.productName.toLowerCase().includes(term) ||
        d.country.toLowerCase().includes(term) ||
        d.region.toLowerCase().includes(term) ||
        d.marketType.toLowerCase().includes(term) ||
        d.status.toLowerCase().includes(term) ||
        d.strength.toLowerCase().includes(term)
    );
  });

  // Paginated records
  readonly paginatedDossiers = computed(() => {
    const list = this.filteredDossiers();
    const start = this.pageIndex() * this.pageSize();
    return list.slice(start, start + this.pageSize());
  });

  onSearch(term: string): void {
    this.searchTerm.set(term);
    this.pageIndex.set(0); // Reset to first page on search
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  openAddModal(): void {
    const nextNum = 1041 + this.allDossiers().length;
    this.newDossier = {
      dossierId: `DOS-${nextNum}`,
      moleculeName: '',
      productName: '',
      strength: '20 mg',
      fillVolume: 'N/A (tablet)',
      country: 'United States',
      region: 'North America',
      marketType: 'Regulated',
      status: 'Submitted',
      dateOfSubmission: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      lastUpdated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      eta: '31 Dec 2026',
    };
    this.isAddModalOpen.set(true);
  }

  closeAddModal(): void {
    this.isAddModalOpen.set(false);
  }

  saveDossier(): void {
    if (!this.newDossier.moleculeName || !this.newDossier.productName || !this.newDossier.country) {
      return;
    }
    const record: DossierRecord = {
      dossierId: this.newDossier.dossierId || `DOS-${1041 + this.allDossiers().length}`,
      dateOfSubmission: this.newDossier.dateOfSubmission || 'Today',
      moleculeName: this.newDossier.moleculeName,
      productName: this.newDossier.productName,
      strength: this.newDossier.strength || '20 mg',
      fillVolume: this.newDossier.fillVolume || 'N/A (tablet)',
      country: this.newDossier.country,
      region: this.newDossier.region || 'Europe',
      marketType: (this.newDossier.marketType as any) || 'Regulated',
      status: (this.newDossier.status as any) || 'Submitted',
      lastUpdated: this.newDossier.lastUpdated || 'Today',
      eta: this.newDossier.eta || '31 Dec 2026',
    };

    this.allDossiers.update((list) => [record, ...list]);
    this.closeAddModal();
  }
}
