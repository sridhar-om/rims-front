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
        loadComponent: () =>
          import('./dashboard/dashboard.component').then((c) => c.DashboardComponent),
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('./projects/projects.component').then((c) => c.ProjectsComponent),
        data: {
          breadcrumb: 'Projects',
          description: 'Manage and track all projects in the portfolio.',
        },
      },
      {
        path: 'stages',
        loadComponent: () =>
          import('./stages/stages.component').then((c) => c.StagesComponent),
        data: {
          breadcrumb: 'Stages',
          description: 'Define and manage the stages of your project lifecycle.',
        },
      },
      {
        path: 'gates',
        loadComponent: () =>
          import('./gates/gates.component').then((c) => c.GatesComponent),
        data: {
          breadcrumb: 'Gates',
          description: 'Configure and manage project decision gates.',
        },
      },
      {
        path: 'master-data',
        loadChildren: () =>
          import('./master-data/master-data.routes').then((m) => m.MASTER_DATA_ROUTES),
        data: { fullBleed: true },
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
