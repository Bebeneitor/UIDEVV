import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectRequestComponent } from './project-request.component';
import { RRSharedModules } from '../../shared/shared.module';
import { BlockUIModule } from 'primeng/primeng';

@NgModule({
  declarations: [ProjectRequestComponent],
  imports: [
    CommonModule,
    FormsModule,
    RRSharedModules,
    BlockUIModule
  ],
  providers: [ ],

})
export class ProjectRequestModule { }
