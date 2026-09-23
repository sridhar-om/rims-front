// src/app/pages/setup/setup.routes.ts
import { Routes } from '@angular/router';
import { SetupComponent } from './setup.component';

export const routes: Routes = [
  {
    path: '',
    component: SetupComponent,
    data: {
      breadcrumb: 'Setup',
      description: 'Configure and manage master data, products, countries and system settings.',
    },
  },
];

export const SETUP_ROUTES = routes;
export const MASTER_DATA_ROUTES = routes;
