import { Component, OnInit,Inject} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import { SmartTableService } from '../../@core/data/smart-table.service';
import { LocalDataSource } from "ng2-smart-table";
import { LoaderProvider } from '../../@core/data/loader.provider';
import { Headers, Http, RequestOptions } from '@angular/http';
import { BaseURLName } from '../baseURLfile';
import { MessageProvider } from '../../@core/data/message.provider';
@Component({
  selector: 'ngx-teamwise-detail',
  templateUrl: './teamwise-detail.component.html',
  styleUrls: ['./teamwise-detail.component.scss']
})
export class TeamwiseDetailComponent implements OnInit {
  public teamName: any;
  public activeEventid: any;
  public data: any = [];
  public oldData: any = [];
  constructor(public route:ActivatedRoute,@Inject(SESSION_STORAGE) private storage: StorageService,private service: SmartTableService,public loader:LoaderProvider,public http:Http,public modalPopup: MessageProvider) { 
    this.route.params.subscribe((data) => {
      this.teamName = data.teamName;
    });
    this.activeEventid = this.storage.get('activeEventId');
    this.loadTeamWiseDetails();
  }
  ngOnInit() {
  }
  loadTeamWiseDetails() {
    this.loader.hideLoader();
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    let options = new RequestOptions({ headers: headers });
    let postParams = {
      "team": this.teamName,
      "race_id": this.activeEventid
    }
    this.http.post(BaseURLName.baseURL + "getsingleteamstat", JSON.stringify(postParams), options).map((response) => response.json()).subscribe(res => {
      console.log(res.data);
      this.oldData = res.data;
      if (this.oldData.length > 0) {
        for (let i = 0; i < this.oldData.length; i++) {
          console.log(this.oldData[i].question_type);
          if (this.oldData[i].question_type == 'mcq' || this.oldData[i].question_type == 'txt') {
            let ans = this.oldData[i]['answers'];
            ans = ans.split('|||');
            let p = [], k, m;
            if (this.oldData[i].question_type == 'txt') {// If the question is Text based type thre will be no 'Option', only correct ans and hint will be there
              p = [];//For the above reason setting the array to blank here
            }
            else {
              for (let j = 0; j < ans.length - 1; j++) {    //Generating Array for available options for MCQ Type
                p.push(ans[j]);
              }
            }

            if (this.oldData[i].question_type == 'txt') {  //Anssign value of ans[0] to "correctAnswer"
              k = ans[0];
            }
            else {
              for (let j = 0; j < ans.length - 1; j++) {         //Otherwise print the Alphabets
                if (ans[j] == this.oldData[i]['correct_answer']) {
                  k = String.fromCharCode(65 + j)
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
              correctAnswer: k,
              newansarr: p,
              hint: m,
              correct_answer: this.oldData[i]['correct_answer'],
              question_type: this.oldData[i]['question_type'],
              marks: this.oldData[i]['marks'],
              answered: this.oldData[i]['answered'],
              question: this.oldData[i]['question'],
              images_videos_url: this.oldData[i]['images_videos_url'],
              category: this.oldData[i]['category'],
              difficulty_level: this.oldData[i]['difficulty_level'],
              answer:this.oldData[i]['answer'],
            });
          }
        }
      } else {
        this.modalPopup.showFailedAlert('No Details Found of Team '+this.teamName);
      }
      console.log(this.data);
      this.loader.hideLoader();
    }, error => {
      console.log(error);// Error getting the data
      this.loader.hideLoader();
    });
  }
}
