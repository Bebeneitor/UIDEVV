import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DrugService } from '../../services/drug.service';
import { MessageService } from 'primeng/api';
import { RoutingConstants } from "src/app/shared/models/routing-constants";
import { BaseResponse } from 'src/app/shared/models/base-response';
import { Constants } from '../../../../shared/models/constants';
import { Log } from '../../models/interfaces/log';
import { concatMap, tap } from 'rxjs/operators';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-add-drug',
  templateUrl: './add-drug.component.html',
  styleUrls: ['./add-drug.component.css']
})

export class AddDrugComponent implements OnInit {
  updateDrugUrl: string = RoutingConstants.baseUrl + '/' + RoutingConstants.updateDrug;
  addBiosimilarUrl: string = RoutingConstants.baseUrl + '/' + RoutingConstants.addNewBiosimilar;
  addDrugsUrl: string = RoutingConstants.baseUrl + '/' + RoutingConstants.addNewDrug;
  listDrugsUrl: string = RoutingConstants.baseUrl + '/' + RoutingConstants.listDrugs;
  baseUrl: string = RoutingConstants.baseUrl;
  currentUser:any;
  isEmpty: boolean = false;
  activity: any = '';
  cols = [];
  log: Log;
  drugsAdded = [];
  bioSimilarCols = [];
  comments: any;
  updateDrug: any;
  request: any;
  dailymed: any;
  drugfda: any;
  router: string;
  drugUpdate = [];
  addDrugs = [];
  addDrug = [{}];
  containers = [];
  actions = [];
  clickActions = [];
  index: any;
  actionsToDownload: any;
  checked: boolean = true;
  drugList = [];
  displayDialog: boolean;
  commentsDialog: boolean;
  hideTable: boolean = true;
  process: any = '';
  isDisabled: boolean = true;
  disableSimilar: boolean = true;
  biosimilarsAdded = [];
  compendiaName: string;
  biosimilarFlag: boolean = false;  
  constructor(private _router: Router, private drugService: DrugService, 
    private messageService: MessageService,
    private storageService:StorageService) {
    this.router = _router.url;
  }

  ngOnInit(): void {
    this.currentUser = this.storageService.get("userSession", true).userName;
    this.checked = true;
    let initializeDrugFields = {
      drugCode: '',
      drugName: '',
      alternatename: '',
      clinicalpharmaAvailability: '',
      micromedexAvailability: '',
      nccnAvailability: '',
      lexidrugAvailability: '',
      ahfsdiAvailability: '',
      lexipnAvailability: '',
      lcdlcaAvailability: '',
      clinicalpharmaSearchName: '',
      micromedexSearchName: '',
      nccnSearchName: '',
      lexidrugSearchName: '',
      ahfsdiSearchName: '',
      lexipnSearchName: '',
      lcdlcaSearchName: '',
    };

    this.updateDrug = initializeDrugFields;

    this.cols = this.drugService.addDrugCols;

    this.bioSimilarCols = this.drugService.bioSimilarCols;

    //Initializing table fields for adding drug
    this.addDrugs.push({
      drugData: this.updateDrug,
      showBrandTable: false,
      hassimilar: false,
      biosimilar: this.containers
    });

    this.isDisabled = false;
    this.disableSimilar = false;

    //populating table with drug values to be updated
    if (!!this.drugService.drug && this._router.url === this.updateDrugUrl) {
      this.addDrugs = [];
      this.updateDrug = this.drugService.drug;
      this.isDisabled = false;
      this.addDrugs = [
        {
          drugData:
          {
            drugCode: this.updateDrug.drugCode,
            drugName: this.updateDrug.drugName,
            alternateName: this.updateDrug.alternateName,
            clinicalpharmaAvailability: this.updateDrug.clinicalpharmaAvailability,
            micromedexAvailability: this.updateDrug.micromedexAvailability,
            nccnAvailability: this.updateDrug.nccnAvailability,
            lexidrugAvailability: this.updateDrug.lexidrugAvailability,
            ahfsdiAvailability: this.updateDrug.ahfsdiAvailability,
            lexipnAvailability: this.updateDrug.lexipnAvailability,
            lcdlcaAvailability: this.updateDrug.lcdlcaAvailability
          }
        }
      ];
      this.cols.forEach(item => {
        if (this.addDrugs[0].drugData[item.field] == Constants.DATA_ENABLED) {
          this.addDrugs[0].drugData[item.field] = true;
          this.compendiaName = item.field ? item.field.split('Availability')[0] : null;
          this.addDrugs[0].drugData[item.field + 'SearchName'] = this.updateDrug[this.compendiaName + 'searchName'];
        }
        else
          this.addDrugs[0].drugData[item.field] = false;
      });
    }

    //populating table with existing values for drug and its biosimilars and providing option to add new biosimilars
    else if (!!this.drugService.drug && (this._router.url === this.addBiosimilarUrl)) {
      this.addDrugs = [];
      this.drugService.drugSearch(this.drugService.drug).subscribe((res: BaseResponse) => {
        this.updateDrug = res.response;
        this.isDisabled = true;
        this.disableSimilar = true;
        this.addDrugs = [
          {
            drugData: {
              drugCode: this.updateDrug.drugCode,
              drugName: this.updateDrug.drugName,
              alternateName: this.updateDrug.alternateName
            },
            hassimilar: this.updateDrug.hasSimilar == Constants.DATA_ENABLED ? true : false,
            showBrandTable: false
          }
        ];
        if (this.addDrugs[0].hassimilar == true) {
          this.addDrugs[0].showBrandTable = true;
          this.updateDrug.bioSimilars.forEach(element => {
            this.containers.push({
              id: element.id,
              drugName: element.drugName,
              portal: element.portal,
              dailymedAvailability: element.dailyMed == Constants.DATA_ENABLED ? true : false,
              drugfdaAvailability: element.drugFda == Constants.DATA_ENABLED ? true : false,
              nccnName: element.nccnName,
              runStatus: element.runStatus,
              actionProcess: element.actionProcess,
              drugId: this.updateDrug.drugCode
            });
          });
          this.containers.push({
            id: '',
            drugName: '',
            portal: '',
            dailymedAvailability: '',
            drugfdaAvailability: '',
            nccName: '',
            runStatus: '',
            actionProcess: '',
            drugId: this.updateDrug.drugCode
          });
          this.addDrugs[0].biosimilar = this.containers;
        }
        else {
          this.addDrugs[0].showBrandTable = false;
        }
        this.cols.forEach(item => {
          const Obj = this.updateDrug.compendias.find(res => res.portal === item.header);
          if (!!Obj && Obj.status == Constants.DATA_ENABLED) {
            this.addDrugs[0].drugData[item.field] = true;
            this.addDrugs[0].drugData[item.field + 'SearchName'] = Obj.searchNames;
          }
          else {
            this.addDrugs[0].drugData[item.field] = false;
          }
        });
      });
    }
    else {

    }
  }

  /**
  * 
  Method to save new Biosimilars
  */
  addBiosimDetails() {
    let addBiosimilarstoDB = [];
    this.biosimilarsAdded = [];
    let drugDetails: any;
    this.drugService.drugSearch(this.updateDrug.drugCode).subscribe((res: BaseResponse) => {
      drugDetails = res.response;
      this.addDrugs[0].biosimilar.forEach(element => {
        if (!!element.drugName) {
          this.biosimilarsAdded.push(element.drugName);
          element['drugId'] = this.updateDrug.drugCode;
          element.runStatus = Constants.SWITCH_ON;
          const biosimObject = drugDetails.bioSimilars.find(res => res.drugName === element.drugName);
          if (!biosimObject && !!element.drugName) {
            let bioSimilar = element;
            bioSimilar['drugFda'] = element.drugfdaAvailability ? Constants.DATA_ENABLED : Constants.DATA_DISABLED;
            bioSimilar['dailyMed'] = element.dailymedAvailability ? Constants.DATA_ENABLED : Constants.DATA_DISABLED;
            addBiosimilarstoDB.push(bioSimilar);
          }
        }
      });
      if (addBiosimilarstoDB && addBiosimilarstoDB.length > 0) {
        this.drugService.addBiosimilars(addBiosimilarstoDB).pipe(
          tap(confirmationResult => {
            if (confirmationResult.status == 200) {
              this.messageService.add({ severity: Constants.TOAST_SEVERITY_INFO, summary: Constants.TOAST_SUMMARY_INFO, detail: confirmationResult.message });
              this.log = {
                userName: this.currentUser,
                date: new Date(),
                activity: confirmationResult.message,
                comments: ''
              };
              return confirmationResult;
            }
            else {
              this.messageService.add({ severity: Constants.TOAST_SEVERITY_INFO, summary: Constants.TOAST_SUMMARY_INFO, detail: confirmationResult.message });
            }
          }),
          concatMap(confirmationResult => this.drugService.saveAuditLog(this.log)))
          .subscribe();
      }
      else {
        this.isEmpty = true;
        this.messageService.add({ severity: Constants.TOAST_SEVERITY_INFO, summary: Constants.TOAST_SUMMARY_INFO, detail: 'Please add mandatory fields' });
      }
    });
  }

  addComments() {
    this.commentsDialog = true;
    this.comments = '';
  }

  updateComments() {
    this.commentsDialog = false;
    this.updateDrugDetails();
  }

  /**
  * 
  Method to save the changes to the existing drug
  */
  updateDrugDetails() {
    let requestObj = [];
    let drugSearched: any;
    this.drugService.getDrugById(this.updateDrug.id).subscribe((res: BaseResponse) => {
      drugSearched = res.response;

      if (!!drugSearched) {
        this.cols.forEach(item => {
          requestObj.push({
            item: drugSearched.compendias.find(result => result.portal.toLowerCase() == item.header.toLowerCase()),
            value: this.addDrugs[0].drugData[item.field],
            searchNames: this.addDrugs[0].drugData[item.field + 'SearchName']
          });
        });
      }
      this.updateDrugDetailstoDB(requestObj, drugSearched);
    });
  }

  updateDrugDetailstoDB(requestObj, drugSearched) {
    if (!!requestObj) {
      requestObj.forEach(element => {
        if (element.value == true) {
          element.item.status = Constants.DATA_ENABLED;
          element.item.searchNames = element.searchNames;
        }
        else {
          element.item.status = Constants.DATA_DISABLED;
        }
      });
      if (drugSearched.drugCode != this.addDrugs[0].drugData.drugCode || drugSearched.drugName != this.addDrugs[0].drugData.drugName ||
        drugSearched.alternateName != this.addDrugs[0].drugData.alternateName) {
        drugSearched.drugCode = this.addDrugs[0].drugData.drugCode;
        drugSearched.drugName = this.addDrugs[0].drugData.drugName;
        drugSearched.alternateName = this.addDrugs[0].drugData.alternateName;

        if (!!drugSearched.compendia) {
          drugSearched.compendia.forEach(element => {
            element.drugId = this.addDrugs[0].drugData.drugCode;
          });
        }
        if (!!drugSearched.bioSimilar) {
          drugSearched.bioSimilar.forEach(element => {
            element.drugId = this.addDrugs[0].drugData.drugCode;
          });
        }
      }

      this.drugService.updateRunStatus(drugSearched).pipe(
        tap(confirmationResult => {
          if (confirmationResult.status == 200) {
            this.messageService.add({ severity: Constants.TOAST_SEVERITY_INFO, summary: Constants.TOAST_SUMMARY_INFO, detail: confirmationResult.message });
            this.log = {
              userName: this.currentUser,
              date: new Date(),
              activity: 'Updated the drug details for the drug ' + drugSearched.drugName,
              comments: ''
            };
            return confirmationResult;
          }
          else {
            this.messageService.add({ severity: Constants.TOAST_SEVERITY_INFO, summary: Constants.TOAST_SUMMARY_INFO, detail: confirmationResult.message });
          }
        }),
        concatMap(confirmationResult => this.drugService.saveAuditLog(this.log)))
        .subscribe();
    }
  }

  hasSimilars(hassimilar, tableNo, obj) {
    this.containers = [];
    if (hassimilar == true) {
      obj.showBrandTable = true;
      obj.biosimilar = [];
      obj.biosimilar.push({
        drugName: '',
        portal: '',
        revisionDate: '',
        runStatus: Constants.SWITCH_ON,
        nccnName: '',
        drugfda: '',
        dailymed: '',
        actionProcess: this.process
      });
    }
    else {
      obj.showBrandTable = false;
    }
  }

  /**
  * 
  Method to save new drugs
  */
  addDrugDetails() {
    let requestObj = [];
    let status: any;
    this.drugsAdded = [];
    if (!this.drugList || this.drugList && this.drugList.length === 0) {
      if (!!this.addDrugs && this.addDrugs.length) {
        this.addDrugs.forEach(element => {
          if (!!element.drugData.drugCode && !!element.drugData.drugName)
            this.drugList.push(element);
        });
      }
    }

    this.drugList.forEach(drug => {
      let bioSimilars = [];
      let compendia = [];
      let drugData = drug.drugData;
      let drugBiosimilars = drug.biosimilar;
      if (!!drugData.drugCode && !!drugData.drugName) {
        drugBiosimilars.forEach(element => {
          if (!!element.drugName) {
            this.biosimilarFlag = true;
            let biosimObj = element;
            biosimObj.drugFda = element.drugfdaAvailability ? Constants.DATA_ENABLED : Constants.DATA_DISABLED;
            biosimObj.dailyMed = element.dailymedAvailability ? Constants.DATA_ENABLED : Constants.DATA_DISABLED;
            bioSimilars.push(biosimObj);
          }
        });
        this.drugsAdded.push(drugData.drugName);
        let hasSimilar = drug.hassimilar == true ? Constants.DATA_ENABLED : Constants.DATA_DISABLED;
        this.cols.forEach(item => {
          let portal = item.header;
          let runStatus = Constants.SWITCH_ON;
          let drugId = drugData.drugCode;
          let availabilitystatus = drugData[item.field];
          let searchName: any;
          if (!!availabilitystatus) {
            status = availabilitystatus == true ? Constants.DATA_ENABLED : Constants.DATA_DISABLED;
            if (status == Constants.DATA_ENABLED)
              searchName = drugData[item.field + 'SearchName'];
          }
          else {
            status = Constants.DATA_DISABLED;
          }
          compendia.push({ portal: portal, status: status, runStatus: runStatus, drugId: drugId, searchNames: searchName });

        });
        const Obj = {
          drugCode: drugData.drugCode,
          drugName: drugData.drugName,
          alternateName: drugData.alternateName,
          hasSimilar: hasSimilar,
          runStatus: Constants.SWITCH_ON,
          bioSimilars: bioSimilars,
          compendias: compendia
        };
        requestObj.push(Obj);
      }
    });
    if (!!requestObj && requestObj.length && this.biosimilarFlag) {
      this.drugService.addDrug(requestObj).pipe(
        tap(confirmationResult => {
          if (confirmationResult.status == 200) {
            this.messageService.add({ severity: Constants.TOAST_SEVERITY_INFO, summary: Constants.TOAST_SUMMARY_INFO, detail: confirmationResult.message });
            this.log = {
              userName: this.currentUser,
              date: new Date(),
              activity: confirmationResult.message,
              comments: ''
            };
            return confirmationResult;
          }
          else {
            this.messageService.add({ severity: Constants.TOAST_SEVERITY_INFO, summary: Constants.TOAST_SUMMARY_INFO, detail: confirmationResult.message });
          }
        }),
        concatMap(confirmationResult => this.drugService.saveAuditLog(this.log)))
        .subscribe();
    }
    else {
      this.messageService.add({ severity: Constants.TOAST_SEVERITY_INFO, summary: Constants.TOAST_SUMMARY_INFO, detail: 'Please fill out the mandatory fields' });
      this.isEmpty = true;
    }
  }

  add(drug) {
    drug.push({
      drugName: '',
      portal: '',
      runStatus: Constants.SWITCH_ON,
      drugfdaAvailability: '',
      dailymedAvailability: '',
      nccnName: '',
      actionProcess: '',
    });
  }

  remove(biosim, i) {
    let biosimilarDrugName = biosim[i].drugName;
    biosim.splice(i, 1);
    this.drugService.deleteBiosimilarDrug(biosimilarDrugName);
  }

  addActionsTable(i, biosim) {
    this.index = i;
    this.actionsToDownload = biosim;
    this.actions = [];
    this.displayDialog = true;
    this.clickActions = [{ label: "Click on", value: "Click On" }];
    this.actions.push({
      action: '',
      process: ''
    });
  }

  addaction() {
    this.actions.push({
      action: '',
      process: ''
    });
  }

  removeaction(i) {
    this.actions.splice(i, 1);
  }

  close() {
    this.displayDialog = false;
    let action = [];
    if (!!this.actions) {
      this.actions.forEach(item => {
        if (item.action != '' || item.process != '')
          action.push(item.action + ' ' + item.process);
      });
      let actionsObj = action;
      this.process = actionsObj.join(" | ");
      this.actionsToDownload.actionProcess = this.process;
    }
  }

  /**
  * 
  Method to capture data in case of multiple drugs being added
  */
  addMultipleDrugs() {
    this.updateDrug = {
      drugCode: '',
      drugName: '',
      alternateName: '',
      clinicalpharmaAvailability: '',
      micromedexAvailability: '',
      nccnAvailability: '',
      lexidrugAvailability: '',
      ahfsdiAvailability: '',
      lcdlcaAvailability: ''
    };
    this.process = '';
    this.containers.push({
      drugName: '',
      portal: '',
      runStatus: Constants.SWITCH_ON,
      dailymedAvailability: '',
      drugfdaAvailability: '',
      nccName: '',
      actionProcess: this.process
    });
    this.addDrugs.push({
      drugData: this.updateDrug,
      showBrandTable: false,
      hassimilar: false,
      biosimilar: this.containers
    });
    this.drugList = this.addDrugs;
  }

  removeDrugs(j) {
    this.addDrugs.splice(j, 1);
    this.drugList = this.addDrugs;
  }

  cancelBiosimDetails() {
    this.drugService.searchedDrugCode = this.drugService.drug;
    this._router.navigate([this.baseUrl]);
  }

  cancelAddDrugDetails() {
    this._router.navigate([this.listDrugsUrl]);
  }

  cancelUpdateDrug() {
    this._router.navigate([this.listDrugsUrl]);
  }
}

