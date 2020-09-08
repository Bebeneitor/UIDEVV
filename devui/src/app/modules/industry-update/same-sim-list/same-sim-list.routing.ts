import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SameSimListComponent } from './same-sim-list.component';

const routes: Routes = [{
  path: '',
  component: SameSimListComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SameSimListRoutingModule { }
