import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { ResearchRequestService } from 'src/app/services/research-request.service';
import { UsersService } from 'src/app/services/users.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Constants as con } from 'src/app/shared/models/constants';
import { AppUtils } from 'src/app/shared/services/utils';
import * as _ from 'underscore';
import { ProjectRequestDto } from '../../models/dto/project-request-dto';
import { RrUtils } from '../../services/rr-utils.component';
import {RequestConstants} from "../../models/request.constants";

@Component({
  selector: 'rr-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css', '../shared-request-style.css']
})
export class PeopleComponent implements OnInit {

  request: ProjectRequestDto;
  @Input() set setRequest(value: ProjectRequestDto) {
    this.request = value;
    if (this.request && this.request.prCreatedBy)
    this.populateReporter();
    this.showAssigneeList();
  }
  @Input() routeToList: SelectItem[];
  @Input() readOnly: boolean;
  @Input() issueTypeDesc: string;
  @Input() rrButtonsDisable: boolean;
  @Output() updateRouteTo = new EventEmitter<SelectItem[]>();
  @Output() commentChange = new EventEmitter<string[]>();
  @Output() setFormDirty = new EventEmitter<Boolean>();

  selectedCCUsersList: any[] = [];
  removedCCUsersList: any[] = [];
  userSearchList: any[] = [];
  activeUsersList: any[] = [];
  userSearchWatcherList: any[] = [];
  selectedWatcherUsersList: any[] = [];
  removedWatcherUsersList: any[] = [];
  assigneeList: any[] = [];

  reporter: string;
  searchUser: string;
  searchWatcherUser: string;

  // BOOLEAN
  enableComment: boolean;
  enableReason: boolean;
  disableAssigneeList: boolean;

  dropDownStyles: any = { 'width': '100%', 'max-width': '100%', 'border': '1px solid #31006F' };

  constructor(private utils: AppUtils, private rrUtil: RrUtils, private utilService: UtilsService,
    private rrService: ResearchRequestService, private userService: UsersService) { }

  ngOnInit() {
    this.searchCCUsers = _.debounce(this.searchCCUsers, 1000);
    this.searchWatcherUsers = _.debounce(this.searchWatcherUsers, 1000);
    this.utils.getAllActiveUsers(this.activeUsersList);
  }

  /** Method to fetch the active users based on the keyword search.
   * @update the userSearchList (all the active users matching the keyword search)
   * @update the selectedCCUsersList(all the unique users selected from the userSearchList)
   */
  searchCCUsers() {
    this.setFormDirty.emit(true);
    if (this.searchUser && this.activeUsersList) {
      this.userSearchList = [];
      this.updateUserSearchList(this.userSearchList, this.searchUser);
      this.userSearchList.forEach(searchUser => {
        if (this.searchUser === searchUser.firstName) {
          if (!this.selectedCCUsersList.some(selectedUserObj => selectedUserObj.firstName === this.searchUser)) {
            this.selectedCCUsersList = [...this.selectedCCUsersList, ...this.userSearchList.filter(user => user.firstName === this.searchUser)];
            this.searchUser = "";
            this.userSearchList = [];
          } else {
            this.searchUser = "";
            this.userSearchList = [];
          }
        }
      });
      this.selectedCCUsersList = this.removedDuplicateEntry(this.selectedCCUsersList);
    } else {
      this.userSearchList = [];
    }
  }

  searchWatcherUsers() {
    this.setFormDirty.emit(true);
    if (this.searchWatcherUser && this.activeUsersList) {
      this.userSearchWatcherList = [];
      this.updateWatcherUserSearchList(this.userSearchWatcherList, this.searchWatcherUser);
      this.userSearchWatcherList.forEach(searchWatcherUser => {
        if (this.searchWatcherUser === searchWatcherUser.firstName) {
          if (!this.selectedWatcherUsersList.some(selectedUserObj => selectedUserObj.firstName === this.searchWatcherUser)) {
            this.selectedWatcherUsersList = [...this.selectedWatcherUsersList, ...this.userSearchWatcherList.filter(user => user.firstName === this.searchWatcherUser)];
            this.searchWatcherUser = "";
            this.userSearchWatcherList = [];
          } else {
            this.searchWatcherUser = "";
            this.userSearchWatcherList = [];
          }
        }
      });
      this.selectedWatcherUsersList = this.removedDuplicateEntry(this.selectedWatcherUsersList);
    } else {
      this.userSearchWatcherList = [];
    }
  }

  /* callback Method to fetch the active users based on the keyword search from active users list*/
  updateWatcherUserSearchList(userSearchWatcherList: any[], searchWatcherUser: string) {
    this.activeUsersList.forEach(user => {
      if (user.firstName && user.email) {
        if (!this.selectedWatcherUsersList.some(userObj => userObj.userId === user.userId)) {
          if (user.firstName.toLowerCase().includes(searchWatcherUser.toLowerCase()) || user.email.toLowerCase().includes(this.searchWatcherUser.toLowerCase())) {
            userSearchWatcherList.push(user);
          }
        }
      }
    });
  }

  showAssigneeList() {
    this.enableComment = false;
    this.enableReason = false;
    this.assigneeList = [];
    this.removeRedOutline('rrResoComments');
    this.removeRedOutline('txtComments');
    const userId = this.utils.getLoggedUserId()
    const username = this.utils.getLoggedUserName();

    let assigneeUser = (this.activeUsersList.some(user => user.userId === this.request.assignee)) ?
      this.activeUsersList.find(user => user.userId === this.request.assignee) : null;
    if (assigneeUser !== null && assigneeUser.firstName !== null) {
      this.assigneeList.push({
        label: `${assigneeUser.firstName}`,
        value: assigneeUser.userId
      });
    } else {
      this.assigneeList.push({ label: username, value: userId });
      this.request.assignee = userId;
    }
  }

  /** Method to fetch the user for PO returning the research request */
  getPOAssigneeUser() {
    this.rrService.getAssignedToByLastSubmittedRR(this.request.projectRequestId).subscribe(response => {
      this.updatePOAssignedList(response.data);
    });
  }

  /** Updating Policy Owner Assigned List by active UserList
   * @param userId Id to populateAssigneeList
   */
  updatePOAssignedList(userId: number) {
    if (this.activeUsersList.length > 0) {
      this.populateAssigneeList(this.activeUsersList, userId);
    } else {
      this.utilService.getAllActiveUsers().subscribe(response => {
        if (response.data !== null && response.data !== undefined) {
          this.activeUsersList = response.data;
          this.populateAssigneeList(this.activeUsersList, userId);
        }
      });
    }
  }

  /** Populating Assignee List
   * @param usersList List to grab the user detail
   * @param userId used as the value
   */
  populateAssigneeList(usersList: any[], userId: number) {
    usersList.forEach(user => {
      if (user.userId === userId) {
        this.assigneeList.push({
          label: `${user.firstName} ${user.lastName}`,
          value: user.userId
        });
      }
    });
  }

  /** Updating Assignee List based on userId
   * @param userId Id to search for user Info
   */
  updateAssigneeList(userId: number) {
    if (userId) {
      this.userService.getUserInfo(userId).subscribe(response => {
        if (response !== null && response !== undefined) {
          this.request.assignee = userId;
          this.assigneeList = [];
          this.assigneeList.push({ label: response.firstName, value: response.userId });
        }
      });
    }
  }


  /* callback Method to fetch the active users based on the keyword search from active users list*/
  updateUserSearchList(userSearchList: any[], searchUser: string) {
    this.activeUsersList.forEach(user => {
      if (user.firstName && user.email) {
        if (!this.selectedCCUsersList.some(userObj => userObj.userId === user.userId)) {
          if (user.firstName.toLowerCase().includes(searchUser.toLowerCase()) || user.email.toLowerCase().includes(this.searchUser.toLowerCase())) {
            userSearchList.push(user);
          }
        }
      }
    });
  }

  /**
 * This method is used to removed duplicate entry from the list
 * @param selectedList
 * @returns {any[]}
 */
  removedDuplicateEntry(selectedList: any[]): any[] {
    selectedList = selectedList.filter((selectedVal, index, array) =>
      index === array.findIndex((findVal) =>
        findVal.userName === selectedVal.userName
      )
    );
    return selectedList.sort();
  }

  populateReporter() {
    this.utils.getUserNameByUserId(this.request.prCreatedBy).then(user => {
      this.reporter = user.firstName;
    });

  }

  checkForComment(routeToObj: any, comments: string) {
    if (routeToObj.label === con.RR_WORKFLOW_STATUS_REQUESTOR_REVIEW && !comments) {
      this.commentChange.emit(['form-control input-textarea focus-glow', 'rrResoComments']);
      return false;
    }
  }

  removeRedOutline(id: string) {
    this.commentChange.emit(['form-control input-textarea', 'txtComments']);
  }

  /* Method to to remove from the selectedCCUsersList
@input:selectedUser Object
*/
  removeSelectedCCUser(user: any) {
    this.removedCCUsersList = this.selectedCCUsersList.filter(userObj => userObj.email === user.email);
    this.selectedCCUsersList = this.selectedCCUsersList.filter(userObj => userObj.email !== user.email);
    if (this.selectedCCUsersList.length < 1) {
      this.searchUser = '';
      this.userSearchList = [];
    }
  }

  /* Method to to remove from the selectedWatcherUsersList
@input:selectedUser Object
*/
  removeSelectedWatcherUser(user: any) {
    this.removedWatcherUsersList = this.selectedWatcherUsersList.filter(userObj => userObj.email === user.email);
    this.selectedWatcherUsersList = this.selectedWatcherUsersList.filter(userObj => userObj.email !== user.email);
    if (this.selectedWatcherUsersList.length < 1) {
      this.searchWatcherUser = "";
      this.userSearchWatcherList = [];
    }
  }

  private disabledFieldByPR(): boolean {
    if (this.issueTypeDesc && this.issueTypeDesc === RequestConstants.PROJECT_REQ) {
      return true;
    } else {
      return false;
    }
  }
}
