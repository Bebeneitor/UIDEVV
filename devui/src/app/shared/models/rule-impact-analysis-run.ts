import {RuleReferenceUpdates} from "./rule-reference-updates";

export class RuleImpactAnalysisRun {

  ruleImpactAnalysisRunId: number;
  ruleImpactedInd: number;
  ruleImpactAnalysis: string;
  comments: string;
  typeOfChanges : any = {
    hcps : {
      ruleChangeAddNotes: '',
      ruleChangeModNotes: '',
      ruleChangeDelNotes: ''
    },
    icd : {
      ruleChangeAddNotes: '',
      ruleChangeModNotes: '',
      ruleChangeDelNotes: ''
    },
    modifiers : {
      ruleChangeAddNotes: '',
      ruleChangeModNotes: '',
      ruleChangeDelNotes: ''
    },
    placeServices : {
      ruleChangeAddNotes: '',
      ruleChangeModNotes: '',
      ruleChangeDelNotes: ''
    }
  }; 
  ruleImpactTypeId: number;
  createdBy: number;
  creationDt: number;
  ruleRefUpdates: RuleReferenceUpdates[];
}
