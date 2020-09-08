import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndustryUpdateHistoryComponent } from './industry-update-history.component';

const routes: Routes = [{
  path: '',
  component: IndustryUpdateHistoryComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndustryUpdateHistoryRoutingModule { }
