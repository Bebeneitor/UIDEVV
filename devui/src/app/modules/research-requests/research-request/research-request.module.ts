import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResearchRequestComponent } from './research-request.component';
import { FormsModule } from '@angular/forms';
import { ResearchRequestCommentsComponent } from './components/research-request-comments/research-request-comments.component';
import { ResearchRequestHistoryComponent } from './components/research-request-history/research-request-history.component';
import { ResearchRequestRoutingModule } from './research-request.routing';
import { DropdownModule, ConfirmDialogModule, TabViewModule, MultiSelectModule, BlockUIModule, CheckboxModule } from 'primeng/primeng';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { DialogService } from "primeng/api";
import { ProvisionalRuleComponent } from '../../rule-creation/provisional-rule/provisional-rule.component';
import { ProvisionalRuleModule } from '../../rule-creation/provisional-rule/provisional-rule.module';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { ResearchRequestSearchRuleIdsModule } from './components/research-request-search-rule-ids/research-request-search-rule-ids.module';
import { ResearchRequestSearchRuleIdsComponent } from './components/research-request-search-rule-ids/research-request-search-rule-ids.component';
import { EclTableModule } from 'src/app/shared/components/ecl-table/ecl-table.module';
import { ResearchRequestCommentsDialogComponent } from './components/research-request-comments-dialog/research-request-comments-dialog.component';
import { NewIdeaModule } from '../../rule-creation/new-idea/newIdea.module';
import { NewIdeaComponent } from '../../rule-creation/new-idea/newIdea.component';
import { RRSharedModules } from '../shared/shared.module';

@NgModule({
  declarations: [
    ResearchRequestComponent,
    ResearchRequestCommentsComponent,
    ResearchRequestHistoryComponent,
    ResearchRequestCommentsDialogComponent
  ],
  imports: [
    CommonModule,
    ResearchRequestRoutingModule,
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
    ResearchRequestSearchRuleIdsModule,
    BlockUIModule,
    EclTableModule,
    RRSharedModules
  ],
  providers: [
    DialogService
  ],
  entryComponents: [
    ProvisionalRuleComponent,
    NewIdeaComponent,
    ResearchRequestSearchRuleIdsComponent,
    ResearchRequestCommentsDialogComponent
  ]
})
export class ResearchRequestModule { }
