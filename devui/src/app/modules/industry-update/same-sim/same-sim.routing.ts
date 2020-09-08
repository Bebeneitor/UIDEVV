import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SameSimComponent } from './same-sim.component';

const routes: Routes = [{
  path: '',
  component: SameSimComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SameSimRoutingModule { }
