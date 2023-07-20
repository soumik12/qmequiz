import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import { Router } from '@angular/router';
@Component({
  selector: 'ngx-opinionbased',
  templateUrl: './opinionbased.component.html',
  styleUrls: ['./opinionbased.component.scss']
})
export class OpinionbasedComponent implements OnInit {
  userForm: any;
  data: any=[];
  constructor(public formBuilder: FormBuilder, @Inject(SESSION_STORAGE) private storage: StorageService, public router: Router) {
    this.userForm = this.formBuilder.group({
      'questionText': ['', Validators.required],
      'opinionAnswer1': ['', Validators.required],
      'opinionAnswer2': ['', Validators.required],
      'opinionAnswer3': ['', Validators.required],
      'opinionAnswer4': ['', Validators.required]
    });
  }

  ngOnInit() {
    console.log(this.storage.get('isLoggedin'));
    if (this.storage.get('isLoggedin') == null) {
      this.router.navigate(['pages/login']);
    }
  }
  createQuestion() {

  }
}
