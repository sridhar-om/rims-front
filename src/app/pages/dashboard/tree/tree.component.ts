import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface ProductItem {
  id: string;
  name: string;
  dosage: string;
  submissionsCount: number;
  status: 'Approved' | 'Submitted' | 'Filed' | 'Logged';
  regulatoryContext: string;
  health: number;
}

export interface MoleculeItem {
  id: string;
  name: string;
  expanded: boolean;
  products: ProductItem[];
}

export interface CountryNode {
  id: string;
  name: string;
  region: string;
  expanded: boolean;
  molecules: MoleculeItem[];
}

export interface SelectedProductContext {
  product: ProductItem;
  molecule: MoleculeItem;
  country: CountryNode;
}

export interface ProductRecord {
  recordId: string;
  molecule: string;
  product: string;
  country: string;
  region: string;
  regulatoryContext: string;
  stage: string;
  status: string;
  submittedOn: string;
  decisionOn: string;
  valueUsd: string;
}

@Component({
  selector: 'app-tree',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './tree.component.html',
  styleUrl: './tree.component.scss',
})
export class TreeComponent {
  selectedContext = signal<SelectedProductContext | null>(null);

  readonly treeData = signal<CountryNode[]>([
    {
      id: 'us',
      name: 'United States',
      region: 'North America',
      expanded: true,
      molecules: [
        {
          id: 'us-enox',
          name: 'Enoxaparin Sodium',
          expanded: true,
          products: [
            {
              id: 'us-p1',
              name: 'Enoxalow 40 mg',
              dosage: '40 mg',
              submissionsCount: 1,
              status: 'Approved',
              regulatoryContext: 'Highly Regulated',
              health: 96,
            },
            {
              id: 'us-p2',
              name: 'Enoxalow 60 mg',
              dosage: '60 mg',
              submissionsCount: 1,
              status: 'Approved',
              regulatoryContext: 'Highly Regulated',
              health: 92,
            },
            {
              id: 'us-p3',
              name: 'Enoxalow 80 mg',
              dosage: '80 mg',
              submissionsCount: 1,
              status: 'Submitted',
              regulatoryContext: 'Highly Regulated',
              health: 85,
            },
          ],
        },
        {
          id: 'us-atorv',
          name: 'Atorvastatin',
          expanded: false,
          products: [
            {
              id: 'us-p4',
              name: 'Atorvex 10 mg',
              dosage: '10 mg',
              submissionsCount: 1,
              status: 'Approved',
              regulatoryContext: 'Highly Regulated',
              health: 95,
            },
          ],
        },
        {
          id: 'us-ceft',
          name: 'Ceftriaxone',
          expanded: false,
          products: [],
        },
        {
          id: 'us-iohex',
          name: 'Iohexol',
          expanded: false,
          products: [],
        },
        {
          id: 'us-ondan',
          name: 'Ondansetron',
          expanded: false,
          products: [],
        },
        {
          id: 'us-metf',
          name: 'Metformin HCl',
          expanded: false,
          products: [],
        },
      ],
    },
    {
      id: 'ca',
      name: 'Canada',
      region: 'North America',
      expanded: false,
      molecules: [],
    },
    {
      id: 'mx',
      name: 'Mexico',
      region: 'Latin America',
      expanded: false,
      molecules: [],
    },
    {
      id: 'br',
      name: 'Brazil',
      region: 'Latin America',
      expanded: false,
      molecules: [],
    },
    {
      id: 'ar',
      name: 'Argentina',
      region: 'Latin America',
      expanded: false,
      molecules: [],
    },
    {
      id: 'uk',
      name: 'United Kingdom',
      region: 'Europe',
      expanded: false,
      molecules: [],
    },
    {
      id: 'de',
      name: 'Germany',
      region: 'Europe',
      expanded: true,
      molecules: [
        {
          id: 'de-enox',
          name: 'Enoxaparin Sodium',
          expanded: true,
          products: [
            {
              id: 'de-p1',
              name: 'Enoxalow 40 mg',
              dosage: '40 mg',
              submissionsCount: 1,
              status: 'Approved',
              regulatoryContext: 'Highly Regulated',
              health: 88,
            },
          ],
        },
      ],
    },
    {
      id: 'fr',
      name: 'France',
      region: 'Europe',
      expanded: false,
      molecules: [],
    },
    {
      id: 'es',
      name: 'Spain',
      region: 'Europe',
      expanded: false,
      molecules: [],
    },
  ]);

  readonly productRecords = computed<ProductRecord[]>(() => {
    const ctx = this.selectedContext();
    if (!ctx) return [];
    const pName = ctx.product.name;
    const mName = ctx.molecule.name;
    const cName = ctx.country.name;
    const rName = ctx.country.region;
    const regCtx = ctx.product.regulatoryContext || 'Highly Regulated';

    return [
      {
        recordId: 'REC-4000',
        molecule: mName,
        product: pName,
        country: cName,
        region: rName,
        regulatoryContext: regCtx,
        stage: 'Submission',
        status: 'Approved',
        submittedOn: '01 Jan 2026',
        decisionOn: '01 Sept 2026',
        valueUsd: '10,000',
      },
      {
        recordId: 'REC-4001',
        molecule: mName,
        product: pName,
        country: cName,
        region: rName,
        regulatoryContext: regCtx,
        stage: 'Filing',
        status: 'Approved',
        submittedOn: '15 Feb 2026',
        decisionOn: '15 Oct 2026',
        valueUsd: '25,000',
      },
      {
        recordId: 'REC-4002',
        molecule: mName,
        product: pName,
        country: cName,
        region: rName,
        regulatoryContext: regCtx,
        stage: 'Variation',
        status: 'Submitted',
        submittedOn: '10 Mar 2026',
        decisionOn: '12 Nov 2026',
        valueUsd: '18,500',
      },
      {
        recordId: 'REC-4003',
        molecule: mName,
        product: pName,
        country: cName,
        region: rName,
        regulatoryContext: regCtx,
        stage: 'Renewal',
        status: 'Approved',
        submittedOn: '22 Mar 2026',
        decisionOn: '22 Aug 2026',
        valueUsd: '15,000',
      },
      {
        recordId: 'REC-4004',
        molecule: mName,
        product: pName,
        country: cName,
        region: rName,
        regulatoryContext: regCtx,
        stage: 'Submission',
        status: 'Filed',
        submittedOn: '05 Apr 2026',
        decisionOn: '05 Dec 2026',
        valueUsd: '32,000',
      },
      {
        recordId: 'REC-4005',
        molecule: mName,
        product: pName,
        country: cName,
        region: rName,
        regulatoryContext: regCtx,
        stage: 'Safety Update',
        status: 'Approved',
        submittedOn: '18 May 2026',
        decisionOn: '18 Sept 2026',
        valueUsd: '8,500',
      },
      {
        recordId: 'REC-4006',
        molecule: mName,
        product: pName,
        country: cName,
        region: rName,
        regulatoryContext: regCtx,
        stage: 'Labeling',
        status: 'Submitted',
        submittedOn: '02 Jun 2026',
        decisionOn: '10 Jan 2027',
        valueUsd: '12,000',
      },
      {
        recordId: 'REC-4007',
        molecule: mName,
        product: pName,
        country: cName,
        region: rName,
        regulatoryContext: regCtx,
        stage: 'Pricing Approval',
        status: 'Hold',
        submittedOn: '20 Jun 2026',
        decisionOn: '15 Feb 2027',
        valueUsd: '45,000',
      },
      {
        recordId: 'REC-4008',
        molecule: mName,
        product: pName,
        country: cName,
        region: rName,
        regulatoryContext: regCtx,
        stage: 'Variation',
        status: 'Approved',
        submittedOn: '11 Jul 2026',
        decisionOn: '30 Nov 2026',
        valueUsd: '21,000',
      },
      {
        recordId: 'REC-4009',
        molecule: mName,
        product: pName,
        country: cName,
        region: rName,
        regulatoryContext: regCtx,
        stage: 'Submission',
        status: 'Filed',
        submittedOn: '04 Aug 2026',
        decisionOn: '28 Feb 2027',
        valueUsd: '38,000',
      },
      {
        recordId: 'REC-4010',
        molecule: mName,
        product: pName,
        country: cName,
        region: rName,
        regulatoryContext: regCtx,
        stage: 'CMC Update',
        status: 'Approved',
        submittedOn: '19 Aug 2026',
        decisionOn: '15 Dec 2026',
        valueUsd: '14,000',
      },
    ];
  });

  toggleCountry(country: CountryNode, event: MouseEvent): void {
    event.stopPropagation();
    country.expanded = !country.expanded;
  }

  toggleMolecule(molecule: MoleculeItem, event: MouseEvent): void {
    event.stopPropagation();
    molecule.expanded = !molecule.expanded;
  }

  selectProduct(product: ProductItem, molecule: MoleculeItem, country: CountryNode): void {
    this.selectedContext.set({ product, molecule, country });
  }

  clearSelection(): void {
    this.selectedContext.set(null);
  }
}
