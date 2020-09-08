import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SavingClientAdoptedRuleComponent } from './saving-client-adopted-rule.component';

const routes: Routes = [
    {
        path: '',
        component: SavingClientAdoptedRuleComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SavingClientAdoptedRuleRoutingModule { }