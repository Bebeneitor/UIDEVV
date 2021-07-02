import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService, Message } from 'primeng/api';
import { UtilsService } from 'src/app/services/utils.service';
import { SavingsService } from 'src/app/services/savings.service'
import { AppUtils } from 'src/app/shared/services/utils';
import { SavingsResponse } from 'src/app/shared/models/savings-response';
import { SavingsRequest } from 'src/app/shared/models/savings-request';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { interval } from 'rxjs';

const ENABLE: string = "enable";
const DISABLE: string = "disable";
const SOURCE: string = "source";
const TARGET: string = "target";

@Component({
  selector: 'app-savings-for-rules',
  templateUrl: './savings-for-rules.component.html',
  styleUrls: ['./savings-for-rules.component.css']
})

export class SavingsForRulesComponent implements OnInit {

  loadingData: boolean = false;
  radioEngine: number = 0;
  availableFields: any[] = [];
  selectedFields: any[] = [];
  fieldOptions: any = [];
  selectedFieldOptions: any = null;
  selectedMonths: Date = null;
  disabledRadioEngines: boolean = false;
  disabledGenerate: boolean = true;
  disabledAddReport: boolean = true;
  engines: any = [];
  userId: number = 0;
  engineName: string = "";
  savingReports: any[] = [];
  progressValue: number = 0;
  currentDate: string = "";
  firstField: string = "";
  secondField: string = "";
  calendarYear: number = new Date().getUTCFullYear();
  disableMonthsFunction: Function;
  savingsMessage: boolean = false;
  savingsRequestCPE: SavingsRequest = new SavingsRequest();

  constructor(private savingService: SavingsService, private messageService: MessageService, private util: UtilsService,
    private appUtils: AppUtils, private confirmationService: ConfirmationService) {
    this.savingsRequestCPE.ruleEngine = "CPE";
  }

  ngOnInit() {
    setTimeout(this.disableButtons, 50);
    this.disableMonthsFunction = this.disableMonths;
    let todayDate = new Date();
    let dateLongFormat = (todayDate.getMonth() + 1).toString() + " " + todayDate.getDate().toString()
      + " " + todayDate.getFullYear().toString();
    this.currentDate = new Date(dateLongFormat).toString().substring(0, 15);
    this.userId = this.appUtils.getLoggedUserId();
    this.getAllRuleEnginesValues();
  }

  getAllRuleEnginesValues(): void {
    this.util.getAllRuleEngines().subscribe((response: any) => {
      let ruleEngines = response.data;
      ruleEngines.forEach((ruleEngine: any) => {
        if (ruleEngine.shortDesc == "ICMS" || ruleEngine.shortDesc == "CVP" || ruleEngine.shortDesc == "RPE") {
          this.engines.push({
            "label": ruleEngine.id == 4 ? "CPE" : ruleEngine.shortDesc,
            "value": ruleEngine.id
          });
        }
      });
      this.engines = this.engines.sort((engine1: any, engine2: any) => {
        return engine1.value > engine2.value ? 1 : engine1.value < engine2.value ? -1 : 0;
      });
    });
    this.loadingData = true;
  }

  disableButtons(): void {
    let elements = document.querySelectorAll(".ui-picklist-buttons button");
    for (let index = 0; index < elements.length; index++) {
      elements[index].setAttribute('disabled', 'true');
    }
  }

  private initializeEngineFields(engineId: number) {
    switch (engineId) {
      case 2:
        this.fieldOptions = {
          clients: [],
          rules: [],
          payers: [],
          payersShort: []
        }
        this.selectedFieldOptions = {
          clients: [],
          rules: [],
          payers: [],
          payersShort: []
        }
        break;
      case 3:
        this.fieldOptions = {
          months: [],
          clients: [],
          payersShort: [],
          rules: [],
          groups: []
        }
        this.selectedFieldOptions = {
          months: [],
          clients: [],
          payersShort: [],
          rules: [],
          groups: []
        }
        break;
      case 4:
        this.fieldOptions = {
          months: [],
          platforms: [],
          clients: [],
          payersShort: [],
          groups: [],
          flags: []
        }
        this.selectedFieldOptions = {
          months: [],
          platforms: [],
          clients: [],
          payersShort: [],
          groups: [],
          flags: []
        }
    }
  }

  private changeStatusOrderOrMoveButton(container: string, icon: string, status: string) {
    let selectors: string = container != null ? ".ui-picklist-" + container + "-controls" : "";
    selectors += ".ui-picklist-buttons button[icon=\"" + icon + "\"]";
    if (status === ENABLE) {
      document.querySelector(selectors).removeAttribute('disabled');
    } else if (status == DISABLE) {
      document.querySelector(selectors).setAttribute('disabled', 'true');
    }
  }

  getAvailableFields(engineId: number): void {
    this.initializeEngineFields(engineId);
    switch (engineId) {
      case 2:
        this.availableFields = [
          this.createJsonField('Client', 'client', 'multiselect', "clients", 'Select Clients', 'Search Client'),
          this.createJsonField('ICMS Rule ID', 'rule-id', 'multiselect', "rules", 'Select ICMS IDs', 'Search ICMS ID'),
          this.createJsonField('Payer', 'payer-name', 'multiselect', "payers", 'Select Payers', 'Search Payer'),
          this.createJsonField('Payer Short', 'payer', 'multiselect', "payersShort", 'Select Payer Shorts', 'Search Payer Short')
        ];
        break;
      case 3:
        this.availableFields = [
          this.createJsonField('Date', 'date', 'calendar', 'months', null, 'Select Date'),
          this.createJsonField('Client', 'client', 'multiselect', "clients", 'Select Clients', 'Search Client'),
          this.createJsonField('Payer Short', 'payer', 'multiselect', "payersShort", 'Select Payer Shorts', 'Search Payer Shorts'),
          this.createJsonField('CVP Rule ID', 'rule-id', 'multiselect', "rules", 'Select CVP IDs', 'Search CVP ID'),
          this.createJsonField('Group ID', 'group-id', 'multiselect', "groups", 'Select Group Ids', 'Search Group Ids'),
        ];
        break;
      case 4:
        this.availableFields = [
          this.createJsonField('Date', 'date', 'calendar', 'months', null, 'Select Date'),
          this.createJsonField('Client Platform', 'client-platform', 'multiselect', "platforms", 'Select Platforms', 'Search Platform'),
          this.createJsonField('Client', 'client', 'multiselect', "clients", 'Select Clients', 'Search Client'),
          this.createJsonField('Payer Short', 'payer-short-name', 'multiselect', "payersShort", 'Select Payer Shorts', 'Search Payer Shorts'),
          this.createJsonField('Group ID', 'group-id', 'multiselect', "groups", 'Select Group Ids', 'Search Group Ids'),
          this.createJsonField('Edit Flag', 'edit-flag', 'multiselect', "flags", 'Select Edit Flags', 'Search Edit Flags')
        ];
    }
    this.changeStatusOrderOrMoveButton(null, "pi pi-angle-double-right", ENABLE);
    for (let engine of this.engines) {
      if (engine.value == this.radioEngine) {
        this.engineName = this.radioEngine == 4 ? "CPE" : engine.label;
      }
    }
    this.disabledRadioEngines = true;
    this.loadingData = false;
    setTimeout(() => { this.loadingData = true; }, 50);
  }

  private createJsonField(label: string, value: string, fieldType: string, optionsName: string, defaultLabel: string,
    filterPlaceHolder: string): any {
    return {
      label: label,
      value: value,
      fieldType: fieldType,
      options: this.fieldOptions[optionsName],
      optionsName: optionsName,
      ngModel: this.selectedFieldOptions[optionsName],
      defaultLabel: defaultLabel,
      filterPlaceHolder: filterPlaceHolder,
      hidden: true
    }
  }

  private autoWidth() {
    setTimeout(() => {
      let elements = document.querySelectorAll(".engine-item");
      elements.forEach((element: any) => {
        switch (this.radioEngine) {
          case 2:
            if (!element.classList.contains("col-3")) {
              element.classList.add("col-3");
            }
            break;
          case 3:
            if (!element.classList.contains("col-2") && element.textContent != "ClientSelect Clients") {
              element.classList.add("col-2");
            }
            if (!element.classList.contains("col-3") && element.textContent == "ClientSelect Clients") {
              element.classList.add("col-3");
            }
            break;
          case 4:
            if (!element.classList.contains("col-2") && (element.textContent.includes("Client Platform") ||
              element.textContent.includes("Group ID")) &&
              !element.textContent.includes("Payer Short") && !element.textContent.includes("Edit Flag")) {
              element.classList.add("col-2");
            }
            if (!element.classList.contains("col-2-5") && element.textContent.includes("Client") &&
              !element.textContent.includes("Client Platform")) {
              element.classList.add("col-2-5");
            }
            if (!element.classList.contains("col-1-5") && (element.textContent.includes("Payer Short")
              || element.textContent.includes("Edit Flag"))) {
              element.classList.add("col-1-5");
            }
        }
      });
    }, 50);
  }

  disableMonths(fieldIndex: number): any {
    var self = this;
    setTimeout(() => {
      let elements = document.querySelectorAll(".ui-monthpicker-month");
      elements.forEach((element: any) => {
        element.classList.add("ui-state-disabled");
        element.addEventListener('click', function (event) {
          self.onSelectCalendarMonth(fieldIndex);
        });
      });
      this.enableMonthsInRange(elements);
      document.querySelector(".ui-datepicker-prev-icon").addEventListener('click', function (event) {
        setTimeout(() => { self.calendarYear = parseInt(document.querySelector(".ui-datepicker-year").textContent); }, 10);
        self.disableMonthsFunction();
      });
      document.querySelector(".ui-datepicker-next-icon").addEventListener('click', function (event) {
        setTimeout(() => { self.calendarYear = parseInt(document.querySelector(".ui-datepicker-year").textContent); }, 10);
        self.disableMonthsFunction();
      });
    }, 20);
  }

  enableMonthsInRange(elements: any) {
    this.fieldOptions.months.forEach((date: any) => {
      let monthDate: Date = new Date(date.value + "-02");
      let year: number = monthDate.getFullYear();
      let month: number = monthDate.getMonth();
      if (this.calendarYear == year) {
        elements[month].classList.remove("ui-state-disabled");
      }
    });
  }

  onSelectItem(container: string, selectedItems: any[]) {
    if (container == SOURCE) {
      this.enableDisableOrderButtons(SOURCE, selectedItems);
      this.changeStatusOrderOrMoveButton(null, "pi pi-angle-right", ENABLE);
      this.changeStatusOrderOrMoveButton(null, "pi pi-angle-double-right", ENABLE);
      this.changeStatusOrderOrMoveButton(null, "pi pi-angle-left", DISABLE);
      this.changeStatusOrderOrMoveButton(null, "pi pi-angle-double-left", DISABLE);
    } else if (container == TARGET) {
      this.enableDisableOrderButtons(TARGET, selectedItems)
      this.changeStatusOrderOrMoveButton(null, "pi pi-angle-right", DISABLE);
      this.changeStatusOrderOrMoveButton(null, "pi pi-angle-double-right", DISABLE);
      this.changeStatusOrderOrMoveButton(null, "pi pi-angle-left", ENABLE);
      this.changeStatusOrderOrMoveButton(null, "pi pi-angle-double-left", ENABLE);
    }
  }

  private enableDisableOrderButtons(container: string, selectedItems: any[]) {
    let containerFields: string[] = [];
    switch (container) {
      case SOURCE:
        containerFields = this.availableFields;
        break;
      case TARGET:
        containerFields = this.selectedFields;
    }
    if (containerFields[0] == selectedItems[0]) {
      this.changeStatusOrderOrMoveButton(container, "pi pi-angle-up", DISABLE);
      this.changeStatusOrderOrMoveButton(container, "pi pi-angle-double-up", DISABLE);
      this.changeStatusOrderOrMoveButton(container, "pi pi-angle-down", containerFields.length == 1 ? DISABLE : ENABLE);
      this.changeStatusOrderOrMoveButton(container, "pi pi-angle-double-down", containerFields.length == 1 ? DISABLE : ENABLE);
    } else if (containerFields[containerFields.length - 1] == selectedItems[selectedItems.length - 1]) {
      this.changeStatusOrderOrMoveButton(container, "pi pi-angle-up", ENABLE);
      this.changeStatusOrderOrMoveButton(container, "pi pi-angle-double-up", ENABLE);
      this.changeStatusOrderOrMoveButton(container, "pi pi-angle-down", DISABLE);
      this.changeStatusOrderOrMoveButton(container, "pi pi-angle-double-down", DISABLE);
    } else {
      this.changeStatusOrderOrMoveButton(container, "pi pi-angle-up", ENABLE);
      this.changeStatusOrderOrMoveButton(container, "pi pi-angle-double-up", ENABLE);
      this.changeStatusOrderOrMoveButton(container, "pi pi-angle-down", ENABLE);
      this.changeStatusOrderOrMoveButton(container, "pi pi-angle-double-down", ENABLE);
    }
  }

  changeOrderAndMoveButtons(action: string, items: any[]): void {
    let container: string = "";
    if (this.radioEngine != 4) {
      switch (action) {
        case "moveToTarget":
          container = TARGET;
          if (this.firstField == "") {
            this.fillFirstFieldOptions();
          } else if (!this.disabledAddReport) {
            let firstField = this.selectedFields[this.selectedFields.length - 2];
            this.firstField = firstField.value;
            let secondField = this.selectedFields[this.selectedFields.length - 1];
            this.selectedFields[this.selectedFields.length - 1].hidden = false;
            this.secondField = secondField.value;
            this.fillSecondFieldOptions(firstField.optionsName, secondField.optionsName);
            this.enableDisableAddReport();
          }
          this.changeStatusOrderOrMoveButton(null, "pi pi-angle-right", DISABLE);
          break;
        case "moveToSource":
          container = SOURCE;
          items.forEach((item: any) => {
            this.fieldOptions[item.label] = [];
            this.onSelectFieldOption[item.label] = [];
            item.hidden = true;
          });
          this.firstField = this.selectedFields.length > 0 ? this.selectedFields[this.selectedFields.length - 1].value : "";
          this.enableDisableAddReport();
          this.changeStatusOrderOrMoveButton(null, "pi pi-angle-left", DISABLE);
      }
    } else {
      switch (action) {
        case "moveToTarget":
          container = TARGET;
          this.changeStatusOrderOrMoveButton(null, "pi pi-angle-right", DISABLE);
          break;
        case "moveToSource":
          container = SOURCE;
          this.changeStatusOrderOrMoveButton(null, "pi pi-angle-left", DISABLE);
      }
      if (this.firstField == "") {
        this.fillCPEOptions();
      }
      if (this.selectedFields.length == 0) {
        this.firstField = "";
      }
    }
    this.changeStatusOrderOrMoveButton(container, "pi pi-angle-up", DISABLE);
    this.changeStatusOrderOrMoveButton(container, "pi pi-angle-double-up", DISABLE);
    this.changeStatusOrderOrMoveButton(container, "pi pi-angle-down", DISABLE);
    this.changeStatusOrderOrMoveButton(container, "pi pi-angle-double-down", DISABLE);
    this.changeStatusOrderOrMoveButton(null, "pi pi-angle-double-right", this.availableFields.length > 0 ? ENABLE : DISABLE);
    this.changeStatusOrderOrMoveButton(null, "pi pi-angle-double-left", this.selectedFields.length > 0 ? ENABLE : DISABLE);
  }

  fillCPEOptions() {
    let optionsName: string;
    this.selectedFields.forEach((field: any, index: number) => {
      if (this.selectedFieldOptions[field.optionsName].length > 0 && index != (this.selectedFields.length - 1)) {
        if (this.firstField == "") {
          this.selectedFields[index].hidden = false;
        } else {
          this.selectedFields[index + 1].hidden = false;
        }
        optionsName = this.firstField == "" ? field.optionsName : this.selectedFields[index + 1].optionsName;
        this.firstField = this.selectedFields[index + 1].value;
      } else if (index == 0) {
        this.selectedFields[index].hidden = false;
        optionsName = field.optionsName;
        this.firstField = field.value;
      }
    });
    this.savingService.getCPEData(this.firstField, this.savingsRequestCPE).subscribe((response: SavingsResponse) => {
      let fieldValues: any[] = [];
      switch (this.firstField) {
        case "date":
          fieldValues = response.dateRange;
          break;
        case "client-platform":
          fieldValues = response.clientPlatforms;
          break;
        case "client":
          let cpeClients: any = [];
          let clientNames = new Set();
          response.clientResponseList.forEach((clientResponse: any) => {
            clientNames.add(clientResponse.client.split("-")[0]);
          });
          cpeClients = Array.from(clientNames.values());
          cpeClients.forEach((cpeClient: string) => {
            let clientIds: string[] = [];
            response.clientResponseList.forEach((clientResponse: any) => {
              if (cpeClient === clientResponse.client.split("-")[0]) {
                clientIds.push(clientResponse.clientId);
              }
            });
            fieldValues.push({ clientName: cpeClient, clientIds: clientIds });
          });
          break;
        case "payer-short-name":
          fieldValues = response.payerResponseList;
          break;
        case "group-id":
          fieldValues = response.groupIds;
          break;
        case "edit-flag":
          fieldValues = response.editFlags;
      }
      this.fieldOptions[optionsName].length = 0;
      fieldValues.forEach((fieldValue: any) => {
        let label: string;
        let value: string;
        if (this.firstField == "client") {
          label = fieldValue.clientName;
          value = fieldValue.clientIds;
        } else if (this.firstField == "payer-short-name") {
          label = fieldValue.payerShortName;
          value = fieldValue.payerId;
        } else {
          label = fieldValue;
          value = fieldValue;
        }
        this.fieldOptions[optionsName].push({ label: label, value: value });
      });
    });
    this.autoWidth();
  }

  fillFirstFieldOptions() {
    this.firstField = this.selectedFields[0].value;
    this.selectedFields[0].hidden = false;
    if (this.firstField == "payer-name") {
      this.savingService.getICMSPayerNames(this.firstField, null, null).subscribe((values: string[]) => {
        values.forEach((value: string) => {
          this.fieldOptions[this.selectedFields[0].optionsName].push({ label: value, value: value });
        });
      });
    } else {
      this.savingService.getFirstFieldValues(this.engineName, this.firstField).subscribe((response: SavingsResponse) => {
        this.getFieldValues(this.engineName, this.firstField, response).forEach((value: any) => {
          this.fieldOptions[this.selectedFields[0].optionsName].push(this.generateJSONFieldOption(this.engineName, this.firstField, value));
        });
      });
    }
    this.autoWidth();
  }

  onSelectFieldOption(event: any, index: number, optionsName: string) {
    this.selectedFieldOptions[optionsName] = event.value;
    if (this.radioEngine != 4) {
      if (this.selectedFieldOptions[optionsName].length > 0) {
        if (index != (this.selectedFields.length - 1)) {
          this.firstField = this.selectedFields[index].value;
          this.selectedFields.forEach((field: any, index: number) => {
            if (this.selectedFieldOptions[field.optionsName].length > 0 && index != (this.selectedFields.length - 1)) {
              this.selectedFields[index + 1].hidden = false;
              this.secondField = this.selectedFields[index + 1].value;
            }
          });
          this.fillSecondFieldOptions(this.selectedFields[index].optionsName, this.selectedFields[index + 1].optionsName);
        }
      } else {
        this.selectedFields.forEach((field: any, fieldIndex: number) => {
          if (fieldIndex > index) {
            field.hidden = true;
            for (let i = 0; i < this.selectedFieldOptions[field.optionsName].length; i++) {
              this.selectedFieldOptions[field.optionsName].pop();
            }
          }
        });
      }
    } else {
      switch (optionsName) {
        case "platforms":
          this.savingsRequestCPE.clientPlatforms = event.value;
          break;
        case "clients":
          let allClientIds = new Set();
          event.value.forEach((values: any[]) => {
            values.forEach((value: number) => {
              allClientIds.add(value);
            });
          });
          this.savingsRequestCPE.clientIds = Array.from(allClientIds.values());
          break;
        case "payersShort":
          this.savingsRequestCPE.payerIds = event.value;
          break;
        case "groups":
          this.savingsRequestCPE.groupIds = event.value;
          break;
        case "flags":
          this.savingsRequestCPE.editFlags = event.value;
      }
      this.clearSelectedOptions(index);
      if (event.value.length > 0) {
        if (index != (this.selectedFields.length - 1)) {
          setTimeout(() => {
            this.firstField = this.selectedFields[index + 1].value;
            this.fillCPEOptions();
          }, 20);
        }
      }
    }
    this.enableDisableAddReport();
  }

  onSelectCalendarMonth(fieldIndex: number) {
    if (this.selectedMonths != null) {
      this.firstField = "date";
      let months: string[] = JSON.parse(JSON.stringify(this.selectedMonths));
      this.selectedFieldOptions.months = months.map((month: string) => month.substring(0, 7));
      if (fieldIndex != this.selectedFields.length - 1) {
        this.clearSelectedOptions(fieldIndex);
        if (this.radioEngine != 4) {
          if (this.selectedFieldOptions.months.length > 0) {
            this.secondField = this.selectedFields[fieldIndex + 1].value;
            this.selectedFields[fieldIndex + 1].hidden = false;
            this.fillSecondFieldOptions("months", this.selectedFields[fieldIndex + 1].optionsName);
          }
        } else {
          this.savingsRequestCPE.dateRange = this.selectedFieldOptions.months;
          if (this.savingsRequestCPE.dateRange.length > 0) {
            if (fieldIndex != (this.selectedFields.length - 1)) {
              setTimeout(() => {
                this.firstField = this.selectedFields[fieldIndex + 1].value;
                this.fillCPEOptions();
              }, 10);
            }
          }
        }
      }
      if (Array.isArray(this.selectedMonths) && this.selectedMonths.length == 0) {
        this.selectedMonths = null;
      }
      this.enableDisableAddReport();
    }
  }

  clearSelectedOptions(index: number) {
    this.selectedFields.forEach((field: any, fieldIndex: number) => {
      if (index < fieldIndex) {
        field.hidden = true;
        this.selectedFieldOptions[field.optionsName].length = 0;
        switch (field.optionsName) {
          case "months":
            this.savingsRequestCPE.dateRange.length = 0;
            this.selectedMonths = null;
            break;
          case "platforms":
            this.savingsRequestCPE.clientPlatforms.length = 0;
            break;
          case "clients":
            this.savingsRequestCPE.clientIds.length = 0;
            break;
          case "payersShort":
            this.savingsRequestCPE.payerIds.length = 0;
            break;
          case "groups":
            this.savingsRequestCPE.groupIds.length = 0;
            break;
          case "flags":
            this.savingsRequestCPE.editFlags.length = 0;
        }
      }
    });
  }

  fillSecondFieldOptions(firstOptionsName: string, secondOptionsName: string) {
    let selectedFirstFieldValues: any[] = this.selectedFieldOptions[firstOptionsName];
    if (this.firstField == "payer-name" || this.secondField == "payer-name" || (this.firstField == "payer-name" && this.secondField == "payer")) {
      this.savingService.getICMSPayerNames(this.firstField, this.secondField, selectedFirstFieldValues).subscribe((values: string[]) => {
        this.fieldOptions[firstOptionsName] = this.secondField != this.firstField ? this.fieldOptions[firstOptionsName] : [];
        this.cleanSelectedOptions(secondOptionsName);
        values.forEach((value: string) => {
          this.fieldOptions[secondOptionsName].push({ label: value, value: value });
        });
      });
    } else {
      let savingsRequest: SavingsRequest = new SavingsRequest();
      savingsRequest.ruleEngine = this.engineName;
      switch (this.firstField) {
        case "date":
          savingsRequest.dateRange = selectedFirstFieldValues;
          break;
        case "client":
          switch (this.engineName) {
            case "ICMS":
              savingsRequest.clientNames = selectedFirstFieldValues;
              break;
            case "CVP":
              savingsRequest.clientIds = selectedFirstFieldValues;
          }
          break;
        case "rule-id":
          savingsRequest.ruleIds = selectedFirstFieldValues;
          break;
        case "payer":
          switch (this.engineName) {
            case "ICMS":
              savingsRequest.payerShortNames = selectedFirstFieldValues;
              break;
            case "CVP":
              savingsRequest.payerIds = selectedFirstFieldValues;
          }
          break;
        case "group-id":
          savingsRequest.groupIds = selectedFirstFieldValues;
      }
      this.savingService.getSecondFieldValues(this.firstField, this.secondField, savingsRequest).subscribe((response: SavingsResponse) => {
        this.fieldOptions[firstOptionsName] = this.secondField != this.firstField ? this.fieldOptions[firstOptionsName] : [];
        this.cleanSelectedOptions(secondOptionsName);
        this.getFieldValues(this.engineName, this.secondField, response).forEach((value: any) => {
          this.fieldOptions[secondOptionsName].push(this.generateJSONFieldOption(this.engineName, this.secondField, value));
        });
      });
    }
    this.autoWidth();
  }

  cleanSelectedOptions(optionsName: string) {
    this.fieldOptions[optionsName].length = 0;
    this.selectedFieldOptions[optionsName].length = 0;
  }

  private getFieldValues(engineName: string, field: string, response: SavingsResponse): any[] {
    let values: any[] = [];
    switch (field) {
      case "date":
        values = response.dateRange;
        break;
      case "client":
        switch (engineName) {
          case "ICMS":
            values = response.clients;
            break;
          case "CVP":
            values = response.clientResponseList;
        }
        break;
      case "rule-id":
        switch (engineName) {
          case "ICMS":
            values = response.icmsIds;
            break;
          case "CVP":
            values = response.cvpRuleIds;
        }
        break;
      case "payer":
        switch (engineName) {
          case "ICMS":
            values = response.payerShortNames;
            break;
          case "CVP":
            values = response.payerResponseList;
        }
        break;
      case "group-id":
        values = response.groupIds;
    }
    return values;
  }

  private generateJSONFieldOption(engineName: string, fieldName: string, fieldValue: any): any {
    let label: string = null;
    let value: any = null;
    switch (fieldName) {
      case "client":
        label = engineName == "CVP" ? fieldValue.client : fieldValue;
        value = engineName == "CVP" ? fieldValue.clientId : fieldValue;
        break;
      case "payer":
        label = engineName == "CVP" ? fieldValue.payerShortName : fieldValue;
        value = engineName == "CVP" ? fieldValue.payerId : fieldValue;
        break;
      default:
        label = fieldValue;
        value = fieldValue;
    }
    return { label: label, value: value };
  }

  enableDisableAddReport(): void {
    let lastField = this.selectedFields[this.selectedFields.length - 1];
    this.disabledAddReport = !(this.selectedFieldOptions[lastField.optionsName].length > 0);
  }

  refreshReports() {
    let savingReports = sessionStorage.getItem('savingReports');
    if (savingReports != null) {
      this.savingReports = JSON.parse(savingReports);
      this.savingReports.forEach((report: any) => {
        report.progress = 100;
        report.notGenerated = false;
      });
      this.savingReports.forEach((savingReport: any) => {
        this.savingService.generateExcelReport(savingReport.engineName, savingReport.requestBody).subscribe((response: any) => {
          savingReport.excelReport = response;
        });
      });
    }
    this.resetFieldsAndOptions(this.savingReports.length == 0);
  }

  resetFieldsAndOptions(disabledGenerate: boolean) {
    this.radioEngine = 0;
    this.availableFields = [];
    this.selectedFields = [];
    this.selectedMonths = null;
    this.firstField = "";
    this.secondField = "";
    this.disabledRadioEngines = false;
    this.disabledGenerate = disabledGenerate;
    this.disabledAddReport = true;
    this.savingsRequestCPE = new SavingsRequest();
    this.disableButtons();
  }

  addReport() {
    this.disabledAddReport = true;
    if (this.savingReports.length < 5) {
      let requestEngineBody: any;
      switch (this.engineName) {
        case "ICMS":
          requestEngineBody = {
            clients: this.selectedFieldOptions.clients,
            engineRulesIds: this.selectedFieldOptions.rules,
            payers: this.selectedFieldOptions.payers,
            payersShort: this.selectedFieldOptions.payersShort,
            engineName: this.engineName
          }
          break;
        case "CVP":
          requestEngineBody = {
            months: this.selectedFieldOptions.months,
            clients: this.selectedFieldOptions.clients,
            payersShort: this.selectedFieldOptions.payersShort,
            engineRulesIds: this.selectedFieldOptions.rules,
            groupIds: this.selectedFieldOptions.groups,
            engineName: this.engineName
          }
          break;
        case "CPE":
          let allClientIds = new Set();
          this.selectedFieldOptions.clients.forEach((clientOption: any[]) => {
            clientOption.forEach((clientId: number) => {
              allClientIds.add(clientId);
            });
          });
          requestEngineBody = {
            months: this.selectedFieldOptions.months,
            platforms: this.selectedFieldOptions.platforms,
            clients: Array.from(allClientIds.values()),
            payersShort: this.selectedFieldOptions.payersShort,
            groupIds: this.selectedFieldOptions.groups,
            editFlags: this.selectedFieldOptions.flags,
            engineName: this.engineName
          }
      }
      if (this.engineName != "CPE") {
        this.savingService.generateExcelReport(this.engineName.toLowerCase(), requestEngineBody).subscribe((response: any) => {
          if (response.size > 0) {
            this.savingReports.push({
              requestBody: requestEngineBody,
              progress: 0,
              notGenerated: true,
              engineName: this.engineName.toLowerCase(),
              reportName: this.getReportName(),
              excelReport: null
            });
            this.progressValue = this.progressValue == 100 ? 0 : this.progressValue;
            this.resetFieldsAndOptions(false);
          } else {
            this.savingsMessage = true;
          }
        });
      } else {
        this.savingReports.push({
          requestBody: requestEngineBody,
          progress: 0,
          notGenerated: true,
          engineName: this.engineName.toLowerCase(),
          reportName: this.getReportName(),
          excelReport: null
        });
        this.progressValue = this.progressValue == 100 ? 0 : this.progressValue;
        this.resetFieldsAndOptions(false);
      }
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: "Only 4 reports at once are allowed", life: 5000, closable: true });
    }
  }

  getReportName() {
    let occurrences: number = 0;
    let newReportName: string = this.engineName + "_Savings_" + this.currentDate.replace(/\ /gi, "_");
    this.savingReports.forEach((savingReport: any, index: number) => {
      if(savingReport.reportName == newReportName) {
        occurrences++;
      }
    });
    return newReportName + (occurrences != 0 ? " (" + occurrences + ")" : "") + ".xlsx";
  }

  closeSavingMessage() {
    this.savingsMessage = false;
  }

  generateReport(): void {
    let reportsToGenerate = [];
    this.savingReports.forEach((savingReport: any, index: number) => {
      if (savingReport.progress == 0) {
        reportsToGenerate.push(index);
      }
    });
    this.loadReportProgressBar(reportsToGenerate);
    this.savingReports.forEach((savingReport: any) => {
      if (savingReport.progress == 0) {
        this.savingService.generateExcelReport(savingReport.engineName, savingReport.requestBody).subscribe((response: any) => {
          savingReport.excelReport = response;
          savingReport.progress = 100;
          savingReport.notGenerated = false;
        });
      }
    });
    this.disabledGenerate = true;
    sessionStorage.setItem("savingReports", JSON.stringify(this.savingReports));
    sessionStorage.setItem("engineId", this.radioEngine.toString());
  }

  loadReportProgressBar(reportsToGenerate: any) {
    let progressValue = 0;
    let interval = setInterval(() => {
      progressValue = progressValue + Math.floor(Math.random() * 10) + 1;
      reportsToGenerate.forEach((reportIndex: number) => {
        if(progressValue >= 80 && this.savingReports[reportIndex].excelReport == null) {
          this.savingReports[reportIndex].progress = 80;
        } else if (this.savingReports[reportIndex].progress != 100){
          this.savingReports[reportIndex].progress = progressValue;
        }
        if (progressValue >= 100 && this.savingReports[reportIndex].excelReport != null) {
          this.savingReports[reportIndex].progress = 100;
          this.savingReports[reportIndex].notGenerated = false;
          clearInterval(interval);
        }
      });
    }, 1000);
  }

  downloadExcelReport(index: number) {
    this.confirmationService.confirm({
      message: 'Download this report will remove it from your Generated Report List. Are you sure that you want to proceed?',
      header: 'Download Excel Report File',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.createDownloadFileElement(this.savingReports[index].reportName, this.savingReports[index].excelReport);
        this.savingReports.splice(index, 1);
        sessionStorage.setItem("savingReports", JSON.stringify(this.savingReports));
        sessionStorage.setItem("engineId", this.radioEngine.toString());
      },
      reject: () => { }
    });
  }

  createDownloadFileElement(reportName: string, response: any) {
    var a = document.createElement("a");
    document.body.appendChild(a);
    let blob = new Blob([response], { type: "fileType" }), url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = reportName;
    a.click();
    window.URL.revokeObjectURL(url);
  }

}