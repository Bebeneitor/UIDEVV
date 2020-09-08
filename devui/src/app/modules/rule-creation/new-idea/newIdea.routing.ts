import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewIdeaComponent } from './newIdea.component';

const routes: Routes = [
    {
        path: '',
        component: NewIdeaComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NewIdeaRoutingModule { }