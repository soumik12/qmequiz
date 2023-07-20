import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Headers, Http, RequestOptions } from '@angular/http';
import { BaseURLName } from '../baseURLfile';
import { LoaderProvider } from '../../@core/data/loader.provider';
import { MessageProvider } from '../../@core/data/message.provider';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import * as $ from 'jquery';
@Component({
  selector: 'ngx-difflavel',
  templateUrl: './difflavel.component.html',
  styleUrls: ['./difflavel.component.scss']
})
export class DifflavelComponent implements OnInit {
  userForm: any;
  userForm1: any;
  public activeRaceIdd: any;
  public CurrentOrgId: any;
  public levelnames: any = [];
  public categoryList: any = [];
  public readonlyallFlag: boolean = false;
  public firstButtonDispStatus: boolean = false;
  public secondFormDispStatus: boolean = false;
  public cataName: any;
  public levelName:any;
  public questionValue: any;
  public hintPenalty: any;

  public noOfDifficultyLevel: any;
  public noOfQuestions: any;
  constructor(private formBuilder: FormBuilder, public http: Http, public loader: LoaderProvider, public modalPopup: MessageProvider, @Inject(SESSION_STORAGE) private storage: StorageService) {
    this.activeRaceIdd = this.storage.get('activeEventId');
    this.CurrentOrgId = this.storage.get('CurrentOrgId');
    this.userForm = this.formBuilder.group({
      'noofdifflavelspercata': ['', Validators.required],
      'noofquestionperdifflavel': ['', Validators.required],
    });
    this.userForm1 = this.formBuilder.group({
      'inputSelectLevelName': ['', Validators.required],
      'cataList': ['', Validators.required],
      'questionValue': ['', Validators.required],
      'hintPenalty': ['', Validators.required]
    });
    this.difficultyleveldetails();
    this.loadCategory();
  }

  ngOnInit() {
  }
  loadCategory() {
    this.loader.showLoader();
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    let options = new RequestOptions({ headers: headers });
    let postParams = {
      "raceId": Number(this.activeRaceIdd)
    }
    this.http.post(BaseURLName.baseURL + "getassociationcategory", JSON.stringify(postParams), options).subscribe(data => {
      let response = JSON.parse(data['_body']);
      console.log(response);
      this.loader.hideLoader();
      if (response.status == 1) {
        this.categoryList = response.categoryList;
      }
      else if (response.status == 0) {
        this.modalPopup.showFailedAlert((JSON.stringify(response.message)).replace(/"/g, ""));
      }
      this.loader.hideLoader();
    }, error => {
      console.log(error);// Error getting the data
      this.loader.hideLoader();
    });
  }
  difficultyleveldetails() {
    this.loader.showLoader();
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    let options = new RequestOptions({ headers: headers });
    let postParams = {
      "raceId": this.activeRaceIdd
    }
    this.http.post(BaseURLName.baseURL + "getdifficultyleveldetails", JSON.stringify(postParams), options).map((response) => response.json()).subscribe(res => {
      console.log(res);
      if (res.message == 1) {
        if (res.noOfDifficultyLevel == 0 && res.noOfQuestions == 0) {
          this.firstButtonDispStatus = true;
          this.readonlyallFlag = false;
          this.secondFormDispStatus = false;
        }
        else {
          this.firstButtonDispStatus = false;
          this.secondFormDispStatus = true;
          this.readonlyallFlag = true;
          this.userForm = this.formBuilder.group({
            'noofdifflavelspercata': [res.noOfDifficultyLevel, Validators.required],
            'noofquestionperdifflavel': [res.noOfQuestions, Validators.required],
          });
          if (res.noOfDifficultyLevel == 1) {
            this.levelnames = ['Easy'];
          }
          else
            if (res.noOfDifficultyLevel == 2) {
              this.levelnames = ['Easy', 'Hard'];
            } else
              if (res.noOfDifficultyLevel == 3) {
                this.levelnames = ['Easy', 'Medium', 'Hard'];
              }
        }//end main else
        this.loader.hideLoader();
      }
    }, error => {
      console.log(error);// Error getting the data
      this.loader.hideLoader();
    });
  }
  addValueDiffLevel_firstForm() {
    this.noOfQuestions = this.userForm.value.noofquestionperdifflavel;
    this.noOfDifficultyLevel = this.userForm.value.noofdifflavelspercata;
    this.loader.showLoader();
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    let options = new RequestOptions({ headers: headers });
    let postParams = {
      "raceId": this.activeRaceIdd,
      "noOfDifficultyLevel": this.noOfDifficultyLevel,
      "noOfQuestions": this.noOfQuestions,
      "associationId":this.CurrentOrgId,
    }
    this.http.post(BaseURLName.baseURL + "adddifficultylevel", JSON.stringify(postParams), options).map((response) => response.json()).subscribe(res => {
      console.log(res);
      if (res.status == 1) {
        this.modalPopup.showSuccessAlert((res.message).replace(/"/g, ""));
        this.difficultyleveldetails();
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
  addDifficultyLevel_secondForm() {
    this.cataName = this.userForm1.value.cataList;
    this.levelName =this.userForm1.value.inputSelectLevelName;
    this.questionValue = this.userForm1.value.questionValue;;
    this.hintPenalty =this.userForm1.value.hintPenalty;
    this.loader.showLoader();
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    let options = new RequestOptions({ headers: headers });
    let postParams = {
      "raceId": this.activeRaceIdd,
      "category":this.cataName,
      "level": this.levelName,
      "questionValue": Number(this.questionValue),
      "hintPenelty": Number(this.hintPenalty),
    }
    this.http.post(BaseURLName.baseURL + "adddifficultylevel", JSON.stringify(postParams), options).map((response) => response.json()).subscribe(res => {
      console.log(res);
      if (res.status == 1) {
        this.modalPopup.showSuccessAlert((res.message).replace(/"/g, ""));
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
  getmaxDiffLevels(event) {
    console.log(Number(event.target.value));
    if (Number(event.target.value) == 0) {
      $("#difflavel").val('');
    }
    if (Number(event.target.value) > 3) {
      $("#difflavel").val('3');
    }
  }
  getmaxQues(event) {
    console.log(Number(event.target.value));
    if (Number(event.target.value) == 0) {
      $("#noofquestionperdifflavel").val('');
    }
    if (Number(event.target.value) > 10) {
      $("#noofquestionperdifflavel").val('10');
    }
  }
  getDefaultvalue() {
    this.cataName = this.userForm1.value.cataList;
    this.levelName = this.userForm1.value.inputSelectLevelName;
    console.log(this.cataName, this.levelName);
    this.loader.showLoader();
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    let options = new RequestOptions({ headers: headers });
    let postParams = {
      "level": this.levelName,
      "raceId": this.activeRaceIdd,
      "category": this.cataName
    }
    this.http.post(BaseURLName.baseURL + "getcategorydifficultylevel", JSON.stringify(postParams), options).map((response) => response.json()).subscribe(res => {
      console.log(res);
      if (res.message == 1) {
        //this.modalPopup.showSuccessAlert((res.message).replace(/"/g, ""));
        $("#questionValue").val(res.difficultyLevel.question_value);
        $("#hintPenalty").val(res.difficultyLevel.hintPenelty);
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
}
