import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TypeRuleChangeComponent } from './type-rule-change.component';


@NgModule({
  declarations: [TypeRuleChangeComponent],
  exports : [TypeRuleChangeComponent],
  imports: [
    FormsModule,
    CommonModule
  ],
 providers: [
  ],
  entryComponents:[
  ]
})
export class TypeRuleChangeModule { }
