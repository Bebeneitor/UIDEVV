export class EclCacheLbvSearchDto {
    preOperator: string;
    subject: string;
    operator: string;
    value: string;
    postOperator: string;
    associateCondition  : EclCacheLbvSearchDto[];
}