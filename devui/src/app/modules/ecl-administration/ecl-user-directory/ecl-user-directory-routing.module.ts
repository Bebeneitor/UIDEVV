import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EclUserDirectoryComponent } from './ecl-user-directory.component';

const routes: Routes = [{
  path: '',
  component: EclUserDirectoryComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EclUserDirectoryRoutingModule { }
