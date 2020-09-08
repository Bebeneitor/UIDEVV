import { ProcCodesUtils } from "./proc-codes-utils"

describe('procedureCodesUtils', () => {
    it('extract proc codes - comma separated', () => {
        let codes = ProcCodesUtils.extractProcedureCodes('A0000, A00001, B0012 - B0036');
        expect(codes.length).toBe(4);
        expect(codes.indexOf('A0000') >= 0).toBeTruthy();
        expect(codes.indexOf('B0036') >= 0).toBeTruthy();
    })

    it ('test format hspc - invalid format', () => {
        let val = ProcCodesUtils.isProcCodeFormat('*%A23');
        expect(val).toBeFalsy();
    })

    it ('test format hspc', () => {
        let val = ProcCodesUtils.isProcCodeFormat('A213B');
        expect(val).toBeTruthy();
    })

    it ('test format idc9', () => {
        let val = ProcCodesUtils.isProcCodeFormat('A10.2');
        expect(val).toBeTruthy();
    })

    it('extract proc codes - range', () => {
        let codes = ProcCodesUtils.extractProcedureCodes('A0000 - A0010');
        expect(codes.length).toBe(2);
        expect(codes.indexOf('A0000')).toBe(0);
        expect(codes.indexOf('A0010')).toBe(1);
    })
 
    it('extract code Items - comma and ranges', () => {
        let procItems = ProcCodesUtils.extractUniqueProcedureCodes('C0001, C0002, A0000 - A0010, D0010-D0090');
        expect(procItems).toBeDefined();
        expect(procItems.length).toBeGreaterThan(0);
        expect(procItems.indexOf('C0001')).toBe(0);
        expect(procItems.indexOf('C0002')).toBe(1);
        expect(procItems.indexOf('A0000')).toBe(2);
        expect(procItems.indexOf('A0010')).toBe(3);
        expect(procItems.indexOf('D0010')).toBe(4);
        expect(procItems.indexOf('D0090')).toBe(5);
    })

    it('extract code Items - Remove duplicated', () => {
        let procItems = ProcCodesUtils.extractUniqueProcedureCodes('C0001, C0001, D0010 - D0010');
        expect(procItems).toBeDefined();
        expect(procItems.length).toBe(2);
        expect(procItems.indexOf('C0001')).toBe(0);
        expect(procItems.indexOf('D0010')).toBe(1);
    })
    
    it('extract procCodes and separator - comma', () => {
        let procItems = ProcCodesUtils.extractCodesAndSeparator('A1200, B1232');
        expect(procItems[0]).toBe('A1200');
        expect(procItems[1]).toBe(',');
        expect(procItems[2]).toBe('B1232');
    })

    it('extract procCodes and separator - range', () => {
        let procItems = ProcCodesUtils.extractCodesAndSeparator('A1200- B1232');
        expect(procItems[0]).toBe('A1200');
        expect(procItems[1]).toBe('-');
        expect(procItems[2]).toBe('B1232');
    })

    it('extract procCodes and separator - comma and range', () => {
        let procItems = ProcCodesUtils.extractCodesAndSeparator('1234A, A1200- B1232, 56712');
        expect(procItems[0]).toBe('1234A');
        expect(procItems[1]).toBe(',');
        expect(procItems[2]).toBe('A1200');
        expect(procItems[3]).toBe('-');
        expect(procItems[4]).toBe('B1232');
        expect(procItems[5]).toBe(',');
        expect(procItems[6]).toBe('56712');
    })
    
    it('format String - all case', () => {
        let initial = '12313,2345F,J1235-J342';
        let actual = ProcCodesUtils.extractProcCodesString(initial);
        expect(actual).toBe(initial);
    }) 
    
    it('vaidate format code', () => {
        let res = ProcCodesUtils.isProcCodeTypeFormat('A1010', 'HCPCS');
        expect(res).toBeTruthy();
    })
})