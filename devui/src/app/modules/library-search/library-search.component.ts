import { Component, OnInit } from '@angular/core';
import { AppUtils } from 'src/app/shared/services/utils';
import { LibraryViewService } from 'src/app/services/library-view.service';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { TreeNode } from 'primeng/components/common/treenode';
import { Constants } from 'src/app/shared/models/constants';
import * as _ from 'underscore';

@Component({
  selector: 'app-library-search',
  templateUrl: './library-search.component.html',
  styleUrls: ['./library-search.component.css']
})

export class LibrarySearchComponent implements OnInit {

  categories: any = [];
  index: number = 0;
  selectedNode: TreeNode;
  activeKeywordSearch: string = "";
  oldVersionKeywordSearch: string = "";
  retiredKeywordSearch: string = "";
  loadingRules: boolean = false;

  defaultMessage = [{
    'label': 'No records',
    'data': undefined,
    'icon': 'fa fa-adjust'
  }];

  loadingMessage = [{
    'label': 'Loading...',
    'data': undefined,
    'icon': 'fa fa-adjust'
  }];

  constructor(private util: AppUtils, private libraryViewService: LibraryViewService, private router: Router,
    private storageService: StorageService) {
    this.filterRules = _.debounce(this.filterRules, 1000);
  }

  ngOnInit() {
    if (this.storageService.exists("parentScreen")) {
      if (this.storageService.get("parentScreen", false).replace(/"/g, "") === "RULE_CATALOGUE") {
        this.index = parseInt(this.storageService.get("activeTab", false));
        switch (this.index) {
          case 0:
            this.activeKeywordSearch = this.storageService.get("searchFilter", false);
            break;
          case 1:
            this.oldVersionKeywordSearch = this.storageService.get("searchFilter", false);
            break;
          case 2:
            this.retiredKeywordSearch = this.storageService.get("searchFilter", false);
        }
        this.filterRules();
      }
    } else {
      this.loadCategories();
    }
  }

  loadCategories() {
    this.categories.length = 0;
    let listOfCategories = [];
    this.util.getAllCategories(listOfCategories).then((response: any) => {
      let allCategories = response;
      allCategories.forEach((category: any) => {
        this.categories.push({
          'label': category.label,
          'data': undefined,
          'expandedIcon': 'fa fa-folder-open',
          'collapsedIcon': 'fa fa-folder',
          'children': this.loadingMessage
        });
      });
    });
  }

  goToOldVersion(clickedNode: any) {
    this.index = 1;
    this.getCatalogueByCategoryChildren(clickedNode.data[1], clickedNode.parent);
  }

  getCatalogueByCategoryChildren(selectedRule: string, category: any) {
    this.libraryViewService.getRulesCatalogueByCategory(1, category.label).subscribe((response: any) => {
      let rulesCatalogue: any = response.data;
      let children = [];
      if (Array.isArray(rulesCatalogue) && rulesCatalogue.length) {
        rulesCatalogue.forEach((rule: any) => {
          if (rule.ruleCode.split(".")[0] == selectedRule.split(".")[0]) {
            this.generateChildrenNode(children, rule);
          }
        });
        this.sortChildren(children);
        category.children = children;
      }
      this.selectedNode = category;
    });
  }

  generateChildrenNode(children: any[], rule: any) {
    let existChildNode: boolean = children.find((child: any) => {
      return child.data[1].split(".")[0] === rule.ruleCode.split(".")[0];
    });
    if (!existChildNode) {
      children.push({
        'label': rule.ruleLabel,
        'icon': 'fa fa-file-o',
        'type': rule.hasOldVersions ? 'redirectIcon' : 'onlyParents',
        'data': [rule.ruleId, rule.ruleCode, rule.hasOldVersions],
        'description': rule.ruleDescription
      });
    } else {
      children[children.length - 1]["children"] = [];
      children[children.length - 1]["children"].push({
        'label': rule.ruleLabel,
        'icon': 'fa fa-file-o',
        'type': rule.hasOldVersions ? 'redirectIcon' : 'onlyParents',
        'data': [rule.ruleId, rule.ruleCode, rule.hasOldVersions],
        'description': rule.ruleDescription
      });
    }
  }

  getCatalogueByCategory(event: any, onlyParents: boolean) {
    this.libraryViewService.getRulesCatalogueByCategory(this.index, event.node.label).subscribe((response: any) => {
      let rulesCatalogue: any = response.data;
      let children = [];
      if (Array.isArray(rulesCatalogue) && rulesCatalogue.length) {
        if (onlyParents) {
          rulesCatalogue.forEach((rule: any) => {
            children.push({
              'label': rule.ruleLabel,
              'icon': 'fa fa-file-o',
              'type': rule.hasOldVersions ? 'redirectIcon' : 'onlyParents',
              'data': [rule.ruleId, rule.ruleCode, rule.hasOldVersions],
              'description': rule.ruleDescription
            });
          });
        } else {
          rulesCatalogue.forEach((rule: any) => {
            this.generateChildrenNode(children, rule);
          });
        }
        this.sortChildren(children);
        event.node.children = [];
        event.node.children = children;
      } else {
        event.node.children = this.defaultMessage;
      }
      this.selectedNode = event;
    });

  }

  redirect(node: any) {
    if (node.data == undefined) {
      return;
    }
    let ruleId = node.data[0];
    this.storageService.set("parentScreen", 'RULE_CATALOGUE', true);
    let filterValue: string;
    switch (this.index) {
      case 0:
        filterValue = this.activeKeywordSearch;
        break;
      case 1:
        filterValue = this.oldVersionKeywordSearch;
        break;
      case 2:
        filterValue = this.retiredKeywordSearch;
    }
    this.storageService.set("activeTab", this.index, false);
    this.storageService.set("searchFilter", filterValue, false);
    this.router.navigate(['/item-detail', this.util.encodeString(ruleId.toString()), 'RULE'], { queryParams: { source: Constants.RULE_CATALOG_SCREEN } });
  }


  handleChange(event: any) {
    this.index = event.index;
    this.loadCategories();
  }


  sortChildren(children: any[]) {
    children.sort((a, b) => (a.label < b.label) ? 1 : -1);
  }

  filterRules() {
    let keywordSearch: string = "";
    this.categories.length = 0;
    switch (this.index) {
      case 0:
        keywordSearch = this.activeKeywordSearch;
        break;
      case 1:
        keywordSearch = this.oldVersionKeywordSearch;
        break;
      case 2:
        keywordSearch = this.retiredKeywordSearch;
        break;
    }
    if (keywordSearch == "") {
      this.loadCategories();
    } else {
      this.loadFilteredRules(keywordSearch);
    }

  }

  loadFilteredRules(keywordSearch: string) {
    this.loadingRules = true;
    this.libraryViewService.getRulesCatalogueByCategory(this.index, null, keywordSearch).subscribe((response: any) => {
      let rulesCatalogue: any = response.data;
      let filteredCategories = new Set();

      rulesCatalogue.forEach((rule: any) => {
        filteredCategories.add(rule.category);
      });

      filteredCategories.forEach((categoryName: string) => {
        this.categories.push({
          'label': categoryName,
          'data': undefined,
          'expandedIcon': 'fa fa-folder-open',
          'collapsedIcon': 'fa fa-folder',
          'children': []
        });
      });

      rulesCatalogue.forEach((rule: any) => {
        let index: number = 0;
        filteredCategories.forEach((category: string) => {
          if (category === rule.category) {
            this.categories[index].children.push({
              'label': rule.ruleLabel,
              'icon': 'fa fa-file-o',
              'type': rule.hasOldVersions ? 'redirectIcon' : 'onlyParents',
              'data': [rule.ruleId, rule.ruleCode, rule.hasOldVersions],
              'description': rule.ruleDescription
            });
          }
          index++;
        });
      });
      this.expandAll();
      let listOfCategories = [];
      this.util.getAllCategories(listOfCategories).then((response: any) => {
        let allCategories = response;
        allCategories.forEach((category: any) => {
          if (category.label.toString().toLowerCase().includes(keywordSearch.toLowerCase())) {
            if (!this.categories.find((categoryNode: any) => categoryNode.label == category.label)) {
              this.categories.push({
                'label': category.label,
                'data': undefined,
                'expandedIcon': 'fa fa-folder-open',
                'collapsedIcon': 'fa fa-folder',
                'children': this.loadingMessage
              });
            }
          }
        });
      });
      this.categories = this.categories.sort((a, b) => (a.label < b.label ? -1 : 1));
      this.loadingRules = false;
      if (this.storageService.exists("parentScreen")) {
        this.storageService.remove("parentScreen");
        this.storageService.remove("activeTab");
        this.storageService.remove("searchFilter");
      }
    });
  }

  expandAll() {
    this.categories.forEach((node: any) => {
      this.expandRecursive(node, true);
    });
  }
  private expandRecursive(node: TreeNode, isExpand: boolean) {
    node.expanded = isExpand;
    if (node.children) {
      node.children.forEach(childNode => {
        this.expandRecursive(childNode, isExpand);
      });
    }
  }

}