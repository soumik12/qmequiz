import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageProvider } from '../../@core/data/message.provider';
import { Headers, Http, RequestOptions } from '@angular/http';
import { BaseURLName } from '../baseURLfile';
import { LoaderProvider } from '../../@core/data/loader.provider';
import { Router } from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import * as $ from 'jquery';
import { reject } from 'q';
declare var AWS: any;
@Component({
  selector: 'ngx-gamequestion-mcms',
  templateUrl: './gamequestion-mcms.component.html',
  styleUrls: ['./gamequestion-mcms.component.scss']
})
export class GamequestionMCMSComponent implements OnInit {

  userForm: any;
  public data: any = [];
  public oldData: any = [];
  public optionsfromAPI: any = [];
  public activeEventId: any;
  public CurrentOrgId: any;
  public categoryList: any = [];
  public cataName: any;
  public levelName: any;
  public numbers: any;
  public selectedFiles: any;
  public eventt: any;
  public selectedFilesTB: any;
  public eventtTB: any;
  public findIndex: any;
  public fileExtension: any;
  public questionTypeName: any;
  ///For MCQ Type////////////////
  public inputQuestionText_MCQ: any;
  public answer0: any;
  public answer1: any;
  public answer2: any;
  public answer3: any;
  public answer4: any;
  public levelnames: any = [];
  public questionType: any = [];
  public dispMCQStatus: boolean = false;
  public dispMCQHintStatus: boolean = false;
  public dispMCQFileUploadStatus: boolean = false;
  public xxx: any;
  public yyy: any;
  public answers: any = [];
  public alloptions: any = [];
  public hintarr: any = [];
  public ansarr: any = [];
  public answerarrHasContent: any = [];
  //////For Text Based type//////////////////
  public dispTBStatus: boolean = false;
  public inputQuestionText_TB: any;
  public inputHint_TB: any;
  public inputAnswer_TB: any;
  public dispTBHintStatus: boolean = false;
  public dispTBFileUploadStatus: boolean = false;
  public showSelectAllchkbox: boolean = false;
  public chkCorrect: any = [];
  constructor(public modalPopup: MessageProvider, private formBuilder: FormBuilder, private http: Http, public loader: LoaderProvider, public router: Router, @Inject(SESSION_STORAGE) private storage: StorageService) {
    this.activeEventId = this.storage.get('activeEventId');
    this.CurrentOrgId = this.storage.get('CurrentOrgId');
    this.userForm = this.formBuilder.group({
      'cataList': ['', Validators.required],
      'inputSelectLevelName': ['', Validators.required],
      'questionText': ['', Validators.required],
      'qType': ['', Validators.required]
      // 'answerTxt0': ['', Validators.required],
      // 'answerTxt1': ['', Validators.required],
      // 'answerTxt2': ['', Validators.required],
      // 'answerTxt3': ['', Validators.required],
      // 'answerTxt4': ['', Validators.required]
    });
    this.loadCategory();
    this.getQuestionType();
    this.loadQuestionSummary();
  }

  ngOnInit() {
    console.log(this.storage.get('isLoggedin'));
    if (this.storage.get('isLoggedin') == null) {
      this.router.navigate(['pages/login']);
    }
  }
  selectFile_MCQ(event) {
    this.selectedFiles = event.target.files;
    this.eventt = event;
  }
  selectFile_TB(event) {
    this.selectedFilesTB = event.target.files;
    this.eventtTB = event;
  }
  loadCategory() {
    this.loader.showLoader();
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    let options = new RequestOptions({ headers: headers });
    let postParams = {
      "raceId": Number(this.activeEventId)
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
  getAllDifficultylevels() {
    this.loader.showLoader();
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    let options = new RequestOptions({ headers: headers });
    let postParams = {
      "raceId": Number(this.activeEventId),
      "category": this.userForm.value.cataList
    }
    this.http.post(BaseURLName.baseURL + "getalldifficultylevels", JSON.stringify(postParams), options).subscribe(data => {
      let response = JSON.parse(data['_body']);
      console.log(response);
      this.loader.hideLoader();
      if (response.status == 1) {
        if (response.categoryList.length > 0) {
          this.levelnames = response.categoryList;
          this.getQuesType();
        } else {
          this.modalPopup.showFailedAlert(`Difficulty levels not created yet for ${this.userForm.value.cataList}`);
        }

        this.loader.hideLoader();
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
  getQuestionType() {
    this.loader.showLoader();
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    let options = new RequestOptions({ headers: headers });
    let postParams = {
      "raceId": Number(this.activeEventId)
    }
    this.http.post(BaseURLName.baseURL + "getallowedquestiontype", JSON.stringify(postParams), options).subscribe(data => {
      let response = JSON.parse(data['_body']);
      console.log(response);
      this.loader.hideLoader();
      if (response.status == 1) {
        if (response.questionType == 'mcq/tbq') {
          this.questionType = ['Multiple Choice', 'Text Based'];
        } else if (response.questionType == 'mcq') {
          this.questionType = ['Multiple Choice'];
        } else if (response.questionType == 'tbq') {
          this.questionType = ['Text Based'];
        }
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
  getQuesType() {
    this.loader.showLoader();
    console.log(this.userForm.value.qType);
    if (this.userForm.value.qType == "Multiple Choice") {
      this.questionTypeName = 'mcq';
    }
    else {
      this.questionTypeName = 'txt';
    }
    if (this.userForm.value.qType == "Multiple Choice") {
      this.dispMCQStatus = true;
      this.dispTBStatus = false;
    } else if (this.userForm.value.qType == "Text Based") {
      this.dispMCQStatus = false;
      this.dispTBStatus = true;
    } else {
      this.dispMCQStatus = false;
      this.dispTBStatus = false;
    }
    //this.showQuestionCount(this.userForm.value.qType);// To display counter in text box
    this.willDisplayFileUpload_and_Hint(this.questionTypeName);
  }
  showQuestionCount(questionType) {    //This function is not necessary here as we are not 
    if (questionType == 'Multiple Choice') {
      questionType = 'mcq';
    }
    else {
      questionType = 'txt';
    }
    this.cataName = this.userForm.value.cataList;
    this.levelName = this.userForm.value.inputSelectLevelName;
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    let options = new RequestOptions({ headers: headers });
    let postParams = {
      "id": Number(this.activeEventId),
      "category": this.cataName,
      "level": this.levelName,
      "questionType": questionType
    }
    this.http.post(BaseURLName.baseURL + "getquestionnumber", JSON.stringify(postParams), options).subscribe(data => {
      let response = JSON.parse(data['_body']);
      console.log(response);
      this.loader.hideLoader();
      if (response.status == 1) {
        $("#questionCounter").val(response.questionNumber);
        this.willDisplayFileUpload_and_Hint(questionType);
      }
      else if (response.status == 0) {
        $("#questionCounter").val('Complete');
        //Now hide two types of Question's UI, as we can't add question beyond the limit
        this.dispMCQStatus = false;
        this.dispTBStatus = false;
      }
    }, error => {
      console.log(error);// Error getting the data
    });
  }
  willDisplayFileUpload_and_Hint(questionType) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    let options = new RequestOptions({ headers: headers });
    let postParams = {
      "id": Number(this.activeEventId),
      "questionType": questionType
    }
    this.http.post(BaseURLName.baseURL + "ishintallowed", JSON.stringify(postParams), options).subscribe(data => {
      let response = JSON.parse(data['_body']);
      console.log(response);
      this.loader.hideLoader();
      if (response.status == 1) {
        //////Set up for MCQ Type/////////////
        if (questionType == 'mcq') {
          if (response.isHintAllowed == 'Y') {
            this.dispMCQHintStatus = true; // Show hint radios
          }
          if (response.isVideosAllowed == 'Y') {
            this.dispMCQFileUploadStatus = true; // Show Image/Video/MP3 input dialog
          }
          this.loadNoofAnswerTextBoxes();
        }
        /////Set Up for TB type///////////
        if (questionType == 'txt') {
          if (response.isHintAllowed == 'Y') {
            this.dispTBHintStatus = true; // Show hint input box
          }
          if (response.isVideosAllowed == 'Y') {
            this.dispTBFileUploadStatus = true;
          }
        }
      }
      else if (response.status == 0) {
        console.log(response);
      }
    }, error => {
      console.log(error);// Error getting the data
    });
  }

  loadNoofAnswerTextBoxes() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    let options = new RequestOptions({ headers: headers });
    let postParams = {
      "id": Number(this.activeEventId)
    }
    this.http.post(BaseURLName.baseURL + "noofchoice", JSON.stringify(postParams), options).subscribe(data => {
      let response = JSON.parse(data['_body']);
      console.log(response);
      this.loader.hideLoader();
      if (response.status == 1) {
        this.numbers = Array(Number(response.noOfChoice)).fill(0).map((x, i) => i);
        if (this.numbers.length > 0) {
          this.showSelectAllchkbox = true;
          for (let m = 0; m < this.numbers.length; m++) {
            this.chkCorrect[m] = false;
          }
        }
        console.log(this.chkCorrect);
        this.loader.hideLoader();
      }
      else if (response.status == 0) {

      }
    }, error => {
      console.log(error);// Error getting the data
    });
  }
  selectAll() {
    console.log(this.chkCorrect);
    for (let m = 0; m < this.numbers.length; m++){
      if(this.chkCorrect[m]==false)
        this.chkCorrect[m] = true;
      else
      this.chkCorrect[m]=false
    }
  }
  addQuestionMCQ() {
    if ($("#inputSelectLevelName option:selected").val() == '') {  // Checking by JQuery as the value is not catched by FormBuilder
      this.modalPopup.showFailedAlert('Please Select Difficulty Level.');
    }
    this.answerarrHasContent = [];
    this.cataName = this.userForm.value.cataList;
    this.levelName = this.userForm.value.inputSelectLevelName;
    this.inputQuestionText_MCQ = this.userForm.value.questionText;
    this.answer0 = $("#answerTxt0").val();
    this.answer1 = $("#answerTxt1").val();
    this.answer2 = $("#answerTxt2").val();
    this.answer3 = $("#answerTxt3").val();
    this.answer4 = $("#answerTxt4").val();
    console.log("Difficulty Level==>", this.levelName);
    if (this.answer0 == '') {
      this.answerarrHasContent.push('N');
      $("#answerTxt0").css('border-color', 'red');
    }
    if (this.answer1 == '') {
      this.answerarrHasContent.push('N');
      $("#answerTxt1").css('border-color', 'red');
    }
    if (this.answer2 == '') {
      this.answerarrHasContent.push('N');
      $("#answerTxt2").css('border-color', 'red');
    }
    if (this.answer3 == '') {
      this.answerarrHasContent.push('N');
      $("#answerTxt3").css('border-color', 'red');
    }
    if (this.answer4 == '') {
      this.answerarrHasContent.push('N');
      $("#answerTxt4").css('border-color', 'red');
    }
    ///////////////////Now if not blank clear all////////////////
    if (this.answer0 != '') {
      this.answerarrHasContent.push('Y');
      $("#answerTxt0").css('border-color', '');
    }
    if (this.answer1 != '') {
      this.answerarrHasContent.push('Y');
      $("#answerTxt1").css('border-color', '');
    }
    if (this.answer2 != '') {
      this.answerarrHasContent.push('Y');
      $("#answerTxt2").css('border-color', '');
    }
    if (this.answer3 != '') {
      this.answerarrHasContent.push('Y');
      $("#answerTxt3").css('border-color', '');
    }
    if (this.answer4 != '') {
      this.answerarrHasContent.push('Y');
      $("#answerTxt4").css('border-color', '');
    }
    console.log(this.inputQuestionText_MCQ);
    let correct = '', isHint = '';
    this.answers = [], this.ansarr = [], this.hintarr = [];
    for (let j = 0; j < this.numbers.length; j++) {
      if ($("#ans" + j).prop("checked")) {
        correct = 'Y';
      }
      else {
        correct = 'N';
      }
      if ($("#hint" + j).prop("checked")) {
        isHint = 'Y';
      }
      else {
        isHint = 'N';
      }
      this.xxx = {
        "answer": $("#answerTxt" + j).val(),
        "isHint": isHint,
        "correct": correct
      };
      this.answers.push(this.xxx);
    }//end for loop
    console.log("Answer array is:", this.answers, this.numbers.length);
    for (let j = 0; j < this.numbers.length; j++) {
      this.alloptions.push($("#answerTxt" + j).val());
      if ($("#ans" + j).is(':checked')) {
        this.ansarr.push('Yes');
      }
      if ($("#hint" + j).is(':checked')) {
        this.hintarr.push('Yes');
      }
    }
    console.log(this.ansarr, this.hintarr, this.ansarr.length, this.hintarr.length);
    if (this.ansarr.length <= 0) {
      this.modalPopup.showFailedAlert('Please check one correct answer');
    }
    /////Checking Hint is disabled///////////
    // else
    //   if (this.hintarr.length <= 0) {
    //     this.modalPopup.showFailedAlert('Please check one hint answer');
    //   }
    ///////////////////////////////////


    ////////Code for Correct and hint will not same////////////////
    let flag = false;// This flag is used for not checking the same as Correct and Hint
    for (var j = 0; j < this.numbers.length; j++) {
      if (this.answers[j].correct == 'Y' && this.answers[j].isHint == 'Y') {
        flag = false;// This matches the correct and hint as same
        this.modalPopup.showFailedAlert('Correct Answer and Hint will not same');
        break;
      }
      else {
        flag = true;// This matches the correct and hint as not same, So proceed with this one
      }
    }
    /////////////Code ends here for checking correct and hint//////////////////////////////////////
    console.log(this.answerarrHasContent, this.answerarrHasContent.indexOf('N'));
    /////////////////Now its time for upload the question//////////////////
    console.log(this.selectedFiles);
    if (this.selectedFiles == undefined) {//Check to see if there is something to upload or not
      console.log('Normal question upload');
      if (this.answerarrHasContent.indexOf('N') == -1 && this.ansarr.length != 0 &&  flag == true && $("#inputSelectLevelName option:selected").val() != '') {
      //if (this.answerarrHasContent.indexOf('N') == -1 && this.ansarr.length != 0 && this.hintarr.length != 0 && flag == true && $("#inputSelectLevelName option:selected").val() != '') {
        this.loader.showLoader();
        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        let options = new RequestOptions({ headers: headers });
        let postParams = {
          "type": this.questionTypeName,
          "category": this.cataName,
          "difficultyLevel": this.levelName,
          "question": this.inputQuestionText_MCQ,
          "raceId": this.activeEventId,
          "associationId": this.CurrentOrgId,
          "answers": this.answers
        }
        this.http.post(BaseURLName.baseURL + "addquestion", JSON.stringify(postParams), options).subscribe(data => {
          let response = JSON.parse(data['_body']);
          console.log(response);
          if (response.message == 1) {
            this.loadQuestionSummary();
            this.loader.hideLoader();
            //Now clear all the inputs/////////////////////
            this.userForm = this.formBuilder.group({
              'cataList': ['', Validators.required],
              'inputSelectLevelName': ['', Validators.required],
              'questionText': ['', Validators.required],
              'qType': ['', Validators.required]
            });
            for (let j = 0; j < this.numbers.length; j++) {
              $("#answerTxt" + j).val('');
            }
            $('input[type="checkbox"]').prop('checked', false);
            ///////End of Clearing all the input controls/////////////////
            this.modalPopup.showSuccessAlert('Question uploaded Successfully!');
          }
          else if (response.message == 0) {
            this.loader.hideLoader();
            this.modalPopup.showFailedAlert((JSON.stringify(response.status)).replace(/"/g, ""));
          }
        }, error => {
          console.log(error);// Error getting the data
          this.loader.hideLoader();
        });
      }
    } else {// If there is something to upload
      const file = this.selectedFiles.item(0);
      console.log(file);
      this.findIndex = ((file.name).toString()).lastIndexOf(".");
      console.log(this.findIndex);
      this.fileExtension = ((file.name).toString()).substring(this.findIndex);
      console.log(this.fileExtension);
      var flagg = 0;
      var allowed_extensions = [".jpeg", ".png", ".jpg", ".x-ms-wmv", ".mp4", ".mp3"];
      for (var i = 0; i < allowed_extensions.length; i++) {
        if (allowed_extensions[i] == this.fileExtension) {
          flagg = 1;
          break;
        }
        else {
          flagg = 0;
        }
      }
      if (flagg == 1) { //Permit Valid extensions only
        if (this.fileExtension == ".mp4" || this.fileExtension == ".x-ms-wmv" || this.fileExtension == ".mp3") {
          console.log('For MP3 and MP4');
          //if (this.answerarrHasContent.indexOf('N') == -1 && this.ansarr.length != 0 && this.hintarr.length != 0 && flag == true && $("#inputSelectLevelName option:selected").val() != '') {
            if (this.answerarrHasContent.indexOf('N') == -1 && this.ansarr.length != 0 &&  flag == true && $("#inputSelectLevelName option:selected").val() != '') {  
          this.loader.showLoader();
            let headers = new Headers();
            headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            let options = new RequestOptions({ headers: headers });
            let postParams = {
              "type": this.questionTypeName,
              "category": this.cataName,
              "difficultyLevel": this.levelName,
              "question": this.inputQuestionText_MCQ,
              "raceId": this.activeEventId,
              "associationId": this.CurrentOrgId,
              "answers": this.answers
            }
            this.http.post(BaseURLName.baseURL + "addquestion", JSON.stringify(postParams), options).subscribe(data => {
              let response = JSON.parse(data['_body']);
              console.log(response);
              if (response.message == 1) {
                this.uploadToS3Bucket(response.questionId, this.fileExtension);// Upload Image only
                //this.modalPopup.showSuccessAlert('Question uploaded Successfully!');
              }
              else if (response.message == 0) {
                this.loader.hideLoader();
                this.modalPopup.showFailedAlert((JSON.stringify(response.status)).replace(/"/g, ""));
              }
            }, error => {
              console.log(error);// Error getting the data
              this.loader.hideLoader();
            });
          }
        } else if (this.fileExtension == ".jpg" || this.fileExtension == ".jpeg" || this.fileExtension == ".png") {
          //if (this.answerarrHasContent.indexOf('N') == -1 && this.ansarr.length != 0 && this.hintarr.length != 0 && flag == true && $("#inputSelectLevelName option:selected").val() != '') {
            if (this.answerarrHasContent.indexOf('N') == -1 && this.ansarr.length != 0 &&  flag == true && $("#inputSelectLevelName option:selected").val() != '') {  
          var reader = new FileReader();
            reader.readAsDataURL(this.eventt.target.files[0]); // read file as data url
            reader.onload = (event: any) => { // called once readAsDataURL is completed
              var img = new Image;
              img.src = event.target.result;
              img.onload = () => {
                console.log(img.width, img.height);
                if ((img.width >= 200 && img.height >= 320) && (img.width <= 1080 && img.height <= 1920)) {
                  if (file.size <= 2097152) {
                    console.log('Image Permitted,Now API Can be called...');
                    this.loader.showLoader();
                    let headers = new Headers();
                    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
                    let options = new RequestOptions({ headers: headers });
                    let postParams = {
                      "type": this.questionTypeName,
                      "category": this.cataName,
                      "difficultyLevel": this.levelName,
                      "question": this.inputQuestionText_MCQ,
                      "raceId": this.activeEventId,
                      "associationId": this.CurrentOrgId,
                      "answers": this.answers
                    }
                    this.http.post(BaseURLName.baseURL + "addquestion", JSON.stringify(postParams), options).subscribe(data => {
                      let response = JSON.parse(data['_body']);
                      console.log(response);
                      if (response.message == 1) {
                        this.uploadToS3Bucket(response.questionId, this.fileExtension);// Upload Image only
                        //this.modalPopup.showSuccessAlert('Question uploaded Successfully!');
                      }
                      else if (response.message == 0) {
                        this.loader.hideLoader();
                        this.modalPopup.showFailedAlert((JSON.stringify(response.status)).replace(/"/g, ""));
                      }
                    }, error => {
                      console.log(error);// Error getting the data
                      this.loader.hideLoader();
                    });
                  }
                  else {
                    this.loader.hideLoader();
                    // this.faliureStatus = true;
                    this.modalPopup.showFailedAlert('Image Size Not Permitted');
                    // this.userFaliureMsg='Image Size Not Permitted';
                  }
                } else {
                  this.loader.hideLoader();
                  this.modalPopup.showFailedAlert('Image resolution Not Permitted');
                  // this.faliureStatus = true;
                  // this.userFaliureMsg='Image resolution Not Permitted';
                }
              }//end of img.onload
            }//end of reader.onload
          }
        }
      } else {
        this.modalPopup.showFailedAlert('Invalid File..');
      }
    }
  }
  addQuestionTB() {
    if ($("#inputSelectLevelName option:selected").val() == '') {
      this.modalPopup.showFailedAlert('Please Select Difficulty Level.');
    }
    this.cataName = this.userForm.value.cataList;
    this.levelName = this.userForm.value.inputSelectLevelName;
    this.inputQuestionText_TB = $("#inputQuestionText-TB").val();
    this.inputAnswer_TB = $("#inputAnswer-TB").val();
    this.inputHint_TB = $("#inputHint-TB").val();
    if (this.cataName == '') {
      $("#cataList").css('border-color', 'red');
    }
    if (this.levelName == '') {
      $("#inputSelectLevelName").css('border-color', 'red');
    }
    if (this.inputQuestionText_TB == '') {
      $("#inputQuestionText-TB").css('border-color', 'red');
    }
    if (this.inputAnswer_TB == '') {
      $("#inputAnswer-TB").css('border-color', 'red');
    }
    // if (this.inputHint_TB == '') {
    //   $("#inputHint-TB").css('border-color', 'red');
    // }
    if (this.cataName != '') {
      $("#cataList").css('border-color', '');
    }
    if (this.levelName != '') {
      $("#inputSelectLevelName").css('border-color', '');
    }
    if (this.inputQuestionText_TB != '') {
      $("#inputQuestionText-TB").css('border-color', '');
    }
    if (this.inputAnswer_TB != '') {
      $("#inputAnswer-TB").css('border-color', '');
    }
    // if (this.inputHint_TB != '') {
    //   $("#inputHint-TB").css('border-color', '');
    // }
    this.answers = [];
    this.yyy = {
      "answer": this.inputAnswer_TB,
      "isHint": this.inputHint_TB
    };
    this.answers.push(this.yyy);
    console.log(this.selectedFilesTB);
    if (this.selectedFilesTB == undefined) {//Check to see if there is something to upload or not
      console.log('Normal question upload for TB');
      if (this.inputQuestionText_TB != '' && this.inputAnswer_TB != '' && $("#inputSelectLevelName option:selected").val() != '') {
        this.loader.showLoader();
        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        let options = new RequestOptions({ headers: headers });
        let postParams = {
          "type": this.questionTypeName,
          "category": this.cataName,
          "difficultyLevel": this.levelName,
          "question": this.inputQuestionText_TB,
          "raceId": this.activeEventId,
          "associationId": this.CurrentOrgId,
          "answers": this.answers
        }
        this.http.post(BaseURLName.baseURL + "addquestion", JSON.stringify(postParams), options).subscribe(data => {
          let response = JSON.parse(data['_body']);
          console.log(response);
          if (response.message == 1) {
            this.loader.hideLoader();
            this.loadQuestionSummary();
            this.modalPopup.showSuccessAlert('Question uploaded Successfully!');
          }
          else if (response.message == 0) {
            this.loader.hideLoader();
            this.modalPopup.showFailedAlert((JSON.stringify(response.status)).replace(/"/g, ""));
          }
        }, error => {
          console.log(error);// Error getting the data
          this.loader.hideLoader();
        });
      }
    } else { //there is something to upload
      const file = this.selectedFilesTB.item(0);
      console.log(file);
      this.findIndex = ((file.name).toString()).lastIndexOf(".");
      console.log(this.findIndex);
      this.fileExtension = ((file.name).toString()).substring(this.findIndex);
      console.log(this.fileExtension);
      var flagg = 0;
      var allowed_extensions = [".jpeg", ".png", ".jpg", ".x-ms-wmv", ".mp4", ".mp3"];
      for (var i = 0; i < allowed_extensions.length; i++) {
        if (allowed_extensions[i] == this.fileExtension) {
          flagg = 1;
          break;
        }
        else {
          flagg = 0;
        }
      }
      if (flagg == 1) {
        if (this.fileExtension == ".mp4" || this.fileExtension == ".x-ms-wmv" || this.fileExtension == ".mp3") {
          console.log('For MP3 and MP4');
          if (this.inputQuestionText_TB != '' && this.inputAnswer_TB != '' && $("#inputSelectLevelName option:selected").val() != '') {
            this.loader.showLoader();
            let headers = new Headers();
            headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            let options = new RequestOptions({ headers: headers });
            let postParams = {
              "type": this.questionTypeName,
              "category": this.cataName,
              "difficultyLevel": this.levelName,
              "question": this.inputQuestionText_TB,
              "raceId": this.activeEventId,
              "associationId": this.CurrentOrgId,
              "answers": this.answers
            }
            this.http.post(BaseURLName.baseURL + "addquestion", JSON.stringify(postParams), options).subscribe(data => {
              let response = JSON.parse(data['_body']);
              console.log(response);
              if (response.message == 1) {
                this.uploadToS3BucketTB(response.questionId, this.fileExtension);// Upload Image only
                //this.loader.hideLoader();
                //this.modalPopup.showSuccessAlert('Question uploaded Successfully!');
              }
              else if (response.message == 0) {
                this.loader.hideLoader();
                this.modalPopup.showFailedAlert((JSON.stringify(response.status)).replace(/"/g, ""));
              }
            }, error => {
              console.log(error);// Error getting the data
              this.loader.hideLoader();
            });
          }
        } else if (this.fileExtension == ".jpg" || this.fileExtension == ".jpeg" || this.fileExtension == ".png") {
          var reader = new FileReader();
          reader.readAsDataURL(this.eventtTB.target.files[0]); // read file as data url
          reader.onload = (event: any) => { // called once readAsDataURL is completed
            var img = new Image;
            img.src = event.target.result;
            img.onload = () => {
              console.log(img.width, img.height);
              if ((img.width >= 200 && img.height >= 320) && (img.width <= 1080 && img.height <= 1920)) {
                if (file.size <= 2097152) {
                  console.log('Image Permitted,Now API Can be called...');
                  if (this.inputQuestionText_TB != '' && this.inputAnswer_TB != '' && $("#inputSelectLevelName option:selected").val() != '') {
                    this.loader.showLoader();
                    let headers = new Headers();
                    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
                    let options = new RequestOptions({ headers: headers });
                    let postParams = {
                      "type": this.questionTypeName,
                      "category": this.cataName,
                      "difficultyLevel": this.levelName,
                      "question": this.inputQuestionText_TB,
                      "raceId": this.activeEventId,
                      "associationId": this.CurrentOrgId,
                      "answers": this.answers
                    }
                    this.http.post(BaseURLName.baseURL + "addquestion", JSON.stringify(postParams), options).subscribe(data => {
                      let response = JSON.parse(data['_body']);
                      console.log(response);
                      if (response.message == 1) {
                        this.uploadToS3BucketTB(response.questionId, this.fileExtension);// Upload Image only
                        //this.loader.hideLoader();
                        //this.modalPopup.showSuccessAlert('Question uploaded Successfully!');
                      }
                      else if (response.message == 0) {
                        this.loader.hideLoader();
                        this.modalPopup.showFailedAlert((JSON.stringify(response.status)).replace(/"/g, ""));
                      }
                    }, error => {
                      console.log(error);// Error getting the data
                      this.loader.hideLoader();
                    });
                  }
                }
                else {
                  this.loader.hideLoader();
                  // this.faliureStatus = true;
                  this.modalPopup.showFailedAlert('Image Size Not Permitted');
                  // this.userFaliureMsg='Image Size Not Permitted';
                }
              } else {
                this.loader.hideLoader();
                this.modalPopup.showFailedAlert('Image resolution Not Permitted');
                // this.faliureStatus = true;
                // this.userFaliureMsg='Image resolution Not Permitted';
              }
            }//end of img.onload
          }//end of reader.onload
        }
      }
    }
    //console.log(this.cataName, this.levelName, this.inputQuestionText_TB, this.inputAnswer_TB, this.inputHint_TB);
  }
  uploadToS3Bucket(questionId, fileExtension) {
    const file = this.selectedFiles.item(0);
    console.log(file);
    if (file) {
      AWS.config.update({
        "accessKeyId": "AKIAJNXJQEH6URIV4LWA",
        "secretAccessKey": "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",
        "region": "us-west-2"
      });
      var s3 = new AWS.S3();
      var params = {
        Bucket: 'qmequizbackend',
        Key: '' + questionId + fileExtension,
        ContentType: fileExtension,
        Body: file,
        ACL: 'public-read'
      };
      s3.putObject(params, (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log(res);
          let headers = new Headers();
          headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
          let options = new RequestOptions({ headers: headers });
          let postParams = {
            "questionId": questionId,
            "key": '' + questionId + fileExtension
          }
          this.http.post(BaseURLName.baseURL + "uploadquestionimagesvideos", JSON.stringify(postParams), options).subscribe(data => {
            let response = JSON.parse(data['_body']);
            console.log(response);
            if (response.message == 1) {
              //Now clear all the inputs/////////////////////
              this.userForm = this.formBuilder.group({
                'cataList': ['', Validators.required],
                'inputSelectLevelName': ['', Validators.required],
                'questionText': ['', Validators.required],
                'qType': ['', Validators.required]
              });
              for (let j = 0; j < this.numbers.length; j++) {
                $("#answerTxt" + j).val('');
              }
              $('input[type="radio"]').prop('checked', false);
              ///////End of Clearing all the input controls/////////////////
              this.loadQuestionSummary();
              this.modalPopup.showSuccessAlert('Question uploaded Successfully!');
              console.log((JSON.stringify(response.status)).replace(/"/g, ""));
              this.loader.hideLoader();
            }
            else {
              console.log((JSON.stringify(response.status)).replace(/"/g, ""));
              this.loader.hideLoader();
            }
          }, error => {
            console.log(error);// Error getting the data
            this.loader.hideLoader();
          });
        }
      });
    } else {
      //results.innerHTML = 'Nothing to upload.';
      this.loader.hideLoader();
    }
  }
  uploadToS3BucketTB(questionId, fileExtension) {
    const file = this.selectedFilesTB.item(0);
    console.log(file);
    if (file) {
      AWS.config.update({
        "accessKeyId": "AKIAJNXJQEH6URIV4LWA",
        "secretAccessKey": "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",
        "region": "us-west-2"
      });
      var s3 = new AWS.S3();
      var params = {
        Bucket: 'qmequizbackend',
        Key: '' + questionId + fileExtension,
        ContentType: fileExtension,
        Body: file,
        ACL: 'public-read'
      };
      s3.putObject(params, (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log(res);
          let headers = new Headers();
          headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
          let options = new RequestOptions({ headers: headers });
          let postParams = {
            "questionId": questionId,
            "key": '' + questionId + fileExtension
          }
          this.http.post(BaseURLName.baseURL + "uploadquestionimagesvideos", JSON.stringify(postParams), options).subscribe(data => {
            let response = JSON.parse(data['_body']);
            console.log(response);
            if (response.message == 1) {
              this.loadQuestionSummary();
              this.modalPopup.showSuccessAlert('Question uploaded Successfully!');
              console.log((JSON.stringify(response.status)).replace(/"/g, ""));
              this.loader.hideLoader();
            }
            else {
              console.log((JSON.stringify(response.status)).replace(/"/g, ""));
              this.loader.hideLoader();
            }
          }, error => {
            console.log(error);// Error getting the data
            this.loader.hideLoader();
          });
        }
      });
    } else {
      //results.innerHTML = 'Nothing to upload.';
      this.loader.hideLoader();
    }
  }
  loadQuestionSummary() {
    this.data = [];
    this.oldData = [];
    this.loader.showLoader();
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    let options = new RequestOptions({ headers: headers });
    let postParams = {
      "raceId": this.activeEventId,
    }
    this.http.post(BaseURLName.baseURL + "displayquestions", JSON.stringify(postParams), options).subscribe(data => {
      let response = JSON.parse(data['_body']);
      console.log(response);
      if (response.status == 1) {
        this.oldData = response.questionDetails;
        for (let i = 0; i < this.oldData.length; i++) {
          console.log(this.oldData[i].questionType);
          if (this.oldData[i].questionType == 'mcq' || this.oldData[i].questionType == 'txt') {
            let ans = this.oldData[i]['answers'];
            ans = ans.split('|||');
            let p = [], m;
            let k = [];
            if (this.oldData[i].questionType == 'txt') {// If the question is Text based type thre will be no 'Option', only correct ans and hint will be there
              p = [];//For the above reason setting the array to blank here
            }
            else {
              for (let j = 0; j < ans.length - 1; j++) {    //Generating Array for available options for MCQ Type
                p.push(ans[j]);
              }
            }

            if (this.oldData[i].questionType == 'txt') {  //Anssign value of ans[0] to "correctAnswer"
              k.push(ans[0]);
            }
            else {
              for (let j = 0; j < ans.length - 1; j++) {         //Otherwise print the Alphabets
                let z = this.oldData[i]['correctAnswer'];
                z = z.split('|||');
                for (let h = 0; h < z.length - 1; h++) {
                  if (ans[j] == z[h]) {
                    k.push(String.fromCharCode(65 + j));
                  }
                }
              }
            }
            if (this.oldData[i].questionType == 'txt') {  //Anssign value of this.oldData[i]['hint'] to "hint"
              m = this.oldData[i]['hint'];
            } else {
              for (let j = 0; j < ans.length - 1; j++) {      //Otherwise print the Alphabets
                if (ans[j] == this.oldData[i]['hint']) {
                  m = String.fromCharCode(65 + j)
                }
              }
            }
            this.data.push({
              category: this.oldData[i]['category'],
              difficultyLevel: this.oldData[i]['difficultyLevel'],
              question: this.oldData[i]['question'],
              imagesVideosUrl: this.oldData[i]['imagesVideosUrl'],
              questionType: this.oldData[i]['questionType'],
              marks: this.oldData[i]['marks'],
              hintPenelty: this.oldData[i]['hintPenelty'],
              answers: this.oldData[i]['answers'],
              correctAnswer: k,
              newansarr: p,
              hint: m,
              questionId: this.oldData[i]['questionId']
            });
            console.log(k);
          }
        }
        console.log(this.data);
        console.log((JSON.stringify(response.message)).replace(/"/g, ""));
        this.loader.hideLoader();
      }
      else {
        this.modalPopup.showFailedAlert((JSON.stringify(response.message)).replace(/"/g, ""));
        console.log((JSON.stringify(response.message)).replace(/"/g, ""));
        this.loader.hideLoader();
      }
    }, error => {
      console.log(error);// Error getting the data
      this.loader.hideLoader();
    });
  }
  editQuestion(event) {
    console.log(event);
    this.router.navigate(['/pages/editgamequestion', { id: event.questionId, cata: event.category, diffLevel: event.difficultyLevel }]);
  }
  deleteQuestion(event) {
    console.log(event);
    const decision = this.modalPopup.showYesNoConfirm("Alert !!", `Do you want to delete the Question?`);
    decision.result.then((result) => {
      this.loader.showLoader();
      console.log(result);
      let headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      let options = new RequestOptions({ headers: headers });
      let postParams = {
        "questionId": Number(event.questionId)
      }
      this.http.post(BaseURLName.baseURL + "deletequestion", JSON.stringify(postParams), options).map((response) => response.json()).subscribe(res => {
        console.log(res);
        if (res.status == 1) {
          this.modalPopup.showSuccessAlert('Question Deleted Sussessfully.');
          this.oldData = [];
          this.data = [];
          this.loadQuestionSummary();
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
}
