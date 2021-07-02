import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AppUtils } from '../shared/services/utils';
import { StorageService } from './storage.service';
import { RoutingConstants } from '../shared/models/routing-constants';
import { map } from 'rxjs/operators';
import { BaseResponse } from '../shared/models/base-response';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private _observableSave = new ReplaySubject<any>(1);
  observableSave$ = this._observableSave.asObservable();

  constructor(private storage: StorageService, private http: HttpClient, private utils: AppUtils) { }

  changeSave() {
    this._observableSave.next(Math.random());
  }

  getParameters(userId) {
    return new Promise((resolve, reject) => {
      this.loadParametersFromService(userId).then((response: any) => {
        resolve(response);
      });
    });
  }

  loadParametersFromService(userId) {
    return new Promise((resolve, reject) => {
      let request = this.http.get<any[]>(environment.restServiceUrl + RoutingConstants.USER_DASHBOARD_URL + "/" + userId + "/" + RoutingConstants.PARAMETERS_SETTINGS_URL).subscribe((response: any) => {
        request.unsubscribe();
        if (response.code == 200) {
          resolve(response.data);
        } else {
          resolve({});
        }
      });
    });
  }

  saveParameters(userId, parameters) {
    return this.http.post(environment.restServiceUrl + RoutingConstants.USER_DASHBOARD_URL + "/" + userId + "/" + RoutingConstants.PARAMETERS_SETTINGS_URL, {
      "userId": userId,
      "itemsToView": Number(parameters.rulesView),
      "title": parameters.title
    });
  }

  getInterests(userId) {
    return new Promise((resolve, reject) => {
      this.loadInterestsFromService(userId).then((response: any) => {
        resolve(response);
      });
    });
  }

  loadInterestsFromService(userId) {
    return new Promise((resolve, reject) => {
      let request = this.http.get<any[]>(environment.restServiceUrl + RoutingConstants.USER_DASHBOARD_URL + "/" + userId + "/" + RoutingConstants.INTERESTS_URL).subscribe((response: any) => {
        request.unsubscribe();
        if (response.code == 200) {
          resolve(response.data);
        } else {
          resolve([]);
        }
      });
    });
  }

  getAvailableWidgets() {
    return new Promise((resolve, reject) => {
      if (this.storage.exists("AVAILABLE_WIDGETS")) {
        resolve(this.storage.get("AVAILABLE_WIDGETS", true));
      } else {
        this.loadAvailableWidgetsFromService().then((response: any) => {
          this.storage.set("AVAILABLE_WIDGETS", response, true);
          resolve(response);
        });
      }
    });
  }

  loadAvailableWidgetsFromService() {
    return new Promise((resolve, reject) => {
      let request = this.http.get<any[]>(environment.restServiceUrl + RoutingConstants.WIDGETS_URL).subscribe((response: any) => {
        request.unsubscribe();
        for (let i = 0; i < response.length; i++) {
          response[i]["widget-reference"] = response[i].widgetReference;
        }
        resolve(response);
      });
    });
  }

  saveInterests(userId, interests) {

    let arrInterests = [];

    interests.forEach((element) => {
      arrInterests.push({
        "lob": { "id": Number(element.lob) },
        "state": { "id": Number(element.state) },
        "jurisdiction": { "id": Number(element.jurisdiction) },
        "category": { "id": Number(element.category) }
      });
    });

    return this.http.post(environment.restServiceUrl + RoutingConstants.USER_DASHBOARD_URL + "/" + userId + "/" + RoutingConstants.INTERESTS_URL, {
      "userId": userId,
      "favoritesLst": arrInterests
    });
  }

  saveDashboard(userId, widgets) {
    //Call service to store in database
    let WidgetService = [];

    for (let i = 0; i < widgets.length; i++) {
      WidgetService.push({
        "widget": {
          "id": widgets[i].id,
          "title": widgets[i].title,
          "widgetReference": widgets[i]["widget-reference"]
        },
        "row": widgets[i].positions.row,
        "column": widgets[i].positions.col
      });
    }

    return this.http.post(environment.restServiceUrl + RoutingConstants.USER_DASHBOARD_URL + "/" + userId, WidgetService);
  }

  getWidgets() {
    return new Promise((resolve, reject) => {
      let widgets = [];

      if (this.storage.exists("WIDGETS_LST")) {
        widgets = this.storage.get("WIDGETS_LST", true);
        resolve(widgets);
      } else {
        this.loadWidgetsFromService().then((response: any) => {
          widgets = response;
          this.storage.set("WIDGETS_LST", widgets, true);
          resolve(widgets);
        })
      }
    });
  }

  loadWidgetsFromService() {
    return new Promise((resolve, reject) => {

      let userId = this.utils.getLoggedUserId();

      let request = this.http.get<any[]>(environment.restServiceUrl + 'usrdashboard/' + userId).subscribe((response: any) => {
        request.unsubscribe();

        let widgets = [];

        if (response.code == 200) {
          for (let i = 0; i < response.data.widgets.length; i++) {

            widgets.push({
              "id": response.data.widgets[i].widget.id,
              "widget-reference": response.data.widgets[i].widget.widgetReference,
              "title": response.data.widgets[i].widget.title,
              "positions": {
                col: response.data.widgets[i].column,
                row: response.data.widgets[i].row
              }
            });
          }
        }

        resolve(widgets);
      });
    });
  }

  //Services for the avalible widgets:
  getAllIdeasForCheck(userId: number): Observable<any> {
    return this.http.get(environment.restServiceUrl + RoutingConstants.WIDGETS_URL + "/" + RoutingConstants.MY_TASK_URL + "/" + userId);
  }

  getIdeasGenerated(userId, statusId, startDate, endDate): Observable<any[]> {
    return this.http.get<[]>(environment.restServiceUrl + RoutingConstants.WIDGETS_URL + "/" + RoutingConstants.IDEAS_GENERATED_URL
      + "/" + userId + "?statusId=" + statusId + "&startDate=" + this.parseDate(startDate) + "&endDate=" + this.parseDate(endDate));
  }

  getNewVersionRules(userId, startDate, endDate): Observable<any[]> {
    return this.http.get<[]>(environment.restServiceUrl + RoutingConstants.WIDGETS_URL + "/" + RoutingConstants.NEW_VERSION_RULES_URL + "/" + userId + "?startDate=" + this.parseDate(startDate) + "&endDate=" + this.parseDate(endDate));
  }

  getNewRulesInECL(userId, startDate, endDate): Observable<any[]> {
    return this.http.get<[]>(environment.restServiceUrl + RoutingConstants.WIDGETS_URL + "/" + RoutingConstants.NEW_RULES_IN_ECL_URL + "/" + userId + "?startDate=" + this.parseDate(startDate) + "&endDate=" + this.parseDate(endDate));
  }

  getMyContributions(userId, startDate, endDate) {
    return this.http.get<[]>(environment.restServiceUrl + RoutingConstants.WIDGETS_URL + "/" + RoutingConstants.MY_CONTRIBUTIONS_URL
      + "/" + userId + "?startDate=" + this.parseDate(startDate) + "&endDate=" + this.parseDate(endDate));
  }

  getRulesImplemented(userId, startDate, endDate): Observable<any[]> {
    return this.http.get<[]>(environment.restServiceUrl + RoutingConstants.WIDGETS_URL + "/" + RoutingConstants.RULES_IMPLEMENTED_URL
      + "/" + userId + "?startDate=" + this.parseDate(startDate) + "&endDate=" + this.parseDate(endDate));
  }

  getTopRevenueRules(startDate, endDate, amount): Observable<any[]> {
    return this.http.get<[]>(environment.restServiceUrl + RoutingConstants.WIDGETS_URL + "/" + RoutingConstants.TOP_REVENUE_RULES_URL + '?rulesAmount=' + amount + '&startDate=' + this.parseDate(startDate) + '&endDate=' + this.parseDate(endDate) + '');
  }

  getMyFavorites(userId): Observable<any[]> {
    return this.http.get<[]>(environment.restServiceUrl + RoutingConstants.WIDGETS_URL + "/" + RoutingConstants.MY_FAVORITES_URL + "?userId=" + userId);
  }

  getCountDeprecatedItems(startDate, endDate) {
    return this.http.get<[]>(environment.restServiceUrl + RoutingConstants.RULES_URL + "/" + RoutingConstants.DEPRECATED_ITEMS_COUNT + '?startDate=' + this.parseDate(startDate) + '&endDate=' + this.parseDate(endDate));
  }

  getListDeprecatedItems(startDate, endDate, status) {
    return this.http.get<[]>(environment.restServiceUrl + RoutingConstants.RULES_URL + "/" + RoutingConstants.DEPRECATED_ITEMS_LIST + '?startDate=' + this.parseDate(startDate) + '&endDate=' + this.parseDate(endDate) + '&status=' + status)
  }

  getAvailableWidgetsByUser(userId: number) {
    return this.http.get(environment.restServiceUrl + RoutingConstants.USER_DASHBOARD_URL + '/' + userId + '/' + RoutingConstants.ROLE_WIDGETS_URL);
  }

  /**
   * Parse value to two digits format
   * @param val 
   */
  twoDigits(val) {
    return Number(val) < 10 ? "0" + val : val.toString();
  }

  /**
   * Parse dat to SQL format 
   * @param date 
   */
  parseDateSQL(date) {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    return year + "-" + this.twoDigits(month) + "-" + this.twoDigits(day);
  }

  parseDateHours(date) {
    let strDate = this.parseDate(date) + " " + this.twoDigits(date.getHours()) + ":" + this.twoDigits(date.getMinutes());

    return strDate;
  }

  /**
   * Parse date to traditional format
   * @param date 
   */
  parseDate(date) {
    if(date==null){return null;}
    if (typeof date === 'string') {
      date = new Date(date);
    }
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();

    let strMonth = "";

    switch (month) {
      case 0:
        strMonth = "JAN";
        break;
      case 1:
        strMonth = "FEB";
        break;
      case 2:
        strMonth = "MAR";
        break;
      case 3:
        strMonth = "APR";
        break;
      case 4:
        strMonth = "MAY";
        break;
      case 5:
        strMonth = "JUN";
        break;
      case 6:
        strMonth = "JUL";
        break;
      case 7:
        strMonth = "AUG";
        break;
      case 8:
        strMonth = "SEP";
        break;
      case 9:
        strMonth = "OCT";
        break;
      case 10:
        strMonth = "NOV";
        break;
      case 11:
        strMonth = "DEC";
        break;
    }

    return day + "-" + strMonth + "-" + year.toString().substring(2, year.toString().length);
  }
}
