import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewResearchRequestComponent } from './new-research-request.component';
import { NewResearchRequestRoutingModule } from './new-research-request.routing';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule, DropdownModule, ConfirmDialogModule, BlockUIModule } from 'primeng/primeng';
import { TeamsService } from 'src/app/services/teams.service';
import { AppUtils } from 'src/app/shared/services/utils';
import { ToastModule } from 'primeng/toast';
import { ResearchRequestService } from 'src/app/services/research-request.service';
import { TableModule } from 'primeng/table';
import { MidRuleBoxModule } from '../../Reports/components/mid-rule-box/mid-rule-box.module';

@NgModule({
  declarations: [NewResearchRequestComponent],
  exports: [NewResearchRequestComponent],
  imports: [
    CommonModule,
    FormsModule,
    MultiSelectModule,
    DropdownModule,
    NewResearchRequestRoutingModule,
    ToastModule,
    ConfirmDialogModule,
    TableModule,
    BlockUIModule,
    MidRuleBoxModule
  ],
  providers: [
    TeamsService,
    AppUtils,
    ResearchRequestService
  ]
})
export class NewResearchRequestModule { }
