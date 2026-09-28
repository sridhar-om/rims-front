import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FreezepanesDialogComponent, GridColumn } from '../shared/freezepanes-dialog/freezepanes-dialog.component';
import { GridScrollerComponent } from '../shared/grid-scroller/grid-scroller.component';
import { PaginatorComponent } from '../shared/paginator/paginator.component';
import { DeletePopComponent } from '../shared/delete-pop/delete-pop.component';
import { RaSubmissionPopComponent } from './ra-submission-pop/ra-submission-pop.component';

export interface RaSubmissionRecord {
  id: number | string;
  serial: number;
  dossierId: string;
  region: string;
  dossierType: string;
  country: string;
  market: string;
  molecule: string;
  productName: string;
  dosageForm: string;
  strength: string;
  fillVolume: string;
  typeOfPack: string;
  brandName: string;
  apiHolder: string;
  client: string;
  raResponsible: string;
  bdResponsible: string;
  businessAgreementStatus: string;
  distributionAgreement: string;
  qualityTechnicalAgreement: string;
  maFee: string;
  maFeePaymentDate: string;
  maHolder: string;
  submissionDateToClient: string;
  clientRfiDate: string;
  clientRfiStatus: string;
  submissionDateToMoh: string;
  mohRfi1Date: string;
  mohRfi1Status: string;
  mohRfi2Date: string;
  mohRfi2Status: string;
  submissionToMohYear: string | number;
  registrationStatus: string;
  registrationNumber: string;
  shelfLife: string;
  approvalDate: string;
  approvalYear: string | number;
  registrationValidity: string;
  renewalSubDate: string;
  renewalDate: string;
  renewalStatus: string;
  expectedApprovalTimeline: string;
  variation: string;
  remarks: string;
  commercialStatus: string;
  artWorksVersions: string | number;
  raCommitments: string;
  raCommitmentsStatus: string;
}

@Component({
  selector: 'app-ra-submission-status',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    GridScrollerComponent,
    PaginatorComponent,
    RaSubmissionPopComponent,
    DeletePopComponent,
  ],
  templateUrl: './ra-submission-status.component.html',
  styleUrl: './ra-submission-status.component.scss',
})
export class RaSubmissionStatusComponent implements OnInit {
  // Modal signals
  showSubmissionModal = signal<boolean>(false);
  selectedSubmissionForEdit = signal<RaSubmissionRecord | null>(null);
  showDeleteModal = signal<boolean>(false);
  targetDeleteRecord = signal<RaSubmissionRecord | null>(null);

  // Filter toggle & signals
  filterToggle = signal<boolean>(false);
  filterKeyword = signal<string>('');
  filterRegion = signal<string>('All');
  filterMarket = signal<string>('All');
  filterDossierType = signal<string>('All');
  filterRegistrationStatus = signal<string>('All');
  filterClientRfiStatus = signal<string>('All');
  filterCommercialStatus = signal<string>('All');

  // Pagination signals
  pageSize = signal<number>(10);
  currentPage = signal<number>(1);

  // Sorting signals
  sortColumn = signal<string>('');
  sortDirection = signal<'asc' | 'desc' | ''>('');

  // Column Configuration & Freeze Panes in Exact Spreadsheet Order
  allColumns = signal<GridColumn[]>([
    { key: 'actions', label: 'Actions', visible: true },
    { key: 'serial', label: 'S.No', visible: true },
    { key: 'dossierId', label: 'Dossier ID', visible: true },
    { key: 'region', label: 'Region', visible: true },
    { key: 'dossierType', label: 'Dossier Type', visible: true },
    { key: 'country', label: 'Country', visible: true },
    { key: 'market', label: 'Market', visible: true },
    { key: 'molecule', label: 'Molecule', visible: true },
    { key: 'productName', label: 'Product Name', visible: true },
    { key: 'dosageForm', label: 'Dosage Form', visible: true },
    { key: 'strength', label: 'Strength', visible: true },
    { key: 'fillVolume', label: 'Fill Volume', visible: true },
    { key: 'typeOfPack', label: 'Type of Pack', visible: true },
    { key: 'brandName', label: 'Brand Name', visible: true },
    { key: 'apiHolder', label: 'API Holder', visible: true },
    { key: 'client', label: 'Client', visible: true },
    { key: 'raResponsible', label: 'RA Responsible', visible: true },
    { key: 'bdResponsible', label: 'BD Responsible', visible: true },
    { key: 'businessAgreementStatus', label: 'Business Agreement Status', visible: true },
    { key: 'distributionAgreement', label: 'Distribution Agreement', visible: true },
    { key: 'qualityTechnicalAgreement', label: 'Quality Technical Agreement', visible: true },
    { key: 'maFee', label: 'MA fee', visible: true },
    { key: 'maFeePaymentDate', label: 'MA fee payment date', visible: true },
    { key: 'maHolder', label: 'MA Holder', visible: true },
    { key: 'submissionDateToClient', label: 'Submission Date to Client', visible: true },
    { key: 'clientRfiDate', label: 'Client RFI date', visible: true },
    { key: 'clientRfiStatus', label: 'Client RFI Status', visible: true },
    { key: 'submissionDateToMoh', label: 'Submission date to MOH', visible: true },
    { key: 'mohRfi1Date', label: 'MOH RFI 1 date', visible: true },
    { key: 'mohRfi1Status', label: 'MOH RFI 1 Status', visible: true },
    { key: 'mohRfi2Date', label: 'MOH RFI 2 date', visible: true },
    { key: 'mohRfi2Status', label: 'MOH RFI 2 Status', visible: true },
    { key: 'submissionToMohYear', label: 'Submission to MOH Year', visible: true },
    { key: 'registrationStatus', label: 'Registration Status', visible: true },
    { key: 'registrationNumber', label: 'Registration number', visible: true },
    { key: 'shelfLife', label: 'Shelf Life', visible: true },
    { key: 'approvalDate', label: 'Approval date', visible: true },
    { key: 'approvalYear', label: 'Approval Year', visible: true },
    { key: 'registrationValidity', label: 'Registration validity', visible: true },
    { key: 'renewalSubDate', label: 'Renewal sub. Date', visible: true },
    { key: 'renewalDate', label: 'Renewal date', visible: true },
    { key: 'renewalStatus', label: 'Renewal Status', visible: true },
    { key: 'expectedApprovalTimeline', label: 'Expected Approval Timeline', visible: true },
    { key: 'variation', label: 'Variation', visible: true },
    { key: 'remarks', label: 'Remarks', visible: true },
    { key: 'commercialStatus', label: 'Commercial Status', visible: true },
    { key: 'artWorksVersions', label: 'Art works Versions', visible: true },
    { key: 'raCommitments', label: 'RA Commitments', visible: true },
    { key: 'raCommitmentsStatus', label: 'RA Commitments status', visible: true },
  ]);

  selectedColumns = signal<GridColumn[]>([
    { key: 'actions', label: 'Actions', visible: true },
    { key: 'serial', label: 'S.No', visible: true },
    { key: 'dossierId', label: 'Dossier ID', visible: true },
    { key: 'region', label: 'Region', visible: true },
    { key: 'dossierType', label: 'Dossier Type', visible: true },
    { key: 'country', label: 'Country', visible: true },
    { key: 'market', label: 'Market', visible: true },
    { key: 'molecule', label: 'Molecule', visible: true },
    { key: 'productName', label: 'Product Name', visible: true },
    { key: 'dosageForm', label: 'Dosage Form', visible: true },
    { key: 'strength', label: 'Strength', visible: true },
    { key: 'fillVolume', label: 'Fill Volume', visible: true },
    { key: 'typeOfPack', label: 'Type of Pack', visible: true },
    { key: 'brandName', label: 'Brand Name', visible: true },
    { key: 'apiHolder', label: 'API Holder', visible: true },
    { key: 'client', label: 'Client', visible: true },
    { key: 'raResponsible', label: 'RA Responsible', visible: true },
    { key: 'bdResponsible', label: 'BD Responsible', visible: true },
    { key: 'businessAgreementStatus', label: 'Business Agreement Status', visible: true },
    { key: 'distributionAgreement', label: 'Distribution Agreement', visible: true },
    { key: 'qualityTechnicalAgreement', label: 'Quality Technical Agreement', visible: true },
    { key: 'maFee', label: 'MA fee', visible: true },
    { key: 'maFeePaymentDate', label: 'MA fee payment date', visible: true },
    { key: 'maHolder', label: 'MA Holder', visible: true },
    { key: 'submissionDateToClient', label: 'Submission Date to Client', visible: true },
    { key: 'clientRfiDate', label: 'Client RFI date', visible: true },
    { key: 'clientRfiStatus', label: 'Client RFI Status', visible: true },
    { key: 'submissionDateToMoh', label: 'Submission date to MOH', visible: true },
    { key: 'mohRfi1Date', label: 'MOH RFI 1 date', visible: true },
    { key: 'mohRfi1Status', label: 'MOH RFI 1 Status', visible: true },
    { key: 'mohRfi2Date', label: 'MOH RFI 2 date', visible: true },
    { key: 'mohRfi2Status', label: 'MOH RFI 2 Status', visible: true },
    { key: 'submissionToMohYear', label: 'Submission to MOH Year', visible: true },
    { key: 'registrationStatus', label: 'Registration Status', visible: true },
    { key: 'registrationNumber', label: 'Registration number', visible: true },
    { key: 'shelfLife', label: 'Shelf Life', visible: true },
    { key: 'approvalDate', label: 'Approval date', visible: true },
    { key: 'approvalYear', label: 'Approval Year', visible: true },
    { key: 'registrationValidity', label: 'Registration validity', visible: true },
    { key: 'renewalSubDate', label: 'Renewal sub. Date', visible: true },
    { key: 'renewalDate', label: 'Renewal date', visible: true },
    { key: 'renewalStatus', label: 'Renewal Status', visible: true },
    { key: 'expectedApprovalTimeline', label: 'Expected Approval Timeline', visible: true },
    { key: 'variation', label: 'Variation', visible: true },
    { key: 'remarks', label: 'Remarks', visible: true },
    { key: 'commercialStatus', label: 'Commercial Status', visible: true },
    { key: 'artWorksVersions', label: 'Art works Versions', visible: true },
    { key: 'raCommitments', label: 'RA Commitments', visible: true },
    { key: 'raCommitmentsStatus', label: 'RA Commitments status', visible: true },
  ]);

  freezeCount = signal<number>(0);

  visibleColumnCount = computed(() => {
    return this.selectedColumns().filter((c) => c.visible !== false).length || 1;
  });

  columnWidths: Record<string, number> = {
    actions: 90,
    serial: 75,
    dossierId: 135,
    region: 120,
    dossierType: 120,
    country: 120,
    market: 100,
    molecule: 140,
    productName: 280,
    dosageForm: 160,
    strength: 180,
    fillVolume: 160,
    typeOfPack: 140,
    brandName: 130,
    apiHolder: 120,
    client: 130,
    raResponsible: 140,
    bdResponsible: 140,
    businessAgreementStatus: 190,
    distributionAgreement: 170,
    qualityTechnicalAgreement: 190,
    maFee: 140,
    maFeePaymentDate: 160,
    maHolder: 130,
    submissionDateToClient: 180,
    clientRfiDate: 140,
    clientRfiStatus: 140,
    submissionDateToMoh: 180,
    mohRfi1Date: 150,
    mohRfi1Status: 150,
    mohRfi2Date: 150,
    mohRfi2Status: 150,
    submissionToMohYear: 170,
    registrationStatus: 160,
    registrationNumber: 160,
    shelfLife: 110,
    approvalDate: 140,
    approvalYear: 130,
    registrationValidity: 160,
    renewalSubDate: 150,
    renewalDate: 140,
    renewalStatus: 140,
    expectedApprovalTimeline: 200,
    variation: 180,
    remarks: 200,
    commercialStatus: 150,
    artWorksVersions: 150,
    raCommitments: 160,
    raCommitmentsStatus: 170,
  };

  // Master Data (16 Records with exact records from screenshots)
  recordsList = signal<RaSubmissionRecord[]>([
    {
      id: 1,
      serial: 1,
      dossierId: 'RA09222025',
      region: 'Europe',
      dossierType: 'CTD',
      country: 'Germany',
      market: 'EU',
      molecule: 'Iohexol',
      productName: 'Iohexol solution for injection',
      dosageForm: 'Solution for Injection',
      strength: '300 mgI/mL & 350 mg I/ml',
      fillVolume: '50 mL, 100ml, 200 ml & 500 mL',
      typeOfPack: 'Mono Vial',
      brandName: 'Jodascan',
      apiHolder: 'XYZ',
      client: 'Apollo',
      raResponsible: 'Venkat',
      bdResponsible: 'Ushir',
      businessAgreementStatus: 'Available',
      distributionAgreement: 'Available',
      qualityTechnicalAgreement: 'Signed',
      maFee: '350000 Euro',
      maFeePaymentDate: '09-22-25',
      maHolder: 'Apollo',
      submissionDateToClient: '05-22-25',
      clientRfiDate: '07-22-25',
      clientRfiStatus: 'Completed',
      submissionDateToMoh: '10-22-25',
      mohRfi1Date: '02-01-26',
      mohRfi1Status: 'Completed',
      mohRfi2Date: '02-01-26',
      mohRfi2Status: 'Completed',
      submissionToMohYear: '2025',
      registrationStatus: 'Registered',
      registrationNumber: 'APL12345',
      shelfLife: '48 M',
      approvalDate: '05-05-26',
      approvalYear: '2026',
      registrationValidity: '5 years',
      renewalSubDate: '12-01-29',
      renewalDate: '05-04-31',
      renewalStatus: '',
      expectedApprovalTimeline: '',
      variation: 'API addition\nChange in Pack\nChange in Batch size',
      remarks: 'all variations are approved',
      commercialStatus: 'Commercialised',
      artWorksVersions: '',
      raCommitments: 'API Alt. Source',
      raCommitmentsStatus: 'closed',
    },
    {
      id: 2,
      serial: 2,
      dossierId: 'RA11082026',
      region: 'Australia',
      dossierType: 'CTD',
      country: 'Australia',
      market: 'ANZ',
      molecule: 'Abiraterone',
      productName: 'Abiraterone Acetate Film Coated Tablets',
      dosageForm: 'Tablets',
      strength: '250 mg & 500 mg',
      fillVolume: 'NA',
      typeOfPack: 'Blister & Bottle',
      brandName: 'Abita',
      apiHolder: 'ABCD',
      client: 'Novel',
      raResponsible: 'Sunil',
      bdResponsible: 'Anand',
      businessAgreementStatus: 'Available',
      distributionAgreement: '',
      qualityTechnicalAgreement: '',
      maFee: '100000 AUSD',
      maFeePaymentDate: '08-11-26',
      maHolder: 'Jodas',
      submissionDateToClient: '05-11-26',
      clientRfiDate: '06-15-26',
      clientRfiStatus: 'Completed',
      submissionDateToMoh: '08-25-26',
      mohRfi1Date: '09-02-26',
      mohRfi1Status: 'Open',
      mohRfi2Date: '',
      mohRfi2Status: '',
      submissionToMohYear: '2026',
      registrationStatus: 'Under Registration',
      registrationNumber: '',
      shelfLife: '24 M',
      approvalDate: '',
      approvalYear: '',
      registrationValidity: '',
      renewalSubDate: '',
      renewalDate: '',
      renewalStatus: 'Yes',
      expectedApprovalTimeline: '',
      variation: '',
      remarks: '',
      commercialStatus: '',
      artWorksVersions: '',
      raCommitments: 'Batch Size',
      raCommitmentsStatus: 'Open',
    },
    {
      id: 3,
      serial: 3,
      dossierId: 'RA09222026',
      region: 'Latam',
      dossierType: 'CTD',
      country: 'Mexico',
      market: 'ROW',
      molecule: 'Paracetamol',
      productName: 'Paracetamol infusion',
      dosageForm: 'Solution for Injection',
      strength: '10mg/ml (100 ml)',
      fillVolume: '50 ml, 100 ml',
      typeOfPack: 'Mono Vial',
      brandName: 'Xylo',
      apiHolder: 'DCRED',
      client: 'Jodanov',
      raResponsible: 'Ram',
      bdResponsible: 'Ramesh',
      businessAgreementStatus: 'Available',
      distributionAgreement: '',
      qualityTechnicalAgreement: '',
      maFee: '1500000 Piso',
      maFeePaymentDate: '',
      maHolder: 'AND',
      submissionDateToClient: '09-21-26',
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
      artWorksVersions: '3',
      raCommitments: '',
      raCommitmentsStatus: 'Open',
    },
    {
      id: 4,
      serial: 4,
      dossierId: 'RA10052026',
      region: 'Europe',
      dossierType: 'CTD',
      country: 'Spain',
      market: 'EU',
      molecule: 'Enoxaparin Sodium',
      productName: 'Enoxalow 40 mg Prefilled Syringe',
      dosageForm: 'Injection (PFS)',
      strength: '40 mg / 0.4 mL',
      fillVolume: '0.4 mL',
      typeOfPack: 'Prefilled Syringe',
      brandName: 'Enoxalow',
      apiHolder: 'BioTech Pharma',
      client: 'Sanofi Corp',
      raResponsible: 'Priya Nair',
      bdResponsible: 'Kiran Rao',
      businessAgreementStatus: 'Available',
      distributionAgreement: 'Signed',
      qualityTechnicalAgreement: 'Approved',
      maFee: '250000 Euro',
      maFeePaymentDate: '10-15-25',
      maHolder: 'Sanofi Corp',
      submissionDateToClient: '06-18-25',
      clientRfiDate: '08-10-25',
      clientRfiStatus: 'Completed',
      submissionDateToMoh: '09-10-25',
      mohRfi1Date: '11-15-25',
      mohRfi1Status: 'Completed',
      mohRfi2Date: '01-10-26',
      mohRfi2Status: 'Completed',
      submissionToMohYear: '2025',
      registrationStatus: 'Registered',
      registrationNumber: 'AEMPS-88421',
      shelfLife: '36 M',
      approvalDate: '03-12-26',
      approvalYear: '2026',
      registrationValidity: '5 years',
      renewalSubDate: '03-12-31',
      renewalDate: '06-15-31',
      renewalStatus: 'Pending',
      expectedApprovalTimeline: '9 Months',
      variation: 'Site Transfer',
      remarks: 'Deficiency query answered',
      commercialStatus: 'Commercialised',
      artWorksVersions: '2',
      raCommitments: 'Annual Stability',
      raCommitmentsStatus: 'closed',
    },
    {
      id: 5,
      serial: 5,
      dossierId: 'RA10202026',
      region: 'US',
      dossierType: 'eCTD',
      country: 'United States',
      market: 'US',
      molecule: 'Atorvastatin',
      productName: 'Atorvex 20 mg Tablets',
      dosageForm: 'Tablets',
      strength: '20 mg & 40 mg',
      fillVolume: 'NA',
      typeOfPack: 'HDPE Bottle',
      brandName: 'Atorvex',
      apiHolder: 'Cipla API',
      client: 'Pfizer Inc',
      raResponsible: 'Venkat',
      bdResponsible: 'Anand',
      businessAgreementStatus: 'Available',
      distributionAgreement: 'Available',
      qualityTechnicalAgreement: 'Signed',
      maFee: '400000 USD',
      maFeePaymentDate: '11-02-25',
      maHolder: 'Pfizer Inc',
      submissionDateToClient: '07-12-25',
      clientRfiDate: '09-20-25',
      clientRfiStatus: 'Completed',
      submissionDateToMoh: '10-05-25',
      mohRfi1Date: '12-01-25',
      mohRfi1Status: 'Completed',
      mohRfi2Date: '02-15-26',
      mohRfi2Status: 'Open',
      submissionToMohYear: '2025',
      registrationStatus: 'Under Registration',
      registrationNumber: 'ANDA-214589',
      shelfLife: '24 M',
      approvalDate: '',
      approvalYear: '',
      registrationValidity: '',
      renewalSubDate: '',
      renewalDate: '',
      renewalStatus: '',
      expectedApprovalTimeline: '',
      variation: 'Analytical Method Validation',
      remarks: 'FDA Clearance pending review',
      commercialStatus: 'In Progress',
      artWorksVersions: '1',
      raCommitments: 'Process Validation',
      raCommitmentsStatus: 'Open',
    },
    {
      id: 6,
      serial: 6,
      dossierId: 'RA10352026',
      region: 'Asia Pacific',
      dossierType: 'ACTD',
      country: 'India',
      market: 'India',
      molecule: 'Metformin HCl',
      productName: 'Metfosure 1000 XR Tablets',
      dosageForm: 'Extended Release Tablets',
      strength: '500 mg & 1000 mg',
      fillVolume: 'NA',
      typeOfPack: 'Blister Pack',
      brandName: 'Metfosure',
      apiHolder: 'Aarti Drugs',
      client: 'Sun Pharma',
      raResponsible: 'Sunil',
      bdResponsible: 'Ushir',
      businessAgreementStatus: 'Available',
      distributionAgreement: 'Signed',
      qualityTechnicalAgreement: 'Signed',
      maFee: '500000 INR',
      maFeePaymentDate: '06-25-25',
      maHolder: 'Sun Pharma',
      submissionDateToClient: '03-10-25',
      clientRfiDate: '05-18-25',
      clientRfiStatus: 'Completed',
      submissionDateToMoh: '06-20-25',
      mohRfi1Date: '08-10-25',
      mohRfi1Status: 'Completed',
      mohRfi2Date: '',
      mohRfi2Status: '',
      submissionToMohYear: '2025',
      registrationStatus: 'Registered',
      registrationNumber: 'MF-9932-IN',
      shelfLife: '36 M',
      approvalDate: '11-18-25',
      approvalYear: '2025',
      registrationValidity: '5 years',
      renewalSubDate: '11-18-30',
      renewalDate: '02-20-31',
      renewalStatus: 'Yes',
      expectedApprovalTimeline: '3 Months',
      variation: 'Excipient Source Change',
      remarks: 'Approved by DCGI',
      commercialStatus: 'Commercialised',
      artWorksVersions: '4',
      raCommitments: 'Dissolution Profiling',
      raCommitmentsStatus: 'closed',
    },
    {
      id: 7,
      serial: 7,
      dossierId: 'RA11122026',
      region: 'Europe',
      dossierType: 'CTD',
      country: 'France',
      market: 'EU',
      molecule: 'Ceftriaxone',
      productName: 'Ceftrimax 1 g Powder for Injection',
      dosageForm: 'Powder for Injection',
      strength: '1 g & 2 g',
      fillVolume: '10 mL Vial',
      typeOfPack: 'Vial with Stopper',
      brandName: 'Ceftrimax',
      apiHolder: 'Nectar Lifesciences',
      client: 'Sandoz AG',
      raResponsible: 'Ram',
      bdResponsible: 'Ramesh',
      businessAgreementStatus: 'Available',
      distributionAgreement: 'Under Review',
      qualityTechnicalAgreement: 'Signed',
      maFee: '180000 Euro',
      maFeePaymentDate: '01-14-26',
      maHolder: 'Sandoz AG',
      submissionDateToClient: '10-05-25',
      clientRfiDate: '12-10-25',
      clientRfiStatus: 'Completed',
      submissionDateToMoh: '01-08-26',
      mohRfi1Date: '03-14-26',
      mohRfi1Status: 'Completed',
      mohRfi2Date: '04-20-26',
      mohRfi2Status: 'Completed',
      submissionToMohYear: '2026',
      registrationStatus: 'Registered',
      registrationNumber: 'FR-MA-7741',
      shelfLife: '48 M',
      approvalDate: '06-15-26',
      approvalYear: '2026',
      registrationValidity: '5 years',
      renewalSubDate: '06-15-31',
      renewalDate: '09-15-31',
      renewalStatus: 'In Progress',
      expectedApprovalTimeline: '6 Months',
      variation: 'Secondary Packaging',
      remarks: 'All variations validated',
      commercialStatus: 'Commercialised',
      artWorksVersions: '2',
      raCommitments: 'Shelf-life extension',
      raCommitmentsStatus: 'closed',
    },
    {
      id: 8,
      serial: 8,
      dossierId: 'RA11252026',
      region: 'Latam',
      dossierType: 'CTD',
      country: 'Brazil',
      market: 'LATAM',
      molecule: 'Ondansetron',
      productName: 'Onsetra 8 mg ODT',
      dosageForm: 'Orally Disintegrating Tablets',
      strength: '4 mg & 8 mg',
      fillVolume: 'NA',
      typeOfPack: 'Alu-Alu Blister',
      brandName: 'Onsetra',
      apiHolder: 'Dr. Reddys',
      client: 'EMS Pharma',
      raResponsible: 'Priya Nair',
      bdResponsible: 'Kiran Rao',
      businessAgreementStatus: 'Available',
      distributionAgreement: 'Signed',
      qualityTechnicalAgreement: 'Signed',
      maFee: '950000 BRL',
      maFeePaymentDate: '02-28-26',
      maHolder: 'EMS Pharma',
      submissionDateToClient: '11-19-25',
      clientRfiDate: '01-22-26',
      clientRfiStatus: 'Pending',
      submissionDateToMoh: '03-02-26',
      mohRfi1Date: '05-10-26',
      mohRfi1Status: 'Open',
      mohRfi2Date: '',
      mohRfi2Status: '',
      submissionToMohYear: '2026',
      registrationStatus: 'Under Registration',
      registrationNumber: '',
      shelfLife: '24 M',
      approvalDate: '',
      approvalYear: '',
      registrationValidity: '',
      renewalSubDate: '',
      renewalDate: '',
      renewalStatus: '',
      expectedApprovalTimeline: '',
      variation: 'Flavour modification',
      remarks: 'ANVISA query response under prep',
      commercialStatus: 'In Progress',
      artWorksVersions: '1',
      raCommitments: 'BE Study submission',
      raCommitmentsStatus: 'Open',
    },
    {
      id: 9,
      serial: 9,
      dossierId: 'RA11402026',
      region: 'Middle East',
      dossierType: 'eCTD',
      country: 'Saudi Arabia',
      market: 'MENA',
      molecule: 'Pantoprazole',
      productName: 'Pantozen 40 mg IV Injection',
      dosageForm: 'Lyophilized Powder',
      strength: '40 mg',
      fillVolume: '10 mL Vial',
      typeOfPack: 'Flint Vial',
      brandName: 'Pantozen',
      apiHolder: 'Hetero Drugs',
      client: 'Spimaco',
      raResponsible: 'Venkat',
      bdResponsible: 'Anand',
      businessAgreementStatus: 'Available',
      distributionAgreement: 'Available',
      qualityTechnicalAgreement: 'Signed',
      maFee: '450000 SAR',
      maFeePaymentDate: '03-15-26',
      maHolder: 'Spimaco',
      submissionDateToClient: '12-01-25',
      clientRfiDate: '02-14-26',
      clientRfiStatus: 'Completed',
      submissionDateToMoh: '01-18-26',
      mohRfi1Date: '03-25-26',
      mohRfi1Status: 'Completed',
      mohRfi2Date: '05-02-26',
      mohRfi2Status: 'Completed',
      submissionToMohYear: '2026',
      registrationStatus: 'Registered',
      registrationNumber: 'SFDA-P-4402',
      shelfLife: '36 M',
      approvalDate: '07-10-26',
      approvalYear: '2026',
      registrationValidity: '5 years',
      renewalSubDate: '07-10-31',
      renewalDate: '10-15-31',
      renewalStatus: 'Yes',
      expectedApprovalTimeline: '6 Months',
      variation: 'Diluent volume change',
      remarks: 'SFDA Approval received',
      commercialStatus: 'Commercialised',
      artWorksVersions: '3',
      raCommitments: 'API impurity threshold',
      raCommitmentsStatus: 'closed',
    },
    {
      id: 10,
      serial: 10,
      dossierId: 'RA11552026',
      region: 'Europe',
      dossierType: 'CTD',
      country: 'United Kingdom',
      market: 'UK',
      molecule: 'Meropenem',
      productName: 'Meropenem 1000 mg IV Injection',
      dosageForm: 'Powder for Injection',
      strength: '500 mg & 1000 mg',
      fillVolume: '20 mL Vial',
      typeOfPack: 'Glass Vial',
      brandName: 'Meromax',
      apiHolder: 'Arch Pharmalabs',
      client: 'Accord Healthcare',
      raResponsible: 'Sunil',
      bdResponsible: 'Ushir',
      businessAgreementStatus: 'Available',
      distributionAgreement: 'Signed',
      qualityTechnicalAgreement: 'Signed',
      maFee: '220000 GBP',
      maFeePaymentDate: '04-10-26',
      maHolder: 'Accord Healthcare',
      submissionDateToClient: '01-15-26',
      clientRfiDate: '03-20-26',
      clientRfiStatus: 'Completed',
      submissionDateToMoh: '02-12-26',
      mohRfi1Date: '04-15-26',
      mohRfi1Status: 'Completed',
      mohRfi2Date: '',
      mohRfi2Status: '',
      submissionToMohYear: '2026',
      registrationStatus: 'Registered',
      registrationNumber: 'PL-32890/01',
      shelfLife: '48 M',
      approvalDate: '07-28-26',
      approvalYear: '2026',
      registrationValidity: '5 years',
      renewalSubDate: '07-28-31',
      renewalDate: '11-01-31',
      renewalStatus: 'Pending',
      expectedApprovalTimeline: '6 Months',
      variation: 'Manufacturing batch size scale-up',
      remarks: 'MHRA variation accepted',
      commercialStatus: 'Commercialised',
      artWorksVersions: '2',
      raCommitments: 'Hold time stability',
      raCommitmentsStatus: 'closed',
    },
    {
      id: 11,
      serial: 11,
      dossierId: 'RA11702026',
      region: 'Asia Pacific',
      dossierType: 'ACTD',
      country: 'Japan',
      market: 'Japan',
      molecule: 'Bortezomib',
      productName: 'Bortezomib 3.5 mg Injection',
      dosageForm: 'Lyophilized Powder',
      strength: '3.5 mg',
      fillVolume: '10 mL Vial',
      typeOfPack: 'Amber Vial',
      brandName: 'Velcan',
      apiHolder: 'ScinoPharm',
      client: 'Takeda Pharma',
      raResponsible: 'Ram',
      bdResponsible: 'Ramesh',
      businessAgreementStatus: 'Available',
      distributionAgreement: 'Pending',
      qualityTechnicalAgreement: 'Under Review',
      maFee: '12000000 JPY',
      maFeePaymentDate: '',
      maHolder: 'Takeda Pharma',
      submissionDateToClient: '02-20-26',
      clientRfiDate: '',
      clientRfiStatus: 'Pending',
      submissionDateToMoh: '04-10-26',
      mohRfi1Date: '06-20-26',
      mohRfi1Status: 'Pending',
      mohRfi2Date: '',
      mohRfi2Status: '',
      submissionToMohYear: '2026',
      registrationStatus: 'Under Registration',
      registrationNumber: '',
      shelfLife: '24 M',
      approvalDate: '',
      approvalYear: '',
      registrationValidity: '',
      renewalSubDate: '',
      renewalDate: '',
      renewalStatus: '',
      expectedApprovalTimeline: '',
      variation: '',
      remarks: 'PMDA consultation completed',
      commercialStatus: 'Planned',
      artWorksVersions: '',
      raCommitments: 'Specific rotation testing',
      raCommitmentsStatus: 'Open',
    },
    {
      id: 12,
      serial: 12,
      dossierId: 'RA11852026',
      region: 'North America',
      dossierType: 'eCTD',
      country: 'Canada',
      market: 'Canada',
      molecule: 'Paclitaxel',
      productName: 'Paclitaxel 100 mg / 16.7 mL',
      dosageForm: 'Concentrate for Infusion',
      strength: '6 mg/mL (30 mg, 100 mg)',
      fillVolume: '5 mL, 16.7 mL',
      typeOfPack: 'Type I Glass Vial',
      brandName: 'Taxocare',
      apiHolder: 'Fresenius Kabi',
      client: 'Apotex Inc',
      raResponsible: 'Priya Nair',
      bdResponsible: 'Kiran Rao',
      businessAgreementStatus: 'Available',
      distributionAgreement: 'Signed',
      qualityTechnicalAgreement: 'Signed',
      maFee: '320000 CAD',
      maFeePaymentDate: '05-04-26',
      maHolder: 'Apotex Inc',
      submissionDateToClient: '02-28-26',
      clientRfiDate: '04-18-26',
      clientRfiStatus: 'Completed',
      submissionDateToMoh: '03-20-26',
      mohRfi1Date: '05-25-26',
      mohRfi1Status: 'Completed',
      mohRfi2Date: '07-04-26',
      mohRfi2Status: 'Completed',
      submissionToMohYear: '2026',
      registrationStatus: 'Registered',
      registrationNumber: 'DIN-0254881',
      shelfLife: '36 M',
      approvalDate: '08-14-26',
      approvalYear: '2026',
      registrationValidity: '5 years',
      renewalSubDate: '08-14-31',
      renewalDate: '12-01-31',
      renewalStatus: 'Yes',
      expectedApprovalTimeline: '4 Months',
      variation: 'Filter validation protocol',
      remarks: 'Health Canada approved NOC',
      commercialStatus: 'Commercialised',
      artWorksVersions: '1',
      raCommitments: 'Leachables assessment',
      raCommitmentsStatus: 'closed',
    },
    {
      id: 13,
      serial: 13,
      dossierId: 'RA12002026',
      region: 'Africa',
      dossierType: 'ACTD',
      country: 'South Africa',
      market: 'Africa',
      molecule: 'Levofloxacin',
      productName: 'Levoflox 500 mg Infusion',
      dosageForm: 'Infusion in Polyolefin bag',
      strength: '5 mg/mL (100 mL)',
      fillVolume: '100 mL',
      typeOfPack: 'IV Bag',
      brandName: 'Levoflox',
      apiHolder: 'Aurobindo',
      client: 'Aspen Pharmacare',
      raResponsible: 'Venkat',
      bdResponsible: 'Anand',
      businessAgreementStatus: 'Available',
      distributionAgreement: 'Signed',
      qualityTechnicalAgreement: 'Signed',
      maFee: '600000 ZAR',
      maFeePaymentDate: '06-12-26',
      maHolder: 'Aspen Pharmacare',
      submissionDateToClient: '03-15-26',
      clientRfiDate: '05-22-26',
      clientRfiStatus: 'Completed',
      submissionDateToMoh: '04-18-26',
      mohRfi1Date: '06-30-26',
      mohRfi1Status: 'Completed',
      mohRfi2Date: '',
      mohRfi2Status: '',
      submissionToMohYear: '2026',
      registrationStatus: 'Registered',
      registrationNumber: 'SAHPRA-54/2',
      shelfLife: '36 M',
      approvalDate: '08-22-26',
      approvalYear: '2026',
      registrationValidity: '5 years',
      renewalSubDate: '08-22-31',
      renewalDate: '12-10-31',
      renewalStatus: 'In Progress',
      expectedApprovalTimeline: '6 Months',
      variation: 'Overpouch packaging change',
      remarks: 'SAHPRA approval granted',
      commercialStatus: 'Commercialised',
      artWorksVersions: '2',
      raCommitments: 'Moisture barrier testing',
      raCommitmentsStatus: 'closed',
    },
    {
      id: 14,
      serial: 14,
      dossierId: 'RA12152026',
      region: 'Europe',
      dossierType: 'CTD',
      country: 'Italy',
      market: 'EU',
      molecule: 'Azithromycin',
      productName: 'Azithro 500 mg Powder for Infusion',
      dosageForm: 'Powder for Infusion',
      strength: '500 mg',
      fillVolume: '10 mL Vial',
      typeOfPack: 'Tubular Vial',
      brandName: 'Zithromax-G',
      apiHolder: 'Zhejiang Guobang',
      client: 'Menarini Group',
      raResponsible: 'Sunil',
      bdResponsible: 'Ushir',
      businessAgreementStatus: 'Available',
      distributionAgreement: 'Available',
      qualityTechnicalAgreement: 'Signed',
      maFee: '210000 Euro',
      maFeePaymentDate: '07-02-26',
      maHolder: 'Menarini Group',
      submissionDateToClient: '04-01-26',
      clientRfiDate: '06-10-26',
      clientRfiStatus: 'Completed',
      submissionDateToMoh: '05-02-26',
      mohRfi1Date: '07-12-26',
      mohRfi1Status: 'Completed',
      mohRfi2Date: '08-19-26',
      mohRfi2Status: 'Completed',
      submissionToMohYear: '2026',
      registrationStatus: 'Registered',
      registrationNumber: 'AIC-042891',
      shelfLife: '48 M',
      approvalDate: '09-08-26',
      approvalYear: '2026',
      registrationValidity: '5 years',
      renewalSubDate: '09-08-31',
      renewalDate: '01-15-32',
      renewalStatus: 'Yes',
      expectedApprovalTimeline: '6 Months',
      variation: 'Sterilization cycle validation',
      remarks: 'AIFA review complete',
      commercialStatus: 'Commercialised',
      artWorksVersions: '3',
      raCommitments: 'Sterility test validation',
      raCommitmentsStatus: 'closed',
    },
    {
      id: 15,
      serial: 15,
      dossierId: 'RA12302026',
      region: 'Latam',
      dossierType: 'CTD',
      country: 'Colombia',
      market: 'LATAM',
      molecule: 'Omeprazole',
      productName: 'Omepra 40 mg IV Injection',
      dosageForm: 'Lyophilized Powder',
      strength: '40 mg',
      fillVolume: '10 mL Vial',
      typeOfPack: 'Mono Vial with Solvent',
      brandName: 'Omepra-IV',
      apiHolder: 'Uquifa API',
      client: 'Procaps SA',
      raResponsible: 'Ram',
      bdResponsible: 'Ramesh',
      businessAgreementStatus: 'Available',
      distributionAgreement: 'Signed',
      qualityTechnicalAgreement: 'Signed',
      maFee: '85000000 COP',
      maFeePaymentDate: '08-18-26',
      maHolder: 'Procaps SA',
      submissionDateToClient: '05-10-26',
      clientRfiDate: '07-15-26',
      clientRfiStatus: 'Completed',
      submissionDateToMoh: '06-15-26',
      mohRfi1Date: '08-20-26',
      mohRfi1Status: 'Completed',
      mohRfi2Date: '',
      mohRfi2Status: '',
      submissionToMohYear: '2026',
      registrationStatus: 'Registered',
      registrationNumber: 'INVIMA-2026M',
      shelfLife: '24 M',
      approvalDate: '09-18-26',
      approvalYear: '2026',
      registrationValidity: '5 years',
      renewalSubDate: '09-18-31',
      renewalDate: '01-20-32',
      renewalStatus: 'Pending',
      expectedApprovalTimeline: '8 Months',
      variation: 'Solvent ampoule supplier change',
      remarks: 'INVIMA approval received',
      commercialStatus: 'Commercialised',
      artWorksVersions: '1',
      raCommitments: 'Solvent stability data',
      raCommitmentsStatus: 'closed',
    },
    {
      id: 16,
      serial: 16,
      dossierId: 'RA12452026',
      region: 'Australia',
      dossierType: 'CTD',
      country: 'New Zealand',
      market: 'ANZ',
      molecule: 'Ciprofloxacin',
      productName: 'Cipro 200 mg / 100 mL Infusion',
      dosageForm: 'Solution for Infusion',
      strength: '2 mg/mL (100 mL)',
      fillVolume: '100 mL',
      typeOfPack: 'Polypropylene Bottle',
      brandName: 'Ciprolon',
      apiHolder: 'Bayer AG',
      client: 'Douglas Pharmaceuticals',
      raResponsible: 'Priya Nair',
      bdResponsible: 'Kiran Rao',
      businessAgreementStatus: 'Available',
      distributionAgreement: 'Pending',
      qualityTechnicalAgreement: 'Signed',
      maFee: '120000 NZD',
      maFeePaymentDate: '',
      maHolder: 'Douglas Pharmaceuticals',
      submissionDateToClient: '06-05-26',
      clientRfiDate: '08-01-26',
      clientRfiStatus: 'Pending',
      submissionDateToMoh: '07-10-26',
      mohRfi1Date: '09-01-26',
      mohRfi1Status: 'Open',
      mohRfi2Date: '',
      mohRfi2Status: '',
      submissionToMohYear: '2026',
      registrationStatus: 'Under Registration',
      registrationNumber: '',
      shelfLife: '24 M',
      approvalDate: '',
      approvalYear: '',
      registrationValidity: '',
      renewalSubDate: '',
      renewalDate: '',
      renewalStatus: '',
      expectedApprovalTimeline: '',
      variation: 'Closure system update',
      remarks: 'Medsafe dossier evaluation ongoing',
      commercialStatus: 'In Progress',
      artWorksVersions: '1',
      raCommitments: 'Container closure integrity',
      raCommitmentsStatus: 'Open',
    },
  ]);

  // Unique options for filters
  regionsList = computed(() => {
    const set = new Set<string>();
    this.recordsList().forEach((r) => r.region && set.add(r.region));
    return Array.from(set).sort();
  });

  marketsList = computed(() => {
    const set = new Set<string>();
    this.recordsList().forEach((r) => r.market && set.add(r.market));
    return Array.from(set).sort();
  });

  dossierTypesList = computed(() => {
    const set = new Set<string>();
    this.recordsList().forEach((r) => r.dossierType && set.add(r.dossierType));
    return Array.from(set).sort();
  });

  registrationStatusesList = computed(() => {
    const set = new Set<string>();
    this.recordsList().forEach((r) => r.registrationStatus && set.add(r.registrationStatus));
    return Array.from(set).sort();
  });

  clientRfiStatusesList = computed(() => {
    const set = new Set<string>();
    this.recordsList().forEach((r) => r.clientRfiStatus && set.add(r.clientRfiStatus));
    return Array.from(set).sort();
  });

  commercialStatusesList = computed(() => {
    const set = new Set<string>();
    this.recordsList().forEach((r) => r.commercialStatus && set.add(r.commercialStatus));
    return Array.from(set).sort();
  });

  // Filtered and Sorted Records
  filteredRecords = computed(() => {
    let list = [...this.recordsList()];

    // Keyword filter
    const kw = this.filterKeyword().trim().toLowerCase();
    if (kw) {
      list = list.filter((r) => {
        return (
          r.dossierId?.toLowerCase().includes(kw) ||
          r.molecule?.toLowerCase().includes(kw) ||
          r.productName?.toLowerCase().includes(kw) ||
          r.country?.toLowerCase().includes(kw) ||
          r.client?.toLowerCase().includes(kw) ||
          r.brandName?.toLowerCase().includes(kw) ||
          r.apiHolder?.toLowerCase().includes(kw) ||
          r.raResponsible?.toLowerCase().includes(kw) ||
          r.bdResponsible?.toLowerCase().includes(kw) ||
          r.registrationNumber?.toLowerCase().includes(kw) ||
          r.registrationStatus?.toLowerCase().includes(kw) ||
          r.renewalStatus?.toLowerCase().includes(kw)
        );
      });
    }

    // Region filter
    if (this.filterRegion() !== 'All') {
      list = list.filter((r) => r.region === this.filterRegion());
    }

    // Market filter
    if (this.filterMarket() !== 'All') {
      list = list.filter((r) => r.market === this.filterMarket());
    }

    // Dossier Type filter
    if (this.filterDossierType() !== 'All') {
      list = list.filter((r) => r.dossierType === this.filterDossierType());
    }

    // Registration Status filter
    if (this.filterRegistrationStatus() !== 'All') {
      list = list.filter((r) => r.registrationStatus === this.filterRegistrationStatus());
    }

    // Client RFI Status filter
    if (this.filterClientRfiStatus() !== 'All') {
      list = list.filter((r) => r.clientRfiStatus === this.filterClientRfiStatus());
    }

    // Commercial Status filter
    if (this.filterCommercialStatus() !== 'All') {
      list = list.filter((r) => r.commercialStatus === this.filterCommercialStatus());
    }

    // Sorting
    const sortCol = this.sortColumn();
    const sortDir = this.sortDirection();
    if (sortCol && sortDir) {
      list.sort((a, b) => {
        const valA = (a as unknown as Record<string, unknown>)[sortCol];
        const valB = (b as unknown as Record<string, unknown>)[sortCol];

        if (valA === valB) return 0;
        if (valA === null || valA === undefined || valA === '') return 1;
        if (valB === null || valB === undefined || valB === '') return -1;

        let comp = 0;
        if (typeof valA === 'number' && typeof valB === 'number') {
          comp = valA - valB;
        } else {
          comp = String(valA).localeCompare(String(valB));
        }

        return sortDir === 'asc' ? comp : -comp;
      });
    }

    return list;
  });

  // Paginated Records
  paginatedRecords = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredRecords().slice(start, start + this.pageSize());
  });

  // Active filter count
  activeFilterCount = computed(() => {
    let count = 0;
    if (this.filterKeyword().trim()) count++;
    if (this.filterRegion() !== 'All') count++;
    if (this.filterMarket() !== 'All') count++;
    if (this.filterDossierType() !== 'All') count++;
    if (this.filterRegistrationStatus() !== 'All') count++;
    if (this.filterClientRfiStatus() !== 'All') count++;
    if (this.filterCommercialStatus() !== 'All') count++;
    return count;
  });

  constructor(private dialog: MatDialog) {}

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
    this.filterRegion.set('All');
    this.filterMarket.set('All');
    this.filterDossierType.set('All');
    this.filterRegistrationStatus.set('All');
    this.filterClientRfiStatus.set('All');
    this.filterCommercialStatus.set('All');
    this.currentPage.set(1);
  }

  // Sorting
  onSort(colKey: string): void {
    if (colKey === 'actions') return;

    if (this.sortColumn() === colKey) {
      if (this.sortDirection() === 'asc') {
        this.sortDirection.set('desc');
      } else if (this.sortDirection() === 'desc') {
        this.sortDirection.set('');
        this.sortColumn.set('');
      } else {
        this.sortDirection.set('asc');
      }
    } else {
      this.sortColumn.set(colKey);
      this.sortDirection.set('asc');
    }
  }

  // Pagination Change
  onPageSizeChange(newSize: number): void {
    this.pageSize.set(newSize);
    this.currentPage.set(1);
  }

  // CSS Class Helpers for Column Headers
  getColumnCssClass(colKey: string): string {
    return `col-${colKey}`;
  }

  // Badge CSS Helper
  getStatusBadgeClass(status: string | undefined): string {
    if (!status) return 'badge-neutral';
    const s = status.toLowerCase().trim();
    if (
      s.includes('completed') ||
      s.includes('closed') ||
      s.includes('signed') ||
      s.includes('approved') ||
      s.includes('commercialised') ||
      (s.includes('registered') && !s.includes('under')) ||
      s === 'yes'
    ) {
      return 'badge-success';
    }
    if (
      s.includes('pending') ||
      s.includes('open') ||
      s.includes('in progress') ||
      s.includes('under registration')
    ) {
      return 'badge-warning';
    }
    if (s.includes('review') || s.includes('submitted')) {
      return 'badge-info';
    }
    return 'badge-neutral';
  }

  // Modal Handlers
  openAddModal(): void {
    this.selectedSubmissionForEdit.set(null);
    this.showSubmissionModal.set(true);
  }

  openEditModal(record: RaSubmissionRecord): void {
    this.selectedSubmissionForEdit.set({ ...record });
    this.showSubmissionModal.set(true);
  }

  closeSubmissionModal(): void {
    this.showSubmissionModal.set(false);
    this.selectedSubmissionForEdit.set(null);
  }

  onSaveSubmission(record: RaSubmissionRecord): void {
    if (this.selectedSubmissionForEdit()) {
      // Update existing
      this.recordsList.update((list) =>
        list.map((item) => (item.id === record.id ? { ...record } : item))
      );
    } else {
      // Prepend new record
      const newId = Date.now();
      const newSerial = this.recordsList().length + 1;
      const newRecord: RaSubmissionRecord = {
        ...record,
        id: newId,
        serial: newSerial,
      };
      this.recordsList.update((list) => [newRecord, ...list]);
    }
    this.closeSubmissionModal();
  }

  openDeleteModal(record: RaSubmissionRecord): void {
    this.targetDeleteRecord.set(record);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.targetDeleteRecord.set(null);
  }

  executeDelete(): void {
    const target = this.targetDeleteRecord();
    if (target) {
      this.recordsList.update((list) => list.filter((r) => r.id !== target.id));
    }
    this.closeDeleteModal();
  }
}
