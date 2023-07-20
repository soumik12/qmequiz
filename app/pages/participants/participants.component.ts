import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Headers, Http, RequestOptions } from '@angular/http';
import { BaseURLName } from '../baseURLfile';
import { LoaderProvider } from '../../@core/data/loader.provider';
import { MessageProvider } from '../../@core/data/message.provider';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import { Router } from '@angular/router';
import { reject } from 'q';
@Component({
  selector: 'ngx-participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.scss']
})
export class ParticipantsComponent implements OnInit {
  userForm: any;
  userForm1: any;
  public activeRaceIdd: any;
  public CurrentOrgId: any;
  public orgName: any;
  public teamnames: any = [];
  public data: any = [];
  public title: any;
  public firstname: any;
  public lastname: any;
  public username: any;
  public emailid: any;
  public countrycde: any;
  public areacde: any;
  public telnoo: any;
  public teamName: any;
  public selectedTeamName: any;
  public textForQRCode: string = null;
  public autoTeamAssignButtonDisplay_status: boolean=false;
  constructor(private formBuilder: FormBuilder, public http: Http, public loader: LoaderProvider, public modalPopup: MessageProvider, @Inject(SESSION_STORAGE) private storage: StorageService, public router: Router) {
    this.userForm = this.formBuilder.group({
      'title': ['', Validators.required],
      'firstname': ['', Validators.required],
      'lastname': ['', Validators.required],
      'username': ['', Validators.required],
      'emailid': ['', Validators.email],
      'countrycde': ['', Validators.required],
      'areacde': ['', Validators.required],
      'telnoo': ['', Validators.required],
      'teamName': ['', '']
    });
    this.userForm1 = this.formBuilder.group({
      'teamNamee': ['']
    });
    this.activeRaceIdd = this.storage.get('activeEventId');
    this.orgName = this.storage.get('OrgName');
    this.CurrentOrgId = this.storage.get('CurrentOrgId');
    this.loadTeamName();
    this.loadParticipantSummary();
  }

  ngOnInit() {
    console.log(this.storage.get('isLoggedin'));
    if (this.storage.get('isLoggedin') == null) {
      this.router.navigate(['pages/login']);
    }
  }
  loadTeamName() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    let options = new RequestOptions({ headers: headers });
    let postParams = {
      "associationName": this.orgName,
      "raceId": this.activeRaceIdd
    }
    this.http.post(BaseURLName.baseURL + "getteamdetails", JSON.stringify(postParams), options).map((response) => response.json()).subscribe(res => {
      console.log(res);
      if (res.status == 1) {
        this.teamnames = res.teamDetails;
        console.log(this.teamnames);
        this.loader.hideLoader();
      }
    }, error => {
      console.log(error);// Error getting the data
      this.loader.hideLoader();
    });
  }
  addParticipant() {
    this.loader.showLoader();
    this.title = this.userForm.value.title;
    this.firstname = this.userForm.value.firstname;
    this.lastname = this.userForm.value.lastname;
    this.username = this.userForm.value.username;
    this.emailid = this.userForm.value.emailid;
    this.countrycde = (this.userForm.value.countrycde).toString();
    this.areacde = (this.userForm.value.areacde).toString();
    this.telnoo = (this.userForm.value.telnoo).toString();
    this.teamName = this.userForm.value.teamName;
    //console.log(this.title, this.firstname, this.lastname, this.emailid, this.countrycde, this.areacde, this.telnoo, this.teamName);
    console.log(this.countrycde, typeof (this.countrycde), this.countrycde.length);
    if (((this.countrycde).length + (this.areacde).length + (this.telnoo).length) < 10) {
      this.modalPopup.showFailedAlert('Phone number contain atleast 10 Digits.');
    }
    else {
      let headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      let options = new RequestOptions({ headers: headers });
      let postParams = {
        "raceId": this.activeRaceIdd,
        "firstName": this.firstname,
        "lastName": this.lastname,
        "userName": this.username,
        "title": this.title,
        "organization": this.orgName,
        "email": this.emailid,
        "phoneNumber": this.telnoo,
        "stdCode": this.countrycde,
        "secondNumber": this.areacde,
        "teamName": this.teamName,
        "associationId": this.CurrentOrgId
      }
      this.http.post(BaseURLName.baseURL + "addparticipant", JSON.stringify(postParams), options).map((response) => response.json()).subscribe(res => {
        console.log(res);
        if (res.status == 1) {
          this.modalPopup.showSuccessAlert('Participant Added Successfully.');
          this.userForm = this.formBuilder.group({
            'title': ['', Validators.required],
            'firstname': ['', Validators.required],
            'lastname': ['', Validators.required],
            'username': ['', Validators.required],
            'emailid': ['', Validators.email],
            'countrycde': ['', Validators.required],
            'areacde': ['', Validators.required],
            'telnoo': ['', Validators.required],
            'teamName': ['', '']
          });
          this.loadParticipantSummary();
          this.loader.hideLoader();
        } else {
          this.modalPopup.showFailedAlert('Can not Add Participant.');
          this.loader.hideLoader();
        }
      }, error => {
        console.log(error);// Error getting the data
        this.loader.hideLoader();
      });
    }
  }
  loadParticipantSummary() {
    this.data = [];
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
        this.autoTeamAssignButtonDisplay_status = true;
        this.data = res.gamers;
        this.data.map((val) => {
          //console.log(val.teamName);
          if (val.teamName != '') {
            this.addKeyValue(val, 'newKey', true);
          }
          else {
            this.addKeyValue(val, 'newKey', false);
          }
          if (val.checkedIn == 'Y') {
            this.addKeyValue(val, 'isCheckedIn', true);
          }
          else {
            this.addKeyValue(val, 'isCheckedIn', false);
          }
          if (val.loggedIn == 'Y') {
            this.addKeyValue(val, 'isLoggedIn', true);
          }
          else {
            this.addKeyValue(val, 'isLoggedIn', false);
          }
        });
        console.log(this.data);
        this.loader.hideLoader();
      } else {
          this.loader.hideLoader();
          this.modalPopup.showFailedAlert('No Participants Registered.');
          this.autoTeamAssignButtonDisplay_status = false;
      }
    }, error => {
      console.log(error);// Error getting the data
      this.loader.hideLoader();
    });
  }
  addKeyValue(obj, key, data) {
    obj[key] = data;
  }
  updateParticipant(event) {
    console.log(event.gamerId);
    this.router.navigate(['/pages/editparticipant', { gamerId: event.gamerId }]);
  }
  deleteParticipant(event) {
    console.log(event.gamerId);
    const decision = this.modalPopup.showYesNoConfirm("Alert !!", `Do you want to delete the Participant ${event.firstname} ${event.lastName}?`);
    decision.result.then((result) => {
      this.loader.showLoader();
      let headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      let options = new RequestOptions({ headers: headers });
      let postParams = {
        "participantId": event.gamerId
      }
      this.http.post(BaseURLName.baseURL + "deleteparticipant", JSON.stringify(postParams), options).map((response) => response.json()).subscribe(res => {
        console.log(res);
        this.loader.hideLoader();
        if (res.status == 1) {
          this.modalPopup.showSuccessAlert((res.message).replace(/"/g, ""));
          this.loadParticipantSummary();
        } else {
          this.modalPopup.showFailedAlert((res.message).replace(/"/g, ""));
        }
      }, error => {
        console.log(error);// Error getting the data
        this.loader.hideLoader();
      });
    }, (err) => {
      reject(err);
    });
  }
  getTeamNameAndAssignToParticipant(event) {
    console.log(event.email);
    this.selectedTeamName = this.userForm1.value.teamNamee;
    this.loader.showLoader();
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    let options = new RequestOptions({ headers: headers });
    let postParams = {
      "associationId": this.CurrentOrgId,
      "participantEmail": event.email,
      "teamName": this.selectedTeamName
    }
    this.http.post(BaseURLName.baseURL + "assignteams", JSON.stringify(postParams), options).map((response) => response.json()).subscribe(res => {
      console.log(res);
      if (res.status == 1) {
        this.modalPopup.showSuccessAlert((res.message).replace(/"/g, ""));
        this.loadParticipantSummary();
        this.loader.hideLoader();
      } else {
        this.modalPopup.showFailedAlert((res.message).replace(/"/g, ""));
        this.loader.hideLoader();
      }
    }, error => {
      console.log(error);// Error getting the data
      this.loader.hideLoader();
    });
  }
  unassignParticipant(event) {
    console.log(event.email);
    this.loader.showLoader();
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    let options = new RequestOptions({ headers: headers });
    let postParams = {
      "associationId": this.CurrentOrgId,
      "participantEmail": event.email
    }
    this.http.post(BaseURLName.baseURL + "unassignteam", JSON.stringify(postParams), options).map((response) => response.json()).subscribe(res => {
      console.log(res);
      if (res.status == 1) {
        this.modalPopup.showSuccessAlert((res.message).replace(/"/g, ""));
        this.loadParticipantSummary();
        this.loader.hideLoader();
      } else {
        this.modalPopup.showFailedAlert((res.message).replace(/"/g, ""));
        this.loader.hideLoader();
      }
    }, error => {
      console.log(error);// Error getting the data
      this.loader.hideLoader();
    });
  }
  setCheckIn(event, user) {
    console.log(event.target.checked);
    console.log(user.email);
    let checkinStatus;
    if (event.target.checked == true) {
      checkinStatus = 'Y';
    } else if (event.target.checked == false) {
      checkinStatus = 'N';
    }
    this.loader.showLoader();
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    let options = new RequestOptions({ headers: headers });
    let postParams = {
      "associationId": this.CurrentOrgId,
      "participantEmail": user.email,
      "checkIn": checkinStatus,
      "raceid": this.activeRaceIdd
    }
    this.http.post(BaseURLName.baseURL + "participantcheckin", JSON.stringify(postParams), options).map((response) => response.json()).subscribe(res => {
      console.log(res);
      if (res.status == 1) {
        this.modalPopup.showSuccessAlert((res.message).replace(/"/g, ""));
        this.loadParticipantSummary();
        this.loader.hideLoader();
      } else {
        this.modalPopup.showFailedAlert((res.message).replace(/"/g, ""));
        this.loader.hideLoader();
      }
    }, error => {
      console.log(error);// Error getting the data
      this.loader.hideLoader();
    });
  }
  setLogout(event, user) {
    this.loader.showLoader();
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    let options = new RequestOptions({ headers: headers });
    let postParams = {
     "participantId":user.gamerId
    }
    this.http.post(BaseURLName.baseURL + "logoutparticipant", JSON.stringify(postParams), options).map((response) => response.json()).subscribe(res => {
      console.log(res);
      if (res.status == 1) {
        this.modalPopup.showSuccessAlert((res.message).replace(/"/g, ""));
        this.loadParticipantSummary();
        this.loader.hideLoader();
      } else {
        this.modalPopup.showFailedAlert((res.message).replace(/"/g, ""));
        this.loader.hideLoader();
      }
    }, error => {
      console.log(error);// Error getting the data
      this.loader.hideLoader();
    });
  }
  autoAssign() {
    this.loader.showLoader();
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    let options = new RequestOptions({ headers: headers });
    let postParams = {
      "association": this.CurrentOrgId,
      "race_id":this.activeRaceIdd
    }
    this.http.post(BaseURLName.baseURL + "autoteamassign", JSON.stringify(postParams), options).map((response) => response.json()).subscribe(res => {
      console.log(res);
      if (!res.error) {
        this.loader.hideLoader();
        this.loadParticipantSummary();
        this.modalPopup.showSuccessAlert('Team Assigned Successfully');
      } else {
        this.loader.hideLoader();
        this.modalPopup.showFailedAlert('Can not Auto Assign Team');
      }
      // if (res.status == 1) {
      //   this.modalPopup.showSuccessAlert((res.message).replace(/"/g, ""));
      //   this.loadParticipantSummary();
      //   this.loader.hideLoader();
      // } else {
      //   this.modalPopup.showFailedAlert((res.message).replace(/"/g, ""));
      //   this.loader.hideLoader();
      // }
    }, error => {
      console.log(error);// Error getting the data
      this.loader.hideLoader();
    });
  }
}
