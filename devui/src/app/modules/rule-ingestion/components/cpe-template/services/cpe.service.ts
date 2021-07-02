import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CpeService {
  public product: any[] = [
    { name: 'Select product code', code: null }
  ];

  public businessCase: any[] = [
    { name: 'Select business case', code: null }
  ];

  public formTypes: any[];

  public providerScope: any[] = [
    { name: 'Select provider scope', code: null }
  ];

  public batchScope: any[] = [
    { name: 'Select batch scope', code: null }
  ];

  public lineFilterCriteria: any[] = [
    { name: 'Select product line filter criteria', code: null }
  ];

  public specialityScope: any[] = [
    { name: 'Select specialty scope', code: null }
  ];

  public sourceValue: any[] = [
    { name: 'Select source', code: null }
  ];

  public nucleousEditingSetting: any[] = [
    { name: 'Type specific', code: null }
  ];

  public nucleousEditingSettingFlagAutoReviewStatus: any[];


  constructor(private http: HttpClient) { }

  /**
    * Retrieve all template information from backend
    * @param cpeIngestionId 
    */
  getTemplate(cpeIngestionId: number) {
    return this.http.get(`${environment.restServiceUrl}${RoutingConstants.CPE_INGESTION_TEMPLATE}/${RoutingConstants.SAVE_CPE_INGESTION_TEMPLATE}/${cpeIngestionId}`);
  }

  /**Retrieve the dropdown info from backend
   * 
   */
  getCPEIngestionCatalog()
  {
    return this.http.get(`${environment.restServiceUrl}${RoutingConstants.CPE_INGESTION_TEMPLATE}/get-ingestion-catalogs`);
  }

  /**
   * Save or update template in database
   * @param cvpIngestionId 
   * @param screenData 
   */
  saveTemplate(cpeIngestionId: number, screenData: any) {
    return this.http.post(`${environment.restServiceUrl}${RoutingConstants.CPE_INGESTION_TEMPLATE}/${RoutingConstants.SAVE_CPE_INGESTION_TEMPLATE}`, {
      cpeIngestionId: cpeIngestionId,
      cpeTemplateDetails: screenData,
      submitted: false
    });
  }

  /**
   * Parse local date to manage and display correctly
   * @param date 
   */
  parseDate(date) {
    if (date != null) {
      let arrDate = date.split("T");
      let newDate = arrDate[0] + "T00:00:00";

      return new Date(newDate);
    } else {
      return null;
    }
  }

  /**
   * Service call to construct Cpe Templates Excel File
   * @param cpeIngestionIds 
   */
  exportRules(ingestedIds: any[]): Observable<any> {
    const url = `${environment.restServiceUrl}${RoutingConstants.CPE_INGESTION_TEMPLATE}/${RoutingConstants.EXPORT_CPE_RULES_TEMPLATE}`;
    return this.http.post(url, ingestedIds, { responseType: 'blob' });
  }

  /**
   * Creates the default cpejson object and returns it.
   */
  getDefaultCpeJson() {
    return {
      versionNumber: '',
      editDescription: '',
      editName: '',
      productCode: null,
      editDescriptionProduct: '',
      desciptionRequest: '0',
      clinicalRationale: '',
      clientEOBMessage: '',
      storyIds: '',
      businessCase: null,
      businessImpAnalysis: {
        fileId: 0,
        fileName: '',
        text: '',
        selected: 0
      },
      dateRquest: null,
      clinicalAdvGroupRevDate: null,
      formTypes: [],
      providerScope: null,
      batchScope: null,
      productLineFilterCriteria: null,
      specialityScope: {
        speciality: '',
        selected: null
      },
      otherLimitation: {
        fileId: 0,
        fileName: '',
        text: '',
        selected: 0
      },
      diagnosesCpe: '0',
      clinicalExamplePlainlyState: {
        fileId: 0,
        fileName: '',
        text: '',
        selected: 0
      },
      clinicalExampleExceptionToRule: {
        fileId: 0,
        fileName: '',
        text: '',
        selected: 0
      },
      procedureDiagOtherCodes: {
        fileId: 0,
        fileName: '',
        text: '',
        selected: 0
      },
      procedureCodesTypes: [],
      testCasesNotes: '',
      testCasesNotesFiles: [],
      sources: '',
      sourceValue: null,
      newSourceValue: '0',
      newSourceValueDescription: '',
      viewableRepository: '0',
      nucleousEditSettingManageOptions: 'R',
      nucleousEditSettingManageClients: {
        editingSetting: '',
        selected: null
      },
      nucleousEditSettingManageFlagAuto: [],
      ancillarySettingName: '',
      ancillarySettingOptions: '',
      otherAndFallback: '',
      willChangeBeMade: '0',
      willNewTableBeRequired: '0',
      newOrExistingTableName: '',
      newOrExistingTableContent: {
        fileId: 0,
        fileName: '',
        text: '',
        selected: 0
      },
      instrtuctionForAnalysisReview: '',
      instrtuctionForClinicalServices: '',
      effectiveAndTermDates: {
        termDates: null,
        selected: '0'
      },
      flagLines: '0',
      DosScopes: 'NA',
      effectSaiving: '0',
      savingCalculatedFrom: 'AP',
      revReductionSwitch: 'RNA',
      mantisId: '',
      editOrder: '',
      editType: 'M',
      product: 'FCI',
      categoryId: '',
      status: '0',
      requireSuggestedCode: '0',
      requireSuggestedUnits: '0',
      requireHistoryLine: '0',
      requireSuggestedPaid: '0',
      historyInterval: 'S',
      allowSwitch: '0',
      needsEditExplanation: '0',
      reverseFlag: '0',
      reductionFlag: '0',
      allowExceed: '0',
      requireMessageFlag: '0',
      reverseEditSwitchFlag: '',
      reverseReductionSwitchPerc: '',
      userSpecCond: '0',
      reporting: '0',
      useNewEditSetting: '0'
    };
  }

  
}