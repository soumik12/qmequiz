import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageProvider } from '../../@core/data/message.provider';
import { LoaderProvider } from '../../@core/data/loader.provider';
import { Headers, Http, RequestOptions } from '@angular/http';
import * as $ from 'jquery';
import { BaseURLName } from '../baseURLfile';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import { Router } from '@angular/router';
@Component({
  selector: 'ngx-event-setup',
  templateUrl: './event-setup.component.html',
  styleUrls: ['./event-setup.component.scss']
})
export class EventSetupComponent implements OnInit{
  public MCQType_update: boolean = false;
  public TBType_update: boolean=false;
  userForm: any;
  userForm1: any;
  userForm2: any;
  qstnTypes = ['Multiple Choice', 'Text Based', 'Multiple Choice and Text Based'];
  hintAllows = ['Yes', 'No'];
  qrAllows = ['Yes', 'No'];
  videoImgAllows = ['Yes', 'No'];
  hintAllowsText = ['Yes', 'No'];
  videoImgAllowsText = ['Yes', 'No'];
  eventName: any = [];
  monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  date: Date = new Date();
  public orgId: any;
  public OrgName: any;
  public activeEventName: any;
  public min = new Date();
  public MCQType: boolean = false;
  public TbType: boolean = false;
  public createEventName: any;
  public eventtiming: any;
  public eventStartTime: any;
  public eventEndtime: any;
  public tempTime: any;
  public tempeventStartTime: any;
  public tempeventEndtime: any;
  public eventrules: any;
  public exhibitorperQRcodes: any;
  public maxparticipantsperteam: any;
  public questype: any;
  public noofalternatives: any;
  public hintsAllowed: any;
  public videoImgAllowed: any;
  public hintsAllowedTB: any;
  public videoImgAllowedTB: any;
  /////////////Variables needed for Update Event////////////////
  public eventname_toUpdate: any;
  public questiontype_toShow: any;
  public hintsallowed_toShow: any;
  public videoImgAllowed_toShow: any;
  public hintsAllowedTB_toShow: any;
  public videoImgAllowedTB_toshow: any;
  public noofalt: any;
  public defaultStartTime: any;
  public defaultEndTime: any;
  public noof_questionstobeplayedstatus: boolean=false;
  public noof_questionstobeplayed: any;
  public noof_questionstobeplayedYN: any;
  public qrquestion: boolean = false;
  constructor(private formBuilder: FormBuilder, public modalPopup: MessageProvider, public loader: LoaderProvider, public http: Http, @Inject(SESSION_STORAGE) private storage: StorageService,public router:Router) {
    this.orgId = this.storage.get('CurrentOrgId');
    this.OrgName = this.storage.get('OrgName');
    this.activeEventName = this.storage.get('activeEventName');
    this.userForm = this.formBuilder.group({
      'eventname': ['', Validators.required],
      'eventtiming': ['', Validators.required],
      'eventrules': ['', Validators.required],
      'exhibitorperQRcodes': ['', Validators.required],
      'maxparticipantsperteam': ['', Validators.required],
      'questype': ['', Validators.required],
      'noofAlternatives': ['5', Validators.required],
      'hintsAllowed': ['Yes', ''],
      'videoImgAllowed': ['Yes', ''],
      'hintsAllowedTB': ['Yes', ''],
      'videoImgAllowedTB': ['Yes', ''],
      'qrAllowed': ['', Validators.required],
      'noof_questionstobeplayed':['']
    });
    this.userForm1 = this.formBuilder.group({
      //'zzz':[''],
      'eventname_update': [''],
      'eventtiming_update1': ['', Validators.required],
      'eventtiming_update': ['', Validators.required],
      'eventrules_update': ['', Validators.required],
      'exhibitorperQRcodes_update': ['', Validators.required],
      'maxparticipantsperteam_update': ['', Validators.required],
      'questype_update': ['', Validators.required],
      'noofAlternatives_update': [''],
      'hintsAllowed_update': [''],
      'videoImgAllowed_update': [''],
      'hintsAllowedTB_update': [''],
      'videoImgAllowedTB_update': ['']
    });
    this.userForm2 = this.formBuilder.group({
      'oldEventName':['',Validators.required],
      'neweventname':['',Validators.required]
    });
    this.loadEventNames();
  }
  ngOnInit() {
    console.log(this.storage.get('isLoggedin'));
    if (this.storage.get('isLoggedin') == null) {
      this.router.navigate(['pages/login']);
    }
  }
  getqrAllows(event) {
    console.log(event.target.value);
    this.noof_questionstobeplayedYN = event.target.value;
    if (this.noof_questionstobeplayedYN == "No") {
      this.noof_questionstobeplayedstatus = true;
    } else {
      this.noof_questionstobeplayedstatus = false;
    }
  }
  createEvent() {
    //this.loader.showLoader();
    this.createEventName = this.userForm.value.eventname;
    this.eventtiming = (this.userForm.value.eventtiming).toString();
    this.tempTime = this.eventtiming.split(",");
    this.tempeventStartTime = this.tempTime[0].split(" ");
    this.eventStartTime = this.tempeventStartTime[3] + '-' + this.tempeventStartTime[1] + '-' + this.tempeventStartTime[2] + ' ' + this.tempeventStartTime[4];
    this.tempeventEndtime = this.tempTime[1].split(" ");
    this.eventEndtime = this.tempeventEndtime[3] + '-' + this.tempeventEndtime[1] + '-' + this.tempeventEndtime[2] + ' ' + this.tempeventEndtime[4];
    this.eventrules = this.userForm.value.eventrules;
    this.exhibitorperQRcodes = this.userForm.value.exhibitorperQRcodes;
    this.maxparticipantsperteam = this.userForm.value.maxparticipantsperteam;
    this.questype = this.userForm.value.questype;
    this.noofalternatives = this.userForm.value.noofAlternatives;
    let xxx = null, yyy = null, zzz = null;
    this.hintsAllowed = this.userForm.value.hintsAllowed;
    this.videoImgAllowed = this.userForm.value.videoImgAllowed;
    this.hintsAllowedTB = this.userForm.value.hintsAllowedTB;
    this.videoImgAllowedTB = this.userForm.value.videoImgAllowedTB;
    this.noof_questionstobeplayed = this.userForm.value.noof_questionstobeplayed;
    if (this.hintsAllowed == "Yes") {
      this.hintsAllowed = 'Y';
    }
    if (this.hintsAllowed == "No") {
      this.hintsAllowed = 'N';
    }
    if (this.hintsAllowedTB == "Yes") {
      this.hintsAllowedTB = 'Y';
    }
    if (this.hintsAllowedTB == "No") {
      this.hintsAllowedTB = 'N';
    }
    if (this.videoImgAllowed == "Yes") {
      this.videoImgAllowed = "Y"
    }
    if (this.videoImgAllowed == "No") {
      this.videoImgAllowed = "N"
    }
    if (this.videoImgAllowedTB == "Yes") {
      this.videoImgAllowedTB = "Y"
    }
    if (this.videoImgAllowedTB == "No") {
      this.videoImgAllowedTB = "N"
    }
    if (this.questype == "Multiple Choice") {
      xxx = {
        hintsAllowed: this.hintsAllowed,
        videosImagesAllowed: this.videoImgAllowed,
        noOfAlternativesAllowed: this.noofalternatives
      };
    }
    if (this.questype == "Text Based") {
      yyy = {
        hintsAllowed: this.hintsAllowedTB,
        videosImagesAllowed: this.videoImgAllowedTB
      };
    }
    if (this.questype == "Multiple Choice and Text Based") {
      xxx = {
        hintsAllowed: this.hintsAllowed,
        videosImagesAllowed: this.videoImgAllowed,
        noOfAlternativesAllowed: this.noofalternatives
      };
      yyy = {
        hintsAllowed: this.hintsAllowedTB,
        videosImagesAllowed: this.videoImgAllowedTB
      };
    }
    console.log(this.noof_questionstobeplayedstatus+"   "+this.noof_questionstobeplayed);
    if (this.noof_questionstobeplayedstatus) {
      if (this.noof_questionstobeplayed == ''||this.noof_questionstobeplayed ==null) {
        this.qrquestion = true;
      } else {
        this.qrquestion = false;
      }
    }
    console.log(this.eventtiming + this.questype + JSON.stringify(xxx) + "  " + JSON.stringify(yyy) + this.eventStartTime + "  " + this.eventEndtime);
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    let options = new RequestOptions({ headers: headers });
    let postParams = {
      "raceName": this.createEventName,
      "associationId": this.orgId,
      "raceRules": this.eventrules,
      "startDateTime": this.eventStartTime,
      "endDateTime": this.eventEndtime,
      "exhibitors": this.exhibitorperQRcodes,
      "noOfParticipants": this.maxparticipantsperteam,
      "multipleChoiceQuestion": xxx,
      "textBasedQuestion": yyy,
    }
    this.http.post(BaseURLName.baseURL + "createrace", JSON.stringify(postParams), options).subscribe(data => {
      let response = JSON.parse(data['_body']);
      console.log(response);
      this.loader.hideLoader();
      if (response.status == 1) {
        ////Race is getting created without QR Code==>this.noof_questionstobeplayedYN == 'No'////
        if (this.noof_questionstobeplayedYN == 'No') { 
          this.addracewithoutqr(this.createEventName,this.noof_questionstobeplayed);
        } else {
          //Do nothing here for creating Race with QR code
        }
        this.setCreatedEvent_Active(this.createEventName);
        this.modalPopup.showSuccessAlert((JSON.stringify(response.message)).replace(/"/g, ""));
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
  addracewithoutqr(createEventName,noof_questionstobeplayed) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    let options = new RequestOptions({ headers: headers });
    let postParams = {
      "association": this.orgId,
      "race":createEventName,
      "no_of_questions":noof_questionstobeplayed
    }
    this.http.post(BaseURLName.baseURL + "addracewithoutqr", JSON.stringify(postParams), options).subscribe(data => {
      let response = JSON.parse(data['_body']);
      console.log(response);
      // if (response.status == 1) {
       
      //   this.modalPopup.showSuccessAlert((JSON.stringify(response.message)).replace(/"/g, ""));
      // }
      // else if (response.status == 0) {
      //   this.modalPopup.showFailedAlert((JSON.stringify(response.message)).replace(/"/g, ""));
      // }
    }, error => {
      console.log(error);// Error getting the data
    });
  }
  getQuestionType() {
    console.log(this.userForm.value.questype);
    this.questype = this.userForm.value.questype;
    if (this.questype == "Text Based") {
      this.MCQType = false;
      this.TbType = true;
    } else if (this.questype == "Multiple Choice") {
      this.TbType = false;
      this.MCQType = true;
    } else if (this.questype == "Multiple Choice and Text Based") {
      this.MCQType = true;
      this.TbType = true;
    }
  }
  getQuestiontype_update() {
    console.log(this.userForm1.value.questype_update);
    if (this.userForm1.value.questype_update == "Text Based") {
      this.MCQType_update = false;
      this.TBType_update = true;
    } else if (this.userForm1.value.questype_update == "Multiple Choice") {
      this.TBType_update = false;
      this.MCQType_update = true;
    } else if (this.userForm1.value.questype_update == "Multiple Choice and Text Based") {
      this.MCQType_update = true;
      this.TBType_update = true;
    }
  }
  getmaxParticipants(event) {
    console.log(Number(event.target.value));
    if (Number(event.target.value) == 0) {
      $("#maxnoofparticipants").val('');
      $("#maxnoofparticipants_update").val('');
    }
    if (Number(event.target.value) > 10) {
      $("#maxnoofparticipants").val('10');
      $("#maxnoofparticipants_update").val('10');
    }
  }
  getnoofAlternatives(event) {
    console.log(Number(event.target.value));
    if (Number(event.target.value) == 0) {
      $("#noof_alternatives").val('');
      $("#noof_alternatives_update").val('');
    }
    if (Number(event.target.value) > 5) {
      $("#noof_alternatives").val('5');
      $("#noof_alternatives_update").val('5');
    }
  }
  loadEventNames() {
    this.loader.showLoader();
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    let options = new RequestOptions({ headers: headers });
    let postParams = {
      "associationName": this.OrgName
    }
    this.http.post(BaseURLName.baseURL + "getracedetails", JSON.stringify(postParams), options).subscribe(data => {
      let response = JSON.parse(data['_body']);
      console.log(response);
      this.loader.hideLoader();
      if (response.status == 1) {
        this.eventName = response.races;
        //this.modalPopup.showSuccessAlert((JSON.stringify(response.message)).replace(/"/g,""));
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
  getEventNameWithDetails(evname) {
    this.eventname_toUpdate = evname;
    this.loader.showLoader();
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    let options = new RequestOptions({ headers: headers });
    let postParams = {
      "raceName": this.eventname_toUpdate,
      "associationId": this.orgId
    }
    this.http.post(BaseURLName.baseURL + "fetchracedetails", JSON.stringify(postParams), options).subscribe(data => {
      let response = JSON.parse(data['_body']);
      console.log(response);
      this.loader.hideLoader();
      if (response.status == 1) {
        if (response.raceDetails.type == "both") {
          this.questiontype_toShow = "Multiple Choice and Text Based";
          this.MCQType_update = true;
          this.TBType_update = true;
        }
        else if (response.raceDetails.type == "mcq") {
          this.questiontype_toShow = "Multiple Choice";
          this.MCQType_update = true;
          this.TBType_update = false;
        }
        else {
          this.questiontype_toShow = "Text Based";
          this.MCQType_update = false;
          this.TBType_update = true;
        }
        if (response.raceDetails.multipleChoiceQuestion != undefined) {
          if (response.raceDetails.multipleChoiceQuestion.hintsAllowed == "Y") {
            this.hintsallowed_toShow = "Yes";
          } else {
            this.hintsallowed_toShow = "No";
          }
          if (response.raceDetails.multipleChoiceQuestion.videosImagesAllowed == "Y") {
            this.videoImgAllowed_toShow = "Yes";
          }
          else {
            this.videoImgAllowed_toShow = "No";
          }
          this.noofalt = response.raceDetails.multipleChoiceQuestion.noOfAlternativesAllowed;
        }
        if (response.raceDetails.textBasedQuestion!=undefined) {
          if (response.raceDetails.textBasedQuestion.hintsAllowed == "Y") {
            this.hintsAllowedTB_toShow = "Yes";
          } else {
            this.hintsAllowedTB_toShow = "No";
          }
          if (response.raceDetails.textBasedQuestion.videosImagesAllowed == "Y") {
            this.videoImgAllowedTB_toshow = "Yes";
          } else {
            this.videoImgAllowedTB_toshow = "No";
          }
        }
        this.defaultStartTime = response.raceDetails.startDateTime;
        this.defaultEndTime = response.raceDetails.endDateTime;
        this.userForm1 = this.formBuilder.group({
          //'zzz': [''],
          'eventtiming_update':[''],
          'eventtiming_update1': [response.raceDetails.startDateTime+' to '+response.raceDetails.endDateTime, ''],
          'eventrules_update': [response.raceDetails.raceRules, Validators.required],
          'exhibitorperQRcodes_update': [response.raceDetails.exhibitors, Validators.required],
          'maxparticipantsperteam_update': [response.raceDetails.noOfParticipants, Validators.required],
          'questype_update': [this.questiontype_toShow, Validators.required],
          'noofAlternatives_update': [ this.noofalt,''],
          'hintsAllowed_update': [this.hintsallowed_toShow, ''],
          'videoImgAllowed_update': [this.videoImgAllowed_toShow, ''],
          'hintsAllowedTB_update': [this.hintsAllowedTB_toShow, ''],
          'videoImgAllowedTB_update': [this.videoImgAllowedTB_toshow, '']
        });
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

  updateEvent() {
    console.log(this.eventname_toUpdate);
    this.loader.showLoader();
    this.eventtiming = (this.userForm1.value.eventtiming_update).toString();
    if (this.eventtiming != '') {
      this.tempTime = this.eventtiming.split(",");
      this.tempeventStartTime = this.tempTime[0].split(" ");
      this.eventStartTime = this.tempeventStartTime[3] + '-' + this.tempeventStartTime[1] + '-' + this.tempeventStartTime[2] + ' ' + this.tempeventStartTime[4];
      this.tempeventEndtime = this.tempTime[1].split(" ");
      this.eventEndtime = this.tempeventEndtime[3] + '-' + this.tempeventEndtime[1] + '-' + this.tempeventEndtime[2] + ' ' + this.tempeventEndtime[4]; 
      console.log(this.eventStartTime+"///////"+this.eventEndtime);
    }
    if (this.eventtiming == '') {
      this.eventStartTime = this.defaultStartTime;
      this.eventEndtime = this.defaultEndTime;
    }
   
    this.eventrules = this.userForm1.value.eventrules_update;
    this.exhibitorperQRcodes = this.userForm1.value.exhibitorperQRcodes_update;
    this.maxparticipantsperteam = this.userForm1.value.maxparticipantsperteam_update;
    this.questype = this.userForm1.value.questype_update;
    this.noofalternatives = this.userForm1.value.noofAlternatives_update;
    let xxx = null, yyy = null, zzz = null;
    this.hintsAllowed = this.userForm1.value.hintsAllowed_update;
    this.videoImgAllowed = this.userForm1.value.videoImgAllowed_update;
    this.hintsAllowedTB = this.userForm1.value.hintsAllowedTB_update;
    this.videoImgAllowedTB = this.userForm1.value.videoImgAllowedTB_update;
    if (this.hintsAllowed == "Yes") {
      this.hintsAllowed = 'Y';
    }
    if (this.hintsAllowed == "No") {
      this.hintsAllowed = 'N';
    }
    if (this.hintsAllowedTB == "Yes") {
      this.hintsAllowedTB = 'Y';
    }
    if (this.hintsAllowedTB == "No") {
      this.hintsAllowedTB = 'N';
    }
    if (this.videoImgAllowed == "Yes") {
      this.videoImgAllowed = "Y"
    }
    if (this.videoImgAllowed == "No") {
      this.videoImgAllowed = "N"
    }
    if (this.videoImgAllowedTB == "Yes") {
      this.videoImgAllowedTB = "Y"
    }
    if (this.videoImgAllowedTB == "No") {
      this.videoImgAllowedTB = "N"
    }
    if (this.questype == "Multiple Choice") {
      xxx = {
        hintsAllowed: this.hintsAllowed,
        videosImagesAllowed: this.videoImgAllowed,
        noOfAlternativesAllowed: this.noofalternatives
      };
    }
    if (this.questype == "Text Based") {
      yyy = {
        hintsAllowed: this.hintsAllowedTB,
        videosImagesAllowed: this.videoImgAllowedTB
      };
    }
    if (this.questype == "Multiple Choice and Text Based") {
      xxx = {
        hintsAllowed: this.hintsAllowed,
        videosImagesAllowed: this.videoImgAllowed,
        noOfAlternativesAllowed: this.noofalternatives
      };
      yyy = {
        hintsAllowed: this.hintsAllowedTB,
        videosImagesAllowed: this.videoImgAllowedTB
      };
    }
    console.log(this.eventtiming + this.questype + JSON.stringify(xxx) + "  " + JSON.stringify(yyy) + this.eventStartTime + "  " + this.eventEndtime);
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    let options = new RequestOptions({ headers: headers });
    let postParams = {
      "raceName": this.eventname_toUpdate,
      "associationId": this.orgId,
      "raceRules": this.eventrules,
      "startDateTime": this.eventStartTime,
      "endDateTime": this.eventEndtime,
      "exhibitors": this.exhibitorperQRcodes,
      "noOfParticipants": this.maxparticipantsperteam,
      "multipleChoiceQuestion": xxx,
      "textBasedQuestion": yyy
    }
    this.http.post(BaseURLName.baseURL + "updateracedetails", JSON.stringify(postParams), options).subscribe(data => {
      let response = JSON.parse(data['_body']);
      console.log(response);
      this.loader.hideLoader();
      if (!response.error) {
        this.modalPopup.showSuccessAlert('Event updated Successfully');
      }
      else {
        this.modalPopup.showFailedAlert('Event is not Updated');
      }
      this.loader.hideLoader();
    }, error => {
      console.log(error);// Error getting the data
      this.loader.hideLoader();
    });
  }

  updateEventName() {
    console.log(this.userForm2.value.neweventname + " " + this.userForm2.value.oldEventName);
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    let options = new RequestOptions({ headers: headers });
    let postParams = {
      "associationName": this.OrgName,
      "oldRaceName": this.userForm2.value.oldEventName,
      "newRaceName": this.userForm2.value.neweventname
    }
    this.http.post(BaseURLName.baseURL + "updateracename", JSON.stringify(postParams), options).subscribe(data => {
      let response = JSON.parse(data['_body']);
      console.log(response);  
      if (response.status == 1) { 
        this.loadEventNames();
        this.userForm2 = this.formBuilder.group({
          'oldEventName':['',Validators.required],
          'neweventname':['',Validators.required]
        });
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
  setCreatedEvent_Active(createEventName) {
    this.loader.showLoader();
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    let options = new RequestOptions({ headers: headers });
    let postParams = {
      "raceName": createEventName,
      "associationName": this.OrgName,
      "isEnabled": 'Y'
    }
    this.http.post(BaseURLName.baseURL + "updateracestatus", JSON.stringify(postParams), options).subscribe(data => {
      let res = JSON.parse(data['_body']);
      console.log(res);
      if (res.status == 1) {
        //this.loadEvents();
        this.getDetails();
        //location.reload();
        this.modalPopup.showSuccessAlert('Event Status Updated Successfully!');
        this.loader.hideLoader();
      } else {
        this.modalPopup.showFailedAlert('Can not update Event status.');
      }
    }, error => {
      console.log(error);// Error getting the data
      this.loader.hideLoader();
    });
  }
  getDetails() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    let options = new RequestOptions({ headers: headers });
    let postParams = {
      "associationId": this.orgId
    }
    this.http.post(BaseURLName.baseURL + "getactiverace", JSON.stringify(postParams), options).subscribe(data => {
      let res = JSON.parse(data['_body']);
      console.log(res);
      if (res.status == 1) {
        this.storage.set('CurrentOrgId', this.orgId);
        this.storage.set('activeEventName', res.eventName);
        this.storage.set('activeEventId', res.eventId);
        this.willDisplay_Location_As_MenuItem(res.eventName);
      }
    }, (err) => {
      console.log(err);
    });
  }
  willDisplay_Location_As_MenuItem(eventName) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    let options = new RequestOptions({ headers: headers });
    let postParams = {
      "association": this.orgId,
	    "race":eventName
    }
    this.http.post(BaseURLName.baseURL + "checkracewithoutqr", JSON.stringify(postParams), options).subscribe(data => {
      let res = JSON.parse(data['_body']);
      console.log(res);
      if (!res.error) {
        console.log(res.data.status);
        localStorage.setItem("MenuItem_LocationHidden", res.data.status);
        setTimeout(() => { 
          location.reload();
        }, 500);
      } else {
      }
    }, (err) => {
      console.log(err);
    });
  }
}
