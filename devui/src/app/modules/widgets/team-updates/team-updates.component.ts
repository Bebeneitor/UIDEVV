import { Component, OnInit, Input } from '@angular/core';
import { Constants } from 'src/app/shared/models/constants';
import { TeamsService } from 'src/app/services/teams.service';
import { BaseResponse } from 'src/app/shared/models/base-response';
import { AppUtils } from 'src/app/shared/services/utils';
import { Router } from '@angular/router';

@Component({
  selector: 'app-team-updates',
  templateUrl: './team-updates.component.html',
  styleUrls: ['./team-updates.component.css']
})
export class TeamUpdatesComponent implements OnInit {

  @Input('title') title: string;

  badges: any[] = [];

  selectedTeamMember: any = null;
  team = [];

  selectedTeam: any = null;
  teams = [];

  data: any;
  options: any;
  hideChart: boolean = false;

  totalItems: number = 0;

  loading: boolean = true;

  userIdLast: number = 0;

  constructor(private teamService: TeamsService, private util: AppUtils, private router: Router) { }

  ngOnInit() {
    this.loadTeams().then(() => {
      this.loadTeamMembers().then(() => {
        this.loadData();
      });
    });
  }

  /**
   * Load teams by user
   */
  loadTeams() {
    return new Promise(resolve => {
      this.teamService.getTeamsFromUser(this.util.getLoggedUserId()).subscribe((response: BaseResponse) => {

        this.teams = [];

        response.data.forEach(item => {
          this.teams.push({ name: item.teamName, code: item.teamId });
        });

        if (this.teams.length > 0) {
          this.selectedTeam = this.teams[0];
        }

        resolve();
      });
    });
  }

  /**
   * Load team members by team 
   */
  loadTeamMembers() {
    return new Promise((resolve) => {
      this.teamService.getUsersFromTeam(this.selectedTeam.code).subscribe((response: BaseResponse) => {
        this.team = [];
        if (response.data) {
          response.data.users.forEach(item => {
            this.team.push({ name: item.firstName, code: item.userId });
          });

          this.team.sort(function (a, b) {
            a = a.name.toLowerCase();
            b = b.name.toLowerCase();

            return a < b ? -1 : a > b ? 1 : 0;
          });
        }
        resolve();
      });
    });
  }

  /**
   * Load data from backend
   * @param userId 
   */
  loadData(userId: number = 0) {

    this.loading = true;

    this.userIdLast = userId;

    this.teamService.getTeamCounters(this.selectedTeam.code, userId).subscribe((response: BaseResponse) => {
      let dataUsers = [];

      if (userId == 0) {
        dataUsers = response.data.userCounts;
      } else {
        response.data.userId = userId;
        dataUsers = [response.data];
      }

      this.createView(dataUsers, userId);

    });

  }

  /**
   * Create chart and badges views
   * @param dataUsers 
   * @param userId 
   */
  createView(dataUsers, userId) {

    let labels = [];
    let datasets = [];

    this.team.forEach((item) => {
      if (userId == 0) {
        labels.push(item.name);
      } else {
        if (item.code == userId) {
          labels.push(item.name);
        }
      }
    });

    let localBadges = [
      { header: 'Ideas generated', key: 'ideasCreated', type: 'IG' },
      { header: 'Provisional rules generated', key: 'provisionalRulesCreated', type: 'PRG' },
      { header: 'Provisional rules assigned', key: 'provisionalRulesAssigned', type: 'PRA' },
      { header: 'Rules generated', key: 'rulesCreated', type: 'RG' },
      { header: 'Shelved', key: 'rulesShelved', type: 'S' },
      { header: 'Invalid', key: 'ideasInvalid', type: 'I' },
      { header: 'Duplicated', key: 'ideasDuplicated', type: 'D' },
    ];

    this.badges = [];

    let countersByType = {
      ideasCreated: 0,
      provisionalRulesCreated: 0,
      provisionalRulesAssigned: 0,
      rulesCreated: 0,
      rulesShelved: 0,
      ideasInvalid: 0,
      ideasDuplicated: 0
    }

    this.totalItems = 0;

    let maxNumber = 0;

    let i = 0;

    localBadges.forEach((badgeItem) => {

      let data = [];

      this.team.forEach(t => {
        //Search counter in base of the user and the badge
        dataUsers.forEach(itemUser => {
          if (itemUser.userId == t.code) {

            if (itemUser[badgeItem.key] > maxNumber) {
              maxNumber = itemUser[badgeItem.key];
            }

            data.push(itemUser[badgeItem.key]);
            countersByType[badgeItem.key] = countersByType[badgeItem.key] + itemUser[badgeItem.key];
          }
        });
      });

      if(i >= Constants.AVAILABLE_COLORS.length) {
        i = 0;
      }

      datasets.push({
        label: badgeItem.header,
        backgroundColor: Constants.AVAILABLE_COLORS[i],
        borderColor: Constants.AVAILABLE_COLORS[i],
        data: data
      });

      this.badges.push({
        'name': badgeItem.header,
        'count': countersByType[badgeItem.key],
        'color': Constants.AVAILABLE_COLORS[i],
        'type': badgeItem.type
      });

      i++;
    });

    this.options = {
      legend: {
        display: false,
        position: 'bottom'
      },
      scales: {
        xAxes: [{
          ticks: {
            beginAtZero: true,
            suggestedMax: maxNumber + 20
          }
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true,
            suggestedMax: maxNumber + 20
          }
        }]
      }
    }

    this.data = {
      labels: labels,
      datasets: datasets
    }

    Object.keys(countersByType).forEach((key) => {
      this.totalItems += countersByType[key];
    });

    this.loading = false;
  }

  /**
   * Event when user change team in dropdown
   * @param event 
   */
  changeTeam(event) {
    this.loading = true;
    this.selectedTeamMember = null;
    this.loadTeamMembers().then(() => {
      this.loadData();
    });
  }

  /**
   * Event when user change team member in dropdown
   * @param event 
   */
  changeMember(event) {
    this.loading = true;
    this.loadData(event.value == null ? 0 : event.value.code);
  }

  /**
   * Redirect to detail screen
   * @param status 
   */
  redirect(status) {

    let teamId = this.selectedTeam.code;
    let userId = this.selectedTeamMember == null ? 0 : this.selectedTeamMember.code;

    this.router.navigate(["/team-updates-report"], {
      queryParams: {
        teamId: teamId,
        userId: userId,
        status: status
      }
    });
  }

}
