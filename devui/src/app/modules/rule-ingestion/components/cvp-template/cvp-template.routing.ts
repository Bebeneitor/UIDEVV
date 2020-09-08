import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CvpTemplateComponent } from './cvp-template.component';

const routes: Routes = [
    {
        path: '',
        component: CvpTemplateComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CvpTemplateRoutingModule { }