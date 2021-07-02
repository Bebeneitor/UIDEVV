export class EclColumnStyles {
    css: any; // {'display': 'none', 'color': 'black'}
    condition: EclColumnStyleCondition;

    constructor(css: any, condition: EclColumnStyleCondition) {
        this.css = css;
        this.condition = condition;
    }
}

export class EclColumnStyleCondition {
    field: string;
    operator: string;
    value: string;

    constructor(field: string, operator: string, value: string) {
        this.field = field;
        this.operator = operator;
        this.value = value;
    }
}