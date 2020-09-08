import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MedicaidRecReportComponent } from './medicaid-rec-report.component'
const routes: Routes = [
    {
        path: '',
        component: MedicaidRecReportComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedicaidRecReportRoutingModule { }
