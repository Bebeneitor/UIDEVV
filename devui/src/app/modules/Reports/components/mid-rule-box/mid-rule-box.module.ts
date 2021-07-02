import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TextEditableDirective } from 'src/app/shared/directives/text-editable.directive';
import { MidRuleBoxComponent } from './mid-rule-box.component';
import { BlockUIModule } from 'primeng/primeng';
import { BlockableComponent } from '../blockable-div/blockable-div.component';



@NgModule({
  declarations: [TextEditableDirective, MidRuleBoxComponent, BlockableComponent],
  imports: [
    CommonModule,
    FormsModule,
    BlockUIModule
  ],
  exports: [
      MidRuleBoxComponent
  ]
})
export class MidRuleBoxModule { }
