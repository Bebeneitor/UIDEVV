export class ProcCodeClassesHelper {
        /**  span's class names.*/
        public static ITEM_CODE_CLASS = 'item-code';
        public static VALID_CODE_CLASS = 'valid-code';
        public static INVALID_CODE_CLASS = 'invalid-code';
        public static BAD_FORMAT_CODE_CLASS='badformat-code';
        public static RETAINED_CODE_CLASS = 'retained-code';
        public static RETAINED_BAD_CODE_CLASS = 'retained-bad-code';
        public static INV_RETAINED_CODE_CLASS = 'inv-retained-code';
        public static VAL_RETAINED_CODE_CLASS = 'valid-retained-code';
        public static ADDED_CODE_CLASS = 'inserted-code';
        public static INV_ADDED_CODE_CLASS = 'inv-inserted-code';
        public static VAL_ADDED_CODE_CLASS = 'valid-inserted-code';
        public static ADDED_BAD_CODE_CLASS = 'inserted-bad-code';
        public static DELETED_CODE_CLASS = 'deleted-code';
        public static CODE_SEP_CLASS = 'code-sep';
        public static ADDED_SEP_CLASS = 'inserted-sep';
        public static RETAINED_SEP_CLASS = 'retained-sep';
        public static DELETED_SEP_CLASS = 'deleted-sep';
     /**
     * Tests if element represents a delented code item.
     * @param elem element to test.
     */
    public static isElementCodeDeleted(elem: Element): boolean {
        return elem && elem.classList.contains(ProcCodeClassesHelper.DELETED_CODE_CLASS);
    }
    /**
     * Tests if element represents a delented code item.
     * @param elem element to test.
     */
    public static isElementSep(elem: Element): boolean {
        return elem && elem.className.indexOf('-sep') >= 0;
    }
    /**
     * Tests if element represents a code item.
     * @param elem element to test.
     */
    public static isElementValidCode(elem: Element): boolean {
        return elem && (elem.classList.contains(ProcCodeClassesHelper.VALID_CODE_CLASS) ||
            elem.classList.contains(this.VAL_RETAINED_CODE_CLASS) ||
            elem.classList.contains(this.VAL_ADDED_CODE_CLASS));
    }
    /**
     * Tests if element represents a bad code item.
     * @param elem element to test.
     */
    public static isElementBadCode(elem: Element): boolean {
        return elem && elem.className.indexOf("bad") >= 0 && elem.className.indexOf("code") >= 0;
    }

    /**
     * Tests if element represents a deleted code item.
     * @param elem element to test.
     */
    public static isElementInvalidCode(elem: Element): boolean {
        return elem && elem.className.indexOf('inv') >= 0 && 
            elem.className.endsWith('code');
    }
    /**
     * Tests if element represents an added code item.
     * @param elem element to test.
     */
    public static isItemAdded(elem: Element): boolean {
        return elem && elem.className.indexOf('inserted') >= 0;
    }
    /**
     * Tests if element represents a delented code item.
     * @param elem element to test.
     */
    public static isElementAddedSep(elem: Element): boolean {
        return elem && elem.classList.contains(ProcCodeClassesHelper.ADDED_SEP_CLASS);
    }
    /**
     * Tests if element represents a retained code item.
     * @param elem element to test.
     */
    public static isElementRetained(elem: Element): boolean {
        return elem && elem.className.indexOf('retained') >= 0 &&
            elem.className.indexOf('code') >= 0;
    }
    /**
     * Tests if element represents a retained code item.
     * @param elem element to test.
     */
    public static isItemRetained(elem: Element): boolean {
        return elem && elem.className.indexOf('retained') >= 0;
    }
    /**
     * Tests if element represents a retained sep item.
     * @param elem element to test.
     */
    public static isElementDeletedSep(elem: Element): boolean {
        return elem && elem.classList.contains(ProcCodeClassesHelper.DELETED_SEP_CLASS);
    }
    /**
     * Tests if element represents a retained sep item.
     * @param elem element to test.
     */
    public static isItemDeleted(elem: Element): boolean {
        return elem && elem.className.indexOf('deleted') >= 0;
    }

    /**
     * Tests if element represents a retained sep item.
     * @param elem element to test.
     */
    public static isElementRetainedSep(elem: Element): boolean {
        return elem && elem.classList.contains(ProcCodeClassesHelper.RETAINED_SEP_CLASS);
    }

    public static isElementCode(elem: Element): boolean {
        return elem && elem.className.endsWith('code');
    }

    public static getProcFormatClass(elem: Element, isCodeFormat: boolean): string {
        if (!elem) {
            return '';
        }
        if (this.isItemDeleted(elem)) {
            return elem.className;
        }
        if (this.isItemAdded(elem)) {
            return isCodeFormat ? this.ADDED_CODE_CLASS : this.ADDED_BAD_CODE_CLASS;
        }
        if (this.isItemRetained(elem)) {
            return isCodeFormat ? this.RETAINED_CODE_CLASS : this.RETAINED_BAD_CODE_CLASS; 
        }
        if (this.isElementCode) {
            return isCodeFormat ? this.ITEM_CODE_CLASS : this.BAD_FORMAT_CODE_CLASS;
        }
        return elem.className;
    }

    public static getProcValidationClass(elem: Element, isValid: boolean) {
        if (!elem) {
            return '';
        }
        if (this.isItemDeleted(elem)) {
            return elem.className;
        }
        if (this.isItemAdded(elem)) {
            return isValid ? this.VAL_ADDED_CODE_CLASS : this.INV_ADDED_CODE_CLASS;
        }
        if (this.isItemRetained(elem)) {
            return isValid ? this.VAL_RETAINED_CODE_CLASS : this.INV_RETAINED_CODE_CLASS; 
        }
        if (this.isElementCode) {
            return isValid ? this.VALID_CODE_CLASS : this.INVALID_CODE_CLASS;
        }
        return elem.className;
    }

}