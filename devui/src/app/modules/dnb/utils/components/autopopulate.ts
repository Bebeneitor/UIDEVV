import { Injectable } from "@angular/core";
import { StorageService } from "src/app/services/storage.service";
import { SectionCode } from "../../models/constants/sectioncode.constant";
import { storageDrug } from "../../models/constants/storage.constants";
import {
  Column,
  GroupedSection,
  GroupRow,
  Row,
  Section,
  UISection,
} from "../../models/interfaces/uibase";
import {
  createNewGroup,
  createNewRow,
  eliminateUndefined,
  getValuesColumn,
  getValuesInGroup,
  guidGenerator,
  isEmptyRow,
} from "../tools.utils";
import { CopyToNew } from "./copytonew";

@Injectable()
export class AutopopulateUtils {
  constructor(public copyToNew: CopyToNew) {}
  backUpSectionRows: Row[] = [];
  sectionTempGlobalReviewIndication: Section;
  indexEmptyGlobal: string[] = [];
  backUpSectionRowsGrouped: GroupRow[] = [];

  populateFixedSections(
    newVersion: Section,
    backUpDiagCode: any,
    sectionOrder: Section,
    columnPopulate: number
  ) {
    if (
      backUpDiagCode.dataAdd.length > 0 &&
      backUpDiagCode.processAddIndication
    ) {
      let existIndication = this.indicationExistSection(
        newVersion,
        backUpDiagCode.indicationAdd[0],
        columnPopulate,
        false
      );
      if (!existIndication)
        this.addIndication(backUpDiagCode.dataAdd, backUpDiagCode, false);
      backUpDiagCode.dataAdd = [];
    }
    this.checkForAddIndication(newVersion, backUpDiagCode, columnPopulate);
    this.autopopulateSectionsChilds(
      newVersion,
      backUpDiagCode,
      sectionOrder,
      columnPopulate
    );

    let orderData = this.copyColumnSection(sectionOrder, 0)
      .map((elm) => elm.columns[0].value.trim())
      .filter((item) => item !== "");

    newVersion.rows = newVersion.rows.sort((a, b) => {
      let indexA = this.getIndexIndicationSection(
        orderData,
        a.columns[columnPopulate].value.trim()
      );
      let indexB = this.getIndexIndicationSection(
        orderData,
        b.columns[columnPopulate].value.trim()
      );
      if (indexA < indexB) return -1;
      if (indexA > indexB) return 1;
      return 0;
    });

    this.copyToNew.checkSectionsFeedbacks(this.backUpSectionRows, newVersion);
  }

  populateSectionGrouped(
    newVersion: GroupedSection,
    backUpDiagCode: any,
    sectionOrder: Section,
    columnPopulate: number
  ) {
    if (
      backUpDiagCode.dataAdd.length > 0 &&
      backUpDiagCode.processAddIndication
    ) {
      let existIndication = this.indicationExistSection(
        newVersion,
        backUpDiagCode.indicationAdd[0],
        columnPopulate,
        true
      );
      if (!existIndication)
        this.addIndication(backUpDiagCode.dataAdd, backUpDiagCode, false);
      backUpDiagCode.dataAdd = [];
    }
    this.checkForAddIndication(newVersion, backUpDiagCode, columnPopulate);
    this.autopopulateSectionsChildsGrouped(
      newVersion,
      backUpDiagCode,
      sectionOrder,
      columnPopulate
    );

    let orderData = this.copyColumnSection(sectionOrder, 0)
      .map((elm) => elm.columns[0].value.trim())
      .filter((item) => item !== "");

    newVersion.groups = newVersion.groups.sort((a, b) => {
      let indexA = this.getIndexIndicationSection(
        orderData,
        a.names[columnPopulate].value.trim()
      );
      let indexB = this.getIndexIndicationSection(
        orderData,
        b.names[columnPopulate].value.trim()
      );
      if (indexA < indexB) return -1;
      if (indexA > indexB) return 1;
      return 0;
    });

    this.backUpSectionRowsGrouped =
      this.copyToNew.dataNewVersionGroup(newVersion);
    this.copyToNew.checkGroupedSectionsFeedbacks(
      this.backUpSectionRowsGrouped,
      newVersion
    );
  }

  populateGlobalReview(
    newVersion: Section,
    backUpDiagCode: any,
    sectionOrder: Section,
    columnPopulate: number
  ) {
    this.checkForAddIndication(newVersion, backUpDiagCode, columnPopulate);
    this.autopopulateGlobalReview(
      newVersion,
      backUpDiagCode,
      sectionOrder,
      columnPopulate,
    );
    newVersion.rows = this.exceptionReadOnly(newVersion);

    let orderData = this.copyColumnSection(sectionOrder, 0)
      .map((elm) => elm.columns[0].value.trim())
      .filter((item) => item !== "");
    const indicationsOnly = newVersion.rows.filter(
      (item) => item.columns[1].value.trim() !== ""
    );
    const currentOnly = newVersion.rows
      .map((data, index) => {
        return { idx: index, data };
      })
      .filter((item) => item.data.columns[1].value.trim() === "");
    indicationsOnly.sort((a, b) => {
      let indexA = this.getIndexIndicationSection(
        orderData,
        a.columns[columnPopulate].value.trim()
      );
      let indexB = this.getIndexIndicationSection(
        orderData,
        b.columns[columnPopulate].value.trim()
      );
      if (indexA < indexB) return -1;
      if (indexA > indexB) return 1;
    });
    let newData = indicationsOnly;
    currentOnly.forEach((item) => {
      newData.splice(item.idx, 0, item.data);
    });
    newVersion.rows = newData;
    this.copyToNew.checkSectionsFeedbacks(this.backUpSectionRows, newVersion);
  }

  populateCodeSummarySection(
    newVersion: Section,
    backUpDiagCode: Row[],
    columnPopulate: number,
    allDataPopulate: any
  ) {
    let copySection = JSON.parse(JSON.stringify(newVersion));
    let rowsdDiff = 0;
    if (allDataPopulate.indicationAdd.length > 0) {
      let existIcdCodeSectionSource = this.indicationExistInSource(
        allDataPopulate.dataCopy,
        allDataPopulate.indicationAdd,
        0
      );
      if (!existIcdCodeSectionSource) {
        this.addIndication(
          allDataPopulate.indicationAdd,
          allDataPopulate,
          false
        );
        allDataPopulate.indicationAdd = [];
      }
    }
    this.backUpSectionRows = this.copyToNew.dataNewVersion(newVersion);
    if (allDataPopulate.indicationOverride.length > 0) {
      this.dataOverrideGRICodes(newVersion, allDataPopulate, columnPopulate);
    } else {
      if (getValuesColumn(newVersion.rows, 1).length === 0) {
        this.populateFirtsTemplate(
          newVersion,
          backUpDiagCode,
          columnPopulate,
          rowsdDiff
        );
      } else {
        let diffData = this.parentDiffIndications(
          allDataPopulate.dataCopy,
          copySection,
          columnPopulate
        );
        if (diffData.length > 0) {
          this.addDataToSectionIcdCode(newVersion, diffData, columnPopulate);
        } else {
          rowsdDiff = this.controlNewIcdCodeChildSection(
            newVersion,
            allDataPopulate,
            rowsdDiff,
            columnPopulate
          );
        }
      }
    }
    if (newVersion.section.code === SectionCode.GlobalReviewCodes)
      newVersion.rows = this.exceptionReadOnly(newVersion);
    if (
      allDataPopulate.dataDelete.length > 0 &&
      allDataPopulate.processDeleteIndication
    ) {
      this.deleteNormalGroupedIndication(
        newVersion,
        allDataPopulate.dataDelete,
        columnPopulate,
        false
      );
    }
    if (
      allDataPopulate.dataAdd.length > 0 &&
      allDataPopulate.processAddIndication
    ) {
      this.addDataToSectionIcdCode(
        newVersion,
        allDataPopulate.dataAdd,
        columnPopulate
      );
      allDataPopulate.dataAdd = [];
    }
    if (backUpDiagCode !== null) {
      this.orderGlobalIcd10Codes(newVersion, backUpDiagCode, columnPopulate);
    }
    this.copyToNew.checkSectionsFeedbacks(this.backUpSectionRows, newVersion);
  }

  autopopulateSectionsChilds(
    newVersion: Section,
    backUpDiagCode: any,
    sectionOrder: Section,
    columnPopulate: number
  ) {
    let copySection = JSON.parse(JSON.stringify(newVersion));
    backUpDiagCode.dataCopy = this.verifyArrayDuplicateData(
      backUpDiagCode.dataCopy as Row[]
    );
    backUpDiagCode.dataCopy = backUpDiagCode.dataCopy.filter((item) => {
      return item.columns.length > 0 && item.columns[0].value.trim() !== "";
    });

    let rowsdDiff = 0;
    if (newVersion.rows.length > backUpDiagCode.dataCopy.length) {
      rowsdDiff = backUpDiagCode.dataCopy.length - newVersion.rows.length;
    } else {
      rowsdDiff = Math.abs(
        newVersion.rows.length - backUpDiagCode.dataCopy.length
      );
    }
    if (
      backUpDiagCode.indicationOverride.length > 0 &&
      !backUpDiagCode.autopopulateGlobalReviewSection
    ) {
      this.dataOverrideGlobal(newVersion, backUpDiagCode, columnPopulate);
    } else {
      if (getValuesColumn(newVersion.rows, 0).length === 0) {
        for (var i = 0; i < newVersion.rows.length; i++) {
          for (var j = 0; j < backUpDiagCode.dataCopy.length; j++) {
            if (i === j) {
              const column = {
                ...backUpDiagCode.dataCopy[j].columns[0],
                value: backUpDiagCode.dataCopy[j].columns[0].value.trim(),
                isReadOnly: true,
              };
              newVersion.rows[i].columns[columnPopulate] = column;
            }
          }
        }
        let diffData = this.parentDiffIndications(
          backUpDiagCode.dataCopy,
          newVersion,
          columnPopulate
        );
        if (diffData.length > 0) {
          this.addDataToSection(newVersion, diffData, columnPopulate);
        }
      } else {
        rowsdDiff = this.checkDataParentAndChild(
          newVersion,
          copySection,
          backUpDiagCode.dataCopy,
          columnPopulate,
          rowsdDiff,
          sectionOrder
        );
      }
    }
    this.backUpSectionRows = this.copyToNew.dataNewVersion(newVersion);
    copySection = JSON.parse(JSON.stringify(newVersion));
    this.addRowsAutopopulateSections(
      newVersion,
      backUpDiagCode.dataCopy as Row[],
      rowsdDiff,
      columnPopulate
    );
    if (
      backUpDiagCode.dataDelete.length > 0 &&
      backUpDiagCode.processDeleteIndication
    ) {
      this.deleteNormalGroupedIndication(
        newVersion,
        backUpDiagCode.dataDelete,
        columnPopulate,
        false
      );
    }
  }

  autopopulateGlobalReview(
    newVersion: Section,
    backUpDiagCode: any,
    sectionOrder: Section,
    columnPopulate: number,
  ) {
    let rowsdDiff = 0;
    let copySection = JSON.parse(JSON.stringify(newVersion));
    backUpDiagCode.dataCopyGlobal = this.verifyArrayDuplicateData(
      backUpDiagCode.dataCopyGlobal as Row[]
    );
    backUpDiagCode.dataCopyGlobal = backUpDiagCode.dataCopyGlobal.filter(
      (item) => {
        return item.columns.length > 0;
      }
    );

    if (newVersion.rows.length > backUpDiagCode.dataCopyGlobal.length) {
      rowsdDiff = backUpDiagCode.dataCopyGlobal.length - newVersion.rows.length;
    } else {
      rowsdDiff = Math.abs(
        newVersion.rows.length - backUpDiagCode.dataCopyGlobal.length
      );
    }
    if (
      backUpDiagCode.indicationOverride.length > 0 &&
      backUpDiagCode.autopopulateGlobalReviewSection
    ) {
      this.dataOverrideGlobal(newVersion, backUpDiagCode, columnPopulate);
    } else {
      if (getValuesColumn(newVersion.rows, 1).length === 0) {
        for (var i = 0; i < newVersion.rows.length; i++) {
          for (var j = 0; j < backUpDiagCode.dataCopyGlobal.length; j++) {
            if (i === j) {
              const column = {
                ...backUpDiagCode.dataCopyGlobal[j].columns[0],
                value: backUpDiagCode.dataCopyGlobal[j].columns[0].value.trim(),
                isReadOnly: false,
              };
              newVersion.rows[i].columns[columnPopulate] = column;
            }
          }
        }
        let diffData = this.parentDiffIndications(
          backUpDiagCode.dataCopyGlobal,
          newVersion,
          columnPopulate
        );
        if (diffData.length > 0) {
          this.addDataToSection(newVersion, diffData, columnPopulate);
        }
      } else {
        rowsdDiff = this.checkDataParentAndChild(
          newVersion,
          copySection,
          backUpDiagCode.dataCopyGlobal,
          columnPopulate,
          rowsdDiff,
          sectionOrder
        );
      }
    }

    this.backUpSectionRows = this.copyToNew.dataNewVersion(newVersion);
    copySection = JSON.parse(JSON.stringify(newVersion));
    this.actionDefaultPopulate(
        newVersion,
        backUpDiagCode,
        sectionOrder,
        columnPopulate,
        copySection
      );
  }

  firstAutopopulateGroupedSections(
    newVersion: GroupedSection,
    backUpDiagCode,
    columnPopulate: number
  ) {
    for (var i = 0; i < newVersion.groups.length; i++) {
      for (var j = 0; j < backUpDiagCode.dataCopy.length; j++) {
        if (i === j) {
          const column = {
            ...backUpDiagCode.dataCopy[j].columns[0],
            value: backUpDiagCode.dataCopy[j].columns[0].value.trim(),
            isReadOnly: true,
          };
          newVersion.groups[i].names[columnPopulate] = column;
        }
      }
    }
    let diffData = this.parentDiffIndicationsGrouped(
      backUpDiagCode.dataCopy,
      newVersion,
      columnPopulate
    );
    if (diffData.length > 0)
      this.addDataToSectionGrouped(newVersion, diffData, columnPopulate);
  }

  autopopulateSectionsChildsGrouped(
    newVersion: GroupedSection,
    backUpDiagCode: any,
    sectionOrder: Section,
    columnPopulate: number
  ) {
    let copySection = JSON.parse(JSON.stringify(newVersion));
    backUpDiagCode.dataCopy = this.verifyArrayDuplicateData(
      backUpDiagCode.dataCopy as Row[]
    );
    backUpDiagCode.dataCopy = backUpDiagCode.dataCopy.filter((item) => {
      return item.columns.length > 0 && item.columns[0].value.trim() !== "";
    });

    let rowsdDiff = 0;
    if (newVersion.groups.length > backUpDiagCode.dataCopy.length) {
      rowsdDiff = backUpDiagCode.dataCopy.length - newVersion.groups.length;
    } else {
      rowsdDiff = Math.abs(
        newVersion.groups.length - backUpDiagCode.dataCopy.length
      );
    }
    if (
      backUpDiagCode.indicationOverride.length > 0 &&
      !backUpDiagCode.autopopulateGlobalReviewSection
    ) {
      this.dataOverrideGrouped(newVersion, backUpDiagCode, columnPopulate);
    } else {
      if (getValuesInGroup(newVersion.groups, 0).length === 0) {
        this.firstAutopopulateGroupedSections(
          newVersion,
          backUpDiagCode,
          columnPopulate
        );
      } else {
        let diffData = this.parentDiffIndicationsGrouped(
          backUpDiagCode.dataCopy,
          newVersion,
          columnPopulate
        );
        if (diffData.length > 0) {
          this.addDataToSectionGrouped(newVersion, diffData, columnPopulate);
          rowsdDiff = rowsdDiff - 1;
        } else {
          let dataParent = this.valuesColumn(backUpDiagCode.dataCopy, 0);
          let dataSection = this.getGroupDataSection(
            newVersion,
            columnPopulate
          ).map((elm) => elm.names[columnPopulate].value.trim());
          let dataDiff = dataSection.filter(
            (elm) =>
              !dataParent
                .map((elm) => JSON.stringify(elm.trim()))
                .includes(JSON.stringify(elm.trim()))
          );
          for (let i = newVersion.groups.length; i--; ) {
            if (
              dataDiff.includes(
                newVersion.groups[i].names[columnPopulate].value.trim()
              )
            ) {
              newVersion.groups.splice(i, 1);
              rowsdDiff = rowsdDiff + 1;
            }
          }
        }
      }
    }

    copySection = JSON.parse(JSON.stringify(newVersion));
    this.addRowsAutopopulateSectionsGrouped(
      newVersion,
      backUpDiagCode.dataCopy as Row[],
      rowsdDiff,
      columnPopulate
    );
    if (
      backUpDiagCode.dataDelete.length > 0 &&
      backUpDiagCode.processDeleteIndication
    ) {
      this.deleteNormalGroupedIndication(
        newVersion,
        backUpDiagCode.dataDelete,
        columnPopulate,
        true
      );
    }
  }

  actionDefaultPopulate(
    newVersion: Section,
    backUpDiagCode: any,
    sectionOrder: Section,
    columnPopulate: number,
    copySection: Section
  ) {
    if (
      backUpDiagCode.dataDeleteGlobalReview.length > 0 &&
      backUpDiagCode.processDeleteIndication
    ) {
      this.deleteNormalGroupedIndication(
        newVersion,
        backUpDiagCode.dataDeleteGlobalReview,
        columnPopulate,
        false
      );
    }
    if (
      backUpDiagCode.dataAddGlobal.length > 0 &&
      backUpDiagCode.processAddIndication
    ) {
      this.addDataToSection(
        newVersion,
        backUpDiagCode.dataAddGlobal,
        columnPopulate
      );
      backUpDiagCode.dataAddGlobal = [];
    }
  }

 
  getIndexForEmpty(newVersion: Section) {
    let indexEmpty = [];
    newVersion.rows.map((row: Row, index) => {
      var datarow: Row = {
        ...row,
        columns: row.columns.map((col: Column) => {
          const column: Column = {
            ...col,
            isReadOnly: false,
          };
          return column;
        }),
      };
      if (
        datarow.columns[0].value.trim() !== "" &&
        datarow.columns[1].value.trim() === ""
      ) {
        indexEmpty.push(index);
      }
      return datarow;
    });
    return indexEmpty;
  }

  exceptionReadOnly(newVersion: Section) {
    return newVersion.rows.map((row: Row) => {
      var datarow: Row = {
        ...row,
        columns: row.columns.map((col: Column) => {
          const column: Column = {
            ...col,
            isReadOnly: false,
          };
          return column;
        }),
      };
      return datarow;
    });
  }

  addIndication(dataAdd, backUpDiagCode: any, addGlobalReview: boolean) {
    for (var i = 0; i < dataAdd.length; i++) {
      let newRow: Row = {
        codeUI: guidGenerator(),
        hasBorder: false,
        columns: [],
        code: "",
      };

      let columnNew: Column = {
        value: dataAdd[i],
        isReadOnly: true,
        feedbackData: [],
        comments: [],
        feedbackLeft: 0,
      };
      let column: Column[] = [];
      column.push(columnNew);
      newRow = {
        codeUI: guidGenerator(),
        hasBorder: false,
        columns: column,
        code: "",
        invalidCodes: "",
      };
      if (!addGlobalReview) {
        backUpDiagCode.dataCopy.splice(
          backUpDiagCode.dataCopy.length,
          0,
          newRow
        );
      } else {
        backUpDiagCode.dataCopyGlobal.splice(
          backUpDiagCode.dataCopyGlobal.length,
          0,
          newRow
        );
      }
    }
  }

  checkForAddIndication(
    newVersion: Section | GroupedSection,
    backUpDiagCode: any,
    columnPopulate: number
  ) {
    if (
      backUpDiagCode.indicationAdd.length > 0 &&
      backUpDiagCode.autopupulateAllChildSections
    ) {
      let existIndicationInFixedSectionSource = this.indicationExistInSource(
        backUpDiagCode.dataCopy,
        backUpDiagCode.indicationAdd,
        0
      );
      if (!existIndicationInFixedSectionSource)
        this.addIndication(backUpDiagCode.indicationAdd, backUpDiagCode, false);

      let existIndicationInGlobalSectionSource = this.indicationExistInSource(
        backUpDiagCode.dataCopyGlobal,
        backUpDiagCode.indicationAdd,
        0
      );

      if (!existIndicationInGlobalSectionSource)
        this.addIndication(backUpDiagCode.indicationAdd, backUpDiagCode, true);
      backUpDiagCode.indicationAdd = [];
    } else {
      if (!backUpDiagCode.autopopulateGlobalReviewSection) {
        if (
          backUpDiagCode.indicationAdd.length > 0 &&
          newVersion.section.code !== SectionCode.GlobalReviewIndications
        ) {
          let existIndication = this.indicationExistSection(
            newVersion,
            backUpDiagCode.indicationAdd[0],
            columnPopulate,
            false
          );
          if (!existIndication) {
            this.addIndication(
              backUpDiagCode.indicationAdd,
              backUpDiagCode,
              false
            );
            backUpDiagCode.indicationAdd = [];
          }
        }
      } else {
        if (
          backUpDiagCode.indicationAdd.length > 0 &&
          newVersion.section.code === SectionCode.GlobalReviewIndications
        ) {
          let existIndication = this.indicationExistSection(
            newVersion,
            backUpDiagCode.indicationAdd[0],
            columnPopulate,
            false
          );
          if (!existIndication) {
            this.addIndication(
              backUpDiagCode.indicationAdd,
              backUpDiagCode,
              true
            );
            backUpDiagCode.indicationAdd = [];
          }
        }
      }
    }
  }

  indicationExistInSource(
    source: Row[],
    indication: any,
    columnPopulate: number
  ): boolean {
    let data: string[] = getValuesColumn(source, columnPopulate);
    if (data.includes(indication[0].trim())) {
      return true;
    } else {
      return false;
    }
  }

  indicationExistSection(
    newVersion: Section | GroupedSection,
    indication: any,
    columnPopulate: number,
    grouped: boolean
  ): boolean {
    if (!grouped) {
      let data: string[] = getValuesColumn(
        (newVersion as Section).rows,
        columnPopulate
      );
      if (data.includes(indication)) {
        return true;
      } else {
        return false;
      }
    } else {
      let data: string[] = getValuesInGroup(
        (newVersion as GroupedSection).groups,
        columnPopulate
      );
      if (data.includes(indication)) {
        return true;
      } else {
        return false;
      }
    }
  }

  verifyArrayDuplicateData(data: Row[]) {
    let dataColumns = [];
    return data.map((row: Row) => {
      var datarow: Row = {
        ...row,
        columns: row.columns.map((col) => {
          let column = {
            ...col,
          };
          if (dataColumns.length === 0) {
            dataColumns.push(column.value.trim());
            return column;
          } else {
            if (!dataColumns.includes(column.value.trim())) {
              dataColumns.push(column.value.trim());
              return column;
            }
          }
        }),
      };
      eliminateUndefined(datarow.columns);
      return datarow;
    });
  }

  dataOverrideGlobal(
    newVersion: Section,
    backUpDiagCode: any,
    columnPopulate: number
  ) {
    let existIndicationInSection = this.indicationExistSection(
      newVersion,
      backUpDiagCode.indicationOverride[0].newIndication,
      columnPopulate,
      false
    );
    if (!existIndicationInSection) {
      for (var i = 0; i < newVersion.rows.length; i++) {
        if (
          newVersion.rows[i].columns[columnPopulate].value.trim() ==
          backUpDiagCode.indicationOverride[0].oldIndication.trim()
        ) {
          newVersion.rows[i].columns[columnPopulate] = {
            ...newVersion.rows[i].columns[columnPopulate],
            value: backUpDiagCode.indicationOverride[0].newIndication,
          };
        }
      }
    }
  }

  dataOverrideGrouped(
    newVersion: GroupedSection,
    backUpDiagCode: any,
    columnPopulate: number
  ) {
    let existIndicationInSection = this.indicationExistSection(
      newVersion,
      backUpDiagCode.indicationOverride[0].newIndication,
      columnPopulate,
      true
    );
    if (!existIndicationInSection) {
      for (var i = 0; i < newVersion.groups.length; i++) {
        if (
          newVersion.groups[i].names[columnPopulate].value.trim() ==
          backUpDiagCode.indicationOverride[0].oldIndication.trim()
        ) {
          newVersion.groups[i].names[columnPopulate] = {
            ...newVersion.groups[i].names[columnPopulate],
            value: backUpDiagCode.indicationOverride[0].newIndication,
          };
        }
      }
    }
  }

  checkDataParentAndChild(
    newVersion: Section,
    copySection: Section,
    backUpDiagCode: any,
    columnPopulate: number,
    rowsdDiff: number,
    sectionOrder: Section
  ) {
    let diffData = this.parentDiffIndications(
      backUpDiagCode,
      copySection,
      columnPopulate
    );
    if (diffData.length > 0) {
      this.addDataToSection(newVersion, diffData, columnPopulate);
      rowsdDiff = rowsdDiff - 1;
    } else {
      let dataParent = this.valuesColumn(backUpDiagCode, 0);
      let dataSection = this.copyColumnSection(copySection, columnPopulate).map(
        (elm) => elm.columns[0].value.trim()
      );
      let dataDiff = dataSection.filter(
        (elm) =>
          !dataParent
            .map((elm) => JSON.stringify(elm.trim()))
            .includes(JSON.stringify(elm.trim()))
      );
      for (let i = (newVersion as Section).rows.length; i--; ) {
        if (
          dataDiff.includes(
            (newVersion as Section).rows[i].columns[columnPopulate].value.trim()
          )
        ) {
          if (
            (newVersion as Section).rows[i].columns[
              columnPopulate
            ].value.trim() === ""
          ) {
            if (isEmptyRow((newVersion as Section).rows[i].columns)) {
              (newVersion as Section).rows.splice(i, 1);
            }
          } else {
            (newVersion as Section).rows.splice(i, 1);
          }
          rowsdDiff = rowsdDiff + 1;
        }
      }
    }
    return rowsdDiff;
  }

  parentDiffIndications(
    backUpDiagCode: any,
    copySection: Section,
    columnPopulate: number
  ): string[] {
    let dataParent = this.valuesColumn(backUpDiagCode, 0);
    let dataSection = this.copyColumnSection(copySection, columnPopulate).map(
      (elm) => elm.columns[0].value.trim()
    );
    let dataDiff = dataParent.filter(
      (elm) =>
        !dataSection
          .map((elm) => JSON.stringify(elm.trim()))
          .includes(JSON.stringify(elm.trim()))
    );
    return dataDiff;
  }

  copyColumnSection(newVersion: Section, columnPopulate: number): Row[] {
    if (newVersion.rows === undefined) {
      return [];
    }
    return newVersion.rows.map((row: Row) => {
      var datarow: Row = {
        ...row,
        columns: row.columns.map((col: Column, index) => {
          if (index === columnPopulate) {
            const column: Column = {
              ...col,
              comments: [],
            };
            return column;
          }
        }),
      };
      eliminateUndefined(datarow.columns);
      return datarow;
    });
  }

  parentDiffIndicationsGrouped(
    dataCopy: any,
    newVersion: GroupedSection,
    columnPopulate
  ): string[] {
    let dataSection = this.getGroupDataSection(newVersion, columnPopulate).map(
      (elm) => elm.names[columnPopulate].value.trim()
    );
    let dataParent = this.valuesColumn(dataCopy, 0);
    let dataDiff = dataParent.filter(
      (elm) =>
        !dataSection
          .map((elm) => JSON.stringify(elm.trim()))
          .includes(JSON.stringify(elm.trim()))
    );
    return dataDiff;
  }

  addRowsAutopopulateSections(
    newVersion: Section,
    backUpDiagCode: Row[],
    rowsdDiff: number,
    columnPopulate: number
  ) {
    if (rowsdDiff > 0) {
      let lastItem = newVersion.rows.length;
      let columnSection = newVersion.headers.length;
      let columnEmpty: Column = {
        value: "",
        isReadOnly: false,
        feedbackData: [],
        comments: [],
        feedbackLeft: 0,
      };

      for (let t = lastItem; t < backUpDiagCode.length; t++) {
        let newRow: Row = {
          codeUI: guidGenerator(),
          hasBorder: false,
          columns: [],
          code: "",
        };
        let column: Column[] = [];
        let columnsNewRow = Math.abs(
          columnSection - backUpDiagCode[t].columns.length
        );
        let columsAdd = [];
        for (let j = 0; j < columnsNewRow; j++) {
          columsAdd.push({ ...columnEmpty });
        }
        if (columnPopulate > 0) {
          columsAdd.splice(columsAdd.length - 1, 0, {
            ...backUpDiagCode[t].columns[0],
          });
          column = columsAdd;
        } else {
          column = backUpDiagCode[t].columns.concat(columsAdd);
          backUpDiagCode[t].columns[columnPopulate].isReadOnly = true;
          backUpDiagCode[t].columns[columnPopulate] = {
            ...backUpDiagCode[t].columns[columnPopulate],
            isReadOnly: true,
            compareColumn: null,
          };
        }
        for (let j = 0; j < newVersion.rows[0].columns.length; j++) {
          if (j === columnPopulate) {
            continue;
          }
          const oldColRef = newVersion.rows[0].columns[j];
          column[j] = { ...oldColRef, ...columnEmpty };
        }
        newRow = {
          codeUI: guidGenerator(),
          hasBorder: false,
          columns: column,
          code: "",
        };
        newVersion.rows.splice(newVersion.rows.length, 0, newRow);
      }
    } else if (rowsdDiff < 0) {
      newVersion.rows.splice(
        newVersion.rows.length - Math.abs(rowsdDiff),
        Math.abs(rowsdDiff)
      );
    }
  }

  addRowsAutopopulateSectionsGrouped(
    newVersion: GroupedSection,
    backUpDiagCode: Row[],
    rowsdDiff: number,
    columnPopulate: number
  ) {
    if (rowsdDiff > 0) {
      let lastItem = newVersion.groups.length;
      let columnSection = newVersion.headers.length;
      let columnEmpty: Column = {
        value: "",
        isReadOnly: false,
        feedbackData: [],
        comments: [],
        feedbackLeft: 0,
      };
      for (let t = lastItem; t < backUpDiagCode.length; t++) {
        let newGroup = { names: [], rows: [], codeGroupUI: "" };
        let newRow = { hasBorder: false, columns: [] };
        let rows = [];
        let names = [];
        let columnsNewRow = Math.abs(
          columnSection - backUpDiagCode[t].columns.length
        );
        let columsAdd: Column[] = [];
        for (let j = 0; j < columnsNewRow; j++) {
          columsAdd.push(columnEmpty);
        }
        backUpDiagCode[t].columns[0].isReadOnly = true;
        backUpDiagCode[t].columns[0] = {
          ...backUpDiagCode[t].columns[0],
          isReadOnly: true,
          compareColumn: null,
        };
        names.push({ ...backUpDiagCode[t].columns[0] });
        for (let j = 0; j < newVersion.groups[0].rows[0].columns.length; j++) {
          const oldColRef = newVersion.groups[0].rows[0].columns[j];
          columsAdd[j] = { ...oldColRef, ...columnEmpty };
        }
        newRow = {
          hasBorder: false,
          columns: columsAdd,
        };
        rows.push(newRow);

        newGroup = {
          names: names,
          codeGroupUI: guidGenerator(),
          rows: rows,
        };
        newVersion.groups.splice(newVersion.groups.length, 0, newGroup);
      }
    } else if (rowsdDiff < 0) {
      newVersion.groups.splice(
        newVersion.groups.length - Math.abs(rowsdDiff),
        Math.abs(rowsdDiff)
      );
    }
  }

  deleteNormalGroupedIndication(
    newVersion: Section | GroupedSection,
    dataAdd: any[],
    columnPopulate: number,
    deleteIndicationGrouped: boolean
  ) {
    let index = [];
    let indicationsDelete = [];
    indicationsDelete = dataAdd.map((item) => {
      if (item["value"] !== null) return item["value"].trim();
    });
    eliminateUndefined(indicationsDelete);
    if (deleteIndicationGrouped) {
      for (let i = (newVersion as GroupedSection).groups.length; i--; ) {
        if (
          indicationsDelete.includes(
            (newVersion as GroupedSection).groups[i].names[0].value.trim()
          )
        ) {
          (newVersion as GroupedSection).groups.splice(i, 1);
        }
      }
      for (let i of index) {
        if (i === 1 && index.length === 1)
          (newVersion as GroupedSection).groups.splice(i, 1);
        else (newVersion as GroupedSection).groups.splice(0, 1);
      }
      return newVersion;
    } else {
      for (let i = (newVersion as Section).rows.length; i--; ) {
        if (
          indicationsDelete.includes(
            (newVersion as Section).rows[i].columns[columnPopulate].value.trim()
          )
        ) {
          (newVersion as Section).rows.splice(i, 1);
        }
      }
      return newVersion;
    }
  }

 
  getIndexIndicationSection(order: string[], indication: string) {
    let indexIndication: number;
    for (let i = 0; i < order.length; i++) {
      if (order[i].trim() === indication.trim()) {
        indexIndication = i;
      }
    }
    return indexIndication;
  }

  getRowFromCopySection(
    newVersion: Section,
    indication: string,
    columnPopulate: number
  ) {
    let rowIndication: Row;
    newVersion.rows.map((row: Row, index) => {
      var datarow: Row = {
        ...row,
        columns: row.columns.map((col: Column) => {
          const column: Column = {
            ...col,
            isReadOnly: false,
          };
          return column;
        }),
      };
      if (datarow.columns[columnPopulate].value.trim() === indication.trim()) {
        rowIndication = datarow;
      }
      return datarow;
    });
    return rowIndication;
  }

  getGroupDataSection(
    newVersion: GroupedSection,
    columnPopulate: number
  ): GroupRow[] {
    if (newVersion.groups === undefined) {
      return [];
    }
    return newVersion.groups.map((group: GroupRow) => {
      var datarow: GroupRow = {
        ...group,
        names: group.names.map((col: Column, index) => {
          if (index === columnPopulate) {
            const column: Column = {
              ...col,
              comments: [],
            };
            return column;
          }
        }),
      };
      eliminateUndefined(datarow.names);
      return datarow;
    });
  }

  getGroupsFromCopySection(
    newVersion: GroupedSection,
    indication: string,
    columnPopulate: number
  ) {
    let rowIndication: GroupRow;
    newVersion.groups.map((group: GroupRow, index) => {
      var datarow: GroupRow = {
        ...group,
        names: group.names.map((row: Column) => {
          const column: Column = {
            ...row,
            isReadOnly: false,
          };
          return column;
        }),
      };
      if (datarow.names[columnPopulate].value.trim() === indication.trim()) {
        rowIndication = datarow;
      }
      return datarow;
    });
    return rowIndication;
  }

  clearDataAutopopulation(newVersion: Section) {
    let columnSection = newVersion.headers.length;
    for (let i = 0; i < newVersion.rows.length; i++) {
      for (let j = 0; j < columnSection; j++) {
        if (!newVersion.rows[i].columns[j].isReadOnly) {
          const columnClear = {
            ...newVersion.rows[i].columns[j],
            value: "",
          };
          newVersion.rows[i].columns[j] = columnClear;
        }
      }
    }
  }


  addDataToSection(
    newVersion: Section,
    diffData: string[],
    columnPopulate: number
  ) {
    for (var j = 0; j < diffData.length; j++) {
      let existIndicationInSection = this.indicationExistSection(
        newVersion,
        diffData[j].trim(),
        columnPopulate,
        false
      );
      if (!existIndicationInSection) {
        const newRow = createNewRow(newVersion.rows);
        newRow.columns[columnPopulate].value = diffData[j].trim();
        newVersion.rows.splice(newVersion.rows.length, 0, newRow);
      }
    }
  }

  valuesColumn(dataCopy: Row[], column: number) {
    let data: string[] = [];
    for (var i = 0; i < dataCopy.length; i++) {
      if (
        dataCopy[i].columns.length > 0 &&
        dataCopy[i].columns[column].value.trim() !== ""
      ) {
        if (dataCopy[i].columns[column].value.includes(",")) {
          let val = dataCopy[i].columns[column].value.split(",");
          val = val.map((s) => s.trim());
          val = val.filter((v) => v != "");
          data.push(...val);
        } else {
          data.push(dataCopy[i].columns[column].value.trim());
        }
      }
    }
    return data;
  }

  addDataToSectionIcdCode(
    newVersion: Section,
    diffData: string[],
    columnPopulate: number
  ) {
    for (var j = 0; j < diffData.length; j++) {
      const newRow = createNewRow(newVersion.rows);
      newRow.columns[columnPopulate].value = diffData[j].trim();
      newVersion.rows.splice(newVersion.rows.length, 0, newRow);
    }
  }

  dataOverrideGRICodes(
    newVersion: Section,
    backUpDiagCode: any,
    columnPopulate: number
  ) {
    let existIndicationInSection = this.indicationExistSection(
      newVersion,
      backUpDiagCode.indicationOverride[0].oldIcd10Code,
      columnPopulate,
      false
    );
    if (!existIndicationInSection) {
      for (var i = 0; i < newVersion.rows.length; i++) {
        if (
          newVersion.rows[i].columns[columnPopulate].value.trim() ==
          backUpDiagCode.indicationOverride[0].oldIcd10Code.trim()
        ) {
          newVersion.rows[i].columns[columnPopulate].value =
            backUpDiagCode.indicationOverride[0].newIcd10Code;
        }
      }
    }
  }

  populateFirtsTemplate(
    newVersion: Section,
    backUpDiagCode: Row[],
    columnPopulate: number,
    rowsdDiff: number
  ) {
    if (newVersion.rows.length > backUpDiagCode.length) {
      rowsdDiff = backUpDiagCode.length - newVersion.rows.length;
    } else {
      rowsdDiff = Math.abs(newVersion.rows.length - backUpDiagCode.length);
    }
    for (var i = 0; i < newVersion.rows.length; i++) {
      for (var j = 0; j < backUpDiagCode.length; j++) {
        if (i === j) {
          const column = {
            ...backUpDiagCode[j].columns[0],
            isReadOnly: true,
          };
          newVersion.rows[i].columns[columnPopulate] = column;
        }
      }
    }
    this.addRowsAutopopulateSections(
      newVersion,
      backUpDiagCode,
      rowsdDiff,
      columnPopulate
    );
  }

  controlNewIcdCodeChildSection(
    newVersion: Section,
    allDataPopulate: any,
    rowsdDiff: number,
    columnPopulate: number
  ): number {
    let dataSection = this.copyColumnSection(newVersion, columnPopulate).map(
      (elm) => elm.columns[0].value.trim()
    );
    let dataParent = getValuesColumn(allDataPopulate.dataCopy, 0);
    let dataDiff = dataSection.filter(
      (elm) =>
        !dataParent
          .map((elm) => JSON.stringify(elm.trim()))
          .includes(JSON.stringify(elm.trim()))
    );
    for (let i = (newVersion as Section).rows.length; i--; ) {
      if (
        dataDiff.includes(
          (newVersion as Section).rows[i].columns[columnPopulate].value.trim()
        )
      ) {
        if (
          (newVersion as Section).rows[i].columns[
            columnPopulate
          ].value.trim() === ""
        ) {
          if (isEmptyRow((newVersion as Section).rows[i].columns)) {
            (newVersion as Section).rows.splice(i, 1);
          }
        } else {
          (newVersion as Section).rows.splice(i, 1);
        }
        rowsdDiff = rowsdDiff + 1;
      }
    }
    return rowsdDiff;
  }

  orderGlobalIcd10Codes(
    newVersion: Section | GroupedSection,
    orderRows: Row[],
    columnPopulate: number
  ) {
    let provisionalArray: Row[] = [];
    let order = orderRows.map((item) => item.columns[0].value);
    let copySection = JSON.parse(JSON.stringify(newVersion));
    for (var i = 0; i < (newVersion as Section).rows.length; i++) {
      if (
        order.includes(
          (newVersion as Section).rows[i].columns[columnPopulate].value.trim()
        )
      ) {
        let indexIndication = this.getIndexIndicationSection(
          order,
          (newVersion as Section).rows[i].columns[columnPopulate].value.trim()
        );
        let row = this.getRowFromCopySection(
          copySection as Section,
          (newVersion as Section).rows[i].columns[columnPopulate].value.trim(),
          columnPopulate
        );
        if (row === undefined) row = (newVersion as Section).rows[i];
        if (columnPopulate === 0) row.columns[columnPopulate].isReadOnly = true;
        else row.columns[columnPopulate].isReadOnly = false;
        provisionalArray.splice(indexIndication, 0, row);
      } else {
        provisionalArray.splice(i, 0, (newVersion as Section).rows[i]);
      }
    }
    (newVersion as Section).rows = provisionalArray;
    return newVersion;
  }

  getParentChildIndications(
    newVersion: Section,
    backUpDiagCode: Section,
    getDataChildSection: boolean,
    columnPopulate: number,
    areIcd10Codes: boolean = false
  ) {
    let dataDiff: string[] | Column[];
    let dataPrevious: string[];
    let dataChild: Column[];
    if (newVersion.section.code === SectionCode.GlobalReviewIndications)
      dataPrevious = getValuesColumn(newVersion.rows, 0);
    else dataPrevious = getValuesColumn(newVersion.rows, columnPopulate);
    if (dataPrevious.length === 0 || backUpDiagCode.rows === undefined) {
      return dataPrevious;
    }
    if (newVersion.section.code === SectionCode.GlobalReviewIndications)
      dataChild = this.copyColumnSection(newVersion, 0)
        .map((elm) => elm.columns[0])
        .filter((item) => item.value.trim() !== "");
    else
      dataChild = this.copyColumnSection(newVersion, columnPopulate)
        .map((elm) => elm.columns[0])
        .filter((item) => item.value.trim() !== "");

    let dataFather = backUpDiagCode.rows
      .map((elm) => elm.columns[columnPopulate])
      .filter((item) => item.value.trim() !== "");

    if (areIcd10Codes) dataChild = this.separetaValues(dataChild);

    if (getDataChildSection) {
      dataDiff = dataFather.filter(
        (elm) =>
          !dataChild
            .map((elm) => JSON.stringify(elm.value.trim()))
            .includes(JSON.stringify(elm.value.trim()))
      );
    } else {
      dataDiff = dataChild.filter(
        (elm) =>
          !dataFather
            .map((elm) => JSON.stringify(elm.value.trim()))
            .includes(JSON.stringify(elm.value.trim()))
      );
    }
    return dataDiff;
  }

  separetaValues(dataCopy: Column[]): Column[] {
    let temArr = [];
    for (let i = 0; i < dataCopy.length; i++) {
      let arr = dataCopy[i].value.split(",");
      for (let j = 0; j < arr.length; j++) {
        if (arr[j].trim() !== "") {
          const columnClear = {
            ...dataCopy[i],
            value: arr[j].trim(),
          };
          temArr.push(columnClear);
        }
      }
    }
    return temArr;
  }

  checkIfDataIsComplete(event, data: string[]): string[] {
    if (event.indicationAdd.length > 0) {
      data.push(event.indicationAdd[0]);
      if (event.dataAdd.length > 0) {
        for (let i = 0; i < event.dataAdd.length; i++) {
          data.push(event.dataAdd[i]);
        }
      }
      if (event.dataDelete.length > 1) {
        let dataDel = event.dataDelete.map((item) => {
          if (item["value"] !== null) return item["value"].trim();
        });
        for (let j = data.length; j--; ) {
          if (dataDel.includes(data[j].trim())) {
            data.splice(j, 1);
          }
        }
      }
    }
    if (event.indicationOverride.length > 0) {
      data.push(event.indicationOverride[0].newIcd10Code);
      let dataOverraide = data.indexOf(
        event.indicationOverride[0].oldIcd10Code.trim()
      );
      data.splice(dataOverraide, 1);
      if (event.dataAdd.length > 0) {
        for (let i = 0; i < event.dataAdd.length; i++) {
          data.push(event.dataAdd[i]);
        }
      }
      if (event.dataDelete.length > 1) {
        let dataDel = event.dataDelete.map((item) => {
          if (item["value"] !== null) return item["value"].trim();
        });
        for (let j = data.length; j--; ) {
          if (dataDel.includes(data[j].trim())) {
            data.splice(j, 1);
          }
        }
      }
    }
    return data;
  }

  addDataToSectionGrouped(
    newVersion: GroupedSection,
    diffData: string[],
    columnPopulate: number
  ) {
    for (var j = 0; j < diffData.length; j++) {
      const newGroup = createNewGroup(newVersion, 0);
      newGroup.names[columnPopulate].value = diffData[j].trim();
      newGroup.names[columnPopulate].isReadOnly = true;
      newVersion.groups.splice(newVersion.groups.length, 0, newGroup);
    }
  }

  fillInRows(response, sections: UISection[]): GroupRow[] {
    const overlapsData = this.processResponseAutopopulateGrouped(response);
    let dcsIndication: UISection = null;
    let dmIndication: UISection = null;
    let mfIndication: UISection = null;
    let uotIndication: UISection = null;
    let votIndication: UISection = null;
    let ageIndication: UISection = null;
    sections.forEach((section: UISection) => {
      switch (section.new.section.code) {
        case SectionCode.DiagnosticCodeSummary:
          dcsIndication = section;
          break;
        case SectionCode.DailyMaximumDose:
          dmIndication = section;
          break;
        case SectionCode.MaximumFrequency:
          mfIndication = section;
          break;
        case SectionCode.UnitsOverTime:
          uotIndication = section;
          break;
        case SectionCode.VisitOverTime:
          votIndication = section;
          break;
        case SectionCode.Age:
          ageIndication = section;
          break;
      }
    });

    const cleanStr = (val) => val.replace(/[^a-zA-Z0-9.-]/g, "");
    overlapsData.forEach((group: GroupRow) => {
      const code = group.names[0].value;
      group.rows = [];
      let getIndications = [];
      (dcsIndication.new as Section).rows.forEach((row) => {
        if (row.columns[1].value.includes(",")) {
          let val = row.columns[1].value.split(",");
          val = val.map((s) => cleanStr(s.replace(/\s/g, "")));
          val = val.filter((v) => v != "");
          const rowCodes = [...val].map(x => x.toLowerCase());
          if (rowCodes.indexOf(code.toLowerCase()) > -1) {
            getIndications.push(row.columns[0].value);
          }
        } else {
          const rowCode = row.columns[1].value.replace(/\s/g, "");
          if (cleanStr(rowCode).toLowerCase() === code.toLowerCase()) {
            getIndications.push(row.columns[0].value);
          }
        }
      });
      let startIndex = 0;
      getIndications.forEach((indication: string) => {
        let dmIndicationRows = this.getIndicationRows(dmIndication, indication);
        let mfIndicationRows = this.getIndicationRows(mfIndication, indication);
        let uotIndicationRows = this.getIndicationRows(
          uotIndication,
          indication
        );
        let votIndicationRows = this.getIndicationRows(
          votIndication,
          indication
        );
        let ageIndicationRows = this.getIndicationRows(
          ageIndication,
          indication
        );
        const rowForGivenIndication = [
          dmIndicationRows,
          mfIndicationRows,
          uotIndicationRows,
          votIndicationRows,
          ageIndicationRows,
        ];

        const highestRows = rowForGivenIndication
          .map((x) => x.length)
          .reduce((a, b) => Math.max(a, b));
        const rows = new Array(highestRows).fill(null).map(() => {
          return {
            hasBorder: false,
            columns: new Array(7).fill(null).map((_, index) => {
              return {
                isReadOnly: false,
                feedbackData: [],
                feedbackLeft: 0,
                value: index === 0 ? indication.trim() : "",
              };
            }),
          };
        });
        const lastIndex = rows.length -1;
        rows[lastIndex].hasBorder = true;
        group.rows = group.rows.concat(rows);
        const indexes = [
          [2, 1],
          [0, 2],
          [0, 3],
          [0, 4],
          [0, 5],
        ];
        rowForGivenIndication.forEach((iRows, indicationRowIndex) => {
          if (iRows.length > 0) {
            iRows.forEach((row, rIndex) => {
              group.rows[startIndex + rIndex].columns[
                indexes[indicationRowIndex][1]
              ].value = row.columns[indexes[indicationRowIndex][0]].value;
            });
          }
        });
        startIndex += highestRows;
      });
    });
    return overlapsData;
  }

  getIndicationRows(section, indication: string): Row[] {
    if (!section) [];
    if (section.grouped) {
      for (let i = 0; i < (section.new as GroupedSection).groups.length; i++) {
        if (
          (section.new as GroupedSection).groups[i].names[0].value.trim() ===
          indication.trim()
        ) {
          const rows = (section.new as GroupedSection).groups[i].rows;
          if(rows.every(r => r.columns.every(c => c.value.trim() === ''))) {
            return [rows[0]]
          } else {
            return rows.filter(r => r.columns.some(c => c.value.trim() !== ''))
          }
        }
      }
    } else {
      for (let i = 0; i < (section.new as Section).rows.length; i++) {
        if (
          (section.new as Section).rows[i].columns[0].value.trim() ===
          indication.trim()
        ) {
          return [(section.new as Section).rows[i]];
        }
      }
    }
    return [];
  }

  processResponseAutopopulateGrouped(response) {
    let allGroups: GroupRow[] = [];
    let newRow: Row = { hasBorder: false, code: "", columns: [] };
    let emptyColumn = {
      isReadOnly: false,
      feedbackData: [],
      feedbackLeft: 0,
      value: "",
    };
    const mergedArrays: string[] = response.data.lstValidIcd10Codes.concat(
      response.data.lstInvalidIcd10Codes
    );
    for (let j = 0; j < mergedArrays.length; j++) {
      emptyColumn = {
        ...emptyColumn,
        value: mergedArrays[j]
      };
      newRow = {
        ...newRow,
        columns: [emptyColumn],
      };
      const group: GroupRow = { names: [emptyColumn], rows: [newRow] };
      allGroups.push(group);
    }

    return allGroups;
  }

  populateOverlapsGroupedSection(
    newVersion: GroupedSection,
    backUpGroup: GroupRow[]
  ) {
    this.backUpSectionRowsGrouped =
      this.copyToNew.dataNewVersionGroup(newVersion);
    newVersion.groups = backUpGroup;
    this.copyToNew.checkGroupedSectionsFeedbacks(
      this.backUpSectionRowsGrouped,
      newVersion
    );
  }

  getIndexForBorder(newVersion: GroupedSection) {
    let value = "";
    let indexBordes = {
      indexBorderRows: [],
      indexBordesGroup: [],
    };
    newVersion.groups.map((group, indexGroup) => {
      var data = {
        names: group.names.map((column) => {
          return {
            ...column,
          };
        }),
        codeGroupUI: guidGenerator(),
        rows: group.rows.map((row: Row, index) => {
          var datarow: Row = {
            ...row,
            columns: row.columns.map((col: Column) => {
              const column: Column = {
                ...col,
                isReadOnly: false,
              };
              return column;
            }),
          };
          if (value !== datarow.columns[0].value && value !== "") {
            if (index !== 0) {
              indexBordes.indexBorderRows.push(index - 1);
            }
          }
          value = datarow.columns[0].value;
          return datarow;
        }),
      };
      indexBordes.indexBordesGroup.push(
        newVersion.groups[indexGroup].rows.length - 1
      );
    });

    indexBordes.indexBorderRows = indexBordes.indexBorderRows.filter(
      (item, index) => {
        return indexBordes.indexBorderRows.indexOf(item) === index;
      }
    );
    indexBordes.indexBordesGroup = indexBordes.indexBordesGroup.filter(
      (item, index) => {
        return indexBordes.indexBordesGroup.indexOf(item) === index;
      }
    );
    return indexBordes;
  }
}
