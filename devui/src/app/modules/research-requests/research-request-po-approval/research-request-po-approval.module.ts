import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResearchRequestPoApprovalComponent } from './research-request-po-approval.component';
import { ResearchRequestPoApprovalRoutingModule } from './research-request-po-approval.routing';

@NgModule({
  declarations: [ResearchRequestPoApprovalComponent],
  imports: [
    CommonModule,
    ResearchRequestPoApprovalRoutingModule
  ]
})
export class ResearchRequestPoApprovalModule { }
