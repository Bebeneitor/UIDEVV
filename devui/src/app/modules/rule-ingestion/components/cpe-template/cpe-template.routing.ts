import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CpeTemplateComponent } from './cpe-template.component';

const routes: Routes = [
    {
        path: '',
        component: CpeTemplateComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CpeTemplateRoutingModule { }