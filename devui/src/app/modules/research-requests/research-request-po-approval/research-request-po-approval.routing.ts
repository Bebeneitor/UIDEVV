import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ResearchRequestPoApprovalComponent } from './research-request-po-approval.component';

const routes : Routes = [{
    path: '',
    component : ResearchRequestPoApprovalComponent
}];

@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ResearchRequestPoApprovalRoutingModule {

}