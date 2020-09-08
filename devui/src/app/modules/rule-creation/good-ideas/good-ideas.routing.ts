import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GoodIdeasComponent } from './good-ideas.component';

const routes: Routes = [
    {
        path: '',
        component: GoodIdeasComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GoodIdeasRoutingModule { }