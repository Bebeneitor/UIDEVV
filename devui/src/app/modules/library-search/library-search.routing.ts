import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LibrarySearchComponent } from './library-search.component';

const routes: Routes = [
    {
        path: '',
        component: LibrarySearchComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LibrarySearchRoutingModule { }