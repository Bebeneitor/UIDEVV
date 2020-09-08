import { NgModule } from '@angular/core';
import { RuleForImpactAnalysisComponent } from './rule-for-impact-analysis.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        component: RuleForImpactAnalysisComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RuleForImpactAnalysisRoutingModule { }