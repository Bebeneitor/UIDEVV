import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IdeaResearchComponent } from './idea-research.component';

const routes: Routes = [
    {
        path: '',
        component: IdeaResearchComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IdeaResearchRoutingModule { }