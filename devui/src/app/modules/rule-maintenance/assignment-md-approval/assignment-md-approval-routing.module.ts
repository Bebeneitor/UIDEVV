import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssignmentMdApprovalComponent } from './assignment-md-approval.component';


const routes: Routes = [
  {
    path: '',
    component: AssignmentMdApprovalComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssignmentMdApprovalRoutingModule { }
