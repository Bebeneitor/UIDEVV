import { Component, OnInit } from '@angular/core';
import { AppUtils } from 'src/app/shared/services/utils';

@Component({
    selector: 'LibraryViewSearch',
    templateUrl: './library-view-search.component.html',
    styleUrls: ['./library-view-search.component.css'],
    providers: []
})

export class LibraryViewSearchComponent implements OnInit {
  
    business: any[];
    categories: any[];
    states: any[];
    jurisdictions: any[];
    references: any[];

    constructor(private util: AppUtils) {

    }

    ngOnInit() {
        this.util.getAllLobs(this.business);
        this.util.getAllCategories(this.categories);
        this.util.getAllJurisdictions(this.jurisdictions);
        this.util.getAllStates(this.states);
        this.util.getAllReferences(this.references);
    }
}