import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ReferenceReviewImpactComponent} from './reference-review-impact.component';

const routes: Routes = [
  {
    path: '',
    component: ReferenceReviewImpactComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReferenceReviewImpactRoutingModule {}
