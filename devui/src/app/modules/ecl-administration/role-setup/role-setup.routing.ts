import { NgModule} from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { RoleSetupComponent } from './role-setup.component';

const routes: Routes = [
    {
        path: '',
        component: RoleSetupComponent        
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class RoleSetupRoutingModule {
 
}