import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Headers, Http, RequestOptions } from '@angular/http';
import { BaseURLName } from '../baseURLfile';
import { LoaderProvider } from '../../@core/data/loader.provider';
import { MessageProvider } from '../../@core/data/message.provider';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import { Router } from '@angular/router';
@Component({
  selector: 'ngx-qrcreation',
  templateUrl: './qrcreation.component.html',
  styleUrls: ['./qrcreation.component.scss']
})
export class QRCreationComponent implements OnInit {
  userForm: any;
  locationName: any;
  public activeRaceIdd: any;
  public textForQRCode: any;
  public noofques: any;
  public nxtlocchint: any;
  public list: any;
  public x: any;
  public loactionList: any = [];
  public isQRCodewithvaluePresent: boolean = false;
  constructor(private formBuilder: FormBuilder, public http: Http, public loader: LoaderProvider, public modalPopup: MessageProvider, @Inject(SESSION_STORAGE) private storage: StorageService,public router:Router) { 
    this.activeRaceIdd = this.storage.get('activeEventId');
    this.userForm = this.formBuilder.group({
      'locList': ['', Validators.required],
      'noofQuestion': ['', Validators.required],
      'nxtLocHint': ['', Validators.required]
    });
    this.locationSummary();
  }

  ngOnInit() {
    console.log(this.storage.get('isLoggedin'));
    if (this.storage.get('isLoggedin') == null) {
      this.router.navigate(['pages/login']);
    }
  }
  getLocation() {
    this.locationName = this.userForm.value.locList;
  }
  createQRCode() {
    this.isQRCodewithvaluePresent = true;
    this.noofques = this.userForm.value.noofQuestion;
    this.nxtlocchint = this.userForm.value.nxtLocHint;
    this.textForQRCode = {
      'raceId': this.activeRaceIdd,
      'locationName': this.locationName,
      'noofquestion': this.noofques,
      'nextlochint':this.nxtlocchint
    };
    this.textForQRCode = JSON.stringify(this.textForQRCode);
  }
  download() {
    this.list = document.getElementsByTagName("img");
    console.log(this.list);
    this.x = this.list[0].currentSrc;
    console.log("this.x==>", this.x);
  }
  locationSummary() {
    this.loader.showLoader();
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    let options = new RequestOptions({ headers: headers });
    let postParams = {
      "raceId": this.activeRaceIdd
    }
    this.http.post(BaseURLName.baseURL + "getexhibitorsdetails", JSON.stringify(postParams), options).subscribe(data => {
      let response = JSON.parse(data['_body']);
      console.log(response);
      if (response.status == 1) {
        this.loactionList = response.exhibitors;
        console.log((JSON.stringify(response.message)).replace(/"/g, ""));
        this.loader.hideLoader();
      }
      else {
        this.modalPopup.showSuccessAlert((JSON.stringify(response.message)).replace(/"/g, ""));
        console.log((JSON.stringify(response.message)).replace(/"/g, ""));
        this.loader.hideLoader();
      }
    }, error => {
      console.log(error);// Error getting the data
      this.loader.hideLoader();
    });
  }
}
