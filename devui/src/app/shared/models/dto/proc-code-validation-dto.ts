export class ProcedureCodeValidationDto {
    codeName: string;
    codeStatus?: string;
    codeDescription?: string;
    isExisting?: boolean = false;
}