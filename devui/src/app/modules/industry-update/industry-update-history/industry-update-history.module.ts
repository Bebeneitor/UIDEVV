import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import {PaginatorModule} from 'primeng/paginator';
import {DynamicDialogModule} from 'primeng/dynamicdialog';
import {AccordionModule} from 'primeng/accordion';
import {ToastModule} from 'primeng/toast';
import {TabViewModule} from 'primeng/tabview';
import { IndustryUpdateHistoryRoutingModule } from './industry-update-history-routing.module';
import { IndustryUpdateHistoryComponent } from './industry-update-history.component';
import {ConfirmDialogModule, Tooltip, TooltipModule} from "primeng/primeng";
import {GridToolsComponent} from "../../../shared/components/grid-tools/grid-tools.component";
import {SharedModule} from "../../../shared/shared.module";

@NgModule({
  declarations: [IndustryUpdateHistoryComponent],
  imports: [
    CommonModule,
    IndustryUpdateHistoryRoutingModule,
    TableModule,
    FormsModule,
    AccordionModule,
    PaginatorModule,
    DynamicDialogModule,
    ToastModule,
    TabViewModule,
    TooltipModule,
    SharedModule,
    ConfirmDialogModule
  ],
  entryComponents: [GridToolsComponent]
})
export class IndustryUpdateHistoryModule { }
