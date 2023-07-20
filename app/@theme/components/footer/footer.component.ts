import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by">Created with ♥ by <b><a href="https://zreyastechnology.com" target="_blank">Zreyas Technology</a></b> {{ this.year}}</span>
    
  `,
})
export class FooterComponent {
  dt = new Date();
  public year: any;
  constructor() {
    this.year = this.dt.getFullYear();
  }
}
