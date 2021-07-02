import { NewIdeaResearchModule } from './../../rule-creation/new-idea-research/new-idea-research.module';
import { NewIdeaResearchComponent } from './../../rule-creation/new-idea-research/new-idea-research.component';
import { ProvisionalRuleModule } from './../../rule-creation/provisional-rule/provisional-rule.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TeamUpdatesReportRoutingModule} from './team-updates-report.routing';
import { TeamUpdatesReportComponent } from '../../Reports/team-updates-report/team-updates-report.component';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { EclTableModule } from '../../../shared/components/ecl-table/ecl-table.module';
import { CalendarModule } from 'primeng/calendar';
import { ChartModule } from 'primeng/chart';
import { BlockUIModule } from 'primeng/blockui';
import { DialogService } from "primeng/api";
import { ProvisionalRuleComponent } from '../../rule-creation/provisional-rule/provisional-rule.component';

@NgModule({
  declarations: [TeamUpdatesReportComponent],
  imports: [
    CommonModule,
    TeamUpdatesReportRoutingModule,
    PanelModule,
    RadioButtonModule,
    DropdownModule,
    FormsModule,
    EclTableModule,
    CalendarModule,
    ChartModule,
    BlockUIModule,
    ProvisionalRuleModule,
    NewIdeaResearchModule
  ],
  providers: [
    DialogService
  ]
  ,
  entryComponents: [
    ProvisionalRuleComponent,
    NewIdeaResearchComponent
   ]
})
export class TeamUpdatesReportModule { }