import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReferenceChangeComponent } from "./reference-change.component";
import { ToastModule } from "primeng/toast";
import { MessageModule } from "primeng/message";
import { MessageService, DialogService } from "primeng/api";
import { ListboxModule } from "primeng/listbox";
import { TableModule } from "primeng/table";
import { FormsModule } from "@angular/forms";
import { BlockUIModule } from "primeng/blockui";
import { EclTableModule } from 'src/app/shared/components/ecl-table/ecl-table.module';
import { ProvisionalRuleComponent } from 'src/app/modules/rule-creation/provisional-rule/provisional-rule.component';
import { ProvisionalRuleModule } from 'src/app/modules/rule-creation/provisional-rule/provisional-rule.module';
import { DynamicDialogModule } from 'primeng/dynamicdialog';

@NgModule({
  declarations: [ReferenceChangeComponent],
  imports: [
    CommonModule,
    ToastModule,
    MessageModule,
    ListboxModule,
    TableModule,
    FormsModule,
    BlockUIModule,
    EclTableModule,
    DynamicDialogModule,
    ProvisionalRuleModule
  ],
  exports: [
    ReferenceChangeComponent
  ],
  providers: [
    MessageService,
    DialogService
  ],
  entryComponents: [
    ProvisionalRuleComponent
  ]
})
export class ReferenceChangeModule { }
