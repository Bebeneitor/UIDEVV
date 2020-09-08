import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SavingsForRulesComponent } from './savings-for-rules.component';

const routes: Routes = [
    {
        path: '',
        component: SavingsForRulesComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SavingsForRulesRoutingModule { }