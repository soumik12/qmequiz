import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import { Inject } from '@angular/core';
import { Router } from '@angular/router';
export class LogoutFromOrganizationPortal{
    constructor(@Inject(SESSION_STORAGE) private storage: StorageService, public router: Router) {
        
    }
    logout() {
        this.storage.remove('isLoggedin');
        this.storage.remove('activeEventId');
        this.storage.remove('activeEventName');
        localStorage.removeItem("MenuItem_LocationHidden");
        this.router.navigate(['pages/login']);
    }
}