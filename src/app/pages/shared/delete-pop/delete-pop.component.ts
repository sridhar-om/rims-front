import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-delete-pop',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './delete-pop.component.html',
  styleUrl: './delete-pop.component.scss',
})
export class DeletePopComponent {
  /** Modal header title, e.g. 'Delete Role' */
  @Input() title: string = 'Delete Confirmation';

  /** Type of item being deleted, e.g. 'role', 'molecule', 'user' */
  @Input() itemType: string = '';

  /** Name of the item being deleted, e.g. 'Admin' */
  @Input() itemName: string | null | undefined = '';

  /** Custom message override if default message format is not desired */
  @Input() message: string = '';

  /** Sub-text note or warning beneath the primary message */
  @Input() subMessage: string = '';

  /** Text on the confirm button */
  @Input() confirmText: string = 'Delete';

  /** Text on the cancel button */
  @Input() cancelText: string = 'Cancel';

  /** Indicates if deletion operation is loading */
  @Input() isLoading: boolean = false;

  /** Emitted when delete button is confirmed */
  @Output() confirm = new EventEmitter<void>();

  /** Emitted when cancel button or close icon or backdrop is clicked */
  @Output() cancel = new EventEmitter<void>();

  /** Alias event for cancel/close */
  @Output() close = new EventEmitter<void>();

  onConfirm(): void {
    if (!this.isLoading) {
      this.confirm.emit();
    }
  }

  onCancel(): void {
    this.cancel.emit();
    this.close.emit();
  }
}
