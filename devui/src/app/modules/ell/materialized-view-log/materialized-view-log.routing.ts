import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaterializedViewLogComponent } from './materialized-view-log.component';

const routes: Routes = [
    {
        path: '',
        component: MaterializedViewLogComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class MaterializedViewLogRoutingModule { }