import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobCreationComponent} from './job-creation.component';

const routes: Routes = [
    {
        path: '',
        component: JobCreationComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class JobCreationRoutingModule { }