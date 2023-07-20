import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { AuthPageComponent } from './index/index';
import { ManageOrganizationsComponent } from './manage-organizations/manage-organizations.component';
import { RegisteredOrganizationsComponent } from './registered-organizations/registered-organizations.component';
import { ActivityStatusComponent } from './activity-status/activity-status.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { TeamsComponent } from './teams/teams.component';
import { ParticipantsComponent } from './participants/participants.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { EventSetupComponent } from './event-setup/event-setup.component';
import { SponsorsComponent } from './sponsors/sponsors.component';
import { QuestionsComponent } from './questions/questions.component';
import { EventAdminComponent } from './event-admin/event-admin.component';
import { DifflavelComponent} from './difflevel/difflavel.component';
import { DifflevelnewComponent } from './difflevelnew/difflevelnew.component';
import { GamequestionComponent } from './gamequestion/gamequestion.component';
import { GamequestionMCMSComponent } from './gamequestion-mcms/gamequestion-mcms.component';
import { EditgameQuestionComponent } from './editgame-question/editgame-question.component';
import { OpinionbasedComponent } from './opinionbased/opinionbased.component';
import { EditparticipantsComponent } from './editparticipants/editparticipants.component';
import { QRCreationComponent } from './qrcreation/qrcreation.component';
import { LocationComponent } from './location/location.component';
import { EditlocationComponent } from './editlocation/editlocation.component';
import { ResetEventComponent } from './reset-event/reset-event.component';
import { AppinvitationComponent } from './appinvitation/appinvitation.component';
import { TeamwiseDetailComponent } from './teamwise-detail/teamwise-detail.component';
import { QuestionwiseDetailComponent } from './questionwise-detail/questionwise-detail.component';
const routes: Routes = [
  { path: 'login', component: AuthPageComponent, },
  {
    path: '', component: PagesComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent},
      { path: 'manage-organizations', component: ManageOrganizationsComponent },
      { path: 'activity-status', component: ActivityStatusComponent, },
      { path: 'registered-organizations', component: RegisteredOrganizationsComponent },
      { path: 'miscellaneous', loadChildren: './miscellaneous/miscellaneous.module#MiscellaneousModule'},
      { path: '', redirectTo: 'login', pathMatch: 'full', },
      { path: 'welcome', component: WelcomeComponent },
      { path: 'team', component: TeamsComponent },
      { path: 'participant', component: ParticipantsComponent },
      { path: 'stats', component: StatisticsComponent },
      { path: 'eventsetup', component: EventSetupComponent },
      { path: 'sponsor', component: SponsorsComponent },
      { path: 'question', component: QuestionsComponent },
      { path: 'eventadmin', component: EventAdminComponent},
      { path: 'difflevel', component: DifflavelComponent },
      { path: 'difflevelnew', component: DifflevelnewComponent },
      { path: 'gamequestion', component: GamequestionComponent },
      { path: 'editgamequestion', component: EditgameQuestionComponent },
      { path: 'opinionbasedquestion', component: OpinionbasedComponent },
      { path: 'editparticipant', component: EditparticipantsComponent },
      { path: 'qr', component: QRCreationComponent },
      { path: 'location', component: LocationComponent },
      { path: 'editlocation', component: EditlocationComponent },
      { path: 'resetEvent', component: ResetEventComponent },
      { path: 'appinvite', component: AppinvitationComponent },
      { path: 'gamequestionmcms', component: GamequestionMCMSComponent },
      { path: 'teamwise', component: TeamwiseDetailComponent },
      { path: 'questionwise', component:QuestionwiseDetailComponent},
      { path: '**', component: NotFoundComponent }
    ],
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
