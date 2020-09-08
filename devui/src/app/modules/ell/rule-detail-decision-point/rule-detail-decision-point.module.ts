
import { NgModule } from '@angular/core';
import { RuleDetailDecisionPointComponent } from './rule-detail-decision-point.component';
import { RuleDetailDecisionPointRoutingModule } from './rule-detail-decision-point.routing';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BlockUIModule } from 'primeng/blockui';
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/api";
import { DynamicDialogModule } from 'primeng/dynamicdialog';

@NgModule({
    declarations: [RuleDetailDecisionPointComponent],
    imports: [
        FormsModule,
        CommonModule,
        RuleDetailDecisionPointRoutingModule,
        BlockUIModule,
        DynamicDialogModule
    ],
    exports: [ RuleDetailDecisionPointComponent ],
    providers: [DynamicDialogConfig, DynamicDialogRef],
    entryComponents: [
        RuleDetailDecisionPointComponent
    ]
})
export class RuleDetailDecisionPointModule { }

