import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DeletePopComponent } from '../shared/delete-pop/delete-pop.component';
import { FreezepanesDialogComponent, GridColumn } from '../shared/freezepanes-dialog/freezepanes-dialog.component';
import { GridScrollerComponent } from '../shared/grid-scroller/grid-scroller.component';
import { PaginatorComponent } from '../shared/paginator/paginator.component';
import { EbCompletedProject, EbPopComponent } from './eb-pop/eb-pop.component';

@Component({
  selector: 'app-eb-completed-projects',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    EbPopComponent,
    DeletePopComponent,
    GridScrollerComponent,
    PaginatorComponent,
  ],
  templateUrl: './eb-completed-projects.component.html',
  styleUrl: './eb-completed-projects.component.scss',
})
export class EbCompletedProjectsComponent implements OnInit {
  // Filter toggle & signals
  filterToggle = signal<boolean>(false);
  filterKeyword = signal<string>('');
  filterMarket = signal<string>('All');
  filterPlantDataStatus = signal<string>('All');
  filterCtdStatus = signal<string>('All');
  filterDosageForm = signal<string>('All');

  // Pagination signals
  pageSize = signal<number>(10);
  currentPage = signal<number>(1);

  // Modal signals
  showEbModal = signal<boolean>(false);
  selectedProjectForEdit = signal<EbCompletedProject | null>(null);

  showDeleteModal = signal<boolean>(false);
  targetDeleteProject = signal<EbCompletedProject | null>(null);

  // Column Configuration & Freeze Panes
  allColumns = signal<GridColumn[]>([
    { key: 'actions', label: 'Actions', visible: true },
    { key: 'serial', label: 'S.No.', visible: true },
    { key: 'molecule', label: 'Molecule', visible: true },
    { key: 'plantDataStatus', label: 'Plant Data Status', visible: true },
    { key: 'market', label: 'Market', visible: true },
    { key: 'productName', label: 'Product Name', visible: true },
    { key: 'pharmacopoeia', label: 'Pharmacopoeia', visible: true },
    { key: 'dosageForm', label: 'Dosage Form', visible: true },
    { key: 'strength', label: 'Strength', visible: true },
    { key: 'fillVolume', label: 'Fill Volume', visible: true },
    { key: 'apiManufacturer', label: 'API Manufacturer', visible: true },
    { key: 'cepDmfNo', label: 'CEP/DMF No', visible: true },
    { key: 'stabilityData', label: 'Stability Data', visible: true },
    { key: 'ctdStatus', label: 'CTD Status', visible: true },
    { key: 'remarks', label: 'Remarks', visible: true },
  ]);

  selectedColumns = signal<GridColumn[]>([
    { key: 'actions', label: 'Actions', visible: true },
    { key: 'serial', label: 'S.No.', visible: true },
    { key: 'molecule', label: 'Molecule', visible: true },
    { key: 'plantDataStatus', label: 'Plant Data Status', visible: true },
    { key: 'market', label: 'Market', visible: true },
    { key: 'productName', label: 'Product Name', visible: true },
    { key: 'pharmacopoeia', label: 'Pharmacopoeia', visible: true },
    { key: 'dosageForm', label: 'Dosage Form', visible: true },
    { key: 'strength', label: 'Strength', visible: true },
    { key: 'fillVolume', label: 'Fill Volume', visible: true },
    { key: 'apiManufacturer', label: 'API Manufacturer', visible: true },
    { key: 'cepDmfNo', label: 'CEP/DMF No', visible: true },
    { key: 'stabilityData', label: 'Stability Data', visible: true },
    { key: 'ctdStatus', label: 'CTD Status', visible: true },
    { key: 'remarks', label: 'Remarks', visible: true },
  ]);

  freezeCount = signal<number>(0);

  visibleColumnCount = computed(() => {
    return this.selectedColumns().filter((c) => c.visible !== false).length || 1;
  });

  columnWidths: Record<string, number> = {
    actions: 90,
    serial: 80,
    molecule: 140,
    plantDataStatus: 160,
    market: 110,
    productName: 280,
    pharmacopoeia: 140,
    dosageForm: 130,
    strength: 140,
    fillVolume: 120,
    apiManufacturer: 160,
    cepDmfNo: 170,
    stabilityData: 140,
    ctdStatus: 160,
    remarks: 220,
  };

  // Column-Specific Search Filters (Matching Image 3)
  columnFilters = signal<Record<string, string>>({
    serial: '',
    molecule: '',
    plantDataStatus: '',
    market: '',
    productName: '',
    pharmacopoeia: '',
    dosageForm: '',
    strength: '',
    fillVolume: '',
    apiManufacturer: '',
    cepDmfNo: '',
    stabilityData: '',
    ctdStatus: '',
    remarks: '',
  });

  hasActiveColumnFilters = computed(() => {
    return Object.values(this.columnFilters()).some((val) => !!val.trim());
  });

  setColumnFilter(key: string, value: string): void {
    this.columnFilters.update((prev) => ({ ...prev, [key]: value }));
    this.currentPage.set(1);
  }

  clearColumnFilter(key: string): void {
    this.setColumnFilter(key, '');
  }

  clearAllColumnFilters(): void {
    this.columnFilters.set({
      serial: '',
      molecule: '',
      plantDataStatus: '',
      market: '',
      productName: '',
      pharmacopoeia: '',
      dosageForm: '',
      strength: '',
      fillVolume: '',
      apiManufacturer: '',
      cepDmfNo: '',
      stabilityData: '',
      ctdStatus: '',
      remarks: '',
    });
    this.currentPage.set(1);
  }

  constructor(private dialog: MatDialog) {}

  // Initial Data (matches the user's screenshots and provides rich records)
  ebProjectsList = signal<EbCompletedProject[]>([
    {
      id: 1,
      serial: 1,
      molecule: 'Abiraterone',
      plantDataStatus: 'Available',
      market: 'Europe',
      productName: 'Abiraterone Acetate Film Coated Tablets',
      pharmacopoeia: '',
      dosageForm: 'Tablets',
      strength: '250 mg & 500 mg',
      fillVolume: 'NA',
      apiManufacturer: 'ABC',
      cepDmfNo: 'DMF: 124edrok',
      stabilityData: '36 Months',
      ctdStatus: 'Available',
      remarks: 'Full technical file submitted in EU',
    },
    {
      id: 2,
      serial: 2,
      molecule: 'Azacitidine',
      plantDataStatus: 'Not Available',
      market: 'Europe',
      productName: 'Azacitidine Powder for Suspension for Injection',
      pharmacopoeia: 'IHS',
      dosageForm: 'Lyo',
      strength: '25mg/ml',
      fillVolume: '4 ml',
      apiManufacturer: 'DEF',
      cepDmfNo: 'CEP:r1-cep-124d',
      stabilityData: '12 Months',
      ctdStatus: 'Available',
      remarks: 'Plant verification audit pending',
    },
    {
      id: 3,
      serial: 3,
      molecule: 'Bortezomib',
      plantDataStatus: 'Available',
      market: 'Europe',
      productName: 'Bortezomib Powder for Solution for Injection',
      pharmacopoeia: 'BP',
      dosageForm: 'Lyo',
      strength: '3.5 mg',
      fillVolume: 'NA',
      apiManufacturer: 'JKLM',
      cepDmfNo: 'ASMF: RED ver 123',
      stabilityData: '1 Month',
      ctdStatus: 'Not available',
      remarks: 'CTD Module 3 update requested',
    },
    {
      id: 4,
      serial: 4,
      molecule: 'Carfilzomib',
      plantDataStatus: 'Under Preparation',
      market: 'Export',
      productName: 'Carfilzomib for Injection',
      pharmacopoeia: 'USP',
      dosageForm: 'Lyo',
      strength: '60 mg/Vial',
      fillVolume: '5 ml',
      apiManufacturer: 'NYC',
      cepDmfNo: 'CADIFA: ABC1234DEFR',
      stabilityData: '3 Months',
      ctdStatus: 'Under Preparation',
      remarks: 'Validation batches ongoing',
    },
    {
      id: 5,
      serial: 5,
      molecule: 'Lenalidomide',
      plantDataStatus: 'Available',
      market: 'US',
      productName: 'Lenalidomide Hard Gelatin Capsules',
      pharmacopoeia: 'USP',
      dosageForm: 'Capsules',
      strength: '5 mg, 10 mg, 15 mg',
      fillVolume: 'NA',
      apiManufacturer: 'LMN Pharma',
      cepDmfNo: 'DMF: 998877',
      stabilityData: '24 Months',
      ctdStatus: 'Available',
      remarks: 'US FDA approval received',
    },
    {
      id: 6,
      serial: 6,
      molecule: 'Pemetrexed',
      plantDataStatus: 'Available',
      market: 'Europe',
      productName: 'Pemetrexed Powder for Concentrate for Solution for Infusion',
      pharmacopoeia: 'Ph.Eur',
      dosageForm: 'Lyo',
      strength: '100 mg & 500 mg',
      fillVolume: '10 ml',
      apiManufacturer: 'Cipla API',
      cepDmfNo: 'CEP: 2021-045',
      stabilityData: '36 Months',
      ctdStatus: 'Available',
      remarks: 'Dossier ready for commercial launch',
    },
    {
      id: 7,
      serial: 7,
      molecule: 'Enzalutamide',
      plantDataStatus: 'Under Preparation',
      market: 'Export',
      productName: 'Enzalutamide Soft Gelatin Capsules',
      pharmacopoeia: 'IHS',
      dosageForm: 'Capsules',
      strength: '40 mg',
      fillVolume: 'NA',
      apiManufacturer: 'Dr. Reddy',
      cepDmfNo: 'DMF: ENZ-2022-A',
      stabilityData: '6 Months',
      ctdStatus: 'Under Preparation',
      remarks: 'Accelerated stability data monitored',
    },
    {
      id: 8,
      serial: 8,
      molecule: 'Palbociclib',
      plantDataStatus: 'Available',
      market: 'Europe',
      productName: 'Palbociclib Hard Capsules',
      pharmacopoeia: 'Ph.Eur',
      dosageForm: 'Capsules',
      strength: '75 mg, 100 mg, 125 mg',
      fillVolume: 'NA',
      apiManufacturer: 'Sun API',
      cepDmfNo: 'ASMF: PAL-8812',
      stabilityData: '18 Months',
      ctdStatus: 'Available',
      remarks: 'CTD filed in 12 Member States',
    },
    {
      id: 9,
      serial: 9,
      molecule: 'Aprepitant',
      plantDataStatus: 'Not Available',
      market: 'Domestic',
      productName: 'Aprepitant Capsules',
      pharmacopoeia: 'IP',
      dosageForm: 'Capsules',
      strength: '125 mg & 80 mg',
      fillVolume: 'NA',
      apiManufacturer: 'Aurobindo',
      cepDmfNo: 'DMF: APR-771',
      stabilityData: '24 Months',
      ctdStatus: 'Not available',
      remarks: 'Plant compliance pending DCGI clearance',
    },
    {
      id: 10,
      serial: 10,
      molecule: 'Fulvestrant',
      plantDataStatus: 'Available',
      market: 'Europe',
      productName: 'Fulvestrant Solution for Injection in Prefilled Syringe',
      pharmacopoeia: 'BP',
      dosageForm: 'Injection',
      strength: '250 mg/5 ml',
      fillVolume: '5 ml',
      apiManufacturer: 'Fresenius',
      cepDmfNo: 'CEP: FUL-9901',
      stabilityData: '24 Months',
      ctdStatus: 'Available',
      remarks: 'Commercial supplies started',
    },
    {
      id: 11,
      serial: 11,
      molecule: 'Gefitinib',
      plantDataStatus: 'Available',
      market: 'MENA',
      productName: 'Gefitinib Film-Coated Tablets',
      pharmacopoeia: 'USP',
      dosageForm: 'Tablets',
      strength: '250 mg',
      fillVolume: 'NA',
      apiManufacturer: 'Hetero',
      cepDmfNo: 'DMF: GEF-102',
      stabilityData: '36 Months',
      ctdStatus: 'Available',
      remarks: 'Approved in UAE and Saudi Arabia',
    },
    {
      id: 12,
      serial: 12,
      molecule: 'Regorafenib',
      plantDataStatus: 'Under Preparation',
      market: 'LATAM',
      productName: 'Regorafenib Tablets',
      pharmacopoeia: 'IHS',
      dosageForm: 'Tablets',
      strength: '40 mg',
      fillVolume: 'NA',
      apiManufacturer: 'Mylan API',
      cepDmfNo: 'DMF: REG-303',
      stabilityData: '9 Months',
      ctdStatus: 'Under Preparation',
      remarks: 'Registration submitted in Brazil ANVISA',
    },
  ]);

  // Dropdown list options derived from data
  marketsList = computed(() => {
    const list = this.ebProjectsList().map((p) => p.market);
    return Array.from(new Set(list)).sort();
  });

  plantDataStatusesList = computed(() => {
    const list = this.ebProjectsList().map((p) => p.plantDataStatus).filter(Boolean);
    return Array.from(new Set(list)).sort();
  });

  ctdStatusesList = computed(() => {
    const list = this.ebProjectsList().map((p) => p.ctdStatus).filter(Boolean);
    return Array.from(new Set(list)).sort();
  });

  dosageList = computed(() => {
    const list = this.ebProjectsList().map((p) => p.dosageForm);
    return Array.from(new Set(list)).sort();
  });

  // Column sorting signals
  sortColumn = signal<string>('');
  sortDirection = signal<'asc' | 'desc' | ''>('');

  onSort(columnKey: string): void {
    if (columnKey === 'actions') return;

    if (this.sortColumn() === columnKey) {
      if (this.sortDirection() === 'asc') {
        this.sortDirection.set('desc');
      } else if (this.sortDirection() === 'desc') {
        this.sortDirection.set('');
        this.sortColumn.set('');
      } else {
        this.sortDirection.set('asc');
      }
    } else {
      this.sortColumn.set(columnKey);
      this.sortDirection.set('asc');
    }
    this.currentPage.set(1);
  }

  getColumnCssClass(key: string): string {
    const map: Record<string, string> = {
      actions: 'col-actions',
      serial: 'th-serial',
      molecule: 'th-molecule',
      plantDataStatus: 'th-plant-status',
      market: 'th-market',
      productName: 'th-product',
      pharmacopoeia: 'th-pharma',
      dosageForm: 'th-dosage',
      strength: 'th-strength',
      fillVolume: 'th-fill',
      apiManufacturer: 'th-api',
      cepDmfNo: 'th-cep',
      stabilityData: 'th-stability',
      ctdStatus: 'th-ctd-status',
      remarks: 'th-remarks',
    };
    return map[key] || ('th-' + key);
  }

  // Filtered EB Completed Projects
  filteredProjects = computed(() => {
    let result = this.ebProjectsList();
    const keyword = this.filterKeyword().trim().toLowerCase();
    const market = this.filterMarket();
    const plantStatus = this.filterPlantDataStatus();
    const ctdStatus = this.filterCtdStatus();
    const dosage = this.filterDosageForm();

    if (keyword) {
      result = result.filter(
        (p) =>
          p.molecule.toLowerCase().includes(keyword) ||
          p.productName.toLowerCase().includes(keyword) ||
          p.apiManufacturer.toLowerCase().includes(keyword) ||
          p.cepDmfNo.toLowerCase().includes(keyword) ||
          p.strength.toLowerCase().includes(keyword) ||
          (p.plantDataStatus && p.plantDataStatus.toLowerCase().includes(keyword)) ||
          (p.ctdStatus && p.ctdStatus.toLowerCase().includes(keyword)) ||
          (p.remarks && p.remarks.toLowerCase().includes(keyword))
      );
    }

    if (market !== 'All') {
      result = result.filter((p) => p.market === market);
    }

    if (plantStatus !== 'All') {
      result = result.filter((p) => p.plantDataStatus === plantStatus);
    }

    if (ctdStatus !== 'All') {
      result = result.filter((p) => p.ctdStatus === ctdStatus);
    }

    if (dosage !== 'All') {
      result = result.filter((p) => p.dosageForm === dosage);
    }

    // Apply Column-Specific Search Filters
    const colFilters = this.columnFilters();
    for (const [key, rawVal] of Object.entries(colFilters)) {
      const q = rawVal.trim().toLowerCase();
      if (!q) continue;

      result = result.filter((p) => {
        switch (key) {
          case 'serial':
            return String(p.serial).toLowerCase().includes(q);
          case 'molecule':
            return p.molecule.toLowerCase().includes(q);
          case 'plantDataStatus':
            return (p.plantDataStatus || '').toLowerCase().includes(q);
          case 'market':
            return p.market.toLowerCase().includes(q);
          case 'productName':
            return p.productName.toLowerCase().includes(q);
          case 'pharmacopoeia':
            return (p.pharmacopoeia || '').toLowerCase().includes(q);
          case 'dosageForm':
            return p.dosageForm.toLowerCase().includes(q);
          case 'strength':
            return p.strength.toLowerCase().includes(q);
          case 'fillVolume':
            return p.fillVolume.toLowerCase().includes(q);
          case 'apiManufacturer':
            return p.apiManufacturer.toLowerCase().includes(q);
          case 'cepDmfNo':
            return p.cepDmfNo.toLowerCase().includes(q);
          case 'stabilityData':
            return p.stabilityData.toLowerCase().includes(q);
          case 'ctdStatus':
            return (p.ctdStatus || '').toLowerCase().includes(q);
          case 'remarks':
            return (p.remarks || '').toLowerCase().includes(q);
          default:
            return true;
        }
      });
    }

    // Apply Column Sorting
    const sortCol = this.sortColumn();
    const sortDir = this.sortDirection();

    if (sortCol && sortDir) {
      result = [...result].sort((a, b) => {
        let valA: any = (a as any)[sortCol];
        let valB: any = (b as any)[sortCol];

        if (valA === null || valA === undefined) valA = '';
        if (valB === null || valB === undefined) valB = '';

        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortDir === 'asc' ? valA - valB : valB - valA;
        }

        const comp = String(valA).localeCompare(String(valB), undefined, {
          numeric: true,
          sensitivity: 'base',
        });
        return sortDir === 'asc' ? comp : -comp;
      });
    }

    return result;
  });

  // Total pages
  totalPages = computed(() => {
    return Math.max(1, Math.ceil(this.filteredProjects().length / this.pageSize()));
  });

  // Paginated records
  paginatedProjects = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return this.filteredProjects().slice(start, end);
  });

  paginationLabel = computed(() => {
    const total = this.filteredProjects().length;
    if (total === 0) return '0 of 0';
    const start = (this.currentPage() - 1) * this.pageSize() + 1;
    const end = Math.min(this.currentPage() * this.pageSize(), total);
    return `${start} - ${end} of ${total}`;
  });

  // Active filter count
  activeFilterCount = computed(() => {
    let count = 0;
    if (this.filterKeyword().trim()) count++;
    if (this.filterMarket() !== 'All') count++;
    if (this.filterPlantDataStatus() !== 'All') count++;
    if (this.filterCtdStatus() !== 'All') count++;
    if (this.filterDosageForm() !== 'All') count++;
    return count;
  });

  ngOnInit(): void {}

  // Manage Grid Columns & Freeze Panes
  openFreezePanes(): void {
    const dialogRef = this.dialog.open(FreezepanesDialogComponent, {
      width: '740px',
      maxWidth: '95vw',
      panelClass: 'freezepanes-dialog-panel',
      data: {
        allColumns: this.allColumns(),
        selectedColumns: this.selectedColumns(),
        freezeCount: this.freezeCount(),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.selectedColumns) {
          this.selectedColumns.set(result.selectedColumns);
          const selKeys = new Set(result.selectedColumns.map((c: GridColumn) => c.key));
          this.allColumns.update((cols) =>
            cols.map((c) => ({ ...c, visible: selKeys.has(c.key) }))
          );
        }
        if (result.freezeCount !== undefined) {
          this.freezeCount.set(Number(result.freezeCount) || 0);
        }
      }
    });
  }

  isColVisible(key: string): boolean {
    const col = this.selectedColumns().find((c) => c.key === key);
    return col ? col.visible !== false : false;
  }

  isColumnFrozen(key: string): boolean {
    if (this.freezeCount() <= 0) return false;
    const visibleCols = this.selectedColumns().filter((c) => c.visible !== false);
    const index = visibleCols.findIndex((c) => c.key === key);
    return index >= 0 && index < this.freezeCount();
  }

  getStickyLeft(key: string): number {
    if (this.freezeCount() <= 0) return 0;
    const visibleCols = this.selectedColumns().filter((c) => c.visible !== false);
    const index = visibleCols.findIndex((c) => c.key === key);
    if (index <= 0 || index >= this.freezeCount()) {
      return 0;
    }
    let left = 0;
    for (let i = 0; i < index; i++) {
      left += this.columnWidths[visibleCols[i].key] || 120;
    }
    return left;
  }

  // Toggle filter panel
  toggleFilter(): void {
    this.filterToggle.update((v) => !v);
  }

  // Clear filters
  clearFilters(): void {
    this.filterKeyword.set('');
    this.filterMarket.set('All');
    this.filterPlantDataStatus.set('All');
    this.filterCtdStatus.set('All');
    this.filterDosageForm.set('All');
    this.clearAllColumnFilters();
    this.currentPage.set(1);
  }

  // Add / Edit Modal Controls
  openAddProject(): void {
    this.selectedProjectForEdit.set(null);
    this.showEbModal.set(true);
  }

  openEditProject(item: EbCompletedProject): void {
    this.selectedProjectForEdit.set({ ...item });
    this.showEbModal.set(true);
  }

  closeEbModal(): void {
    this.showEbModal.set(false);
    this.selectedProjectForEdit.set(null);
  }

  onSaveProject(item: EbCompletedProject): void {
    if (this.selectedProjectForEdit()) {
      const editId = this.selectedProjectForEdit()!.id;
      this.ebProjectsList.update((list) =>
        list.map((p) => (p.id === editId ? { ...item, id: editId } : p))
      );
    } else {
      const nextSerial = this.ebProjectsList().length + 1;
      const newItem: EbCompletedProject = {
        ...item,
        id: Date.now(),
        serial: nextSerial,
      };
      this.ebProjectsList.update((list) => [...list, newItem]);
    }
    this.closeEbModal();
  }

  // Delete Modal Controls
  confirmDelete(item: EbCompletedProject): void {
    this.targetDeleteProject.set(item);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.targetDeleteProject.set(null);
  }

  executeDelete(): void {
    const target = this.targetDeleteProject();
    if (target) {
      this.ebProjectsList.update((list) => {
        const remaining = list.filter((p) => p.id !== target.id);
        return remaining.map((p, idx) => ({ ...p, serial: idx + 1 }));
      });
    }
    this.closeDeleteModal();
  }

  // Pagination navigation
  onPageSizeChange(newSize: number): void {
    this.pageSize.set(Number(newSize));
    this.currentPage.set(1);
  }

  prevPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((p) => p - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((p) => p + 1);
    }
  }

  // Status badge styling helper
  getStatusBadgeClass(status?: string): string {
    if (!status) return 'status-neutral';
    const s = status.toLowerCase();
    if (s.includes('available') && !s.includes('not')) return 'status-available';
    if (s.includes('not available')) return 'status-unavailable';
    if (s.includes('preparation') || s.includes('progress') || s.includes('dev')) return 'status-prep';
    return 'status-neutral';
  }
}
