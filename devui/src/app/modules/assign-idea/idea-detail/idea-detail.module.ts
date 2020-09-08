import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { IdeaDetailComponent } from './idea-detail.component';



@NgModule({
  declarations: [IdeaDetailComponent],
  imports: [
    CommonModule,
    TableModule,
    DropdownModule,
    FormsModule
  ],
  providers: [
  ]
})
export class IdeaDetailModule { }
