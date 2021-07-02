import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterializedViewLogComponent } from './materialized-view-log.component';
import { MaterializedViewLogRoutingModule } from './materialized-view-log.routing';
import { EclTableModule } from '../../../shared/components/ecl-table/ecl-table.module';

@NgModule({
  declarations: [MaterializedViewLogComponent],
  imports: [
    MaterializedViewLogRoutingModule,
    CommonModule,
    EclTableModule
  ]
})
export class MaterializedViewLogModule { }
