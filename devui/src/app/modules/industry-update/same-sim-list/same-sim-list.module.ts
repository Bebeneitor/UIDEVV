import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { SameSimListComponent } from './same-sim-list.component';
import { SameSimListRoutingModule } from './same-sim-list.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { SameSimService } from 'src/app/services/same-sim.service';
import { CalendarModule } from 'primeng/primeng';
import { TabViewModule } from 'primeng/tabview';
import { EclTableModule } from 'src/app/shared/components/ecl-table/ecl-table.module';

@NgModule({
  declarations: [SameSimListComponent],
  imports: [
    CommonModule,
    FormsModule,
    SameSimListRoutingModule,
    TableModule,
    SharedModule,
    CalendarModule,
    TabViewModule,
    EclTableModule
  ],
  providers: [SameSimService]
})
export class SameSimListModule { }
