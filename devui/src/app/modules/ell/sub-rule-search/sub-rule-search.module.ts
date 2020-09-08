import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { BlockUIModule } from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { EclTableModule } from '../../../shared/components/ecl-table/ecl-table.module';
import { RuleDetailDecisionPointComponent } from '../rule-detail-decision-point/rule-detail-decision-point.component';
import { RuleDetailDecisionPointModule } from './../rule-detail-decision-point/rule-detail-decision-point.module';
import { ChangeLogGroupsComponent } from './change-log-groups/change-log-groups.component';
import { SubRuleDetailComponent } from './sub-rule-detail/sub-rule-detail.component';
import { ChangeTypesComponent } from './change-types/change-types.component';
import { LibraryRuleComponent } from './library-rule/library-rule.component';
import { MidRuleKeyComponent } from './mid-rule-key/mid-rule-key.component';
import { MidRuleComponent } from './mid-rule/mid-rule.component';
import { PayerRuleComponent } from './payer-rule/payer-rule.component';
import { SubRuleSearchComponent } from './sub-rule-search.component';
import { SubRuleSearchRoutingModule } from './sub-rule-search.routing';
import { ChangeSourcesComponent } from './change-sources/change-sources.component';
import { CptCodeComponent } from './cpt-code/cpt-code.component';
import { IcdCodeComponent } from './icd-code/icd-code.component';
import { LibraryStatusCodesComponent } from './library-status-codes/library-status-codes.component';

@NgModule({
    declarations: [CptCodeComponent,SubRuleSearchComponent, MidRuleComponent, PayerRuleComponent, MidRuleKeyComponent, LibraryRuleComponent, SubRuleDetailComponent, ChangeTypesComponent, ChangeLogGroupsComponent, ChangeSourcesComponent, IcdCodeComponent, LibraryStatusCodesComponent],
    imports: [
        SubRuleSearchRoutingModule,
        TableModule,
        FormsModule,
        CommonModule,
        CheckboxModule,
        DropdownModule,
        OverlayPanelModule,
        CalendarModule,
        EclTableModule,
        AccordionModule,
        BlockUIModule,
        DynamicDialogModule,
        RuleDetailDecisionPointModule,
    ],
    providers: [DialogService, DynamicDialogConfig, DynamicDialogRef],
    entryComponents: [
        RuleDetailDecisionPointComponent,        
        SubRuleDetailComponent       
    ]
})
export class SubRuleSearchModule { }