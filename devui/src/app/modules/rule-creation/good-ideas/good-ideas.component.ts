import { Component, OnInit, ViewChild } from '@angular/core';
import { AppUtils } from 'src/app/shared/services/utils';
import { DashboardService } from 'src/app/services/dashboard.service';
import { GoodIdeasServiceService } from 'src/app/services/good-ideas-service.service';
import { Router } from '@angular/router';
import { BaseResponse } from 'src/app/shared/models/base-response';
import {ECLConstantsService} from "../../../services/ecl-constants.service";
import { Constants } from 'src/app/shared/models/constants';
const GOOD_TITLE = "Good Idea";

@Component({
  selector: 'app-good-ideas',
  templateUrl: './good-ideas.component.html',
  styleUrls: ['./good-ideas.component.css']
})
export class GoodIdeasComponent implements OnInit {

  @ViewChild('viewGrid') viewGrid;
  goodIdeas: any[];
  pageTitle = GOOD_TITLE;
  columnsToExport: any[];
  cols: any[];

  categories: any[];

  calendarValue: Date = null;

  yearValidRangeEft = `${Constants.EFT_MIN_VALID_YEAR}:${Constants.EFT_MAX_VALID_YEAR}`;

  constructor(private util: AppUtils, private dashboardService: DashboardService,
    private goodIdeaService: GoodIdeasServiceService, private router: Router,
              private eclConstantsService: ECLConstantsService) { }

  ngOnInit() {

    let is = this;

    this.categories = [{ label: 'All', value: null }, { label: 'Uncategorized', value: 'Uncategorized' }];
    this.util.getAllCategoriesWidgets(this.categories).then((res: any) => {
      this.categories = res;
      this.cols = [
        { field: 'ruleCode', header: 'Provisional Rule ID' },
        { field: 'ruleName', header: 'Provisional Rule Name' },
        { field: 'ruleDescription', header: 'Provisional Rule Description' },
        { field: 'categoryDesc', header: 'Category' },
        { field: 'creationDate', header: 'Date' }
      ];

      this.columnsToExport = [];

      this.cols.forEach(element => {
        this.columnsToExport.push(element.field);
      });

      this.loadData();
    });
  }

  /**
   * Load data from backend and fill into goodIdeas array
   */
  loadData() {
    this.goodIdeas = [];

    this.getGoodIdeasNotified().then((response: BaseResponse) => {
      if (response.code == 200) {
        this.goodIdeas = response.data;
      }
    });

  }


  /**
   * Call service backend
   */
  private getGoodIdeasNotified() {

    return new Promise((resolve) => {

      let value: any = [];

      this.goodIdeaService.getGoodIdeasNotified().then((data: []) => {
        value = data;
        resolve(value);
      });

    });

  }

  /**
   * Redirect to new idea research and uncheck from good ideas
   * @param id
   * @param type
   */
  redirect(id, type) {
      this.router.navigate(['item-detail', this.util.encodeString(id), type, 'r']);
  }

  /**
   * Filter by calendar date in grid
   * @param value
   * @param comparation
   */
  filter(value, comparation) {
    this.viewGrid.filter(this.dashboardService.parseDate(value), 'creationDate', comparation);
    if (value == null) { this.calendarValue = null; }
  }
}
