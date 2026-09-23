import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { OrderRecord } from '../orders.component';

@Component({
  selector: 'app-orders-pop',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule],
  templateUrl: './orders-pop.component.html',
  styleUrl: './orders-pop.component.scss',
})
export class OrdersPopComponent {
  @Input() order: Partial<OrderRecord> = {};
  @Output() save = new EventEmitter<Partial<OrderRecord>>();
  @Output() cancel = new EventEmitter<void>();

  onCancel(): void {
    this.cancel.emit();
  }

  onSave(): void {
    this.save.emit(this.order);
  }
}
