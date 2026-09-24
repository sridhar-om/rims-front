import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface MoleculeRecord {
  code: string;
  molecule: string;
  therapeuticArea: string;
  activeProducts: number;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-molecule',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    MatTooltipModule,
  ],
  templateUrl: './molecule.component.html',
  styleUrl: './molecule.component.scss',
})
export class MoleculeComponent {
  // Search
  readonly searchTerm = signal<string>('');

  // Pagination
  readonly pageSize = signal<number>(10);
  readonly pageIndex = signal<number>(0);
  readonly pageSizeOptions = [5, 10, 15, 20];

  // Modal
  readonly isAddModalOpen = signal<boolean>(false);
  readonly editingMolecule = signal<MoleculeRecord | null>(null);

  // Delete confirm
  readonly deletingMolecule = signal<MoleculeRecord | null>(null);

  // New/Edit form model
  formModel: Partial<MoleculeRecord> = this._emptyForm();

  private _emptyForm(): Partial<MoleculeRecord> {
    return {
      code: '',
      molecule: '',
      therapeuticArea: 'Cardiology',
      activeProducts: 0,
      status: 'Active',
    };
  }

  // All records
  readonly allMolecules = signal<MoleculeRecord[]>([
    { code: 'RVX-014', molecule: 'Rivaxenib',       therapeuticArea: 'Cardiology',         activeProducts: 5, status: 'Active' },
    { code: 'DLX-297', molecule: 'Dolutegravir-X',  therapeuticArea: 'Infectious disease',  activeProducts: 6, status: 'Active' },
    { code: 'CDZ-891', molecule: 'Cardiozol',        therapeuticArea: 'Immunology',          activeProducts: 2, status: 'Active' },
    { code: 'NPL-133', molecule: 'Nephrolyn',        therapeuticArea: 'Cardiology',          activeProducts: 6, status: 'Active' },
    { code: 'HPC-858', molecule: 'Hepacure',         therapeuticArea: 'Oncology',            activeProducts: 5, status: 'Active' },
    { code: 'OST-176', molecule: 'Ostiofen',         therapeuticArea: 'Infectious disease',  activeProducts: 4, status: 'Active' },
    { code: 'IMM-042', molecule: 'Immunar',          therapeuticArea: 'Infectious disease',  activeProducts: 6, status: 'Active' },
    { code: 'GLY-119', molecule: 'Glycotide',        therapeuticArea: 'Oncology',            activeProducts: 2, status: 'Active' },
    { code: 'VCR-305', molecule: 'Vecurix',          therapeuticArea: 'Neurology',           activeProducts: 3, status: 'Active' },
    { code: 'ATX-072', molecule: 'Atorvex',          therapeuticArea: 'Cardiology',          activeProducts: 4, status: 'Active' },
    { code: 'ENX-401', molecule: 'Enoxalow',         therapeuticArea: 'Haematology',         activeProducts: 7, status: 'Active' },
    { code: 'MTF-220', molecule: 'Metfosure',        therapeuticArea: 'Endocrinology',       activeProducts: 3, status: 'Inactive' },
    { code: 'AML-089', molecule: 'Amlonorm',         therapeuticArea: 'Cardiology',          activeProducts: 5, status: 'Active' },
    { code: 'PNP-567', molecule: 'Pantoplus',        therapeuticArea: 'Gastroenterology',    activeProducts: 2, status: 'Active' },
    { code: 'RSV-341', molecule: 'Rosuvid',          therapeuticArea: 'Cardiology',          activeProducts: 6, status: 'Inactive' },
  ]);

  readonly therapeuticAreas = [
    'Cardiology',
    'Oncology',
    'Neurology',
    'Infectious disease',
    'Immunology',
    'Haematology',
    'Endocrinology',
    'Gastroenterology',
    'Pulmonology',
    'Rheumatology',
  ];

  // Filtered
  readonly filteredMolecules = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) return this.allMolecules();
    return this.allMolecules().filter(
      (m) =>
        m.code.toLowerCase().includes(term) ||
        m.molecule.toLowerCase().includes(term) ||
        m.therapeuticArea.toLowerCase().includes(term) ||
        m.status.toLowerCase().includes(term)
    );
  });

  // Paginated
  readonly paginatedMolecules = computed(() => {
    const list = this.filteredMolecules();
    const start = this.pageIndex() * this.pageSize();
    return list.slice(start, start + this.pageSize());
  });

  onSearch(term: string): void {
    this.searchTerm.set(term);
    this.pageIndex.set(0);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  // --- Add ---
  openAddModal(): void {
    this.editingMolecule.set(null);
    const nextNum = 100 + this.allMolecules().length + 1;
    this.formModel = {
      ...this._emptyForm(),
      code: `MOL-${nextNum}`,
    };
    this.isAddModalOpen.set(true);
  }

  // --- Edit ---
  openEditModal(mol: MoleculeRecord): void {
    this.editingMolecule.set(mol);
    this.formModel = { ...mol };
    this.isAddModalOpen.set(true);
  }

  closeModal(): void {
    this.isAddModalOpen.set(false);
    this.editingMolecule.set(null);
  }

  saveMolecule(): void {
    if (!this.formModel.molecule?.trim()) return;

    const editing = this.editingMolecule();
    if (editing) {
      this.allMolecules.update((list) =>
        list.map((m) => (m.code === editing.code ? ({ ...m, ...this.formModel } as MoleculeRecord) : m))
      );
    } else {
      const record: MoleculeRecord = {
        code: this.formModel.code || `MOL-${100 + this.allMolecules().length + 1}`,
        molecule: this.formModel.molecule!,
        therapeuticArea: this.formModel.therapeuticArea || 'Cardiology',
        activeProducts: this.formModel.activeProducts ?? 0,
        status: this.formModel.status || 'Active',
      };
      this.allMolecules.update((list) => [record, ...list]);
    }
    this.closeModal();
  }

  // --- Toggle Status ---
  toggleStatus(mol: MoleculeRecord): void {
    this.allMolecules.update((list) =>
      list.map((m) =>
        m.code === mol.code
          ? { ...m, status: m.status === 'Active' ? 'Inactive' : 'Active' }
          : m
      )
    );
  }

  // --- Delete ---
  openDeleteConfirm(mol: MoleculeRecord): void {
    this.deletingMolecule.set(mol);
  }

  cancelDelete(): void {
    this.deletingMolecule.set(null);
  }

  confirmDelete(): void {
    const del = this.deletingMolecule();
    if (del) {
      this.allMolecules.update((list) => list.filter((m) => m.code !== del.code));
      this.deletingMolecule.set(null);
    }
  }
}
