import { Component} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbProgressbarConfig } from '@ng-bootstrap/ng-bootstrap';
import { Headers, Http, RequestOptions } from '@angular/http';
import { LoaderProvider } from '../../@core/data/loader.provider';
import { BaseURLName } from '../baseURLfile';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { MessageProvider } from '../../@core/data/message.provider';
@Component({
  selector: 'ngx-activity-status',
  templateUrl: './activity-status.component.html',
  styleUrls: ['./activity-status.component.scss']
})
export class ActivityStatusComponent  {
  eventID: any;
  organizationID: any;
  progress: Array<any> = [];
  extrafields: any = [];
  colorcode: any;
  ff = [' One', ' Two', ' Three', ' Four', ' Five'];
  title_arr = ['Race Parameters Defined', 'Teams Formed', 'Categories Created', 'Levels Created', 'Images/Videos Uploaded', 'Hints Created', 'Participants Registered', 'Questions Composed', 'QR Codes Scanned'];
  userForm: any;
  userForm1: any;
  constructor(public route: ActivatedRoute, config: NgbProgressbarConfig,public http: Http,public loader:LoaderProvider, private formBuilder:FormBuilder,public modalPopup: MessageProvider) {
    this.route.params.subscribe((params) => {
      console.log(JSON.stringify(params));
      this.eventID = params['raceId'];
      this.organizationID = params['associationId'];
      console.log(this.eventID);
      console.log(this.organizationID);
    });
    this.showActivitiesdetails();
    //config.max = 100;
    config.striped = true;
    config.animated = true;
    config.type = 'success';
    config.height = '20px';
    //  dummy data 2
    for (let i = 0; i < this.title_arr.length; i++) {
      this.progress.push({ title: this.title_arr[i], value: 0 });
    }
    // The range is "5", because maximum fields are 5
    for (let i = 0; i < 5; i++){
      this.extrafields.push({ title: "Field"+(i+1), value: 0 });
    }
    this.userForm = this.formBuilder.group({
      'paramValue0': ['', ''],
      'paramValue1': ['', ''],
      'paramValue2': ['', ''],
      'paramValue3': ['', ''],
      'paramValue4': ['', ''],
      'paramValue5': ['', ''],
      'paramValue6': ['', ''],
      'paramValue7': ['', ''],
      'paramValue8':['',''],
    })
    this.userForm1 = this.formBuilder.group({
      'paramValue10': ['', ''],
      'paramValue11': ['', ''],
      'paramValue12': ['', ''],
      'paramValue13': ['', ''],
      'paramValue14': ['', ''],
      'paramValue20': ['', ''],
      'paramValue21': ['', ''],
      'paramValue22': ['', ''],
      'paramValue23': ['', ''],
      'paramValue24': ['', '']
    })
  }
  update() {
    // console.log(this.userForm.value.paramValue0);
    // console.log(this.userForm.value.paramValue1);
    // console.log(this.userForm.value.paramValue2);
    // console.log(this.userForm.value.paramValue3);
    // console.log(this.userForm.value.paramValue4);
    // console.log(this.userForm.value.paramValue5);
    // console.log(this.userForm.value.paramValue6);
    // console.log(this.userForm.value.paramValue7);
    // console.log(this.userForm.value.paramValue8);
    // console.log(this.userForm1.value.paramValue24);
    this.loader.showLoader();
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    let options = new RequestOptions({ headers: headers });
    let postParams = {
      "associationId": this.organizationID,
      "raceId": this.eventID,
      "raceParametresDefined": this.userForm.value.paramValue0,
      "teamCreated": this.userForm.value.paramValue1,
      "categoriesCreated": this.userForm.value.paramValue2,
      "levelsCreated": this.userForm.value.paramValue3,
      "imagesUploaded": this.userForm.value.paramValue4,
      "hintsCreated": this.userForm.value.paramValue5,
      "participantsRegistered": this.userForm.value.paramValue6,
      "questionsComposed": this.userForm.value.paramValue7,
      "qrCreated": this.userForm.value.paramValue8,
      "field1": this.userForm1.value.paramValue10+';'+this.userForm1.value.paramValue20,
      "field2": this.userForm1.value.paramValue11+';'+this.userForm1.value.paramValue21,
      "field3": this.userForm1.value.paramValue12+';'+this.userForm1.value.paramValue22,
      "field4": this.userForm1.value.paramValue13+';'+this.userForm1.value.paramValue23,
      "field5": this.userForm1.value.paramValue14+';'+this.userForm1.value.paramValue24
    }
    this.http.post(BaseURLName.baseURL + "updateactivities", JSON.stringify(postParams), options).subscribe(data => {
      let response = JSON.parse(data['_body']);
      console.log(response);
      if (response.status == 1) {
        this.loader.hideLoader();
        this.showActivitiesdetails();
        this.modalPopup.showSuccessAlert((JSON.stringify(response.message)).replace(/"/g,"")); 
      }
      else {
        this.loader.hideLoader();
        this.modalPopup.showFailedAlert((JSON.stringify(response.message)).replace(/"/g,""));
      }
    }, error => {
      console.log(error);// Error getting the data
      this.loader.hideLoader();
    });
  }
  changedValue(data, index, c) {
    this.progress[index].value = data;
    this.progress[index].type = c;
  }
  changedValue1(data, index, c) {
    this.extrafields[index].value = data;
    this.extrafields[index].type = c;
  }
  showActivitiesdetails() {
    this.loader.showLoader();
    let headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      let options = new RequestOptions({ headers: headers });
      let postParams = {
        "associationId": this.organizationID,
        "id": this.eventID
      }
      this.http.post(BaseURLName.baseURL + "viewactivities", JSON.stringify(postParams), options).subscribe(data => {
        let response = JSON.parse(data['_body']);
        console.log(response);
        this.loader.hideLoader();
        /*------------All conditions are here--------------------*/
        ///////////////////////////////////
              if (response.activities.raceParametresDefined >= 0 && response.activities.raceParametresDefined <= 40) {
                //red
                this.colorcode = 'danger';
                this.changedValue(response.activities.raceParametresDefined, 0,this.colorcode);
              }
              if (response.activities.raceParametresDefined >=41 && response.activities.raceParametresDefined<=99) {
                //yellow
                this.colorcode = 'warning';
                this.changedValue(response.activities.raceParametresDefined, 0,this.colorcode);
              }
              if (response.activities.raceParametresDefined == 100) {
                //green
                this.colorcode = 'success';
                this.changedValue(response.activities.raceParametresDefined, 0,this.colorcode);
              }
        /////////////////////////////////////
              if (response.activities.teamCreated >=0 && response.activities.teamCreated<=40) {
                this.colorcode = 'danger';
                this.changedValue(response.activities.teamCreated, 1,this.colorcode);
              }
              if (response.activities.teamCreated >=41 && response.activities.teamCreated<=99) {
                this.colorcode = 'warning';
                this.changedValue(response.activities.teamCreated, 1,this.colorcode);
              }
              if (response.activities.teamCreated == 100) {
                this.colorcode = 'success';
                this.changedValue(response.activities.teamCreated, 1,this.colorcode);
              }
        //////////////////////////////////////////
              if (response.activities.categoriesCreated >=0 && response.activities.categoriesCreated<=40) {
                this.colorcode = 'danger';
                this.changedValue(response.activities.categoriesCreated, 2,this.colorcode);
              }
              if (response.activities.categoriesCreated >=41 && response.activities.categoriesCreated<=99) {
                this.colorcode = 'warning';
                this.changedValue(response.activities.categoriesCreated, 2,this.colorcode);
              }
              if (response.activities.categoriesCreated == 100) {
                this.colorcode = 'success';
                this.changedValue(response.activities.categoriesCreated, 2,this.colorcode);
              }
        ///////////////////////////////////////////
            if (response.activities.levelsCreated >=0 && response.activities.levelsCreated<=40) {
              this.colorcode = 'danger';
              this.changedValue(response.activities.levelsCreated, 3,this.colorcode);
            }
            if (response.activities.levelsCreated >=41 && response.activities.levelsCreated<=99) {
              this.colorcode = 'warning';
              this.changedValue(response.activities.levelsCreated, 3,this.colorcode);
            }
            if (response.activities.levelsCreated == 100) {
              this.colorcode = 'success';
              this.changedValue(response.activities.levelsCreated, 3,this.colorcode);
            }
      ////////////////////////////////////////////////
            if (response.activities.imagesUploaded >=0 && response.activities.imagesUploaded<=40) {
              this.colorcode = 'danger';
              this.changedValue(response.activities.imagesUploaded, 4,this.colorcode);
            }
            if (response.activities.imagesUploaded >=41 && response.activities.imagesUploaded<=99) {
              this.colorcode = 'warning';
              this.changedValue(response.activities.imagesUploaded, 4,this.colorcode);
            }
            if (response.activities.imagesUploaded == 100) {
              this.colorcode = 'success';
              this.changedValue(response.activities.imagesUploaded, 4,this.colorcode);
            }
        //////////////////////////////////////////////////
            if (response.activities.hintsCreated >=0 && response.activities.hintsCreated<=40) {
              this.colorcode = 'danger';
              this.changedValue(response.activities.hintsCreated, 5,this.colorcode);
            }
            if (response.activities.hintsCreated >=41 && response.activities.hintsCreated<=99) {
              this.colorcode = 'warning';
              this.changedValue(response.activities.hintsCreated, 5,this.colorcode);
            }
            if (response.activities.hintsCreated == 100) {
              this.colorcode = 'success';
              this.changedValue(response.activities.hintsCreated, 5,this.colorcode);
            }
        ///////////////////////////////////////
            if (response.activities.participantsRegistered >=0 && response.activities.participantsRegistered<=40) {
              this.colorcode = 'danger';
              this.changedValue(response.activities.participantsRegistered, 6,this.colorcode);
            }
            if (response.activities.participantsRegistered >=41 && response.activities.participantsRegistered<=99) {
              this.colorcode = 'warning';
              this.changedValue(response.activities.participantsRegistered, 6,this.colorcode);
            }
            if (response.activities.participantsRegistered == 100) {
              this.colorcode = 'success';
              this.changedValue(response.activities.participantsRegistered, 6,this.colorcode);
            }
        ///////////////////////////////////////
          if (response.activities.questionsComposed >=0 && response.activities.questionsComposed<=40) {
            this.colorcode = 'danger';
              this.changedValue(response.activities.questionsComposed, 7,this.colorcode);
            }
            if (response.activities.questionsComposed >=41 && response.activities.questionsComposed<=99) {
              this.colorcode = 'warning';
              this.changedValue(response.activities.questionsComposed, 7,this.colorcode);
            }
            if (response.activities.questionsComposed == 100) {
              this.colorcode = 'success';
              this.changedValue(response.activities.questionsComposed, 7,this.colorcode);
            }
        /////////////////////////////////
            if (response.activities.qrCreated >=0 && response.activities.qrCreated<=40) {
              this.colorcode = 'danger';
              this.changedValue(response.activities.qrCreated, 8,this.colorcode);
            }
            if (response.activities.qrCreated >=41 && response.activities.qrCreated<=99) {
              this.colorcode = 'warning';
              this.changedValue(response.activities.qrCreated, 8,this.colorcode);
            }
            if (response.activities.qrCreated == 100) {
                this.colorcode = 'success';
              this.changedValue(response.activities.qrCreated, 8,this.colorcode);
            }
            let f1 = response.activities.field1;
            let f2 =response.activities.field2;
            let f3 =response.activities.field3;
            let f4 =response.activities.field4;
            let f5 = response.activities.field5;
            let f11 = f1.split(';'); 
            let f12 = f2.split(';');
            let f13 = f3.split(';');
            let f14 = f4.split(';');
            let f15 = f5.split(';');
            if (f1 != '') {
              if (f11[1] >= 0 && f11[1] <= 40) {
                this.colorcode = 'danger';
                this.changedValue1(f11[1], 0,this.colorcode);
              }
              if (f11[1] >= 41 && f11[1] <= 99) {
                this.colorcode = 'warning';
                this.changedValue1(f11[1], 0,this.colorcode);
              }
              if (f11[1] == 100) {
                this.colorcode = 'success';
                this.changedValue1(f11[1], 0,this.colorcode);
              }
            }
            if (f2 != '') {
              if (f12[1] >=0 && f12[1]<=40) {
                this.colorcode = 'danger';
                this.changedValue1(f12[1], 1,this.colorcode);
              }
              if (f12[1] >=41 && f12[1]<=99) {
                this.colorcode = 'warning';
                this.changedValue1(f12[1], 1,this.colorcode);
              }
              if (f12[1] == 100) {
                this.colorcode = 'success';
                this.changedValue1(f12[1], 1,this.colorcode);
              }
        } 
        if (f3 != '') { 
          if (f13[1] >=0 && f13[1]<=40) {
            this.colorcode = 'danger';
            this.changedValue1(f13[1], 2,this.colorcode);
          }
          if (f13[1] >=41 && f13[1]<=99) {
            this.colorcode = 'warning';
            this.changedValue1(f13[1], 2,this.colorcode);
          }
          if (f13[1] == 100) {
            this.colorcode = 'success';
            this.changedValue1(f13[1], 2,this.colorcode);
          }
      }
      if (f4 != '') { 
          if (f14[1] >=0 && f14[1]<=40) {
            this.colorcode = 'danger';
            this.changedValue1(f14[1], 3,this.colorcode);
          }
          if (f14[1] >=41 && f14[1]<=99) {
            this.colorcode = 'warning';
            this.changedValue1(f14[1], 3,this.colorcode);
          }
          if (f14[1] == 100) {
            this.colorcode = 'success';
            this.changedValue1(f14[1], 3,this.colorcode);
          }
      }
      if (f5 != '') { 
          if (f15[1] >=0 && f15[1]<=40) {
            this.colorcode = 'danger';
            this.changedValue1(f15[1], 4,this.colorcode);
          }
          if (f15[1] >=41 && f15[1]<=99) {
            this.colorcode = 'warning';
            this.changedValue1(f15[1], 4,this.colorcode);
          }
          if (f15[1] == 100) {
            this.colorcode = 'success';
            this.changedValue1(f15[1], 4,this.colorcode);
          }
          this.userForm = this.formBuilder.group({
            'paramValue0': [response.activities.raceParametresDefined, ''],
            'paramValue1': [response.activities.teamCreated, ''],
            'paramValue2': [response.activities.categoriesCreated, ''],
            'paramValue3': [response.activities.levelsCreated, ''],
            'paramValue4': [response.activities.imagesUploaded, ''],
            'paramValue5': [response.activities.hintsCreated, ''],
            'paramValue6': [response.activities.participantsRegistered, ''],
            'paramValue7': [response.activities.questionsComposed, ''],
            'paramValue8': [response.activities.qrCreated,''],
          })
       
          this.userForm1 = this.formBuilder.group({
            'paramValue10': [f11[0], ''],
            'paramValue11': [f12[0], ''],
            'paramValue12': [f13[0], ''],
            'paramValue13': [f14[0], ''],
            'paramValue14': [f15[0], ''],
            'paramValue20': [f11[1], ''],
            'paramValue21': [f12[1], ''],
            'paramValue22': [f13[1], ''],
            'paramValue23': [f14[1], ''],
            'paramValue24': [f15[1], '']
          })
      }
        /*----------------conditions are closed--------------------*/
      }, error => {
        this.loader.hideLoader();
        console.log(error);// Error getting the data
        this.modalPopup.showFailedAlert("There is no Internet Connection.");
      });
  }
}
