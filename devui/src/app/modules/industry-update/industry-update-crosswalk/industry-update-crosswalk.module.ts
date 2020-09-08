import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import {MessageModule, MessageService, DialogService, CalendarModule, OverlayPanelModule} from 'primeng/primeng';
import { ToastModule } from 'primeng/toast';
import {DropdownModule} from 'primeng/dropdown';
import {CheckboxModule} from 'primeng/checkbox';
import {DynamicDialogModule} from 'primeng/dynamicdialog';
import {DialogModule} from 'primeng/dialog';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {PaginatorModule} from 'primeng/paginator';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {ProvisionalRuleModule} from "../../rule-creation/provisional-rule/provisional-rule.module";
import {StorageService} from "../../../services/storage.service";
import {ExcelService} from "../../../services/excel.service";
import {IndustryUpdateCrosswalkComponent} from "./industry-update-crosswalk.component";
import {IndustryUpdateCrosswalkRoutingModule} from "./industry-update-crosswalk.routing";
import {ProvisionalRuleComponent} from "../../rule-creation/provisional-rule/provisional-rule.component";
import {SharedModule} from "../../../shared/shared.module";


@NgModule({
    declarations: [IndustryUpdateCrosswalkComponent],
    imports: [
      CommonModule,
      FormsModule,
      TableModule,
      DropdownModule,
      CheckboxModule,
      FormsModule,
      DynamicDialogModule,
      ProvisionalRuleModule,
      DialogModule,
      ConfirmDialogModule,
      DialogModule,
      DynamicDialogModule,
      FormsModule,
      TableModule,
      DropdownModule,
      PaginatorModule,
      AutoCompleteModule,
      SharedModule,
      ProvisionalRuleModule,
      ConfirmDialogModule,
      MessageModule,
      ToastModule,
      CalendarModule,
      OverlayPanelModule,
      IndustryUpdateCrosswalkRoutingModule
    ],
  providers: [
    StorageService,
    ExcelService,
    DialogService,
    MessageService
  ],
  entryComponents:[
   ProvisionalRuleComponent
  ]
  })

  export class IndustryUpdateCrosswalkModule { }
