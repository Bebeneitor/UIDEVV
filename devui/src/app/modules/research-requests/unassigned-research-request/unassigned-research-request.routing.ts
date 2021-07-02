import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { UnassignedResearchRequestComponent } from './unassigned-research-request.component';

const routes: Routes = [{
    path: '',
    component: UnassignedResearchRequestComponent
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UnassignedResearchRequestRoutingModule {

}