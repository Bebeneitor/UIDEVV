import { UserAccessDto } from './../shared/models/dto/user-access-dto';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppUtils } from "src/app/shared/services/utils";
import { environment } from 'src/environments/environment';
import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import { BaseResponse } from 'src/app/shared/models/base-response';
import { SelectItem } from 'primeng/api';
import { TeamDto } from 'src/app/shared/models/dto/team-dto';
import { UserItemsDto } from 'src/app/shared/models/dto/user-items-dto';
import { Categories } from 'src/app/shared/models/categories';
import { DashboardService } from './dashboard.service';

const ALL_USERS_ITEM = { label: "Global View", value: 0 } ;
const ALL_CATEGORIES_ITEM = { label: "All Categories", value: 0 } ;
const colors = ['#31006F', '#333333', '#9579D3', '#E9008B', '#7B47BC', '#D9B4B4', '#5600EB'];

@Injectable({
  providedIn: 'root'
})
export class TeamUpdatesReportService {

  constructor(private http: HttpClient,private utils: AppUtils, private dashboardService : DashboardService) { }

  /**
   * This method is used to get the teams by logger user from the back-end,
   * The teams will be returned alphabetically.
   * 
   *  @return Promise<SelectItem[]>.
  */
  getTeamsByLoggerUser() {
    return new Promise<SelectItem[]>((resolve) => {
      let uri = `${environment.restServiceUrl}${RoutingConstants.TEAMS_URL}/${RoutingConstants.USER_TEAMS_URL}?userId=${this.utils.getLoggedUserId()}`;
      let teams: SelectItem[] = [];
      this.http.get(uri).subscribe((baseReponse: BaseResponse) => {
        let allTeams: TeamDto[] = baseReponse.data;
        allTeams.forEach(team => {
          teams.push({ label: team.teamName, value: team.teamId });
        });
        teams = teams.sort((a, b) => {
          return (a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : -1
        });
        resolve(teams);
      });
    });
  }

  /**
   * This method is used to get the users belong a Team, from the 
    private categoriesService: CategoriesServiceback-end,
   * The users will be returned alphabetically with Global View at the beginning.
   * 
   *  @param teamId - Team id.
   *  @return Promise<SelectItem[]>.
  */
  getUsersByTeam(teamId: number) {
    return new Promise<SelectItem[]>((resolve) => {
      let uri = `${environment.restServiceUrl}${RoutingConstants.TEAMS_URL}/${RoutingConstants.TEAM_MEMBERS_URL}?teamId=${teamId}`;
      this.http.get(uri).subscribe((baseReponse: BaseResponse) => {
        let availableMemberTeams: UserAccessDto[] = baseReponse.data.users;
        let teamMembers : SelectItem[] = [];
        
        if (availableMemberTeams != null || availableMemberTeams != undefined || availableMemberTeams != []) {
          availableMemberTeams.forEach(team => {
            teamMembers.push({ label: team.firstName, value: team.userId });
          });
          teamMembers = teamMembers.sort((a, b) => {
            return (a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : -1
          });
          teamMembers.unshift(ALL_USERS_ITEM);
        }
        resolve(teamMembers);
      });
    });
  }
  
  /**
   * This method is used to get categories from the back-end,
   * 
   *  @return Promise<SelectItem[]>.
  */
  getCategories() {
    return new Promise<SelectItem[]>((resolve) => {
      let uri = environment.restServiceUrl + RoutingConstants.CATEGORIES_URL;
      this.http.get(uri).subscribe((categoriesResponse: Categories[]) => {
        let categories : SelectItem[] = [];
        if (categoriesResponse != null || categoriesResponse != undefined || categoriesResponse != []) {
          categoriesResponse.forEach(category => {
            categories.push({ label: category.categoryDesc, value: category.categoryId });
          });
          categories.unshift(ALL_CATEGORIES_ITEM);
        }
        resolve(categories);
      });
    });
  }

  /**
   * This method is used to get statuses,
   * 
   *  @return SelectItem[].
  */
  getStatuses(){
    let status : SelectItem[] = [];
    status.push({ label: "All Statuses", value: "ALL" });
    status.push({ label: "Ideas Generated", value: "IG" });
    status.push({ label: "Provisional Rules Generated", value: "PRG" });
    status.push({ label: "Provisional Rules Assigned", value: "PRA" });
    status.push({ label: "Rules Generated", value: "RG" });
    status.push({ label: "Shelved", value: "S" });
    status.push({ label: "Invalid", value: "I" });
    status.push({ label: "Duplicated", value: "D" });
    return status;
  }

  /**
   * This method is used to get data to show in the Chart,
   * 
   *  @return data Chart, or undefined when all response data are in zero.
  */
  getDataChart(teamId: number, userId: number, categoryId?: number, startDate?: Date, endDate?: Date) {
    
    return new Promise<UserItemsDto>((resolve, reject) => {
      
      let uri = environment.restServiceUrl + RoutingConstants.TEAMS_URL + "/" + RoutingConstants.GET_TEAM_USER_ITEMS_DETAILS_COUNT_URL + "?teamId=" + teamId + "&userId=" + userId;
      if (categoryId !== undefined) {
        uri = uri + "&categoryId=" + categoryId;
      }
      if (startDate !== undefined && endDate !== undefined) {
        uri = uri + "&startDate=" + this.parseDate(startDate) + "&endDate=" + this.parseDate(endDate);
      }
      this.http.post(uri, undefined).subscribe((baseReponse: BaseResponse) => {
        let dataNormalized : number[];
        if (userId === ALL_USERS_ITEM.value){
          let userItems : UserItemsDto[] = baseReponse.data.userCounts;
           dataNormalized = this.accumulateUserItems(userItems);
        }else{
          let userItem : UserItemsDto = baseReponse.data;
          dataNormalized = this.accumulateUserItems([userItem]);
        }
        let data : any;
        if(dataNormalized){
          data = {
            labels: [
             'Ideas Generated',
             'Provisional Rules Generated',
             'Provisional Rules Assigned',
             'Rules Generated',
             'Shelved', 
             'Invalid', 
             'Duplicated'
            ],
            datasets: [
              {
                data: dataNormalized,
                backgroundColor: colors,
                hoverBackgroundColor: colors,
              }]
          };
          resolve(data);
         }else{
           reject(undefined);
        }
      });
    });
  }

  /**
   * This method is used to get accumulate data to show in the Chart,
   * 
   *  @return number[]
  */
  private accumulateUserItems(userItemsDto?: UserItemsDto[]) {
    let userItem: UserItemsDto = new UserItemsDto();
    let sum: number = 0;

    userItemsDto.forEach(category => {
      userItem.ideasCreated += category.ideasCreated;
      userItem.provisionalRulesCreated += category.provisionalRulesCreated;
      userItem.provisionalRulesAssigned += category.provisionalRulesAssigned;
      userItem.rulesCreated += category.rulesCreated;
      userItem.rulesShelved += category.rulesShelved;
      userItem.ideasInvalid += category.ideasInvalid;
      userItem.ideasDuplicated += category.ideasDuplicated;
      sum += userItem.ideasCreated + userItem.provisionalRulesCreated + userItem.provisionalRulesAssigned + userItem.rulesCreated
        + userItem.ideasInvalid + userItem.rulesShelved + userItem.ideasDuplicated;
    });

    if (sum > 0) {
      let userItemData = [
        userItem.ideasCreated,
        userItem.provisionalRulesCreated,
        userItem.provisionalRulesAssigned,
        userItem.rulesCreated,
        userItem.rulesShelved,
        userItem.ideasInvalid,
        userItem.ideasDuplicated
      ];
      return userItemData;
    } else {
      return undefined;
    }
  }


  /**
   * Parse date to traditional format
   * @param date 
   */
  parseDate(date: Date) {
    return this.dashboardService.parseDate(date);
  }

}


