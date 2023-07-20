import { NbMenuItem } from '@nebular/theme';
// import { Inject } from '@angular/core';
// import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
// import { MessageProvider } from '../@core/data/message.provider';
// export class pagesmenu {
//   public Location_Menu_disabledStatus: boolean = true;
//   constructor(@Inject(SESSION_STORAGE) private storage: StorageService,public modalPopup: MessageProvider) {
//     //   if (this.storage.get('Location_Menu_disabledStatus')) {
//     //     this.Location_Menu_disabledStatus = true;
//     //   } else {
//     //     this.Location_Menu_disabledStatus = false;
//     //   }
//   }
// }
export const MENU_ITEMS: NbMenuItem[] = [
  // {
  //   title: 'Dashboard',
  //   icon: 'nb-home',
  //   link: '/pages/dashboard',
  //   home: true,
  // },
  {
    title: 'ORGANIZATIONS',
    group: true,
  },
  // {
  //   title: 'Manage',
  //   icon: 'nb-compose',
  //   link: '/pages/manage-organizations'
  // },
  {
    title: 'Event Admin',
    icon: 'fa fa-user-circle-o',
    link: '/pages/eventadmin',
  },
  {
    title: 'Event Setup',
    icon: 'fa fa-cog',
    link: '/pages/eventsetup',
  },
  {
    title: 'Questions',
    icon: 'fa fa-question-circle-o',
    children: [
      {
        title: 'Category',
        link: '/pages/question',
      },
      {
        title: 'Difficulty Level',
        link: '/pages/difflevelnew',
      },
      // {
      //   title: 'Game Questions',
      //   link: '/pages/gamequestion',
      // },
      {
        title: 'Game Questions',
        link: '/pages/gamequestionmcms',
      },
    ],
  },
  /*{
    title: 'Category',
    icon: 'nb-person',
    link: '/pages/question'
  },*/
  /*{
    title: 'Game Question',
    icon: 'nb-person',
    link: '/pages/gamequestion'
  },*/
  // {
  //   title: 'Opinionbased Question',
  //   icon: 'fa fa-question-circle-o',
  //   link: '/pages/opinionbasedquestion',
  // },
  // {
  //   title: 'Difficulty Level',
  //   icon: 'nb-person',
  //   link: '/pages/difflevel'
  // },
  /*{
    title: 'Difficulty Level',
    icon: 'nb-person',
    link: '/pages/difflevelnew'
  },*/
  // {
  //   title: 'Registered',
  //   icon: 'nb-person',
  //   link: '/pages/registered-organizations'
  // },
  {
    title: 'Sponsor',
    icon: 'fa fa-user',
    link: '/pages/sponsor',
  },
  {
    title: 'Teams',
    icon: 'fa fa-users',
    link: '/pages/team',
  },
  {
    title: 'Location',
    hidden: false,
    icon: 'fa fa-location-arrow',
    link: '/pages/location',
  },
  {
    title: 'Participants',
    icon: 'fa fa-user',
    link: '/pages/participant',
  },
  {
    title: 'QR Creation',
    icon: 'fa fa-qrcode',
    link: '/pages/qr',
  },
  {
    title: 'Reset Event',
    icon: 'fa fa-refresh',
    link: '/pages/resetEvent',
  },
  {
    title: 'Statistics',
    icon: 'fa fa-bar-chart',
    link: '/pages/stats',
  },
  {
    title: 'App Invitation',
    icon: 'fa fa-envelope',
    link: '/pages/appinvite',
  }
];
let MENU_ITEM = MENU_ITEMS.find((p) => {
  return p.title === 'Location';
});
var q=localStorage.getItem("MenuItem_LocationHidden");
//var p = localStorage.getItem('aa');

// var p = 2;
// if (p==1+1) {
//   MENU_ITEM.hidden = false;
// }
if (q == '1') {
  MENU_ITEM.hidden = true;
} else {
  MENU_ITEM.hidden = false;
}