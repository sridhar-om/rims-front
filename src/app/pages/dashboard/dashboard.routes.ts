import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'portfolio',
      },
      {
        path: 'portfolio',
        loadComponent: () =>
          import('./portfolio/portfolio.component').then((c) => c.PortfolioComponent),
      },
      {
        path: 'kanban',
        loadComponent: () =>
          import('./kanban/kanban.component').then((c) => c.KanbanComponent),
      },
      {
        path: 'calendar',
        loadComponent: () =>
          import('./calendar/calendar.component').then((c) => c.CalendarComponent),
      },
      {
        path: 'map',
        loadComponent: () =>
          import('./map/map.component').then((c) => c.MapComponent),
      },
      {
        path: 'tree',
        loadComponent: () =>
          import('./tree/tree.component').then((c) => c.TreeComponent),
      },
      {
        path: 'alerts',
        loadComponent: () =>
          import('./alerts/alerts.component').then((c) => c.AlertsComponent),
      },
      {
        path: 'pipeline',
        loadComponent: () =>
          import('./pipeline/pipeline.component').then((c) => c.PipelineComponent),
      },
      {
        path: 'approval',
        loadComponent: () =>
          import('./approval/approval.component').then((c) => c.ApprovalComponent),
      },
    ],
  },
];

export const DASHBOARD_ROUTES = routes;
