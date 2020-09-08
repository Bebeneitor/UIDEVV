import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { ListboxModule } from 'primeng/listbox';
import { TableModule } from 'primeng/table';
import { SavingClientAdoptedRuleComponent } from './saving-client-adopted-rule.component';
import { SavingClientAdoptedRuleRoutingModule } from './saving-client-adopted-rule.routing';


@NgModule({
  declarations: [SavingClientAdoptedRuleComponent
  ],
  imports: [
    CommonModule,
    SavingClientAdoptedRuleRoutingModule,
    TableModule,
    DropdownModule,
    CheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    ListboxModule
  ],
  providers: []
})
export class SavingClientAdoptedRuleModule { }
