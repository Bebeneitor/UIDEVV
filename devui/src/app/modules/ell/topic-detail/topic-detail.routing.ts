
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TopicDetailComponent } from './topic-detail.component';

const routes: Routes = [
    {
        path: '',
        component: TopicDetailComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TopicDetailRoutingModule { }
