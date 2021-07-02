import { EclReference } from '../ecl-reference';
import { EclReferenceDto } from './ecl-reference-dto';
import { RuleNoteTabDto } from './rule-notetab-dto';

export class PdgTemplateDto {
	pdgId: number=null;
    pdgType: string;
	codeDesc: string;
	dosFrom: string;
	dosTo: string;
	referenceDetails: string;
	primaryReferenceTitle: string;
	secondaryReferenceTitle: string;
	industryUpdateRequired: string;
	reasonCodeAndDescription: string;
	subruleNotes: string;
	notes: RuleNoteTabDto;
	hppRuleDesc: string;
	hppMr: string;
	revisions: string;
	isCciDuplicate: string;
	isRmiDuplicate: string;
	isBoDuplicate: string;
	isMaxUnitsDuplicate: string;
	isRulesSearchDuplicate: string;
	isTempRuleDbDuplicate: string;
	isPdgTrackerReportDuplicate: string;
	keyRuleLogic: string;
	ruleRelationships: string;
	cptDistrFiles: any[];
	ituReviewInfo: string;
	ituFiles: any[];
	clientGridFiles: any[];
	codeCoverage: string;
	codeCoverageFiles: any[];
	claimTypeInfo: string;
	claimTypeFiles: any[];
	dosFromInfo: string;
	subRuleDosFiles: any[];
	otherInfo: string;
	otherInfoFiles: any[]; 
	ellTeamNote: string;

   
    constructor() {
		this.notes = new RuleNoteTabDto();
		this.cptDistrFiles = [];  
		this.clientGridFiles=[];  
		this.ituFiles=[];  
		this.codeCoverageFiles=[];  
		this.claimTypeFiles=[];  
		this.subRuleDosFiles=[];  
		this.otherInfoFiles=[]; 
    }

}
