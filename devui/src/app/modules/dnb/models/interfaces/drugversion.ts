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
}

interface MidRules {
  ruleId: string;
  ruleCode: string;
  midRule: string;
}

export interface DrugVersionsUI extends DrugVersionsResponse {
  checked: boolean;
}
