import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectRequestModule } from './pages/project-request/project-request.module';
import { RRRoutingModule } from './rr-routing.modules';
import { RRSharedModules } from './shared/shared.module';


/**
 * Hey Team,
 * When updating please add the page's Module here. Component will go to
 * routing. REMOVE Comment when refactoring is done.
 */
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RRRoutingModule,
    RRSharedModules,
    FormsModule,
    ProjectRequestModule
  ]
})
export class RRModules { }