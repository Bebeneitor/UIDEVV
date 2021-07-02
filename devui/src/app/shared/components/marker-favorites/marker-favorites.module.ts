import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkerFavoritesComponent } from './marker-favorites.component';
import { MarkerFavoritesService } from './marker-favorites.service';
import {ToastModule} from 'primeng/toast';

@NgModule({
  declarations: [MarkerFavoritesComponent],
  exports: [MarkerFavoritesComponent],
  imports: [
    CommonModule,
    ToastModule
  ], 
  providers: [MarkerFavoritesService]
})
export class MarkerFavoritesModule { }
