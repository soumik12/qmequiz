import {Component, OnDestroy,OnInit,Inject} from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { SmartTableService } from '../../@core/data/smart-table.service';
import { LocalDataSource } from 'ng2-smart-table';
import { LoaderProvider } from '../../@core/data/loader.provider';
import { Router } from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit{
  settings = {
    editable: false,
    actions: 
    {
        filter: false,
        add: false,
        edit: false,
        delete: false,
      custom: [{ name: 'view', title: 'Activities' }]
    },
    columns: {
      raceId: {
        title: 'Event ID',
        type: 'number',
      },
      associationName: {
        title: 'Organization Name',
        type: 'string',
      },
      raceName: {
        title: 'Event Name',
        type: 'string',
      },
      startDateTime: {
        title: 'Start DateTime',
        type: 'string',
      },
      endDateTime: {
        title: 'End DateTime',
        type: 'string',
      },
      contactPerson: {
        title: 'Contact Person',
        type: 'string',
      },
      email: {
        title: 'E-Mail',
        type: 'string',
      },
      phoneNumber: {
        title: 'Phone Number',
        type: 'number',
      },
      // newKey: {
      //   title: 'Activities Status',
      //   type: 'string',
      //   link: {
      //     title: 'Action Status',
      //     type: 'html',
      //     editor: {
      //       custom: [{ name: 'view', title: '<i class="nb-plus"></i> ' }]
      //       //component: ActivityStatusComponent,
      //     },
      //   },
      // }
      // newKey: {
      //   title: 'myHref',
      //   type: 'html',
      //   valuePrepareFunction: (cell, row) => {
      //     console.log(row);
      //     console.log(row.id);
      //     return '<a href="#">link</a>';
      //   },
      // },
    },
  }
  source: LocalDataSource = new LocalDataSource();
  data: any = [];
  modifieddata: any = [];
  persons:any;
  constructor(private themeService: NbThemeService, private service: SmartTableService,public loader:LoaderProvider,public router:Router,@Inject(SESSION_STORAGE) private storage:        StorageService) {
    this.service.loadCalendar().then((result) => {
      console.log(result.calenderView);
      this.data = result.calenderView;
      this.data.map((val)=>{
        this.addKeyValue(val, 'newKey', 'Activities');
      });
      this.source.load(this.data);
      this.loader.hideLoader();
    }); 
  }
  addKeyValue(obj, key, data){
    obj[key] = data;
  }

  customFunc(event) {
    console.log(event);
    this.router.navigate(['pages/activity-status',event.data]);
  }
  ngOnInit() {
    if (this.storage.get('isAdminLoggedin')==null) {
      this.router.navigate(['pages/login']);
    }
  }
}
