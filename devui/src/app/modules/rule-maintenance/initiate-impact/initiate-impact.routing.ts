import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InitiateImpactComponent } from './initiate-impact.component';

const routes: Routes = [
    {
        path: '',
        component: InitiateImpactComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InitiateImpactRoutingModule { }