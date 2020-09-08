
import { NgModule } from '@angular/core';
import { TopicDetailComponent } from './topic-detail.component';
import { TopicDetailRoutingModule } from './topic-detail.routing';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BlockUIModule } from 'primeng/blockui';

@NgModule({
    declarations: [TopicDetailComponent],
    imports: [
        FormsModule,
        CommonModule,
        TopicDetailRoutingModule,
        BlockUIModule
    ]
})
export class TopicDetailModule { }