import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResearchRequestAdvisoryApprovalComponent } from './research-request-advisory-approval.component';

const routes : Routes = [{
    path: '',
    component : ResearchRequestAdvisoryApprovalComponent
}];

@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ResearchRequestAdvisoryApprovalRoutingModule {

}