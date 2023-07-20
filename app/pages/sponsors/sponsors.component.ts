import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { SmartTableService } from '../../@core/data/smart-table.service';
import { LocalDataSource } from "ng2-smart-table";
import { FormBuilder, Validators } from '@angular/forms';
import { MessageProvider } from '../../@core/data/message.provider';
import { LoaderProvider } from '../../@core/data/loader.provider';
import { Headers, Http, RequestOptions } from '@angular/http';
import { BaseURLName } from '../baseURLfile';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
declare var AWS: any;
import { reject } from 'q';
import { Router } from '@angular/router';
@Component({
  selector: 'ngx-sponsors',
  templateUrl: './sponsors.component.html',
  styleUrls: ['./sponsors.component.scss']
})
export class SponsorsComponent implements OnInit {
  public activeEventId: any;
  settings = {
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
      edit: false,
      delete: true
    },
    columns: {
      category: {
        title: 'Category',
        type: 'string',
      },
      sponsorName: {
        title: 'Sponsor Name',
        type: 'string',
      },
      logoUrl: {
        title: 'Logo URL',
        type: 'string',
      }
    },
  };
  source: LocalDataSource = new LocalDataSource();
  sponsordata: any = [];
  public userForm: any;
  public userForm1: any;
  public dd: boolean = false;
  public dd_update: boolean = false;
  public categoryList: any = [];
  public sponsorNames: any = [];
  public selectedFiles: any;
  public selectedFilesUpdate: any;
  public imgURL: any;
  public imgURLupdate: any;
  public eventt: any;
  public eventtUpdate: any;
  public CurrentOrgId: any;
  public dispImage: boolean = false;
  public dispImageupdate: boolean = false;
  public cataName: any;
  public newSponsorname: any;
  public selectedSponsorname: any;
  public findIndex: any;
  public fileExtension: any;
  public userFaliureMsg: any;
  public userFaliureMsgUpdate: any;
  public faliureStatus: boolean = false;
  public faliureStatusUpdate: boolean = false;
  public isHighted: boolean = true;
  public isHightedUpdate: boolean = true;
  @ViewChild('variable') myInputVariable;
  @ViewChild('variableUpdate') myInputVariableUpdate;
  constructor(private formBuilder: FormBuilder, private service: SmartTableService, public loader: LoaderProvider, @Inject(SESSION_STORAGE) private storage: StorageService, public modalPopup: MessageProvider, public http: Http,public router:Router) {
    this.activeEventId = this.storage.get('activeEventId');
    this.CurrentOrgId = this.storage.get('CurrentOrgId');
    this.loadCategory();
    this.loadSponsors();
    this.service.loadSponsorSummary().then((result) => {
      console.log(result);
      this.sponsordata = result;
      this.source.load(this.sponsordata);
      this.loader.hideLoader();
    });
    this.userForm = this.formBuilder.group({
      'cataList': ['', Validators.required],
      'newsponsorname': ['', Validators.required],
      'sponsorlogo': ['', Validators.required]
    });
    this.userForm1 = this.formBuilder.group({
      'sponsorList': ['', Validators.required],
      'sponsorlogo': ['', Validators.required]
    });
  }

  ngOnInit() {
    console.log(this.storage.get('isLoggedin'));
    if (this.storage.get('isLoggedin') == null) {
      this.router.navigate(['pages/login']);
    }
  }
  onUserRowSelect(event) {
    
  }
  onDeleteConfirm(event) {
    console.log(event.data.sponsorName);
    const decision = this.modalPopup.showYesNoConfirm("Alert !!", `Do you want to delete the Sponsor ${event.data.sponsorName}?`);
    decision.result.then((result) => {
      this.loader.showLoader();
      console.log(result);
      let headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      let options = new RequestOptions({ headers: headers });
      let postParams = {
        "raceId": Number(this.activeEventId),
        "sponsorName": event.data.sponsorName
      }
      this.http.post(BaseURLName.baseURL + "deletesponsor", JSON.stringify(postParams), options).map((response) => response.json()).subscribe(res => {
        console.log(res);
        if (res.status == 1) {
          this.modalPopup.showSuccessAlert('Sponsor Deleted Sussessfully.');
          //Load existing set of Sponsors
          this.service.loadSponsorSummary().then((result) => {
            console.log(result);
            this.sponsordata = result;
            this.source.load(this.sponsordata);
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
  loadSponsors() {
    this.loader.showLoader();
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    let options = new RequestOptions({ headers: headers });
    let postParams = {
      "raceId": Number(this.activeEventId)
    }
    this.http.post(BaseURLName.baseURL + "getsponsordetails", JSON.stringify(postParams), options).subscribe(data => {
      let response = JSON.parse(data['_body']);
      console.log(response);
      this.loader.hideLoader();
      if (response.status == 1) {
        this.sponsorNames = response.sponsors;
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
  selectFile(event) {
    this.selectedFiles = event.target.files;
    this.eventt = event;
    this.isHighted = true;
    this.dd = false;
  }
  previewImage() {
    this.dispImage = true;
    if (this.eventt.target.files && this.eventt.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(this.eventt.target.files[0]); // read file as data url
      reader.onload = (event: any) => { // called once readAsDataURL is completed
        console.log(event);
        this.imgURL = event.target.result;
      }
    }
  }
  RemoveSelectedFile() {
    this.myInputVariable.nativeElement.value = "";
    this.dispImage = false;
    this.isHighted = false;
    this.dd = true;
  }
  createSponsor() {
    this.cataName = this.userForm.value.cataList;
    this.newSponsorname = this.userForm.value.newsponsorname;
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
              let headers = new Headers();
              headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
              let options = new RequestOptions({ headers: headers });
              let postParams = {
                "raceId": Number(this.activeEventId),
                "associationId": this.CurrentOrgId,
                "category": this.cataName,
                "sponsorName": this.newSponsorname,
                "isSponsored": "Y"
              }
              this.http.post(BaseURLName.baseURL + "addsponsor", JSON.stringify(postParams), options).subscribe(data => {
                let response = JSON.parse(data['_body']);
                console.log(response);
                if (response.status == 1) {
                  this.uploadToS3Bucket(this.newSponsorname, this.fileExtension);// Upload logo funaction called
                  ///////////////////////////
                 
                  //////////////////////////
                }
                else if (response.status == 0) {
                  this.loader.hideLoader();
                  this.modalPopup.showFailedAlert((JSON.stringify(response.message)).replace(/"/g, ""));
                }
              }, error => {
                console.log(error);// Error getting the data
                this.loader.hideLoader();
              });
            }
            else {
              this.loader.hideLoader();
              this.faliureStatus = true;
              this.userFaliureMsg='Image Size Not Permitted';
            }
          } else {
            this.loader.hideLoader();
            this.faliureStatus = true;
            this.userFaliureMsg='Image resolution Not Permitted';
          }
        }//end of img.onload
      }//end of reader.onload
    }//End of flag==1
    else {
      this.faliureStatus = true;
      this.userFaliureMsg = "File extension not permitted";
    }
  }
  uploadToS3Bucket(sponsorName, fileExtension) {
    console.log(this.activeEventId,sponsorName,fileExtension);
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
        Key: this.activeEventId + '-' + sponsorName + '-sponsorlogo',
        ContentType: fileExtension,
        Body: file,
        ACL: 'public-read'
      };
      s3.putObject(params, (err, res)=> {
        if (err) {
          console.log(err);
        } else {
          console.log(res);
          let headers = new Headers();
          headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
          let options = new RequestOptions({ headers: headers });
          let postParams = {
            "raceId": Number(this.activeEventId),
            "sponsorName": sponsorName
          }
          
          this.http.post(BaseURLName.baseURL + "uploadsponsorlogo", JSON.stringify(postParams), options).subscribe(data => {
            let response = JSON.parse(data['_body']);
            console.log(response);
            if (response.message == 1) {
              this.userForm = this.formBuilder.group({
                'cataList': ['', Validators.required],
                'newsponsorname': ['', Validators.required],
                'sponsorlogo': ['', Validators.required]
              });
              this.service.loadSponsorSummary().then((result) => {
                console.log(result);
                this.sponsordata = result;
                this.source.load(this.sponsordata);
              });
              
              this.modalPopup.showSuccessAlert((JSON.stringify(response.status)).replace(/"/g, ""));
              console.log((JSON.stringify(response.status)).replace(/"/g, ""));
              this.loadSponsors();
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
  selectFileUpdate(event) {
    this.selectedFilesUpdate = event.target.files;
    this.eventtUpdate = event;
    this.isHightedUpdate = true;
    this.dd_update = false;
  }
  previewImageUpdate() {
    this.dispImageupdate = true;
    if (this.eventtUpdate.target.files && this.eventtUpdate.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(this.eventtUpdate.target.files[0]); // read file as data url
      reader.onload = (event: any) => { // called once readAsDataURL is completed
        console.log(event);
        this.imgURLupdate = event.target.result;
      }
    }
  }
  RemoveSelectedFileUpdate() {
    this.myInputVariableUpdate.nativeElement.value = "";
    this.dispImageupdate = false;
    this.isHightedUpdate = false;
    this.dd_update = true;
  }
  updateSponsorLogo() {
    this.selectedSponsorname = this.userForm1.value.sponsorList;
    const file = this.selectedFilesUpdate.item(0);
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
      this.faliureStatusUpdate = false;
      this.loader.showLoader();
      var reader = new FileReader();
      reader.readAsDataURL(this.eventtUpdate.target.files[0]); // read file as data url
      reader.onload = (event: any) => { // called once readAsDataURL is completed
        var img = new Image;
        img.src = event.target.result;
        img.onload = () => {
          console.log(img.width, img.height);
          if ((img.width >= 200 && img.height >= 320) && (img.width <= 1080 && img.height <= 1920)) {
            if (file.size <= 2097152) {
              console.log('Image Permitted,Now API Can be called...');
              this.uploadToS3BucketUpdate(this.selectedSponsorname,this.fileExtension);// Upload logo funaction called
            }
            else {
              this.loader.hideLoader();
              this.faliureStatusUpdate = true;
              this.userFaliureMsgUpdate='Image Size Not Permitted';
            }
          } else {
            this.loader.hideLoader();
            this.faliureStatusUpdate = true;
            this.userFaliureMsgUpdate='Image resolution Not Permitted';
          }
        }//end of img.onload
      }//end of reader.onload
    }//End of flag==1
    else {
      this.faliureStatusUpdate = true;
      this.userFaliureMsgUpdate = "File extension not permitted";
    }
  }
  uploadToS3BucketUpdate(sponsorName,fileExtension) {
    const file = this.selectedFilesUpdate.item(0);
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
        Key: this.activeEventId + '-' + sponsorName + '-sponsorlogo',
        ContentType: fileExtension,
        Body: file,
        ACL: 'public-read'
      };
      s3.putObject(params, (err, res)=> {
        if (err) {
          console.log(err);
        } else {
          console.log(res);
          let headers = new Headers();
          headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
          let options = new RequestOptions({ headers: headers });
          let postParams = {
            "raceId": Number(this.activeEventId),
            "sponsorName": sponsorName
          }
          
          this.http.post(BaseURLName.baseURL + "uploadsponsorlogo", JSON.stringify(postParams), options).subscribe(data => {
            let response = JSON.parse(data['_body']);
            console.log(response);
            if (response.message == 1) {
              this.userForm1 = this.formBuilder.group({
                'sponsorList': ['', Validators.required],
                'sponsorlogo': ['', Validators.required]
              });
              this.service.loadSponsorSummary().then((result) => {
                console.log(result);
                this.sponsordata = result;
                this.source.load(this.sponsordata);
              });
              
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
}
