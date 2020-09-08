import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TagfilterManagementComponent } from '../tagfilter-management/tagfilter-management.component'

const routes: Routes = [
  {
      path: '',
      component: TagfilterManagementComponent    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TagfilterManagementRoutingModule { }
