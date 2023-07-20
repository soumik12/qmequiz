import { Component, OnInit,Inject} from '@angular/core';
import { LoaderProvider } from '../../@core/data/loader.provider';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import { MessageProvider } from '../../@core/data/message.provider';
import { Headers, Http, RequestOptions } from '@angular/http';
import { BaseURLName } from '../../pages/baseURLfile';
import { reject } from 'q';
@Component({
  selector: 'ngx-reset-event',
  templateUrl: './reset-event.component.html',
  styleUrls: ['./reset-event.component.scss']
})
export class ResetEventComponent implements OnInit {
  public orgid: any;
  public eventname: any;
  constructor(public loader: LoaderProvider, @Inject(SESSION_STORAGE) private storage: StorageService, public modalPopup: MessageProvider, public http: Http) { 
    this.orgid = this.storage.get('CurrentOrgId');
    this.eventname = this.storage.get('activeEventName');
  }

  ngOnInit() {
  }
  deleteItem(itemName) {
    const decision = this.modalPopup.showYesNoConfirm("Alert !!", `Do you want to Reset ${itemName=='Exhibitor'?'Location':itemName}s? `);
    decision.result.then((result) => {
      this.loader.showLoader();
      console.log(result);
      let headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      let options = new RequestOptions({ headers: headers });
      let postParams = {
        "associationId": this.orgid,
        "raceName": this.eventname,
        "key": itemName.toLowerCase()
      }
      this.http.post(BaseURLName.baseURL + "resetrace", JSON.stringify(postParams), options).map((response) => response.json()).subscribe(res => {
        console.log(res);
        if (res.status == 1) {
          this.modalPopup.showSuccessAlert(`${itemName=='Exhibitor'?'Location':itemName} Reset is Successful.`);
          this.loader.hideLoader();
        } else {
          this.modalPopup.showFailedAlert((res.message).replace(/"/g, ""));
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
  resetStats() {
    const decision = this.modalPopup.showYesNoConfirm("Alert !!", `Do you want to Reset Statistics? `);
    decision.result.then((result) => {
      this.loader.showLoader();
      console.log(result);
      let headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      let options = new RequestOptions({ headers: headers });
      let postParams = {
        "associationId": this.orgid,
        "raceName": this.eventname
      }
      this.http.post(BaseURLName.baseURL + "resetstats", JSON.stringify(postParams), options).map((response) => response.json()).subscribe(res => {
        console.log(res);
        if (res.status == 1) {
          this.modalPopup.showSuccessAlert(`Statistics Reset is Successful.`);
          this.loader.hideLoader();
        } else {
          this.modalPopup.showFailedAlert((res.message).replace(/"/g, ""));
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
