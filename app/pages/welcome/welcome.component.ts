import { Component, OnInit, Inject } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import { Router, ActivatedRoute } from '@angular/router';
import { Headers, Http, RequestOptions } from '@angular/http';
import { BaseURLName } from '../../pages/baseURLfile';

@Component({
  selector: 'ngx-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  public orgName: any;
  public orgid: any;
  public eventname: any;
  public eventid: any;
  constructor(@Inject(SESSION_STORAGE) private storage: StorageService, public router: Router, public route: ActivatedRoute, public http: Http) {
    // this.route.params.subscribe((params) => {
    //   console.log(JSON.stringify(params));
    //   this.orgid = params['OrgID'];
    //   this.eventname = params['EvntName'];
    //   this.eventid = params['EventId'];
    //   console.log(this.orgid);
    //   this.storage.set('CurrentOrgId', this.orgid);
    //   this.storage.set('activeEventName', this.eventname);
    //   this.storage.set('activeEventId', this.eventid);
    // })

  }

  ngOnInit() {
    console.log(this.storage.get('isLoggedin'));
    if (this.storage.get('isLoggedin') == null) {
      this.router.navigate(['pages/login']);
    }
    this.orgid = this.storage.get('CurrentOrgId');
    this.eventname = this.storage.get('activeEventName');
    this.eventid = this.storage.get('activeEventId');
    this.orgName = this.storage.get('OrgName');
  }
}
