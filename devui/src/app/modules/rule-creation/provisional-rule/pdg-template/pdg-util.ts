import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { PdgTemplateService } from 'src/app/services/pdg-template.service';
import { EclReferenceDto } from 'src/app/shared/models/dto/ecl-reference-dto';
import { PdgTemplateDto } from 'src/app/shared/models/dto/pdg-dto';
import { MessageSend } from 'src/app/shared/models/messageSend';
import { RuleInfo } from 'src/app/shared/models/rule-info';
import { AppUtils } from 'src/app/shared/services/utils';
import { PdgConstants } from './pdg-constants';

enum image_extn {
    gif = 'gif',
    jpg = 'jpg',
    jpeg = 'jpeg',
    png = 'png'
};

@Injectable({
    providedIn: 'root'
})

export class PdgUtil {

    constructor(private datepipe: DatePipe, private pdgTemplateService: PdgTemplateService, private utils: AppUtils) {
    }

    transformDosFromDate(evt, pdgDosDateObj: PdgTemplateDto) {
        if (evt) {
            pdgDosDateObj.dosFrom = this.datepipe.transform(evt, 'MM-dd-yyyy');
        } else {
            pdgDosDateObj.dosFrom = null;
        }
    }

    transformDosToDate(evt, pdgDosDateObj: PdgTemplateDto) {
        if (evt) {
            pdgDosDateObj.dosTo = this.datepipe.transform(evt, 'MM-dd-yyyy');
        } else {
            pdgDosDateObj.dosTo = null;
        }
    }

    setClaimTypeToolTip(pdgTemplateObj, optionsObj, toolTips) {
        if (pdgTemplateObj && pdgTemplateObj.claimTypesSelection) {
            if (optionsObj) {
                toolTips.selectedClaimTypesToolTip = optionsObj.filter(claim => pdgTemplateObj.claimTypesSelection.includes(claim.value)).map(claim => claim.label).join(',\n');
            }
        }
    }

    setReasonCodeToolTip(ruleInfo, optionsReaonCodes, toolTips) {
        if (ruleInfo && ruleInfo.pdgTemplateDto && ruleInfo.pdgTemplateDto.reasonCodeAndDescription) {
            if (optionsReaonCodes && optionsReaonCodes.length > 1) {
                toolTips.selectedRCodeToolTip = optionsReaonCodes.filter(rcode => ruleInfo.pdgTemplateDto.reasonCodeAndDescription == rcode.value)[0].label;
            }
        }
    }

    setStateToolTip(selectedStates, optionList, toolTip) {
        if (selectedStates) {
            toolTip.selectedStateToolTip = optionList.filter(state => selectedStates.includes(state.value)).map(state => state.label).join(',\n');
        }
    }

    setDefaultValueForDuplicateCheck(ruleInfo: RuleInfo) {
        if (ruleInfo.pdgTemplateDto) {
            !ruleInfo.pdgTemplateDto.isPdgTrackerReportDuplicate ? ruleInfo.pdgTemplateDto.isPdgTrackerReportDuplicate = null : '';
            !ruleInfo.pdgTemplateDto.isTempRuleDbDuplicate ? ruleInfo.pdgTemplateDto.isTempRuleDbDuplicate = null : '';
            !ruleInfo.pdgTemplateDto.isRulesSearchDuplicate ? ruleInfo.pdgTemplateDto.isRulesSearchDuplicate = null : '';
            !ruleInfo.pdgTemplateDto.isMaxUnitsDuplicate ? ruleInfo.pdgTemplateDto.isMaxUnitsDuplicate = null : '';
            !ruleInfo.pdgTemplateDto.isBoDuplicate ? ruleInfo.pdgTemplateDto.isBoDuplicate = null : '';
            !ruleInfo.pdgTemplateDto.isRmiDuplicate ? ruleInfo.pdgTemplateDto.isRmiDuplicate = null : '';
            !ruleInfo.pdgTemplateDto.isCciDuplicate ? ruleInfo.pdgTemplateDto.isCciDuplicate = null : '';
        }
    }

    validateReferenceUrl(refUrl): boolean {
        let url = refUrl;
        let res = true;
        if (url) {
            if (url.substring(0, 7) === 'http://' || url.substring(0, 8) === 'https://') {
                res = true;
            } else {
                res = false;
            }
        }
        return res;
    }

    setReferenceObject(refParam) {
        if (refParam.referenceObj.addedCommentFile1) {
            if (null == refParam.referenceObj.eclAttachmentNameList
                || typeof refParam.referenceObj.eclAttachmentNameList == undefined) {
                refParam.referenceObj.eclAttachmentNameList = [];
            }
            refParam.referenceObj.eclAttachmentNameList.push(refParam.referenceObj.addedCommentFile1.name);
            refParam.refComment1Files = [];
            refParam.refComment1Files.push(refParam.referenceObj.addedCommentFile1);
        }

        if (refParam.referenceObj.addedCommentFile2) {
            if (null == refParam.referenceObj.eclAttachmentNameList
                || typeof refParam.referenceObj.eclAttachmentNameList == undefined) {
                refParam.referenceObj.eclAttachmentNameList = [];
            }
            refParam.referenceObj.eclAttachmentNameList.push(refParam.referenceObj.addedCommentFile2.name);
            refParam.refComment2Files = [];
            refParam.refComment2Files.push(refParam.referenceObj.addedCommentFile2);
        }

        if (refParam.referenceObj.addedRefDoc1) {
            if (refParam.referenceObj.refInfo) {
                refParam.referenceObj.refInfo.refDocFileName1 = refParam.referenceObj.addedRefDoc1.name;
                refParam.referenceObj.refInfo.refDocFileType1 = refParam.referenceObj.addedRefDoc1.type;
            }
            refParam.refDoc1Files = [];
            refParam.refDoc1Files.push(refParam.referenceObj.addedRefDoc1);
        }
        if (refParam.referenceObj.addedRefDoc2) {
            if (refParam.referenceObj.refInfo) {
                refParam.referenceObj.refInfo.refDocFileName2 = refParam.referenceObj.addedRefDoc2.name;
                refParam.referenceObj.refInfo.refDocFileType2 = refParam.referenceObj.addedRefDoc2.type;
            }
            refParam.refDoc2Files = [];
            refParam.refDoc2Files.push(refParam.referenceObj.addedRefDoc2);
        }

        refParam.referenceObj.refSrcComment1 = null;
        refParam.referenceObj.refSrcComment2 = null;
        refParam.referenceObj.refSrcRefDoc1 = null;
        refParam.referenceObj.refSrcRefDoc2 = null;
        refParam.referenceObj.addedCommentFile1 = null;
        refParam.referenceObj.addedCommentFile2 = null;
        refParam.referenceObj.addedRefDoc1 = null;
        refParam.referenceObj.addedRefDoc2 = null;

        refParam.referenceObj.user = this.pdgTemplateService.getUserId();
    }

    isRefExists(referenceObj) {
        return (referenceObj && referenceObj.refInfo && referenceObj.refInfo.referenceTitle != '' && referenceObj.refInfo.refSource &&
            referenceObj.refInfo.refSource.refSourceId)
    }

    isValidRef(referenceObj: EclReferenceDto) {
        if (referenceObj) {
            return referenceObj.section || referenceObj.page || referenceObj.comments || (referenceObj.refInfo &&
                    (referenceObj.refInfo.referenceURL  || referenceObj.refInfo.referenceTitle ||
                    (referenceObj.refInfo.refSource && referenceObj.refInfo.refSource.refSourceId) ||
                    referenceObj.refInfo.refDocFileName1 || referenceObj.refInfo.refDocFileName2 ||
                    (referenceObj.refInfo.pdgRefDto && referenceObj.refInfo.pdgRefDto.infoFromState ||
                     referenceObj.refInfo.pdgRefDto.referencePath || referenceObj.refInfo.pdgRefDto.comments1 || 
                     referenceObj.refInfo.pdgRefDto.comments2))) ||
                    (referenceObj.addedCommentFile1 || referenceObj.addedCommentFile2 || referenceObj.addedRefDoc1 || referenceObj.addedRefDoc2)
        }
    }

    findIdByLabel(label: string, arr: any[]): string {
        let id = null;
        arr.filter(item => {
            return item.label === label;
        }).map(item => {
            id = item.value;
        })
        return id;
    }

    setCVCode(options: any[], ruleInfo: RuleInfo) {
        let cvCodeSelected = null;
        if (options && options.length > 0) {
            if (!ruleInfo.cvCode) {
                cvCodeSelected = this.findIdByLabel(PdgConstants.CV_CODE_DEFAULT, options);
                ruleInfo.cvCode = cvCodeSelected;
            } else {
                cvCodeSelected = ruleInfo.cvCode
            }
        }
        return cvCodeSelected;
    }

    setClaimType(pdgTemplateObj, options: any[], toolTips) {
        if (pdgTemplateObj && pdgTemplateObj.claimTypesSelection && options && options.length > 0) {
            pdgTemplateObj.claimTypesSelection = JSON.parse(JSON.stringify(pdgTemplateObj.claimTypesSelection));
            this.setClaimTypeToolTip(pdgTemplateObj, options, toolTips);
        }
    }

    setIndustryUpdateReq(options: any[], ruleInfo: RuleInfo) {
        let indUpdate = null;
        if (options && options.length > 1) {
            ruleInfo.pdgTemplateDto.industryUpdateRequired ?
                indUpdate = parseInt(ruleInfo.pdgTemplateDto.industryUpdateRequired) : '';
        }
        return indUpdate;
    }

    setReasonCode(options: any[], ruleInfo: RuleInfo, toolTips) {
        let reasonCode = null;
        if (options && options.length > 1) {
            ruleInfo.pdgTemplateDto.reasonCodeAndDescription ?
                reasonCode = ruleInfo.pdgTemplateDto.reasonCodeAndDescription : '';
            this.setReasonCodeToolTip(ruleInfo, options, toolTips);
        }
        return reasonCode;
    }


    validateMandatoryFile(existingFiles, addedFiles) {
        let errorExist: boolean = false;
        if (!existingFiles && (!addedFiles || (addedFiles && addedFiles.length == 0))) {
            errorExist = true;
        } else if (existingFiles && existingFiles.length > 0) {
            let removeCount = existingFiles.filter(file => file.isRemoved == true).length;
            if (removeCount === existingFiles.length) {
                if (addedFiles) {
                    addedFiles.length === 0 ? errorExist = true : errorExist = false;
                } else {
                    errorExist = true;
                }
            }
        } else if (existingFiles && existingFiles.length == 0) {
            if (!addedFiles || (addedFiles && addedFiles.length == 0)) {
                errorExist = true;
            }
        }
        return errorExist;
    }

    getIndUpdateFromState(selectedStates, industryUpdateList) {
        return this.utils.getIndUpdateFromState(selectedStates, industryUpdateList);
    }

    isImageFile(fileName) {
        let fileExtension: string = fileName.split('.')[1];
        if (fileExtension && typeof fileExtension !== undefined) {
            fileExtension = fileExtension.toLowerCase();
        }
        switch (fileExtension) {
            case image_extn.png:
            case image_extn.gif:
            case image_extn.jpg:
            case image_extn.jpeg:
                return true;
            default:
                return false;
        }
    }

    getImageMimeType(fileName){
        let fileExtension: string = fileName.split('.')[1];
        if (fileExtension && typeof fileExtension !== undefined) {
          fileExtension = fileExtension.toLowerCase();
        }
        let mimeType : string = '';
        switch (fileExtension) {
            case image_extn.gif:
                mimeType = PdgConstants.GIF_MIME;
                break;
            case image_extn.jpg:
            case image_extn.jpeg:
                mimeType = PdgConstants.JPG_MIME;
                break;
            default:
                mimeType = PdgConstants.PNG_MIME;
                break;
        }
        return mimeType;
    }

/**
   * Checking the paste command to see if it not overflow the expected limit
   * @param e ClipboardEvent to grab paste data in text/plain format
   * @param titles Tell the user which component is being affected
   * @param sizeLimit Maximum allowed character limit 
   * @param inpText Text entered by the user
   */
    validatePaste(e: ClipboardEvent, titles: string, sizeLimit: number, inpText: string) {
        let length = 0; // length of character in textarea
        let noOfNewLines = 0; // no of newline character in the clipboard data
        let actualTextLength = 0; // total charachter in clipboard minus newline character in clipboard
        let selectAllAndCopy = false; // if select-all (ctrl+A) from  existing textarea content is there
        let selectedTextLen = 0; // length of selected text

        const pasteData = e.clipboardData.getData('text/plain');
        if (inpText) { length = inpText.length; }

        if (pasteData) {
            const newLineMatches = pasteData.match(/\r?\n|\r/g);
            if (newLineMatches) { noOfNewLines = newLineMatches.length; }
            actualTextLength = pasteData.length - noOfNewLines;
        }
        let charLeft = (sizeLimit - length);
        if (window.getSelection()) {
            selectedTextLen = window.getSelection().toString().length;
        }
        if (selectedTextLen != 0 && selectedTextLen == length) {
            selectAllAndCopy = true;
        }
        if (selectedTextLen > 0) {
            charLeft = charLeft + selectedTextLen;
        }
        // When Paste to already character limit completed text 
        if ((length == sizeLimit && selectedTextLen == 0) && (pasteData.length > 0)) {
            const msg: MessageSend = {
                'type': 'warn',
                'summary': titles,
                'detail': `Maximum allowed characters ${sizeLimit} already exists.`,
                'time': 5000
            };
            return msg;
            // When Paste to empty field or select all and replace
        } else if ((length == 0 || selectAllAndCopy) && (actualTextLength > sizeLimit)) {
            const dif = actualTextLength - sizeLimit;
            const msg: MessageSend = {
                'type': 'warn',
                'summary': titles,
                'detail': `Maximum allowed characters is ${sizeLimit}, removing last ${dif} characters.`,
                'time': 5000
            };
            return msg;
            // When Paste exceed how many characters are left.
        } else if (actualTextLength > charLeft) {
            const dif = actualTextLength - charLeft;
            const msg: MessageSend = {
                'type': 'warn',
                'summary': titles,
                'detail': `Only had ${charLeft} character left, removing last ${dif} characters`,
                'time': 5000
            };
            return msg;
        } else {
            return null;
        }
    }
}