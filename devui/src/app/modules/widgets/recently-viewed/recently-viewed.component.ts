import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AppUtils } from 'src/app/shared/services/utils';
import { DashboardService } from 'src/app/services/dashboard.service';
import { Constants } from 'src/app/shared/models/constants';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recently-viewed',
  templateUrl: './recently-viewed.component.html',
  styleUrls: ['./recently-viewed.component.css']
})
export class RecentlyViewedComponent implements OnInit {

  @Input()
  title: string = "";

  typeView: string = "slider";

  cols: any[];
  data: any[] = [];
  categories: any[];

  dataView: any[] = [];

  selectedCategory: any = null;
  isClick: boolean = false;

  @ViewChild("dt") dt;

  constructor(private util: AppUtils, private dashboardService: DashboardService,
    private storageService : StorageService, private router : Router) { }

  ngOnInit() {

    this.categories = [{ label: 'All Categories', value: null }];
    this.util.getAllCategoriesWidgets(this.categories).then((res: any) => {
      this.categories = res;
      this.cols = [
        { field: 'id', header: 'Rule ID' },
        { field: 'name', header: 'Rule Name' },
        { field: 'category', header: 'Category' },
        { field: 'type', header: 'Type' }
      ];

      this.loadData();

    });

  }

  /**
   * Load data from service and parse to table structrue
   */
  loadData() {

    this.data = [];

    let userId = this.util.getLoggedUserId();

    this.dashboardService.getMyFavorites(userId).subscribe((response: any) => {
      if (response.code == 200) {
        for (let i = 0; i < response.data.length; i++) {
          let favorites = response.data[i].favorites;

          for (let j = 0; j < favorites.length; j++) {
            this.data.push({
              "id": favorites[j].favoriteCode,
              "name": favorites[j].favoriteName,
              "category": favorites[j].category,
              "type": favorites[j].rule ? "RULE" : "IDEA",
              "favoriteId": this.util.encodeString(favorites[j].favoriteId)
            });
          }
        }

        this.data = JSON.parse(JSON.stringify(this.data));

        if (this.typeView === "slider") {
          this.createSlider();
        }
      }
    });


  }

  /**
   * Change view mode (SLIDER, TABLE)
   * @param view view selected
   */
  changeView(view) {

    if (this.selectedCategory != null) {
      this.selectedCategory = null;
      this.dt.filter(null, 'category', 'contains');
    }

    if (view == "slider") {
      this.isClick = false;
    }

    if (this.typeView === view) {
      return;
    }

    this.typeView = view;

    if (this.typeView === "slider") {
      this.createSlider();
    }
  }

  /**
   * Create slider when user select 'Slider' option
   */
  createSlider() {

    this.dataView = [];

    let availableColors = Constants.AVAILABLE_COLORS;
    let indexColor = 0;

    for (let i = 1; i < this.categories.length; i++) {

      let count = 0;

      for (let j = 0; j < this.data.length; j++) {
        if (this.data[j].category == this.categories[i].label) {
          count++;
        }
      }

      if (count === 0) {
        continue;
      }

      this.dataView.push({
        category: this.categories[i].label,
        icon: "fa fa-user",
        count: count,
        color: availableColors[indexColor]
      });

      indexColor++;

      if (indexColor > availableColors.length - 1) {
        indexColor = 0;
      }
    }
    this.dataView = JSON.parse(JSON.stringify(this.dataView));
  }

  /**
   * Limit string in table view
   * @param str
   * @param limit
   */
  limitString(str, limit) {
    if (str.length > limit) {
      return str.substring(0, limit) + "...";
    } else {
      return str;
    }
  }

  /**
   * Show table view filtered by category, this happend when
   * user set click on category in slider view
   * @param category
   */
  showFilteredData(category) {
    this.changeView("table");
    this.isClick = true;
    this.selectedCategory = category;
    this.dt.filter(category, 'category', 'contains');
  }

  /**
   * Return to previous view
   */
  return() {
    this.selectedCategory = null;
    this.dt.filter(null, 'category', 'contains');
    this.typeView = "slider";
    this.isClick = false;
  }

  /**
   * Refresh data in widget
   */
  refresh() {
    this.loadData();
  }

  /**
   * Navigate to detail
   * @param id
   */
  redirect(id, type) {
    this.storageService.set("PARENT_NAVIGATION", "RECENTLY_VIEWED", false);
    this.router.navigate(['item-detail', id, type]);
  }

}
