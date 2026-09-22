import { Component, ViewEncapsulation, ChangeDetectionStrategy, inject } from '@angular/core';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { AuthService } from '@services/auth.service';

@Component({
    selector: 'app-user-menu',
    imports: [
        RouterModule,
        FlexLayoutModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatToolbarModule
    ],
    templateUrl: './user-menu.component.html',
    styleUrls: ['./user-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class UserMenuComponent {
    public userImage = 'img/users/user.jpg';

    // Inject the authentication service using the modern standard
    protected readonly authService = inject(AuthService);

    protected getUserInitials(): string {
        const name = this.authService.currentUser()?.name;
        if (!name || name === 'Admin User' || name === 'Guest User') return 'RI';
        const parts = name.trim().split(/\s+/);
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    }

    protected logout(): void {
        this.authService.logout();
    }
}
