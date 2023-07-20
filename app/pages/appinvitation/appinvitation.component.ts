import { Component, OnInit,Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import { Headers, Http, RequestOptions } from '@angular/http';
import { LoaderProvider } from '../../@core/data/loader.provider';
import { BaseURLName } from '../baseURLfile';
import { MessageProvider } from '../../@core/data/message.provider';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
@Component({
  selector: 'ngx-appinvitation',
  templateUrl: './appinvitation.component.html',
  styleUrls: ['./appinvitation.component.scss']
})
export class AppinvitationComponent implements OnInit {
  userForm2: any;
  data: any = [];
  subjectname: any;
  Messagetosend: any;
  msgText = '';
  CurrentOrgId: any;
  users: any = [];

  invitationMsg = '';
  headerLogoURL: any;
  activeEventName: any;
  activeEventId: any;
  emailData = {
    'Eventville': `<div class="es-wrapper-color"><!--[if gte mso 9]><v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t"><v:fill type="tile" color="#ffffff"></v:fill></v:background><![endif]--> <table class="es-wrapper" style="background-position: center top;" width="100%" cellspacing="0" cellpadding="0"> <tbody> <tr> <td class="esd-email-paddings" valign="top"> <table class="es-header" cellspacing="0" cellpadding="0" align="center"> <tbody> <tr> <td class="esd-stripe" esd-custom-block-id="15610" align="center"> <table class="es-header-body" style="background-color: transparent;" width="600" cellspacing="0" cellpadding="0" align="center"> <tbody> <tr> <td class="esd-structure" align="left"> <table width="100%" cellspacing="0" cellpadding="0"> <tbody> <tr> <td class="esd-container-frame" width="600" valign="top" align="center"> <table width="100%" cellspacing="0" cellpadding="0"> <tbody> <tr> <td class="esd-block-image es-p20b" align="center"> <a href="" target="_blank"><img src="<<<ASSOC_IMG>>>" alt="" style="display: block;" width="154"></a> </td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> <table class="es-content" cellspacing="0" cellpadding="0" align="center"> <tbody> <tr> <td class="esd-stripe" align="center"> <table class="es-content-body" style="background-color: transparent;" width="600" cellspacing="0" cellpadding="0" align="center"> <tbody> <tr> <td class="esd-structure" align="left"> <table width="100%" cellspacing="0" cellpadding="0"> <tbody> <tr> <td class="esd-container-frame" width="600" valign="top" align="center"> <table style="border-radius: 3px; border-collapse: separate; background-color: rgb(252, 252, 252);" width="100%" cellspacing="0" cellpadding="0" bgcolor="#fcfcfc"> <tbody> <tr> <td class="esd-block-text es-m-txt-l es-p30t es-p20r es-p20l" align="left"> <h2 style="color: #333333;">Welcome!</h2> </td></tr><tr> <td class="esd-block-text es-p10t es-p20r es-p20l" bgcolor="#fcfcfc" align="left"> <p>Hi {{NAME}}, download our app Eventville. And use the following event ID to join our game.<br></p></td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr><tr> <td class="esd-structure es-p30t es-p20r es-p20l" style="background-color: rgb(252, 252, 252);" esd-custom-block-id="15791" bgcolor="#fcfcfc" align="left"> <table width="100%" cellspacing="0" cellpadding="0"> <tbody> <tr> <td class="esd-container-frame" width="560" valign="top" align="center"> <table style="border-color: rgb(239, 239, 239); border-style: solid; border-width: 1px; border-radius: 3px; border-collapse: separate; background-color: rgb(255, 255, 255);" width="100%" cellspacing="0" cellpadding="0" bgcolor="#ffffff"> <tbody> <tr> <td class="esd-block-text es-p20t es-p15b" align="center"> <h3 style="color: #333333;">Event ID:</h3> </td></tr><tr> <td class="esd-block-text" align="center"> <p style="color: rgb(100, 67, 74); font-size: 26px; line-height: 150%;"><<<ASSOC_ID>>></p></td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> <table class="es-content" cellspacing="0" cellpadding="0" align="center"> <tbody> <tr> <td class="esd-stripe" align="center"> <table class="es-content-body" style="background-color: rgb(252, 252, 252);" width="600" cellspacing="0" cellpadding="0" bgcolor="#fcfcfc" align="center"> <tbody> <tr> <td class="esd-structure es-p40t es-p25b es-p20r es-p20l" esd-custom-block-id="15790" align="left"><!--[if mso]><table width="560" cellpadding="0" cellspacing="0"><tr><td width="274" valign="top"><![endif]--> <table class="es-left" cellspacing="0" cellpadding="0" align="left"> <tbody> <tr> <td class="es-m-p0r es-m-p20b esd-container-frame" width="254" align="center"> <table width="100%" cellspacing="0" cellpadding="0"> <tbody> <tr> <td class="esd-block-text" align="left"> <h3 style="font-size: 17px;">Download the app now</h3> </td></tr></tbody> </table> </td><td class="es-hidden" width="20"></td></tr></tbody> </table> <table class="es-left" cellspacing="0" cellpadding="0" align="left"> <tbody> <tr> <td class="es-m-p20b esd-container-frame" width="133" align="center"> <table width="100%" cellspacing="0" cellpadding="0"> <tbody> <tr> <td class="esd-block-image" align="center"> <a target="_blank" href="https://itunes.apple.com/in/app/eventville/id1440756890?mt=8"> <img src="https://tlr.stripocdn.email/content/guids/CABINET_e48ed8a1cdc6a86a71047ec89b3eabf6/images/92051534250512328.png" alt="App Store" style="display: block;" class="adapt-img" title="App Store" width="133"> </a> </td></tr></tbody> </table> </td></tr></tbody> </table> <table class="es-right" cellspacing="0" cellpadding="0" align="right"> <tbody> <tr> <td class="esd-container-frame" width="133" align="center"> <table width="100%" cellspacing="0" cellpadding="0"> <tbody> <tr> <td class="esd-block-image" align="center"> <a target="_blank" href="https://play.google.com/store/apps/details?id=com.zreyas.eventville"> <img class="adapt-img" src="https://tlr.stripocdn.email/content/guids/CABINET_e48ed8a1cdc6a86a71047ec89b3eabf6/images/82871534250557673.png" alt="Google Play" style="display: block;" title="Google Play" width="133"> </a> </td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> <table class="es-footer" cellspacing="0" cellpadding="0" align="center"> <tbody> <tr> <td class="esd-stripe" style="background-color: rgb(102, 102, 102);" esd-custom-block-id="15625" bgcolor="#666666" align="center"> <table class="es-footer-body" style="background-color: rgb(102, 102, 102);" width="600" cellspacing="0" cellpadding="0" bgcolor="#666666" align="center"> <tbody> <tr> <td class="esd-structure es-p20t es-p20b es-p20r es-p20l" align="left"> <table width="100%" cellspacing="0" cellpadding="0"> <tbody> <tr> <td class="esd-container-frame" width="560" valign="top" align="center"> <table width="100%" cellspacing="0" cellpadding="0"> <tbody> <tr> <td esdev-links-color="#999999" class="esd-block-text es-p5b" align="center"> <p style="color: #ffffff;"><<<ASSOC_NAME>>></p></td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> </div>`,
    
    
    'Festiville': `<div class="es-wrapper-color"><!--[if gte mso 9]><v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t"><v:fill type="tile" color="#ffffff"></v:fill></v:background><![endif]--> <table class="es-wrapper" style="background-position: center top;" width="100%" cellspacing="0" cellpadding="0"> <tbody> <tr> <td class="esd-email-paddings" valign="top"> <table class="es-header" cellspacing="0" cellpadding="0" align="center"> <tbody> <tr> <td class="esd-stripe" esd-custom-block-id="15610" align="center"> <table class="es-header-body" style="background-color: transparent;" width="600" cellspacing="0" cellpadding="0" align="center"> <tbody> <tr> <td class="esd-structure" align="left"> <table width="100%" cellspacing="0" cellpadding="0"> <tbody> <tr> <td class="esd-container-frame" width="600" valign="top" align="center"> <table width="100%" cellspacing="0" cellpadding="0"> <tbody> <tr> <td class="esd-block-image es-p20b" align="center"> <a href="" target="_blank"><img src="<<<ASSOC_IMG>>>" alt="" style="display: block;" width="154"></a> </td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> <table class="es-content" cellspacing="0" cellpadding="0" align="center"> <tbody> <tr> <td class="esd-stripe" align="center"> <table class="es-content-body" style="background-color: transparent;" width="600" cellspacing="0" cellpadding="0" align="center"> <tbody> <tr> <td class="esd-structure" align="left"> <table width="100%" cellspacing="0" cellpadding="0"> <tbody> <tr> <td class="esd-container-frame" width="600" valign="top" align="center"> <table style="border-radius: 3px; border-collapse: separate; background-color: rgb(252, 252, 252);" width="100%" cellspacing="0" cellpadding="0" bgcolor="#fcfcfc"> <tbody> <tr> <td class="esd-block-text es-m-txt-l es-p30t es-p20r es-p20l" align="left"> <h2 style="color: #333333;">Welcome!</h2> </td></tr><tr> <td class="esd-block-text es-p10t es-p20r es-p20l" bgcolor="#fcfcfc" align="left"> <p>Hi {{NAME}}, download our app Festiville. And use the following event ID to join our game.<br></p></td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr><tr> <td class="esd-structure es-p30t es-p20r es-p20l" style="background-color: rgb(252, 252, 252);" esd-custom-block-id="15791" bgcolor="#fcfcfc" align="left"> <table width="100%" cellspacing="0" cellpadding="0"> <tbody> <tr> <td class="esd-container-frame" width="560" valign="top" align="center"> <table style="border-color: rgb(239, 239, 239); border-style: solid; border-width: 1px; border-radius: 3px; border-collapse: separate; background-color: rgb(255, 255, 255);" width="100%" cellspacing="0" cellpadding="0" bgcolor="#ffffff"> <tbody> <tr> <td class="esd-block-text es-p20t es-p15b" align="center"> <h3 style="color: #333333;">Event ID:</h3> </td></tr><tr> <td class="esd-block-text" align="center"> <p style="color: rgb(100, 67, 74); font-size: 26px; line-height: 150%;"><<<ASSOC_ID>>></p></td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> <table class="es-content" cellspacing="0" cellpadding="0" align="center"> <tbody> <tr> <td class="esd-stripe" align="center"> <table class="es-content-body" style="background-color: rgb(252, 252, 252);" width="600" cellspacing="0" cellpadding="0" bgcolor="#fcfcfc" align="center"> <tbody> <tr> <td class="esd-structure es-p40t es-p25b es-p20r es-p20l" esd-custom-block-id="15790" align="left"><!--[if mso]><table width="560" cellpadding="0" cellspacing="0"><tr><td width="274" valign="top"><![endif]--> <table class="es-left" cellspacing="0" cellpadding="0" align="left"> <tbody> <tr> <td class="es-m-p0r es-m-p20b esd-container-frame" width="254" align="center"> <table width="100%" cellspacing="0" cellpadding="0"> <tbody> <tr> <td class="esd-block-text" align="left"> <h3 style="font-size: 17px;">Download the app now</h3> </td></tr></tbody> </table> </td><td class="es-hidden" width="20"></td></tr></tbody> </table> <table class="es-left" cellspacing="0" cellpadding="0" align="left"> <tbody> <tr> <td class="es-m-p20b esd-container-frame" width="133" align="center"> <table width="100%" cellspacing="0" cellpadding="0"> <tbody> <tr> <td class="esd-block-image" align="center"> <a target="_blank" href="#"> <img src="https://tlr.stripocdn.email/content/guids/CABINET_e48ed8a1cdc6a86a71047ec89b3eabf6/images/92051534250512328.png" alt="App Store" style="display: block;" class="adapt-img" title="App Store" width="133"> </a> </td></tr></tbody> </table> </td></tr></tbody> </table> <table class="es-right" cellspacing="0" cellpadding="0" align="right"> <tbody> <tr> <td class="esd-container-frame" width="133" align="center"> <table width="100%" cellspacing="0" cellpadding="0"> <tbody> <tr> <td class="esd-block-image" align="center"> <a target="_blank" href="https://play.google.com/store/apps/details?id=com.zreyas.festiville"> <img class="adapt-img" src="https://tlr.stripocdn.email/content/guids/CABINET_e48ed8a1cdc6a86a71047ec89b3eabf6/images/82871534250557673.png" alt="Google Play" style="display: block;" title="Google Play" width="133"> </a> </td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> <table class="es-footer" cellspacing="0" cellpadding="0" align="center"> <tbody> <tr> <td class="esd-stripe" style="background-color: rgb(102, 102, 102);" esd-custom-block-id="15625" bgcolor="#666666" align="center"> <table class="es-footer-body" style="background-color: rgb(102, 102, 102);" width="600" cellspacing="0" cellpadding="0" bgcolor="#666666" align="center"> <tbody> <tr> <td class="esd-structure es-p20t es-p20b es-p20r es-p20l" align="left"> <table width="100%" cellspacing="0" cellpadding="0"> <tbody> <tr> <td class="esd-container-frame" width="560" valign="top" align="center"> <table width="100%" cellspacing="0" cellpadding="0"> <tbody> <tr> <td esdev-links-color="#999999" class="esd-block-text es-p5b" align="center"> <p style="color: #ffffff;"><<<ASSOC_NAME>>></p></td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> </div>`,
    
    
    'Politico': `<div class="es-wrapper-color"><!--[if gte mso 9]><v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t"><v:fill type="tile" color="#ffffff"></v:fill></v:background><![endif]--> <table class="es-wrapper" style="background-position: center top;" width="100%" cellspacing="0" cellpadding="0"> <tbody> <tr> <td class="esd-email-paddings" valign="top"> <table class="es-header" cellspacing="0" cellpadding="0" align="center"> <tbody> <tr> <td class="esd-stripe" esd-custom-block-id="15610" align="center"> <table class="es-header-body" style="background-color: transparent;" width="600" cellspacing="0" cellpadding="0" align="center"> <tbody> <tr> <td class="esd-structure" align="left"> <table width="100%" cellspacing="0" cellpadding="0"> <tbody> <tr> <td class="esd-container-frame" width="600" valign="top" align="center"> <table width="100%" cellspacing="0" cellpadding="0"> <tbody> <tr> <td class="esd-block-image es-p20b" align="center"> <a href="" target="_blank"><img src="<<<ASSOC_IMG>>>" alt="" style="display: block;" width="154"></a> </td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> <table class="es-content" cellspacing="0" cellpadding="0" align="center"> <tbody> <tr> <td class="esd-stripe" align="center"> <table class="es-content-body" style="background-color: transparent;" width="600" cellspacing="0" cellpadding="0" align="center"> <tbody> <tr> <td class="esd-structure" align="left"> <table width="100%" cellspacing="0" cellpadding="0"> <tbody> <tr> <td class="esd-container-frame" width="600" valign="top" align="center"> <table style="border-radius: 3px; border-collapse: separate; background-color: rgb(252, 252, 252);" width="100%" cellspacing="0" cellpadding="0" bgcolor="#fcfcfc"> <tbody> <tr> <td class="esd-block-text es-m-txt-l es-p30t es-p20r es-p20l" align="left"> <h2 style="color: #333333;">Welcome!</h2> </td></tr><tr> <td class="esd-block-text es-p10t es-p20r es-p20l" bgcolor="#fcfcfc" align="left"> <p>Hi {{NAME}}, download our app Politico. And use the following event ID to join our game.<br></p></td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr><tr> <td class="esd-structure es-p30t es-p20r es-p20l" style="background-color: rgb(252, 252, 252);" esd-custom-block-id="15791" bgcolor="#fcfcfc" align="left"> <table width="100%" cellspacing="0" cellpadding="0"> <tbody> <tr> <td class="esd-container-frame" width="560" valign="top" align="center"> <table style="border-color: rgb(239, 239, 239); border-style: solid; border-width: 1px; border-radius: 3px; border-collapse: separate; background-color: rgb(255, 255, 255);" width="100%" cellspacing="0" cellpadding="0" bgcolor="#ffffff"> <tbody> <tr> <td class="esd-block-text es-p20t es-p15b" align="center"> <h3 style="color: #333333;">Event ID:</h3> </td></tr><tr> <td class="esd-block-text" align="center"> <p style="color: rgb(100, 67, 74); font-size: 26px; line-height: 150%;"><<<ASSOC_ID>>></p></td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> <table class="es-content" cellspacing="0" cellpadding="0" align="center"> <tbody> <tr> <td class="esd-stripe" align="center"> <table class="es-content-body" style="background-color: rgb(252, 252, 252);" width="600" cellspacing="0" cellpadding="0" bgcolor="#fcfcfc" align="center"> <tbody> <tr> <td class="esd-structure es-p40t es-p25b es-p20r es-p20l" esd-custom-block-id="15790" align="left"><!--[if mso]><table width="560" cellpadding="0" cellspacing="0"><tr><td width="274" valign="top"><![endif]--> <table class="es-left" cellspacing="0" cellpadding="0" align="left"> <tbody> <tr> <td class="es-m-p0r es-m-p20b esd-container-frame" width="254" align="center"> <table width="100%" cellspacing="0" cellpadding="0"> <tbody> <tr> <td class="esd-block-text" align="left"> <h3 style="font-size: 17px;">Download the app now</h3> </td></tr></tbody> </table> </td><td class="es-hidden" width="20"></td></tr></tbody> </table> <table class="es-left" cellspacing="0" cellpadding="0" align="left"> <tbody> <tr> <td class="es-m-p20b esd-container-frame" width="133" align="center"> <table width="100%" cellspacing="0" cellpadding="0"> <tbody> <tr> <td class="esd-block-image" align="center"> <a target="_blank" href="#"> <img src="https://tlr.stripocdn.email/content/guids/CABINET_e48ed8a1cdc6a86a71047ec89b3eabf6/images/92051534250512328.png" alt="App Store" style="display: block;" class="adapt-img" title="App Store" width="133"> </a> </td></tr></tbody> </table> </td></tr></tbody> </table> <table class="es-right" cellspacing="0" cellpadding="0" align="right"> <tbody> <tr> <td class="esd-container-frame" width="133" align="center"> <table width="100%" cellspacing="0" cellpadding="0"> <tbody> <tr> <td class="esd-block-image" align="center"> <a target="_blank" href="#"> <img class="adapt-img" src="https://tlr.stripocdn.email/content/guids/CABINET_e48ed8a1cdc6a86a71047ec89b3eabf6/images/82871534250557673.png" alt="Google Play" style="display: block;" title="Google Play" width="133"> </a> </td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> <table class="es-footer" cellspacing="0" cellpadding="0" align="center"> <tbody> <tr> <td class="esd-stripe" style="background-color: rgb(102, 102, 102);" esd-custom-block-id="15625" bgcolor="#666666" align="center"> <table class="es-footer-body" style="background-color: rgb(102, 102, 102);" width="600" cellspacing="0" cellpadding="0" bgcolor="#666666" align="center"> <tbody> <tr> <td class="esd-structure es-p20t es-p20b es-p20r es-p20l" align="left"> <table width="100%" cellspacing="0" cellpadding="0"> <tbody> <tr> <td class="esd-container-frame" width="560" valign="top" align="center"> <table width="100%" cellspacing="0" cellpadding="0"> <tbody> <tr> <td esdev-links-color="#999999" class="esd-block-text es-p5b" align="center"> <p style="color: #ffffff;"><<<ASSOC_NAME>>></p></td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> </div>`
  }

  constructor(public formBuilder:FormBuilder,public http:Http, public loader: LoaderProvider, public modalPopup: MessageProvider,@Inject(SESSION_STORAGE) private storage: StorageService) {
    this.userForm2 = this.formBuilder.group({
      'subjectname': ['', Validators.required],
      'eventName':['',Validators.required],
      //'Messagetosend':['',Validators.required]
    });
    this.CurrentOrgId = this.storage.get('CurrentOrgId');
    this.headerLogoURL = this.storage.get('headerLogoURL');
    this.activeEventName=this.storage.get('activeEventName');
    this.activeEventId=this.storage.get('activeEventId');
    console.log(this.headerLogoURL);
   }

  ngOnInit() {
  }
  onFileChange(evt: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.data = (XLSX.utils.sheet_to_json(ws, { header: 1 }));
      //console.log(this.data);
    };
    reader.readAsBinaryString(target.files[0]);
  }
  valueChange(event) {
    this.msgText = event;
    //console.log(event);
  }
  sendInvitation() {
    this.subjectname = this.userForm2.value.subjectname;
    //this.Messagetosend = this.userForm2.value.Messagetosend;
    //console.log(this.subjectname +'   '+ this.Messagetosend);
    this.data.shift();
    console.log(this.subjectname);
    console.log(this.data);
    for (let i = 0; i < this.data.length;i++){
      this.users.push({
        name: this.data[i][0],
        email:this.data[i][1]
      })
    }
    //this.msgText=this.msgText.replace(/<[\/]{0,1}(p)[^><]*>/ig,"");
    console.log(this.msgText);
    console.log(this.users);
    this.loader.showLoader();
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    let options = new RequestOptions({ headers: headers });
    let postParams = {
      "title": this.subjectname,
      "body": this.msgText,
      "association_id": this.CurrentOrgId,
      "users":this.users
    }
    this.http.post(BaseURLName.baseURL + "inviteusersviaemail", JSON.stringify(postParams), options).subscribe(data => {
      let response = JSON.parse(data['_body']);
      console.log(response);
      if (!response.error) {
        this.loader.hideLoader();
      } else {
        this.loader.hideLoader();
      }
    }, error => {
      console.log(error);// Error getting the data
      this.loader.hideLoader();
    });
  }

  appSelected(event: any) {
    console.log(event);
    this.invitationMsg = this.emailData[event.target.value].replace('<<<ASSOC_IMG>>>', this.headerLogoURL).replace('<<<ASSOC_NAME>>>', this.activeEventName).replace('<<<ASSOC_ID>>>', this.CurrentOrgId);
    this.msgText = this.invitationMsg;
  }
}
