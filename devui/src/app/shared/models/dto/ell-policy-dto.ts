import { EllPolicyTypeDto } from './ell-policy-type-dto';

export class EllPolicyDto{
    medPolKey       : number;				//Medical policy key.
	medPolTitle     : string;				//Medical policy title.
	policyType      : string;				//Medical policy type.
	ellPolicyTypeDto : EllPolicyTypeDto;
}