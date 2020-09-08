import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from './navigation.component';
import { FormsModule } from '@angular/forms';
import { NavigationRoutingModule } from './navigation.routing';
import { NavigationService } from './navigation.service';
import { ProvisionalRuleModule } from '../rule-creation/provisional-rule/provisional-rule.module';
import { NewIdeaModule } from '../rule-creation/new-idea/newIdea.module';
import { NewIdeaResearchModule } from '../rule-creation/new-idea-research/new-idea-research.module';
import { DynamicDialogRef, DynamicDialogConfig, DialogService } from 'primeng/api';
import { RuleManagerService } from '../industry-update/rule-process/services/rule-manager.service';

@NgModule({
  declarations: [NavigationComponent],
  imports: [
    CommonModule,
    FormsModule,
    NavigationRoutingModule,
    ProvisionalRuleModule,
    NewIdeaModule,
    NewIdeaResearchModule
  ], 
  providers: [NavigationService, DynamicDialogRef, DynamicDialogConfig,DialogService, RuleManagerService]
})
export class NavigationModule { }
