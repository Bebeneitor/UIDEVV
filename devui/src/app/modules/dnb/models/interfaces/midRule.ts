export interface MidRule {
  midRuleTemplateId: number;
  template: string;
  templateInformation: string;
  reasonCode: string;
  lockDetail?: { locked: boolean; lockedBy: string };
  isActive?: boolean;
}

export interface ELLMidRule {
  midrule: string;
  description: string;
}

export interface ELLMidRuleChange {
  midrule: string;
  description: string;
  type: string;
  newMidRule?: string;
  foundRowUUID?: string;
}

export interface ELLMidRulesResponse {
  midRuleKey: number;
  ruleVersion: number;
  topicTitle: string;
  unresolvedDesc: string;
  vtopicKey: number;
  subRuleScript: string;
  subRuleRationale: string;
  subRuleNotes: string;
  reference: string;
}

export interface MidRuleSetUp {
  headerDialog: string;
  midRuleTitle1: string;
  disableTitle1: boolean;
  requiredTitle1: boolean;
  midRuleText1: string;
  disableText1: boolean;
  requiredText1: boolean;
  midRuleText2: string;
  disableText2: boolean;
  requiredText2: boolean;
  showButton1: boolean;
  textButton1: string;
  showButton2: boolean;
  textButton2: string;
  showLockedBy: boolean;
  saveMessage: string;
  mode?: string;
}

export interface MidRuleHistory {
  field: string;
  newValue: string;
  originalValue: string;
  updatedBy: string;
  updatedOn: string;
}

export interface MidRuleCreation {
  createdBy: string;
  createdOn: string;
}

export interface MidRuleExisting {
  engineId: string;
  midRule: string;
  midRuleVersion: string;
  eclRuleId: string;
  eclRuleCode: string;
  eclRuleName: string;
  eclRuleLogicOriginal: string;
  selected?: boolean;
}
