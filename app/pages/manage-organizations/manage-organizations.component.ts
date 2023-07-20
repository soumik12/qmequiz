import { Component,Inject,OnInit} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageProvider } from '../../@core/data/message.provider';
import { Headers, Http, RequestOptions } from '@angular/http';
import { BaseURLName } from '../baseURLfile';
import { LoaderProvider } from '../../@core/data/loader.provider';
import { Router } from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
@Component({
  selector: 'ngx-manage-organizations',
  templateUrl: './manage-organizations.component.html',
  styleUrls: ['./manage-organizations.component.scss']
})
export class ManageOrganizationsComponent implements OnInit {
  userForm: any;
  userForm1: any;
  userForm2: any;
  orgName: any;
  neworgName: any;
  oldorgName: any;
  orgNametodelete: any;
  confirmOrgname: any;
  adminName: any;
  emailId: any;
  countryCode: any;
  areaCode: any;
  telNo: any;
  URL: any;
  optionlist: any = [];
  constructor(public modalPopup: MessageProvider,private formBuilder:FormBuilder,private http:Http,public loader:LoaderProvider,public router:Router,@Inject(SESSION_STORAGE) private storage:StorageService) { 
    this.userForm = this.formBuilder.group({
      'orgname': ['', Validators.required],
      'adminname': ['', Validators.required],
      'email': ['', Validators.email],
      'countrycode': ['', Validators.required],
      'areacode': ['', Validators.required],
      'telno': ['', Validators.required],
      'url': ['', Validators.required]
    });
    this.userForm1 = this.formBuilder.group({
      'neworgname':'',
      'adminnamee': ['', Validators.required],
      'emaill': ['', Validators.email],
      'countrycde': ['', Validators.required],
      'areacde': ['', Validators.required],
      'telnoo': ['', Validators.required],
      'urll': ['', Validators.required]
    });
    this.userForm2 = this.formBuilder.group({
      'confirmorgname': ['', Validators.required]
    });
    this.getallOrganizations();
  }
  addOrganization() {
    this.loader.showLoader();
    this.orgName = this.userForm.value.orgname;
    this.adminName = this.userForm.value.adminname;
    this.emailId = this.userForm.value.email;
    this.countryCode = this.userForm.value.countrycode;
    this.areaCode = this.userForm.value.areacode;
    this.telNo = this.userForm.value.telno;
    this.URL = "www."+this.userForm.value.url;
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    let options = new RequestOptions({ headers: headers });
    let postParams = {
      "adminName":this.adminName,
      "associationName":this.orgName,
      "email":this.emailId,
      "organizationUrl":this.URL,
      "phoneNumber":this.telNo,
      "secondNumber":this.areaCode,
      "stdCode":this.countryCode
    }
    this.http.post(BaseURLName.baseURL + "addassociation", JSON.stringify(postParams), options).subscribe(data => {
      let response = JSON.parse(data['_body']);
      console.log(response);  
      if (response.status == 1) { 
        this.getallOrganizations();
        this.modalPopup.showSuccessAlert((JSON.stringify(response.message)).replace(/"/g,""));
        //deleteOrg.result.then( result => alert(`The result is: ${result}`) );
      }
      else  if (response.status == 0){
        this.modalPopup.showFailedAlert((JSON.stringify(response.message)).replace(/"/g,""));
      }
      this.loader.hideLoader();
    }, error => {
      console.log(error);// Error getting the data
      this.loader.hideLoader();
    });
  }
  getallOrganizations() {
    this.loader.showLoader();
    let i = 0;
    this.http.get(BaseURLName.baseURL + "getallassociations").subscribe((data) => {
      let response = JSON.parse(data['_body']);
      console.log(response);
      if (response.status == 1) {
        response.associations.forEach(v => {
          this.optionlist[i++] = v.name;
        });
      }
      else if (response.status==0) {
        this.modalPopup.showFailedAlert((JSON.stringify(response.message)).replace(/"/g,""));
      }
      this.loader.hideLoader();
    });
  }
  getRegisteredOrg(orgname) {
    this.loader.showLoader();
    console.log(orgname);
    this.oldorgName = orgname;
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    let options = new RequestOptions({ headers: headers });
    let postParams = {
      "name":orgname
    }
    this.http.post(BaseURLName.baseURL + "getassociationadmindetails", JSON.stringify(postParams), options).subscribe(data => {
      let response = JSON.parse(data['_body']);
      console.log(response);  
      if (response.status == 1) { 
        this.userForm1 = this.formBuilder.group({
          'neworgname':['',''],
          'adminnamee': [response.associations.adminName, Validators.required],
          'emaill': [response.associations.adminEmail, Validators.email],
          'countrycde': [response.associations.stdCode, Validators.required],
          'areacde': [response.associations.secondNumber, Validators.required],
          'telnoo': [response.associations.phoneNumber, Validators.required],
          'urll': [response.associations.organizationURL, Validators.required]
        });
      }
      else  if (response.status == 0){
        this.modalPopup.showFailedAlert((JSON.stringify(response.message)).replace(/"/g,""));
      }
      this.loader.hideLoader();
    }, error => {
      console.log(error);// Error getting the data
      this.loader.hideLoader();
    });
  }
  updateOrganization() {
    this.loader.showLoader();
    this.neworgName = this.userForm1.value.neworgname;
    this.adminName = this.userForm1.value.adminnamee;
    this.emailId = this.userForm1.value.emaill;
    this.countryCode = this.userForm1.value.countrycde;
    this.areaCode = this.userForm1.value.areacde;
    this.telNo = this.userForm1.value.telnoo;
    this.URL = this.userForm1.value.urll;
    let postParams;
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    let options = new RequestOptions({ headers: headers });
    if (this.neworgName == '') {
      postParams = {
          "oldName": this.oldorgName,
          "adminName": this.adminName,
          "email": this.emailId,
          "stdCode": this.countryCode,
          "secondNumber": this.areaCode,
          "phoneNumber":this.telNo,
          "organizationUrl":this.URL
      }; 
  }
    else if (this.oldorgName != this.neworgName) {
     postParams = {
          "oldName": this.oldorgName,
          "newName":this.neworgName,
          "adminName": this.adminName,
          "email": this.emailId,
          "stdCode": this.countryCode,
          "secondNumber": this.areaCode,
          "phoneNumber":this.telNo,
          "organizationUrl":this.URL
      }; 
    }
    this.http.post(BaseURLName.baseURL + "updateassociationadmindetails", JSON.stringify(postParams), options).subscribe(data => {
      let response = JSON.parse(data['_body']);
      console.log(response);  
      if (response.status == 1) { 
        this.getallOrganizations();
        this.modalPopup.showSuccessAlert((JSON.stringify(response.message)).replace(/"/g,""));
      }
      else  if (response.status == 0){
        this.modalPopup.showFailedAlert((JSON.stringify(response.message)).replace(/"/g,""));
      }
      this.loader.hideLoader();
    }, error => {
      console.log(error);// Error getting the data
      this.loader.hideLoader();
    });
  }
  getRegisteredOrgfordelete(orgname) {
    this.orgNametodelete = orgname;
  }
  deleteOrg() {
    this.loader.showLoader();
    this.confirmOrgname = this.userForm2.value.confirmorgname;
    if (this.confirmOrgname == this.orgNametodelete) {
      this.loader.hideLoader();
      const deleteOrg = this.modalPopup.showYesNoConfirm('Confirm', 'Do you really want to delete <b>'+this.orgNametodelete+'</b>?');
      deleteOrg.result.then((result) => { 
        if (result == true)
        {
              let headers = new Headers();
              headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
              let options = new RequestOptions({ headers: headers });
              let postParams = {
                "associationName":this.orgNametodelete
              }
              this.http.post(BaseURLName.baseURL + "deleteassociation", JSON.stringify(postParams), options).subscribe(data => {
                let response = JSON.parse(data['_body']);
                console.log(response);  
                if (response.status == 1) { 
                  this.getallOrganizations();
                  this.userForm2 = this.formBuilder.group({
                    'confirmorgname': ['', ''],
                  });
                  this.modalPopup.showSuccessAlert((JSON.stringify(response.message)).replace(/"/g, ""));
                }
                else if (response.status == 0) {
                  this.modalPopup.showFailedAlert((JSON.stringify(response.message)).replace(/"/g,""));
                }
            }, error => {
              console.log(error);// Error getting the data
              this.loader.hideLoader();
            });
        }
      });
    }
    else {
      this.loader.hideLoader();
      this.modalPopup.showFailedAlert("Organization names are not matched.");
    }
  }
  ngOnInit() {
    if (this.storage.get('isAdminLoggedin')==null) {
      this.router.navigate(['pages/login']);
    }
  }
}
