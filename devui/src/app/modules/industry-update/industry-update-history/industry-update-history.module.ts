import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import {PaginatorModule} from 'primeng/paginator';
import {DynamicDialogModule} from 'primeng/dynamicdialog';
import {AccordionModule} from 'primeng/accordion';
import {ToastModule} from 'primeng/toast';
import {TabViewModule} from 'primeng/tabview';
import { IndustryUpdateHistoryRoutingModule } from './industry-update-history-routing.module';
import { IndustryUpdateHistoryComponent } from './industry-update-history.component';
import {ConfirmDialogModule, Tooltip, TooltipModule, DynamicDialogRef, DialogService} from "primeng/primeng";
import {GridToolsComponent} from "../../../shared/components/grid-tools/grid-tools.component";
import {SharedModule} from "../../../shared/shared.module";
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import { PridFormComponent } from 'src/app/shared/components/prid-form/prid-form.component';

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
    ConfirmDialogModule,
    DialogModule,
    ReactiveFormsModule,
    MessagesModule,
    MessageModule
  ],
  providers: [
    DynamicDialogRef, 
    DialogService
  ],
  entryComponents: [GridToolsComponent, PridFormComponent]
})
export class IndustryUpdateHistoryModule { }
