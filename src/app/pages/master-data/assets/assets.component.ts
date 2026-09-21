import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';

import {
  PageEvent,
  MatPaginatorModule
} from '@angular/material/paginator';

import { MatIconModule } from '@angular/material/icon';

import { MatTooltipModule } from '@angular/material/tooltip';

import { MatFormFieldModule } from '@angular/material/form-field';

import { MatInputModule } from '@angular/material/input';

import { MatSelectModule } from '@angular/material/select';

import { MatCardModule } from '@angular/material/card';


interface Asset {
  name: string;
  code: string;
  status: 'Active' | 'Inactive';
}


@Component({
  selector: 'app-assets',

  standalone: true,

  imports: [

    FormsModule,

    MatPaginatorModule,

    MatIconModule,

    MatTooltipModule,

    MatFormFieldModule,

    MatInputModule,

    MatSelectModule,

    MatCardModule

  ],

  templateUrl: './assets.component.html',

  styleUrl: './assets.component.scss'

})


export class AssetsComponent {


  readonly assets: Asset[] = [

    {
      name: 'Tablet Compression Machine',
      code: 'AST-1001',
      status: 'Active'
    },

    {
      name: 'Dissolution Testing Apparatus',
      code: 'AST-1002',
      status: 'Active'
    },

    {
      name: 'HPLC System',
      code: 'AST-1003',
      status: 'Active'
    },

    {
      name: 'Tablet Hardness Tester',
      code: 'AST-1004',
      status: 'Active'
    },

    {
      name: 'Friability Tester',
      code: 'AST-1005',
      status: 'Active'
    },

    {
      name: 'Stability Chamber',
      code: 'AST-1006',
      status: 'Active'
    }

  ];


  showFilter = false;

  keyword = '';

  status = '';

  searchKeyword = '';

  searchStatus = '';


  pageIndex = 0;

  pageSize = 10;


  get filteredAssets(): Asset[] {

    return this.assets.filter(asset => {

      const keywordMatches =
        !this.searchKeyword ||
        asset.name
          .toLowerCase()
          .includes(this.searchKeyword.toLowerCase()) ||
        asset.code
          .toLowerCase()
          .includes(this.searchKeyword.toLowerCase());


      const statusMatches =
        !this.searchStatus ||
        asset.status === this.searchStatus;


      return keywordMatches && statusMatches;

    });

  }


  get paginatedAssets(): Asset[] {

    const startIndex =
      this.pageIndex * this.pageSize;


    return this.filteredAssets.slice(
      startIndex,
      startIndex + this.pageSize
    );

  }


  toggleFilter(): void {

    this.showFilter = !this.showFilter;

  }


  onSearch(): void {

    this.searchKeyword =
      this.keyword.trim();

    this.searchStatus =
      this.status;

    this.pageIndex = 0;

  }


  onClear(): void {

    this.keyword = '';

    this.status = '';

    this.searchKeyword = '';

    this.searchStatus = '';

    this.pageIndex = 0;

  }


  onAdd(): void {

    console.log('Add Asset clicked');

  }


  handlePage(
    event: PageEvent
  ): void {

    this.pageIndex =
      event.pageIndex;

    this.pageSize =
      event.pageSize;

  }


  onEdit(
    asset: Asset
  ): void {

    console.log(
      'Edit asset:',
      asset
    );

  }


  onDelete(
    asset: Asset
  ): void {

    console.log(
      'Delete asset:',
      asset
    );

  }


  onStatusChange(
    asset: Asset
  ): void {

    console.log(
      'Change status:',
      asset
    );

  }

}
