import { APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from './@core/core.module';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ThemeModule } from './@theme/theme.module';
import {NgbButtonsModule, NgbModule, NgbRadioGroup, NgbRatingModule} from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ngx-modialog';
import { BootstrapModalModule } from 'ngx-modialog/plugins/bootstrap';
import { SampleLayoutComponent } from './@theme/layouts/no-sidebar/no-sidebar.layout';
import { StorageServiceModule } from 'angular-webstorage-service';
import { LogoutFromOrganizationPortal } from './pages/logoutOrganizationPortal';
import {NgbRadio} from '@ng-bootstrap/ng-bootstrap/buttons/radio';
@NgModule({
  declarations: [AppComponent, SampleLayoutComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    HttpModule,
    NgbModule.forRoot(),
    ThemeModule.forRoot(),
    CoreModule.forRoot(),
    ModalModule.forRoot(),
    BootstrapModalModule,
    StorageServiceModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
    LogoutFromOrganizationPortal,
  ],
})
export class AppModule {
}
