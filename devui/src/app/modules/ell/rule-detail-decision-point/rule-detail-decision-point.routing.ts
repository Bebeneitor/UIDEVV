import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RuleDetailDecisionPointComponent } from './rule-detail-decision-point.component';

const routes: Routes = [
    {
        path: '',
        component: RuleDetailDecisionPointComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RuleDetailDecisionPointRoutingModule { }