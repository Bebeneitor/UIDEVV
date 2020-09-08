import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { TreeNode, MessageService } from 'primeng/api';
import { EllSearchService } from './service/ell-search.service';
import { BaseResponse } from 'src/app/shared/models/base-response';
import { Router } from '@angular/router';
import { BrowserCacheService } from 'src/app/services/browser-cache.service';
import { StorageService } from 'src/app/services/storage.service';
import { Constants } from 'src/app/shared/models/constants';
import { OverlayPanel } from 'primeng/primeng';

const DECISION_TYPE = 'DECISION';
const TOPIC_TYPE = 'TOPIC';

@Component({
  selector: 'app-ell-search',
  templateUrl: './ell-search.component.html',
  styleUrls: ['./ell-search.component.css']
})
export class EllSearchComponent implements OnInit {

  @ViewChild('dateFilters') dateFilters: OverlayPanel;
  @ViewChild('authorFilter') authorFilter: OverlayPanel;

  data: TreeNode[] = [];
  keywordSearch: string = "";
  userName: string = "";
  initialDate: Date = null;
  finalDate: Date = null;
  blockedDocument: boolean;
  totalRecords: number = -1;
  setFilter: boolean = false;
  validData: boolean = true;

  releaseLogKey: number;
  minDate: Date = Constants.MIN_VALID_DATE;
  maxDate: Date = new Date();
  searchExpanded: boolean = false;
  showAll: boolean = false;
  filterRequest: any;
  dataRange: any;
  yearValidRangeEft = `${Constants.EFT_MIN_VALID_YEAR}:${Constants.EFT_MAX_VALID_YEAR}`;

  constructor(private ellSearchService: EllSearchService, private router: Router,
    private browserCacheService: BrowserCacheService, private storageService: StorageService, private messageService: MessageService) { }

  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    if (window.pageYOffset > 0) {
      this.storageService.set('SCROLL_ELL_SEARCH', window.pageYOffset, false);
    }
  }

  ngOnInit() {
    this.ellSearchService.loadReleaseLogKey().subscribe((response: BaseResponse) => {
      this.releaseLogKey = response.data;
      if(this.browserCacheService.exists('ELL_SEARCH_VIEW')) {
        this.data = this.browserCacheService.get('ELL_SEARCH_VIEW');
        this.loadScroll();
      } else {
        this.blockedDocument = true;
        this.loadData();
      }
    });
  }

  /**
   * Load prev scroll in the screen
   */
  loadScroll() {
    setTimeout(() => {
      if (this.storageService.exists('SCROLL_ELL_SEARCH')) {
        window.scroll(0, Number(this.storageService.get('SCROLL_ELL_SEARCH', false)));
      }
    }, 250);
  }

  /**
   * Load Policies from database (first level)
   */
  loadData() {

    this.validatingRequest();

    if (this.validData) {
      this.data = [];//cleaning previos data
      this.ellSearchService.loadFilterResult(this.filterRequest).subscribe((response: BaseResponse) => {

        let policies = response.data;

        this.totalRecords = policies.length;

        if (policies.length > 0) {

          policies.forEach((item, index) => {
            let children;

            if (item.topics != undefined && item.topics.length > 0) {
              children = [];

              item.topics.forEach((itemTopic, indexTopic) => {

                let childrenTopics = [];

                if(itemTopic.decisionPoints != undefined && itemTopic.decisionPoints.length > 0) {
                  itemTopic.decisionPoints.forEach((itemDecisionPoint, indexDecisionPoint) => {
                    let jsonDecisionPoint = itemDecisionPoint;
                    jsonDecisionPoint.typeLoad = DECISION_TYPE;
                    
                    childrenTopics.push({
                      data: jsonDecisionPoint,
                      children: []
                    });
                  });
                } else {
                  childrenTopics = [{
                    data: {
                      typeLoad: DECISION_TYPE
                    }
                  }];
                }

                let jsonTopic = itemTopic;
                jsonTopic.typeLoad = TOPIC_TYPE;
                
                children.push({
                  data: jsonTopic,
                  children: childrenTopics,
                  expanded: itemTopic.decisionPoints != undefined && itemTopic.decisionPoints.length > 0
                });  
              });
            } else {
              children = [{
                data: {
                  typeLoad: TOPIC_TYPE
                }
              }];
            }

            let newEntry = {
              index: index,
              data: item,
              children: children,
              expanded: item.topics != undefined && item.topics.length > 0
            };

            this.data.push(newEntry);
          });

          this.data = Object.assign([], this.data);
          this.loadScroll();
          this.storeInCache();

        }
        this.cleanDataFilter();
        this.blockedDocument = false;
      });

    }
    else {
      this.blockedDocument = false;
    }
  }

  /**
   * Fire this event when user expand some node
   * @param event 
   */
  expandNode(event) {
    switch (event.node.data.typeLoad) {
      case undefined:
        this.loadTopicNode(event);
        break;
      case TOPIC_TYPE:
        this.loadDecisionNode(event);
        break;
    }
  }

  /**
   * Load topics about policy
   * @param event 
   */
  loadTopicNode(event) {
    this.ellSearchService.loadTopics(event.node.data.medPolKey, this.releaseLogKey).subscribe((response: BaseResponse) => {

      let topics = [];

      response.data.forEach((item, index) => {
        item.typeLoad = TOPIC_TYPE;

        topics.push({
          index: index,
          data: item,
          children: [
            {
              data: {
                'typeLoad': DECISION_TYPE
              }
            }
          ]
        });
      });

      this.data[event.node.index].children = topics;
      this.data = Object.assign([], this.data);
      this.storeInCache();
    });
  }

  /**
   * Load decisions about topics
   * @param event 
   */
  loadDecisionNode(event) {
    this.ellSearchService.loadDecisions(event.node.data.topicKey, this.releaseLogKey).subscribe((response: BaseResponse) => {

      let decisions = [];

      response.data.forEach((item, index) => {
        item.typeLoad = DECISION_TYPE;

        decisions.push({
          index: index,
          data: item,
          children: []
        });
      });

      this.data[event.node.parent.index].children[event.node.index].children = decisions;
      this.data = Object.assign([], this.data);
      this.storeInCache();
    });
  }

  /**
   * Redirect to decision point screen
   * @param decisionPointKey 
   */
  redirectToDecisionPoint(decisionPointKey: number) {
    this.router.navigate(['/decision-point/' + this.releaseLogKey + '/' + decisionPointKey]);
  }

  /**
   * Redirect to topic detail screen
   * @param topicKey 
   */
  redirectToTopicDetail(topicKey: number) {
    this.router.navigate(['/topic-detail/' + this.releaseLogKey + '/' + topicKey]);
  }

  /**
   * Store the data in session 
   */
  storeInCache() {
    this.browserCacheService.set('ELL_SEARCH_VIEW', Object.assign([], this.data));
  }

  /**
   * Search button
   */
  filterPolicies() {

    this.dateFilters.hide(); //hidden overlayPanel
    this.authorFilter.hide(); //hidden overlayPanel  

    this.blockedDocument = true;//Enable loading screen    
    this.loadData();

  }//Close viewPolicies

  /**
   * Show or hide advanced filters in search box
   */
  changeSearchExpanded() {
    this.searchExpanded = !this.searchExpanded;
  }

  /**
   * This method cleans the search fields.
   */
  cleanDataFilter() {
    this.initialDate = null;
    this.finalDate = null;
    this.userName = "";
  }

  /**
   * This method validates the request JSON
   * according with back-end especifications.
   */
  validatingRequest() {

    this.validData = true;

    //validating final date was set.
    if (this.initialDate != null && this.finalDate == null) {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: "Please select one final date", life: 3000, closable: true });
      this.validData = false;
    }

    //validating initial date was set
    if (this.initialDate == null && this.finalDate != null) {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: "Please select one initial date", life: 3000, closable: true });
      this.validData = false;
    }

    //no filter by date
    if (this.initialDate == null && this.finalDate == null) {
      this.dataRange = null;
    }

    //filtering by date
    if (this.initialDate != null && this.finalDate != null) {
      if (this.initialDate > this.finalDate) {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: "Please select valid data range", life: 3000, closable: true });
        this.validData = false;
      }
      this.dataRange = {
        "initialDate": this.initialDate,
        "finalDate": this.finalDate
      }
    }

    //JSON required for the REST service.
    this.filterRequest = {
      "keywordSearch": this.keywordSearch,
      "userName": this.userName,
      "dateRange": this.dataRange,
      "releaseLogKey": this.releaseLogKey
    }

  }

  /**
   * This method is for only clean the author field
   * using the clean button.
   */
  cleanAuthor() {
    this.userName = "";
  }

  /**
   * This method is for only clean the data range fields
   * using the clean button.
   */
  cleanDataRange() {
    this.initialDate = null;
    this.finalDate = null;
  }

  highlight(text) {
    if (this.keywordSearch == '') {
      return text;
    }

    return text.replace(new RegExp(this.keywordSearch, 'gi'), match => {
      return '<span class="highlightText">' + match + '</span>';
    });
  }

}
