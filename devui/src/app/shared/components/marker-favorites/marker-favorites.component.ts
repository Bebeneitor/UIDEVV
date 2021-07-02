import { Component, OnInit, Input } from '@angular/core';
import { MarkerFavoritesService } from './marker-favorites.service';
import { AppUtils } from '../../services/utils';
import { MessageService } from 'primeng/api';

/**
 * Usage in HTML
 * <app-marker-favorites [id]="'ECL.1'" [type]="'RULE'"></app-marker-favorites>
 * 
 * Import MarkerFavoritesModule and put in the imports array
 */

@Component({
  selector: 'app-marker-favorites',
  templateUrl: './marker-favorites.component.html',
  styleUrls: ['./marker-favorites.component.css']
})
export class MarkerFavoritesComponent implements OnInit {

  @Input()
  id: string;

  @Input()
  type: string; //IDEA OR RULE

  @Input()
  readOnlyView : boolean;

  selected: boolean = false;

  constructor(private service: MarkerFavoritesService, private utils: AppUtils, private messageService: MessageService) { }

  ngOnInit() {

    if(this.readOnlyView == undefined) {
      this.readOnlyView = false;
    }

    //Call backend service to verify if is marked or not
    switch (this.type) {
      case "IDEA":
        this.isFavoriteIdea();
        break;
      case "RULE":
        this.isFavoriteRule();
        break;
    }
  }

  isFavoriteRule() {
    let userId = this.utils.getLoggedUserId();

    this.service.isFavoriteRule(userId, this.id).subscribe((response: any) => {
      this.selected = response.data;
    });
  }

  isFavoriteIdea() {
    let userId = this.utils.getLoggedUserId();

    this.service.isFavoriteIdea(userId, this.id).subscribe((response: any) => {
      this.selected = response.data;
    });
  }

  selectRule() {

    if(this.readOnlyView) {
      return;
    }

    this.selected = true;

    this.updateStatusMarker();
  }

  unselectRule() {
    if(this.readOnlyView) {
      return;
    }
    
    this.selected = false;

    this.updateStatusMarker();
  }

  private updateStatusMarker() {
    switch (this.type) {
      case "IDEA":
        this.updateIdea();
        break;
      case "RULE":
        this.updateRule();
        break;
    }
  }

  private updateIdea() {
    let userId = this.utils.getLoggedUserId();

    this.service.updateFavoriteIdea(userId, this.id, this.selected).subscribe((response: any) => {
      if (response.code != 200) {
        this.selected = !this.selected;

        let detail = "";

        if(this.selected) {
          detail = `Idea was successfully marked as Favorite.`
        } else {
          detail = `Idea was successfully unchecked as Favorite.`;
        }

        this.messageService.clear();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: detail });

      }
    });
  }

  private updateRule() {
    let userId = this.utils.getLoggedUserId();

    this.service.updateFavoriteRule(userId, this.id, this.selected).subscribe((response: any) => {
      if (response.code != 200) {
        this.selected = !this.selected;

        let detail = "";

        if(this.selected) {
          detail = `Rule was successfully marked as Favorite.`
        } else {
          detail = `Rule was successfully unchecked as Favorite.`;
        }

        this.messageService.clear();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: detail });
      }
    });
  }
}
