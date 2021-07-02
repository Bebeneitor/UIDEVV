
export class OpportunityValueDto {
    icmsComments: string;
    cvpComments: string;
    rpeComments: string;
    icmsOppValue: number;
    cvpOppValue: number;
    rpeOppValue: number;

    constructor() {
        this.icmsOppValue = 0;
        this.cvpOppValue = 0;
        this.rpeOppValue = 0;
    }
}