export interface LastDrugVersionResponse {
  drugVersionCode: string;
  drugCode: string;
  version: string;
  majorVersion: number;
  minorVersion: number;
  createdBy: number;
  creationDT: number;
  updatedBy: number;
  updatedOn: number;
}

export interface DrugVersionsResponse {
  drugVersionCode?: string;
  drugCode?: string;
  version?: string;
  versionStatus?: { code: string; description: string };
  majorVersion?: number;
  minorVersion?: number;
  createdBy?: number;
  creationDT?: number;
  updatedBy?: number;
  updatedOn?: number;
  midRules: MidRules[];
  revVersion: number;
  reviewDt?: string;
}

export interface DrugVersionsInProcessResponse {
  drugVersionCode: string;
  drugCode: string;
  majorVersion: number;
  minorVersion: number;
  revVersion: number;
  reviewDt: string;
  versionStatus: { code: string; description: string };
  drugName: string;
  daysOld: number;
  submittedBy: { userId: number; userName: string; firstName: string };
  completionPercentage: string;
}

interface MidRules {
  ruleId: string;
  ruleCode: string;
  midRule: string;
}

export interface DrugVersionsUI extends DrugVersionsResponse {
  checked: boolean;
}

export interface CreateNewDrug {
  drugId: number;
  code: string;
  name: string;
  statusId: number;
  creationDt: string;
}

export interface ReAssignPayload {
  userId: number;
  drugList: string[];
}

export interface AddFeedBack {
  beginIndex: number;
  endIndex: number;
  drugVersionUuid: string;
  feedback: string;
  sectionRowUuid: string;
  sourceText: string;
  uiColumnAttribute: string;
  uiSectionCode: string;
}

export interface DeleteFeedBack {
  feedbackInstanceId: number;
  getFeedbackInstanceItemId: number;
}

export interface IngestedSection {
  sectionCode: string;
  ingested: boolean;
  name: string;
}

export interface IngestedData {
  completed: boolean;
  processId: string;
  sections?: IngestedSection[];
}

export interface ListDrug {
  drugCode: string;
  drugVersionCode: string;
  ellTopicName: string;
  hasUpdates: boolean;
  name: string;
  version: string;
  versionStatus: string;
  wcDrugName: string;
  wcDrugExists:boolean;
}

export interface ListDrugVersion {
  drugCode:string;
  drugVersionCode:string;
  reviewDt:string
  version: string;
  versionStatus: {code:string, description:string};
  
}