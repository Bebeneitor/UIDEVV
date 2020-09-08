import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IdeaResearchComponent} from './idea-research.component';
import { TableModule} from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { FormsModule } from '@angular/forms';
import { IdeaResearchRoutingModule } from './idea-research.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import {TooltipModule} from 'primeng/tooltip';
import { DialogService, DynamicDialogRef } from 'primeng/api';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { ProvisionalRuleModule } from '../provisional-rule/provisional-rule.module';
import { ProvisionalRuleComponent } from '../provisional-rule/provisional-rule.component';
import { EclTableModule } from 'src/app/shared/components/ecl-table/ecl-table.module';

@NgModule({
  declarations: [IdeaResearchComponent],
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    IdeaResearchRoutingModule,
    SharedModule,
    TabViewModule,
    TooltipModule,
    DynamicDialogModule,
    ProvisionalRuleModule,
    EclTableModule
  ],
  providers:[DialogService,DynamicDialogRef],
  entryComponents: [
    ProvisionalRuleComponent]
})

export class IdeaResearchModule { }