import { Routes, RouterModule } from "@angular/router";
import { MdApprovalComponent } from './md-approval.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
      path: '',
      component: MdApprovalComponent
    }
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })

  export class MdApprovalRoutingModule{
      
  }