import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface EbCompletedProject {
  id: number;
  serial: number;
  molecule: string;
  plantDataStatus: string;
  market: string;
  productName: string;
  pharmacopoeia: string;
  dosageForm: string;
  strength: string;
  fillVolume: string;
  apiManufacturer: string;
  cepDmfNo: string;
  stabilityData: string;
  ctdStatus: string;
  remarks?: string;
}

@Component({
  selector: 'app-eb-pop',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule],
  templateUrl: './eb-pop.component.html',
  styleUrl: './eb-pop.component.scss',
})
export class EbPopComponent implements OnInit {
  @Input() projectData: EbCompletedProject | null = null;
  @Input() nextSerial: number = 1;

  @Output() save = new EventEmitter<EbCompletedProject>();
  @Output() close = new EventEmitter<void>();

  // Form Fields
  molecule: string = '';
  plantDataStatus: string = 'Available';
  market: string = 'Europe';
  productName: string = '';
  pharmacopoeia: string = 'USP';
  dosageForm: string = 'Tablets';
  strength: string = '';
  fillVolume: string = 'NA';
  apiManufacturer: string = '';
  cepDmfNo: string = '';
  stabilityData: string = '12 Months';
  ctdStatus: string = 'Available';
  remarks: string = '';

  submitted: boolean = false;

  // Select Option Lists
  marketOptions: string[] = ['Europe', 'Export', 'US', 'Domestic', 'MENA', 'LATAM'];
  dosageOptions: string[] = ['Tablets', 'Lyo', 'Capsules', 'Liquid Injection', 'Injection', 'Oral Solution'];
  pharmacopoeiaOptions: string[] = ['USP', 'BP', 'Ph.Eur', 'IHS', 'IP'];
  plantDataOptions: string[] = ['Available', 'Not Available', 'Under Preparation'];
  ctdStatusOptions: string[] = ['Available', 'Not available', 'Under Preparation'];
  stabilityOptions: string[] = [
    '1 Month',
    '3 Months',
    '6 Months',
    '9 Months',
    '12 Months',
    '18 Months',
    '24 Months',
    '36 Months',
  ];

  ngOnInit(): void {
    if (this.projectData) {
      this.molecule = this.projectData.molecule || '';
      this.plantDataStatus = this.projectData.plantDataStatus || 'Available';
      this.market = this.projectData.market || 'Europe';
      this.productName = this.projectData.productName || '';
      this.pharmacopoeia = this.projectData.pharmacopoeia || 'USP';
      this.dosageForm = this.projectData.dosageForm || 'Tablets';
      this.strength = this.projectData.strength || '';
      this.fillVolume = this.projectData.fillVolume || 'NA';
      this.apiManufacturer = this.projectData.apiManufacturer || '';
      this.cepDmfNo = this.projectData.cepDmfNo || '';
      this.stabilityData = this.projectData.stabilityData || '12 Months';
      this.ctdStatus = this.projectData.ctdStatus || 'Available';
      this.remarks = this.projectData.remarks || '';
    }
  }

  get isValid(): boolean {
    return !!(this.molecule.trim() && this.productName.trim());
  }

  onSave(): void {
    this.submitted = true;
    if (!this.isValid) {
      return;
    }

    const payload: EbCompletedProject = {
      id: this.projectData ? this.projectData.id : Date.now(),
      serial: this.projectData ? this.projectData.serial : this.nextSerial,
      molecule: this.molecule.trim(),
      plantDataStatus: this.plantDataStatus,
      market: this.market,
      productName: this.productName.trim(),
      pharmacopoeia: this.pharmacopoeia.trim(),
      dosageForm: this.dosageForm,
      strength: this.strength.trim() || 'NA',
      fillVolume: this.fillVolume.trim() || 'NA',
      apiManufacturer: this.apiManufacturer.trim() || 'NA',
      cepDmfNo: this.cepDmfNo.trim() || 'NA',
      stabilityData: this.stabilityData,
      ctdStatus: this.ctdStatus,
      remarks: this.remarks.trim(),
    };

    this.save.emit(payload);
  }

  onClose(): void {
    this.close.emit();
  }
}
