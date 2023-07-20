import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { Headers, Http, RequestOptions } from '@angular/http';
import { LoaderProvider } from '../../@core/data/loader.provider';
import { BaseURLName } from '../baseURLfile';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
@Component({
  selector: 'ngx-auth-page',
  templateUrl: './index.html',
  styleUrls: ['./index.scss']
})
export class AuthPageComponent {
  userForm: any;
  userForm1: any;
  username: any;
  password: any;
  organizationID: any;
  adminUID: any;
  adminpassword: any;
  isLoginError: boolean = false;
  isOrgLoginError: boolean = false;
  chkBoxStatus: boolean = false;
  //public loaderr: boolean = false;
  constructor(private formBuilder: FormBuilder, public router: Router, public http: Http, public loader: LoaderProvider, @Inject(SESSION_STORAGE) private storage: StorageService) {
    this.userForm1 = this.formBuilder.group({
      'orgid': ['', Validators.required],
      'adminuid': ['', Validators.required],
      'adminpasswd': ['', Validators.required]
    });
    this.rememberMeFunc();
  }
  rememberMeFunc() {
    console.log(this.storage.get('adminuid') + '  ' + this.storage.get('adminpasswd') + ' ' + this.storage.get('isChecked'));
    if (this.storage.get('isChecked') == true) {
      this.userForm1 = this.formBuilder.group({
        'orgid': [this.storage.get('CurrentOrgId'), Validators.required],
        'adminuid': [this.storage.get('adminuid'), Validators.required],
        'adminpasswd': [this.storage.get('adminpasswd'), Validators.required]
      });
      this.chkBoxStatus = true;
    }
    else {
      this.userForm1 = this.formBuilder.group({
        'orgid': ['', Validators.required],
        'adminuid': ['', Validators.required],
        'adminpasswd': ['', Validators.required]
      });
      this.chkBoxStatus = false;
    }
  }
  getCheckedOrNot(event) {
    console.log(event.target.checked);
    if (event.target.checked == true) {
      this.storage.set('isChecked', true);
      this.chkBoxStatus = true;
    } else {
      this.storage.set('isChecked', false);
      this.chkBoxStatus = false;
    }
  }
  OrganizationLogin() {
    // this.storage.set('OrgName','Zreyas Tech');// This is Association name/Organization Name
    // this.router.navigate(['pages/welcome', {OrgID:1000}]);
    this.loader.showLoader();
    this.isOrgLoginError = false;
    this.organizationID = this.userForm1.value.orgid;
    this.adminUID = this.userForm1.value.adminuid;
    this.adminpassword = this.userForm1.value.adminpasswd
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    let options = new RequestOptions({ headers: headers });
    let postParams = {
      "associationId": this.organizationID,
      "adminUid": this.adminUID,
      "password": this.adminpassword
    }
    this.http.post(BaseURLName.baseURL + "associationlogin", JSON.stringify(postParams), options).subscribe(data => {
      let response = JSON.parse(data['_body']);
      console.log(response);
      //this.loaderr = false;
      if (response.isAuthenticated == 'Y') {
        this.storage.set('isLoggedin', '1');
        this.storage.set('OrgName', response.userName);// This is Association name/Organization Name
        this.getDetails();
      } else if (response.isAuthenticated == 'N') {
        this.isOrgLoginError = true;
        this.loader.hideLoader();
      }
    }, error => {
      this.loader.hideLoader();
      console.log(error);// Error getting the data
    });
  }
  getDetails() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    let options = new RequestOptions({ headers: headers });
    let postParams = {
      "associationId": this.organizationID
    }
    this.http.post(BaseURLName.baseURL + "getactiverace", JSON.stringify(postParams), options).subscribe(data => {
      let res = JSON.parse(data['_body']);
      console.log(res);
      this.loader.hideLoader();
      if (res.status == 1) {
        this.storage.set('CurrentOrgId', this.organizationID);
        this.storage.set('activeEventName', res.eventName);
        this.storage.set('activeEventId', res.eventId);
        this.storage.set('adminuid', this.adminUID);
        this.storage.set('adminpasswd', this.adminpassword);
        //this.willDisplay_Location_As_MenuItem(res.eventName);
        this.router.navigate(['pages/welcome', { OrgID: this.organizationID, EvntName: res.eventName, EventId: res.eventId }]);
      }
      else {
        this.storage.set('CurrentOrgId', this.organizationID);
        this.storage.set('adminuid', this.adminUID);
        this.storage.set('adminpasswd', this.adminpassword);
        this.router.navigate(['pages/welcome', { OrgID: this.organizationID, EvntName: res.eventName, EventId: res.eventId }]);
      }
    }, (err) => {
      this.loader.hideLoader();
      console.log(err);
    });
  }
  // willDisplay_Location_As_MenuItem(eventName) {
  //   let headers = new Headers();
  //   headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
  //   let options = new RequestOptions({ headers: headers });
  //   let postParams = {
  //     "association": this.organizationID,
	//     "race":eventName
  //   }
  //   this.http.post(BaseURLName.baseURL + "checkracewithoutqr", JSON.stringify(postParams), options).subscribe(data => {
  //     let res = JSON.parse(data['_body']);
  //     console.log(res);
  //     if (!res.error) {
  //       localStorage.setItem("MenuItem_LocationHidden", res.data.status);
  //       location.reload();
  //     } else {
  //     }
  //   }, (err) => {
  //     console.log(err);
  //   });
  // }
}
