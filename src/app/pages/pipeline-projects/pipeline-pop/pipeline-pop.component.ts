import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface PipelineProject {
  id: number;
  serial: number;
  molecule: string;
  market: string;
  productName: string;
  pharmacopoeia: string;
  dosageForm: string;
  strength: string;
  fillVolume: string;
  apiManufacturer: string;
  cepDmfNo: string;
  stabilityData: string;
  projectStatus: 'Completed' | 'Under Development' | 'Validation' | 'On Hold' | string;
  percentCompletion: number;
  remarks?: string;
}

@Component({
  selector: 'app-pipeline-pop',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule],
  templateUrl: './pipeline-pop.component.html',
  styleUrl: './pipeline-pop.component.scss',
})
export class PipelinePopComponent implements OnInit {
  @Input() pipelineData: PipelineProject | null = null;
  @Input() nextSerial: number = 1;

  @Output() save = new EventEmitter<PipelineProject>();
  @Output() close = new EventEmitter<void>();

  // Form Fields
  molecule: string = '';
  market: string = 'Europe';
  productName: string = '';
  pharmacopoeia: string = 'USP';
  dosageForm: string = 'Tablets';
  strength: string = '';
  fillVolume: string = 'NA';
  apiManufacturer: string = '';
  cepDmfNo: string = '';
  stabilityData: string = '12 Months';
  projectStatus: string = 'Under Development';
  percentCompletion: number = 0;
  remarks: string = '';

  // Select Option Lists
  marketOptions: string[] = ['Europe', 'Export', 'US', 'Domestic', 'MENA', 'LATAM'];
  dosageOptions: string[] = ['Tablets', 'Lyo', 'Capsules', 'Liquid Injection', 'Injection', 'Oral Solution'];
  pharmacopoeiaOptions: string[] = ['USP', 'BP', 'Ph.Eur', 'IHS', 'IP'];
  statusOptions: string[] = ['Under Development', 'Validation', 'Completed', 'On Hold'];
  stabilityOptions: string[] = ['1 Month', '3 Months', '6 Months', '9 Months', '12 Months', '18 Months', '24 Months', '36 Months'];

  ngOnInit(): void {
    if (this.pipelineData) {
      this.molecule = this.pipelineData.molecule || '';
      this.market = this.pipelineData.market || 'Europe';
      this.productName = this.pipelineData.productName || '';
      this.pharmacopoeia = this.pipelineData.pharmacopoeia || 'USP';
      this.dosageForm = this.pipelineData.dosageForm || 'Tablets';
      this.strength = this.pipelineData.strength || '';
      this.fillVolume = this.pipelineData.fillVolume || 'NA';
      this.apiManufacturer = this.pipelineData.apiManufacturer || '';
      this.cepDmfNo = this.pipelineData.cepDmfNo || '';
      this.stabilityData = this.pipelineData.stabilityData || '12 Months';
      this.projectStatus = this.pipelineData.projectStatus || 'Under Development';
      this.percentCompletion = this.pipelineData.percentCompletion ?? 0;
      this.remarks = this.pipelineData.remarks || '';
    }
  }

  submitted: boolean = false;

  get isValid(): boolean {
    return !!(this.molecule.trim() && this.productName.trim());
  }

  onSave(): void {
    this.submitted = true;
    if (!this.isValid) {
      return;
    }

    const payload: PipelineProject = {
      id: this.pipelineData ? this.pipelineData.id : Date.now(),
      serial: this.pipelineData ? this.pipelineData.serial : this.nextSerial,
      molecule: this.molecule.trim(),
      market: this.market,
      productName: this.productName.trim(),
      pharmacopoeia: this.pharmacopoeia.trim(),
      dosageForm: this.dosageForm,
      strength: this.strength.trim() || 'NA',
      fillVolume: this.fillVolume.trim() || 'NA',
      apiManufacturer: this.apiManufacturer.trim() || 'NA',
      cepDmfNo: this.cepDmfNo.trim() || 'NA',
      stabilityData: this.stabilityData,
      projectStatus: this.projectStatus,
      percentCompletion: Number(this.percentCompletion) || 0,
      remarks: this.remarks.trim(),
    };

    this.save.emit(payload);
  }

  onClose(): void {
    this.close.emit();
  }
}
