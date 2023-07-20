import { Component, Input, OnInit, Inject } from '@angular/core';
import { NbMenuService, NbSidebarService } from '@nebular/theme';
import { UserService } from '../../../@core/data/users.service';
import { AnalyticsService } from '../../../@core/utils/analytics.service';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import { LogoutFromOrganizationPortal } from '../../../pages/logoutOrganizationPortal';
import { MessageProvider } from '../../../@core/data/message.provider';
@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  @Input() position = 'normal';
  user: any;
  public orgName: any;
  public activeEventName: any;
  public CurrentOrgId: any;
  public activeEventId: any;
  public orgid: any;
  userMenu = [/*{ title: 'Profile' },*/ { title: 'Log out' }];
  constructor(private sidebarService: NbSidebarService, private menuService: NbMenuService, private userService: UserService, private analyticsService: AnalyticsService, @Inject(SESSION_STORAGE) private storage: StorageService, public logoutt: LogoutFromOrganizationPortal,public modalPopup: MessageProvider) {
    this.CurrentOrgId = this.storage.get('CurrentOrgId');
    this.activeEventName=this.storage.get('activeEventName');
    this.activeEventId=this.storage.get('activeEventId');
  }

  ngOnInit() {
    this.userService.getUsers().subscribe((users: any) => this.user = users.nick);
    this.orgName = this.storage.get('OrgName');
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    return false;
  }
  toggleSettings(): boolean {
    this.sidebarService.toggle(false, 'settings-sidebar');
    return false;
  }
  goToHome() {
    this.menuService.navigateHome();
  }
  startSearch() {
    this.analyticsService.trackEvent('startSearch');
  }
  knowDetails() {
    this.modalPopup.showSuccessAlert(`Organization ID: ${ this.CurrentOrgId} Event Name: "${this.activeEventName}"  Event ID:\u0020${this.activeEventId}`);
    //alert(this.activeEventName+"  "+this.activeEventId);
  }
  logoutOrganizationPortal() {
    this.logoutt.logout();
  }
}
