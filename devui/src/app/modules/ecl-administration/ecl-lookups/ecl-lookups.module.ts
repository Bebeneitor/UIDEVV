import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EclLookupsComponent } from './ecl-lookups.component';
import { EclLookupsRoutingModule } from './ecl-lookups.routing';
import { EclLookupsService } from 'src/app/services/ecl-lookups.service';
import { TableModule } from 'primeng/table';
import {DialogModule} from 'primeng/dialog';

@NgModule({
    declarations: [EclLookupsComponent],
    imports: [
        CommonModule,
        FormsModule,
        EclLookupsRoutingModule,
        TableModule,
        DialogModule
    ],
    providers : [
        EclLookupsService
    ]
})

export class EclLookupsModule {

}