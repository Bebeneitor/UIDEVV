import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {IndustryUpdateCrosswalkComponent} from "./industry-update-crosswalk.component";


const routes: Routes = [
    {
        path: '',
        component: IndustryUpdateCrosswalkComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IndustryUpdateCrosswalkRoutingModule { }
