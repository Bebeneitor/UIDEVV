import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewIdeaResearchComponent } from './new-idea-research.component';

const routes: Routes = [
    {
        path: '',
        component: NewIdeaResearchComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NewIdeaResearchRoutingModule { }