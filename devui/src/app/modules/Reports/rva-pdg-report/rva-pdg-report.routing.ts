import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RvaPdgReportComponent } from './rva-pdg-report.component';

const routes: Routes = [
    {
        path: '',
        component: RvaPdgReportComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RvaPdgReportRoutingModule { }
