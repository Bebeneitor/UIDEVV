import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { IdeaService } from '../../services/idea.service';
import { StorageService } from '../../services/storage.service';
import { LibraryViewComponent } from './library-view.component';
import { LibraryViewRoutingModule } from './library-view.routing';
import { LibraryViewSearchComponent } from './components/library-view-search/library-view-search.component';
import { ProvisionalRuleComponent } from '../rule-creation/provisional-rule/provisional-rule.component';
import { DialogService } from 'primeng/api';
import { ProvisionalRuleModule } from '../rule-creation/provisional-rule/provisional-rule.module';


@NgModule({
  declarations: [
    LibraryViewComponent,
    LibraryViewSearchComponent
  ],
  imports: [
    CommonModule,
    LibraryViewRoutingModule,
    TableModule,
    DropdownModule,
    CheckboxModule,
    ReactiveFormsModule,
    ProvisionalRuleModule
  ],
  providers: [
    IdeaService,
    StorageService,
    DialogService
  ],
  entryComponents: [
    ProvisionalRuleComponent
  ]
})
export class LibraryViewModule { }
