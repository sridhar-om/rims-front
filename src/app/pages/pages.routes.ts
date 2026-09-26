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
        data: {
          breadcrumb: 'Dashboard',
          description: 'Dashboard page description.',
        },
      },
      {
        path: 'pipeline-projects',
        loadComponent: () =>
          import('./pipeline-projects/pipeline-projects.component').then(
            (c) => c.PipelineProjectsComponent
          ),
        data: {
          breadcrumb: 'Pipeline Projects',
          description: 'Track and manage pipeline projects.',
        },
      },
      {
        path: 'eb-completed-projects',
        loadComponent: () =>
          import('./eb-completed-projects/eb-completed-projects.component').then(
            (c) => c.EbCompletedProjectsComponent
          ),
        data: {
          breadcrumb: 'EB completed projects',
          description: 'Review and manage completed EB projects.',
        },
      },
      {
        path: 'bd-requests',
        loadComponent: () =>
          import('./bd-requests/bd-requests.component').then(
            (c) => c.BdRequestsComponent
          ),
        data: {
          breadcrumb: 'BD Requests',
          description: 'Business development requests and tracking.',
        },
      },
      {
        path: 'ra-submission-status',
        loadComponent: () =>
          import('./ra-submission-status/ra-submission-status.component').then(
            (c) => c.RaSubmissionStatusComponent
          ),
        data: {
          breadcrumb: 'RA Submission Status',
          description: 'Regulatory affairs submission tracking and status.',
        },
      },
      {
        path: 'approved-data-sharing',
        loadComponent: () =>
          import('./approved-data-sharing/approved-data-sharing.component').then(
            (c) => c.ApprovedDataSharingComponent
          ),
        data: {
          breadcrumb: 'Approved Data Sharing',
          description: 'Approved data sharing records and governance.',
        },
      },
      {
        path: 'commercial-status',
        loadComponent: () =>
          import('./commercial-status/commercial-status.component').then(
            (c) => c.CommercialStatusComponent
          ),
        data: {
          breadcrumb: 'Commercial Status',
          description: 'Commercialization status and market tracking.',
        },
      },
      {
        path: 'market-complaints',
        loadComponent: () =>
          import('./market-complaints/market-complaints.component').then(
            (c) => c.MarketComplaintsComponent
          ),
        data: {
          breadcrumb: 'Market Complaints',
          description: 'Track and resolve market complaints.',
        },
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
        loadChildren: () =>
          import('./setup/setup.routes').then((m) => m.SETUP_ROUTES),
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
