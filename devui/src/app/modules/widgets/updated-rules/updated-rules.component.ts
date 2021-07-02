import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';
import { AppUtils } from 'src/app/shared/services/utils';
import { Constants } from 'src/app/shared/models/constants';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';

declare let $: any;

@Component({
  selector: 'app-updated-rules',
  templateUrl: './updated-rules.component.html',
  styleUrls: ['./updated-rules.component.css']
})
export class UpdatedRulesComponent implements OnInit {

  @Input()
  title: string = "";

  typeView: string = "timeline";

  cols: any[];
  data: any[] = [];
  categories: any[];

  startDate: Date;
  endDate: Date;

  minDate: Date = Constants.MIN_VALID_DATE;
  maxDate: Date = new Date();

  @ViewChild("dt",{static: true}) dt;

  yearValidRangeEft = `${Constants.EFT_MIN_VALID_YEAR}:${Constants.EFT_MAX_VALID_YEAR}`;
  
  constructor(private util: AppUtils, private dashboardService: DashboardService, 
    private storageService: StorageService, private router : Router) { }

  ngOnInit() {

    this.checkDates();

    this.categories = [{ label: 'All Categories', value: null }];
    this.util.getAllCategoriesWidgets(this.categories).then((res: any) => {
      this.categories = res;
      this.cols = [
        { field: 'id', header: 'Rule ID' },
        { field: 'name', header: 'Rule Description' },
        { field: 'category', header: 'Category' },
        { field: 'datestr', header: 'Date' },
        { field: 'ideaCode', header: 'Idea Code' }
      ];

      this.loadData();
    });

  }

  /**
   * Load data from backend service and parse to correct structure
   */
  loadData() {

    let is = this;
    this.data = [];

    let userId = this.util.getLoggedUserId();

    this.dashboardService.getNewVersionRules(userId, this.startDate, this.endDate).subscribe((response: any) => {
      if (response.code == 200) {
        response.data.forEach(function (element) {

          let startDate = new Date(element.createDate.replace("T", " ").split(".")[0].split(" ")[0] + ' 00:00:00');

          is.data.push({
            "id": element.ruleCode,
            "ruleId": is.util.encodeString(element.ruleId),
            "name": element.ruleName,
            "category": element.categoryDesc,
            "date": startDate,
            "datestr": is.dashboardService.parseDate(startDate),
            "icon": "fa fa-calendar",
            "ideaId" : is.util.encodeString(element.ideaId != undefined && element.ideaId != null ? element.ideaId : ""),
            "ideaCode" : element.ideaCode != undefined && element.ideaCode != null ? element.ideaCode : ""
          });
        });

        is.data.sort(function custom_sort(a, b) {
          return b.date.getTime() - a.date.getTime();
        });

        is.data = JSON.parse(JSON.stringify(is.data));

        if (this.typeView === "timeline") {
          this.createTimeline();
        }
      }
    });

  }

  /**
   * Change view mode (TIMELINE, TABLE)
   * @param view view mode
   */
  changeView(view) {

    if (this.typeView === view) {
      return;
    }

    this.typeView = view;

    if (this.typeView === "timeline") {
      this.createTimeline();
    }
  }

  /**
   * Create timeline when user select 'Timeline' option
   */
  createTimeline() {

    let items = [];

    for (let i = 0; i < this.data.length; i++) {

      let newDate = new Date(this.data[i].date);
      newDate.setHours(0);
      newDate.setMinutes(0);
      newDate.setSeconds(0);
      newDate.setMilliseconds(0);

      items.push({
        type: 'smallItem',
        label: this.data[i].datestr,
        shortContent: this.data[i].id + " - " + this.data[i].name,
        forcePosition: i % 2 == 0 ? "bottom" : "top",
        picto: '<i class="' + this.data[i].icon + '"></i>',
        relativePosition: newDate.getTime()
      });
    }

    try {
      //Destroy timeline
      $('.timeline-container').timelineMe("destroy");
    } catch (e) { }

    $(".timeline-container").html("");

    setTimeout(function () {
      $('.timeline-container').timelineMe({
        orientation: 'vertical',
        scrollArrows: false,
        scrollBar: true,
        items: items
      });
    }, 250);
  }

  /**
   * Check if we have dates stored in session
   */
  checkDates() {
    if (this.storageService.exists("DATES_UPDATED_RULES_START")) {
      this.startDate = new Date(this.storageService.get("DATES_UPDATED_RULES_START", true).date);
    } else {
      this.startDate = new Date();
    }

    if (this.storageService.exists("DATES_UPDATED_RULES_END")) {
      this.endDate = new Date(this.storageService.get("DATES_UPDATED_RULES_END", true).date);
    } else {
      this.endDate = new Date();
    }
  }

  /**
   * Store date selected in session for this widget
   * @param type START OR END
   */
  saveDate(type) {
    if (type == "START") {
      this.storageService.set("DATES_UPDATED_RULES_START", { date: this.startDate }, true);
    } else {
      this.storageService.set("DATES_UPDATED_RULES_END", { date: this.endDate }, true);
    }
  }

  /**
   * Navigate to detail
   * @param id
   */
  redirect(id, type) {
    this.storageService.set("PARENT_NAVIGATION", "UPDATED_RULES", false);
    this.router.navigate(['item-detail', id, type]);
  }

}
