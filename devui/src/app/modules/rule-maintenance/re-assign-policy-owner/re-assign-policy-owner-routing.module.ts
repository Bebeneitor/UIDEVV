import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReAssignPolicyOwnerComponent } from './re-assign-policy-owner.component';

const routes: Routes = [{
  path: '',
  component: ReAssignPolicyOwnerComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReAssignPolicyOwnerRoutingModule { }
