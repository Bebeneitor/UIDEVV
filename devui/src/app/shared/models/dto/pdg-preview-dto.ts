import { SafeUrl } from "@angular/platform-browser";

export interface PdgTemplateDownloadAttachment {

	fileName?: string;
	fileData?: any;
  fileByteData?: any;  
  refSrcUrl?: SafeUrl;
  fileId: number;
}

export interface PdgTemplateDownloadReference {
	eclReferenceId?: number;
	referenceName?: string;
	section?: string;
	page?: string;
	referenceSource?: string;
	infoFromState?: string;
	link?: string;
	comments?: string;
	referencePath?: string;
	attachmentFiles?: PdgTemplateDownloadAttachment[];
  comments1?: string;
  comments2?: string;
  screenshot1?: PdgTemplateDownloadAttachment;
  screenshot2?: PdgTemplateDownloadAttachment;
}

export interface PdgTemplateDownloadDto {
  title?: string;
  states?: string[];
  unresolvedSubRuleDesc?: string;
  codeDescription?: string;
  claimTypes?: string;
  dosFrom?: string;
  dosTo?: string;
  referenceDetails?: string;
  primaryRefTitle?: string;
  secondaryRefTitle?: string;
  cvCode?: string;
  lob?: string;
  iuRequired?: string;
  reasonCode?: string;
  script?: string;
  rationale?: string;
  isCciDuplicate?: string;
  isRmiDuplicate?: string;
  isBoDuplicate?: string;
  isMaxUnitsDuplicate?: string;
  isRulesSearchDuplicate?: string;
  isTempRuleDbDuplicate?: string;
  isPdgTrackerReportDuplicate?: string;
  keyRuleLogic?: string;
  ruleRelationships?: string;
  ellTeamNote?: string;
  codeCoverage?: string;
  claimTypeInfo?: string;
  dosFromInfo?: string;
  otherInfo?: string;
  ituReviewInfo?: string;
  clientGridFiles?: PdgTemplateDownloadAttachment[];
  cptFiles?: PdgTemplateDownloadAttachment[];
  codeCoverageFiles?: PdgTemplateDownloadAttachment[];
  claimTypeFiles?: PdgTemplateDownloadAttachment[];
  subRuleDosFiles?: PdgTemplateDownloadAttachment[];
  otherInfoFiles?: PdgTemplateDownloadAttachment[];
  ituFiles?: PdgTemplateDownloadAttachment[];
  pdgReferences?: PdgTemplateDownloadReference[];
  subRuleNotes?: string;
  hppRuleDesc?: string;
  hppMr?: string;
  revisions?: string;
}

