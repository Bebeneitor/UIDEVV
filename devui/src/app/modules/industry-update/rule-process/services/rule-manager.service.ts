import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BaseResponse } from 'src/app/shared/models/base-response';
import { Constants } from 'src/app/shared/models/constants';
import { RoutingConstants } from 'src/app/shared/models/routing-constants';
import { environment } from 'src/environments/environment';
import { RuleDto } from '../models/rule-dto.model';
import { DialogService } from 'primeng/api';
import { ProvisionalRuleComponent } from 'src/app/modules/rule-creation/provisional-rule/provisional-rule.component';
import { RuleInfoService } from 'src/app/services/rule-info.service';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class RuleManagerService {
    // Table Columns definitions.
    ruleCodeColumn = { field: 'ruleCode', header: 'ECL ID', width: '10%' };
    ruleNameColumn = { field: 'ruleName', header: 'Rule Name', width: '20%' };
    ruleLogicColumn = { field: 'ruleLogic', header: 'Rule Logic', width: '20%' };
    instanceNameColumn = { field: 'instanceName', header: 'Update Instance Name', width: '16%' };
    approvalStatusColumn = { field: 'approvalStatus', header: 'Approval Status', width: '10%' };
    comments = { field: 'comments', header: 'Comments', width: '15%' };
    optionsColumn = { field: 'options', header: 'Codes Actions', width: '10%' }
    standardColumns = [this.ruleCodeColumn, this.ruleNameColumn, this.ruleLogicColumn, this.instanceNameColumn];
    standardColumnsReturned = [this.ruleCodeColumn, this.ruleNameColumn, this.ruleLogicColumn, this.instanceNameColumn];

    // Status dropdowm options definitions.
    selectOption = { label: 'Select status', value: null };

    // CCA
    submitCCAOption = { label: 'Submit for Approval', value: Constants.NEW_VERSION_PENDING_CODE };


    // submitForApproval = { label: 'Submit for Approval', value: Constants.APPROVED_CODE };
    logicalSubmitForApproval = { label: Constants.LOGICAL_SUBMIT_APPROVAL, value: Constants.NEW_VERSION_PENDING_CODE };
    editorialSubmitForApproval = { label: Constants.EDITORIAL_SUBMIT_APPROVAL, value: Constants.EXISTING_VERSION_PENDING_SUBMITION };
    editorialApproved = { label: Constants.EDITORIAL_APPROVED, value: Constants.APPROVED_PENDING_SUBMITION };

    // PSE editorial submit for approval
    // PSN logical submit for approval
    // A submit for approval 
    // PO
    approvePoOption = { label: 'Approved', value: Constants.PO_APPROVAL_PENDING_SUBMISSION_CODE };
    mdApprovalNeededOption = { label: 'Need Peer Reviewer Approval', value: Constants.PO_MD_APPROVAL_PENDING_SUBMISSION };
    returnAnalystPoOption = { label: 'Return to Clinical Content Analyst', value: Constants.PO_RETURN_TO_RA_PENDING_SUBMISSION };

    // MD
    approveMdOption = { label: 'Approved', value: Constants.MD_APPROVAL_PENDING_SUBMISSION };
    returnAnalystOption = { label: 'Return to Clinical Content Analyst', value: Constants.MD_RETURN_TO_RA_PENDING_SUBMISSION };


    constructor(private http: HttpClient, private dialogService: DialogService, private ruleService: RuleInfoService) { }

    getStatusForCCA() {
        return [this.selectOption, this.submitCCAOption];
    }

    getStatusForCcaImpactAnalysis() {
        return [this.selectOption, this.editorialApproved, this.logicalSubmitForApproval, this.editorialSubmitForApproval];
    }

    getStatusForPo() {
        return [this.selectOption, this.approvePoOption, this.mdApprovalNeededOption, this.returnAnalystPoOption];
    }

    getStatusForMd() {
        return [this.selectOption, this.approveMdOption, this.returnAnalystOption];
    }

    getColumnsMDClaim() {
        return [
            { field: 'ruleCode', header: 'ECL ID' },
            { field: 'ruleName', header: 'Rule Name' },
            { field: 'ruleLogic', header: 'Rule Logic' },
            { field: 'codesAction', header: 'Codes Actions' },
            { field: 'instanceName', header: 'Update Instance Name' }
        ];
    }

    assignMedicalDirector(userId: number, recordIds: number[], stageId: number) {
        return this.http.post(environment.restServiceUrl + RoutingConstants.SAME_SIM + '/' + RoutingConstants.REASSIGNMENT_RULES, {
            userId: userId,
            rules: recordIds,
            role: Constants.MD_ROLE,
            eclLookupDto: {
                lookupDesc: 'Peer Reviewer Claim'
            },
            returned: false
        });
    }

    processImpactedRules(submit: boolean, approvalStatusDtos: RuleDto[]) {
        return this.http.post(environment.restServiceUrl + RoutingConstants.SAME_SIM + '/' + RoutingConstants.SAME_SIM_PROCESS_IMPACTED_RULES, {
            submit: submit,
            approvalStatusDtos: approvalStatusDtos
        });
    }

    /**
   * Gets the column definitions for the cca impact analysis.
   */
    getCcaColumns() {
        return [
            this.ruleCodeColumn,
            this.ruleNameColumn,
            this.ruleLogicColumn,
            this.optionsColumn,
            this.instanceNameColumn
        ];
    }

    /**
   * Gets the column definitions for the cca impact analysis.
   */
    getMdColumns() {
        return [
            ...this.standardColumns,
            this.approvalStatusColumn,
            this.optionsColumn,
            this.comments
        ];
    }

    getCCAColumsToExport() {
        return [
            this.ruleCodeColumn,
            this.ruleNameColumn,
            this.ruleLogicColumn,
            this.instanceNameColumn
        ];
    }

    getMdClaimsColumsToExport() {
        return [
            this.ruleCodeColumn,
            this.ruleNameColumn,
            this.ruleLogicColumn,
            this.instanceNameColumn
        ];
    }

    getMdColumsToExport() {
        return [
            this.ruleCodeColumn,
            this.ruleNameColumn,
            this.ruleLogicColumn,
            this.instanceNameColumn,
            this.approvalStatusColumn,
            this.comments
        ];
    }


    /**
     * Saves the rules Workflow.
     * @param currentUrl used to get the url endpoint.
     * @param selectedRules to be processed.
     */
    saveRules(selectedRules, status?) {
        const requestObject = this.getRequestDto(selectedRules, false, status);
        const url = `${environment.restServiceUrl}${RoutingConstants.SAME_SIM}/${RoutingConstants.SAME_SIM_PROCESS_IMPACT_RULES}`;

        return this.http.post<BaseResponse>(url, requestObject);
    }

    /**
     * Submits the rules Workflow.
     * @param currentUrl used to get the url endpoint.
     * @param selectedRules to be processed.
     */
    submitRules(selectedRules, status?) {
        const requestObject = this.getRequestDto(selectedRules, true, status);
        const url = `${environment.restServiceUrl}${RoutingConstants.SAME_SIM}/${RoutingConstants.SAME_SIM_PROCESS_IMPACT_RULES}`;

        return this.http.post<BaseResponse>(url, requestObject);
    }

    /**
      * Gets the cca rules.  
      * @param first element of the pagination.
      * @param last element of the pagination.
      * @param keywordSearch filter for the query.
      */
    getRules(page: number, pageSize: number, filter: string, role: string): any {
        const params = new HttpParams().append('page', page.toString())
            .append('pageSize', pageSize.toString())
            .append('filter', filter)
            .append('role', role);

        const url = `${environment.restServiceUrl}${RoutingConstants.SAME_SIM}/${RoutingConstants.SAME_SIM_GET_RULES}`;
        return this.http.get<BaseResponse>(url, { params: params });
    }

    /**
      * Gets the cca returned rules.  
      * @param first element of the pagination.
      * @param last element of the pagination.
      * @param keywordSearch filter for the query.
      */
    getRulesReturned(page: number, pageSize: number, filter: string, role: string, status: string): any {
        const params = new HttpParams().append('page', page.toString())
            .append('pageSize', pageSize.toString())
            .append('filter', filter)
            .append('role', role)
            .append('status', status);

        const url = `${environment.restServiceUrl}${RoutingConstants.SAME_SIM}/${RoutingConstants.SAME_SIM_GET_RULES}`;
        return this.http.get<BaseResponse>(url, { params: params });

    }

    /**
     * Gets the codes by rule id.
     * @param ruleId to get the codes.
     */
    getCodesByRule(ruleId: number): Observable<BaseResponse> {
        const url = `${environment.restServiceUrl}${RoutingConstants.SAME_SIM}${RoutingConstants.SAME_SIM_GET_CODES_BY_RULE}/${ruleId}`;
        return this.http.get<BaseResponse>(url);
    }

    /**
     * Gets the selected rules and transform then into the RuleDto array.
     * @param selectedRules to be tranformed.
     */
    private getRequestDto(selectedRules, isSubmit, status?) {

        const rules: RuleDto[] = [];
        selectedRules.forEach(selectedRule => {
            let appStatus = selectedRule.approvalStatus;
            let isRetStatus = false;
            if (!status && isSubmit) {
                if (selectedRule.approvalStatus === Constants.MD_APPROVAL_PENDING_SUBMISSION) {
                    appStatus = Constants.APPROVED_CODE;
                } else if (selectedRule.approvalStatus === Constants.MD_RETURN_TO_RA_PENDING_SUBMISSION) {
                    appStatus = Constants.RETURN_TO_MEDICAL_DIRECTOR;
                }
            } else if (status === Constants.CCA_RETURNED) {
                if (appStatus === Constants.MD_APPROVAL_PENDING_SUBMISSION) {
                    appStatus = Constants.APPROVED_CODE;
                } else if (appStatus === Constants.MD_RETURN_TO_RA_PENDING_SUBMISSION) {
                    appStatus = Constants.RETURN_TO_RESEARCH_ANALYST;
                }
            } else if (appStatus === Constants.PO_RETURN_RESEARCH_ANALYST_CODE) {
                appStatus = Constants.NEW_VERION_PENDING_APPROVAL;
                isRetStatus = true;
            } else if (appStatus === Constants.RETURN_TO_MEDICAL_DIRECTOR) {
                appStatus = Constants.MEDICAL_DIRECTOR_APPROVAL_NEEDED_CODE;
                isRetStatus = true;
            } else if (status === Constants.RETURNED_FROM_CCA) {
                if (selectedRule.impactType) {
                    if (selectedRule.impactType === Constants.LR_LOGICAL) {
                        appStatus = Constants.NEW_VERSION_PENDING_CODE;
                    } else if (appStatus === Constants.APPROVED_PENDING_SUBMITION) {
                        appStatus = Constants.APPROVED_PENDING_SUBMITION;
                    } else {
                        appStatus = Constants.EXISTING_VERSION_PENDING_SUBMITION;
                    }
                    isRetStatus = true;
                }
            }


            const rule: RuleDto = {
                ruleId: selectedRule.ruleId,
                status: appStatus,
                comments: selectedRule.comments ? selectedRule.comments : '',
                returnedStatus: isRetStatus
            }
            rules.push(rule)
        });

        return {
            approvalStatusDtos: rules,
            submit: isSubmit
        };
    }

    /**
     * 
     * @param ruleId Find cloned rule Id given a ruleId value. (cloned rule is the rule with parentRule equas ruleId)
     * @param callback Method to invoke when value is found.
     */
    findClonedRuleId(ruleId: number, callback) {
        const url = `${environment.restServiceUrl}${RoutingConstants.RULES_URL}/${RoutingConstants.PARENT_RULE_URL}/${ruleId}`;
        this.http.get<BaseResponse>(url).subscribe((resp: BaseResponse) => {
            const ruleImpacted = resp.data.find(rule => rule.ruleStatusId.ruleStatusId === Constants.RULE_IMPACTED_VALUE);
            if (ruleImpacted) {
                callback(ruleImpacted.ruleId);
            } else {
                callback(null);
            }
        });
    }

    /**
     * Show rule details screen as a popup.
     * @param ruleId Rule Id..
     * @param readOnly if true, show popup in read only mode.
     * @param approvalOptions Options to show in approval Status values Provisional Pop Up.
     * @deprecated please use @method showRuleDetailsScreenObs which return the pop up ref so you can subscribe to its observables.
     */
    showRuleDetailsScreen(ruleId: number, readOnly: boolean, approvalOptions: any[] = [], codeTab: number = 0) {
        this.findClonedRuleId(ruleId, impactedId => {
            let header = 'Library Rule Details';
            if (!impactedId) {
                impactedId = ruleId;
                readOnly = true;
                header = 'Library Rule Details - Invalid Rule';
            }
            this.dialogService.open(ProvisionalRuleComponent, {
                data: {
                    ruleId: impactedId,
                    header: 'Library View',
                    isSameSim: !readOnly,
                    fromSameSimMod: true,
                    fromMaintenanceProcess: true,
                    readOnlyView: true,
                    provDialogDisable: true,
                    ruleReview: true,
                    readWrite: !readOnly,
                    reviewStatus: approvalOptions,
                    tabSelected: codeTab
                },

                header: header,
                width: '90%',
                height: '92%',
                closeOnEscape: false,
                closable: false,
                contentStyle: {
                    'max-height': '92%',
                    'overflow': 'auto',
                    'padding-top': '0',
                    'padding-bottom': '0',
                    'border': 'none'
                }
            });
        });
    }

    /**
       * 
       * @param ruleId Find cloned rule Id given a ruleId value. (cloned rule is the rule with parentRule equas ruleId)
       * @param callback Method to invoke when value is found.
       */
    findClonedRuleIdObs(ruleId: number) {
        const url = `${environment.restServiceUrl}${RoutingConstants.RULES_URL}/${RoutingConstants.PARENT_RULE_URL}/${ruleId}`;
        return this.http.get(url).pipe(map((response: any) => {
            const ruleImpacted = response.data.find(rule => rule.ruleStatusId.ruleStatusId === Constants.RULE_IMPACTED_VALUE);
            if (ruleImpacted) {
                return ruleImpacted.ruleId;
            } else {
                return null;
            }
        }));
    }

    /**
    * Show rule details screen as a popup.
    * @param ruleId Rule Id..
    * @param readOnly if true, show popup in read only mode.
    * @param approvalOptions Options to show in approval Status values Provisional Pop Up.
    */
    showRuleDetailsScreenObs(ruleId: number, readOnly: boolean, approvalOptions: any[] = []) {
        const subject = new Subject<any>();
        this.findClonedRuleIdObs(ruleId).subscribe(response => {
            let header = 'Library Rule Details';
            if (!response) {
                response = ruleId;
                readOnly = true;
                header = 'Library Rule Details - Invalid Rule';
            }
            subject.next(this.dialogService.open(ProvisionalRuleComponent, {
                data: {
                    ruleId: response,
                    header: 'Library View',
                    isSameSim: !readOnly,
                    fromSameSimMod: true,
                    fromMaintenanceProcess: true,
                    readOnlyView: true,
                    provDialogDisable: true,
                    ruleReview: true,
                    readWrite: !readOnly,
                    reviewStatus: approvalOptions
                },

                header: header,
                width: '90%',
                height: '92%',
                closeOnEscape: false,
                closable: false,
                contentStyle: {
                    'max-height': '92%',
                    'overflow': 'auto',
                    'padding-top': '0',
                    'padding-bottom': '0',
                    'border': 'none'
                }
            }));
        });

        return subject.asObservable();
    }


    /**
     * Get Codes of old and new version of Rules
     */
    getCodesOfOldAndNewVersionOfRules(selectedRules: any[]) {
        let newRulesMessages: string[] = []
        let thisNVR = this;
        return new Promise((resolve, reject) => {
            if (selectedRules.length > 0) {
                selectedRules.forEach(function (rule, idx, array) {
                    thisNVR.ruleService.getRuleLatestVersion(rule.ruleId).subscribe(resp => {
                        if (resp.data === ""){                            
                            newRulesMessages.push(`${rule.ruleCode} has been approved`);
                        } else {
                            newRulesMessages.push(`${rule.ruleCode} new version is: ${resp.data}`);
                        }
                        if (idx === array.length - 1) {
                            resolve(newRulesMessages);
                        }
                    });
                });
            } else {
                resolve(newRulesMessages);
            }
        });
    }


    /**
     * Show rule details screen as a popup using only RuleId.
     * @param ruleId Rule Id..
     * @param readOnly if true, show popup in read only mode.
     * @param approvalOptions Options to show in approval Status values Provisional Pop Up.
     */
    showRuleIdDetailsScreen(
        ruleId: number,
        readOnly: boolean,
        approvalOptions: any[] = []
    ) {
        const subject = new Subject<any>();
        const header = "Library Rule Details";
        const rule = ruleId;
        this.dialogService.open(ProvisionalRuleComponent, {
            data: {
                ruleId: rule,
                header: "Library View",
                isSameSim: !readOnly,
                fromSameSimMod: true,
                fromMaintenanceProcess: true,
                readOnlyView: true,
                provDialogDisable: true,
                ruleReview: true,
                readWrite: !readOnly,
                reviewStatus: approvalOptions,
            },
            header: header,
            width: "90%",
            height: "92%",
            contentStyle: {
                "max-height": "92%",
                overflow: "auto",
                "padding-top": "0",
                "padding-bottom": "0",
                border: "none",
            },
        });

        return subject.asObservable();
    }

}
