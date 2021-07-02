import { RouterModule, Routes } from '@angular/router';
import { ResearchRequestPeerApprovalComponent } from './research-request-peer-approval.component';
import { NgModule } from '@angular/core';

const routes : Routes = [{
    path: '',
    component : ResearchRequestPeerApprovalComponent
}];

@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ResearchRequestPeerApprovalRoutingModule {

}