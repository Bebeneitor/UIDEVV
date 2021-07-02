import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuditLogCvpComponent } from './audit-log-cvp.component';

const routes: Routes = [{
  path: '',
  component: AuditLogCvpComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuditLogCvpRoutingModule { }
