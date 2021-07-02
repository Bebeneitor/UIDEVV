import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ResearchRequestSearchComponent } from './research-request-search.component';

const routes : Routes = [{
    path: '',
    component : ResearchRequestSearchComponent
}];

@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ResearchRequestSearchRoutingModule {

}