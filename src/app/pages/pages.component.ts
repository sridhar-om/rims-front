import {
  Component,
  ElementRef,
  AfterViewInit,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Settings, SettingsService } from '../services/settings.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { UserMenuComponent } from '../theme/components/user-menu/user-menu.component';
import { HorizontalMenuComponent } from '../theme/components/menu/horizontal-menu/horizontal-menu.component';
import { FullScreenComponent } from '../theme/components/fullscreen/fullscreen.component';
import { BreadcrumbComponent } from '../theme/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-pages',
  imports: [
    RouterOutlet,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,
    UserMenuComponent,
    HorizontalMenuComponent,
    BreadcrumbComponent
  ],
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PagesComponent implements OnInit, AfterViewInit {
  @ViewChild('backToTop') backToTop: any;
  @ViewChild('mainSidenavContent') mainSidenavContent: any;
  @ViewChild('mainContent') mainContent!: ElementRef;

  readonly router = inject(Router);
  readonly activatedRoute = inject(ActivatedRoute); // Injected to read route data
  readonly settingsService = inject(SettingsService);

  // Generic signals that listen to the router data instead of hardcoded URLs
  protected readonly isFullBleed = signal(false);

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        // Traverse to the lowest active child route
        let currentRoute = this.activatedRoute.root;
        while (currentRoute.firstChild) {
          currentRoute = currentRoute.firstChild;
        }

        // Check if the leaf route has the 'fullBleed' flag set
        this.isFullBleed.set(currentRoute.snapshot.data['fullBleed'] === true);
      });
  }

  get settings(): Settings {
    return this.settingsService.settings;
  }

  ngOnInit(): void {
    this.settings.menu = 'horizontal';
    this.settings.sidenavIsOpened = false;
    this.settings.sidenavIsPinned = false;
  }

  ngAfterViewInit(): void {
    this.settings.loadingSpinner.set(false);
    if (this.backToTop) {
      this.backToTop.nativeElement.style.display = 'none';
    }
  }

  public onPageScroll(event: any): void {
    if (!this.backToTop) return;

    this.backToTop.nativeElement.style.display = event.target.scrollTop > 300 ? 'flex' : 'none';

    const horizontalMenu = document.querySelector('#horizontal-menu');
    if (!horizontalMenu) return;

    if (event.target.scrollTop > 56) {
      horizontalMenu.classList.add('sticky');
      event.target.classList.add('horizontal-menu-hidden');
    } else {
      horizontalMenu.classList.remove('sticky');
      event.target.classList.remove('horizontal-menu-hidden');
    }
  }

  public scrollToTop(): void {
    this.mainSidenavContent?.scrollTo({ top: 0 });
    this.mainContent?.nativeElement?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  public openSettings(): void {
    console.log('Settings clicked');
  }
}
