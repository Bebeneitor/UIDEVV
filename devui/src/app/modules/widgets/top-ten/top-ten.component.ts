import { Component, OnInit, Input } from '@angular/core';
import { AppUtils } from 'src/app/shared/services/utils';
import { DashboardService } from 'src/app/services/dashboard.service';
import { Constants } from 'src/app/shared/models/constants';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-ten',
  templateUrl: './top-ten.component.html',
  styleUrls: ['./top-ten.component.css']
})
export class TopTenComponent implements OnInit {

  @Input()
  title: string = "";

  typeView: string = "list"; //table and chart

  options: any;
  cols: any[];
  data: any;
  dataTable: any = [];

  categories: any[];

  startDate: Date;
  endDate: Date;

  minDate: Date = Constants.MIN_VALID_DATE;
  maxDate: Date = new Date();

  yearValidRangeEft = `${Constants.EFT_MIN_VALID_YEAR}:${Constants.EFT_MAX_VALID_YEAR}`;
  
  constructor(private utils : AppUtils, private dashboardService : DashboardService, 
    private storageService : StorageService, private router : Router) { }

  ngOnInit() {

    this.checkDates();

    this.options = {
      legend: {
        position: 'bottom',
        display: false
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            fontSize: 11
          }
        }],
        xAxes: [
          {
            ticks: {
              beginAtZero: true,
              fontSize: 11
            }
          }
        ]
      }
    };

    this.categories = [{ label: 'All Categories', value: null }];
    this.utils.getAllCategoriesWidgets(this.categories).then((res: any) => {
      this.categories = res;
      this.cols = [
        { field: 'position', header: '#' },
        { field: 'id', header: 'Rule ID' },
        { field: 'name', header: 'Rule Description' },
        { field: 'performance', header: 'Performance' },
        { field: 'category', header: 'Category' }
      ];

      this.loadData();
    });

  }

  /**
   * Load data from backend and parse to correct structure
   */
  loadData() {

    this.dataTable = [];

    let availableColors = Constants.AVAILABLE_COLORS;
    let indexColor = 0;
    let i = 0;
    let value = 0;

    this.dashboardService.getTopRevenueRules(this.startDate, this.endDate, 10).subscribe((response : any) => {
      if(response.code == 200) {

        response.data.forEach(data => {

          let performance = data.revenue;

          if(i == 0) {
            value = performance; // Max
          }

          let percentage = (performance * 100) / value;

          if(percentage < 50) {
            percentage = 49;
          }

          this.dataTable.push({
            "position": (i + 1),
            "id": data.ruleCode,
            "ruleId": this.utils.encodeString(data.ruleId),
            "name": data.ruleDesc,
            "performance": performance,
            "category": data.categoryName,
            "color" : availableColors[indexColor],
            "percentage" : Math.round(percentage)
          });

          indexColor++;
          i++;

          if (indexColor > availableColors.length - 1) {
            indexColor = 0;
          }
        });

        if (this.typeView === "chart") {
          this.createChart();
        }
      }
    });

  }

  /**
   * Change view (LIST, TABLE)
   * @param view view mode
   */
  changeView(view) {

    if (this.typeView === view) {
      return;
    }

    this.typeView = view;

    if (this.typeView === "chart") {
      this.createChart();
    }
  }

  /**
   * Create chart when user select 'Chart' view
   */
  createChart() {

    let labels = [];
    let data = [];
    let colors = [];

    let availableColors = Constants.AVAILABLE_COLORS;
    let indexColor = 0;

    for (let i = 0; i < this.dataTable.length; i++) {

      let str = this.dataTable[i].id;

      labels.push(str.toUpperCase());
      data.push(this.dataTable[i].performance);
      colors.push(availableColors[indexColor]);

      indexColor++;

      if (indexColor > availableColors.length - 1) {
        indexColor = 0;
      }
    }

    this.data = {
      labels: labels,
      datasets: [
        {
          backgroundColor: colors,
          borderColor: colors,
          data: data,
          fill: false
        }
      ]
    }
  }

  /**
   * Refresh data in widget
   */
  refresh() {
    this.loadData();
  }

  /**
   * Check if we have dates stored in session
   */
  checkDates() {
    if (this.storageService.exists("DATES_TOP_TEN_START")) {
      this.startDate = new Date(this.storageService.get("DATES_TOP_TEN_START", true).date);
    } else {
      this.startDate = new Date();
    }

    if (this.storageService.exists("DATES_TOP_TEN_END")) {
      this.endDate = new Date(this.storageService.get("DATES_TOP_TEN_END", true).date);
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
      this.storageService.set("DATES_TOP_TEN_START", { date: this.startDate }, true);
    } else {
      this.storageService.set("DATES_TOP_TEN_END", { date: this.endDate }, true);
    }
  }

  /**
   * Navigate to detail
   * @param id
   */
  redirect(id, type) {
    this.storageService.set("PARENT_NAVIGATION", "TOP_TEN", false);
    this.router.navigate(['item-detail', id, type]);
  }

}
