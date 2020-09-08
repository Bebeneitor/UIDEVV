import {NgModule} from '@angular/core';
import { RoleSetupComponent } from './role-setup.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoleSetupRoutingModule } from './role-setup.routing';
import {
  ListboxModule,
  ConfirmDialogModule,
  DialogModule,
  AccordionModule,
  CheckboxModule,
  BlockUIModule, TreeTableModule
} from 'primeng/primeng';
import { RoleSetupService } from 'src/app/services/role-setup.service';
import { CcaPoSetupComponent } from './components/cca-po-setup/cca-po-setup.component';
import { TableModule } from 'primeng/table';
import {UserTeamCategoryViewComponent} from "./components/user-team-category-view/user-team-category-view.component";

@NgModule({
declarations:[ RoleSetupComponent, CcaPoSetupComponent, UserTeamCategoryViewComponent],
    imports: [
        CommonModule,
        FormsModule,
        RoleSetupRoutingModule,
        ListboxModule,
        ConfirmDialogModule,
        DialogModule,
        AccordionModule,
        CheckboxModule,
        TableModule,
        BlockUIModule,
        TreeTableModule
    ],
  providers:[
    RoleSetupService
  ]
})

export class RoleSetupModule {

}
