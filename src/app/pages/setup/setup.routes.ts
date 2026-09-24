// src/app/pages/setup/setup.routes.ts
import { Routes } from '@angular/router';
import { SetupComponent } from './setup.component';

export const routes: Routes = [
  {
    path: '',
    component: SetupComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'country',
      },
      {
        path: 'country',
        loadComponent: () =>
          import('./country/country.component').then((c) => c.CountryComponent),
        data: {
          breadcrumb: 'Country',
          description: 'Manage countries master data.',
        },
      },
      {
        path: 'region',
        loadComponent: () =>
          import('./region/region.component').then((c) => c.RegionComponent),
        data: {
          breadcrumb: 'Region',
          description: 'Manage regions master data.',
        },
      },
      {
        path: 'market',
        loadComponent: () =>
          import('./market/market.component').then((c) => c.MarketComponent),
        data: {
          breadcrumb: 'Market',
          description: 'Manage markets master data.',
        },
      },
      {
        path: 'molecule',
        loadComponent: () =>
          import('./molecule/molecule.component').then((c) => c.MoleculeComponent),
        data: {
          breadcrumb: 'Molecule',
          description: 'Manage molecules master data.',
        },
      },
      {
        path: 'product',
        loadComponent: () =>
          import('./product/product.component').then((c) => c.ProductComponent),
        data: {
          breadcrumb: 'Product',
          description: 'Manage products master data.',
        },
      },
      {
        path: 'dosage',
        loadComponent: () =>
          import('./dosage/dosage.component').then((c) => c.DosageComponent),
        data: {
          breadcrumb: 'Dosage',
          description: 'Manage dosage forms master data.',
        },
      },
      {
        path: 'strength',
        loadComponent: () =>
          import('./strength/strength.component').then((c) => c.StrengthComponent),
        data: {
          breadcrumb: 'Strength',
          description: 'Manage strength master data.',
        },
      },
      {
        path: 'fill-vol',
        loadComponent: () =>
          import('./fill-vol/fill-vol.component').then((c) => c.FillVolComponent),
        data: {
          breadcrumb: 'Fill Volume',
          description: 'Manage fill volume master data.',
        },
      },
      {
        path: 'type-pack',
        loadComponent: () =>
          import('./type-pack/type-pack.component').then((c) => c.TypePackComponent),
        data: {
          breadcrumb: 'Type of Pack',
          description: 'Manage packaging types master data.',
        },
      },
      {
        path: 'brand',
        loadComponent: () =>
          import('./brand/brand.component').then((c) => c.BrandComponent),
        data: {
          breadcrumb: 'Brand',
          description: 'Manage brands master data.',
        },
      },
      {
        path: 'api-hldr',
        loadComponent: () =>
          import('./api-hldr/api-hldr.component').then((c) => c.ApiHldrComponent),
        data: {
          breadcrumb: 'API Holder',
          description: 'Manage API holders master data.',
        },
      },
      {
        path: 'client',
        loadComponent: () =>
          import('./client/client.component').then((c) => c.ClientComponent),
        data: {
          breadcrumb: 'Client',
          description: 'Manage clients master data.',
        },
      },
      {
        path: 'ra-rspnsbl',
        loadComponent: () =>
          import('./ra-rspnsbl/ra-rspnsbl.component').then((c) => c.RaRspnsblComponent),
        data: {
          breadcrumb: 'RA Responsible',
          description: 'Manage RA responsible persons.',
        },
      },
      {
        path: 'bd-rspnsbl',
        loadComponent: () =>
          import('./bd-rspnsbl/bd-rspnsbl.component').then((c) => c.BdRspnsblComponent),
        data: {
          breadcrumb: 'BD Responsible',
          description: 'Manage BD responsible persons.',
        },
      },
      {
        path: 'moh-rfi-one-status',
        loadComponent: () =>
          import('./moh-rfi-one-status/moh-rfi-one-status.component').then(
            (c) => c.MohRfiOneStatusComponent
          ),
        data: {
          breadcrumb: 'MOH RFI 1 Status',
          description: 'Manage MOH RFI 1 Status settings.',
        },
      },
      {
        path: 'moh-rfi-two-status',
        loadComponent: () =>
          import('./moh-rfi-two-status/moh-rfi-two-status.component').then(
            (c) => c.MohRfiTwoStatusComponent
          ),
        data: {
          breadcrumb: 'MOH RFI 2 Status',
          description: 'Manage MOH RFI 2 Status settings.',
        },
      },
      {
        path: 'variation',
        loadComponent: () =>
          import('./variation/variation.component').then(
            (c) => c.VariationComponent
          ),
        data: {
          breadcrumb: 'Variation',
          description: 'Manage Variation settings.',
        },
      },
    ],
  },
];

export const SETUP_ROUTES = routes;
export const MASTER_DATA_ROUTES = routes;
