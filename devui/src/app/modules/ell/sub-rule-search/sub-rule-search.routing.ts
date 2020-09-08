import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SubRuleSearchComponent } from './sub-rule-search.component';

const routes: Routes = [
    {
        path: '',
        component: SubRuleSearchComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SubRuleSearchRoutingModule { }