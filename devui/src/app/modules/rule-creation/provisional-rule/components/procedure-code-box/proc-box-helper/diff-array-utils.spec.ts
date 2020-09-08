import { DiffArrayUtils } from "./diff-array-utils"

describe('Utils: DiffArrayUtils', () => {
    beforeEach(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
    })

    it('isArrayEmpty - test notdefined', () => {
        let arr: any[];
        expect(DiffArrayUtils.isArrayEmpty(arr)).toBeTruthy();
    })
    it('isArrayEmpty - test null', () => {
        let arr: any[] = null;
        expect(DiffArrayUtils.isArrayEmpty(arr)).toBeTruthy();
    })
    it('isArrayEmpty - test length 0', () => {
        let arr: any[] = [];
        expect(DiffArrayUtils.isArrayEmpty(arr)).toBeTruthy();
    })
    it('isArrayEmpty - test not empty', () => {
        let arr: any[] = ['A', 'B'];
        expect(DiffArrayUtils.isArrayEmpty(arr)).toBeFalsy();
    })
    it ('arraysEquals - true', () => {
        let res = DiffArrayUtils.arraysEqual(['A', 'B'], ['A', 'B']);
        expect(res).toBeTruthy();
    })

    it ('arraysEquals - false', () => {
        let res = DiffArrayUtils.arraysEqual(['A', 'B'], ['A', 'C']);
        expect(res).toBeFalsy();
    })

    it ('isSubarray - no subarray', () => {
        let isSub = DiffArrayUtils.isSubarray(['A', 'B'], ['D']);
        expect(isSub).toBeFalsy();
    })

    it ('isSubarray - true one element', () => {
        let isSub = DiffArrayUtils.isSubarray(['A', 'B'], ['B']);
        expect(isSub).toBeTruthy();
    })

    it ('isSubarray - true - begin', () => {
        let isSub = DiffArrayUtils.isSubarray(['A', 'B', 'C', 'D'], ['A', 'B', 'C']);
        expect(isSub).toBeTruthy();
    })

    it ('isSubarray - true - end', () => {
        let isSub = DiffArrayUtils.isSubarray(['A', 'B', 'C', 'D'], ['C', 'D']);
        expect(isSub).toBeTruthy;
    })

    it ('isSubarray - true - middle', () => {
        let isSub = DiffArrayUtils.isSubarray(['A', 'B', 'C', 'D', 'E'], ['B', 'C', 'D']);
        expect(isSub).toBeTruthy();
    })

    it ('isSubarray - false - non contiguos', () => {
        let isSub = DiffArrayUtils.isSubarray(['A', 'B', 'C', 'D'], ['A', 'C']);
        expect(isSub).toBeFalsy();
    })

    it ('arrayIndexOfSubarray - simplest case', () => {
        let arr = ['A', 'B', 'C', 'D'];
        let sub = ['C'];
        let ind = DiffArrayUtils.arrayIndexOfSubarray(arr, sub);
        expect(ind).toBe(2);
    })

    it ('arrayIndexOfSubarray - sub is subarray', () => {
        let arr = ['A', 'B', 'C', 'D', 'E'];
        let sub = ['C', 'D', 'E'];
        let ind = DiffArrayUtils.arrayIndexOfSubarray(arr, sub);
        expect(ind).toBe(2);
    })
    it ('arrayIndexOfSubarray - no subarray', () => {
        let arr = ['A', 'B', 'C', 'D', 'E'];
        let sub = ['C', 'E', 'D'];
        let ind = DiffArrayUtils.arrayIndexOfSubarray(arr, sub);
        expect(ind).toBe(-1);
    })
    it ('arrayIndexOfSubarray - easy case', () => {
        let arr = ['A', 'B'];
        let sub = ['B'];
        let ind = DiffArrayUtils.arrayIndexOfSubarray(arr, sub);
        expect(ind).toBe(1);
    })


    it ('largestMatch - no match', () => {
        let match = DiffArrayUtils.arrayLargestMatch(['A', 'B', 'C', 'D'], ['E', 'F']);
        expect(match.length).toBe(0);
    })

    it ('largestMatch - match one-element', () => {
        let match = DiffArrayUtils.arrayLargestMatch(['A', 'B', 'C', 'D', 'E'], ['C']);
        expect(DiffArrayUtils.arraysEqual(match, ['C'])).toBeTruthy();
    })

    it ('largestMatch - match two-element', () => {
        let match = DiffArrayUtils.arrayLargestMatch(['A', 'B', 'C', 'D', 'E'], ['C', 'D']);
        expect(DiffArrayUtils.arraysEqual(match, ['C', 'D'])).toBeTruthy();
    })

    it ('largestMatch - easy case', () => {
        let match = DiffArrayUtils.arrayLargestMatch(['A', 'B'], ['B', 'C']);
        expect(DiffArrayUtils.arraysEqual(match, ['B'])).toBeTruthy();
    })

    it ('largestMatch - easy case 2', () => {
        let match = DiffArrayUtils.arrayLargestMatch(['F', 'G'], ['F', 'Z', 'W']);
        expect(DiffArrayUtils.arraysEqual(match, ['F'])).toBeTruthy();
    })

    it ('largestMatch - match general', () => {
        let match = DiffArrayUtils.arrayLargestMatch(['A', 'B', 'C', 'D', 'E', 'F', 'G'], ['A', 'B', 'E', 'F', 'G']);
        expect(DiffArrayUtils.arraysEqual(match, ['E', 'F', 'G'])).toBeTruthy();
    })
    
    it ('largestMatch - match general-2', () => {
        let match = DiffArrayUtils.arrayLargestMatch(['A', 'B', 'C', 'D', 'E', 'F', 'G'], 
            ['X', 'A', 'B', 'Y', 'E', 'F', 'Z', 'W']);
        expect(DiffArrayUtils.arraysEqual(match, ['E', 'F']) ||
        DiffArrayUtils.arraysEqual(match, ['A', 'B'])).toBeTruthy();
    })

    it ('arrayDiff - simplest case', () => {
        let arr1 = ['A', 'B'];
        let arr2 = ['D', 'E'];
        let res = DiffArrayUtils.diff(arr1, arr2);
        expect(res.length).toBe(2);
        expect(DiffArrayUtils.arraysEqual(res[0]['deleted'], ['A', 'B'])).toBeTruthy();
        expect(DiffArrayUtils.arraysEqual(res[1]['inserted'], ['D', 'E'])).toBeTruthy();
    })

    it ('arrayDiff - one retained beginning', () => {
        let arr1 = ['A', 'D'];
        let arr2 = ['A', 'B', 'C'];
        let res = DiffArrayUtils.diff(arr1, arr2);
        expect(res.length).toBe(3);
        expect(DiffArrayUtils.arraysEqual(res[0]['retained'], ['A'])).toBeTruthy();
        expect(DiffArrayUtils.arraysEqual(res[1]['deleted'], ['D'])).toBeTruthy();
        expect(DiffArrayUtils.arraysEqual(res[2]['inserted'], ['B', 'C'])).toBeTruthy();
    })

    it ('arrayDiff - one retained middle part', () => {
        let arr1 = ['A', 'B'];
        let arr2 = ['B', 'C'];
        let res = DiffArrayUtils.diff(arr1, arr2);
        expect(res.length).toBe(3);
        expect(DiffArrayUtils.arraysEqual(res[0]['deleted'], ['A'])).toBeTruthy();
        expect(DiffArrayUtils.arraysEqual(res[1]['retained'], ['B'])).toBeTruthy();
        expect(DiffArrayUtils.arraysEqual(res[2]['inserted'], ['C'])).toBeTruthy();
    })

    it ('arrayDiff - complex case', () => {
        let arr1 = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
        let arr2 = ['X', 'A', 'B', 'Y', 'E', 'F', 'Z', 'W'];
        let res = DiffArrayUtils.diff(arr1, arr2);
        expect(DiffArrayUtils.arraysEqual(res[0]['inserted'], ['X'])).toBeTruthy();
        expect(DiffArrayUtils.arraysEqual(res[1]['retained'], ['A','B'])).toBeTruthy();
        expect(DiffArrayUtils.arraysEqual(res[2]['deleted'], ['C', 'D'])).toBeTruthy();
        expect(DiffArrayUtils.arraysEqual(res[3]['inserted'], ['Y'])).toBeTruthy();
        expect(DiffArrayUtils.arraysEqual(res[4]['retained'], ['E', 'F'])).toBeTruthy();
        expect(DiffArrayUtils.arraysEqual(res[5]['deleted'], ['G'])).toBeTruthy();
        expect(DiffArrayUtils.arraysEqual(res[6]['inserted'], ['Z', 'W'])).toBeTruthy();
    })

    it ('arrayDiff - review case', () => {
        /*
            let codesStr = 'A0002,C0005-C0010,D0001';
            let origStr = 'A0001,C0001-C0010';
            let expected = 'A0001A0002,C0001C0005-C0010,D0001';
        */
        let arr1 = ['A', 'B', 'C', 'D', 'E'];
        let arr2 = ['U', 'B', 'V', 'D', 'E', 'W', 'X'];
        let res = DiffArrayUtils.diff(arr1, arr2);
        /*
        expect(DiffArrayUtils.arraysEqual(res[0]['inserted'], ['X'])).toBeTruthy();
        expect(DiffArrayUtils.arraysEqual(res[1]['retained'], ['A','B'])).toBeTruthy();
        expect(DiffArrayUtils.arraysEqual(res[2]['deleted'], ['C', 'D'])).toBeTruthy();
        expect(DiffArrayUtils.arraysEqual(res[3]['inserted'], ['Y'])).toBeTruthy();
        expect(DiffArrayUtils.arraysEqual(res[4]['retained'], ['E', 'F'])).toBeTruthy();
        expect(DiffArrayUtils.arraysEqual(res[5]['deleted'], ['G'])).toBeTruthy();
        expect(DiffArrayUtils.arraysEqual(res[6]['inserted'], ['Z', 'W'])).toBeTruthy();
        */
    })

    it ('arrayDiff - review case codes', () => {
        /*
            let codesStr = 'A0002,C0005-C0010,D0001';
            let origStr = 'A0001,C0001-C0010';
            let expected = 'A0001A0002,C0001C0005-C0010,D0001';
        */
        let arr1 = ['A0001', ',', 'C0005', '-', 'C0010'];
        let arr2 = ['A0002', ',', 'C0001', '-', 'C0010', ',', 'D0001'];
        let res = DiffArrayUtils.diff(arr1, arr2);
        /*
        expect(DiffArrayUtils.arraysEqual(res[0]['inserted'], ['X'])).toBeTruthy();
        expect(DiffArrayUtils.arraysEqual(res[1]['retained'], ['A','B'])).toBeTruthy();
        expect(DiffArrayUtils.arraysEqual(res[2]['deleted'], ['C', 'D'])).toBeTruthy();
        expect(DiffArrayUtils.arraysEqual(res[3]['inserted'], ['Y'])).toBeTruthy();
        expect(DiffArrayUtils.arraysEqual(res[4]['retained'], ['E', 'F'])).toBeTruthy();
        expect(DiffArrayUtils.arraysEqual(res[5]['deleted'], ['G'])).toBeTruthy();
        expect(DiffArrayUtils.arraysEqual(res[6]['inserted'], ['Z', 'W'])).toBeTruthy();
        */
    })

    it ('subarray index - equal', () => {
        let arr1 = ['A', 'B', 'C'];
        let arr2 = ['A', 'B', 'C'];
        let res = DiffArrayUtils.arrayIndexOfSubarray(arr1, arr2);
        expect(res).toBe(0);
    })

    it ('big array dif - 100', ()=> {
        let values = generateBigArrays(100, 10, 5);
        let res = DiffArrayUtils.diff(values.origin, values.current);
        expect(res).toBeDefined();
    })

    it ('new Diff Alg - Big', () => {
    let values = generateBigArrays(400, 200, 20);
    let res = DiffArrayUtils.diff(values.origin, values.current);
    //console.log(JSON.stringify(res));
    })
   
})

function generateArr(pref: string, cnt: number): string[] {
    let ret = [];
    for (let i = 0; i < cnt; i++) {
        let entry = '0000' + i;
        ret.push(pref + entry.substr(entry.length - 4));
    }
    return ret;
}

function generateBigArrays(cnt: number, difCnt: number, difAdd: number) {
    let origin = generateArr('A', cnt);
    let current = generateArr('A', cnt);
    // some differences.
    let pref = 'B';
    let cntDif = cnt / difAdd;
    for (let j = 0; j < cntDif; j++) {
        let tmpArr = generateArr(String.fromCharCode(pref.charCodeAt(0) + j), difAdd);        
        current.splice(j * difCnt, difAdd, ...tmpArr);
    }
    return {origin: origin, current: current};
}