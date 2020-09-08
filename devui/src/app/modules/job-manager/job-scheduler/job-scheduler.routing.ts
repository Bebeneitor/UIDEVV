import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobSchedulerComponent} from './job-scheduler.component';

const routes: Routes = [
    {
        path: '',
        component: JobSchedulerComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class JobSchedulerRoutingModule { }