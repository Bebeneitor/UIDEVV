import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssignmentNewIdeaComponent } from './assignment-new-idea.component';

const routes: Routes = [{
  path: '',
  component: AssignmentNewIdeaComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssignmentNewIdeaRoutingModule { }
