import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewResearchRequestComponent } from './new-research-request.component';

const routes : Routes = [{
    path: '',
    component : NewResearchRequestComponent
}];

@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NewResearchRequestRoutingModule {

}