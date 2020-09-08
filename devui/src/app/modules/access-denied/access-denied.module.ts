import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AccessDeniedComponent } from './access-denied.component';
import { AccessDeniedRoutingModule } from './access-denied.routing';

@NgModule({
  declarations: [AccessDeniedComponent],
  imports: [
    CommonModule,
    AccessDeniedRoutingModule
  ]
})
export class AccessDeniedModule { }
