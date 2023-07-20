import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageProvider } from '../../@core/data/message.provider';
import { LoaderProvider } from '../../@core/data/loader.provider';
import { Headers, Http, RequestOptions } from '@angular/http';
import { BaseURLName } from '../baseURLfile';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
declare var AWS: any;
import { Router } from '@angular/router';
@Component({
  selector: 'ngx-event-admin',
  templateUrl: './event-admin.component.html',
  styleUrls: ['./event-admin.component.scss']
})
export class EventAdminComponent implements OnInit {
  userForm: any;
  userForm1: any;
  userForm2: any;
  public dd: boolean = false;
  public CurrentOrgId: any;
  public activeEventName: any;
  public orgName: any;
  public imgURL: any;
  public findIndex: any;
  public fileExtension: any;
  public selectedFiles: any;
  public eventt: any;
  public isHighted: boolean = true;
  public dispImage: boolean = false;
  public userFaliureMsg: any;
  public faliureStatus: boolean = false;

  public dd_forLogo: boolean = false;
  public imgURL_forLogo: any;
  public selectedFiles_forLogo: any;
  public eventt_forLogo: any;
  public isHighted_forLogo: boolean = true;
  public dispImage_forLogo: boolean = false;
  public userFaliureMsg_forLogo: any;
  public faliureStatus_forLogo: boolean = false;

  public subject: any;
  public message: any;
  public eventid: any;
  public data: any = [];
  @ViewChild('variable') myInputVariable;
  @ViewChild('variable_forLogo') myInputVariable_forLogo;
  constructor(private formBuilder: FormBuilder, public loader: LoaderProvider, @Inject(SESSION_STORAGE) private storage: StorageService, public modalPopup: MessageProvider, public http: Http,public router:Router) {
    this.CurrentOrgId = this.storage.get('CurrentOrgId');
    this.activeEventName = this.storage.get('activeEventName');
    this.orgName = this.storage.get('OrgName');
    this.eventid = this.storage.get('activeEventId');
    this.userForm = this.formBuilder.group({
      'appsplashscreen': ['', Validators.required]
    });
    this.userForm1 = this.formBuilder.group({
      'logotoUpload': ['', Validators.required]
    });
    this.userForm2 = this.formBuilder.group({
      'subjectname': ['', Validators.required],
      'Messagetosend': ['', Validators.required]
    });
    this.normalDisplaySplash();
    this.normalDisplayLogo();
    this.loadEvents();
  }

  ngOnInit() {
    console.log(this.storage.get('isLoggedin'));
    if (this.storage.get('isLoggedin') == null) {
      this.router.navigate(['pages/login']);
    }
  }
  selectFile(event) {
    this.selectedFiles = event.target.files;
    this.eventt = event;
    this.isHighted = true;
    this.dd = false;
  }
  RemoveSelectedFile() {
    this.myInputVariable.nativeElement.value = "";
    this.dd = true;
    this.dispImage = false;
    this.isHighted = false;
  }
  normalDisplaySplash() {
    this.loader.showLoader();
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    let options = new RequestOptions({ headers: headers });
    let postParams = {
      "associationId": this.CurrentOrgId
    }
    this.http.post(BaseURLName.baseURL + "getassociationsplashscreen", JSON.stringify(postParams), options).map((response) => response.json()).subscribe(res => {
      console.log(res);
      if (res.status == 1) {
        this.dispImage = true;
        this.imgURL = res.fileUrl;
        this.loader.hideLoader();
      }
      else {
        this.loader.hideLoader();
      }
    }, error => {
      console.log(error);// Error getting the data
      this.loader.hideLoader();
    });
  }
  uploadSplash() {
    const file = this.selectedFiles.item(0);
    console.log(file);
    this.findIndex = ((file.name).toString()).lastIndexOf(".");
    console.log(this.findIndex);
    this.fileExtension = ((file.name).toString()).substring(this.findIndex);
    console.log(this.fileExtension);
    var flag = 0;
    var allowed_extensions = [".jpeg", ".png", ".jpg"];
    for (var i = 0; i < allowed_extensions.length; i++) {
      if (allowed_extensions[i] == this.fileExtension) {
        flag = 1;
        break;
      }
      else {
        flag = 0;
      }
    }
    if (flag == 1) {// All are permitted Images
      this.faliureStatus = false;
      this.loader.showLoader();
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
              this.uploadToS3BucketUploadSplash(this.fileExtension);
            }
            else {
              this.loader.hideLoader();
              this.faliureStatus = true;
              this.userFaliureMsg = 'Image Size Not Permitted';
            }
          } else {
            this.loader.hideLoader();
            this.faliureStatus = true;
            this.userFaliureMsg = 'Image resolution Not Permitted';
          }
        }//end of img.onload
      }//end of reader.onload
    }//End of flag==1
    else {
      this.faliureStatus = true;
      this.userFaliureMsg = "File extension not permitted";
    }
  }
  uploadToS3BucketUploadSplash(fileExtension) {
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
        Key: this.CurrentOrgId + '-splashScreen',
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
            "associationId": this.CurrentOrgId
          }
          this.http.post(BaseURLName.baseURL + "uploadsplashscreen", JSON.stringify(postParams), options).subscribe(data => {
            let response = JSON.parse(data['_body']);
            console.log(response);
            if (response.message == 1) {
              this.userForm = this.formBuilder.group({
                'appsplashscreen': ['', Validators.required]
              });
              this.normalDisplaySplash();// Display the newly loaded Splash Screen
              this.modalPopup.showSuccessAlert((JSON.stringify(response.status)).replace(/"/g, ""));
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
  selectFileForLogo(event) {
    this.selectedFiles_forLogo = event.target.files;
    this.eventt_forLogo = event;
    this.isHighted_forLogo = true;
    this.dd_forLogo = false;
  }
  RemoveSelectedFileForLogo() {
    this.myInputVariable_forLogo.nativeElement.value = "";
    this.dd_forLogo = true;
    this.dispImage_forLogo = false;
    this.isHighted_forLogo = false;
  }
  normalDisplayLogo() {
    this.loader.showLoader();
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    let options = new RequestOptions({ headers: headers });
    let postParams = {
      "associationId": this.CurrentOrgId
    }
    this.http.post(BaseURLName.baseURL + "getassociationheaderlogo", JSON.stringify(postParams), options).map((response) => response.json()).subscribe(res => {
      console.log(res);
      if (res.status == 1) {
        this.dispImage_forLogo = true;
        this.imgURL_forLogo = res.fileUrl;
        console.log(this.imgURL_forLogo);
        this.storage.set('headerLogoURL',this.imgURL_forLogo);
        this.loader.hideLoader();
      }
      else {
        this.loader.hideLoader();
      }
    }, error => {
      console.log(error);// Error getting the data
      this.loader.hideLoader();
    });
  }
  uploadHeaderLogo() {
    const file = this.selectedFiles_forLogo.item(0);
    console.log(file);
    this.findIndex = ((file.name).toString()).lastIndexOf(".");
    console.log(this.findIndex);
    this.fileExtension = ((file.name).toString()).substring(this.findIndex);
    console.log(this.fileExtension);
    var flag = 0;
    var allowed_extensions = [".jpeg", ".png", ".jpg"];
    for (var i = 0; i < allowed_extensions.length; i++) {
      if (allowed_extensions[i] == this.fileExtension) {
        flag = 1;
        break;
      }
      else {
        flag = 0;
      }
    }
    if (flag == 1) {// All are permitted Images
      this.faliureStatus_forLogo = false;
      this.loader.showLoader();
      var reader = new FileReader();
      reader.readAsDataURL(this.eventt_forLogo.target.files[0]); // read file as data url
      reader.onload = (event: any) => { // called once readAsDataURL is completed
        var img = new Image;
        img.src = event.target.result;
        img.onload = () => {
          console.log(img.width, img.height);
          if ((img.width >= 200 && img.height >= 320) && (img.width <= 1080 && img.height <= 1920)) {
            if (file.size <= 2097152) {
              console.log('Image Permitted,Now API Can be called...');
              this.uploadToS3BucketUploadLogo(this.fileExtension);
            }
            else {
              this.loader.hideLoader();
              this.faliureStatus_forLogo = true;
              this.userFaliureMsg_forLogo = 'Image Size Not Permitted';
            }
          } else {
            this.loader.hideLoader();
            this.faliureStatus_forLogo = true;
            this.userFaliureMsg_forLogo = 'Image resolution Not Permitted';
          }
        }//end of img.onload
      }//end of reader.onload
    }//End of flag==1
    else {
      this.faliureStatus_forLogo = true;
      this.userFaliureMsg_forLogo = "File extension not permitted";
    }
  }
  uploadToS3BucketUploadLogo(fileExtension) {
    const file = this.selectedFiles_forLogo.item(0);
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
        Key: this.CurrentOrgId + '-headerlogo',
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
            "associationId": this.CurrentOrgId
          }
          this.http.post(BaseURLName.baseURL + "uploadheaderlogo", JSON.stringify(postParams), options).subscribe(data => {
            let response = JSON.parse(data['_body']);
            console.log(response);
            if (response.message == 1) {
              this.userForm1 = this.formBuilder.group({
                'logotoUpload': ['', Validators.required]
              });
              this.normalDisplayLogo()// Display the newly loaded Logo
              this.modalPopup.showSuccessAlert((JSON.stringify(response.status)).replace(/"/g, ""));
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
  sendMessage() {
    this.subject = this.userForm2.value.subjectname;
    this.message = this.userForm2.value.Messagetosend;
    this.loader.showLoader();
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    let options = new RequestOptions({ headers: headers });
    let postParams = {
      "associationId": this.CurrentOrgId,
      //"eventName": this.activeEventName,
      "raceId":this.eventid,
      "subject": this.subject,
      "text": this.message
    }
    this.http.post(BaseURLName.baseURL + "pushmessage", JSON.stringify(postParams), options).subscribe(data => {
      let response = JSON.parse(data['_body']);
      console.log(response);
      if (!response.error) {
        this.userForm2 = this.formBuilder.group({
          'subjectname': ['', Validators.required],
          'Messagetosend': ['', Validators.required]
        });
        this.loader.hideLoader();
        this.modalPopup.showSuccessAlert("Message will be send to all the Active Participants.");
        console.log((JSON.stringify(response.status)).replace(/"/g, ""));
      }
      else {
        console.log((JSON.stringify(response.message)).replace(/"/g, ""));
        this.loader.hideLoader();
      }
    }, error => {
      console.log(error);// Error getting the data
      this.loader.hideLoader();
    });
  }
  loadEvents() {
    console.log(this.orgName);
    this.loader.showLoader();
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    let options = new RequestOptions({ headers: headers });
    let postParams = {
      "associationName": this.orgName
    }
    this.http.post(BaseURLName.baseURL + "getracedetails", JSON.stringify(postParams), options).subscribe(data => {
      let res = JSON.parse(data['_body']);
      console.log(res);
      if (res.status == 1) {
        console.log(res.races);
        if (res.races.length > 0) {
          this.data = res.races;
          this.data.map((val) => {
            console.log(val.isenabled);
            if (val.isenabled == 'N')
              this.addKeyValue(val, 'newKey', false);
            else
              this.addKeyValue(val, 'newKey', true);
          });
          console.log(this.data);
        } else {
          this.modalPopup.showFailedAlert('No Event has been Created Yet. Create One Event to Continue.');
        }
        this.loader.hideLoader();
      }
    }, error => {
      console.log(error);// Error getting the data
      this.loader.hideLoader();
    });
  }
  addKeyValue(obj, key, data) {
    obj[key] = data;
  }
  handleChange(event) {
    console.log(event);
    this.loader.showLoader();
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    let options = new RequestOptions({ headers: headers });
    let postParams = {
      "raceName": event.raceName,
      "associationName": this.orgName,
      "isEnabled": 'Y'
    }
    this.http.post(BaseURLName.baseURL + "updateracestatus", JSON.stringify(postParams), options).subscribe(data => {
      let res = JSON.parse(data['_body']);
      console.log(res);
      if (res.status == 1) {
        this.loadEvents();
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
      "associationId": this.CurrentOrgId
    }
    this.http.post(BaseURLName.baseURL + "getactiverace", JSON.stringify(postParams), options).subscribe(data => {
      let res = JSON.parse(data['_body']);
      console.log(res);
      if (res.status == 1) {
        this.storage.set('CurrentOrgId', this.CurrentOrgId);
        this.storage.set('activeEventName', res.eventName);
        this.storage.set('activeEventId', res.eventId);
        this.willDisplay_Location_As_MenuItem(res.eventName);
        setTimeout(() => { 
          //location.reload();
        }, 500);
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
      "association": this.CurrentOrgId,
	    "race":eventName
    }
    this.http.post(BaseURLName.baseURL + "checkracewithoutqr", JSON.stringify(postParams), options).subscribe(data => {
      let res = JSON.parse(data['_body']);
      console.log(res);
      if (!res.error) {
        localStorage.setItem("MenuItem_LocationHidden", res.data.status);
        if (res.data.status == 0) {
          this.modalPopup.showSuccessAlert('Event created with QR Code.');
        } else {
          this.modalPopup.showSuccessAlert('Event created without QR Code.');
        }
        setTimeout(() => {
          location.reload();
        }, 700);
       
      } else {
      }
    }, (err) => {
      console.log(err);
    });
  }
}
