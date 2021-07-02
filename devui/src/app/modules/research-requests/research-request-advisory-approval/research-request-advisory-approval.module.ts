import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResearchRequestAdvisoryApprovalComponent } from './research-request-advisory-approval.component';
import { ResearchRequestAdvisoryApprovalRoutingModule } from './research-request-advisory-approval.routing';

@NgModule({
  declarations: [ResearchRequestAdvisoryApprovalComponent],
  imports: [
    CommonModule,
    ResearchRequestAdvisoryApprovalRoutingModule
  ]
})
export class ResearchRequestAdvisoryApprovalModule { }
