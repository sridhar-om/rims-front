import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface OrderRecord {
  orderId: string;
  orderDate: string;
  molecule: string;
  product: string;
  strength: string;
  fillVolume: string;
  country: string;
  channelPartner: string;
  channel: 'Distributor' | 'Institutional' | 'Direct Tender' | 'Retail' | 'Hospital Tender';
  quantity: number;
  currency: 'USD' | 'EUR' | 'GBP';
  orderValue: number;
  source: 'Imported' | 'Logged';
}

import { OrdersPopComponent } from './orders-pop/orders-pop.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    MatTooltipModule,
    OrdersPopComponent,
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent {
  // Search query
  readonly searchTerm = signal<string>('');

  // Pagination state (default page size 10)
  readonly pageSize = signal<number>(10);
  readonly pageIndex = signal<number>(0);
  readonly pageSizeOptions = [5, 10, 15, 20];

  // Add Order modal
  readonly isAddModalOpen = signal<boolean>(false);

  // New Order model
  newOrder: Partial<OrderRecord> = {
    orderId: '',
    orderDate: '23 Sept 2026',
    molecule: '',
    product: '',
    strength: '20 mg',
    fillVolume: 'N/A(tablet)',
    country: 'United States',
    channelPartner: '',
    channel: 'Distributor',
    quantity: 50000,
    currency: 'USD',
    orderValue: 120000,
    source: 'Logged',
  };

  // 15 comprehensive orders records including the 6 from the screenshot
  readonly allOrders = signal<OrderRecord[]>([
    {
      orderId: 'ORD-3301',
      orderDate: '02 Sept 2026',
      molecule: 'Atorvastatin',
      product: 'Atorvex',
      strength: '20 mg',
      fillVolume: 'N/A(tablet)',
      country: 'United States',
      channelPartner: 'MedSource Distribution',
      channel: 'Distributor',
      quantity: 120000,
      currency: 'USD',
      orderValue: 348000,
      source: 'Imported',
    },
    {
      orderId: 'ORD-3302',
      orderDate: '24 Aug 2026',
      molecule: 'Ceftriaxone',
      product: 'Ceftrimax',
      strength: '1 g',
      fillVolume: '10 mL vial',
      country: 'Kenya',
      channelPartner: 'Sahara Medical Group',
      channel: 'Institutional',
      quantity: 42000,
      currency: 'USD',
      orderValue: 96600,
      source: 'Logged',
    },
    {
      orderId: 'ORD-3303',
      orderDate: '11 Sept 2026',
      molecule: 'Enoxaparin Sodium',
      product: 'Enoxalow',
      strength: '40 mg/0.4 mL',
      fillVolume: '0.4 mL',
      country: 'Germany',
      channelPartner: 'Nordic Health Supply',
      channel: 'Direct Tender',
      quantity: 18500,
      currency: 'EUR',
      orderValue: 231250,
      source: 'Imported',
    },
    {
      orderId: 'ORD-3304',
      orderDate: '30 Jul 2026',
      molecule: 'Ondansetron',
      product: 'Onsetra',
      strength: '8 mg/4 mL',
      fillVolume: '4 mL ampoule',
      country: 'Brazil',
      channelPartner: 'Andes Pharma Trading',
      channel: 'Distributor',
      quantity: 65000,
      currency: 'USD',
      orderValue: 84500,
      source: 'Logged',
    },
    {
      orderId: 'ORD-3305',
      orderDate: '16 Sept 2026',
      molecule: 'Iohexol',
      product: 'Iohexa Inject',
      strength: '350 mg I/mL',
      fillVolume: '100 mL',
      country: 'Japan',
      channelPartner: 'Pacific Care Partners',
      channel: 'Institutional',
      quantity: 9800,
      currency: 'USD',
      orderValue: 156800,
      source: 'Imported',
    },
    {
      orderId: 'ORD-3306',
      orderDate: '19 Jun 2026',
      molecule: 'Metformin HCl',
      product: 'Metfosure XR',
      strength: '1000 mg',
      fillVolume: 'N/A(tablet)',
      country: 'India',
      channelPartner: 'PharmaLink Global',
      channel: 'Retail',
      quantity: 250000,
      currency: 'USD',
      orderValue: 112500,
      source: 'Logged',
    },
    {
      orderId: 'ORD-3307',
      orderDate: '05 Aug 2026',
      molecule: 'Amlodipine Besylate',
      product: 'Amlonorm',
      strength: '5 mg',
      fillVolume: 'N/A(tablet)',
      country: 'United Kingdom',
      channelPartner: 'Apex Healthcare UK',
      channel: 'Direct Tender',
      quantity: 85000,
      currency: 'GBP',
      orderValue: 142000,
      source: 'Imported',
    },
    {
      orderId: 'ORD-3308',
      orderDate: '14 Sept 2026',
      molecule: 'Pantoprazole',
      product: 'Pantoplus',
      strength: '40 mg',
      fillVolume: 'N/A(tablet)',
      country: 'Canada',
      channelPartner: 'Maple Leaf Therapeutics',
      channel: 'Distributor',
      quantity: 95000,
      currency: 'USD',
      orderValue: 185000,
      source: 'Logged',
    },
    {
      orderId: 'ORD-3309',
      orderDate: '28 Aug 2026',
      molecule: 'Rosuvastatin',
      product: 'Rosuvid',
      strength: '10 mg',
      fillVolume: 'N/A(tablet)',
      country: 'France',
      channelPartner: 'EuroHealth Alliance',
      channel: 'Institutional',
      quantity: 110000,
      currency: 'EUR',
      orderValue: 198000,
      source: 'Imported',
    },
    {
      orderId: 'ORD-3310',
      orderDate: '10 Jul 2026',
      molecule: 'Levofloxacin',
      product: 'Levoquin',
      strength: '500 mg',
      fillVolume: '100 mL infusion',
      country: 'South Africa',
      channelPartner: 'Cape Medical Logistics',
      channel: 'Hospital Tender',
      quantity: 34000,
      currency: 'USD',
      orderValue: 125000,
      source: 'Logged',
    },
    {
      orderId: 'ORD-3311',
      orderDate: '22 Aug 2026',
      molecule: 'Azithromycin',
      product: 'Azithrocin',
      strength: '250 mg',
      fillVolume: 'N/A(suspension)',
      country: 'Australia',
      channelPartner: 'Southern Cross Pharma',
      channel: 'Retail',
      quantity: 75000,
      currency: 'USD',
      orderValue: 168000,
      source: 'Imported',
    },
    {
      orderId: 'ORD-3312',
      orderDate: '18 Sept 2026',
      molecule: 'Paracetamol',
      product: 'Paramol',
      strength: '650 mg',
      fillVolume: 'N/A(tablet)',
      country: 'Spain',
      channelPartner: 'Iberia Pharma Net',
      channel: 'Distributor',
      quantity: 300000,
      currency: 'EUR',
      orderValue: 95000,
      source: 'Logged',
    },
    {
      orderId: 'ORD-3313',
      orderDate: '01 Sept 2026',
      molecule: 'Ibuprofen',
      product: 'Ibuact',
      strength: '400 mg',
      fillVolume: 'N/A(tablet)',
      country: 'Mexico',
      channelPartner: 'LatAm Farmaceutica',
      channel: 'Institutional',
      quantity: 140000,
      currency: 'USD',
      orderValue: 110000,
      source: 'Imported',
    },
    {
      orderId: 'ORD-3314',
      orderDate: '12 Aug 2026',
      molecule: 'Omeprazole',
      product: 'Omezest',
      strength: '20 mg',
      fillVolume: 'N/A(capsule)',
      country: 'Saudi Arabia',
      channelPartner: 'Gulf Medical Distribution',
      channel: 'Direct Tender',
      quantity: 80000,
      currency: 'USD',
      orderValue: 175000,
      source: 'Logged',
    },
    {
      orderId: 'ORD-3315',
      orderDate: '08 Sept 2026',
      molecule: 'Clopidogrel',
      product: 'Clopifast',
      strength: '75 mg',
      fillVolume: 'N/A(tablet)',
      country: 'Vietnam',
      channelPartner: 'Mekong Health Corp',
      channel: 'Distributor',
      quantity: 90000,
      currency: 'USD',
      orderValue: 135000,
      source: 'Imported',
    },
  ]);

  // Filtered orders based on search query
  readonly filteredOrders = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) {
      return this.allOrders();
    }
    return this.allOrders().filter(
      (o) =>
        o.orderId.toLowerCase().includes(term) ||
        o.molecule.toLowerCase().includes(term) ||
        o.product.toLowerCase().includes(term) ||
        o.country.toLowerCase().includes(term) ||
        o.channelPartner.toLowerCase().includes(term) ||
        o.channel.toLowerCase().includes(term) ||
        o.source.toLowerCase().includes(term) ||
        o.strength.toLowerCase().includes(term)
    );
  });

  // Paginated records
  readonly paginatedOrders = computed(() => {
    const list = this.filteredOrders();
    const start = this.pageIndex() * this.pageSize();
    return list.slice(start, start + this.pageSize());
  });

  // Formatted total order value
  readonly totalValueFormatted = computed(() => {
    const total = this.filteredOrders().reduce((sum, o) => sum + o.orderValue, 0);
    return total.toLocaleString('en-US');
  });

  onSearch(term: string): void {
    this.searchTerm.set(term);
    this.pageIndex.set(0);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  formatQuantity(val: number): string {
    return val.toLocaleString('en-US');
  }

  formatValue(currency: string, val: number): string {
    return `${currency} ${val.toLocaleString('en-US')}`;
  }

  openAddModal(): void {
    const nextNum = 3301 + this.allOrders().length;
    this.newOrder = {
      orderId: `ORD-${nextNum}`,
      orderDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      molecule: '',
      product: '',
      strength: '20 mg',
      fillVolume: 'N/A(tablet)',
      country: 'United States',
      channelPartner: '',
      channel: 'Distributor',
      quantity: 50000,
      currency: 'USD',
      orderValue: 120000,
      source: 'Logged',
    };
    this.isAddModalOpen.set(true);
  }

  closeAddModal(): void {
    this.isAddModalOpen.set(false);
  }

  saveOrder(data?: Partial<OrderRecord>): void {
    const input = data || this.newOrder;
    if (!input.molecule || !input.product || !input.country || !input.channelPartner) {
      return;
    }
    const order: OrderRecord = {
      orderId: input.orderId || `ORD-${3301 + this.allOrders().length}`,
      orderDate: input.orderDate || 'Today',
      molecule: input.molecule,
      product: input.product,
      strength: input.strength || '20 mg',
      fillVolume: input.fillVolume || 'N/A(tablet)',
      country: input.country,
      channelPartner: input.channelPartner,
      channel: (input.channel as any) || 'Distributor',
      quantity: Number(input.quantity) || 10000,
      currency: (input.currency as any) || 'USD',
      orderValue: Number(input.orderValue) || 50000,
      source: (input.source as any) || 'Logged',
    };

    this.allOrders.update((list) => [order, ...list]);
    this.closeAddModal();
  }
}
