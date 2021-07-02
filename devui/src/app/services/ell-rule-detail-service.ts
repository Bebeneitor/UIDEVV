import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { RoutingConstants } from '../shared/models/routing-constants';
import { ECLConstantsService } from 'src/app/services/ecl-constants.service';
import { EllRuleDto } from 'src/app/shared/models/dto/ell-rule-dto';
import { BaseResponse } from 'src/app/shared/models/base-response';
import { Constants } from 'src/app/shared/models/constants';
import { TableDetailDto } from 'src/app/shared/models/dto/table-detail-dto';

@Injectable({
    providedIn: 'root'
})
export class EllRuleDetailService {
    
    constructor(private http: HttpClient, private eclConstantsService: ECLConstantsService) { }

    /** 
     * This method is used to get the rule detail from the back-end.
     *  @param releaseLogKey - Release log Id.
     *  @param midRuleKey    - Rule Key.
     *  @returns Promise<EllRuleDto>
    */
    getRuleDetail(releaseLogKey: number, midRuleKey: number) {
        return new Promise<EllRuleDto>((resolve, reject) => {
            if (!isNaN(releaseLogKey) && !isNaN(midRuleKey)) {
                let uri = `${environment.restServiceUrl}${RoutingConstants.ELL_URL}/${RoutingConstants.ELL_LIBRARY}/${releaseLogKey}?midRuleKey=${midRuleKey}`;
                this.http.get(uri).subscribe((baseReponse: BaseResponse) => {
                    resolve(baseReponse.data);
                },error =>{                   
                    reject(error);
                });
            } else {
                reject("Please enter valid arguments, only numeric values are allowed.");
            }
        });
    }

    /** 
     * This method is used to get the mid-rule title, be means of the type selected.
     *  @param type        - Type.
     *  @param ellRuleDto  - EllRuleDto.
     *  @returns mid rule title
    */
    getMidRule(type: String, ellRuleDto: EllRuleDto){
        let midRule: string;
        if (type === this.eclConstantsService.LONG_VERSION){
            midRule = `${ellRuleDto ? ellRuleDto.midRuleKey : ''}.${ellRuleDto ? ellRuleDto.ruleVersion : ''}`;
        }else if (type === this.eclConstantsService.SMALL_VERSION){
            midRule = String(ellRuleDto ? ellRuleDto.midRuleKey : '');
        }
        return midRule;
    }

    /** 
     * This method is used to fill an array with the rule detail from the back-end.
     *  @param type        - Type.
     *  @param ellRuleDto  - EllRuleDto.
     *  @returns rule detaild in array
    */
    fillTableDetailDtoList(type: String, ellRuleDto: EllRuleDto) {
        let ellRuleDtoList : TableDetailDto[]= [];
        if (type === this.eclConstantsService.SMALL_VERSION) {
            ellRuleDtoList = [
                { title: 'Mid Rule Key', value: ellRuleDto.midRuleKey },
                { title: 'Policy Type Key', value: ellRuleDto.ellPolicyDto.ellPolicyTypeDto.policyTypeKey },
                { title: 'Policy Type Description', value: ellRuleDto.ellPolicyDto.ellPolicyTypeDto.policyTypeDesc },
                { title: 'Medical Policy Key', value: ellRuleDto.ellPolicyDto.medPolKey },
                { title: 'Medical Policy Description', value: ellRuleDto.ellPolicyDto.medPolTitle },
                { title: 'Topic Key', value: ellRuleDto.ellTopicDto.topicKey },
                { title: 'Topic Description', value: ellRuleDto.ellTopicDto.topicTitle },
                { title: 'Decision Key', value: ellRuleDto.ellDecisionDto.dpKey },
                { title: 'Realtime Flag', value: ellRuleDto.realTimeMidRule10 },
                { title: 'Industry Update', value: ellRuleDto.industryUpdInd },             
                { title: 'LOB', value:  ellRuleDto.ellSubRuleDto.lobs4Rule, type: Constants.TYPE_LIST }, 
                { title: 'Pod Flag', value: ellRuleDto.podMidRule10 },
                { title: 'Edit Flag', value: ellRuleDto.editFlag }, 
                { title: 'CV Source', value: ellRuleDto.ellSubRuleDto.cvSourceCode }, 
                { title: 'Decision Description', value: ellRuleDto.ellDecisionDto.dpDesc },
                { title: 'Marked For Production - ICM', value: ellRuleDto.ellSubRuleDto.payer4RuleICM },
                { title: 'Marked For Production - ICMO', value: ellRuleDto.ellSubRuleDto.payer4RuleICMO },
                { title: 'Product Type', value: ellRuleDto.productType, type: Constants.TYPE_LIST },
                { title: 'Claim Type', value: ellRuleDto.claimTypesInDecision, type: Constants.TYPE_LIST },
            ];
        } else if (type === this.eclConstantsService.LONG_VERSION) {
            ellRuleDtoList = [
                { title: 'Mid Rule Key', value: ellRuleDto.midRuleKey },
                { title: 'Version', value: ellRuleDto.ruleVersion },
                { title: 'Sub Rule Key', value: ellRuleDto.subRuleKey },
                { title: 'ECL Rule', value: ellRuleDto.eclRuleCode },
                { title: 'ECL Rule Number', value: ellRuleDto.eclRuleNumber },
                { title: 'ECL Version Number', value: ellRuleDto.eclRuleVersion },
                { title: 'Sub Rule Description-Unnresolved', value: ellRuleDto.ellSubRuleDto.subRuleDescUnresolved },
                { title: 'Sub Rule Description-Resolved', value: ellRuleDto.ellSubRuleDto.subRuleDescResolved },
                { title: 'Sub Rule Script', value: ellRuleDto.ellSubRuleDto.subRuleScript },
                { title: 'Sub Rule Rationale', value: ellRuleDto.ellSubRuleDto.subRuleRationale },
                { title: 'Spanish Rationale', value: ellRuleDto.ellSubRuleDto.spanishRationale },
                { title: 'Sub Rule Notes', value: ellRuleDto.ellSubRuleDto.subRuleNotes },
                { title: 'Config Notes', value: ellRuleDto.ellSubRuleDto.configNotes },
                { title: 'Policy Type Key', value: ellRuleDto.ellPolicyDto.ellPolicyTypeDto.policyTypeKey },
                { title: 'Policy Type', value: ellRuleDto.ellPolicyDto.ellPolicyTypeDto.policyTypeDesc },
                { title: 'Medical Policy', value: ellRuleDto.ellPolicyDto.medPolTitle },
                { title: 'Topic Key', value: ellRuleDto.ellTopicDto.topicKey },
                { title: 'Topic', value: ellRuleDto.ellTopicDto.topicTitle },
                { title: 'Decision Key', value: ellRuleDto.ellDecisionDto.dpKey },
                { title: 'Decision', value: ellRuleDto.ellDecisionDto.dpDesc },
                { title: 'Library Status Key', value: ellRuleDto.ellSubRuleDto.libraryStatusKey },
                { title: 'Library Status', value: ellRuleDto.ellSubRuleDto.libraryStatusDesc },
                { title: 'Product Type', value: ellRuleDto.productType, type: Constants.TYPE_LIST },
                { title: 'Claim Type', value: ellRuleDto.claimTypesInDecision, type: Constants.TYPE_LIST },
                { title: 'CIT Remarks', value: ellRuleDto.ellSubRuleDto.citRemarks },
                { title: 'Reference Source Key', value: ellRuleDto.primRefSourceKey },
                { title: 'Reference Source Description', value: ellRuleDto.primRefSourceDesc },
                { title: 'Reference Title Key', value: ellRuleDto.primRefTitleKey },
                { title: 'Reference Title Description', value: ellRuleDto.primRefTitleDesc },
                { title: 'Reference', value: ellRuleDto.ellSubRuleDto.reference },
                { title: 'Mother Baby Issue', value: ellRuleDto.ellSubRuleDto.momBabyIssue10 },
                { title: 'Dos: From', value: ellRuleDto.dosFrom, type: Constants.TYPE_DATE },
                { title: 'Dos: To', value: ellRuleDto.dosTo, type: Constants.TYPE_DATE },
                { title: 'Core Enhanced Key', value: ellRuleDto.primCoreEnhancedKey },
                { title: 'Core Enhanced Description', value: ellRuleDto.primCoreEnhancedDesc },
                { title: 'OOS Key', value: ellRuleDto.ellSubRuleDto.oosKey },
                { title: 'Only Defined Diags', value: ellRuleDto.ellSubRuleDto.onlyDefinedIcds10 },
                { title: 'Industry Update Indicator', value: ellRuleDto.industryUpdInd },
                { title: 'Outpatient Hospital', value: ellRuleDto.outPatientHospital },
                { title: 'Date Added', value: ellRuleDto.ellSubRuleDto.dateAdded, type: Constants.TYPE_DATE },
                { title: 'Reason Code', value: ellRuleDto.reasonCode },
                { title: 'Deactivated Flag', value: ellRuleDto.ellSubRuleDto.deactivated10 },
                { title: 'Retired Flag', value: ellRuleDto.ellSubRuleDto.subRuleRetiredYn },
                { title: 'Tax Group', value: ellRuleDto.ellSubRuleDto.taxgroupLinkKey },
                { title: 'Marked For Production - ICM', value: ellRuleDto.ellSubRuleDto.payer4RuleICM },
                { title: 'Marked For Production - ICMO', value: ellRuleDto.ellSubRuleDto.payer4RuleICMO },
                { title: 'On In Production - ICM', value: ellRuleDto.ellSubRuleDto.payer4RuleICM },
                { title: 'On In Production - ICMO', value: ellRuleDto.ellSubRuleDto.payer4RuleICMO },
                { title: 'Aggressive Factor', value: ellRuleDto.ellSubRuleDto.aggresiveFactor },
                { title: 'All Amount Link Key', value: ellRuleDto.ellSubRuleDto.allAmountLinkKey },
                { title: 'Asst Surgery Mod Link', value: ellRuleDto.ellSubRuleDto.asstSurgModLink10 },
                { title: 'Bill Type Link Key', value: ellRuleDto.ellSubRuleDto.billTypeLinkKey },
                { title: 'Bill Types Apply 10', value: ellRuleDto.ellSubRuleDto.billTypesApply10 },
                { title: 'BW Reason Code', value: ellRuleDto.ellSubRuleDto.bwReasonCode },
                { title: 'Claim Type Link Key', value: ellRuleDto.ellSubRuleDto.claimTypeLinkKey },
                { title: 'Conservative Factor', value: ellRuleDto.ellSubRuleDto.conservativeFactor },
                { title: 'Cond Codes Apply', value: ellRuleDto.ellSubRuleDto.condCodesApply10 },
                { title: 'Copay Link Key', value: ellRuleDto.ellSubRuleDto.copayLinkKey },
                { title: 'Cpt Link Key', value: ellRuleDto.ellSubRuleDto.cptLinkKey },
                { title: 'Deactivated 10', value: ellRuleDto.ellSubRuleDto.deactivated10 },
                { title: 'Disabled 10', value: ellRuleDto.ellSubRuleDto.disabled10 },
                { title: 'Gender Cat Key', value: ellRuleDto.ellSubRuleDto.genderCatKey },
                { title: 'ICD Link AAN Key', value: ellRuleDto.ellSubRuleDto.icdLinkAnnKey },
                { title: 'ICD Link CLM vs Line Key', value: ellRuleDto.ellSubRuleDto.icdLinkClmVsLineKey },
                { title: 'ICD Link Digits', value: ellRuleDto.ellSubRuleDto.icdLinkDigits },
                { title: 'ICD Link Key', value: ellRuleDto.ellSubRuleDto.icdLinkKey },
                { title: 'Ignore Temp CPTs 10', value: ellRuleDto.ellSubRuleDto.ignoreTempCpts10 },
                { title: 'Ignore 59 Mod 10', value: ellRuleDto.ellSubRuleDto.ignore59Mod10 },
                { title: 'Invoke Mod Logic', value: ellRuleDto.ellSubRuleDto.invokeModExcPkg10 },
                { title: 'Max Age', value: ellRuleDto.ellSubRuleDto.maxAge },
                { title: 'Max All Amount', value: ellRuleDto.ellSubRuleDto.maxAllAmount },
                { title: 'Max Charge', value: ellRuleDto.ellSubRuleDto.maxCharge },
                { title: 'Max Units', value: ellRuleDto.ellSubRuleDto.maxUnits },
                { title: 'Mod Link Key', value: ellRuleDto.ellSubRuleDto.modLinkKey },
                { title: 'No Hit 10', value: ellRuleDto.ellSubRuleDto.noHit10 },
                { title: 'Pos Link Key', value: ellRuleDto.ellSubRuleDto.posLinkKey },
                { title: 'Pod Sub Rule YN', value: ellRuleDto.ellSubRuleDto.podSubRuleYn },
                { title: 'Provider Link Misc Key', value: ellRuleDto.ellSubRuleDto.provLinkMiscKey },
                { title: 'Provider Link No Key', value: ellRuleDto.ellSubRuleDto.provLinkNoMiscKey },
                { title: 'Prov Link ICMO Key', value: ellRuleDto.ellSubRuleDto.provLinkIcmoKey },
                { title: 'Rev Code Link Key', value: ellRuleDto.ellSubRuleDto.revCodeLinkKey },
                { title: 'Prof Rev Code Link', value: ellRuleDto.ellSubRuleDto.profRevCodeLink10 },
                { title: 'Prof Rev Mod Link', value: ellRuleDto.ellSubRuleDto.profRevModeLink10 },
                { title: 'Quirky Sri Config Rule YN', value: ellRuleDto.ellSubRuleDto.quirkySriConfigRuleYn },
                { title: 'Rule Header Desc', value: ellRuleDto.ellSubRuleDto.ruleHeaderDesc },
                { title: 'Rule Header Key', value: ellRuleDto.ellSubRuleDto.ruleHeaderKey },
                { title: 'Rule Version', value: ellRuleDto.ruleVersion },
                { title: 'Run Before RH Key', value: ellRuleDto.ellSubRuleDto.runBeforeRhKey },
                { title: 'Run Order', value: ellRuleDto.ellSubRuleDto.runOrder },
                { title: 'Spec Link Key', value: ellRuleDto.ellSubRuleDto.specLinkKey },
                { title: 'Split Care Mod Link YN', value: ellRuleDto.ellSubRuleDto.splitCareModLink10 },
                { title: 'Sub Amount Link Key', value: ellRuleDto.ellSubRuleDto.subAmountLinkKey },
                { title: 'Sub Rule Has PS Reason YN', value: ellRuleDto.ellSubRuleDto.subRuleHasPsReasonYn },
                { title: 'Sub Rule Has PS Script YN', value: ellRuleDto.ellSubRuleDto.subRuleHasPsScriptYn },
                { title: 'Sub Units Link Key', value: ellRuleDto.ellSubRuleDto.subUnitsLinkKey },
                { title: 'Taxgroup Link Key', value: ellRuleDto.ellSubRuleDto.taxgroupLinkKey },
                { title: 'UDF 10_1', value: ellRuleDto.ellSubRuleDto.udf101 },
                { title: 'UDF 10_1_Desc', value: ellRuleDto.ellSubRuleDto.udf101Desc },
                { title: 'UDF 10_2', value: ellRuleDto.ellSubRuleDto.udf102 },
                { title: 'UDF 10_2_Desc', value: ellRuleDto.ellSubRuleDto.udf102Desc },
                { title: 'UDF 10_3', value: ellRuleDto.ellSubRuleDto.udf103 },
                { title: 'UDF 10_3_Desc', value: ellRuleDto.ellSubRuleDto.udf103Desc },
                { title: 'UDF 10_4', value: ellRuleDto.ellSubRuleDto.udf104 },
                { title: 'UDF 10_4_Desc', value: ellRuleDto.ellSubRuleDto.udf104Desc },
                { title: 'UDF 10_5', value: ellRuleDto.ellSubRuleDto.udf105 },
                { title: 'UDF 10_5_Desc', value: ellRuleDto.ellSubRuleDto.udf105Desc },
                { title: 'UDF 10_6', value: ellRuleDto.ellSubRuleDto.udf106 },
                { title: 'UDF 10_6_Desc', value: ellRuleDto.ellSubRuleDto.udf106Desc },
                { title: 'UDF Number_1', value: ellRuleDto.ellSubRuleDto.udfNumber1 },
                { title: 'UDF Number_1_Desc', value: ellRuleDto.ellSubRuleDto.udfNumber1Desc },
                { title: 'UDF Number_2', value: ellRuleDto.ellSubRuleDto.udfNumber2 },
                { title: 'UDF Number_2_Desc', value: ellRuleDto.ellSubRuleDto.udfNumber2Desc },
                { title: 'UDF Text_1', value: ellRuleDto.ellSubRuleDto.udfText1 },
                { title: 'UDF Text_1_Desc', value: ellRuleDto.ellSubRuleDto.udfText1Desc },
                { title: 'UDF Text_2', value: ellRuleDto.ellSubRuleDto.udfText2 },
                { title: 'UDF Text_2_Desc', value: ellRuleDto.ellSubRuleDto.udfText2Desc },
            ];
        }
        return ellRuleDtoList;
    }    
 
}
