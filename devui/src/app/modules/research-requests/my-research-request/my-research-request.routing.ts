import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyResearchRequestComponent } from './my-research-request.component';

const routes : Routes = [{
    path: '',
    component : MyResearchRequestComponent
}];

@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MyResearchRequestRoutingModule {

}