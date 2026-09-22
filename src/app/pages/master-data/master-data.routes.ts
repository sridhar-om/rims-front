// src/app/pages/master-data/master-data.routes.ts
import { Routes } from '@angular/router';
import { MasterDataComponent } from './master-data.component';
import { authGuard } from '../../common/guards/auth.guard';

export const MASTER_DATA_ROUTES: Routes = [
  {
    path: '',
    component: MasterDataComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'assets',
      },
    ],
  },
];
