import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { PagesRoutingModule } from './pages-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { AuthPageComponent } from './index/index';
import { ManageOrganizationsComponent } from './manage-organizations/manage-organizations.component';
import { RegisteredOrganizationsComponent } from './registered-organizations/registered-organizations.component';

import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ActivityStatusComponent } from './activity-status/activity-status.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { TeamsComponent } from './teams/teams.component';
import { ParticipantsComponent } from './participants/participants.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { EventSetupComponent } from './event-setup/event-setup.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { SponsorsComponent } from './sponsors/sponsors.component';
import { QuestionsComponent } from './questions/questions.component';
import { EventAdminComponent } from './event-admin/event-admin.component';
import { DifflavelComponent } from './difflevel/difflavel.component';
import { DifflevelnewComponent } from './difflevelnew/difflevelnew.component';
import { DataTableModule } from 'angular-6-datatable';
import { GamequestionComponent } from './gamequestion/gamequestion.component';
import { EditgameQuestionComponent } from './editgame-question/editgame-question.component';
import { OpinionbasedComponent } from './opinionbased/opinionbased.component';
import { EditparticipantsComponent } from './editparticipants/editparticipants.component';
import { QRCodeModule } from 'angularx-qrcode';
import { QRCreationComponent } from './qrcreation/qrcreation.component';
import { LocationComponent } from './location/location.component';
import { EditlocationComponent } from './editlocation/editlocation.component';
import { ResetEventComponent } from './reset-event/reset-event.component';
import { AppinvitationComponent } from './appinvitation/appinvitation.component';
import { GamequestionMCMSComponent } from './gamequestion-mcms/gamequestion-mcms.component';
import { TeamwiseDetailComponent } from './teamwise-detail/teamwise-detail.component';
import { QuestionwiseDetailComponent } from './questionwise-detail/questionwise-detail.component';

const PAGES_COMPONENTS = [
  PagesComponent,
];

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    DashboardModule,
    MiscellaneousModule,
    Ng2SmartTableModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    DataTableModule,
    QRCodeModule,
  ],
  declarations: [
    ...PAGES_COMPONENTS,
    AuthPageComponent,
    ManageOrganizationsComponent,
    RegisteredOrganizationsComponent,
    ActivityStatusComponent,
    WelcomeComponent,
    TeamsComponent,
    ParticipantsComponent,
    StatisticsComponent,
    EventSetupComponent,
    SponsorsComponent,
    QuestionsComponent,
    EventAdminComponent,
    DifflavelComponent,
    DifflevelnewComponent,
    GamequestionComponent,
    EditgameQuestionComponent,
    OpinionbasedComponent,
    EditparticipantsComponent,
    QRCreationComponent,
    LocationComponent,
    EditlocationComponent,
    ResetEventComponent,
    AppinvitationComponent,
    GamequestionMCMSComponent,
    TeamwiseDetailComponent,
    QuestionwiseDetailComponent,
  ],
})
export class PagesModule {
}
