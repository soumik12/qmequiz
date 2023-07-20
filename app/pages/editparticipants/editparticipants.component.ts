import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from "@angular/forms";
import { Headers, Http, RequestOptions } from '@angular/http';
import { LoaderProvider } from '../../@core/data/loader.provider';
import { MessageProvider } from '../../@core/data/message.provider';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import { BaseURLName } from '../baseURLfile';
@Component({
  selector: 'ngx-editparticipants',
  templateUrl: './editparticipants.component.html',
  styleUrls: ['./editparticipants.component.scss']
})
export class EditparticipantsComponent implements OnInit {
  public partcipantID: any;
  userForm: any;
  public activeRaceIdd: any;
  public CurrentOrgId: any;
  public orgName: any;
  public title: any;
  public firstname: any;
  public lastname: any;
  public username: any;
  public emailid: any;
  public countrycde: any;
  public areacde: any;
  public telnoo: any;
  constructor(public router: Router, public route: ActivatedRoute, public formBuilder: FormBuilder, public loader: LoaderProvider, public modalPopup: MessageProvider, public http: Http, @Inject(SESSION_STORAGE) private storage: StorageService, ) {
    this.activeRaceIdd = this.storage.get('activeEventId');
    this.orgName = this.storage.get('OrgName');
    this.CurrentOrgId = this.storage.get('CurrentOrgId');
    this.route.params.subscribe((params) => {
      this.partcipantID = params['gamerId'];
      console.log(this.partcipantID);
    });
    this.userForm = this.formBuilder.group({
      'title': ['', Validators.required],
      'firstname': ['', Validators.required],
      'lastname': ['', Validators.required],
      'username': ['', Validators.required],
      'emailid': ['', Validators.required,Validators.email],
      'countrycde': ['', Validators.required],
      'areacde': ['', Validators.required],
      'telnoo': ['', Validators.required]
    });
    this.loadParticipantSummary();
  }

  ngOnInit() {
    console.log(this.storage.get('isLoggedin'));
    if (this.storage.get('isLoggedin') == null) {
      this.router.navigate(['pages/login']);
    }
  }
  loadParticipantSummary() {
    this.loader.showLoader();
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    let options = new RequestOptions({ headers: headers });
    let postParams = {
      "name": this.orgName,
      "raceId": this.activeRaceIdd
    }
    this.http.post(BaseURLName.baseURL + "getallgamersdetails", JSON.stringify(postParams), options).map((response) => response.json()).subscribe(res => {
      console.log(res);
      if (res.status == 1) {
        //this.data = res.gamers;
        res.gamers.forEach((v, k) => {
          //console.log(v.gamerId, this.partcipantID);
          if (v.gamerId == this.partcipantID) {
            console.log(res.gamers[k]);
            let phno = res.gamers[k].phoneNumber;
            phno = phno.split('-');
            this.userForm = this.formBuilder.group({
              'title': [res.gamers[k].title, Validators.required],
              'firstname': [res.gamers[k].firstname, Validators.required],
              'lastname': [res.gamers[k].lastName, Validators.required],
              'username': [res.gamers[k].userName, Validators.required],
              'emailid': [res.gamers[k].email, Validators.email],
              'countrycde': [phno[0], Validators.required],
              'areacde': [phno[1], Validators.required],
              'telnoo': [phno[2], Validators.required]
            });
          }
        });
        this.loader.hideLoader();
      }
    }, error => {
      console.log(error);// Error getting the data
      this.loader.hideLoader();
    });
  }
  updateParticipant() {
    this.title = this.userForm.value.title;
    this.firstname = this.userForm.value.firstname;
    this.lastname = this.userForm.value.lastname;
    this.username = this.userForm.value.username;
    this.emailid = this.userForm.value.emailid;
    this.countrycde = (this.userForm.value.countrycde).toString();
    this.areacde = (this.userForm.value.areacde).toString();
    this.telnoo = (this.userForm.value.telnoo).toString();
    console.log(this.title, this.firstname, this.lastname, this.username, this.emailid, this.countrycde, this.areacde, this.telnoo);
    this.loader.showLoader();
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    let options = new RequestOptions({ headers: headers });
    let postParams = {
      "raceId": this.activeRaceIdd,
      "participantId": this.partcipantID,
      "firstname": this.firstname,
      "lastName": this.lastname,
      "userName": this.username,
      "title":  this.title,
      "email": this.emailid,
      "phoneNumber": this.telnoo,
      "stdCode": this.countrycde,
      "secondNumber":this.areacde
    }
    this.http.post(BaseURLName.baseURL + "updateparticipant", JSON.stringify(postParams), options).map((response) => response.json()).subscribe(res => {
      console.log(res);
      if (res.status == 1) {
        this.modalPopup.showSuccessAlert((res.message).replace(/"/g, ""));
        this.loader.hideLoader();
      }
      else {
        this.modalPopup.showFailedAlert((res.message).replace(/"/g, ""));
        this.loader.hideLoader();
      }
    }, error => {
      console.log(error);// Error getting the data
      this.loader.hideLoader();
    });
  }
}
