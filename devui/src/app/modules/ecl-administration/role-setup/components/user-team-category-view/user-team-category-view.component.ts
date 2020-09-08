/**
 * @author Ankit Chauhan
 */

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DynamicDialogConfig, TreeNode} from "primeng/api";
import {Categories} from "../../../../../shared/models/categories";
import {CategoriesService} from "../../../../../services/categories.service";
import {UsersService} from "../../../../../services/users.service";
import {UtilsService} from "../../../../../services/utils.service";
import {TreeTable} from "primeng/primeng";

/**
 * Required Data
 *
 *  Rule Creation               |      Rule Maintenance
 *  -------------               |      ----------------
 *  Team1                       |          Category1
 *      Category1               |                   User1
 *              User1           |                   User2
 *              User2           |          Category2
 *      Category2               |          Category3
 *              User1           |                   User1
 *              User2           |                   User2
 * Team2
 *
 * treeData = [
 *      {
 *           "data":{
 *             "name" : "test category"
 *           },
 *           "children":[{
 *             "data": {
 *               "name": "Ankit",
 *               "cca": "true",
 *               "po": "false"
 *             }
 *           },
 *             {
 *               "data": {
 *                 "name": "Prasanna",
 *                 "cca": "true",
 *                 "po": "true"
 *               }
 *             }]
 *         }
 *    ]
 * }
 */

const PAGE_TITLE_RC = "Rule Creation Team/Category User Assignments";
const PAGE_TITLE_RM = "Rule Maintenance Category User Assignments";
const FUNCTION_TYPE_RC = "RC";
const FUNCTION_TYPE_RM = "RM";

@Component({
  selector: 'app-user-team-category-view',
  templateUrl: './user-team-category-view.component.html',
  styleUrls: ['./user-team-category-view.component.css']
})

export class UserTeamCategoryViewComponent implements OnInit {

  @Input() functionType: any;
  @Input() display: boolean;
  @Output() displayChange = new EventEmitter();
  treeData: TreeNode[];
  loading: boolean;
  cols: any[];
  categories: any[];
  userCategoryMaps: any[];
  teams: any[];
  keywordSearchReturned: any = "";
  pageHeader: any;

  constructor(private categoriesService: CategoriesService,
              private usersService: UsersService,
              private utilsService: UtilsService
  ) {
  }

  ngOnInit() {
    this.treeData = [];
    this.loading = true;
    this.cols = [
      {field: 'name', header: 'Name', width: '70%'},
      {field: 'ccaFlag', header: 'CCA', width: '15%'},
      {field: 'poFlag', header: 'PO', width: '15%'}
    ];

    // this.viewUserTeamCategoryAssignments();
  }

  ngOnChanges() {
    this.loading = true;
    this.treeData = [];
    this.keywordSearchReturned = "";
    this.viewUserTeamCategoryAssignments();
  }

  /**
   * Rule Maintenance
   * **/

  /**
   * This method is used to add categories to treeNode
   *
   * @param categories
   */

  viewUserTeamCategoryAssignments() {
    if (this.functionType === FUNCTION_TYPE_RC) {
      this.pageHeader = PAGE_TITLE_RC;
      this.usersService.getUserTeamCategoryAssignments(this.functionType).subscribe(response => {
        this.userCategoryMaps = [];
        this.userCategoryMaps = response.data;

        this.teams = [];
        this.utilsService.getAllTeams().subscribe(response => {
          this.teams = response.data;
          this.treeData = [];
          this.addTeamsToTreeNodes(this.teams);
          this.loading = false;
        });
      });
    } else if (this.functionType === FUNCTION_TYPE_RM) {
      this.pageHeader = PAGE_TITLE_RM;
      this.usersService.getUserTeamCategoryAssignments(this.functionType).subscribe(response => {
        this.userCategoryMaps = [];
        this.userCategoryMaps = response.data;

        this.categories = [];
        this.categoriesService.findAllCategory().subscribe(response => {
          this.categories = response;
          this.treeData = [];
          this.addCategoriesToTreeNodesRM(this.categories);
          this.loading = false;
        });
      });
    }

  }

  addCategoriesToTreeNodesRM(categories: Categories[]) {
    let usersNodes: TreeNode[] = [];
    categories.forEach(category => {
      this.treeData.push(this.addUsersToTreeNodesRM(category));
    });
  }

  /**
   * This method is used to add users to treeNode
   *
   * @param category
   */

  addUsersToTreeNodesRM(category: Categories): TreeNode {
    let usersNodes: TreeNode[] = [];

    for (let [key, value] of Object.entries(this.userCategoryMaps)) {
      if (key === category.categoryDesc) {
        for (let map of Object.values(value)) {
          usersNodes.push(this.addUserToTreeNode(map));
        }
      }
    }

    return {
      data: {"name": category.categoryDesc},
      children: usersNodes
    };
  }


  /**
   * Rule Creation
   */

  /**
   * This method is used to add teams to treeNode
   *
   * @param teams
   */


  addTeamsToTreeNodes(teams: any[]) {
    teams.forEach(team => {
      this.treeData.push(this.addTeamToTreeNodes(team));
    });
  }

  /**
   * This method is used to add a team to treeNode
   *
   * @param team
   */

  addTeamToTreeNodes(team: any) {
    let usersNodes: TreeNode[] = [];

    for (let [key, value] of Object.entries(this.userCategoryMaps)) {
      if (key === team.teamName) {
        let categories: Categories[] = value;
        for (let [key, value] of Object.entries(categories)) {
          usersNodes.push(this.addUsersToTreeNodesRC(key, value));
        }
      }
    }

    return {
      data: {"name": team.teamName},
      children: usersNodes
    };
  }

  /**
   * This method is used to add users to treeNode
   *
   * @param catName
   * @param users
   */

  addUsersToTreeNodesRC(catName: any, users: any): TreeNode {
    let usersNodes: TreeNode[] = [];

    users.forEach(user => {
      usersNodes.push(this.addUserToTreeNode(user));
    })

    return {
      data: {"name": catName},
      children: usersNodes
    };
  }

  addUserToTreeNode(map: any): TreeNode {
    return {
      data: {
        "name": map.userName,
        "ccaFlag": map.ccaFlag,
        "poFlag": map.poFlag
      }
    }
  }

  resetDataTable(treeTable: TreeTable) {
    this.keywordSearchReturned = "";
    treeTable.reset();
    treeTable.filterGlobal(this.keywordSearchReturned, 'contains');
  }

  onClose() {
    this.displayChange.emit(false);
  }

  ngOnDestroy() {
    this.displayChange.unsubscribe();
  }

}
