import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LibrarySearchComponent } from './library-search.component';
import { LibrarySearchRoutingModule } from './library-search.routing';
import {TreeModule} from 'primeng/tree';
import {TooltipModule} from 'primeng/tooltip';
import { TabViewModule } from 'primeng/tabview';
import {DropdownModule} from 'primeng/dropdown';

@NgModule({
  declarations: [
    LibrarySearchComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    LibrarySearchRoutingModule,
    TreeModule,
    TooltipModule, 
    TabViewModule,
    DropdownModule
  ],
  providers: [
  ],
  entryComponents: [
  ]
})
export class LibrarySearchModule { }
