import { Injectable, Inject} from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { BaseURLName } from '../../pages/baseURLfile';
import 'rxjs/add/operator/map';
import { LoaderProvider } from '../../@core/data/loader.provider';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';

@Injectable()
export class SmartTableService {
  public returneddata: any = [];
  public activeRaceIdd: any;
  public assoname: any;
  constructor(public http: Http, public loader: LoaderProvider, @Inject(SESSION_STORAGE) private storage: StorageService) {
 
  }

  loadCalendar() {
    this.loader.showLoader();
    return this.http.get(BaseURLName.baseURL + "portalcalenderview").map((response) => response.json()).toPromise();
  }
  loadregisteredOrganizations() {
    this.loader.showLoader();
    return this.http.get(BaseURLName.baseURL + "getallassociationsdetails").map((response) => response.json()).toPromise();
  }
  loadTeams() {
    this.activeRaceIdd = this.storage.get('activeEventId');
    this.assoname = this.storage.get('OrgName');
    console.log("Active Race Details: " + this.assoname+ this.activeRaceIdd);
    this.loader.showLoader();
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    let options = new RequestOptions({ headers: headers });
    return new Promise((resolve, reject) => {
      let postParams = {
        "associationName": this.assoname,
        "raceId": Number(this.activeRaceIdd)
      }
      this.http.post(BaseURLName.baseURL + "getteamdetails", JSON.stringify(postParams), options).map((response) => response.json()).subscribe(res => {
        //let response = JSON.parse(data['_body']);
        console.log(res);
        if (res.status == 1) {
          resolve(res.teamDetails);
        }
        else if (res.status == 0) {

        }
      }, error => {
        this.loader.hideLoader();
        console.log(error);
        reject(error);// Error getting the data
      });
    })
  }
  loadTeamStats() {
    this.activeRaceIdd = this.storage.get('activeEventId');
    this.assoname = this.storage.get('OrgName');
    let headers = new Headers();
    //this.loader.showLoader();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    let options = new RequestOptions({ headers: headers });
    return new Promise((resolve, reject) => { 
      let postParams = {
        "raceId": Number(this.activeRaceIdd)
      }
      this.http.post(BaseURLName.baseURL + "racestats", JSON.stringify(postParams), options).map((response) => response.json()).subscribe(res => {
        console.log(res);
        if (res.status == 1) {
          resolve(res.raceStats);
        }
      }, error => {
        reject(error);// Error getting the data
      });
    })
  }
  loadQuestionStats() {
    this.activeRaceIdd = this.storage.get('activeEventId');
    this.assoname = this.storage.get('OrgName');
    let headers = new Headers();
    //this.loader.showLoader();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    let options = new RequestOptions({ headers: headers });
    return new Promise((resolve, reject) => { 
      let postParams = {
        "raceId": Number(this.activeRaceIdd)
      }
      this.http.post(BaseURLName.baseURL + "questionstats", JSON.stringify(postParams), options).map((response) => response.json()).subscribe(res => {
        console.log(res);
        if (res.status == 1) {
          resolve(res.questions);
        }
      }, error => {
        reject(error);// Error getting the data
      });
    })
  }
  loadCategorySummary() {
    this.activeRaceIdd = this.storage.get('activeEventId');
    let headers = new Headers();
    this.loader.showLoader();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    let options = new RequestOptions({ headers: headers });
    return new Promise((resolve, reject) => { 
      let postParams = {
        "raceId": Number(this.activeRaceIdd)
      }
      this.http.post(BaseURLName.baseURL + "getassociationcategory", JSON.stringify(postParams), options).map((response) => response.json()).subscribe(res => {
        console.log(res);
        if (res.status == 1) {
          resolve(res.categoryList);
        }
      }, error => {
        reject(error);// Error getting the data
      });
    })
  }
  loadSponsorSummary() {
    this.activeRaceIdd = this.storage.get('activeEventId');
    let headers = new Headers();
    this.loader.showLoader();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    let options = new RequestOptions({ headers: headers });
    return new Promise((resolve, reject) => { 
      let postParams = {
        "raceId": Number(this.activeRaceIdd)
      }
      this.http.post(BaseURLName.baseURL + "getsponsordetails", JSON.stringify(postParams), options).map((response) => response.json()).subscribe(res => {
        console.log(res);
        if (res.status == 1) {
          resolve(res.sponsors);
        }
      }, error => {
        reject(error);// Error getting the data
      });
    })
  }
  // loadCalendar() {
  //   this.http.get(BaseURLName.baseURL + "portalcalenderview").subscribe((data) => { 
  //       var response = JSON.parse(data['_body']);
  //     this.returneddata = response.calenderView;
  //     return this.returneddata;
  //       //data=this.returneddata;
  //     }
  //   );
  // }
  data = [{

  }];

  getData() {
    return this.data;
  }
}
