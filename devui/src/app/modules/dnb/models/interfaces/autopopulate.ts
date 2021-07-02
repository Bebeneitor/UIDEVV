export interface ProcessIndicationOverride {
  overrideIndications: OverrideIndication;
  addIndicationsParent: string[];
  addIndicationsGlobal: string[];
  deleteIndicationsChild: ChildIndications[];
  deleteIndicationGlobalReview: ChildIndications[];
  processAddIndication: boolean;
  processDeleteIndication: boolean;
  autopopulateGlobalReviewSection: boolean;
  autopupulateAllChildSections: boolean;
}

export interface ProcessIndicationAdd {
  addIndications: string;
  addIndicationsParent: string[];
  addIndicationsGlobal: string[];
  deleteIndicationsChild: ChildIndications[];
  deleteIndicationGlobalReview: ChildIndications[];
  processAddIndication: boolean;
  processDeleteIndication: boolean;
  autopopulateGlobalReviewSection: boolean;
  autopupulateAllChildSections: boolean;
}

export interface AddIndication {
  newIndication: string;
}

export interface OverrideIndication {
  oldIndication: string;
  newIndication: string;
}

export interface ChildCurrentDataIndications {
  diagnosisCodeSummary:any[];
  globalReviewIndication:any[];
}

export interface ChildIndications {
   label: string; 
   value: string; 
   disabled: boolean;
}

export interface ChildCurrentDataIcdCodes {
  globalReviewIcd10Codes:any[];
}

export interface OverrideIcd10Codes {
  oldIcd10Code: string,
  newIcd10Code: string,
}

export interface AddIcd10Codes {
  newIcd10code: string,
}

export interface ProcessIcdCodesAdd {
  addIcdCode: string;
  addIcdCodeParent: string[];
  deleteIcdCodeChild: ChildIndications[];
  processAddIcdCode: boolean;
  processDeleteIcdCode: boolean;
}

export interface ProcessIcdCodesOverride {
 overrideIcdCode: OverrideIcd10Codes;
 addIcdCodeParent: string[];
 deleteIcdCodeChild: ChildIndications[];
 processAddIcdCode: boolean;
 processDeleteIcdCode: boolean;
}

