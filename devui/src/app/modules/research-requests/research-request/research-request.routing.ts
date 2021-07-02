import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanDeactivateGuard } from 'src/app/shared/guards/can-deactivate.guard';
import { ResearchRequestComponent } from './research-request.component';

const routes: Routes = [{
    path: '',
    component: ResearchRequestComponent,
    canDeactivate: [CanDeactivateGuard]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ResearchRequestRoutingModule {

}