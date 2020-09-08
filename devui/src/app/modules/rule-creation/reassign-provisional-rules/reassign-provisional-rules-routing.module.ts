import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReassignProvisionalRulesComponent } from './reassign-provisional-rules.component';


const routes: Routes = [
  {
    path: '',
    component: ReassignProvisionalRulesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReassignProvisionalRulesRoutingModule { }
