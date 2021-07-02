import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuditLogCvpRoutingModule } from './audit-log-cvp-routing.module';
import { AuditLogCvpComponent } from './audit-log-cvp.component';
import { ConvergencePointService } from '../../services/convergence-point.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { CalendarModule } from 'primeng/primeng';
import {MultiSelectModule} from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { EclTableModule } from 'src/app/shared/components/ecl-table/ecl-table.module';

@NgModule({
  declarations: [AuditLogCvpComponent],
  imports: [
    CommonModule,
    FormsModule,
    AuditLogCvpRoutingModule,
    SharedModule,
    CalendarModule,
    MultiSelectModule,
    EclTableModule
  ],
  providers: [
    ConvergencePointService
  ]
})
export class AuditLogCvpModule { }
