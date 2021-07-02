import { DatePipe } from '@angular/common';
import { Injectable } from "@angular/core";
import { SelectItem, SortEvent } from 'primeng/api';
import { ECLConstantsService } from "../../services/ecl-constants.service";
import { StorageService } from '../../services/storage.service';
import { UtilsService } from "../../services/utils.service";
import { Categories } from '../models/categories';
import { Jurisdiction } from '../models/jurisdiction';
import { LineOfBusiness } from '../models/line-of-business';
import { ReferenceSource } from '../models/reference-source';
import { States } from '../models/states';
import { Constants } from '../models/constants';
import { EclLookups } from '../models/ecl-lookups';
import { BaseResponse } from '../models/base-response';
import { SelectItemDto } from '../models/dto/SelectItemDto';
import { MessageSend } from '../models/messageSend';
import { PdgTemplateDto } from '../models/dto/pdg-dto';

// tslint:disable: indent
// tslint:disable: no-trailing-whitespace
@Injectable({
  providedIn: 'root'
})

export class AppUtils {
  private addedOpenTag: string = '<added>';
  private addedCloseTag: string = '</added>';
  private deletedOpenTag: string = '<deleted>';
  private deletedCloseTag: string = '</deleted>';



  constructor(private utilsService: UtilsService, private storage: StorageService,
    private eclConstants: ECLConstantsService) {
  }

  assignValue(variable, value) {
    setTimeout(() => {
      variable = value;
    }, 0);
  }

  /**
   * Removes the added and deleted markups and sets the markups for html valid elements..
   * @param obj to be formated.
   */
  removeMarkups(obj) {
    if (typeof obj === "string") {
      let tagElements = this.getMarkups(obj);
      obj = this.setValue(tagElements, obj);
    } else if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        obj[i] = this.removeMarkups(obj[i]);
      }
    } else if (obj && typeof obj === "object") {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const element = obj[key];
          obj[key] = this.removeMarkups(element);
        }
      }
    }

    return obj;
  };

  /**
   * Removes the added and deleted markups.
   * @param value to be formated.
   */
  onlyRemoveMarkups(value: string) {
    if (value && typeof (value) === 'string') {
      return (value.replace('<added>', '').replace('</added>', '').replace('<deleted>', '').replace('</deleted>', ''));
    }
    return value;
  }

  /**
   * returns an array of elements with markups.
   * @param element string that contains the markups and values.
   */
  getMarkups(element) {
    if (typeof element === 'string') {
      let tagElements = element.split(this.deletedCloseTag);
      if (tagElements.length === 2 && tagElements[1].length === 0) {
        tagElements = element.split(this.addedCloseTag);
      }
      return tagElements;
    } else {
      return element;
    }
  };

  /**
   * Sets the value to the element to be returned.
   * @param tagElements array that contains the elements with the markups for example <deleted>deleted</deleted><added>added</added>
   * @param obj formated element to return.
   */
  private setValue(tagElements, obj) {
    const tagRegex = /<[^>]*>?/gm;

    if (tagElements.length === 2) {
      if (tagElements[0].includes(this.addedOpenTag)) {
        obj = tagElements[0].replace(tagRegex, "").trim();
      } else if (tagElements[1].includes(this.addedOpenTag)) {
        obj = (tagElements[1].replace(tagRegex, "") as string).trim();
      } else {
        obj = "";
      }
    } else if (tagElements.length === 1) {
      if (tagElements[0].includes(this.addedOpenTag)) {
        obj = tagElements[0].replace(tagRegex, "").trim();
      } else if (tagElements[0].includes(this.deletedOpenTag)) {
        obj = "";
      }
    }

    return obj;
  }

  /**
   * Returns a valid html representation to add remove and add clases.
   * @param cellValue to be formated.
   */
  getElementWithMarkups(cellValue): string {

    if (typeof cellValue === "string") {
      if (cellValue.includes('<added>') || cellValue.includes('<deleted>')) {
        return cellValue.split('<added>').join('<div class=\'added\'>').split('<deleted>').join('<div class=\'deleted\'>')
          .split('</added>').join('</div>').split('</deleted>').join('</div>').toString();
      } else {
        return cellValue;
      }
    } else {
      return cellValue;
    }
  }

  /**
   * Returns the string with tags to add styles.
   * @param value to be formatted.
   * @param maxLength of the column.
   */
  getSlicedXmlValue(value: string, maxLength: number, showTags: boolean = true): string {
    let resultString = '';
    if (!value || typeof (value) != 'string') {
      // no string value
      return value;
    }
    if (maxLength <= 0) {
      maxLength = value.length;
    }
    if (value.indexOf('<added') < 0 && value.indexOf('<deleted') < 0) {
      // no xml
      if (value.length > maxLength) {
        value = value.substr(0, maxLength) + '...';
      }
      return value;
    }
    const parser = new DOMParser();
    const elementWithRoot = `<root>${value}</root>`;
    const elementXml = parser.parseFromString(elementWithRoot, "text/xml");
    let addEllipsis = false;

    for (let index = 0; index < elementXml.getElementsByTagName("root")[0].childNodes.length; index++) {
      if (maxLength <= 0) {
        break;
      }
      const nodeElement = (elementXml.getElementsByTagName("root")[0].childNodes[index]) as any;
      const nodeTagName = nodeElement.tagName;
      const nodeTextContent: string = nodeElement.textContent;
      let textToAdd = nodeTextContent.substr(0, maxLength);
      if (maxLength < nodeTextContent.length) {
        addEllipsis = true;
      }
      maxLength -= textToAdd.length;


      if (showTags) {
        if (nodeTagName === "added") {
          resultString += (`<span class="added">${textToAdd}</span>`);
        } else if (nodeTagName === "deleted") {
          resultString += `<span class="deleted">${textToAdd}</span>`;
        } else {
          resultString += textToAdd;
        }
      } else {
        resultString += `${textToAdd}`;
      }
    }

    if (addEllipsis) {
      resultString += '...';
    }

    return resultString;
  }

  /**
   * Method used to encode a string into base64
   *
   * @param {string} element
   * @returns {string}
   * @memberof AppUtils
   */
  encodeString(element: string): string {
    return btoa(element);
  }

  /**
   * Method used to decode a string into base64
   *
   * @param {string} element
   * @returns {string}
   * @memberof AppUtils
   */
  decodeString(element: string): string {
    return element ? atob(element) : '';
  }

  /**
   * Opens a new browser window.
   */
  openNewWindow(url?: string, target?: string, features?: string, replace: boolean = false): void {
    window.open(url, target, features, replace);
  }

  getAllLobs(dest: any[]) {
    return new Promise((resolve, reject) => {
      if (this.storage.exists("LOBS_LIST")) {
        dest = this.storage.get("LOBS_LIST", true);
        resolve(dest);
      } else {
        this.utilsService.getAllLOBs().subscribe((lobs: []) => {
          lobs.forEach(lob => {
            dest.push({ label: lob['lobDesc'], value: { id: lob['lobId'], name: lob['lobDesc'] } });
          })
          this.storage.set("LOBS_LIST", dest, true);
          resolve(dest);
        })
      }
    });
  }

  getAllCategories(dest: any[]) {
    return new Promise((resolve, reject) => {

      if (this.storage.exists("CATEGORIES_LIST")) {
        dest = this.storage.get("CATEGORIES_LIST", true);
        resolve(dest);
      } else {
        this.utilsService.getAllCategories().subscribe((acat: []) => {
          acat.forEach(cat => {
            dest.push({ label: cat["categoryDesc"], value: { id: cat['categoryId'], name: cat["categoryDesc"] } });
          });
          this.storage.set("CATEGORIES_LIST", dest, true);
          resolve(dest);
        });
      }
    });
  }

  getAllCategoriesFromCache(dest: any[]) {
    return new Promise((resolve, reject) => {
      this.utilsService.getAllCategoriesFromCache().subscribe((acat: []) => {
        acat.forEach((cat, i) => {
          dest.push({ label: cat, value: { id: i, name: cat } });
        });
        resolve(dest);
      });
    });
  }

  getAllCategoriesWidgets(dest: any[]) {
    return new Promise((resolve, reject) => {
      if (this.storage.exists('CATEGORIES_LIST_WIDGETS')) {
        resolve(dest.concat(this.storage.get('CATEGORIES_LIST_WIDGETS', true)));
      } else {
        this.utilsService.getAllCategories().subscribe((acat: []) => {
          acat.forEach(cat => {
            dest.push({ label: cat["categoryDesc"], value: cat["categoryDesc"] });
          });
          this.storage.set('CATEGORIES_LIST_WIDGETS', dest, true);
          resolve(dest);
        });
      }
    });
  }

  getAllStates(dest: any[]) {
    return new Promise((resolve, reject) => {

      if (this.storage.exists("STATES_LIST")) {
        dest = this.storage.get("STATES_LIST", true);
        resolve(dest);
      } else {
        this.utilsService.getAllStates().subscribe((states: []) => {
          states.forEach(st => {
            dest.push({ label: st["stateDesc"], value: { id: st['stateId'], name: st["stateDesc"] } });
          });
          this.storage.set('STATES_LIST', dest, true);
          resolve(dest);
        })
      }
    });
  }

  getAllJurisdictionsWidgets(dest: any[]) {
    return new Promise((resolve, reject) => {

      if (this.storage.exists("JURISDICTIONS_LIST")) {
        dest = this.storage.get("JURISDICTIONS_LIST", true);
        resolve(dest);
      } else {
        this.utilsService.getAllJurisdictions().subscribe((jurs: []) => {
          jurs.forEach(jur => {
            dest.push({ label: jur['jurisdictionCode'], value: { id: jur['jurisdictionId'], name: jur["jurisdictionCode"] } });
          });
          this.storage.set('JURISDICTIONS_LIST', dest, true);
          resolve(dest);
        })
      }
    });
  }

  getAllJurisdictions(dest: any[]) {
    this.utilsService.getAllJurisdictions().subscribe((jurs: []) => {
      jurs.forEach(jur => {
        dest.push({ label: jur['jurisdictionCode'], value: jur['jurisdictionCode'] });
      });
    })
  }

  getAllUsers(dest: any[]) {
    this.utilsService.getAllUsers().subscribe(users => {
      users.forEach(user => {
        dest.push({ label: user['firstName'], value: user['userId'] })
      })
    })
  }

  getAllResearchAnalysts(dest: any[]) {
    this.utilsService.getUsersByRole(this.eclConstants.USERS_CLINICAL_CONTENT_ANALYST).subscribe(users => {
      users.forEach(user => {
        dest.push({ label: user['firstName'], value: user['userId'] })
      })
    })
  }

  getAllUsersByRole(dest: any[]) {
    this.utilsService.getUsersByRoleName(this.eclConstants.USERS_CCA).subscribe(users => {
      users.forEach(user => {
        dest.push({ label: user['firstName'], value: user['userId'] })
      })
    })
  }

  getAllResearchAnalystsOfPO(policyOwnerUserId: any, dest: any[]) {
    this.utilsService.findAllCCAsOfPO(policyOwnerUserId).subscribe(users => {
      users.data.forEach(user => {
        dest.push({ label: user['firstName'], value: user['userId'] })
      })
    })
  }

  getAllPolicyOwners(dest: any[]) {
    this.utilsService.getUsersByRole(this.eclConstants.USERS_POLICY_OWNER_ROLE).subscribe(users => {
      users.forEach(user => {
        dest.push({ label: user['firstName'], value: user['userId'] })
      })
    })
  }

  getAllMedicalDirectors(dest: any[]) {
    this.utilsService.getUsersByRole(this.eclConstants.USERS_MEDICAL_DIRECTOR_ROLE).subscribe(users => {
      users.forEach(user => {
        dest.push({ label: user['firstName'], value: user['userId'] })
      })
    })
  }

  /**
   * Get the list of roles, if we want to sort the array elements then we pass true in sortElements boolean property.
   * @param dest element where we are going to add elements.
   * @param sortElements determines if we want to sort, it does not sort by default, true = sort, false = do not sort.
   */
  getAllRoles(dest: any[], sortElements: boolean = false) {
    this.utilsService.getAllRoles().subscribe(roles => {
      roles.forEach(rol => {
        dest.push({ label: rol['roleId'] + ' ' + rol['roleName'], value: rol['roleDescription'] })
      })
      if (sortElements) {
        dest.sort((a, b) => {
          return (a.value > b.value) ? 1 : -1
        });
      }
    })
  }

  getAllCCAsPOs(dest: any[]) {
    this.utilsService.getAllCCAsPOs().subscribe(users => {
      users.data.forEach(user => {
        dest.push({ label: user['firstName'], value: user['userId'] })
      })
    })
  }

  getAllFrequencies(dest: any[]) {
    this.utilsService.getAllFrequencies().subscribe(frequencies => {
      frequencies.forEach(frequency => {
        dest.push({ label: frequency['lookupDesc'], value: frequency['lookupId'] })
      })
    })
    return dest;
  }

  getPropByString(obj: any, path: string): any {
    if (!path)
      return obj;
    let properties = path.split('.');
    return properties.reduce((prev, curr) => prev && prev[curr], obj)
  }
  getLoggedUserId(): number {
    let logUser = JSON.parse(localStorage.getItem("userSession"));
    let userId: number;
    if (logUser) {
      userId = logUser.userId;
    }
    return userId;
  }
  getAllReferences(dest: any[]) {
    this.utilsService.getAllReferences().subscribe(refs => {
      refs.forEach(ref => {
        dest.push({ label: ref['sourceDesc'], value: ref['sourceDesc'] });
      })
    })
  }
  getLoggedUserName(): string {
    let logUser = JSON.parse(localStorage.getItem("userSession"));
    return logUser.firstName;
  }


  /**
   * @param dest
   * @param resp
   *
   * dest is the data we are passing in to grab the list from the back-end
   * resp is choosing to get id and name or just value itself.
   */
  getAllLobsValue(dest: SelectItem[], resp: boolean): void {

    this.utilsService.getAllLOBs().subscribe((lobs: []) => {
      if (resp === true) {
        lobs.forEach((lob: LineOfBusiness) => {
          dest.push({ label: lob.lobDesc, value: { id: lob.lobId, name: lob.lobDesc } });
        })
      } else {
        lobs.forEach((lob: LineOfBusiness) => {
          dest.push({ label: lob.lobDesc, value: lob.lobId });
        })
      }
    })
  }
  getOnlyTwoMedic(dest: SelectItem[], resp: boolean): void {
    this.utilsService.getAllLOBs().subscribe((lobs: []) => {
      if (resp === true) {
        lobs.forEach((lob: LineOfBusiness) => {
          if (lob.lobDesc === 'Medicaid' || lob.lobDesc === 'Medicare') {
            dest.push({ label: lob.lobDesc, value: { id: lob.lobId, name: lob.lobDesc } });
          }
        })
      } else {
        lobs.forEach((lob: LineOfBusiness) => {
          if (lob.lobDesc === 'Medicaid' || lob.lobDesc === 'Medicare') {
            dest.push({ label: lob.lobDesc, value: lob.lobId });
          }
        })
      }
    })
  }

  getAllCategoriesValue(dest: SelectItem[], resp: boolean): void {
    if (resp === true) {
      this.utilsService.getAllCategories().subscribe((cat: []) => {
        cat.forEach((cat: Categories) => {
          dest.push({ label: cat.categoryDesc, value: { id: cat.categoryId, name: cat.categoryDesc } });
        })
      })
    } else {
      this.utilsService.getAllCategories().subscribe((cat: []) => {
        cat.forEach((cat: Categories) => {
          dest.push({ label: cat.categoryDesc, value: cat.categoryId });
        })
      })
    }
  }

  getAllCategoriesByPromise(dest: SelectItem[]) {
    return new Promise((resolve, reject) => {
      this.utilsService.getAllCategories().subscribe((cat: []) => {
        cat.forEach((cat: Categories) => {
          dest.push({ label: cat.categoryDesc, value: cat.categoryId });
        });
        resolve(dest);
      });
    });
  }

  getAllStatesValue(dest: SelectItem[], resp: boolean): void {
    if (resp === true) {
      this.utilsService.getAllStates().subscribe((states: []) => {
        if (!this.storage.exists('STATES_OBJECT_LIST')) {
          this.storage.set("STATES_OBJECT_LIST", states, true);
        }
        states.forEach((st: States) => {
          dest.push({ label: st.stateDesc, value: { id: st.stateId, name: st.stateDesc } });
        });
      })
    } else {
      this.utilsService.getAllStates().subscribe((states: []) => {
        if (!this.storage.exists('STATES_OBJECT_LIST')) {
          this.storage.set("STATES_OBJECT_LIST", states, true);
        }
        states.forEach((st: States) => {
          dest.push({ label: st.stateDesc, value: st.stateId });
        });
      });
    }
  }

  getAllJurisdictionsValue(dest: SelectItem[], resp: boolean) {
    if (resp === true) {
      this.utilsService.getAllJurisdictions().subscribe((jurs: []) => {
        jurs.forEach((jur: Jurisdiction) => {
          dest.push({ label: jur.jurisdictionCode, value: { id: jur.jurisdictionId, name: jur.jurisdictionDesc } });
        })
      })
    } else {
      this.utilsService.getAllJurisdictions().subscribe((jurs: []) => {
        jurs.forEach((jur: Jurisdiction) => {
          dest.push({ label: jur.jurisdictionCode, value: jur.jurisdictionId });
        })
      })
    }
  }

  getAllPolicyPackageValue(policyPackageValues: any) {
    this.utilsService.getAllPolicyPackage().subscribe(response => {
      response.data.forEach(policyPackage => {
        policyPackageValues.push({ value: policyPackage.policyPackageTypeId, label: policyPackage.policyPackageName });
      });
    });
  }

  getAllReferencesValue(dest: SelectItem[], resp: boolean) {
    if (resp === true) {
      this.utilsService.getAllReferences().subscribe((refs: []) => {
        refs.forEach((ref: ReferenceSource) => {
          dest.push({ label: ref.sourceDesc, value: { id: ref.refSourceId, name: ref.sourceDesc } });
        })
      })
    } else {
      this.utilsService.getAllReferences().subscribe((refs: []) => {
        refs.forEach((ref: ReferenceSource) => {
          dest.push({ label: ref.sourceDesc, value: ref.refSourceId });
        })
      })
    }
  }

  getAllEnginesWidgets(dest: any[]) {
    return new Promise((resolve, reject) => {
      this.utilsService.getAllRuleEngines().subscribe((acat: any) => {
        acat.data.forEach(cat => {
          dest.push({ label: cat["shortDesc"], value: cat["shortDesc"] });
        });
        resolve(dest);
      });
    });
  }

  getAllEngines(dest: any[], resp: boolean) {
    return new Promise((resolve, reject) => {
      if (resp === true) {
        this.utilsService.getAllRuleEngines().subscribe(refs => {
          refs.data.forEach((ref: any) => {
            dest.push({ label: ref.shortDesc, value: { id: ref.id, name: ref.shortDesc } });
          });
          resolve();
        })
      } else {
        this.utilsService.getAllRuleEngines().subscribe(refs => {
          refs.data.forEach((ref: any) => {
            dest.push({ label: ref.shortDesc, value: ref.id });
          });
          resolve();
        })
      }
    });
  }

  getAllEnginesLibraryView(dest: SelectItem[], resp: boolean) {
    return new Promise((resolve, reject) => {
      this.utilsService.getAllRuleEngines().subscribe(refs => {
        refs.data.forEach((ref: any) => {
          if (ref.shortDesc !== 'ICMS' && ref.shortDesc !== 'ECL') {
            dest.push({ label: ref.shortDesc, value: ref.id, disabled: true });
          } else {
            dest.push({ label: ref.shortDesc, value: ref.id, disabled: false });
          }
        });
        resolve();
      })
    });
  }

  /**
   * Retrieve all Teams Available.
  */
  getAllTeams(dest: any[], resp: boolean) {
    if (resp) {
      this.utilsService.getAllTeams().subscribe(response => {
        if (response.data !== null && response.data !== undefined) {
          response.data.forEach((team: any) => {
            dest.push({ label: team.teamName, value: team });
          });
        }
      });
    } else {
      this.utilsService.getAllTeams().subscribe(response => {
        if (response.data !== null && response.data !== undefined) {
          response.data.forEach((team: any) => {
            dest.push({ label: team.teamName, value: team.teamId });
          });
        }
      });
    }

  }

  /**
     * Retrieve all CI Jira Teams.
    */
  getAllCIJiraTeams(dest: any[], resp: boolean) {
    if (resp) {
      this.utilsService.getAllCIJiraTeams().subscribe(response => {
        if (response.data !== null && response.data !== undefined) {
          response.data.forEach((team: any) => {
            dest.push({ label: team.teamName, value: team });
          });
        }
      });
    } else {
      this.utilsService.getAllCIJiraTeams().subscribe(response => {
        if (response.data !== null && response.data !== undefined) {
          response.data.forEach((team: any) => {
            dest.push({ label: team.teamName, value: team.teamId });
          });
        }
      });
    }

  }

  /**
   * Retrieve all lookups Available by
   * @param lookUpType Search for the LookUp Type in the DB
   * @param Dest Array to fill.
   * @param boolean value 'true' if the required json value is an lookup object else 'false' if required json value is lookupId
   * @param filterList -Filter out the lookup. If none, no filter is applied.
   */
  getAllLookUps(lookUpType: string, dest: any[], resp: boolean, filterList?: any[]) {
    if (resp) {
      this.utilsService.getAllLookUps(lookUpType).subscribe(response => {
        if (response !== null && response !== undefined) {
          response.forEach((lookup: any) => {
            dest.push({ label: lookup.lookupDesc, value: lookup });
          });
        }
      });
    } else {
      this.utilsService.getAllLookUps(lookUpType).subscribe(response => {
        if (response !== null && response !== undefined) {
          response.forEach((lookup: any) => {
            if (filterList) {
              if (!filterList.includes(lookup.lookupDesc)) {
                dest.push({ label: lookup.lookupDesc, value: lookup.lookupId });
              }
            } else {
              dest.push({ label: lookup.lookupDesc, value: lookup.lookupId });
            }
          });
        }
      });
    }
  }

  getAllICMSLibraryReasoncodes(dest: any[]) {
    return new Promise(resolve => {
      this.utilsService.getAllICMSLibraryReasoncodes().subscribe(response => {
        if (response && response.data) {
          response.data.forEach((item: any) => {
            dest.push({ label: item.reasonCode + " - " + item.reasonDesc, value: item.reasonCode });
          });
          resolve(dest)
        }
      });
    })
  }

  getAllLookUpsByTypeAndDescription(lookUpType: string, desc: string, dest: any[]) {
    return new Promise(resolve => {
      this.utilsService.getLookupsByTypeAndDescription(lookUpType, desc).subscribe(response => {
        if (response !== null && response !== undefined) {
          response.forEach((lookup: any) => {
            dest.push({ label: lookup.lookupDesc, value: lookup.lookupId });
          });
          resolve(dest)
        }
      });
    })
  }

  /* Retrieve all the active users in the ECL */
  getAllActiveUsers(dest: any[]) {
    this.utilsService.getAllActiveUsers().subscribe(response => {
      if (response !== null && response !== undefined) {
        response.data.forEach((user: any) => {
          dest.push(user);
        });
      }
    });
  }

  getUserNameByUserId(userId: number) {
    return this.utilsService.getUserNameByUserId(userId).toPromise();
  }
  /**
   * Retrieve all Modifiers.
  */
  getAllModifierOptions(dest: any[]) {
    let allModifier = {
      modifierCode: "* - All Applicable",
      modifierDesc: "ALL MODIFIERS"
    }
    return new Promise(resolve => {
      dest.push({ label: allModifier.modifierCode, value: allModifier });
      this.utilsService.getAllModifiers().subscribe((modifiers: any[]) => {
        modifiers.forEach(mod => {
          dest.push({ label: mod.modifierCode, value: mod });
        })
        resolve();
      });
    })
  }

  /**
   * Retrieve all Procedure Code Types.
  */
  getAllProcedureCodeOptions(dest: any[]) {
    return new Promise(resolve => {
      this.utilsService.getAllLookUps(Constants.LOOKUP_TYPE_PROC_CODE_OPTION).subscribe((procedureCodeTypes: EclLookups[]) => {
        procedureCodeTypes.forEach(pct => {
          dest.push({ label: pct.lookupDesc, value: pct.lookupId });
        })
        resolve();
      });
    })
  }

  /**
   * getLookupCodesByList will give the user require code list when supplied.
   * @param dest Value to be returned for use
   * @param type Determine the type for the codeList to locate
   * @param codeList Using eclLookupCode supplied
   */
  getLookupCodesByList(dest: any[], type: string, codeList: string[]) {
    return new Promise(resolve => {
      this.utilsService.getLookupsByTypeAndCodeList(type, codeList).subscribe((procedureCodeTypes: EclLookups[]) => {
        procedureCodeTypes.forEach(pct => {
          dest.push({ label: pct.lookupDesc, value: pct.lookupId });
        })
        resolve();
      })
    })
  }

  getAllProcedureCodeOptionCodes(dest: any[]) {
    return new Promise(resolve => {
      this.utilsService.getAllLookUps(Constants.LOOKUP_TYPE_PROC_CODE_OPTION).subscribe((procedureCodeTypes: any[]) => {
        procedureCodeTypes.forEach(pct => {
          dest.push({ label: pct.lookupDesc, value: pct.lookupCode });
        })
        resolve();
      });
    })
  }

  getAllCategoriesForUserSetup(dest: any[]) {
    return new Promise((resolve, reject) => {
      this.utilsService.getAllCategories().subscribe((acat: []) => {
        acat.forEach(cat => {
          dest.push({ label: cat["categoryDesc"], value: { id: cat['categoryId'], name: cat["categoryDesc"] } });
        });
        this.storage.set("CATEGORIES_LIST", dest, true);
        resolve(dest);
      });

    });
  }

  getAllRevenueCodes(dest: SelectItem[], resp: boolean) {
    return new Promise((resolve, reject) => {
      this.utilsService.getAllRevenueCodes().subscribe((response: BaseResponse) => {
        if (response && response.data) {
          if (resp) {
            response.data.forEach(rcode => {
              dest.push({ label: `${rcode.revenueCode}-${rcode.revenueCodeDesc}`, value: rcode });
            });
            resolve(dest);
          } else {
            response.data.forEach(rcode => {
              dest.push({ label: `${rcode.revenueCode}-${rcode.revenueCodeDesc}`, value: rcode.revenueCode });
            });
            resolve(dest);
          }
        }
      })
    })
  }

  /**
 * Custom sort to handle numbers and strings in sort functionality
 * @param event
 */
  customSort(event: SortEvent) {
    event.data.sort((data1, data2) => {
      let value1 = data1[event.field],
        value2 = data2[event.field],
        result = null;
      let collator = new Intl.Collator(undefined, { numeric: true });

      if (value1 === null && value2 !== null) {
        result = -1;
      } else if (value1 !== null && value2 === null) {
        result = 1;
      } else if (value1 === null && value2 === null) {
        result = 0;
      } else {
        result = collator.compare(value1, value2);
      }
      return (event.order * result);
    });
  }

  capitalize(text: string): string {
    let words: string[] = text.split(" ");;
    words.forEach((word: string, index: number) => {
      if (word.length > 1) {
        word = word.substring(0, 1).toUpperCase() + word.substring(1, word.length);
        words[index] = word;
      }
    });
    let test = words.toString().split(',').join(' ');
    return test;
  }

  checkStringNotNull(string: string): boolean {
    return (string && string.trim().length > 0)
  }

  getAllSpecialityTypes(dest: SelectItem[], specialityType) {
    this.utilsService.getAllLookUps(specialityType).subscribe((response: any[]) => {
      response.forEach(splType => {
        dest.push({
          "label": splType.lookupDesc.toUpperCase(),
          "value": splType.lookupCode
        });
      });
      dest = this.sortSpecialtyList(dest)

    })
  }

  getAllSubspecialityTypes(dest: SelectItemDto[], subspecialityType) {
    this.utilsService.getAllLookUpsSubspeciality(subspecialityType).subscribe(response => {
      response.forEach(splType => {
        dest.push({
          "label": splType.lookupDesc.toUpperCase(),
          "value": splType.lookupCode,
          'type': splType.lookupType
        });
      });
      dest = this.sortSpecialtyList(dest);
    })
  }

  sortSpecialtyList(data: any[]): any[] {
    return data.sort((a, b) => a.label.localeCompare(b.label));
  }

  getAllProfessionalClaims(dest: SelectItem[], resp: boolean) {
    return new Promise((resolve, reject) => {
      this.utilsService.getAllLookUps('CLAIM_PLACE_OF_SERVICE').subscribe((response: any[]) => {

        //This code is for put at first position the '%' option.
        response.forEach(function (item, i) {
          if (item.lookupDesc.startsWith('%')) {
            item.lookupDesc = "% - All Applicable";
            response.splice(i, 1);
            response.unshift(item);
          } else if (item.lookupDesc === Constants.TWO_PERC_POS) {
            response.splice(i, 1);
          }
        });

        if (resp) {
          response.forEach(placeService => {
            dest.push({ label: placeService.lookupDesc, value: placeService });
          });
          resolve(dest);
        } else {
          response.forEach(placeService => {
            dest.push({ label: placeService.lookupDesc, value: placeService.lookupId });
          });
          resolve(dest);
        }
      });
    });
  }

  getAllBillTypeClaims(dest: SelectItem[], resp: boolean) {
    return new Promise((resolve, reject) => {
      this.utilsService.getAllLookUps('CLAIM_BILL_TYPES').subscribe((response: any[]) => {
        if (resp) {
          response.forEach(billType => {
            dest.push({ label: billType.lookupDesc, value: billType });
          });
          resolve(dest);
        } else {
          response.forEach(billType => {
            dest.push({ label: billType.lookupDesc, value: billType.lookupId });
          });
          resolve(dest);
        }
      });
    });
  }

  /**
    * Checking the paste command to see if it not overflow.
    * @param e ClipboardEvent to grab paste data in text/plain format
    * @param titles Tell the user which textArea/input is being affected
    * @param sizeLimit Limit to compare against
    * @param noteLength How many characters already inputted
    */
  checkPasteLength(e: ClipboardEvent, titles: string, sizeLimit: number, note: string) {
    let length = 0;
    if (note) { length = note.length }
    const pasteData = e.clipboardData.getData('text/plain')
    const charLeft = (sizeLimit - length)
    // When Paste exceed the entire maxLength
    if (pasteData.length > sizeLimit) {
      const dif = pasteData.length - sizeLimit
      const msg: MessageSend = {
        'type': 'warn',
        'summary': titles,
        'detail': `Maximum allowed characters is ${sizeLimit}, removing last ${dif} characters.`,
        'time': 5000
      };
      return msg;
      // When Paste exceed how many characters are left.
    } else if (pasteData.length > charLeft) {
      const dif = pasteData.length - charLeft;
      const msg: MessageSend = {
        'type': 'warn',
        'summary': titles,
        'detail': `Only have ${charLeft} character left, removing last ${dif} characters`,
        'time': 5000
      };
      return msg;
    } else {
      return null;
    }
  }

  checkMultiLineMaxLength(e, text, docValue: any, maxLength) {
    let dif = 0;
    if (text) {
      dif = docValue.textLength - text.replace(/\r?\n|\r/g, '').length;
    }
    if ((docValue.textLength + dif) >= maxLength) {
      e.preventDefault();
    }
  }

  checkInputLengthTextArea(notes, maxlength) {
    let newValue = notes.replace(/\r?\n|\r/g, '');
    let dif = notes.length - newValue.length;
    if (notes && (notes.length + dif) > maxlength) {
      return newValue;
    } else {
      return notes;
    }
  }

  /* Method invoked when files are dragged and dropped */
  dropFileHandler(event) {
    let fileList: File[] = [];
    if (event.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (let i = 0; i < event.dataTransfer.items.length; i++) {
        if (event.dataTransfer.items[i].kind === 'file') {
          let file = event.dataTransfer.items[i].getAsFile();
          fileList.push(file);
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      fileList = event.dataTransfer.files;
    }
    return fileList;
  }

  /**
   * updateFilesList for Custom Input
   * @param fileList - CurrentList that going be updated
   * @param addedFile - Newly added File List
   * @param savedFile - Already saved File List
   * @param addedExist - boolean to give. (default: false)
   */
  updateFilesList(fileList: any, addedFile: any, savedFile: any) {
    let response = {
      addedFiles: null,
      addedBool: false,
      warnMsg: ''
    };
    for (let i = 0; i < fileList.length; i++) {
      let size = fileList[i].size / 1024 / 1024; // size conversion to MB.
      if (size < Constants.MAX_FILE_SIZE) {
        if ((!addedFile.some(file => fileList[i].name === file.name))
          && (!savedFile.some(file => fileList[i].name === file.fileName))) {
          addedFile.push(fileList[i]);
          if (addedFile.length > 0) {
            response.addedFiles = addedFile;
            response.addedBool = true;
          }
        } else {
          response.warnMsg = `File '${fileList[i].name}' already Exists, please upload a new file`;
        }
      } else {
        response.warnMsg = `File ${fileList[i].name} has ${Math.round(size)}MB of size, max file size uploaded 10MB`;
      }
    }
    return response;
  }

  /**
    * Shows an icon according to the extension.
    * @param fileName to get the extension,
    */
  getFileIcon(fileName: string) {
    let fileExtension = fileName.split('.')[1];
    if (fileExtension && typeof fileExtension !== undefined) {
      fileExtension = fileExtension.toLowerCase();
    }
    switch (fileExtension) {
      case "xls":
      case "xlsx":
        return "fa fa-file-excel-o purple";
      case "doc":
      case "docx":
        return "fa fa-file-word-o purple";
      case "png":
      case "jpg":
      case "jpeg":
        return "fa fa-file-image-o purple";
      default:
        return "fa fa-file-text-o purple";
    }
  }


  /**
   * This function is for validate if the string only contains white spaces
   * Return true if the string only has white spaces.
   * @param textToValidate
   */
  validateStringContaintOnlyWhiteSpaces(textToValidate: String) {
    return textToValidate.trim().length == 0;
  }

  getPdgReferencesValue(dest: SelectItem[], resp: boolean) {
    if (resp === true) {
      this.utilsService.getAllReferences().subscribe((refs: []) => {
        refs.filter((ref: ReferenceSource) => {
          return ref.sourceDesc.toLowerCase().startsWith('state ');
        }).forEach((ref: ReferenceSource) => {
          dest.push({ label: ref.sourceDesc, value: { id: ref.refSourceId, name: ref.sourceDesc } });
        })
      })
    } else {
      this.utilsService.getAllReferences().subscribe((refs: []) => {
        refs.filter((ref: ReferenceSource) => {
          return ref.sourceDesc.toLowerCase().startsWith('state ');
        }).forEach((ref: ReferenceSource) => {
          dest.push({ label: ref.sourceDesc, value: ref.refSourceId });
        })
      })
    }
  }


  /**
 * For Pdg only
 * @param dest
 * @param resp
 *
 * dest is the data we are passing in to grab the list from the back-end
 * resp is choosing to get id and name or just value itself.
 */
  getPdgCategoriesValue(dest: SelectItem[], resp: boolean): void {
    if (resp === true) {
      this.utilsService.getAllCategories().subscribe((cat: []) => {
        cat.filter((cat: Categories) => {
          return cat.categoryDesc.toLowerCase().startsWith(Constants.MEDICAID_CAT);
        }).forEach((cat: Categories) => {
          dest.push({ label: cat.categoryDesc, value: { id: cat.categoryId, name: cat.categoryDesc } });
        });
      });
    } else {
      this.utilsService.getAllCategories().subscribe((cat: []) => {
        cat.filter((cat: Categories) => {
          return cat.categoryDesc.toLowerCase().startsWith(Constants.MEDICAID_CAT);
        }).forEach((cat: Categories) => {
          dest.push({ label: cat.categoryDesc, value: cat.categoryId });
        });
      });
    }
  }

  getIndUpdateFromState(selectedStates, industryUpdateList) {
    let states: any[] = [];
    if (this.storage.exists("STATES_OBJECT_LIST")) {
      states = this.storage.get("STATES_OBJECT_LIST", true);
    }
    if (states && states.length > 0) {
      let stateCode: string = null;
      let selectedInd: any;
      if (selectedStates !== null && selectedStates.length >= 1) {
        stateCode = states.filter((state: any) => state.stateId == selectedStates[0])[0].stateCode;
      }

      if (null !== stateCode) {
        if (stateCode == Constants.WASHINGTONDC_ST) {
          stateCode = Constants.WASHINGTONDC_CAT;
        } else if (stateCode == Constants.WASHINGTON_ST) {
          stateCode = Constants.WASHINGTON_CAT;
        }
        let ind = industryUpdateList.filter((item: any) => item.label.indexOf(": " + stateCode) > -1);
        if (ind && ind.length > 0) {
          selectedInd = ind[0].value;
        }
      }
      return selectedInd;
    }
  }

  getCategoryFromState(selectedCat, categoryList, selectedStates, states) {
    let stateLabel: string = null;
    if (selectedStates !== null && selectedStates.length >= 1) {
      stateLabel = states.filter((state: SelectItem) => state.value == selectedStates[0])[0].label;
    } else if (selectedStates !== null && selectedStates.length == 0) {
      selectedCat = null;
    }
    if (null !== stateLabel) {
      if (stateLabel == Constants.WASHINGTONDC_ST) {
        stateLabel = Constants.WASHINGTONDC_CAT;
      } else if (stateLabel == Constants.WASHINGTON_ST) {
        stateLabel = Constants.WASHINGTON_CAT;
      }
      let category = categoryList.filter((cat: SelectItem) => cat.label.indexOf(stateLabel) > -1);
      if (category && category.length > 0) {
        let catId = category[0].value;
        selectedCat = catId;
      }
    }
    return selectedCat;
  }

  getStateFromCategory(selectedCat, categoryList, selectedStates, states) {
    let categoryLabel: string = null;
    if (selectedCat !== null) {
      categoryLabel = categoryList.filter((cat: SelectItem) => cat.value == selectedCat)[0].label;
    }

    if (null !== categoryLabel) {
      if (categoryLabel.indexOf(Constants.WASHINGTONDC_CAT) > -1) {
        categoryLabel = Constants.WASHINGTONDC_ST;
      }
      selectedStates = [];
      let selState = states.filter((item: SelectItem) => categoryLabel.indexOf(item.label) > -1)[0].value
      if (selectedStates && !selectedStates.includes(selState)) {
        selectedStates.push(selState);
      }
    }
    return selectedStates;
  }

  isPdgEnabled(pdgDto: PdgTemplateDto = null) {
    let isPdgMedicaidRule: boolean = false;
    if (this.storage.exists('showPdgMedicaid')) {
      const showPdgTemplate = this.storage.get('showPdgMedicaid', false);
      if (this.storage.exists('pdgMedicaidUser')) {
        const isPdgMedicaidUser = this.storage.get('pdgMedicaidUser', false);
        const onlyMd = this.storage.get('onlyMd', false);
        if (showPdgTemplate == 'true') {
          if (isPdgMedicaidUser == 'true' || (onlyMd == 'true' && pdgDto && pdgDto.pdgId)) {
            isPdgMedicaidRule = true;
          }
        }
      }
    }
    return isPdgMedicaidRule;
  }

  /**
   * return a plain text representation of given html string 
   *  @param htmlText html string
   *  @return text value
   */
  getTextFromHtml(htmlText) {
    if (htmlText) {
      htmlText = htmlText.replace(/(<.*?>)/g, "").replace(/&nbsp;|&gt;/g, " ");
    }
    return htmlText;
  }
}

export class KeyLimitService {
  /**
  * Key Check will grab the limit from the event handler of the HTML.
  * LimitCount will ensure the limit is met. Make sure you pass in
  * both values. To Top it off, you need third variable to show
  * the actual count. This does checking and showing of character
  * limit count. ~ Jeff
  */
  keyCheck(limit: string, limitCount: number) {
    if (limit.length < limitCount) {
      return limitCount - limit.length;
    } else if (limit.length >= limitCount) {
      return limitCount - limit.length;
    }
  }


}

export class sqlDateConversion {

  JSDateToSQLDate(date: Date) {

    date = new Date(date);
    let newdate
    newdate = new Date();
    newdate = date.getUTCFullYear() + '-' +
      ('00' + (date.getUTCMonth() + 1)).slice(-2) + '-' +
      ('00' + date.getUTCDate()).slice(-2) + 'T' +
      ('00' + date.getUTCHours()).slice(-2) + ':' +
      ('00' + date.getUTCMinutes()).slice(-2) + ':' +
      ('00' + date.getUTCSeconds()).slice(-2) + '.053Z';
    return newdate;
  }
  //2019-10-12T20:01:38.053Z
  JSDateToJavaDate(date: Date) {
    let pipe = new DatePipe('en-US'); // Use your own locale
    const myFormattedDate = pipe.transform(date, 'fullTime');
    console.log(new Date(myFormattedDate));
    return myFormattedDate;
  }
}

export class DateUtils {
  isDate(value: string): boolean {
    return /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(value);
  }

  getCurrentDateString(): string {
    let todayDate = new Date();
    let dateLongFormat = (todayDate.getMonth() + 1).toString()
      + " " + todayDate.getDate().toString()
      + " " + todayDate.getFullYear().toString();
    return (new Date(dateLongFormat).toString().substring(0, 15));
  }

  

}
