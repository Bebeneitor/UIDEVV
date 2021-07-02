export class EclButtonTable {
    
    text: string;
    isField: boolean;
    conditions: EclButtonTableCondition[];
    icon: string;

    constructor(text: string, isField: boolean = false, 
        conditions?: EclButtonTableCondition[], icon?: string) {
        this.text = text;
        this.isField = isField;
        if (isField){
            //Conditions are only used when the text is a field.
            this.conditions = conditions;
        }
        this.icon = icon;
    }

}

/*
* This class is used to add conditions in order to display a dinamic text.
*/
export class EclButtonTableCondition {

    operator: string;
    value: string;
    outputText : string

    constructor(operator: string, value: string, outputText: string) {
        this.operator = operator;
        this.value = value;
        this.outputText = outputText;
    }
    
}