import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateFlagsComponent } from './template-flags.component';
import { BlockUIModule, ConfirmDialogModule, DropdownModule } from 'primeng/primeng';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import {TabViewModule} from 'primeng/tabview';

@NgModule({
  declarations: [TemplateFlagsComponent],
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    SharedModule,
    BlockUIModule,
    TabViewModule,
    ConfirmDialogModule
  ]
})
export class TemplateFlagsModule { }
