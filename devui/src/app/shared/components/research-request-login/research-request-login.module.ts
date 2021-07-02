import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {ResearchRequestLoginComponent} from './research-request-login.component';
import {ToastModule} from 'primeng/toast';
import {DialogModule} from 'primeng/dialog';
import {RadioButtonModule} from 'primeng/primeng';
import {TableModule} from 'primeng/table';



@NgModule({
  declarations: [ResearchRequestLoginComponent],
  imports: [
    CommonModule,
    FormsModule,
    ToastModule,
    DialogModule,
    RadioButtonModule,
    TableModule
  ],
  exports: [
    ResearchRequestLoginComponent
  ],
  providers: [
   [ResearchRequestLoginComponent]
  ]
})
export class ResearchRequestLoginModule { }
