import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageProvider } from '../../@core/data/message.provider';
import { Headers, Http, RequestOptions } from '@angular/http';
import { BaseURLName } from '../baseURLfile';
import { LoaderProvider } from '../../@core/data/loader.provider';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import * as $ from 'jquery';
declare var AWS: any;
@Component({
  selector: 'ngx-editgame-question',
  templateUrl: './editgame-question.component.html',
  styleUrls: ['./editgame-question.component.scss']
})
export class EditgameQuestionComponent implements OnInit {
  public qid: any;
  public cata: any;
  public diffLevel: any;
  public questionTextMCQ: any;
  public xxx: any;
  public yyy: any;
  public answers: any = [];
  public alloptions: any = [];
  public hintarr: any = [];
  public ansarr: any = [];
  public selectedFiles: any;
  public eventt: any;
  public selectedFilesTB: any;
  public eventtTB: any;
  public findIndex: any;
  public fileExtension: any;
  public activeEventId: any;
  public CurrentOrgId: any;
  public dispMCQStatus: boolean = false;
  public dispTBStatus: boolean = false;
  public dispMCQHintStatus: boolean = false;
  public dispMCQFileUploadStatus: boolean = false;
  public dispTBHintStatus: boolean = false;
  public dispTBFileUploadStatus: boolean = false;
  public numbers: any;
  public isCorrect: boolean = false;
  public fileURL_MCQ: any;
  public fileURL_TB: any;
  public inputQuestionText_TB: any;
  public inputHint_TB: any;
  public inputAnswer_TB: any;
  userForm: any;
  constructor(public route: ActivatedRoute, public modalPopup: MessageProvider, private formBuilder: FormBuilder, private http: Http, public loader: LoaderProvider, public router: Router, @Inject(SESSION_STORAGE) private storage: StorageService) {
    this.activeEventId = this.storage.get('activeEventId');
    this.CurrentOrgId = this.storage.get('CurrentOrgId');
    this.route.params.subscribe((params) => {
      console.log(JSON.stringify(params));
      this.qid = params['id'];
      this.cata = params['cata'];
      this.diffLevel = params['diffLevel'];
      console.log(this.qid, this.cata, this.diffLevel);
    });
    this.userForm = this.formBuilder.group({
      'questionText': ['', Validators.required]
    });
    this.loadQuestion();
  }

  ngOnInit() {
    console.log(this.storage.get('isLoggedin'));
    if (this.storage.get('isLoggedin') == null) {
      this.router.navigate(['pages/login']);
    }
  }
  loadQuestion() {
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
        response.questionDetails.forEach((v, k) => {
          if (v.questionId == this.qid) {
            if (v.questionType == 'mcq') {
              console.log(response.questionDetails[k]);
              this.dispMCQStatus = true;
              this.dispTBStatus = false;
              this.userForm = this.formBuilder.group({
                'questionText': [v.question, Validators.required]
              });
              if (v.hint != '') {       // If hint is present display radio buttons
                this.dispMCQHintStatus = true;
                let ans = v['answers'];
                ans = ans.split('|||');
                this.numbers = Array(Number(ans.length - 1)).fill(0).map((x, i) => i);
                setTimeout(() => {
                  for (let j = 0; j < ans.length-1; j++) {
                    $("#answerTxt" + j).val(ans[j]);
                    let q = v.correctAnswer;
                    //alert(q);
                    let p = q.split('|||');
                    //console.log(p.length);
                    for (let k = 0; k <p.length-1; k++){
                      console.log(p[k]+'  '+ans[j])
                      if (p[k] == ans[j]) {
                        console.log("The correct answer is" + ans[j]);
                        $("#ans" + j).prop("checked", true);
                      }
                    }
                    if (v.hint == ans[j]) {
                      console.log("The hint answer is" + ans[j]);
                      $("#hint" + j).prop("checked", true);
                    }
                  }
                }, 200);
              } else {   //If the hint is not there only correct ans radios will be displayed
                let ans = v['answers'];
                ans = ans.split('|||');
                this.numbers = Array(Number(ans.length - 1)).fill(0).map((x, i) => i);
                setTimeout(() => {
                  for (let j = 0; j < ans.length - 1; j++) {
                    $("#answerTxt" + j).val(ans[j]);
                    let p = (v.correctAnswer).split('|||');
                    for (let k = 0; k < p.length - 1; k++){
                      if (p[k] == ans[k]) {
                        console.log("The correct answer is" + ans[k]);
                        $("#ans" + k).prop("checked", true);
                      }
                    }
                  }
                }, 200);
              }//end of hint rendering
              if (v.imagesVideosUrl != '') {
                this.dispMCQFileUploadStatus = true;
                this.fileURL_MCQ = v.imagesVideosUrl;
              } else {
                this.dispMCQFileUploadStatus = false;
              }
            } else if (v.questionType == 'txt') {
              console.log(response.questionDetails[k], v.question);
              this.dispTBStatus = true;
              this.dispMCQStatus = false;
              if (v.hint != '') {             //Enabale hint first
                this.dispTBHintStatus = true;

              } else {

              }
              setTimeout(() => {                           //Without SetTimeout it will not work
                let ans = v['answers'];
                ans = ans.split('|||');
                $("#inputQuestionText_TB").val(v.question);
                $("#inputAnswer_TB").val(ans[0]);
                if (v.hint != '') {
                  this.dispTBHintStatus = true;
                  $("#inputHint_TB").val(v.hint);
                } else {

                }
                if (v.imagesVideosUrl != '') {
                  this.dispTBFileUploadStatus = true;
                  this.fileURL_TB = v.imagesVideosUrl;
                }
                else {
                  this.dispTBFileUploadStatus = false;
                }
              }, 200);
            }
          }
        });
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
  selectFile_MCQ(event) {
    this.selectedFiles = event.target.files;
    this.eventt = event;
  }
  selectFile_TB(event) {
    this.selectedFilesTB = event.target.files;
    this.eventtTB = event;
  }
  updateQuestionMCQ() {
    this.questionTextMCQ = this.userForm.value.questionText;  //Take it from UI
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
    console.log(this.answers);
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
    /////////////Code ends here for checking correct and hint////////////////////////////////

    if (this.selectedFiles == undefined) {  //Check to see if there is something to upload or not
      console.log('Normal question edit and upload');
      if (flag == true) {
        this.loader.showLoader();
        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        let options = new RequestOptions({ headers: headers });
        let postParams = {
          "raceId": Number(this.activeEventId),
          "associationId": this.CurrentOrgId,
          "category": this.cata,
          "difficultyLevel": this.diffLevel,
          "question": this.questionTextMCQ,
          "type": "mcq", //As the control coming to this function, the questype will be "mcq"
          "questionId": this.qid,
          "answers": this.answers
        }
        this.http.post(BaseURLName.baseURL + "updatequestion", JSON.stringify(postParams), options).subscribe(data => {
          let response = JSON.parse(data['_body']);
          console.log(response);
          this.loader.hideLoader();
          if (response.message == 1) {
            this.modalPopup.showSuccessAlert('Question updated Successfully!');
          }
          else if (response.message == 0) {
            this.modalPopup.showFailedAlert((JSON.stringify(response.status)).replace(/"/g, ""));
          }
          this.loader.hideLoader();
        }, error => {
          console.log(error);// Error getting the data
          this.loader.hideLoader();
        });
      }
    } else {  // If there is something to upload
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
          if (flag == true) {
            this.loader.showLoader();
            let headers = new Headers();
            headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            let options = new RequestOptions({ headers: headers });
            let postParams = {
              "raceId": Number(this.activeEventId),
              "associationId": this.CurrentOrgId,
              "category": this.cata,
              "difficultyLevel": this.diffLevel,
              "question": this.questionTextMCQ,
              "type": "mcq", //As the control coming to this function, the questype will be "mcq"
              "questionId": this.qid,
              "answers": this.answers
            }
            this.http.post(BaseURLName.baseURL + "updatequestion", JSON.stringify(postParams), options).subscribe(data => {
              let response = JSON.parse(data['_body']);
              console.log(response);
              if (response.message == 1) {
                this.uploadToS3Bucket(this.qid, this.fileExtension);
                //this.modalPopup.showSuccessAlert('Question updated Successfully!');
              }
              else if (response.message == 0) {
                this.modalPopup.showFailedAlert((JSON.stringify(response.status)).replace(/"/g, ""));
                this.loader.hideLoader();
              }
            }, error => {
              console.log(error);// Error getting the data
              this.loader.hideLoader();
            });
          }
        } else if (this.fileExtension == ".jpg" || this.fileExtension == ".jpeg" || this.fileExtension == ".png") {
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
                  if (flag == true) {
                    this.loader.showLoader();
                    let headers = new Headers();
                    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
                    let options = new RequestOptions({ headers: headers });
                    let postParams = {
                      "raceId": Number(this.activeEventId),
                      "associationId": this.CurrentOrgId,
                      "category": this.cata,
                      "difficultyLevel": this.diffLevel,
                      "question": this.questionTextMCQ,
                      "type": "mcq", //As the control coming to this function, the questype will be "mcq"
                      "questionId": this.qid,
                      "answers": this.answers
                    }
                    this.http.post(BaseURLName.baseURL + "updatequestion", JSON.stringify(postParams), options).subscribe(data => {
                      let response = JSON.parse(data['_body']);
                      console.log(response);
                      if (response.message == 1) {
                        this.uploadToS3Bucket(this.qid, this.fileExtension);
                        //this.modalPopup.showSuccessAlert('Question updated Successfully!');
                      }
                      else if (response.message == 0) {
                        this.modalPopup.showFailedAlert((JSON.stringify(response.status)).replace(/"/g, ""));
                        this.loader.hideLoader();
                      }
                    }, error => {
                      console.log(error);// Error getting the data
                      this.loader.hideLoader();
                    });
                  }
                }
                else {
                  this.loader.hideLoader();
                  this.modalPopup.showFailedAlert('Image Size Not Permitted');
                }
              } else {
                this.loader.hideLoader();
                this.modalPopup.showFailedAlert('Image resolution Not Permitted');
              }
            }//end of img.onload
          }//end of reader.onload
        }
      } else {
        this.modalPopup.showFailedAlert('Invalid file format..');
      }
    }
  }
  updateQuestionTB() {
    this.answers = [];
    this.inputQuestionText_TB = $("#inputQuestionText_TB").val();
    this.inputAnswer_TB = $("#inputAnswer_TB").val();
    this.inputHint_TB = $("#inputHint_TB").val();
    this.yyy = {
      "answer": this.inputAnswer_TB,
      "isHint": this.inputHint_TB
    };
    this.answers.push(this.yyy);
    console.log(this.inputQuestionText_TB, this.inputAnswer_TB, this.inputHint_TB, this.answers);
    if (this.selectedFilesTB == undefined) {//Check to see if there is something to upload or not
      if (this.inputQuestionText_TB != '' && this.inputAnswer_TB != '') {
        console.log('Normal question edit/upload for TB');
        this.loader.showLoader();
        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        let options = new RequestOptions({ headers: headers });
        let postParams = {
          "raceId": Number(this.activeEventId),
          "associationId": this.CurrentOrgId,
          "category": this.cata,
          "difficultyLevel": this.diffLevel,
          "question": this.inputQuestionText_TB,
          "type": "txt", //As the control coming to this function, the questype will be "txt"
          "questionId": this.qid,
          "answers": this.answers
        }
        this.http.post(BaseURLName.baseURL + "updatequestion", JSON.stringify(postParams), options).subscribe(data => {
          let response = JSON.parse(data['_body']);
          console.log(response);
          if (response.message == 1) {
            //this.uploadToS3Bucket(this.qid, this.fileExtension);
            this.modalPopup.showSuccessAlert('Question updated Successfully!');
            this.loader.hideLoader();
          }
          else if (response.message == 0) {
            this.modalPopup.showFailedAlert((JSON.stringify(response.status)).replace(/"/g, ""));
            this.loader.hideLoader();
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
          if (this.inputQuestionText_TB != '' && this.inputAnswer_TB != '') {
            this.loader.showLoader();
            let headers = new Headers();
            headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            let options = new RequestOptions({ headers: headers });
            let postParams = {
              "raceId": Number(this.activeEventId),
              "associationId": this.CurrentOrgId,
              "category": this.cata,
              "difficultyLevel": this.diffLevel,
              "question": this.inputQuestionText_TB,
              "type": "txt", //As the control coming to this function, the questype will be "txt"
              "questionId": this.qid,
              "answers": this.answers
            }
            this.http.post(BaseURLName.baseURL + "updatequestion", JSON.stringify(postParams), options).subscribe(data => {
              let response = JSON.parse(data['_body']);
              console.log(response);
              if (response.message == 1) {
                this.uploadToS3BucketTB(this.qid, this.fileExtension);
              }
              else if (response.message == 0) {
                this.modalPopup.showFailedAlert((JSON.stringify(response.status)).replace(/"/g, ""));
                this.loader.hideLoader();
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
                  if (this.inputQuestionText_TB != '' && this.inputAnswer_TB != '') {
                    this.loader.showLoader();
                    let headers = new Headers();
                    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
                    let options = new RequestOptions({ headers: headers });
                    let postParams = {
                      "raceId": Number(this.activeEventId),
                      "associationId": this.CurrentOrgId,
                      "category": this.cata,
                      "difficultyLevel": this.diffLevel,
                      "question": this.inputQuestionText_TB,
                      "type": "txt", //As the control coming to this function, the questype will be "txt"
                      "questionId": this.qid,
                      "answers": this.answers
                    }
                    this.http.post(BaseURLName.baseURL + "updatequestion", JSON.stringify(postParams), options).subscribe(data => {
                      let response = JSON.parse(data['_body']);
                      console.log(response);
                      if (response.message == 1) {
                        this.uploadToS3BucketTB(this.qid, this.fileExtension);
                      }
                      else if (response.message == 0) {
                        this.modalPopup.showFailedAlert((JSON.stringify(response.status)).replace(/"/g, ""));
                        this.loader.hideLoader();
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
      } else {
        this.modalPopup.showFailedAlert('Invalid file format..');
      }
    }
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
              this.modalPopup.showSuccessAlert('Question updated Successfully!');
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
              this.modalPopup.showSuccessAlert('Question updated Successfully!');
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
}
