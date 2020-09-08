import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssignIdeaComponent } from './assign-idea.component';


const routes: Routes = [
  {
    path: '',
    component: AssignIdeaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssignIdeaRoutingModule { }
