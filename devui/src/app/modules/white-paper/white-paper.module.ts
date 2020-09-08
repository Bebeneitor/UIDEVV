import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WhitePaperComponent } from './white-paper.component';
import { WhitePaperRoutingModule } from './white-paper.routing';
import { GridsterModule } from 'angular-gridster2';
import {PanelModule} from 'primeng/panel';
import {ColorPickerModule} from 'primeng/colorpicker';
import {SelectButtonModule} from 'primeng/selectbutton';
import {TabViewModule} from 'primeng/tabview';
import {DialogModule} from 'primeng/dialog';
import {StepsModule} from 'primeng/steps';
import {PickListModule} from 'primeng/picklist';
import { TableModule } from 'primeng/table';
import { MultiSelectModule, CalendarModule, ConfirmationService, ConfirmDialogModule, AutoCompleteModule } from 'primeng/primeng';
import { TooltipModule } from 'primeng/tooltip';
import {BlockUIModule} from 'primeng/blockui';
import {RadioButtonModule} from 'primeng/radiobutton';
import {ChartModule} from 'primeng/chart';
import { LibraryViewService } from 'src/app/services/library-view.service';
import { StorageService } from 'src/app/services/storage.service';
import {SliderModule} from 'primeng/slider';
import {CheckboxModule} from 'primeng/checkbox';
import {SidebarModule} from 'primeng/sidebar';
import {OverlayPanelModule} from 'primeng/overlaypanel';

@NgModule({
  declarations: [WhitePaperComponent],
  imports: [
    CommonModule,
    FormsModule,
    WhitePaperRoutingModule,
    GridsterModule,
    PanelModule,
    ColorPickerModule,
    SelectButtonModule,
    TabViewModule,
    DialogModule,
    StepsModule,
    PickListModule,
    TableModule,
    MultiSelectModule,
    TooltipModule,
    BlockUIModule,
    RadioButtonModule,
    ChartModule,
    CalendarModule,
    SliderModule,
    CheckboxModule,
    SidebarModule,
    OverlayPanelModule,
    ConfirmDialogModule,
    AutoCompleteModule
  ],
  providers: [
    LibraryViewService,
    StorageService,
    ConfirmationService
  ],
})
export class WhitePaperModule { }
