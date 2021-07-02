import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ConfirmationService, DynamicDialogRef, DynamicDialogConfig } from 'primeng/api';
import { DashboardService } from 'src/app/services/dashboard.service';
import { StorageService } from 'src/app/services/storage.service';
import { AppUtils } from 'src/app/shared/services/utils';
import { MenuService } from 'src/app/services/menu.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { BaseResponse } from '../../models/base-response';

declare let $: any;

@Component({
  selector: 'app-settings-dasbhoard',
  templateUrl: './settings-dasbhoard.component.html',
  styleUrls: ['./settings-dasbhoard.component.css'],
  providers: [ConfirmationService]
})
export class SettingsDasbhoardComponent implements OnInit, OnDestroy, AfterViewInit {

  cols: any[];
  data: any[] = [];

  realAvailableWidgets: any[] = [];
  availableWidgets: any[] = [];
  availableWidgetsByUser: any[] = [];
  widgets: any[] = [];

  //By cols
  widgets1: any = [];
  widgets2: any = [];

  lobs: any = [];
  states: any = [];
  jurisdictions: any = [];
  categories: any = [];

  interest: any = {
    lob: 0,
    state: 0,
    jurisdiction: 0,
    category: 0
  };

  load: any = {
    widgets: false,
    interests: false,
    parameters: false
  }

  errorList: any = [];

  parameters: any = {
    "title": "HOME PAGE",
    "rulesView": 25
  }

  startTab: string = "widgets";

  suscription: any = undefined;

  //validation fields
  originalWidgets: any[] = null;
  originalInterests: any[] = null;
  originalParameters: any = null;

  constructor(private dashboardService: DashboardService,
    public ref: DynamicDialogRef,
    private utils: AppUtils,
    private storageService: StorageService,
    private confirmationService: ConfirmationService,
    private config: DynamicDialogConfig,
    private menuService: MenuService,
    private permissionService: NgxPermissionsService) {
    this.startTab = this.config.data.tab;

    this.utils.getAllCategoriesValue(this.categories, false);
    this.utils.getAllJurisdictionsValue(this.jurisdictions, false);
    this.utils.getAllStatesValue(this.states, false);
    this.utils.getAllLobsValue(this.lobs, false);
  }

  /**
   * Clear subscriptions
   */
  ngOnDestroy() {
    if (this.suscription != undefined) {
      this.suscription.unsubscribe();
    }
  }

  /**
   * Initialization
   */
  ngOnInit() {

    this.suscription = this.menuService.listenSettings().subscribe((res: any) => {
      this.ref.close();
    });

    this.errorList = [];

    this.cols = [
      { field: 'lob_name', header: 'LOB' },
      { field: 'state_name', header: 'State' },
      { field: 'jurisdiction_name', header: 'Jurisdiction' },
      { field: 'category_name', header: 'Category' },
      { field: 'options', header: '', width: '50px' }
    ];

  }

  ngAfterViewInit() {
    let is = this;

    this.loadWidgetsTab();
    this.loadParametersTab();

    setTimeout(function () {
      is.loadInterestsTab();
    }, 500);
  }

  /**
   * Handle event in tab chagne
   * @param event 
   */
  handleChange(event) {
    switch (event.index) {
      case 0: //dashboards
        this.loadWidgetsTab();
        break;
      case 1: //Interest
        this.loadInterestsTab();
        break;
      case 2: //Parameters
        this.loadParametersTab();
        break;
    }
  }

  /**
   * Load data in widgets tab from services
   */
  loadWidgetsTab() {

    if (this.load.widgets) {
      return;
    }

    this.realAvailableWidgets = [];
    this.availableWidgets = [];
    this.widgets = [];
    this.widgets1 = [];
    this.widgets2 = [];

    this.dashboardService.getAvailableWidgets().then((response: any) => {
      this.realAvailableWidgets = response.data;

      this.dashboardService.getAvailableWidgetsByUser(this.utils.getLoggedUserId()).subscribe((responseByUser: BaseResponse) => {

        this.availableWidgetsByUser = responseByUser.data.widgets;

        this.dashboardService.getWidgets().then((response: any) => {
          this.widgets = response;
  
          for (let i = 0; i < this.realAvailableWidgets.length; i++) {
            let exists = false;
            
            for (let j = 0; j < this.widgets.length; j++) {
              if (this.widgets[j].id == this.realAvailableWidgets[i].id) {
                exists = true;
                break;
              }
            }
  
            if (!exists) {
              if(this.isValidWidget(this.realAvailableWidgets[i].widgetReference)) {
                this.availableWidgets.push(this.realAvailableWidgets[i]);
              }
            }
          }
  
          for (let i = 0; i < this.widgets.length; i++) {
            
            if(this.isValidWidget(this.widgets[i]['widget-reference'])) {
              switch (this.widgets[i].positions.col) {
                case 1:
                  this.widgets1.push(this.widgets[i]);
                  break;
                case 2:
                  this.widgets2.push(this.widgets[i]);
                  break;
              }
            }
          }
  
          //Order widgets by row 
          this.widgets1.sort(function (a, b) {
            return parseFloat(a.positions.row) - parseFloat(b.positions.row);
          });
  
          this.widgets2.sort(function (a, b) {
            return parseFloat(a.positions.row) - parseFloat(b.positions.row);
          });
  
          this.originalWidgets = JSON.parse(JSON.stringify(this.widgets1)).concat(JSON.parse(JSON.stringify(this.widgets2)));
  
          this.load.widgets = true;
  
          //Create drag and drop sortable list
          setTimeout(function () {
            $(".sortable_list").sortable({
              connectWith: ".connectedSortable",
              receive: function (event, ui) {
              }
            }).disableSelection();
  
          }, 500);
        });

      });

    });
  }

  isValidWidget(widgetReference: string) {
    let widget = this.availableWidgetsByUser.find(a => a.widget.widgetReference === widgetReference);

    return widget != null && widget != undefined;
  }

  /**
   * Load data in interests tab from services
   */
  loadInterestsTab() {

    if (this.load.interests) {
      return;
    }

    this.interest = {
      lob: 0,
      state: 0,
      jurisdiction: 0,
      category: 0
    };

    //Call backend service for the moment use localstorage because database is not already
    this.dashboardService.getInterests(this.utils.getLoggedUserId()).then((response: any) => {
      let responseList = response.favoritesLst == null ? [] : response.favoritesLst;

      for (let i = 0; i < responseList.length; i++) {
        this.interest = {
          lob: responseList[i].lob.id.toString(),
          state: (responseList[i].state == null || responseList[i].state.id == "" ? 0 : responseList[i].state.id).toString(),
          jurisdiction: (responseList[i].jurisdiction == null || responseList[i].jurisdiction.id == "" ? 0 : responseList[i].jurisdiction.id).toString(),
          category: responseList[i].category.id.toString()
        };

        this.addInerest(false);
      }

      this.originalInterests = JSON.parse(JSON.stringify(this.data));
    });

    this.load.interests = true;
  }

  /**
   * Load data in parameters tab from services
   */
  loadParametersTab() {
    if (this.load.parameters) {
      return;
    }

    this.dashboardService.getParameters(this.utils.getLoggedUserId()).then((response: any) => {
      this.parameters.rulesView = response.itemsToView;
      this.parameters.title = response.title;
      this.load.parameters = true;

      this.originalParameters = JSON.parse(JSON.stringify(this.parameters));
    });

  }

  /**
   * Check the structure needed from interest in base
   * of lob
   */
  checkLob() {
    switch (this.interest.lob) {
      case 1:
        this.interest.jurisdiction = 0;
        break;
      case 2:
        this.interest.state = 0;
        break;
      default:
        this.interest.jurisdiction = 0;
        this.interest.state = 0;
        break;
    }
  }

  /**
   * Add an interest item to list and display
   * in table view
   */
  addInerest(validate) {
    //Validate if fields are not empty
    this.errorList = [];

    if (validate) {
      if (Number(this.interest.lob) == 0) {
        this.errorList.push("LOB field is empty.");
      } else {
        switch (Number(this.interest.lob)) {
          case 1:
            if (Number(this.interest.state) == 0) {
              this.errorList.push("State field is empty.");
            }
            break
          case 2:
            if (Number(this.interest.jurisdiction) == 0) {
              this.errorList.push("Jurisdiction field is empty.");
            }
            break;
        }
      }

      if (Number(this.interest.category) == 0) {
        this.errorList.push("Category field is empty.");
      }

      if (this.errorList.length > 0) {
        return;
      }
    }

    //Validate if data is not the same with other row
    let exists = false;
    for (let i = 0; i < this.data.length; i++) {

      if (
        (this.data[i].category == this.interest.category) &&
        (this.data[i].lob == this.interest.lob) &&
        (this.data[i].jurisdiction == this.interest.jurisdiction) &&
        (this.data[i].state == this.interest.state)
      ) {
        exists = true;
        break;
      }
    }

    if (exists) {
      this.errorList.push("You already have this information in the table.");
      return;
    }

    this.errorList = [];

    //Add to object string values

    let category_name = "";
    let state_name = "";
    let jurisdiction_name = "";
    let lob_name = "";

    let is = this;

    this.categories.forEach(function (element) {
      if (element.value == Number(is.interest.category)) {
        category_name = element.label;
      }
    });

    this.lobs.forEach(function (element) {
      if (element.value == Number(is.interest.lob)) {
        lob_name = element.label;
      }
    });

    this.jurisdictions.forEach(function (element) {
      if (element.value == Number(is.interest.jurisdiction)) {
        jurisdiction_name = element.label;
      }
    });

    this.states.forEach(function (element) {
      if (element.value == Number(is.interest.state)) {
        state_name = element.label;
      }
    });

    //Add to data list
    this.interest["category_name"] = category_name;
    this.interest["lob_name"] = lob_name;
    this.interest["jurisdiction_name"] = jurisdiction_name;
    this.interest["state_name"] = state_name;

    //Add Data
    this.data.push(this.interest);

    this.interest = {
      lob: 0,
      state: 0,
      jurisdiction: 0,
      category: 0
    };

    this.data = JSON.parse(JSON.stringify(this.data));

  }

  /**
   * Remove an interest from list
   * @param index item
   */
  removeInterest(index) {
    this.data.splice(index, 1);

    this.data = JSON.parse(JSON.stringify(this.data));
  }

  /**
   * Close settings screen
   */
  close() {
    this.confirmationService.confirm({
      message: 'Are you sure, you want to close without saving?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.ref.close();
      },
      reject: () => {
      }
    });
  }

  /**
   * Validate if the user change something in the screen
   */
  userChangeInfo(widgets) {

    let result = false;

    //validate widgets

    if (widgets.length == this.originalWidgets.length) {
      let countWidgets = 0;

      widgets.forEach(widget => {

        this.originalWidgets.forEach(owidget => {
          if (
            widget.id === owidget.id &&
            widget["widget-reference"] === owidget["widget-reference"] &&
            widget.title === owidget.title &&
            widget.positions.col === owidget.positions.col &&
            widget.positions.row === owidget.positions.row
          ) {
            countWidgets++;
          }
        });
      });

      if (countWidgets != widgets.length) {
        result = true;
      }
    } else {
      result = true;
    }

    //validate interests
    if (!result) {
      if (this.data.length == this.originalInterests.length) {
        let countInterests = 0;

        this.data.forEach(interest => {

          this.originalInterests.forEach(ointerest => {
            if (
              interest.category === ointerest.category &&
              interest.category_name === ointerest.category_name &&
              interest.jurisdiction === ointerest.jurisdiction &&
              interest.jurisdiction_name === ointerest.jurisdiction_name &&
              interest.lob === ointerest.lob &&
              interest.lob_name === ointerest.lob_name &&
              interest.state === ointerest.state &&
              interest.state_name === ointerest.state_name
            ) {
              countInterests++;
            }
          });
        });

        if (countInterests != this.data.length) {
          result = true;
        }
      } else {
        result = true;
      }
    }

    //validate parameters
    if (!result) {
      if (this.parameters.rulesView != this.originalParameters.rulesView || this.parameters.title != this.originalParameters.title) {
        result = true;
      }
    }

    return result;
  }

  /**
   * Save user settings in database
   */
  save() {

    let widgets = [];

    let i = 1;

    $("#sortable2 > li").each(function (index) {
      let id = ($(this).attr("idWidget"));
      let reference = ($(this).attr("widgetReference"));
      let title = ($(this).text().trim());

      widgets.push({
        "id": id,
        "widget-reference": reference,
        "title": title,
        "positions": {
          col: 1,
          row: i
        }
      });
      i++;
    });

    i = 1;
    $("#sortable3 > li").each(function (index) {
      let id = ($(this).attr("idWidget"));
      let reference = ($(this).attr("widgetReference"));
      let title = ($(this).text().trim());

      widgets.push({
        "id": id,
        "widget-reference": reference,
        "title": title,
        "positions": {
          col: 2,
          row: i
        }
      });
      i++;
    });

    //Save dashboards
    let userId = this.utils.getLoggedUserId();

    //Validate if the user change something in the screen, if not the success message will not display to user

    //Is true if the user change something and need call backend services and show success message
    let somethingChange = this.userChangeInfo(widgets);

    if (somethingChange) {
      this.dashboardService.saveDashboard(userId, widgets).subscribe((response: any) => {

        if (response) {
          this.storageService.set("WIDGETS_LST", widgets, true);

          //Save interests
          this.dashboardService.saveInterests(userId, this.data).subscribe((responseInterests: any) => {

            if (this.parameters.rulesView == null || this.parameters.rulesView == undefined || this.parameters.rulesView.toString() == "") {
              this.parameters.rulesView = 25;
            }

            //Save parameters
            this.dashboardService.saveParameters(userId, this.parameters).subscribe((responseParameters: any) => {
              this.dashboardService.changeSave();

              this.ref.close();
            });
          });
        }
      });
    } else {
      this.ref.close();
    }


  }
}
