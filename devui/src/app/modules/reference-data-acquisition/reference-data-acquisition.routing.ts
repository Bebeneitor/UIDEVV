import { NgModule} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ReferenceDataAcquisitionComponent} from './reference-data-acquisition.component';


const routes: Routes = [
    {
        path: '',
        component: ReferenceDataAcquisitionComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ReferenceDataAcquisitionRoutingModule {

}
