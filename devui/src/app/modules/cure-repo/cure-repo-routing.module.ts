import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Constants } from 'src/app/shared/models/constants';
import { CureManagerComponent } from './components/cure-manager/cure-manager.component';
import { ModuleConsultingComponent} from './components/cure-manager/module-consulting/module-consulting.component';
import { RepoConsultingComponent } from './components/repo-manager/module-consulting/repo-consulting.component';
import { RepoManagerComponent } from './components/repo-manager/repo-manager.component';
import { ModuleAdminListComponent } from './components/cure-manager/cure-module-admin/module-admin-list/module-admin-list.component';
import { ModuleAddEditComponent } from './components/cure-manager/cure-module-admin/module-add-edit/module-add-edit.component';

const routes: Routes = [{
  path: 'cure', component: CureManagerComponent,
  children: [
    {
      path: Constants.CURE_MODULE_CONSULTING_PATH,
      component: ModuleConsultingComponent,
      data: { pageTitle: 'CURE' }
    },
    {
      path: Constants.CURE_MODULE_ADMIN_LIST_PATH,
      component: ModuleAdminListComponent,
      data: { pageTitle: 'CURE Modules configuration'}
    },
    {
      path: Constants.CURE_MODULE_ADD_EDIT_PATH + '/:id',
      component: ModuleAddEditComponent
    }
  ]
},
{
  path: 'repo', component: RepoManagerComponent,
  children: [
    {
      path: Constants.REPO_MODULE_CONSULTING_PATH,
      component: RepoConsultingComponent,
      data: { pageTitle: 'REPO database consultancy' }
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CureRoutingModule { }
