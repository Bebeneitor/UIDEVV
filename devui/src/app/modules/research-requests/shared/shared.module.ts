import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DropdownModule, ConfirmDialogModule,
  TabViewModule, MultiSelectModule,
  BlockUIModule, CheckboxModule, PaginatorModule,
  SharedModule, ProgressBarModule
} from 'primeng/primeng';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ProvisionalRuleModule } from '../../rule-creation/provisional-rule/provisional-rule.module';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { EclTableModule } from 'src/app/shared/components/ecl-table/ecl-table.module';
import { NewIdeaModule } from '../../rule-creation/new-idea/newIdea.module';
import { DialogService } from "primeng/api";
import { MidRuleBoxModule } from '../../Reports/components/mid-rule-box/mid-rule-box.module';
import { DetailsComponent } from './details/details.component';
import { StatusComponent } from './status/status.component';
import { PeopleComponent } from './people/people.component';
import { DatesComponent } from './dates/dates.component';
import { DescriptionComponent } from './description/description.component';
import { CommentComponent } from './comment/comment.component';
import { SummaryComponent } from './summary/summary.component';
import { IssueComponent } from './issue/issue.component';

/**
 * Please add all shared components in here. Not Modules.
 */
const COMPONENTS = [
  DetailsComponent,
  StatusComponent,
  PeopleComponent, 
  DatesComponent, 
  DescriptionComponent, 
  CommentComponent,
  SummaryComponent,
  IssueComponent
 ];
 
@NgModule({
  declarations: [COMPONENTS],
  exports: [COMPONENTS],
  imports: [
    CommonModule,
    FormsModule,
    MultiSelectModule,
    DropdownModule,
    CheckboxModule,
    ToastModule,
    ConfirmDialogModule,
    TabViewModule,
    TooltipModule,
    DialogModule,
    ProvisionalRuleModule,
    NewIdeaModule,
    TableModule,
    DynamicDialogModule,
    BlockUIModule,
    EclTableModule,
    MidRuleBoxModule,
    PaginatorModule,
    SharedModule,
    ProgressBarModule
  ],
  providers: [
    DialogService
  ],
})

export class RRSharedModules { }