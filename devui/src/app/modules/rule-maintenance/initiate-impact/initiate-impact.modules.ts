import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { ListboxModule } from 'primeng/listbox';
import { TableModule } from 'primeng/table';
import { InitiateImpactComponent } from './initiate-impact.component';
import { InitiateImpactRoutingModule } from './initiate-impact.routing';
import { TabViewModule } from 'primeng/tabview';
import {
  FileUploadModule,
  CalendarModule,
  TooltipModule,
  MessageModule,
  MessageService,
  MultiSelectModule,
  BlockUIModule,
  DialogService
} from 'primeng/primeng';
import { sqlDateConversion } from 'src/app/shared/services/utils';
import { ToastModule } from 'primeng/toast';
import { InitiateImpactService } from 'src/app/services/initiate-impact-service';
import { ReferenceChangeModule } from "./reference-change/reference-change.module";
import { UtilsService } from 'src/app/services/utils.service';
import { EclTableModule } from 'src/app/shared/components/ecl-table/ecl-table.module';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { ProvisionalRuleModule } from '../../rule-creation/provisional-rule/provisional-rule.module';
import { ProvisionalRuleComponent } from '../../rule-creation/provisional-rule/provisional-rule.component';

@NgModule({
  declarations: [InitiateImpactComponent
  ],
  imports: [
    CommonModule,
    InitiateImpactRoutingModule,
    TableModule,
    DropdownModule,
    CheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    ListboxModule,
    TabViewModule,
    FileUploadModule,
    CalendarModule,
    TooltipModule,
    ToastModule,
    MessageModule,
    MultiSelectModule,
    ReferenceChangeModule,
    BlockUIModule,
    EclTableModule,
    DynamicDialogModule,
    ProvisionalRuleModule
  ],
  providers: [sqlDateConversion, MessageService, InitiateImpactService, UtilsService, DialogService], 
  entryComponents: [
    ProvisionalRuleComponent
  ]
})
export class InitiateImpactModule { }
