export interface RuleApplication {
    id: number,
    eclRuleId: string,
    conceptName?: string,
    dataOfServiceStart?: string,
    dateOfServiceEnd?: Date,
    implementationDt?: Date,
    ruleCategoryId?: number,
    ruleSequenceNum?: number,
    startDt?: Date,
    endDt?: Date,
    midRule?: number,
    subRule?: number,
    ruleDescription?: string,
    workOrderNumber?: number,
    version?: string,
    details?: string
}