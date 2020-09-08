import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DecisionPointComponent } from './decision-point.component';

const routes: Routes = [
    {
        path: '',
        component: DecisionPointComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DecisionPointRoutingModule { }