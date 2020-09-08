import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogService } from "primeng/api";
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { SharedModule } from 'src/app/shared/shared.module';
import { ExcelService } from '../../services/excel.service';
import { ProvisionalRuleComponent } from '../rule-creation/provisional-rule/provisional-rule.component';
import { ProvisionalRuleModule } from '../rule-creation/provisional-rule/provisional-rule.module';
import { AssignIdeaRoutingModule } from './assign-idea-routing.module';
import { AssignIdeaComponent } from './assign-idea.component';
import { IdeaDetailComponent } from "./idea-detail/idea-detail.component";
import { IdeaDetailModule } from "./idea-detail/idea-detail.module";
import { TooltipModule } from 'primeng/tooltip';
import { TabViewModule } from 'primeng/tabview';
import { EclTableModule } from 'src/app/shared/components/ecl-table/ecl-table.module';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [AssignIdeaComponent],
  imports: [
    CommonModule,
    AssignIdeaRoutingModule,
    TableModule,
    DropdownModule,
    FormsModule,
    AutoCompleteModule,
    DialogModule,
    PaginatorModule,
    DynamicDialogModule,
    IdeaDetailModule,
    TooltipModule,
    TabViewModule,
    SharedModule,
    ProvisionalRuleModule,
    EclTableModule,
    ToastModule
  ],
  providers: [
    ExcelService,
    DialogService
  ],
  entryComponents: [
    IdeaDetailComponent,
    ProvisionalRuleComponent
  ]
})

export class AssignIdeaModule { }