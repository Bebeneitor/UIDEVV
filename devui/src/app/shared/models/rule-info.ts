import { Categories } from './categories';
import { EclLob } from './ecl-lob';
import { EclJurisdiction } from './ecl-jurisdiction';
import { EclState } from './ecl-state';
import { EclReference } from './ecl-reference';
import { RuleProcedureCodes } from './rule-procedure-codes';
import { RuleStatus } from './rule-status';
import { ProcedureCodeDto } from './dto/procedure-code-dto';
import { RuleEngine } from 'src/app/shared/models/rule-engine.model';
import { RuleCodeDto } from './dto/rule-code-dto';
import { PdgTemplateDto } from './dto/pdg-dto';
import { EclPolicyPackage } from './ecl-policy-package';

export class RuleInfo {
  ruleId: number;
  ruleName: string;
  ruleCode: string;
  ruleDescription: string;
  ruleLogicOriginal: string;
  ruleLogicModified: string;
  ruleLogicFinal: string;
  reviewComment: string;
  status: string;
  ruleLogicEffDt: Date;

  lobs: EclLob[];
  jurisdictions: EclJurisdiction[];
  states: EclState[];
  category: Categories;
  eclReferences: EclReference[];
  procedureCodes: RuleProcedureCodes[];

  versionNumber: any;
  subVersionNumber: any;
  statusId: number;
  daysOld: any;

  assignedTo: any;
  createdDt: Date;
  createdBy: any;
  updatedBy: any;
  updatedOn: Date;

  estOppurtunityVal: any;
  potentialSavingsOpp: string;
  reasonsForDev: string;
  scriptRationale: string;
  clientRationale: string;
  claimTypId: number;
  providerTypeInd: number;
  specialityInd: number;
  denyProcedureCodes: string;
  pendingProcedureCodes: string;
  reduceProcedureCodes: string;
  reduceUnits: string;
  applyPercReduction: string;

  genderInd: number;
  ageLimitInd: number;
  ageLimitDetails: string;
  mileLimitInd: number;
  mileLimitDetails: string;
  dosageLimitInd: number;
  dosageLimitDetails: string;

  genderIndOriginal: number;
  ageLimitIndOriginal: number;
  ageLimitDetailsOriginal: string;
  mileLimitIndOriginal: number;
  mileLimitDetailsOriginal: string;
  dosageLimitIndOriginal: number;
  dosageLimitDetailsOriginal: string;
  reduceUnitsOriginal: string;
  applyPercReductionOriginal: string;
  otherExceptionsOriginal: string;
  otherExceptions: string;
  claimImpactInd: number;
  claimImpactDetails: string;
  dosageImpactInd: number;
  dosageImpactDetails: string;

  claimImpactIndOriginal: number;
  claimImpactDetailsOriginal: string;
  dosageImpactIndOriginal: number;
  dosageImpactDetailsOriginal: string;
  confirmed: number;
  parentRuleId: number;
  ideaId: number;
  activeWorkflow: any;
  ruleStatusId: RuleStatus;
  ruleReasonOriginal: string;
  scriptRationaleOriginal: string;
  clientRationaleOriginal: string;
  estOppurtunityValOriginal: any;
  procedureCodeDto?: ProcedureCodeDto = new ProcedureCodeDto();
  hcpcsCptCodeDtoList: RuleCodeDto[];
  diagnosisCodeDto: RuleCodeDto[];
  ruleLogicEffDtStr: string;
  ruleEngine: RuleEngine;
  cvCode?: any = null;
  claimsType?: any;
  pdgTemplateDto: PdgTemplateDto;
  policyPackagesId: any[];
  eclPolicyPackages: EclPolicyPackage[];
  
  constructor() {
    this.category = new Categories();
    this.providerTypeInd = 0;
    this.specialityInd = 0;
    this.procedureCodeDto = new ProcedureCodeDto();
    this.ruleStatusId = new RuleStatus;
    this.pdgTemplateDto = new PdgTemplateDto();
  }

}