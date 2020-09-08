/**
 * Utility class to find arrays differences.
 */
export class DiffArrayUtils {
    /**
     * Test if an array is null, undefined or empty.
     * @param arr array to test.
     */
    public static isArrayEmpty(arr: any[]): boolean {
        return (!Array.isArray(arr) || arr.length == 0);
    }

    /**
     * Tests if two arrays are equals (ie they have same entry values in same order)
     * @param arr1 first array.
     * @param arr2 second array.
     */
    public static arraysEqual(arr1: any[], arr2: any[]): boolean {
        if (arr1 === arr2) {
            return true;
        }
        if (!arr1 || !arr2) {
            return false;
        }
        if (arr1.length != arr2.length) {
            return false;
        }
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }
        return true;
    }
    /**
     * Find subarray index inside a given array. Looks for subarray
     * in same elements order.
     * @param arr First array.
     * @param sub sub array.
     * @returns -1 if sub is not a subarray or arr or sub are not defined.
     */
    public static arrayIndexOfSubarray(arr: any[], sub: any[]): number {
        if (this.isArrayEmpty(arr) || this.isArrayEmpty(sub)) {
            return -1;
        }
        if (arr.length < sub.length) {
            return -1;
        }
        let ind = 0;
        let topInd = arr.indexOf(sub[sub.length - 1]);
        if (topInd < 0) {
            return -1;
        }
        while (ind + sub.length <= topInd + 1) {
            ind = arr.indexOf(sub[0], ind);
            if (ind < 0) {
                return -1;
            }
            let allMatch = true;
            for (let j = 1; j < sub.length && ind + j <= topInd; j++) {
                if (arr[ind + j] !== sub[j]) {
                    allMatch = false;
                    break;
                }
            }
            if (allMatch) {
                return ind;
            }
            ind++;
        }
        return -1;
    }
    /**
     * Test if an array is a subarray of given array (it means, all element in subarray are
     * present in the given array in the same contiguos order)
     * @param mainArray Array to verify.
     * @param toTest subarray to test.
     */
    public static isSubarray(mainArray: any[], toTest: any[]): boolean {
        return this.arrayIndexOfSubarray(mainArray, toTest) >= 0;
    }
    /**
     * Finds the largest match (elements and order) between
     *   two array.
     * @param oldArray first array.
     * @param newArray second array.
     * @returns array with the largest subarray match.
     */
    public static arrayLargestMatch(oldArray: any[], newArray: any[]): any[] {
        if (newArray.length < oldArray.length) {
          return this.arrayLargestMatch(newArray, oldArray);
        }
        // start with complete oldArray length.
        let matchingLength = oldArray.length;
        while (matchingLength > 0) {
            // test if matchingLength oldArray sub is found in newArray
            let index = 0;
            while (index + matchingLength <= newArray.length + 1) {
                let possibleMatch = newArray.slice(index, index + matchingLength);
                if (this.isSubarray(oldArray, possibleMatch)) {
                    // match found:
                    return possibleMatch;
                }
                index++;
            }
            // decrease lengh of possible match
            matchingLength--;
        }
        // no match found
        return [];
    }
    /**
     * Finds differences between two arrays expressed as an array of
     * 'operations': deleted, inserted, retained.
     * @param oldArray old Array to test.
     * @param newArray new array to test.
     */
    public static diff2(oldArray: any[], newArray: any[]): any[] {
        // Find largest match.
        let largestMatch = this.arrayLargestMatch(oldArray, newArray);
        if (largestMatch.length == 0) {
            // no match. old array was deleted and new array was inserted.
            let ret = [];
            if (!this.isArrayEmpty(oldArray)) {
                ret.push({deleted: oldArray});
            }
            if (!this.isArrayEmpty(newArray)) {
                ret.push({inserted: newArray});
            }
            return ret;
        } else {
            let indNew = this.arrayIndexOfSubarray(newArray, largestMatch);
            let indOld = this.arrayIndexOfSubarray(oldArray, largestMatch);
            // Initial not-matching parts.
            let preNew = newArray.slice(0, indNew);
            let preOld = oldArray.slice(0, indOld);
            // Ending not matching parts.
            let postNew = newArray.slice(preNew.length + largestMatch.length);
            let postOld = oldArray.slice(preOld.length + largestMatch.length);
            // recursively find diff between initial non matching parts
            let retVal = this.diff2(preOld, preNew);
            // add the retained part
            retVal.push({retained: largestMatch});
            // recursively find diff between ending non matching parts
            retVal = retVal.concat(this.diff2(postOld, postNew));
            return retVal;
        }
    }
    /**
     * Second (faster) diff algorithm.
     * @param oldVal old Array Value.
     * @param newVal new Array Value.
     */
    public static diff(oldVal: any[], newVal:any[]): any[] {
        let difVal = this.diffIsol(oldVal, newVal);
        //console.log('oldVal:' + JSON.stringify(oldVal) + '\nnewVal:' + JSON.stringify(newVal));
        //console.log('dif.o:' + JSON.stringify(difVal.o));
        //console.log('dif.n:' + JSON.stringify(difVal.n));
        let retVal: any[] = [];
        if (difVal.n.length === 0) {
            // all oldValues were deleted
            retVal.push({deleted: difVal.o});
        } else {
            // pick initial oldVal deleted items.
            if (difVal.n[0].text == null) {
                // for an added value.
                let op = { deleted: [] };
                for (let i = 0; i < difVal.o.length && difVal.o[i].text == null; i++) {
                    op.deleted.push(difVal.o[i]);
                }
                if (op.deleted.length > 0) {
                    retVal.push(op);
                }
            } else {
                // for a retained value.
                let delOp = { deleted: [] };
                for (let i = 0; i < difVal.n[0].pos; i++) {
                    if (difVal.o[i].text == null) {
                        delOp.deleted.push(difVal.o[i]);
                    } else {
                        delOp.deleted.push(difVal.o[i].text)
                    }
                }
                if (delOp.deleted.length > 0) {
                    retVal.push(delOp);
                }
            }
            // determine next operations.
            let curOp:any = {};
            for (let i = 0; i < difVal.n.length; i++) {
                //console.log('difVal.n[' + i + ']:' + JSON.stringify(difVal.n[i]));
                if (difVal.n[i].text == null) {
                    if (curOp) {
                        if (curOp.inserted) {
                            curOp.inserted.push(difVal.n[i])
                        } else {
                            curOp = { inserted: [difVal.n[i]] };
                            retVal.push(curOp);
                        }
                    }
                } else {
                    if (curOp) {
                        if (curOp.retained) {
                            curOp.retained.push(difVal.n[i].text);
                        } else {
                            curOp = { retained: [difVal.n[i].text] };
                            retVal.push(curOp);
                        }
                    }
                    // find oldValue next deleted items:
                    let delnextOp = { deleted: [] };
                    for (let n = difVal.n[i].pos + 1; n < difVal.o.length && difVal.o[n].text == null; n++) {
                        delnextOp.deleted.push(difVal.o[n]);
                    }
                    if (delnextOp.deleted.length > 0) {
                        retVal.push(delnextOp);
                    }
                }
            }
        }
        //console.log('diff:' + JSON.stringify(retVal));
        return retVal;
    }

    /**
     * Find array differences.
     * @param oldVal First array.
     * @param newVal Second array.
     */
    public static diffIsol( oldVal: any[], newVal: any[]): any {
        var oldSymbols = {};
        var newSymbols = {};
        oldVal = oldVal.slice();
        newVal = newVal.slice();
        for ( let i = 0; i < oldVal.length; i++ ) {
            oldSymbols[ oldVal[i] ] = { pos: new Array(), n: null };
            oldSymbols[ oldVal[i] ].pos.push( i );
        }
        for ( let i = 0; i < newVal.length; i++ ) {
            newSymbols[ newVal[i] ] = { pos: new Array(), o: null };
            newSymbols[ newVal[i] ].pos.push( i );
        }
        for ( let i in newSymbols ) {
          if ( newSymbols[i].pos.length == 1 && typeof(oldSymbols[i]) != "undefined" && oldSymbols[i].pos.length == 1 ) {
            newVal[ newSymbols[i].pos[0] ] = { text: newVal[ newSymbols[i].pos[0] ], pos: oldSymbols[i].pos[0] };
            oldVal[ oldSymbols[i].pos[0] ] = { text: oldVal[ oldSymbols[i].pos[0] ], pos: newSymbols[i].pos[0] };
          }
        }
        
        for ( let i = 0; i < newVal.length - 1; i++ ) {
          if ( newVal[i].text != null && newVal[i+1].text == null && newVal[i].pos + 1 < oldVal.length && oldVal[ newVal[i].pos + 1 ].text == null && 
               newVal[i+1] == oldVal[ newVal[i].pos + 1 ] ) {
            newVal[i+1] = { text: newVal[i+1], pos: newVal[i].pos + 1 };
            oldVal[newVal[i].pos+1] = { text: oldVal[newVal[i].pos+1], pos: i + 1 };
          }
        }
        
        for ( let i = newVal.length - 1; i > 0; i-- ) {
          if ( newVal[i].text != null && newVal[i-1].text == null && newVal[i].pos > 0 && oldVal[ newVal[i].pos - 1 ].text == null && 
               newVal[i-1] == oldVal[ newVal[i].pos - 1 ] ) {
            newVal[i-1] = { text: newVal[i-1], pos: newVal[i].pos - 1 };
            oldVal[newVal[i].pos-1] = { text: oldVal[newVal[i].pos-1], pos: i - 1 };
          }
        }
        
        return { o: oldVal, n: newVal };
      }
      
}
