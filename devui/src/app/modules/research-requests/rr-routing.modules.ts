import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanDeactivateGuard } from 'src/app/shared/guards/can-deactivate.guard';
import { ProjectRequestComponent } from './pages/project-request/project-request.component';

/**
 * Hello When updating a page please move it routing from app.routing to here. Don't forget to update all path for it
 * when using router.navigate. it should be now /rr/research-request | /rr/my-request | /rr/project-request.
 */
const routes: Routes = [
    {
        canDeactivate: [CanDeactivateGuard],
        path: "project-request",
        component: ProjectRequestComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RRRoutingModule {

}