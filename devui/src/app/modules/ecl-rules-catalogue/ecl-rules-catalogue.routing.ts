import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EclRulesCatalogueComponent } from './ecl-rules-catalogue.component';

const routes: Routes = [
    {
        path: '',
        component: EclRulesCatalogueComponent        
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EclRulesCatalogueRoutingModule { }
