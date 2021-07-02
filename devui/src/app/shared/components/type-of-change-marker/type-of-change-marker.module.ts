import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ToastModule} from 'primeng/toast';
import { TypeOfChangeMarkerComponent } from './type-of-change-marker.component';
import {DialogModule} from 'primeng/dialog';
import {TabViewModule} from 'primeng/tabview';
import { FormsModule } from '@angular/forms';
import { TypeRuleChangeModule } from 'src/app/modules/rule-maintenance/rule-for-impact-analysis/type-rule-change/type-rule-change.module';

@NgModule({
  declarations: [TypeOfChangeMarkerComponent],
  exports: [TypeOfChangeMarkerComponent],
  imports: [
    CommonModule,
    FormsModule,
    ToastModule,
    DialogModule,
    TabViewModule,
    TypeRuleChangeModule
  ], 
  providers: []
})
export class TypeOfChangeMarkerModule { }
