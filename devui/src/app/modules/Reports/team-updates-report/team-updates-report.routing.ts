import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TeamUpdatesReportComponent } from './team-updates-report.component';

const routes: Routes = [
    {
        path: '',
        component: TeamUpdatesReportComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TeamUpdatesReportRoutingModule { }
