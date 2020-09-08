import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReferenceReviewImpactRoutingModule} from './reference-review-impact.routing';
import {ReferenceReviewImpactComponent} from './reference-review-impact.component';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import {FormsModule} from '@angular/forms';
import {ConfirmationService} from 'primeng/api';
import {ConfirmDialogModule} from 'primeng/primeng';
import {DialogModule} from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';
import { ListboxModule } from 'primeng/listbox';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { TypeRuleChangeModule } from '../type-rule-change/type-rule-change.module';

@NgModule({
  declarations: [ReferenceReviewImpactComponent],
  imports: [
    CommonModule,
    ReferenceReviewImpactRoutingModule,
    TableModule,
    DropdownModule,
    FormsModule,
    ConfirmDialogModule,
    DialogModule,
    TabViewModule,
    DynamicDialogModule,
    TypeRuleChangeModule
  ],
  providers: [
    ConfirmationService

  ],
  exports: [
  ],
})
export class ReferenceReviewImpactModule {
}
