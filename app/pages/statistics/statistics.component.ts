import { Component, OnInit,OnDestroy,Inject } from '@angular/core';
import { MessageProvider } from '../../@core/data/message.provider';
import { SmartTableService } from '../../@core/data/smart-table.service';
import { LocalDataSource } from "ng2-smart-table";
import { Headers, Http, RequestOptions } from '@angular/http';
import { BaseURLName } from '../baseURLfile';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import { LoaderProvider } from '../../@core/data/loader.provider';
import { Router } from '@angular/router';
@Component({
  selector: 'ngx-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit,OnDestroy {
  public activeRaceIdd: any;
  public statusTeamAutorefresh: any;
  public statusQuestionAutorefresh: any;
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
    actions: 
    {
        filter: false,
        add: false,
        edit: false,
        delete: false,
      custom: [{ name: 'view', title: 'Detail' }]
    },
    columns: {
      teamName: {
        title: 'Team Name',
        type: 'string',
      },
      currentStanding: {
        title: 'Current Standing',
        type: 'number',
      },
      noOfboothsVisited: {
        title: 'Number of Booths Visited',
        type: 'number',
      },
      boothVisitedRank: {
        title: 'Booth Visited Rank',
        type: 'number',
      },
      pointsEarned: {
        title: 'Total Points Earned',
        type: 'number',
      },
      questionsPosed: {
        title: 'Number of Questions Posed',
        type: 'number',
      },
      questionsCorrect: {
        title: 'Number Questions Correct',
        type: 'number',
      },
      percentCorrect: {
        title: '% Number of Questions Correct',
        type: 'number',
      },
      noOfHintsTaken: {
        title: 'Number of Hints Taken',
        type: 'number',
      },
      hintsTakenrank: {
        title: 'Hints Taken Rank',
        type: 'number',
      }
    },
  };
  settings1 = {
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
      delete: false,
      custom: [{ name: 'view', title: 'Detail' }]
    },
    columns: {
      cateqoryName: {
        title: 'Category',
        type: 'string',
      },
      difficultyLevel: {
        title: 'Difficulty Level',
        type: 'string',
      },
      question: {
        title: 'List of Questions',
        type: 'string',
      },
      noofTimesQuestionAttempted: {
        title: 'Times question attempted',
        type: 'number',
      },
      noOfTimesQuestionAnsweredCorrectly: {
        title: 'Times answered correctly',
        type: 'number',
      },
      noOfTimesQuestionAnsweredIncorrectly: {
        title: 'Times answered incorrectly',
        type: 'number',
      }
    },
  };
  source: LocalDataSource = new LocalDataSource();
  source1: LocalDataSource = new LocalDataSource();
  teamdata: any = [];
  questiondata: any = [];
  constructor(public modalPopup: MessageProvider,private http:Http,private service: SmartTableService,public loader:LoaderProvider,@Inject(SESSION_STORAGE) private storage: StorageService,public router:Router) { 
    this.service.loadTeamStats().then((result) => {
      console.log(result);
      this.teamdata = result;
      this.teamdata.map((val)=>{
        this.addKeyValueTeam(val, 'newKey', 'Detail');
      });
      this.source.load(this.teamdata);
    });
    this.service.loadQuestionStats().then((result) => {
      console.log(result);
      this.questiondata = result;
      this.questiondata.map((val)=>{
        this.addKeyValueQuestion(val, 'newKey', 'Detail');
      });
      this.source1.load(this.questiondata);
    });
  }
  addKeyValueTeam(obj, key, data){
    obj[key] = data;
  }
  addKeyValueQuestion(obj, key, data){
    obj[key] = data;
  }
  ngOnInit() {
    console.log('Entering Statistics Page start refreshing');
    this.statusTeamAutorefresh = setInterval(()=> {
      this.service.loadTeamStats().then((result) => {
        console.log(result);
        this.teamdata = result;
        this.teamdata.map((val)=>{
          this.addKeyValueTeam(val, 'newKey', 'Detail');
        });
        this.source.load(this.teamdata);
      });
    }, 5000); 
    this.statusQuestionAutorefresh = setInterval(() => {
      this.service.loadQuestionStats().then((result) => {
        console.log(result);
        this.questiondata = result;
        this.questiondata.map((val)=>{
          this.addKeyValueQuestion(val, 'newKey', 'Detail');
        });
        this.source1.load(this.questiondata);
      });
    },5000);
    console.log(this.storage.get('isLoggedin'));
    if (this.storage.get('isLoggedin') == null) {
      this.router.navigate(['pages/login']);
    }
  }
  ngOnDestroy() {
    console.log('Exiting Statistics Page and Stop refreshing');
    clearInterval(this.statusTeamAutorefresh);
    clearInterval(this.statusQuestionAutorefresh);
  }
  startRefresh() {
    console.log('Force start applied...');
    this.statusTeamAutorefresh = setInterval(()=> {
      this.service.loadTeamStats().then((result) => {
        console.log(result);
        this.teamdata = result;
        this.source.load(this.teamdata);
      });
    }, 5000); 
    this.statusQuestionAutorefresh = setInterval(() => {
      this.service.loadQuestionStats().then((result) => {
        console.log(result);
        this.questiondata = result;
        this.source1.load(this.questiondata);
      });
    },5000);
  }
  stopRefresh() {
    console.log('Force Stop applied...');
    clearInterval(this.statusTeamAutorefresh);
    clearInterval(this.statusQuestionAutorefresh);
  }
  customFuncTeam(event) {
    console.log(event);
    this.router.navigate(['pages/teamwise',event.data]);
  }
  customFuncQuestion(event) {
    console.log(event);
    this.router.navigate(['pages/questionwise',event.data]);
  }
}
