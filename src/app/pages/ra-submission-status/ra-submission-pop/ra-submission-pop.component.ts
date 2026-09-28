import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RaSubmissionRecord } from '../ra-submission-status.component';

@Component({
  selector: 'app-ra-submission-pop',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule],
  templateUrl: './ra-submission-pop.component.html',
  styleUrl: './ra-submission-pop.component.scss',
})
export class RaSubmissionPopComponent implements OnInit, OnChanges {
  @Input() submissionData: RaSubmissionRecord | null = null;
  @Input() nextSerial: number = 1;

  @Output() save = new EventEmitter<RaSubmissionRecord>();
  @Output() close = new EventEmitter<void>();

  // Active tab state: 'overview' | 'submission' | 'approval'
  activeTab = signal<'overview' | 'submission' | 'approval'>('overview');

  // Form submission validation state
  submitted = false;

  // Dropdown options
  regionOptions = ['Europe', 'Australia', 'Latam', 'US', 'Asia Pacific', 'North America', 'Middle East', 'Africa'];
  dossierTypeOptions = ['CTD', 'ACTD', 'eCTD', 'NTR'];
  marketOptions = ['EU', 'ANZ', 'ROW', 'US', 'India', 'MENA', 'LATAM', 'Canada', 'Africa', 'UK', 'Japan'];
  agreementStatusOptions = ['Available', 'Signed', 'Approved', 'Pending', 'Under Review', 'Not Available'];
  clientRfiStatusOptions = ['Completed', 'Open', 'Pending', 'In Progress'];
  mohRfiStatusOptions = ['Completed', 'Open', 'Pending', 'Under Review'];
  registrationStatusOptions = ['Registered', 'Under Registration', 'Submitted', 'Pending', 'Approved', 'Rejected'];
  renewalStatusOptions = ['Yes', 'No', 'Pending', 'In Progress'];
  commercialStatusOptions = ['Commercialised', 'In Progress', 'Planned', 'Under Review'];

  // Form Model matching all fields across Overview, Submission, and Approval tabs
  form: RaSubmissionRecord = {
    id: 0,
    serial: 1,
    // Overview tab fields
    dossierId: '',
    country: '',
    region: 'Europe',
    dossierType: 'CTD',
    market: 'EU',
    molecule: '',
    productName: '',
    dosageForm: '',
    strength: '',
    fillVolume: '',
    typeOfPack: '',
    brandName: '',
    apiHolder: '',
    client: '',
    raResponsible: '',
    bdResponsible: '',
    // Submission tab fields
    businessAgreementStatus: 'Available',
    distributionAgreement: '',
    qualityTechnicalAgreement: '',
    maFee: '',
    maFeePaymentDate: '',
    maHolder: '',
    submissionDateToClient: '',
    clientRfiDate: '',
    clientRfiStatus: '',
    submissionDateToMoh: '',
    mohRfi1Date: '',
    mohRfi1Status: '',
    mohRfi2Date: '',
    mohRfi2Status: '',
    submissionToMohYear: '',
    // Approval tab fields
    registrationStatus: '',
    registrationNumber: '',
    shelfLife: '',
    approvalDate: '',
    approvalYear: '',
    registrationValidity: '',
    renewalSubDate: '',
    renewalDate: '',
    renewalStatus: '',
    expectedApprovalTimeline: '',
    variation: '',
    remarks: '',
    commercialStatus: '',
    artWorksVersions: '',
    raCommitments: '',
    raCommitmentsStatus: '',
  };

  ngOnInit(): void {
    this.initFormData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['submissionData']) {
      this.initFormData();
    }
  }

  initFormData(): void {
    if (this.submissionData) {
      this.form = { ...this.submissionData };
    } else {
      this.form = {
        id: Date.now(),
        serial: this.nextSerial || 1,
        dossierId: 'RA' + new Date().toISOString().slice(2, 10).replace(/-/g, ''),
        country: '',
        region: 'Europe',
        dossierType: 'CTD',
        market: 'EU',
        molecule: '',
        productName: '',
        dosageForm: '',
        strength: '',
        fillVolume: '',
        typeOfPack: '',
        brandName: '',
        apiHolder: '',
        client: '',
        raResponsible: '',
        bdResponsible: '',
        businessAgreementStatus: 'Available',
        distributionAgreement: '',
        qualityTechnicalAgreement: '',
        maFee: '',
        maFeePaymentDate: '',
        maHolder: '',
        submissionDateToClient: '',
        clientRfiDate: '',
        clientRfiStatus: '',
        submissionDateToMoh: '',
        mohRfi1Date: '',
        mohRfi1Status: '',
        mohRfi2Date: '',
        mohRfi2Status: '',
        submissionToMohYear: '',
        registrationStatus: '',
        registrationNumber: '',
        shelfLife: '',
        approvalDate: '',
        approvalYear: '',
        registrationValidity: '',
        renewalSubDate: '',
        renewalDate: '',
        renewalStatus: '',
        expectedApprovalTimeline: '',
        variation: '',
        remarks: '',
        commercialStatus: '',
        artWorksVersions: '',
        raCommitments: '',
        raCommitmentsStatus: 'Open',
      };
    }
  }

  setTab(tab: 'overview' | 'submission' | 'approval'): void {
    this.activeTab.set(tab);
  }

  onSave(): void {
    this.submitted = true;
    if (!this.form.dossierId?.trim() || !this.form.molecule?.trim() || !this.form.productName?.trim()) {
      this.activeTab.set('overview');
      return;
    }
    this.save.emit({ ...this.form });
  }

  onClose(): void {
    this.close.emit();
  }
}
