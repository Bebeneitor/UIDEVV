import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ReassignmentResearchRequestComponent } from './reassignment-research-request.component';

const routes: Routes = [{
    path: '',
    component: ReassignmentResearchRequestComponent
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReassignmentResearchRequestRoutingModule {

}