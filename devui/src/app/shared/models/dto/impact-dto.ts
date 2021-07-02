export class ImpactDto {
    categoryIds: number[];
    lobIds: number[];
    placeOfServiceIds: number[];
    ruleIds: number[];
    userId: number;
    referenceIds: number[];
    impactType: string;

    constructor() {
        this.categoryIds = [];
        this.lobIds = [];
        this.placeOfServiceIds = [];
        this.ruleIds = [];
        this.referenceIds = [];
    }
}
