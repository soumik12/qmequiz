import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SmartTableService } from '../../@core/data/smart-table.service';
import { LocalDataSource } from "ng2-smart-table";
import { LoaderProvider } from '../../@core/data/loader.provider';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import { MessageProvider } from '../../@core/data/message.provider';
import { Headers, Http, RequestOptions } from '@angular/http';
import { BaseURLName } from '../../pages/baseURLfile';
import { reject } from 'q';
import { Router } from '@angular/router';
@Component({
  selector: 'ngx-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent implements OnInit {
  userForm: any;
  settings = {
    //selectMode: 'multi',
    
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    actions: {
      add: false,
      edit: true,
      delete: true,
    },
    columns: {
      teamName: {
        title: 'Team Name',
        type: 'string',
      },
      // password: {
      //   title: 'Team Password',
      //   type: 'string',
      // }
    },
  };
  source: LocalDataSource = new LocalDataSource();
  data: any = [];
  public activeRaceIdd: any;
  public teamName: any;
  public teamPass: any;
  public CurrentOrgId: any;
  constructor(private formBuilder: FormBuilder, private service: SmartTableService, public loader: LoaderProvider, @Inject(SESSION_STORAGE) private storage: StorageService, public modalPopup: MessageProvider, public http: Http,public router:Router) {
    this.userForm = this.formBuilder.group({
      'teamname': ['', Validators.required],
      //'teampass': ['', Validators.required]
    });
    this.activeRaceIdd = this.storage.get('activeEventId');
    if (this.activeRaceIdd == null) {
      this.modalPopup.showFailedAlert('No Event is Active. Please Active One Event.');
    } else {
      this.service.loadTeams().then((result) => {
        console.log(result);
        this.data = result;
        this.source.load(this.data);
        //this.source.load(this.data);
        this.loader.hideLoader();
      });
    }
  }
  onUserRowSelect(event): void {
    console.log(event);
  }
  ngOnInit() {
    console.log(this.storage.get('isLoggedin'));
    if (this.storage.get('isLoggedin') == null) {
      this.router.navigate(['pages/login']);
    }
  }
  showSummary() {

  }
  createTeam() {
    this.loader.showLoader();
    this.teamName = this.userForm.value.teamname;
    this.teamPass = this.userForm.value.teampass;
    this.CurrentOrgId = this.storage.get('CurrentOrgId');
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    let options = new RequestOptions({ headers: headers });

    let postParams = {
      "teamName": this.teamName,
      // "password": this.teamPass,
      "password":"1234",
      "associationId": this.CurrentOrgId,
      "raceId": this.activeRaceIdd
    }
    this.http.post(BaseURLName.baseURL + "createteam", JSON.stringify(postParams), options).map((response) => response.json()).subscribe(res => {
      console.log(res);
      if (res.status == 1) {
        this.modalPopup.showSuccessAlert('Team Created Sussessfully.');
        //Load newly created Team after new creation
        this.service.loadTeams().then((result) => {
          console.log(result);
          this.data = result;
          this.source.load(this.data);
          //this.source.load(this.data);
        });
        //Make the form blank again
        this.userForm = this.formBuilder.group({
          'teamname': ['', Validators.required],
          //'teampass': ['', Validators.required]
        });
        this.loader.hideLoader();
      } else {
        this.modalPopup.showFailedAlert('Same Name can not be assigned to different Team.');
        this.loader.hideLoader();
      }
    }, error => {
      console.log(error);// Error getting the data
      this.loader.hideLoader();
    });
  }
  onDeleteConfirm(event) {
    console.log(event.data.teamName);
    const decision = this.modalPopup.showYesNoConfirm("Alert !!", `Do you want to delete the Team ${event.data.teamName}?`);
    decision.result.then((result) => {
      this.loader.showLoader();
      console.log(result);
      let headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      let options = new RequestOptions({ headers: headers });
      let postParams = {
        "teamName": event.data.teamName,
        "raceId": this.activeRaceIdd
      }
      this.http.post(BaseURLName.baseURL + "deleteteam", JSON.stringify(postParams), options).map((response) => response.json()).subscribe(res => {
        console.log(res);
        if (res.status == 1) {
          this.modalPopup.showSuccessAlert('Team Deleted Successfully.');
          //Load existing set of Teams
          this.service.loadTeams().then((result) => {
            console.log(result);
            this.data = result;
            this.source.load(this.data);
          });
          this.loader.hideLoader();
        }
      }, error => {
        console.log(error);// Error getting the data
        this.loader.hideLoader();
      });
    }, (err) => {
      reject(err);
    });
  }
  onEditConfirm(event) {
    console.log(event);
    console.log(event.data.teamName + "  " + event.newData.teamName);
    if (event.data.teamName != event.newData.teamName) { //If two names are not identical
      let headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      let options = new RequestOptions({ headers: headers });
      let postParams = {
        "raceId": this.activeRaceIdd,
        "oldTeamName": event.data.teamName,
        "newTeamName": event.newData.teamName
      }
      this.http.post(BaseURLName.baseURL + "updateteamname", JSON.stringify(postParams), options).map((response) => response.json()).subscribe(res => {
        console.log(res);
        if (res.status == 1) {
          this.modalPopup.showSuccessAlert('Team Name Updated Sussessfully.');
          //Load existing set of Teams
          this.service.loadTeams().then((result) => {
            console.log(result);
            this.data = result;
            this.source.load(this.data);
          });
          this.loader.hideLoader();
        }
      }, error => {
        console.log(error);// Error getting the data
        this.loader.hideLoader();
      });
    }
    if (event.data.password != event.newData.password) { //If two passwords are not identical
      let headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      let options = new RequestOptions({ headers: headers });
      let postParams = {
        "raceId": this.activeRaceIdd,
        "teamName": event.data.teamName,
        "password": event.newData.password
      }
      this.http.post(BaseURLName.baseURL + "updateteampassword", JSON.stringify(postParams), options).map((response) => response.json()).subscribe(res => {
        console.log(res);
        if (res.status == 1) {
          this.modalPopup.showSuccessAlert('Password Updated Sussessfully.');
          //Load existing set of Teams
          this.service.loadTeams().then((result) => {
            console.log(result);
            this.data = result;
            this.source.load(this.data);
          });
          this.loader.hideLoader();
        }
      }, error => {
        console.log(error);// Error getting the data
        this.loader.hideLoader();
      });
    }
  }
}
