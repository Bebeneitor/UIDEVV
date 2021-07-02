import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Constants as consts } from 'src/app/shared/models/constants';
import { PrintService } from 'src/app/services/print.service';
import { AppUtils } from '../../services/utils';
import { SortEvent } from 'primeng/api';
import { PrintData } from "../../../shared/models/print-data";

@Component({
  selector: 'app-print-page',
  templateUrl: './print-page.component.html',
  styleUrls: ['./print-page.component.css']
})
export class PrintPageComponent implements OnInit {

  @Output() printDisplay: EventEmitter<boolean> = new EventEmitter();

  count: number;
  stage: number = 0;
  printData: PrintData = {
    title: '',
    data: [],
    cols: [],
    refs: false
  }
  show: boolean = false;
  constructor(private printService: PrintService, private util: AppUtils) { }

  ngOnInit() {
    this.printService.printRun.subscribe(printData => {
      let data = printData.data;
      if (data !== undefined && data !== null && data.length > 0) {
        this.runPrintSetup(printData);
        this.printDisplay.emit(true);
      } else {
        this.endPrint();
      }
    })
  }

  runPrintSetup(printData) {
    this.count = printData.data.length;
    this.printData = printData;
    let data = printData.data;
    let count = data.length;
    let ref = printData.refs

    // Reassign-ment Table that contains references
    if (ref && ref === true) {
      printData.data = this.referenceMap(data, count);
    }

    // idea-research Table that contains nested Object
    if (printData.title === 'Ideas Needing Research') {
      let checkObj = printData.data[0];
      let keys = Object.keys(checkObj);

      if (keys.includes('ideaId') && !keys.includes('ruleId')) {
        this.nestedObjectIdeaResearch(consts.ECL_IDEA_STAGE);
      } else {
        this.nestedObjectIdeaResearch(consts.ECL_PROVISIONAL_STAGE);
      }
    }
  }

  customSort(event: SortEvent) {
    this.util.customSort(event)
  }
  print() {
    window.print();
  }
  endPrint() {
    this.printDisplay.emit(false);
  }

  /**
   * Map Reference into a group to display.
   * @param data Idea/Rule Object that contains References
   * @param count How many reference in one Idea/Rule Object row.
   */
  private referenceMap(data, count) {
    let reference = 'reference';
    count = 0;
    return data.map(value => {
      count = 0;
      if (value.referenceName1) {
        count++;
      }
      if (value.referenceName1 !== '' && value.referenceName2) {
        count++;
      }
      if (value.referencename1 !== '' && value.referenceName2 !== '' && value.referenceName3) {
        count++;
      }
      count > 0 ? value.references = `${count} ${reference}` : value.reference = '';
      if (value.ruleCode) {
        return {
          'ruleCode': value.ruleCode,
          'createdBy': value.createdBy,
          'name': value.name,
          'description': value.description,
          'references': value.references,
          'daysold': value.daysold,
          'status': value.status,
          'assignedTo': value.assignedTo
        }
      }
    })
  }

  // Nesting Issues for Objects.
  private nestedObjectIdeaResearch(stage: number) {
    if (stage === consts.ECL_IDEA_STAGE) {
      this.printData.cols = [
        { field: 'ideaCode', header: 'Idea ID', width: '10%' },
        { field: 'ideaName', header: 'Idea Name', width: '30%' },
        { field: 'ideaDescription', header: 'Idea Description', width: '30%' },
        { field: 'workflow', header: 'Stage', width: '10%' },
        { field: 'categoryDesc', header: 'Category', width: '10%' },
        { field: 'ideaAssignedTo', header: 'Assigned to', width: '10%' },
      ]
      this.printData.data = this.printData.data.map(row => {
        return row = {
          'ideaCode': row.ideaCode,
          'ideaName': row.ideaName,
          'ideaDescription': row.ideaDescription,
          'workflow': row.workflow.eclStage.eclStageDesc,
          'categoryDesc': row.categoryDesc,
          'ideaAssignedTo': row.ideaAssignedTo
        }
      })
    } else {
      this.stage = consts.ECL_PROVISIONAL_STAGE;
      this.printData.cols = [
        { field: 'ruleCode', header: 'Provisional Rule ID', width: '15%' },
        { field: 'ruleName', header: 'Provisional Rule Name', width: '25%' },
        { field: 'ruleDescription', header: 'Provisional Rule Description', width: '30%' },
        { field: 'reviewStatus', header: 'Review Status', width: '10%' },
        { field: 'categoryDesc', header: 'Category', width: '10%' },
        { field: 'ruleAssignedTo', header: 'Assigned to', width: '10%' }
      ]
      this.printData.data = this.printData.data.map(row => {
        return row = {
          'ruleCode': row.ruleCode,
          'ruleName': row.ruleName,
          'ruleDescription': row.ruleDescription,
          'reviewStatus': row.workflow.eclLookup.lookupDesc,
          'categoryDesc': row.categoryDesc,
          'ruleAssignedTo': row.ruleAssignedTo
        }
      })
    }
  }

}
