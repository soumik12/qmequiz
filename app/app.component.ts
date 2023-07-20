import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './@core/utils/analytics.service';
import { LoaderProvider } from './@core/data/loader.provider';
@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet>' +
  '<div *ngIf="loaderShowing" class="loader-root"><div class="sk-folding-cube">\n' +
  '  <div class="sk-cube1 sk-cube"></div>\n' +
  '  <div class="sk-cube2 sk-cube"></div>\n' +
  '  <div class="sk-cube4 sk-cube"></div>\n' +
  '  <div class="sk-cube3 sk-cube"></div>\n' +
  '</div></div>',
})
export class AppComponent implements OnInit {

  loaderShowing = false;
  constructor(private analytics: AnalyticsService, public preLoader: LoaderProvider) {}
  ngOnInit(): void {
    this.analytics.trackPageViews();
    this.preLoader.loader.subscribe(value => {
      if (value === 1){
        this.loaderShowing = true;
      }
      else if  (value === 0)
        this.loaderShowing = false;
    });
  }
}
