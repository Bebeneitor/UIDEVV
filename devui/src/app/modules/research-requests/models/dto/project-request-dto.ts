import { ResearchRequestDto } from "src/app/shared/models/dto/research-request-dto";

export class ProjectRequestDto {
    action: string;
    assignee: number;
    attachmentCategory: number;
    encryptPass: string;
    selectedPayerList: number[];
    selectedPayerStatus: number;
    superPayersSelected: number[];
    clientSelected: any[];
    jiraId: string;
    lnLink: string;
    lnProjectNumber: string;
    lnStatusCode: string;
    projectId: number;
    projectCategoryId: number;
    projectRequestId: number;
    projectRequestCode: string;
    requestDescription: string;
    requestDueDate: string;
    requestSource: string;
    requestSummary: string;
    prCreatedBy: number;
    prCreatedDate: string;
    prStatus: string;
    prUpdatedBy: number;
    prUpdatedDate: string;
    selectedCCUsers: number[];
    removedCCUsers: number[];
    selectedWatcherUsers: number[];
    removedWatcherUsers: number[];
    sourceId: number;
    issueType: number;
    targetReleaseDt: Date;
    userId: string;
    linkedRrId: number;
    

    constructor(request?: ResearchRequestDto) {
        if (request) {
            this.selectedCCUsers = [];
            this.removedCCUsers = [];
            this.selectedWatcherUsers = [];
            this.removedWatcherUsers = [];
            this.action = request.action;
            this.assignee = request.assignee;
            this.attachmentCategory = request.attachmentCategory;
            this.selectedPayerList = request.selectedPayerList;
            this.selectedPayerStatus = request.selectedPayerStatus;
            this.superPayersSelected = request.superPayersSelected;
            this.clientSelected = request.clientSelected;
            this.jiraId = null;
            this.projectCategoryId = null;
            this.projectRequestCode = '';
            this.sourceId = null;
            this.requestDescription = request.requestDescription;
            this.requestDueDate = request.requestDueDate;
            this.requestSource = null;
            this.requestSummary = request.requestSummary;
            this.prCreatedBy = request.rrCreatedBy;
            this.prCreatedDate = request.rrCreatedDate;
            this.prUpdatedBy = request.rrUpdatedBy;
            this.prUpdatedDate = request.rrUpdatedDate;
            this.targetReleaseDt = null;
            this.userId = request.userId;
            this.linkedRrId = request.researchRequestId;
        }
    }

}
