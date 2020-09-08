import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WhitePaperComponent } from './white-paper.component';

const routes: Routes = [
    {
        path: '',
        component: WhitePaperComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WhitePaperRoutingModule { }