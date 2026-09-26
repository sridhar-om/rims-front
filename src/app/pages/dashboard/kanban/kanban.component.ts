import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, signal, ViewChild, ElementRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DashboardComponent } from '../dashboard.component';
import { GridScrollerComponent } from '../../shared/grid-scroller/grid-scroller.component';

export interface KanbanCard {
  id: string;
  title: string;
  molecule: string;
  country: string;
  region: string;
  regulatoryContext: string;
  assignee: string;
  date: string;
  status: 'Logged' | 'Submitted' | 'Filed' | 'Approved' | 'Not Approved' | 'Hold';
}

export interface KanbanColumnDef {
  id: string;
  name: 'Logged' | 'Submitted' | 'Filed' | 'Approved' | 'Not Approved' | 'Hold';
  dotColor: string;
}

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule, GridScrollerComponent],
  templateUrl: './kanban.component.html',
  styleUrl: './kanban.component.scss',
})
export class KanbanComponent {
  @ViewChild('boardContainer') boardContainer!: ElementRef<HTMLDivElement>;

  private readonly dashboard = inject(DashboardComponent, { optional: true });

  // Horizontal board scrolling
  scrollLeft(): void {
    if (this.boardContainer?.nativeElement) {
      this.boardContainer.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }

  scrollRight(): void {
    if (this.boardContainer?.nativeElement) {
      this.boardContainer.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }

  updateScrollState(): void {}

  readonly filterMolecule = input<string>('All molecule');
  readonly filterProduct = input<string>('All product');
  readonly filterCountry = input<string>('All country');
  readonly filterRegion = input<string>('All region');
  readonly filterRegulatoryContext = input<string>('All regulatory context');

  readonly columnDefs: KanbanColumnDef[] = [
    { id: 'logged', name: 'Logged', dotColor: '#475569' },
    { id: 'submitted', name: 'Submitted', dotColor: '#f59e0b' },
    { id: 'filed', name: 'Filed', dotColor: '#0284c7' },
    { id: 'approved', name: 'Approved', dotColor: '#10b981' },
    { id: 'not_approved', name: 'Not Approved', dotColor: '#ef4444' },
    { id: 'hold', name: 'Hold', dotColor: '#8b5cf6' },
  ];

  readonly allCards = signal<KanbanCard[]>([
    {
      id: 'SUB-2101',
      title: 'Enoxalow 40 mg',
      molecule: 'Enoxaparin Sodium',
      country: 'Spain',
      region: 'Europe',
      regulatoryContext: 'Highly Regulated',
      assignee: 'Priya Nair',
      date: '18 Sept 2026',
      status: 'Logged',
    },
    {
      id: 'SUB-2102',
      title: 'Onsetra 8 mg',
      molecule: 'Ondansetron',
      country: 'Mexico',
      region: 'Latin America',
      regulatoryContext: 'Semi Regulated',
      assignee: 'Sara Khan',
      date: '16 Sept 2026',
      status: 'Logged',
    },
    {
      id: 'SUB-2103',
      title: 'Ceftrimax 1 g',
      molecule: 'Ceftriaxone',
      country: 'Kenya',
      region: 'Africa',
      regulatoryContext: 'Lightly Regulated',
      assignee: 'Arun Mehta',
      date: '12 Sept 2026',
      status: 'Submitted',
    },
    {
      id: 'SUB-2104',
      title: 'Iolexa Inject 350',
      molecule: 'Iohexol',
      country: 'Japan',
      region: 'Asia Pacific',
      regulatoryContext: 'Highly Regulated',
      assignee: 'Regulatory Ops',
      date: '09 Sept 2026',
      status: 'Submitted',
    },
    {
      id: 'SUB-2112',
      title: 'Metfosure 500 XR',
      molecule: 'Metformin HCl',
      country: 'Australia',
      region: 'Asia Pacific',
      regulatoryContext: 'Highly Regulated',
      assignee: 'Priya Nair',
      date: '15 Sept 2026',
      status: 'Submitted',
    },
    {
      id: 'SUB-2105',
      title: 'Enoxalow 60 mg',
      molecule: 'Enoxaparin Sodium',
      country: 'Germany',
      region: 'Europe',
      regulatoryContext: 'Highly Regulated',
      assignee: 'Priya Nair',
      date: '30 Aug 2026',
      status: 'Filed',
    },
    {
      id: 'SUB-2106',
      title: 'Atorvex 20 mg',
      molecule: 'Atorvastatin',
      country: 'Poland',
      region: 'Europe',
      regulatoryContext: 'Semi Regulated',
      assignee: 'Regulatory Ops',
      date: '24 Aug 2026',
      status: 'Filed',
    },
    {
      id: 'SUB-2107',
      title: 'Metfosure 1000 XR',
      molecule: 'Metformin HCl',
      country: 'India',
      region: 'Asia Pacific',
      regulatoryContext: 'Semi Regulated',
      assignee: 'Arun Mehta',
      date: '28 Aug 2026',
      status: 'Approved',
    },
    {
      id: 'SUB-2108',
      title: 'Atorvex 10 mg',
      molecule: 'Atorvastatin',
      country: 'United States',
      region: 'North America',
      regulatoryContext: 'Highly Regulated',
      assignee: 'Sara Khan',
      date: '19 Aug 2026',
      status: 'Approved',
    },
    {
      id: 'SUB-2109',
      title: 'Ceftrimax 500 mg',
      molecule: 'Ceftriaxone',
      country: 'Nigeria',
      region: 'Africa',
      regulatoryContext: 'Lightly Regulated',
      assignee: 'Arun Mehta',
      date: '22 Jul 2026',
      status: 'Not Approved',
    },
    {
      id: 'SUB-2110',
      title: 'Onsetra 4 mg',
      molecule: 'Ondansetron',
      country: 'Brazil',
      region: 'Latin America',
      regulatoryContext: 'Semi Regulated',
      assignee: 'Commercial Team',
      date: '02 Sept 2026',
      status: 'Hold',
    },
    {
      id: 'SUB-2111',
      title: 'Iolexa Inject 300',
      molecule: 'Iohexol',
      country: 'Saudi Arabia',
      region: 'Middle East',
      regulatoryContext: 'Semi Regulated',
      assignee: 'Regulatory Ops',
      date: '14 Aug 2026',
      status: 'Hold',
    },
  ]);

  private draggedCard: KanbanCard | null = null;

  filteredCards = computed(() => {
    let list = this.allCards();
    const mol = this.dashboard ? this.dashboard.filterMolecule() : this.filterMolecule();
    const country = this.dashboard ? this.dashboard.filterCountry() : this.filterCountry();
    const region = this.dashboard ? this.dashboard.filterRegion() : this.filterRegion();
    const regContext = this.dashboard ? this.dashboard.filterRegulatoryContext() : this.filterRegulatoryContext();

    if (mol && mol !== 'All molecule') {
      list = list.filter((c) => c.molecule.toLowerCase().includes(mol.toLowerCase()));
    }
    if (country && country !== 'All country') {
      list = list.filter((c) => c.country.toLowerCase() === country.toLowerCase());
    }
    if (region && region !== 'All region') {
      list = list.filter((c) => c.region.toLowerCase() === region.toLowerCase());
    }
    if (regContext && regContext !== 'All regulatory context') {
      list = list.filter((c) => c.regulatoryContext.toLowerCase().includes(regContext.toLowerCase()));
    }
    return list;
  });

  columns = computed(() => {
    const list = this.filteredCards();
    return this.columnDefs.map((col) => ({
      ...col,
      cards: list.filter((c) => c.status === col.name),
    }));
  });

  onDragStart(card: KanbanCard): void {
    this.draggedCard = card;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(newStatus: 'Logged' | 'Submitted' | 'Filed' | 'Approved' | 'Not Approved' | 'Hold'): void {
    if (!this.draggedCard || this.draggedCard.status === newStatus) {
      this.draggedCard = null;
      return;
    }
    const cardId = this.draggedCard.id;
    this.allCards.update((cards) =>
      cards.map((c) => (c.id === cardId ? { ...c, status: newStatus } : c))
    );
    this.draggedCard = null;
  }
}
