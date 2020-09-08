import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RuleApprovalComponent} from './rule-approval.component';

const routes: Routes = [
    {
        path: '',
        component: RuleApprovalComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RuleApprovalRoutingModule { }
