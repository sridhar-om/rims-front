import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { RoleData, RolePopComponent } from './role-pop/role-pop.component';
import { DeletePopComponent } from '../../shared/delete-pop/delete-pop.component';
import { PaginatorComponent } from '../../shared/paginator/paginator.component';

export interface RoleRow {
  id: number;
  roleName: string;
  description?: string;
  usersCount: number;
  totalUsers: number;
  permissionCount: number;
  totalPermissionCount: number;
}

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    RolePopComponent,
    DeletePopComponent,
    PaginatorComponent,
  ],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss',
})
export class RolesComponent implements OnInit {
  // Filter toggle & signals
  filterToggle = signal<boolean>(false);
  filterKeyword = signal<string>('');
  filterRole = signal<string>('All');

  // Modal controls
  showRoleModal = signal<boolean>(false);
  selectedRoleForEdit = signal<RoleRow | null>(null);

  showDeleteConfirmModal = signal<boolean>(false);
  deleteTargetRole = signal<RoleRow | null>(null);

  // Pagination
  pageSize = signal<number>(10);
  currentPage = signal<number>(1);

  // Initial Roles Data (matching Screenshot)
  roles = signal<RoleRow[]>([
    {
      id: 1,
      roleName: 'Admin',
      description: 'Full system privileges across all modules, configurations, and user administration.',
      usersCount: 11,
      totalUsers: 59,
      permissionCount: 35,
      totalPermissionCount: 35,
    },
    {
      id: 2,
      roleName: 'Manager',
      description: 'Supervises workflows, approves project schedules, and exports facility reports.',
      usersCount: 12,
      totalUsers: 59,
      permissionCount: 35,
      totalPermissionCount: 35,
    },
    {
      id: 3,
      roleName: 'Sales Head',
      description: 'Commercial client coordination, parts requisitions, and dispatch orders.',
      usersCount: 31,
      totalUsers: 59,
      permissionCount: 35,
      totalPermissionCount: 35,
    },
    {
      id: 4,
      roleName: 'Shift Engineer',
      description: 'Executes maintenance, logs issues, and updates checklist items.',
      usersCount: 14,
      totalUsers: 59,
      permissionCount: 28,
      totalPermissionCount: 35,
    },
    {
      id: 5,
      roleName: 'Plant Operator',
      description: 'Logs operational incidents and performs daily inspections.',
      usersCount: 32,
      totalUsers: 59,
      permissionCount: 12,
      totalPermissionCount: 35,
    },
    {
      id: 6,
      roleName: 'Safety & EHS Officer',
      description: 'Oversees safety compliance, incident escalations, and permit approvals.',
      usersCount: 2,
      totalUsers: 59,
      permissionCount: 24,
      totalPermissionCount: 35,
    },
    {
      id: 7,
      roleName: 'Maintenance Technician',
      description: 'Executes corrective work orders, conducts inspections, and logs maintenance.',
      usersCount: 18,
      totalUsers: 59,
      permissionCount: 16,
      totalPermissionCount: 35,
    },
    {
      id: 8,
      roleName: 'Quality Control Inspector',
      description: 'Verifies calibration records, audits compliance, and signs off quality checklists.',
      usersCount: 6,
      totalUsers: 59,
      permissionCount: 22,
      totalPermissionCount: 35,
    },
    {
      id: 9,
      roleName: 'Inventory Manager',
      description: 'Oversees inventory items, logs material requisitions, and tracks order cycles.',
      usersCount: 8,
      totalUsers: 59,
      permissionCount: 20,
      totalPermissionCount: 35,
    },
    {
      id: 10,
      roleName: 'Automation Engineer',
      description: 'Configures telemetry sensors, supervises logic, and monitors predictive alarms.',
      usersCount: 5,
      totalUsers: 59,
      permissionCount: 26,
      totalPermissionCount: 35,
    },
  ]);

  // Unique roles list for filter dropdown
  rolesList = computed(() => {
    return this.roles().map((r) => r.roleName);
  });

  // Filtered roles computation
  filteredRoles = computed(() => {
    let result = this.roles();
    const kw = this.filterKeyword().toLowerCase().trim();
    const rFilter = this.filterRole();

    if (kw) {
      result = result.filter(
        (r) =>
          r.roleName.toLowerCase().includes(kw) ||
          (r.description && r.description.toLowerCase().includes(kw))
      );
    }

    if (rFilter && rFilter !== 'All') {
      result = result.filter((r) => r.roleName === rFilter);
    }

    return result;
  });

  ngOnInit(): void { }

  toggleFilter(): void {
    this.filterToggle.update((v) => !v);
  }

  clearFilter(): void {
    this.filterKeyword.set('');
    this.filterRole.set('All');
  }

  openAddRole(): void {
    this.selectedRoleForEdit.set(null);
    this.showRoleModal.set(true);
  }

  openEditRole(role: RoleRow): void {
    this.selectedRoleForEdit.set(role);
    this.showRoleModal.set(true);
  }

  onSaveRole(data: RoleData): void {
    if (this.selectedRoleForEdit()) {
      const editId = this.selectedRoleForEdit()!.id;
      this.roles.update((list) =>
        list.map((r) =>
          r.id === editId
            ? {
              ...r,
              roleName: data.roleName,
              description: data.description,
            }
            : r
        )
      );
    } else {
      const newRole: RoleRow = {
        id: Date.now(),
        roleName: data.roleName,
        description: data.description,
        usersCount: 0,
        totalUsers: 59,
        permissionCount: 35,
        totalPermissionCount: 35,
      };
      this.roles.update((list) => [...list, newRole]);
    }
    this.showRoleModal.set(false);
    this.selectedRoleForEdit.set(null);
  }

  closeRoleModal(): void {
    this.showRoleModal.set(false);
    this.selectedRoleForEdit.set(null);
  }

  confirmDelete(role: RoleRow): void {
    this.deleteTargetRole.set(role);
    this.showDeleteConfirmModal.set(true);
  }

  executeDelete(): void {
    const target = this.deleteTargetRole();
    if (target) {
      this.roles.update((list) => list.filter((r) => r.id !== target.id));
    }
    this.showDeleteConfirmModal.set(false);
    this.deleteTargetRole.set(null);
  }

  closeDeleteModal(): void {
    this.showDeleteConfirmModal.set(false);
    this.deleteTargetRole.set(null);
  }
}
