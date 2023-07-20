import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import { SmartTableService } from '../../@core/data/smart-table.service';
import { LocalDataSource } from "ng2-smart-table";
import { LoaderProvider } from '../../@core/data/loader.provider';
import { Headers, Http, RequestOptions } from '@angular/http';
import { BaseURLName } from '../baseURLfile';
import { MessageProvider } from '../../@core/data/message.provider';
@Component({
  selector: 'ngx-questionwise-detail',
  templateUrl: './questionwise-detail.component.html',
  styleUrls: ['./questionwise-detail.component.scss']
})
export class QuestionwiseDetailComponent implements OnInit {
  public qid: any;
  public qText: any;
  public data: any = [];
  public oldData: any = [];
  public correctans: any;
  constructor(public route: ActivatedRoute, @Inject(SESSION_STORAGE) private storage: StorageService, private service: SmartTableService, public loader: LoaderProvider, public http: Http, public modalPopup: MessageProvider) {
    this.route.params.subscribe((data) => {
      this.qid = data.questionId;
      this.qText = data.question;
      console.log(data);
    });

    this.loadQuestionWiseDetails();
  }

  ngOnInit() {
  }
  loadQuestionWiseDetails() {
    this.data = [];
    this.loader.hideLoader();
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    let options = new RequestOptions({ headers: headers });
    let postParams = {
      "question_id": this.qid
    }
    this.http.post(BaseURLName.baseURL + "getsinglequestionstat", JSON.stringify(postParams), options).map((response) => response.json()).subscribe(res => {
      console.log(res.data);
      this.data = res.data;
      this.oldData = res.data;
      //console.log(this.oldData);
      if (this.oldData.length > 0) {
        for (let i = 0; i < this.oldData.length; i++) {
          if (this.oldData[i]['answered_tb'] != null) {
            // this.data.push({
            //   answered: this.oldData[i]['answered'],
            //   answer: this.oldData[i]['answer'],
            //   team: this.oldData[i]['team'],
            //   answered_tb1: '',
            //   answered_tb2: '',
            //   answered_tb3: '',
            // });
            this.data.push({
              answered: this.oldData[i]['answered'],
              answer: this.oldData[i]['answer'],
              team: this.oldData[i]['team'],
              answered_tb1: this.oldData[i]['answered_tb'].correct_answer,
              answered_tb2: this.oldData[i]['answered_tb'].hint_taken,
              answered_tb3: this.oldData[i]['answered_tb'].marks_obtained,
            });
          } else {
            
          }

        }
        console.log(this.data);
      } else {
        this.modalPopup.showFailedAlert('No Details Found');
      }
      console.log(this.data);
      this.loader.hideLoader();
    }, error => {
      console.log(error);// Error getting the data
      this.loader.hideLoader();
    });
  }
}
