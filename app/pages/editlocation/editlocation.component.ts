import { Component, OnInit, Inject,ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from "@angular/forms";
import { Headers, Http, RequestOptions } from '@angular/http';
import { LoaderProvider } from '../../@core/data/loader.provider';
import { MessageProvider } from '../../@core/data/message.provider';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import { BaseURLName } from '../baseURLfile';
declare var AWS: any;
@Component({
  selector: 'ngx-editlocation',
  templateUrl: './editlocation.component.html',
  styleUrls: ['./editlocation.component.scss']
})
export class EditlocationComponent implements OnInit {
  public locationName: any;
  public newlocationName: any;
  public activeRaceIdd: any;
  public CurrentOrgId: any;
  public orgName: any;
  userForm: any;
  public imageURL: any;
  public eventt: any;
  public selectedFiles: any;
  public locatioName: any;
  public desc: any;
  public findIndex: any;
  public fileExtension: any;
  public activeEventId: any;
  public isHightedUpdate: boolean = false;
  public dispImageupdate: boolean = false;
  @ViewChild('variable') myInputVariable;
  constructor(public router: Router, public route: ActivatedRoute, public formBuilder: FormBuilder, public loader: LoaderProvider, public modalPopup: MessageProvider, public http: Http, @Inject(SESSION_STORAGE) private storage: StorageService) {
    this.activeRaceIdd = this.storage.get('activeEventId');
    this.orgName = this.storage.get('OrgName');
    this.CurrentOrgId = this.storage.get('CurrentOrgId');
    this.route.params.subscribe((params) => {
      this.locationName = params['locationName'];
      console.log(this.locationName);
    });
    this.userForm = this.formBuilder.group({
      'locaName': [''],
      'locaName1':[''],
      'descTxt': [],
      'locationlogo': []
    });
    this.locationSummary();
   }

  ngOnInit() {
    console.log(this.storage.get('isLoggedin'));
    if (this.storage.get('isLoggedin') == null) {
      this.router.navigate(['pages/login']);
    }
  }
  locationSummary() {
    this.loader.showLoader();
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    let options = new RequestOptions({ headers: headers });
    let postParams = {
      "raceId": this.activeRaceIdd
    }
    this.http.post(BaseURLName.baseURL + "getexhibitorsdetails", JSON.stringify(postParams), options).subscribe(data => {
      let response = JSON.parse(data['_body']);
      console.log(response);
      if (response.status == 1) {
        response.exhibitors.forEach((v, k) => {
          if (v.name == this.locationName) {
            console.log(v.name, this.locationName);
            this.userForm = this.formBuilder.group({
              'locaName': [v.name, Validators.required],
              'locaName1':[''],
              'descTxt': [v.profile],
              'locationlogo': []
            });   
            if (v.logoUrl != undefined) {
              this.imageURL = v.logoUrl;
            }
            else {
              this.imageURL = "No URL found";
            }
          }
        });
        this.loader.hideLoader();
      }
      else {
        this.modalPopup.showSuccessAlert((JSON.stringify(response.message)).replace(/"/g, ""));
        console.log((JSON.stringify(response.message)).replace(/"/g, ""));
        this.loader.hideLoader();
      }
    }, error => {
      console.log(error);// Error getting the data
      this.loader.hideLoader();
    });
  }
  selectFile(event) {
    this.selectedFiles = event.target.files;
    this.eventt = event;
  }
  RemoveSelectedFile() {
    this.myInputVariable.nativeElement.value = "";
  }
  updateLocation() {
    this.locatioName = this.userForm.value.locaName;
    this.newlocationName = this.userForm.value.locaName1;
    if (this.newlocationName=='') {
      this.newlocationName = this.locatioName;
    } else {
      //Do nothing
    }
    this.desc = this.userForm.value.descTxt;
    console.log(this.locatioName, this.desc);
    if (this.selectedFiles == undefined) {// Create Location without an Image
      this.loader.showLoader();
      let headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      let options = new RequestOptions({ headers: headers });
      let postParams = {
        "associationId": this.CurrentOrgId,
        "raceId": Number(this.activeRaceIdd),
        "exhibitorName": this.locatioName,
        "newName":this.newlocationName,
        "boothNumber": "1",
        "url": "",
        "profile": this.desc,
        "contactName": "",
        "contactTitle": "",
        "countryCode": "",
        "areaCode": "",
        "firstNumber": "",
        "lastNumber": "",
        "email": ""
      }
      this.http.post(BaseURLName.baseURL + "updateexhibitor", JSON.stringify(postParams), options).subscribe(data => {
        let response = JSON.parse(data['_body']);
        console.log(response);
        if (!response.error) {
          this.loader.hideLoader();
          this.locationSummary();
          this.modalPopup.showSuccessAlert('Location Updated Successfully!');
        }
        else if (response.error) {
          this.loader.hideLoader();
          this.modalPopup.showFailedAlert("Location Not Updated Successfully! " + (JSON.stringify(response.message)).replace(/"/g, ""));
        }
      }, error => {
        console.log(error);// Error getting the data
        this.loader.hideLoader();
      });
    } else { // Create Location with an Image
      const file = this.selectedFiles.item(0);
      console.log(file);
      this.findIndex = ((file.name).toString()).lastIndexOf(".");
      console.log(this.findIndex);
      this.fileExtension = ((file.name).toString()).substring(this.findIndex);
      console.log(this.fileExtension);
      var flagg = 0;
      var allowed_extensions = [".jpeg", ".png", ".jpg"];
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
        if (this.fileExtension == ".jpg" || this.fileExtension == ".jpeg" || this.fileExtension == ".png") {
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
                    "associationId": this.CurrentOrgId,
                    "raceId": Number(this.activeRaceIdd),
                    "exhibitorName": this.locatioName,
                    "newName":this.newlocationName,
                    "boothNumber": "",
                    "url": "",
                    "profile": this.desc,
                    "contactName": "",
                    "contactTitle": "",
                    "countryCode": "",
                    "areaCode": "",
                    "firstNumber": "",
                    "lastNumber": "",
                    "email": ""
                  }
                  this.http.post(BaseURLName.baseURL + "updateexhibitor", JSON.stringify(postParams), options).subscribe(data => {
                    let response = JSON.parse(data['_body']);
                    console.log(response);
                    if (!response.error) {
                      this.uploadToS3Bucket(this.locatioName, this.fileExtension);// Upload Image only
                      //this.modalPopup.showSuccessAlert('Location Added Successfully!');
                    }
                    else if (response.error) {
                      this.loader.hideLoader();
                      this.modalPopup.showFailedAlert("Location Not Updated Successfully! " + (JSON.stringify(response.message)).replace(/"/g, ""));
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
      } else {
        this.modalPopup.showFailedAlert('Invalid File..');
      }
    }//end main else condition
  }
  uploadToS3Bucket(locationName, fileExtension) {
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
        Key: this.activeRaceIdd + '-' + locationName + '-logo',
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
            "exhibitorName": locationName,
            "raceId": this.activeRaceIdd
          }
          this.http.post(BaseURLName.baseURL + "uploadexhibitorlogo", JSON.stringify(postParams), options).subscribe(data => {
            let response = JSON.parse(data['_body']);
            console.log(response);
            if (response.message == 1) {
              this.locationSummary();
              //this.loadQuestionSummary();
              this.modalPopup.showSuccessAlert('Location Updated Successfully!');
              console.log((JSON.stringify(response.status)).replace(/"/g, ""));
              this.loader.hideLoader();
            }
            else {
              this.modalPopup.showSuccessAlert('Location Not Updated Successfully!');
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
