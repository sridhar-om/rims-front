import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DeletePopComponent } from '../shared/delete-pop/delete-pop.component';
import { FreezepanesDialogComponent, GridColumn } from '../shared/freezepanes-dialog/freezepanes-dialog.component';
import { GridScrollerComponent } from '../shared/grid-scroller/grid-scroller.component';
import { PaginatorComponent } from '../shared/paginator/paginator.component';
import { PipelinePopComponent, PipelineProject } from './pipeline-pop/pipeline-pop.component';

@Component({
  selector: 'app-pipeline-projects',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    PipelinePopComponent,
    DeletePopComponent,
    GridScrollerComponent,
    PaginatorComponent,
  ],
  templateUrl: './pipeline-projects.component.html',
  styleUrl: './pipeline-projects.component.scss',
})
export class PipelineProjectsComponent implements OnInit {
  // Filter toggle & signals
  filterToggle = signal<boolean>(false);
  filterKeyword = signal<string>('');
  filterMarket = signal<string>('All');
  filterStatus = signal<string>('All');
  filterDosageForm = signal<string>('All');

  // Pagination signals
  pageSize = signal<number>(10);
  currentPage = signal<number>(1);

  // Modal signals
  showPipelineModal = signal<boolean>(false);
  selectedPipelineForEdit = signal<PipelineProject | null>(null);

  showDeleteModal = signal<boolean>(false);
  targetDeleteProject = signal<PipelineProject | null>(null);

  // Column Configuration & Freeze Panes
  allColumns = signal<GridColumn[]>([
    { key: 'actions', label: 'Actions', visible: true },
    { key: 'serial', label: 'S.No.', visible: true },
    { key: 'molecule', label: 'Molecule', visible: true },
    { key: 'market', label: 'Market', visible: true },
    { key: 'productName', label: 'Product Name', visible: true },
    { key: 'pharmacopoeia', label: 'Pharmacopoeia', visible: true },
    { key: 'dosageForm', label: 'Dosage Form', visible: true },
    { key: 'strength', label: 'Strength', visible: true },
    { key: 'fillVolume', label: 'Fill Volume', visible: true },
    { key: 'apiManufacturer', label: 'API Manufacturer', visible: true },
    { key: 'cepDmfNo', label: 'CEP/DMF No', visible: true },
    { key: 'stabilityData', label: 'Stability Data', visible: true },
    { key: 'projectStatus', label: 'Project Status', visible: true },
    { key: 'percentCompletion', label: 'Percent Project Completion', visible: true },
    { key: 'remarks', label: 'Remarks', visible: true },
  ]);

  selectedColumns = signal<GridColumn[]>([
    { key: 'actions', label: 'Actions', visible: true },
    { key: 'serial', label: 'S.No.', visible: true },
    { key: 'molecule', label: 'Molecule', visible: true },
    { key: 'market', label: 'Market', visible: true },
    { key: 'productName', label: 'Product Name', visible: true },
    { key: 'pharmacopoeia', label: 'Pharmacopoeia', visible: true },
    { key: 'dosageForm', label: 'Dosage Form', visible: true },
    { key: 'strength', label: 'Strength', visible: true },
    { key: 'fillVolume', label: 'Fill Volume', visible: true },
    { key: 'apiManufacturer', label: 'API Manufacturer', visible: true },
    { key: 'cepDmfNo', label: 'CEP/DMF No', visible: true },
    { key: 'stabilityData', label: 'Stability Data', visible: true },
    { key: 'projectStatus', label: 'Project Status', visible: true },
    { key: 'percentCompletion', label: 'Percent Project Completion', visible: true },
    { key: 'remarks', label: 'Remarks', visible: true },
  ]);

  freezeCount = signal<number>(0);

  visibleColumnCount = computed(() => {
    return this.selectedColumns().filter((c) => c.visible !== false).length || 1;
  });

  columnWidths: Record<string, number> = {
    actions: 90,
    serial: 100,
    molecule: 160,
    market: 140,
    productName: 280,
    pharmacopoeia: 140,
    dosageForm: 130,
    strength: 140,
    fillVolume: 120,
    apiManufacturer: 160,
    cepDmfNo: 170,
    stabilityData: 140,
    projectStatus: 160,
    percentCompletion: 200,
    remarks: 220,
  };

  // Column-Specific Search Filters (Matching Image 3)
  columnFilters = signal<Record<string, string>>({
    serial: '',
    molecule: '',
    market: '',
    productName: '',
    pharmacopoeia: '',
    dosageForm: '',
    strength: '',
    fillVolume: '',
    apiManufacturer: '',
    cepDmfNo: '',
    stabilityData: '',
    projectStatus: '',
    percentCompletion: '',
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
      market: '',
      productName: '',
      pharmacopoeia: '',
      dosageForm: '',
      strength: '',
      fillVolume: '',
      apiManufacturer: '',
      cepDmfNo: '',
      stabilityData: '',
      projectStatus: '',
      percentCompletion: '',
      remarks: '',
    });
    this.currentPage.set(1);
  }

  constructor(private dialog: MatDialog) {}

  // Initial Data (matches the user's screenshots and provides 17 rich records)
  pipelineList = signal<PipelineProject[]>([
    {
      id: 1,
      serial: 1,
      molecule: 'Abiraterone',
      market: 'Europe',
      productName: 'Abiraterone Acetate Film Coated Tablets',
      pharmacopoeia: 'IHS',
      dosageForm: 'Tablets',
      strength: '250 mg & 500 mg',
      fillVolume: 'NA',
      apiManufacturer: 'ABC',
      cepDmfNo: 'DMF: 124edrok',
      stabilityData: '36 Months',
      projectStatus: 'Completed',
      percentCompletion: 100,
      remarks: 'Dossier successfully filed in EU',
    },
    {
      id: 2,
      serial: 2,
      molecule: 'Azacitidine',
      market: 'Europe',
      productName: 'Azacitidine Powder for Suspension for Injection',
      pharmacopoeia: 'IHS',
      dosageForm: 'Lyo',
      strength: '25mg/ml',
      fillVolume: '4 ml',
      apiManufacturer: 'DEF',
      cepDmfNo: 'CEP:r1-cep-124d',
      stabilityData: '12 Months',
      projectStatus: 'Under Development',
      percentCompletion: 40,
      remarks: 'Long-term stability studies active',
    },
    {
      id: 3,
      serial: 3,
      molecule: 'Bortezomib',
      market: 'Europe',
      productName: 'Bortezomib Powder for Solution for Injection',
      pharmacopoeia: 'BP',
      dosageForm: 'Lyo',
      strength: '3.5 mg',
      fillVolume: 'NA',
      apiManufacturer: 'JKLM',
      cepDmfNo: 'ASMF: RED ver 123',
      stabilityData: '1 Month',
      projectStatus: 'Under Development',
      percentCompletion: 30,
      remarks: 'Formulation re-optimization underway',
    },
    {
      id: 4,
      serial: 4,
      molecule: 'Carfilzomib',
      market: 'Export',
      productName: 'Carfilzomib for Injection',
      pharmacopoeia: 'USP',
      dosageForm: 'Lyo',
      strength: '60 mg/Vial',
      fillVolume: '5 ml',
      apiManufacturer: 'NYC',
      cepDmfNo: 'CADIFA: ABC1234DEFR',
      stabilityData: '3 Months',
      projectStatus: 'Under Development',
      percentCompletion: 20,
      remarks: 'Analytical method transfer in progress',
    },
    {
      id: 5,
      serial: 5,
      molecule: 'Lenalidomide',
      market: 'US',
      productName: 'Lenalidomide Hard Gelatin Capsules',
      pharmacopoeia: 'USP',
      dosageForm: 'Capsules',
      strength: '5 mg, 10 mg, 15 mg, 25 mg',
      fillVolume: 'NA',
      apiManufacturer: 'Sun API',
      cepDmfNo: 'DMF: 32145-US',
      stabilityData: '24 Months',
      projectStatus: 'Validation',
      percentCompletion: 85,
      remarks: 'Exhibit batches executed and on stability',
    },
    {
      id: 6,
      serial: 6,
      molecule: 'Pemetrexed',
      market: 'Europe',
      productName: 'Pemetrexed Powder for Concentrate for Solution for Infusion',
      pharmacopoeia: 'Ph.Eur',
      dosageForm: 'Lyo',
      strength: '100 mg & 500 mg',
      fillVolume: 'NA',
      apiManufacturer: 'Dr. Reddy',
      cepDmfNo: 'CEP: 2020-112',
      stabilityData: '36 Months',
      projectStatus: 'Completed',
      percentCompletion: 100,
      remarks: 'Commercial batch launch finalized',
    },
    {
      id: 7,
      serial: 7,
      molecule: 'Enzalutamide',
      market: 'Export',
      productName: 'Enzalutamide Soft Gelatin Capsules',
      pharmacopoeia: 'IHS',
      dosageForm: 'Capsules',
      strength: '40 mg',
      fillVolume: 'NA',
      apiManufacturer: 'Cipla API',
      cepDmfNo: 'DMF: 45678-EXP',
      stabilityData: '6 Months',
      projectStatus: 'Under Development',
      percentCompletion: 45,
      remarks: 'Bioequivalence protocol approved',
    },
    {
      id: 8,
      serial: 8,
      molecule: 'Palbociclib',
      market: 'Europe',
      productName: 'Palbociclib Hard Capsules',
      pharmacopoeia: 'Ph.Eur',
      dosageForm: 'Capsules',
      strength: '75 mg, 100 mg, 125 mg',
      fillVolume: 'NA',
      apiManufacturer: 'Synthon',
      cepDmfNo: 'CEP: 2022-045',
      stabilityData: '18 Months',
      projectStatus: 'Validation',
      percentCompletion: 75,
      remarks: 'Process validation batches scheduled',
    },
    {
      id: 9,
      serial: 9,
      molecule: 'Aprepitant',
      market: 'Domestic',
      productName: 'Aprepitant Capsules',
      pharmacopoeia: 'IP',
      dosageForm: 'Capsules',
      strength: '125 mg & 80 mg',
      fillVolume: 'NA',
      apiManufacturer: 'Hetero',
      cepDmfNo: 'DMF: 78912-DOM',
      stabilityData: '24 Months',
      projectStatus: 'Completed',
      percentCompletion: 100,
      remarks: 'Marketing authorization received',
    },
    {
      id: 10,
      serial: 10,
      molecule: 'Fulvestrant',
      market: 'Europe',
      productName: 'Fulvestrant Solution for Injection in Prefilled Syringe',
      pharmacopoeia: 'BP',
      dosageForm: 'Injection',
      strength: '250 mg/5ml',
      fillVolume: '5 ml',
      apiManufacturer: 'Fresenius',
      cepDmfNo: 'ASMF: FUL-889',
      stabilityData: '12 Months',
      projectStatus: 'Under Development',
      percentCompletion: 50,
      remarks: 'Pre-filled syringe compatibility verified',
    },
    {
      id: 11,
      serial: 11,
      molecule: 'Cabazitaxel',
      market: 'Export',
      productName: 'Cabazitaxel Concentrate for Solution for Infusion',
      pharmacopoeia: 'USP',
      dosageForm: 'Liquid Injection',
      strength: '60 mg/1.5ml',
      fillVolume: '1.5 ml',
      apiManufacturer: 'Sandoz',
      cepDmfNo: 'CADIFA: CBZ-2023',
      stabilityData: '6 Months',
      projectStatus: 'Under Development',
      percentCompletion: 35,
      remarks: 'Accelerated testing within specifications',
    },
    {
      id: 12,
      serial: 12,
      molecule: 'Regorafenib',
      market: 'US',
      productName: 'Regorafenib Film-Coated Tablets',
      pharmacopoeia: 'USP',
      dosageForm: 'Tablets',
      strength: '40 mg',
      fillVolume: 'NA',
      apiManufacturer: 'Teva API',
      cepDmfNo: 'DMF: 65432-US',
      stabilityData: '3 Months',
      projectStatus: 'Under Development',
      percentCompletion: 15,
      remarks: 'Pre-formulation compatibility studies ongoing',
    },
    {
      id: 13,
      serial: 13,
      molecule: 'Midostaurin',
      market: 'MENA',
      productName: 'Midostaurin Soft Gelatin Capsules',
      pharmacopoeia: 'IHS',
      dosageForm: 'Capsules',
      strength: '25 mg',
      fillVolume: 'NA',
      apiManufacturer: 'Glenmark',
      cepDmfNo: 'DMF: 11223-MENA',
      stabilityData: '12 Months',
      projectStatus: 'Under Development',
      percentCompletion: 55,
      remarks: 'Dissolution profile comparable to innovator',
    },
    {
      id: 14,
      serial: 14,
      molecule: 'Olaparib',
      market: 'Europe',
      productName: 'Olaparib Film-Coated Tablets',
      pharmacopoeia: 'Ph.Eur',
      dosageForm: 'Tablets',
      strength: '100 mg & 150 mg',
      fillVolume: 'NA',
      apiManufacturer: 'ABC',
      cepDmfNo: 'CEP: 2023-019',
      stabilityData: '24 Months',
      projectStatus: 'Validation',
      percentCompletion: 90,
      remarks: 'CTD Module 3 dossier in final review',
    },
    {
      id: 15,
      serial: 15,
      molecule: 'Nintedanib',
      market: 'Export',
      productName: 'Nintedanib Soft Capsules',
      pharmacopoeia: 'IHS',
      dosageForm: 'Capsules',
      strength: '100 mg & 150 mg',
      fillVolume: 'NA',
      apiManufacturer: 'DEF',
      cepDmfNo: 'CADIFA: NIN-441',
      stabilityData: '9 Months',
      projectStatus: 'Under Development',
      percentCompletion: 40,
      remarks: 'Intermediate testing meets acceptance criteria',
    },
    {
      id: 16,
      serial: 16,
      molecule: 'Gefitinib',
      market: 'Domestic',
      productName: 'Gefitinib Tablets',
      pharmacopoeia: 'IP',
      dosageForm: 'Tablets',
      strength: '250 mg',
      fillVolume: 'NA',
      apiManufacturer: 'Natco',
      cepDmfNo: 'DMF: 99881-DOM',
      stabilityData: '36 Months',
      projectStatus: 'Completed',
      percentCompletion: 100,
      remarks: 'Commercial manufacturing initiated',
    },
    {
      id: 17,
      serial: 17,
      molecule: 'Osimertinib',
      market: 'Europe',
      productName: 'Osimertinib Tablets',
      pharmacopoeia: 'Ph.Eur',
      dosageForm: 'Tablets',
      strength: '40 mg & 80 mg',
      fillVolume: 'NA',
      apiManufacturer: 'JKLM',
      cepDmfNo: 'CEP: 2024-001',
      stabilityData: '2 Months',
      projectStatus: 'Under Development',
      percentCompletion: 25,
      remarks: 'Active analytical method development',
    },
  ]);

  // Dynamic filter options based on data
  marketsList = computed(() => {
    const list = this.pipelineList().map((p) => p.market);
    return Array.from(new Set(list)).sort();
  });

  statusesList = computed(() => {
    const list = this.pipelineList().map((p) => p.projectStatus);
    return Array.from(new Set(list)).sort();
  });

  dosageList = computed(() => {
    const list = this.pipelineList().map((p) => p.dosageForm);
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
      market: 'th-market',
      productName: 'th-product',
      pharmacopoeia: 'th-pharma',
      dosageForm: 'th-dosage',
      strength: 'th-strength',
      fillVolume: 'th-fill',
      apiManufacturer: 'th-api',
      cepDmfNo: 'th-cep',
      stabilityData: 'th-stability',
      projectStatus: 'th-status',
      percentCompletion: 'th-progress',
      remarks: 'th-remarks',
    };
    return map[key] || ('th-' + key);
  }

  // Filtered pipelines
  filteredPipelines = computed(() => {
    let result = this.pipelineList();
    const keyword = this.filterKeyword().trim().toLowerCase();
    const market = this.filterMarket();
    const status = this.filterStatus();
    const dosage = this.filterDosageForm();

    if (keyword) {
      result = result.filter(
        (p) =>
          p.molecule.toLowerCase().includes(keyword) ||
          p.productName.toLowerCase().includes(keyword) ||
          p.apiManufacturer.toLowerCase().includes(keyword) ||
          p.cepDmfNo.toLowerCase().includes(keyword) ||
          p.strength.toLowerCase().includes(keyword) ||
          (p.remarks && p.remarks.toLowerCase().includes(keyword))
      );
    }

    if (market !== 'All') {
      result = result.filter((p) => p.market === market);
    }

    if (status !== 'All') {
      result = result.filter((p) => p.projectStatus === status);
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
          case 'projectStatus':
            return p.projectStatus.toLowerCase().includes(q);
          case 'percentCompletion':
            return String(p.percentCompletion).includes(q);
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
    return Math.max(1, Math.ceil(this.filteredPipelines().length / this.pageSize()));
  });

  // Paginated records
  paginatedPipelines = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return this.filteredPipelines().slice(start, end);
  });

  paginationLabel = computed(() => {
    const total = this.filteredPipelines().length;
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
    if (this.filterStatus() !== 'All') count++;
    if (this.filterDosageForm() !== 'All') count++;
    return count;
  });

  ngOnInit(): void { }

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
    this.filterStatus.set('All');
    this.filterDosageForm.set('All');
    this.clearAllColumnFilters();
    this.currentPage.set(1);
  }

  // Add / Edit Modal Controls
  openAddPipeline(): void {
    this.selectedPipelineForEdit.set(null);
    this.showPipelineModal.set(true);
  }

  openEditPipeline(item: PipelineProject): void {
    this.selectedPipelineForEdit.set({ ...item });
    this.showPipelineModal.set(true);
  }

  closePipelineModal(): void {
    this.showPipelineModal.set(false);
    this.selectedPipelineForEdit.set(null);
  }

  onSavePipeline(item: PipelineProject): void {
    if (this.selectedPipelineForEdit()) {
      const editId = this.selectedPipelineForEdit()!.id;
      this.pipelineList.update((list) =>
        list.map((p) => (p.id === editId ? { ...item, id: editId } : p))
      );
    } else {
      const nextSerial = this.pipelineList().length + 1;
      const newItem: PipelineProject = {
        ...item,
        id: Date.now(),
        serial: nextSerial,
      };
      this.pipelineList.update((list) => [...list, newItem]);
    }
    this.closePipelineModal();
  }

  // Delete Modal Controls
  confirmDelete(item: PipelineProject): void {
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
      this.pipelineList.update((list) => {
        const remaining = list.filter((p) => p.id !== target.id);
        // re-index serial numbers
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
  getStatusClass(status: string): string {
    const normalized = status.toLowerCase();
    if (normalized.includes('completed')) return 'status-completed';
    if (normalized.includes('validation')) return 'status-validation';
    if (normalized.includes('hold')) return 'status-hold';
    return 'status-dev';
  }
}
