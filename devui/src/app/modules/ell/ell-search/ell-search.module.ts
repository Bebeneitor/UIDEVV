import { NgModule } from '@angular/core';
import { EllSearchComponent } from './ell-search.component';
import { EllSearchRoutingModule } from './ell-search.routing';
import {TreeTableModule} from 'primeng/treetable';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {CheckboxModule} from 'primeng/checkbox';
import {DropdownModule} from 'primeng/dropdown';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import { BlockUIModule , CalendarModule} from 'primeng/primeng';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import {ToastModule} from "primeng/toast";

@NgModule({
    declarations: [EllSearchComponent],
    imports: [
        EllSearchRoutingModule,
        TreeTableModule,
        FormsModule,
        CommonModule,
        CheckboxModule,
        DropdownModule,
        OverlayPanelModule,
        CalendarModule,
        BlockUIModule,
        ConfirmDialogModule,
        ToastModule
    
    ]
})
export class EllSearchModule { }
