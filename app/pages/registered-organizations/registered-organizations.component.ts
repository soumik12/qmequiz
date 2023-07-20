import { Component,Inject,OnInit} from '@angular/core';
import { SmartTableService } from '../../@core/data/smart-table.service';
import { LocalDataSource } from "ng2-smart-table";
import { LoaderProvider } from '../../@core/data/loader.provider';
import { Headers, Http, RequestOptions } from '@angular/http';
import { BaseURLName } from '../baseURLfile';
import { MessageProvider } from '../../@core/data/message.provider';
import { Router } from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
@Component({
  selector: 'ngx-registered-organizations',
  templateUrl: './registered-organizations.component.html',
  styleUrls: ['./registered-organizations.component.scss']
})
export class RegisteredOrganizationsComponent implements OnInit{
  settings = {
    actions: {
      add: false,
      edit: false,
      delete: false
    },
    columns: {
      id: {
        title: 'Organization ID',
        type: 'number',
      },
      associationName: {
        title: 'Organization',
        type: 'string',
      },
      organizationUrl: {
        title: 'Organization URL',
        type: 'string',
      },
      adminName: {
        title: 'Admin Name',
        type: 'string',
      },
      adminEmail: {
        title: 'Admin Email',
        type: 'string',
      },
      phoneNumber: {
        title: 'Admin Phone',
        type: 'number',
      },
      adminUid: {
        title: 'Admin UID',
        type: 'number',
      },
      pasword: {
        title: 'Admin Password',
        type: 'number',
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();
  data: any = [];
  public isOutgoingMail: boolean = false;
  public isGenuidPasswd: boolean = false;
  adminname: any;
  adminUID: any;
  adminPASSWD: any;
  adminEMAIL: any;
  organizationID: any;
  constructor(private service: SmartTableService, public loader: LoaderProvider,public http:Http,public modalPopup: MessageProvider,public router:Router,@Inject(SESSION_STORAGE) private storage:StorageService) {
    this.service.loadregisteredOrganizations().then((result) => {
      this.data = result.associations;
      this.source.load(this.data);
      this.source.load(this.data);
      this.loader.hideLoader();
    });
  }
  onUserRowSelect(event): void {
    console.log(event);
    this.adminname = event.data.adminName;
    this.adminUID = event.data.adminUid;
    this.adminPASSWD = event.data.pasword;
    this.adminEMAIL = event.data.adminEmail;
    this.organizationID = event.data.id;
    if (event.data.adminUid == '') {
      this.isGenuidPasswd = true;
      this.isOutgoingMail = false;
    } else {
      this.isGenuidPasswd = false;
      this.isOutgoingMail = true;
    }
  }
  generateUIDPasswd() {
    this.loader.showLoader();
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    let options = new RequestOptions({ headers: headers });
    let postParams = {
        "associationId":this.organizationID,
        "adminEmail":this.adminEMAIL,
        "adminName":this.adminname,
        "loginUrl":"http://qmequiz.s3-website-us-east-1.amazonaws.com"
    }
    this.http.post(BaseURLName.baseURL + "generateadmindetails", JSON.stringify(postParams), options).subscribe(data => {
      let response = JSON.parse(data['_body']);
      console.log(response);  
      if (response.status == 1) { 
        this.modalPopup.showSuccessAlert((JSON.stringify(response.message)).replace(/"/g, ""));
        this.service.loadregisteredOrganizations().then((result) => {
          this.data = result.associations;
          this.source.load(this.data);
          this.source.load(this.data);
          this.loader.hideLoader();
        });
      }
      else  if (response.status == 0){
        this.modalPopup.showFailedAlert((JSON.stringify(response.message)).replace(/"/g, ""));
        this.loader.hideLoader();
      }
    }, error => {
      console.log(error);// Error getting the data
      this.loader.hideLoader();
    });
  }
  ngOnInit() {
    if (this.storage.get('isAdminLoggedin')==null) {
      this.router.navigate(['pages/login']);
    }
  }
}
