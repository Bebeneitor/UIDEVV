import { Injectable } from "@angular/core";
import { SelectItem } from "primeng/api";
import { ResearchRequestService } from "src/app/services/research-request.service";
import { Constants as con } from 'src/app/shared/models/constants';

const INVALID_RR_STATUS = ['PNDASSIP', 'ASSCMPLIP', 'SBFRWIP', 'RCRWIP', 'REQREVWIP', 'SBRRWIP', 'IRRC', 'JRRC', 'DRFT'];

@Injectable({
    providedIn: 'root'
})
export class RrUtils {

    constructor(private rrService: ResearchRequestService) { }

    /**
     * Duplication Check for mulitple rule id when searching & adding
     * into the display table.
     * @param dataTable - Table of searched rules.
     * @param tableFormat - ids that may be added.
     * @param format - ids or ruleId? (true/false)
     * @returns boolean - true/false (if false, then it passes)
     */
    duplicateCheck(data: any[], tableFormat: any, format: boolean = true) {
        if (format) {
            return !data.some(value => value.id === tableFormat.id);
        } else {
            return !data.some(value => value.ruleId === tableFormat.ruleId);
        }
    }

    /**
     * Popluate highList for midBox to highlight the rule Ids.
     * @param ruleList - Search Rule List that already implemented.
     * @param ruleIdList - Mapped Rule List from Response.
     * @param validRuleList - Valid Rule List that been checked.
     * @returns Filtered RuleList based on ruleIdList exist and validRuleList doesn't contain.
     */
    fillHighlights(ruleList: any[], ruleIdList, regexValidList) {
        if (ruleIdList.length === 0) {
            return ruleList;
        } else {
            return ruleList.filter(value => !ruleIdList.includes(value) || !regexValidList.includes(value));
        }
    }

    /**
     * stripRuleEngine to be more compatiable form for highlight and data manpluation
     * @param engine ECL/ICMS
     * @param data Search Data to be transformed into an ID list
     * @returns ID List
     */
    stripRuleEngine(engine: number, validData: any[]) {
        if (engine === 2) {
            return validData.map(ele => {
                if (ele !== null && ele.icmsId !== null) {
                    return ele.icmsId;
                }
            });
            // ECL - map searched data into rule id list minus 'ECL-'
        } else {
            return validData.map(ele => {
                if (ele !== null) {
                    return ele.eclId.replace('ECL-', '');
                }
            });
        }
    }

    /**
     * Converting Any Array of Object list to SelectItem
     * @param array - Object List
     * @param propName - Property name for label
     * @returns SelectItem Array
     */
    convertIntoSelectItemArray(array: any[], propName: string, lookupType?: string, rr?: boolean): SelectItem[] {
        if (!lookupType) {
            return array.map(obj => {
                return { label: obj[propName], value: obj };
            });
        } else {
            if (rr) { array = array.filter(item => !INVALID_RR_STATUS.includes(item.lookupCode)); }
            return array.map(obj => {
                return { label: obj[propName], value: obj[lookupType] };
            });
        }
    };

    getResearchRequestClients(dest: SelectItem[]) {
        return new Promise((resolve, reject) => {
            this.rrService.getResearchRequestClients().subscribe(response => {
                if (response.data !== null && response.data !== undefined) {
                    response.data.forEach(client => {
                        dest.push({ label: client.clientName, value: client.clientId })
                    });
                    resolve(dest);
                }
            });
        });
    }

    /**
     * Checking Research Request Status that in [In-Progress, Completed, NotStarted, Send back for Research]
     * @param rrStatus 
     * @returns boolean
     */
    checkRRStatus(rrStatus: string): boolean {
        return (rrStatus === con.RR_WORKFLOW_STATUS_ASSITANCE_COMPLETED ||
            rrStatus === con.RR_WORKFLOW_STATUS_SEND_BACK_FOR_RESEARCH ||
            rrStatus === con.RR_WORKFLOW_STATUS_IN_PROGRESS ||
            rrStatus === con.RR_WORKFLOW_STATUS_NOT_STARTED);
    }
}