export class SavingsRequest {

    ruleEngine: string;
    ruleIds: string[];
    groupIds: string[];
    dateRange: string[];
    clientIds: any[];
    payerIds: number[];
    clientNames: string[];
    payerShortNames: string[];
    clientPlatforms: string[];
    editFlags: string[];
    cpeResultColumn: string;

    constructor() {
        this.ruleEngine = null;
        this.ruleIds = [];
        this.groupIds = [];
        this.dateRange = [];
        this.clientIds = [];
        this.payerIds = [];
        this.clientNames = [];
        this.payerShortNames = [];
        this.clientPlatforms = [];
        this.editFlags = [];
        this.cpeResultColumn = null;
    }

}