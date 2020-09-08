import { NgModule } from '@angular/core';
import { DecisionPointComponent } from './decision-point.component';
import { DecisionPointRoutingModule } from './decision-point.routing';
import {AccordionModule} from 'primeng/accordion';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BlockUIModule } from 'primeng/blockui';

@NgModule({
    declarations: [DecisionPointComponent],
    imports: [
        FormsModule,
        CommonModule,
        DecisionPointRoutingModule,
        AccordionModule,
        BlockUIModule
    ]
})
export class DecisionPointModule { }
