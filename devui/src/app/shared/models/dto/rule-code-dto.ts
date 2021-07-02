export class RuleCodeDto {
    codeId : number;
    ruleId : number;
	codeRangeFrom : string;
	codeRangeTo : string;
	modifier : any[];
	daysLo : number;
	daysHi : number;
	dateFrom : string;
	dateTo : string;
	category : number;
	pos : any[];
	bwDeny : string;
	override : string;
	icd : string;
	existing : boolean;
	retired : boolean;
	action : string;
	claimHeaderLevel: string;
	primarySecondaryCode: number;
	ruleDiagnosisCodeId: number;
	isCodeRangeFromRetired: string;
	isCodeRangeToRetired: string;
	longDescCodeRangeFrom: string;
	longDescCodeRangeTo: string;
	codeCatDescription:string;
	primarySecondaryCodeDesc:string;
	statusTypeId : number;
	parentCodeId : number;
	codeRangeFromDescription:string;
	codeRangeToDescription:string;
	posJoiner:string;
	originalCodeId?: number;
	revenueCodeFrom: string;
	revenueCodeTo: string;
	revenueCodeDescFrom: string;
	revenueCodeDescTo: string;
   
    constructor() {

    }

}
