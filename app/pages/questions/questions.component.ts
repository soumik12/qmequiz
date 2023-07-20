import { Component, OnInit, Inject } from '@angular/core';
import { SmartTableService } from '../../@core/data/smart-table.service';
import { LocalDataSource } from "ng2-smart-table";
import { FormBuilder, Validators } from '@angular/forms';
import { MessageProvider } from '../../@core/data/message.provider';
import { LoaderProvider } from '../../@core/data/loader.provider';
import { Headers, Http, RequestOptions } from '@angular/http';
import { BaseURLName } from '../baseURLfile';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import { reject } from 'q';
import { Router } from '@angular/router';
@Component({
  selector: 'ngx-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit {
  public userForm: any;
  public newCataName: any;
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
      edit: true,
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
      }
    },
  };
  source: LocalDataSource = new LocalDataSource();
  categorydata: any = [];
  constructor(private formBuilder: FormBuilder, public modalPopup: MessageProvider, public loader: LoaderProvider, public http: Http, @Inject(SESSION_STORAGE) private storage: StorageService,private service: SmartTableService,public router:Router) {
    this.activeEventId = this.storage.get('activeEventId');
    this.userForm = this.formBuilder.group({
      'newcategoryname': ['', Validators.required]
    });
    this.service.loadCategorySummary().then((result) => {
      console.log(result);
      this.categorydata = result;
      this.source.load(this.categorydata);
      this.loader.hideLoader();
    });
  }

  ngOnInit() {
    console.log(this.storage.get('isLoggedin'));
    if (this.storage.get('isLoggedin') == null) {
      this.router.navigate(['pages/login']);
    }
  }
  createCategory() {
    this.newCataName = this.userForm.value.newcategoryname;
    console.log(this.newCataName,this.activeEventId);
    this.loader.showLoader();
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    let options = new RequestOptions({ headers: headers });
    let postParams = {
      "name": this.newCataName,
      "raceId": Number(this.activeEventId)
    }
    this.http.post(BaseURLName.baseURL + "addcategory", JSON.stringify(postParams), options).subscribe(data => {
      let response = JSON.parse(data['_body']);
      console.log(response);
      this.loader.hideLoader();
      if (response.status == 1) {
        this.userForm = this.formBuilder.group({
          'newcategoryname': ['', Validators.required]
        });
        this.service.loadCategorySummary().then((result) => {
          console.log(result);
          this.categorydata = result;
          this.source.load(this.categorydata);
          this.loader.hideLoader();
        });
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
  onDeleteConfirm(event) {
    console.log(event.data.category);
    const decision = this.modalPopup.showYesNoConfirm("Alert !!", `Do you want to delete the Category ${event.data.category}?`);
    decision.result.then((result) => {
      this.loader.showLoader();
      console.log(result);
      let headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      let options = new RequestOptions({ headers: headers });
      let postParams = {
        "raceId": Number(this.activeEventId),
        "categoryName": event.data.category
      }
      this.http.post(BaseURLName.baseURL + "deletecategory", JSON.stringify(postParams), options).map((response) => response.json()).subscribe(res => {
        console.log(res);
        if (res.status == 1) {
          this.modalPopup.showSuccessAlert('Category Deleted Sussessfully.');
          //Load existing set of Categories
          this.service.loadCategorySummary().then((result) => {
            console.log(result);
            this.categorydata = result;
            this.source.load(this.categorydata);
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
    console.log(event.data.category + "  " + event.newData.sponsorName);
    if (event.data.category != event.newData.category) { //If two names are not identical
      let headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      let options = new RequestOptions({ headers: headers });
      let postParams = {
        "raceId": Number(this.activeEventId),
        "oldCategoryName": event.data.category,
        "newCategoryName": event.newData.category
      }
      this.http.post(BaseURLName.baseURL + "updatecategory", JSON.stringify(postParams), options).map((response) => response.json()).subscribe(res => {
        console.log(res);
        if (res.status == 1) {
          this.modalPopup.showSuccessAlert('Category Updated Sussessfully.');
          //Load existing set of categories
          this.service.loadCategorySummary().then((result) => {
            console.log(result);
            this.categorydata = result;
            this.source.load(this.categorydata);
          });
          this.loader.hideLoader();
        } else {
          this.modalPopup.showFailedAlert((JSON.stringify(res.message)).replace(/"/g,""));
        }
      }, error => {
        console.log(error);// Error getting the data
        this.loader.hideLoader();
      });
    }
   }
}
