// src/app/pages/pages.routes.ts
import { Routes } from '@angular/router';
import { PagesComponent } from './pages.component';

export const routes: Routes = [
  {
    path: '',
    component: PagesComponent, // Renders the sidebar/header layout
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.routes').then((m) => m.routes),
      },
      {
        path: 'dossiers',
        loadComponent: () =>
          import('./dossiers/dossiers.component').then((c) => c.DossiersComponent),
        data: {
          breadcrumb: 'Dossiers',
          description: 'Submission tracking across molecules, products, countries and markets.',
        },
      },
      {
        path: 'projects',
        redirectTo: 'dossiers',
        pathMatch: 'full',
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./orders/orders.component').then((c) => c.OrdersComponent),
        data: {
          breadcrumb: 'Orders',
          description: 'Log or import order date and value by molecule, product, strength, fill volume, country and channel partner.',
        },
      },
      {
        path: 'stages',
        redirectTo: 'orders',
        pathMatch: 'full',
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./reports/reports.component').then((c) => c.ReportsComponent),
        data: {
          breadcrumb: 'Reports',
          description: 'Tabular reports related to monthly submissions, overdue report, molecule summary and traction report.',
        },
      },
      {
        path: 'gates',
        redirectTo: 'reports',
        pathMatch: 'full',
      },
      {
        path: 'setup',
        loadComponent: () =>
          import('./setup/setup.component').then((c) => c.SetupComponent),
        data: {
          breadcrumb: 'Setup',
          description: 'Configure and manage master data, products, countries and system settings.',
        },
      },
      {
        path: 'master-data',
        redirectTo: 'setup',
        pathMatch: 'full',
      },
      {
        path: 'activity',
        loadComponent: () =>
          import('./activity/activity.component').then((c) => c.ActivityComponent),
        data: {
          breadcrumb: 'Activity',
          description: 'View and track recent activities and updates.',
        },
      },
      {
        path: 'resources',
        loadComponent: () =>
          import('./resources/resources.component').then((c) => c.ResourcesComponent),
        data: {
          breadcrumb: 'Resources',
          description: 'Manage resources and information available to your projects.',
        },
      },
      {
        path: 'admin',
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'users',
          },
          {
            path: 'roles',
            loadComponent: () =>
              import('./admin/roles/roles.component').then((c) => c.RolesComponent),
            data: {
              breadcrumb: 'Roles',
              description: 'Manage system roles, assign permissions, and configure access levels.',
            },
          },
          {
            path: 'users',
            loadComponent: () =>
              import('./admin/users/users.component').then((c) => c.UsersComponent),
            data: {
              breadcrumb: 'Users',
              description: 'Manage users, permissions, roles, and administrative access.',
            },
          },
          {
            path: 'escalation-matrix',
            loadComponent: () =>
              import('./admin/esc-matrix/esc-matrix.component').then((c) => c.EscMatrixComponent),
            data: {
              breadcrumb: 'Escalation Matrix',
              description: 'Settings related to escalation are managed here.',
            },
          },
        ],
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
    ],
  },
];
