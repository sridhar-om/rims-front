import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

export interface GridColumn {
  key: string;
  label: string;
  visible: boolean;
}

@Component({
  selector: 'app-freezepanes-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    DragDropModule,
  ],
  templateUrl: './freezepanes-dialog.component.html',
  styleUrl: './freezepanes-dialog.component.scss',
})
export class FreezepanesDialogComponent implements OnInit {
  searchText: string = '';
  freezeCount: number = 0;

  allColumns: GridColumn[] = [
    { key: 'actions', label: 'Actions', visible: true },
    { key: 'serial', label: 'Serial', visible: true },
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
  ];

  selectedColumns: GridColumn[] = [];
  freezeOptions: number[] = [];

  constructor(
    @Optional() public dialogRef?: MatDialogRef<FreezepanesDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: any
  ) {}

  ngOnInit(): void {
    if (this.data && this.data.allColumns && this.data.allColumns.length > 0) {
      this.allColumns = this.data.allColumns.map((c: GridColumn) => ({ ...c }));
    }
    if (this.data && this.data.freezeCount !== undefined) {
      this.freezeCount = Number(this.data.freezeCount) || 0;
    }
    if (this.data && this.data.selectedColumns && this.data.selectedColumns.length > 0) {
      this.selectedColumns = this.data.selectedColumns.map((c: GridColumn) => ({ ...c }));
    } else {
      this.selectedColumns = this.allColumns
        .filter((c) => c.visible !== false)
        .map((c) => ({ ...c, visible: true }));
    }

    this.updateFreezeOptions();
  }

  get filteredColumns(): GridColumn[] {
    const term = this.searchText.trim().toLowerCase();
    if (!term) return this.allColumns;
    return this.allColumns.filter((c) => c.label.toLowerCase().includes(term));
  }

  isSelected(col: GridColumn): boolean {
    return this.selectedColumns.some((s) => s.key === col.key);
  }

  toggleColumn(col: GridColumn): void {
    const idx = this.selectedColumns.findIndex((s) => s.key === col.key);
    if (idx >= 0) {
      this.selectedColumns.splice(idx, 1);
      const orig = this.allColumns.find((c) => c.key === col.key);
      if (orig) orig.visible = false;
    } else {
      this.selectedColumns.push({ ...col, visible: true });
      const orig = this.allColumns.find((c) => c.key === col.key);
      if (orig) orig.visible = true;
    }

    if (this.freezeCount > this.selectedColumns.length) {
      this.freezeCount = this.selectedColumns.length;
    }
    this.updateFreezeOptions();
  }

  removeColumn(col: GridColumn): void {
    const idx = this.selectedColumns.findIndex((s) => s.key === col.key);
    if (idx >= 0) {
      this.selectedColumns.splice(idx, 1);
    }
    const orig = this.allColumns.find((c) => c.key === col.key);
    if (orig) orig.visible = false;

    if (this.freezeCount > this.selectedColumns.length) {
      this.freezeCount = this.selectedColumns.length;
    }
    this.updateFreezeOptions();
  }

  drop(event: CdkDragDrop<GridColumn[]>): void {
    moveItemInArray(this.selectedColumns, event.previousIndex, event.currentIndex);
  }

  updateFreezeOptions(): void {
    this.freezeOptions = Array.from(
      { length: this.selectedColumns.length + 1 },
      (_, i) => i
    );
    if (this.freezeCount > this.selectedColumns.length) {
      this.freezeCount = this.selectedColumns.length;
    }
  }

  getFrozenColumns(): GridColumn[] {
    return this.selectedColumns.slice(0, this.freezeCount);
  }

  applyChanges(): void {
    if (this.dialogRef) {
      this.dialogRef.close({
        selectedColumns: this.selectedColumns,
        freezeCount: this.freezeCount,
      });
    }
  }

  cancel(): void {
    if (this.dialogRef) {
      this.dialogRef.close(null);
    }
  }
}
