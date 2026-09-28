import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReportRecord } from '../reports.component';

@Component({
  selector: 'app-report-pop',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule],
  templateUrl: './report-pop.component.html',
  styleUrl: './report-pop.component.scss',
})
export class ReportPopComponent {
  @Input() report: Partial<ReportRecord> = {};
  @Output() save = new EventEmitter<Partial<ReportRecord>>();
  @Output() cancel = new EventEmitter<void>();

  onCancel(): void {
    this.cancel.emit();
  }

  onSave(): void {
    this.save.emit(this.report);
  }
}
