import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService, DialogService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { ChartModule } from 'primeng/chart';
import { DataViewModule } from 'primeng/dataview';
import { DropdownModule } from 'primeng/dropdown';
import { SidebarModule } from 'primeng/sidebar';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { IdeasGeneratedComponent } from '../widgets/ideas-generated/ideas-generated.component';
import { MyTasksComponent } from '../widgets/my-tasks/my-tasks.component';
import { RecentlyViewedComponent } from '../widgets/recently-viewed/recently-viewed.component';
import { RulesImplementedComponent } from '../widgets/rules-implemented/rules-implemented.component';
import { UpdatedRulesComponent } from '../widgets/updated-rules/updated-rules.component';
import { WhatsNewComponent } from '../widgets/whats-new/whats-new.component';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home.routing';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { TopTenComponent } from '../widgets/top-ten/top-ten.component';
import { MyContributionsComponent } from '../widgets/my-contributions/my-contributions.component';
import { ReportsComponent } from '../widgets/reports/reports.component';
import {TabViewModule} from 'primeng/tabview';
import { SharedModule } from 'src/app/shared/shared.module';
import { DeprecatedRulesComponent } from '../widgets/deprecated-rules/deprecated-rules.component';
import { SameSimAnalysisComponent } from '../widgets/same-sim-analysis/same-sim-analysis.component';
import { TeamUpdatesComponent } from '../widgets/team-updates/team-updates.component';
import {CardModule} from 'primeng/card';
import {PaginatorModule} from 'primeng/paginator';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import { NgxPermissionsModule, NgxPermissionsService } from 'ngx-permissions';

@NgModule({
  declarations: [
    HomeComponent,
    IdeasGeneratedComponent,
    MyTasksComponent,
    RecentlyViewedComponent,
    RulesImplementedComponent,
    UpdatedRulesComponent,
    WhatsNewComponent,
    TopTenComponent,
    MyContributionsComponent,
    ReportsComponent,
    DeprecatedRulesComponent,
    SameSimAnalysisComponent,
    TeamUpdatesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HomeRoutingModule,
    ChartModule,
    TooltipModule,
    TableModule,
    DropdownModule,
    CalendarModule,
    DataViewModule,
    SidebarModule,
    ToastModule,
    DynamicDialogModule,
    TabViewModule,
    SharedModule,
    CardModule,
    PaginatorModule,
    ScrollPanelModule,
    NgxPermissionsModule
  ],
  providers : [MessageService, DialogService, NgxPermissionsService]
})
export class HomeModule { }
