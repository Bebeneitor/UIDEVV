import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { GoodIdeasDto } from 'src/app/shared/models/dto/good-ideas-dto';
import { RoutingConstants } from '../shared/models/routing-constants';

const RESPONSE_SUCCESS = "success";
const RESPONSE_FAIL = "fail";
const RESPONSE_CONTINUE = "continue";

const TYPE_RULE = "rule";
const TYPE_PROVISIONAL_RULE = "provisional";

const COLUMN_CODE = "code";
const COLUMN_NAME = "name";
const COLUMN_CATEGORY = "category";
const COLUMN_DAYS_OLD = "daysold";
const COLUMN_CREATOR = "creator";
const COLUMN_REVIEW_COMMENT = "reviewComment";
const COLUMN_GOOD_IDEA_DT = "goodIdeaDt";

@Injectable({
  providedIn: 'root'
})
export class GoodIdeasServiceService {

  constructor(private http: HttpClient, private messageService: MessageService) { }

  public getGoodIdeasHeader(typeTable: String): any[] {
    let goodIdeasHeader: any[];
    if (typeTable === TYPE_RULE) {
      goodIdeasHeader = [
        { field: COLUMN_CODE, header: 'Rule ID', width: '6%' },
        { field: COLUMN_NAME, header: 'Rule Name', width: '20%' },
        { field: COLUMN_CATEGORY, header: 'Category', width: '8%' },
        { field: COLUMN_DAYS_OLD, header: 'Days Old', width: '5%' },
        { field: COLUMN_CREATOR, header: 'Rule Creator', width: '8%' },
        { field: COLUMN_REVIEW_COMMENT, header: 'Review Comment', width: '8%' },
        { field: COLUMN_GOOD_IDEA_DT, header: 'Notification Date', width: '10%' }
      ];
    } else if (typeTable === TYPE_PROVISIONAL_RULE) {
      goodIdeasHeader = [
        { field: COLUMN_CODE, header: 'Provisional Rule ID', width: '6%' },
        { field: COLUMN_NAME, header: 'Provisional Rule Name', width: '20%' },
        { field: COLUMN_CATEGORY, header: 'Category', width: '8%' },
        { field: COLUMN_DAYS_OLD, header: 'Days Old', width: '5%' },
        { field: COLUMN_CREATOR, header: 'Provisional Rule Creator', width: '8%' },
        { field: COLUMN_REVIEW_COMMENT, header: 'Review Comment', width: '8%' },
        { field: COLUMN_GOOD_IDEA_DT, header: 'Notification Date', width: '10%' }
      ];
    }
    return goodIdeasHeader;
  }

  public submitGoodIdeas(goodIdeasBody: GoodIdeasDto[]) {
    return new Promise(resolve => {
      let requestBody: any[] = [];
      goodIdeasBody.forEach(data => {
        if (data.goodIdeaDt) {
          requestBody.push(
            {
              ruleId: data.ruleId,
              goodIdeaDt: data.goodIdeaDt
            }
          );
        }
      });

      if (requestBody.length > 0) {
        this.http.post(environment.restServiceUrl + RoutingConstants.GOOD_IDEA_URL + '/', requestBody).subscribe(response => {
          if (response) {
            resolve(RESPONSE_SUCCESS);
          } else {
            resolve(RESPONSE_FAIL);
          }
        });
      } else {
        resolve(RESPONSE_CONTINUE);
      }
    });
  }

  public updateStatusToReviewedInGoodIdeas(ruleId : number) {
    return new Promise((resolve, reject) => {

      this.http.put(environment.restServiceUrl + RoutingConstants.GOOD_IDEA_URL + '/' + ruleId + '/' + RoutingConstants.REVIEWED_GOOD_IDEA_URL, undefined).subscribe(response => {
        resolve(response);
      });

    });
  }

}
