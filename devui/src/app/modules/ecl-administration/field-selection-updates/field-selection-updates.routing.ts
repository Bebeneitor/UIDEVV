import { NgModule} from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import {FieldSelectionUpdatesComponent} from "./field-selection-updates.component";

const routes: Routes = [
    {
        path: '',
        component: FieldSelectionUpdatesComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class FieldSelectionUpdatesRoutingModule {

}
