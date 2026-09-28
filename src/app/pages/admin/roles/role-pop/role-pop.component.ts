import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface RoleData {
  id?: number;
  roleName: string;
  description?: string;
  usersCount?: number;
  totalUsers?: number;
  permissionCount?: number;
  totalPermissionCount?: number;
}

@Component({
  selector: 'app-role-pop',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule],
  templateUrl: './role-pop.component.html',
  styleUrl: './role-pop.component.scss',
})
export class RolePopComponent implements OnInit {
  @Input() isOpen: boolean = true;
  @Input() roleData: RoleData | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<RoleData>();

  roleName: string = '';
  description: string = '';

  ngOnInit(): void {
    if (this.roleData) {
      this.roleName = this.roleData.roleName || '';
      this.description = this.roleData.description || '';
    }
  }

  get isValid(): boolean {
    return !!this.roleName?.trim();
  }

  onSave(): void {
    if (!this.isValid) {
      alert('Please enter a role name.');
      return;
    }

    const payload: RoleData = {
      ...(this.roleData ? this.roleData : {}),
      roleName: this.roleName.trim(),
      description: this.description.trim(),
    };

    this.save.emit(payload);
  }

  onClose(): void {
    this.close.emit();
  }
}
