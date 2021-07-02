import { MwfClientDto } from './mwf-client-dto';

export class MwfReportRequestDto {
    selectedFields: string[];
    fromDate: Date;
    toDate: Date;
    updateInstanceName: string[];
    clientList: MwfClientDto[];
    midRuleIdList: string[];
    fieldParam: number;

    constructor() {
        this.selectedFields = [];
        this.clientList = [];
        this.midRuleIdList = [];
    }
}

