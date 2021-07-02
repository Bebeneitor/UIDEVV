import { DiffArrayUtils } from './diff-array-utils';

export class ProcCodesUtils {
    /** List separator char. */
    public static CODE_LIST_SEP = ',';
    /** Codes Range char */
    public static CODE_RANGE_SEP = '-';
    /** Reg exp to include codes range */
    public static procCodeAndSepRegexp = /[^\s\,\-]+|\,|\-/ig;
    /** reg exp CPT procedure code */
    public static hspcsCodeRegexp = /^[A-Z0-9]\d{3,3}[A-Z0-9]$/i;
    /** regexp for IDC-9 codes */
    public static icd9CodeRegexp = /^[V\d]\d{2}(\.?\d{0,2})?$|^E\d{3}(\.?\d)?$|^\d{2}(\.?\d{0,2})$/i;
    /** regexp for IDC-10 codes */
    public static icd10CodeRegexp = /^[A-TV-Z][0-9][A-Z0-9](\.[A-Z0-9]{0,4})?$/i;
    /** regexp to match cpt, hcpcs, idc9, idc10 codes */
    public static allCodesRegexp = /[^\s\,\-]+/g;
    /** Not a separator */
    public static notSeparator = /[^ \-\+\,]/;

    public static GLOB_RANGE_INIT_1 = '00000';
    public static GLOB_RANGE_INIT_2 = 'A0000';
    public static GLOB_RANGE_END_1 = 'Z9999';
    public static GLOB_RANGE_END_2 = '09999';
    public static GLOB_RANGE_END_3 = '99999';


    private static regExpByCodeType = {
        CPT: ProcCodesUtils.hspcsCodeRegexp,
        HCPCS: ProcCodesUtils.hspcsCodeRegexp,
        ICD: ProcCodesUtils.icd10CodeRegexp,
        ALL: ProcCodesUtils.allCodesRegexp
    };

    private static containsInitalGlobalRange(item: string): boolean {
        return (item.indexOf(ProcCodesUtils.GLOB_RANGE_INIT_1) >= 0 ||
            item.indexOf(ProcCodesUtils.GLOB_RANGE_INIT_2) >= 0)
    }
    private static containsEndGlobalRange(item: string): boolean {
        return (item.indexOf(ProcCodesUtils.GLOB_RANGE_END_1) >= 0 ||
            item.indexOf(ProcCodesUtils.GLOB_RANGE_END_2) >= 0 ||
            item.indexOf(ProcCodesUtils.GLOB_RANGE_END_3) >= 0)
    }

    public static isGlobalRange(item: string): boolean {
        if (!item) {
            return false;
        }
        return item.indexOf(ProcCodesUtils.CODE_RANGE_SEP) >= 0 &&
            ProcCodesUtils.containsInitalGlobalRange(item) &&
            ProcCodesUtils.containsEndGlobalRange(item);
    }
    
    /**
     * Extract procedure codes from string.
     * @param procCodesStr String containing procedure codes.
     */
    public static extractProcedureCodes(procCodesStr:string): string[] {
        if (!procCodesStr) {
            return [];
        }
        let items = procCodesStr.split(ProcCodesUtils.CODE_LIST_SEP);
        procCodesStr = items.filter(it => !ProcCodesUtils.isGlobalRange(it)).join(ProcCodesUtils.CODE_LIST_SEP);

        let ret = procCodesStr.match(this.allCodesRegexp);
        if (DiffArrayUtils.isArrayEmpty(ret)) {
            return [];
        } 
        return ret;
    }

    public static containsGlobalRange(procCodesStr: string): boolean {
        if (!procCodesStr) {
            return false;
        }
        return (procCodesStr.indexOf(ProcCodesUtils.GLOB_RANGE_INIT_1) >= 0) ||
            (procCodesStr.indexOf(ProcCodesUtils.GLOB_RANGE_INIT_2) >= 0)
    }
     /**
     * Tests if a string represents a Code Separator sring.
     * @param str String to test.
     */
    public static isCodeSeparator(str: string): boolean {
        return !this.notSeparator.test(str);
    }
    /**
     * Test if a string has a valid CPT, HCPCS, IDC9 or IDC10 format.
     * @param value string to test.
     */
    public static isProcCodeFormat(value: string): boolean {
        return value && (this.hspcsCodeRegexp.test(value) ||
            this.icd9CodeRegexp.test(value) ||
            this.icd10CodeRegexp.test(value));
    }

    /**
     * Test if a string has a valid CPT, HCPCS, IDC9 or IDC10 format.
     * @param value string to test.
     */
    public static isProcCodeTypeFormat(value: string, codeType:string): boolean {
        if (!codeType || codeType === 'ALL') {
            return this.isProcCodeFormat(value);
        }
        let regExp = this.regExpByCodeType[codeType];
        if (!regExp) {
            return false;
        }
        return regExp.test(value);
    }

    /** 
     * Extract unique procedures codes. 
     * @param procCodesStr String containing procedure codes.
     * @return array of unique procedure codes.
     */
    public static extractUniqueProcedureCodes(procCodesStr:string): string[] {
        let procCodes = this.extractProcedureCodes(procCodesStr);
        if (procCodes.length > 0) {
            procCodes = [... new Set(procCodes)];
        }
        return procCodes;
    }
    /**
     * Extract procedure codes and separators: only ',' and '-' ara allowed.
     * @param procCodeStr String containing procedures codes.
     */
    public static extractCodesAndSeparator(procCodeStr: string): string[] {
        if (!procCodeStr) {
            return [];
        }
        return procCodeStr.match(this.procCodeAndSepRegexp);
    }

    /**
     * Format a String with codes, removing all non-matching
     * @param procCodesStr String containing procedures codes.
     * @return String consistig only procedure codes.
     */
    public static extractProcCodesString(procCodeStr: string): string {
        if (!procCodeStr) {
            return '';
        }
        return this.extractCodesAndSeparator(procCodeStr).join('');
    }

    public static correctSeparatorFormat(sepValue: string, prevSepVal:string): string {
        if (!sepValue) {
            return sepValue;
        }
        if (prevSepVal && prevSepVal.indexOf(this.CODE_RANGE_SEP) >= 0) {
            sepValue = sepValue.replace(/[\-]/g, ',');
        }
        let indList = sepValue.indexOf(this.CODE_LIST_SEP);
        let indRange = sepValue.indexOf(this.CODE_RANGE_SEP);
        if (indList >= 0 || indRange >= 0) {
            indList = indList < 0 ? sepValue.length : indList;
            indRange = indRange < 0 ? sepValue.length : indRange;
            let ind = indList < indRange ? indList : indRange;
            sepValue = sepValue.substring(0, ind + 1)
                + sepValue.substring(ind + 1).replace(/[\,\-]/g, '');
        }
        return sepValue;
    }
}