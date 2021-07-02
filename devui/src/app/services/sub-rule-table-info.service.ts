import { Injectable } from '@angular/core';
import { EllSearchDto } from '../shared/models/dto/ell-search-dto';
import { EclTableModel } from '../shared/components/ecl-table/model/ecl-table-model';
import { EclTableColumnManager } from '../shared/components/ecl-table/model/ecl-table-manager';
import { Constants } from '../shared/models/constants';
import { EclColumn } from '../shared/components/ecl-table/model/ecl-column';
import { RoutingConstants } from '../shared/models/routing-constants';
import { TableDetailDto } from '../shared/models/dto/table-detail-dto';
import { EclAsyncFileDetails } from '../shared/components/ecl-table/model/ecl-async-file-details';

@Injectable({
  providedIn: 'root'
})
export class SubRuleTableInfoService {

  constructor() { }

  getTableInfo(selectedSubRuleType: string , ellSearchDto?  : EllSearchDto):EclTableModel{
    const alignment = 'center';  
    let uri : string;  
    let manager = new EclTableColumnManager();
    let excelFileName : string;
    let asyncFileDetails = new EclAsyncFileDetails();
    let tableConfig = new EclTableModel();
      tableConfig.filterGlobal = false;
      tableConfig.lazy = true;

    switch (selectedSubRuleType) {
      case Constants.REQUEST_TYPE:
        excelFileName = "Request Type"
        uri = `${RoutingConstants.ELL_URL}/${RoutingConstants.ELL_REQUEST_TYPE}/`;  
        manager.addLinkColumn('requestTypeKey',   'Key',          null, false, EclColumn.TEXT, false,alignment);
        manager.addTextColumn('requestTypeDesc',  'Description',  null, false, EclColumn.TEXT, false,0,alignment);
        manager.addTextColumn('hidden10',         'Hidden',       null, false, EclColumn.TEXT, false,0,alignment);        
        break;
      case Constants.RPCD_REASONS_TYPE:
        excelFileName = "RPCD Reasons";
        uri = `${RoutingConstants.ELL_URL}/${RoutingConstants.ELL_REASON}/${RoutingConstants.ELL_REVISED_CODE}`; 
        manager.addLinkColumn('revisedReasonKey',   'Key',         '20%', false, EclColumn.TEXT, false,alignment);
        manager.addTextColumn('revisedReasonDesc',  'Description', '60%', false, EclColumn.TEXT, false,0,alignment);
        manager.addTextColumn('hidden10',           'Hidden',      '20%', false, EclColumn.TEXT, false,0,alignment);        
        break;
      case Constants.RULE_HEADERS_TYPE:
         tableConfig.scrollable = true;
         tableConfig.horizontalScrollable = true;
         tableConfig.verticalScrollable = false;

         excelFileName = "Rule Headers";
         uri = `${RoutingConstants.ELL_URL}/${RoutingConstants.ELL_MID_RULES}/${RoutingConstants.ELL_RULE_HEADERS}`; 
         manager.addTextColumn('runOrder', 'Run Order',                  '95px', false, EclColumn.TEXT, false, 0, alignment);
         manager.addTextColumn('ruleHeaderDesc', 'Rule Header Desc',     null,   false, EclColumn.TEXT, false, 0, alignment);
         manager.addLinkColumn('ruleHeaderKey', 'Key',                   '95px', false, EclColumn.TEXT, false, alignment);
         manager.addTextColumn('udf101Desc', 'UDF_10_1_DESC',            null, false, EclColumn.TEXT, false, 0, alignment); 
         manager.addTextColumn('udf102Desc', 'UDF_10_2_DESC',            null, false, EclColumn.TEXT, false, 0, alignment); 
         manager.addTextColumn('udf103Desc', 'UDF_10_3_DESC',            null, false, EclColumn.TEXT, false, 0, alignment); 
         manager.addTextColumn('udf104Desc', 'UDF_10_4_DESC',            null, false, EclColumn.TEXT, false, 0, alignment); 
         manager.addTextColumn('udf105Desc', 'UDF_10_5_DESC',            null, false, EclColumn.TEXT, false, 0, alignment); 
         manager.addTextColumn('udf106Desc', 'UDF_10_6_DESC',            null, false, EclColumn.TEXT, false, 0, alignment);
         manager.addTextColumn('udfNumber1Desc', 'UDF_NUMBER_1_DESC',    null, false, EclColumn.TEXT, false, 0, alignment);    
         manager.addTextColumn('udfNumber2Desc', 'UDF_NUMBER_2_DESC',    null, false, EclColumn.TEXT, false, 0, alignment);   
         manager.addTextColumn('udfText1Desc', 'UDF_TEXT_1_DESC',        null, false, EclColumn.TEXT, false, 0, alignment);   
         manager.addTextColumn('udfText2Desc', 'UDF_TEXT_2_DESC',        null, false, EclColumn.TEXT, false, 0, alignment);   
         manager.addTextColumn('dialogListValues', 'Dialog List Value', null, false, EclColumn.TEXT, false, 0, alignment); 
         break;
      case Constants.WORK_STATUS:
        excelFileName = "Work Status";
        uri = `${RoutingConstants.ELL_URL}/${RoutingConstants.ELL_WORK_STATUS}/`; 
        manager.addLinkColumn('workStatusKey',   'Key',         '20%', false, EclColumn.TEXT, false,alignment);
        manager.addTextColumn('workStatusDesc',  'Description', '60%', false, EclColumn.TEXT, false,0,alignment);
        manager.addTextColumn('dialogListValues','Dialog List Values',      '20%', false, EclColumn.TEXT, false,0,alignment);      
        break;
      case Constants.SUB_SPEC:
        excelFileName = "Sub Spec";

        tableConfig.asyncDownload = true;
        asyncFileDetails = new EclAsyncFileDetails();
        asyncFileDetails.fileName = 'Sub Spec';
        asyncFileDetails.processCode = 'SUB_SPEC_PROCESS';        
        tableConfig.asyncFileDetails = asyncFileDetails;
        
        if (ellSearchDto) {
          if (ellSearchDto.type === Constants.KEYWORD_TYPE_SEARCH && ellSearchDto.keyword.length > 0) {
            tableConfig.asyncFileDetails.extraDetails = { valueStr1: ellSearchDto.keyword }
          }
        }
        
        uri = `${RoutingConstants.ELL_URL}/${RoutingConstants.ELL_SUB_SPEC}/`; 
        manager.addLinkColumn('payerKey',      'Payer Key',        '20%', false, EclColumn.TEXT, false,alignment);
        manager.addTextColumn('payerShort',    'Payer Short',      '60%', false, EclColumn.TEXT, false,0,alignment);
        manager.addTextColumn('subspecId',     'Sub Spec Id',      '20%', false, EclColumn.TEXT, false,0,alignment);
        manager.addTextColumn('subspecIdDesc', 'Sub Spec Id Desc', '20%', false, EclColumn.TEXT, false,0,alignment);      
        manager.addTextColumn('subspecCode',   'Sub Spec Code',    '20%', false, EclColumn.TEXT, false,0,alignment);
        break;
        case Constants.REASON:
          excelFileName = "Reason";
          tableConfig.asyncDownload = true;
          asyncFileDetails = new EclAsyncFileDetails();
          asyncFileDetails.fileName = 'Reason';
          asyncFileDetails.processCode = 'REASON_PROCESS';        
          tableConfig.asyncFileDetails = asyncFileDetails;
          
          if (ellSearchDto) {
            if (ellSearchDto.type === Constants.KEYWORD_TYPE_SEARCH && ellSearchDto.keyword.length > 0) {
              tableConfig.asyncFileDetails.extraDetails = { valueStr1: ellSearchDto.keyword }
            }
          }
          uri = `${RoutingConstants.ELL_URL}/${RoutingConstants.ELL_REASON}/${RoutingConstants.ELL_MAP_REASON}`; 
          manager.addLinkColumn('payerKey',      'Payer Key',        '20%', false, EclColumn.TEXT, false,alignment);
          manager.addTextColumn('payerShort',    'Payer Short',      '40%', false, EclColumn.TEXT, false,0,alignment);
          manager.addTextColumn('reasonId',      'Reason ID',        '20%', false, EclColumn.TEXT, false,0,alignment);
          manager.addTextColumn('reasonCode',    'Reason Code',      '20%', false, EclColumn.TEXT, false,0,alignment);      
          break;
      case Constants.INSURANCE:
        excelFileName = "Insurance";
        uri = `${RoutingConstants.ELL_URL}/${RoutingConstants.ELL_INSURANCE}/`; 
        manager.addLinkColumn('payerKey',        'Payer Key',         '20%', false, EclColumn.TEXT, false,alignment);
        manager.addTextColumn('payerShort',      'Payer Short',       '60%', false, EclColumn.TEXT, false,0,alignment);
        manager.addTextColumn('insuranceId',     'Insurance Id',      '20%', false, EclColumn.TEXT, false,0,alignment);
        manager.addTextColumn('insuranceIdDesc', 'Insurance Id Desc', '20%', false, EclColumn.TEXT, false,0,alignment);      
        manager.addTextColumn('insuranceCode',   'Insurance Key',    '20%', false, EclColumn.TEXT, false,0,alignment);
        break;
      case Constants.ELL_POS:
        excelFileName = "POS";
        uri = `${RoutingConstants.ELL_URL}/${RoutingConstants.ELL_POS}/`; 
        manager.addLinkColumn('payerKey',        'Payer Key',         '10%', false, EclColumn.TEXT, false,alignment);
        manager.addTextColumn('payerShort',      'Payer Short',       '40%', false, EclColumn.TEXT, false,0,alignment);
        manager.addTextColumn('posId',           'POS Id',         '10%', false, EclColumn.TEXT, false,0,alignment);
        manager.addTextColumn('posIdDesc',       'POS Id Desc',    '20%', false, EclColumn.TEXT, false,0,alignment);      
        manager.addTextColumn('posCode',         'POS Code',       '20%', false, EclColumn.TEXT, false,0,alignment);
        break;
      case Constants.GENDER:
          excelFileName = "Gender";
          uri = `${RoutingConstants.ELL_URL}/${RoutingConstants.ELL_GENDER}/`; 
          manager.addLinkColumn('payerKey',        'Payer Key',      '10%', false, EclColumn.TEXT, false,alignment);
          manager.addTextColumn('payerShort',      'Payer Short',    '40%', false, EclColumn.TEXT, false,0,alignment);
          manager.addTextColumn('genderId',        'Gender Id',      '10%', false, EclColumn.TEXT, false,0,alignment);
          manager.addTextColumn('genderIdDesc',    'Gender Id Desc', '20%', false, EclColumn.TEXT, false,0,alignment);      
          manager.addTextColumn('genderCode',      'Gender Code',    '20%', false, EclColumn.TEXT, false,0,alignment);
          break;
      default:
        break;
    }
    
    if (ellSearchDto) {
      if (ellSearchDto.type === Constants.KEYWORD_TYPE_SEARCH && ellSearchDto.keyword.length > 0) {
        uri = `${uri}?keyword-search=${encodeURIComponent(ellSearchDto.keyword)}`;
      }
    }

    tableConfig.excelFileName = excelFileName; 
    tableConfig.columns = manager.getColumns();
    tableConfig.url = uri;

    return tableConfig;
  }

  getDataForDetail(rowData: any,selectedSubRuleType: string):TableDetailDto[] {

    let tableDetailDto: TableDetailDto[];
    switch (selectedSubRuleType) {
      case Constants.REQUEST_TYPE:
        tableDetailDto = [
          { title: 'Request Type Key', value: rowData['requestTypeKey'] },
          { title: 'Sort Order', value: rowData['sortOrder'] },
          { title: 'Description', value: rowData['requestTypeDesc'] },
          { title: 'Work unit key', value: rowData['workUnitTypeKey'] },
          { title: 'Hidden 10', value: rowData['hidden10'] }
        ];        
        break;
      case Constants.RPCD_REASONS_TYPE:
        tableDetailDto = [
          { title: 'Revised Reason Key', value: rowData['revisedReasonKey'] },
          { title: 'Revised Reason Desc', value: rowData['revisedReasonDesc'] },
          { title: 'Sort Order', value: rowData['sortOrder'] },
          { title: 'Hidden 10', value: rowData['hidden10'] },
         
        ];        
        break;
        case Constants.RULE_HEADERS_TYPE:
          tableDetailDto = [
            { title: 'RULE_HEADER_KEY', value: rowData['ruleHeaderKey'] },
            { title: 'RULE_HEADER_DESC', value: rowData['ruleHeaderDesc'] },
            { title: 'RUN_ORDER', value: rowData['runOrder'] },
            { title: 'UDF_10_1_DESC', value: rowData['udf101Desc'] },
            { title: 'UDF_10_2_DESC', value: rowData['udf102Desc'] },
            { title: 'UDF_10_3_DESC', value: rowData['udf103Desc'] },
            { title: 'UDF_10_4_DESC', value: rowData['udf104Desc'] },
            { title: 'UDF_10_5_DESC', value: rowData['udf105Desc'] },
            { title: 'UDF_10_6_DESC', value: rowData['udf106Desc'] },
            { title: 'UDF_NUMBER_1_DESC', value: rowData['udfNumber1Desc'] },
            { title: 'UDF_NUMBER_2_DESC', value: rowData['udfNumber2Desc'] },
            { title: 'UDF_TEXT_1_DESC', value: rowData['udfText1Desc'] },
            { title: 'UDF_TEXT_2_DESC', value: rowData['udfText2Desc'] },
          ];
          break;
        case Constants.WORK_STATUS:
          tableDetailDto = [
            { title: 'Work Status Key', value: rowData['workStatusKey'] },
            { title: 'Work Status Description', value: rowData['workStatusDesc'] },
            { title: 'Closed 10', value: rowData['closed10'] },
            { title: 'Sort Order', value: rowData['sortOrder'] },
            { title: 'Hidden 10', value: rowData['hidden10'] },
            { title: 'Returned 10', value: rowData['returned10'] },
          ];        
          break;
        case Constants.SUB_SPEC:
          tableDetailDto = [
            { title: 'Payer Key', value: rowData['payerKey'] },
            { title: 'Payer Short', value: rowData['payerShort'] },
            { title: 'Sub Spec Id', value: rowData['subspecId'] },
            { title: 'Sub Spec Id Desc', value: rowData['subspecIdDesc'] },
            { title: 'Sub Spec Code', value: rowData['subspecCode'] }
          ];        
          break;
          case Constants.REASON:
          tableDetailDto = [
            { title: 'Payer Key', value: rowData['payerKey'] },
            { title: 'Payer Short', value: rowData['payerShort'] },
            { title: 'Reason Id', value: rowData['reasonId'] },
            { title: 'Reason Code', value: rowData['reasonCode'] }
          ];        
          break;
        case Constants.INSURANCE:
          tableDetailDto = [
            { title: 'Payer Key', value: rowData['payerKey'] },
            { title: 'Payer Short', value: rowData['payerShort'] },
            { title: 'Insurance Id', value: rowData['insuranceId'] },
            { title: 'Insurance Id Desc', value: rowData['insuranceIdDesc'] },
            { title: 'Insurance Key', value: rowData['insuranceCode'] }
          ];        
          break;
        case Constants.ELL_POS:
          tableDetailDto = [
            { title: 'Payer Key', value: rowData['payerKey'] },
            { title: 'Payer Short', value: rowData['payerShort'] },
            { title: 'POS Id', value: rowData['posId'] },
            { title: 'POS Id Desc', value: rowData['posIdDesc'] },
            { title: 'POS Code', value: rowData['posCode'] }
          ];        
          break;
        case Constants.GENDER:
            tableDetailDto = [
              { title: 'Payer Key', value: rowData['payerKey'] },
              { title: 'Payer Short', value: rowData['payerShort'] },
              { title: 'Gender Id', value: rowData['genderId'] },
              { title: 'Gender Id Desc', value: rowData['genderIdDesc'] },
              { title: 'Gender Code', value: rowData['genderCode'] }
            ];        
            break;
      default:
        break;
    }
    return tableDetailDto;
  }
}