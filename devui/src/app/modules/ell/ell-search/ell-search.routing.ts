import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EllSearchComponent } from './ell-search.component';

const routes: Routes = [
    {
        path: '',
        component: EllSearchComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EllSearchRoutingModule { }