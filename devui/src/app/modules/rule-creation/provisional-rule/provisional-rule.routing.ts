import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProvisionalRuleComponent } from './provisional-rule.component';

const routes: Routes = [
    {
        path: '',
        component: ProvisionalRuleComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProvisionalRouteRoutingModule { }