import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReAssignImpactAnalysisComponent } from './re-assign-impact-analysis.component';

const routes: Routes = [{
  path: '',
  component: ReAssignImpactAnalysisComponent
}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReAssignImpactAnalysisRoutingModule { }
