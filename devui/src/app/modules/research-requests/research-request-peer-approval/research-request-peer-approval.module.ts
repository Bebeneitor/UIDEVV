import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResearchRequestPeerApprovalComponent } from './research-request-peer-approval.component';
import { ResearchRequestPeerApprovalRoutingModule } from './research-request-peer-approval.routing';

@NgModule({
  declarations: [ResearchRequestPeerApprovalComponent],
  imports: [
    CommonModule,
    ResearchRequestPeerApprovalRoutingModule
  ]
})
export class ResearchRequestPeerApprovalModule { }
