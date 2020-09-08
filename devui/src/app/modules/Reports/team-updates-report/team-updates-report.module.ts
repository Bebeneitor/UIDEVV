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
    BlockUIModule
  ]
})
export class TeamUpdatesReportModule { }