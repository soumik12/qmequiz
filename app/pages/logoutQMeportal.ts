import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import { Inject } from '@angular/core';
import { Router } from '@angular/router';
export class LogoutFromQMePortal {
    constructor(@Inject(SESSION_STORAGE) private storage: StorageService, public router: Router) {

    }
    logout() {
        this.storage.remove('isAdminLoggedin');
        this.router.navigate(['pages/login']);
    }
}