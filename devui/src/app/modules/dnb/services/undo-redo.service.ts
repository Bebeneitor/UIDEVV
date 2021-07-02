import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { LoadingSpinnerService } from "src/app/services/spinner.service";
import {
  BatchSectionsPosition,
  DnBActions,
  SectionHeader,
  SectionPosition,
} from "../models/constants/actions.constants";
import {
  Column,
  GroupedSection,
  GroupRow,
  Row,
  Section,
  UISection,
} from "../models/interfaces/uibase";

@Injectable({
  providedIn: "root",
})
export class DnbUndoRedoService {
  history = [null];
  historyComands = [null];
  position: number = 0;
  sections: UISection[] = null;
  drugNameColumn: Column = null;
  stackInfo: Subject<{ stack: string[]; position: number }> = new Subject<{
    stack: string[];
    position: number;
  }>();

  constructor(private loadingSpinner: LoadingSpinnerService) {}

  createColumnCommand = (
    sections: UISection[],
    obj: SectionPosition,
    newVal,
    oldVal
  ) => {
    const { sectionIndex, rowIndex, columnIndex } = obj;
    return {
      execute: (isUserTyping: boolean) => {
        if (isUserTyping) {
          (sections[sectionIndex].new as Section).rows[rowIndex].columns[
            columnIndex
          ].value = newVal;
        } else {
          (sections[sectionIndex].new as Section).rows[rowIndex].columns[
            columnIndex
          ] = {
            ...(sections[sectionIndex].new as Section).rows[rowIndex].columns[
              columnIndex
            ],
            value: newVal,
          };
        }
        sections[sectionIndex].new = {
          ...sections[sectionIndex].new,
        };
        return obj;
      },
      undo: () => {
        (sections[sectionIndex].new as Section).rows[rowIndex].columns[
          columnIndex
        ] = {
          ...(sections[sectionIndex].new as Section).rows[rowIndex].columns[
            columnIndex
          ],
          value: oldVal,
        };
        sections[sectionIndex].new = {
          ...sections[sectionIndex].new,
        };
        return obj;
      },
    };
  };
  createGroupedColumnCommand = (
    sections: UISection[],
    obj: SectionPosition,
    newVal,
    oldVal
  ) => {
    const { sectionIndex, groupIndex, rowIndex, columnIndex, isName } = obj;
    return {
      execute: (isUserTyping: boolean) => {
        if (isUserTyping) {
          if (isName) {
            (sections[sectionIndex].new as GroupedSection).groups[
              groupIndex
            ].names[columnIndex].value = newVal;
          } else {
            (sections[sectionIndex].new as GroupedSection).groups[
              groupIndex
            ].rows[rowIndex].columns[columnIndex].value = newVal;
          }
        } else {
          const group = (sections[sectionIndex].new as GroupedSection).groups[
            groupIndex
          ];
          if (isName) {
            (sections[sectionIndex].new as GroupedSection).groups[
              groupIndex
            ].names[columnIndex] = {
              ...group.names[columnIndex],
              value: newVal,
            };
          } else {
            (sections[sectionIndex].new as GroupedSection).groups[
              groupIndex
            ].rows[rowIndex].columns[columnIndex] = {
              ...group.rows[rowIndex].columns[columnIndex],
              value: newVal,
            };
          }
        }
        sections[sectionIndex].new = {
          ...sections[sectionIndex].new,
        };
        return obj;
      },
      undo: () => {
        const group = (sections[sectionIndex].new as GroupedSection).groups[
          groupIndex
        ];
        if (isName) {
          (sections[sectionIndex].new as GroupedSection).groups[
            groupIndex
          ].names[columnIndex] = {
            ...group.names[columnIndex],
            value: oldVal,
          };
        } else {
          (sections[sectionIndex].new as GroupedSection).groups[
            groupIndex
          ].rows[rowIndex].columns[columnIndex] = {
            ...group.rows[rowIndex].columns[columnIndex],
            value: oldVal,
          };
        }
        sections[sectionIndex].new = {
          ...sections[sectionIndex].new,
        };
        return obj;
      },
    };
  };
  createColumnSearchCommand = (
    sections: UISection[],
    obj: SectionPosition,
    newVal,
    oldVal
  ) => {
    const { sectionIndex, rowIndex, columnIndex } = obj;
    const { value, searchData, highlight } = newVal;
    const oldValue = oldVal.value;
    const oldSearch = oldVal.searchData;
    const oldHighlight = oldVal.highlight;
    return {
      execute: () => {
        (sections[sectionIndex].new as Section).rows[rowIndex].columns[
          columnIndex
        ] = {
          ...(sections[sectionIndex].new as Section).rows[rowIndex].columns[
            columnIndex
          ],
          value: value,
        };
        (sections[sectionIndex].new as Section).rows[rowIndex].columns[
          columnIndex
        ] = {
          ...(sections[sectionIndex].new as Section).rows[rowIndex].columns[
            columnIndex
          ],
          searchData: searchData,
        };
        (sections[sectionIndex].new as Section).rows[rowIndex].columns[
          columnIndex
        ] = {
          ...(sections[sectionIndex].new as Section).rows[rowIndex].columns[
            columnIndex
          ],
          highlight: highlight,
        };

        sections[sectionIndex].new = {
          ...sections[sectionIndex].new,
        };
        return { ...obj, command: DnBActions.COLUMN_SEARCH_CHANGE };
      },
      undo: () => {
        (sections[sectionIndex].new as Section).rows[rowIndex].columns[
          columnIndex
        ] = {
          ...(sections[sectionIndex].new as Section).rows[rowIndex].columns[
            columnIndex
          ],
          value: oldValue,
        };
        (sections[sectionIndex].new as Section).rows[rowIndex].columns[
          columnIndex
        ] = {
          ...(sections[sectionIndex].new as Section).rows[rowIndex].columns[
            columnIndex
          ],
          searchData: oldSearch,
        };
        (sections[sectionIndex].new as Section).rows[rowIndex].columns[
          columnIndex
        ] = {
          ...(sections[sectionIndex].new as Section).rows[rowIndex].columns[
            columnIndex
          ],
          highlight: oldHighlight,
        };
        sections[sectionIndex].new = {
          ...sections[sectionIndex].new,
        };
        return { ...obj, command: DnBActions.COLUMN_SEARCH_CHANGE };
      },
    };
  };
  createGroupedColumnSearchCommand = (
    sections: UISection[],
    obj: SectionPosition,
    newVal,
    oldVal
  ) => {
    const { sectionIndex, groupIndex, rowIndex, columnIndex, isName } = obj;
    const { value, searchData, highlight } = newVal;
    const oldValue = oldVal.value;
    const oldSearch = oldVal.searchData;
    const oldHighlight = oldVal.highlight;
    return {
      execute: () => {
        const group = (sections[sectionIndex].new as GroupedSection).groups[
          groupIndex
        ];
        if (isName) {
          (sections[sectionIndex].new as GroupedSection).groups[
            groupIndex
          ].names[columnIndex] = {
            ...group.names[columnIndex],
            value: value,
          };
          (sections[sectionIndex].new as GroupedSection).groups[
            groupIndex
          ].names[columnIndex] = {
            ...group.names[columnIndex],
            searchData: searchData,
          };
          (sections[sectionIndex].new as GroupedSection).groups[
            groupIndex
          ].names[columnIndex] = {
            ...group.names[columnIndex],
            highlight: highlight,
          };
        } else {
          (sections[sectionIndex].new as GroupedSection).groups[
            groupIndex
          ].rows[rowIndex].columns[columnIndex] = {
            ...group.rows[rowIndex].columns[columnIndex],
            value: value,
          };
          (sections[sectionIndex].new as GroupedSection).groups[
            groupIndex
          ].rows[rowIndex].columns[columnIndex] = {
            ...group.rows[rowIndex].columns[columnIndex],
            searchData: searchData,
          };
          (sections[sectionIndex].new as GroupedSection).groups[
            groupIndex
          ].rows[rowIndex].columns[columnIndex] = {
            ...group.rows[rowIndex].columns[columnIndex],
            highlight: highlight,
          };
        }

        sections[sectionIndex].new = {
          ...sections[sectionIndex].new,
        };
        return { ...obj, command: DnBActions.GROUPED_COLUMN_SEARCH_CHANGE };
      },
      undo: () => {
        const group = (sections[sectionIndex].new as GroupedSection).groups[
          groupIndex
        ];
        if (isName) {
          (sections[sectionIndex].new as GroupedSection).groups[
            groupIndex
          ].names[columnIndex] = {
            ...group.names[columnIndex],
            value: oldValue,
          };
          (sections[sectionIndex].new as GroupedSection).groups[
            groupIndex
          ].names[columnIndex] = {
            ...group.names[columnIndex],
            searchData: oldSearch,
          };
          (sections[sectionIndex].new as GroupedSection).groups[
            groupIndex
          ].names[columnIndex] = {
            ...group.names[columnIndex],
            highlight: oldHighlight,
          };
        } else {
          (sections[sectionIndex].new as GroupedSection).groups[
            groupIndex
          ].rows[rowIndex].columns[columnIndex] = {
            ...group.rows[rowIndex].columns[columnIndex],
            value: oldValue,
          };
          (sections[sectionIndex].new as GroupedSection).groups[
            groupIndex
          ].rows[rowIndex].columns[columnIndex] = {
            ...group.rows[rowIndex].columns[columnIndex],
            searchData: oldSearch,
          };
          (sections[sectionIndex].new as GroupedSection).groups[
            groupIndex
          ].rows[rowIndex].columns[columnIndex] = {
            ...group.rows[rowIndex].columns[columnIndex],
            highlight: oldHighlight,
          };
        }
        sections[sectionIndex].new = {
          ...sections[sectionIndex].new,
        };
        return { ...obj, command: DnBActions.GROUPED_COLUMN_SEARCH_CHANGE };
      },
    };
  };
  createSectionCommand = (
    sections: UISection[],
    obj: SectionPosition,
    newVal: Section
  ) => {
    let { sectionIndex } = obj;
    const previousfeedbackData = sections[sectionIndex].new.feedbackData.map(
      (x) => {
        return {
          ...x,
        };
      }
    );
    const previousfeedbackLeft = sections[sectionIndex].new.feedbackLeft;
    const previousRows = (sections[sectionIndex].new as Section).rows.map(
      (r) => {
        return {
          ...r,
          columns: r.columns.map((c) => {
            return {
              ...c,
            };
          }),
        };
      }
    );

    return {
      execute: (value) => {
        (sections[sectionIndex].new as Section).rows = newVal.rows;
        sections[sectionIndex].new.feedbackData = newVal.feedbackData;
        sections[sectionIndex].new.feedbackLeft = newVal.feedbackLeft;
        sections[sectionIndex].new = {
          ...sections[sectionIndex].new,
        };
        return obj;
      },
      undo: () => {
        (sections[sectionIndex].new as Section).rows = previousRows;
        sections[sectionIndex].new.feedbackData = previousfeedbackData;
        sections[sectionIndex].new.feedbackLeft = previousfeedbackLeft;
        sections[sectionIndex].new = {
          ...sections[sectionIndex].new,
        };
        return obj;
      },
    };
  };
  createGroupedSectionCommand = (
    sections: UISection[],
    obj: SectionPosition,
    newVal: GroupedSection
  ) => {
    let { sectionIndex } = obj;
    const previousfeedbackData = sections[sectionIndex].new.feedbackData.map(
      (x) => {
        return {
          ...x,
        };
      }
    );
    const previousGroups = (
      sections[sectionIndex].new as GroupedSection
    ).groups.map((g) => {
      return {
        ...g,
        names: g.names.map((n) => {
          return {
            ...n,
          };
        }),
        rows: g.rows.map((r) => {
          return {
            ...r,
            columns: r.columns.map((c) => {
              return {
                ...c,
              };
            }),
          };
        }),
      };
    });
    const previousfeedbackLeft = sections[sectionIndex].new.feedbackLeft;
    return {
      execute: (value) => {
        (sections[sectionIndex].new as GroupedSection).groups = newVal.groups;
        sections[sectionIndex].new.feedbackData = newVal.feedbackData;
        sections[sectionIndex].new.feedbackLeft = newVal.feedbackLeft;
        sections[sectionIndex].new = {
          ...sections[sectionIndex].new,
        };
        return obj;
      },
      undo: () => {
        (sections[sectionIndex].new as GroupedSection).groups = previousGroups;
        sections[sectionIndex].new.feedbackData = previousfeedbackData;
        sections[sectionIndex].new.feedbackLeft = previousfeedbackLeft;
        sections[sectionIndex].new = {
          ...sections[sectionIndex].new,
        };
        return obj;
      },
    };
  };
  createBatchSectionsCommand = (
    sections: UISection[],
    obj: any,
    newVal: any,
    oldval: any
  ) => {
    const newSections = newVal.sections;
    let { sectionsCode } = obj as BatchSectionsPosition;
    const isDrugNameUpdated = sectionsCode.indexOf("DRUG_NAME") > -1;
    const savedSections = this.sections
      .filter((section) => sectionsCode.indexOf(section.new.section.code) > -1)
      .map((section) =>
        section.grouped
          ? (section.new as GroupedSection).groups
          : (section.new as Section).rows
      );
    const savedSectionsHeaders = this.sections
      .filter((section) => sectionsCode.indexOf(section.new.section.code) > -1)
      .map((section) =>
        section.new.codesColumn ? section.new.codesColumn.value : null
      );
    const oldDrugName = isDrugNameUpdated ? this.drugNameColumn.value : null;
    return {
      execute: (value) => {
        this.loadingSpinner.isLoading.next(true);
        setTimeout(() => {
          newSections.forEach((newData, idx) => {
            const foundSection = sections.find(
              (s) => s.new.section.code === sectionsCode[idx]
            );

            if (isDrugNameUpdated) {
              this.drugNameColumn = {
                ...this.drugNameColumn,
                value: newVal.drugUpdated,
              };
            }

            if (foundSection.new.codesColumn) {
              foundSection.new.codesColumn = {
                ...foundSection.new.codesColumn,
                value: newData.codesColumn.value,
              };
            }

            foundSection.grouped
              ? ((foundSection.new as GroupedSection).groups = (
                  newData as GroupedSection
                ).groups)
              : ((foundSection.new as Section).rows = (
                  newData as Section
                ).rows);
            foundSection.new = {
              ...foundSection.new,
            };
          });
          this.loadingSpinner.isLoading.next(false);
        });
        return { ...obj, command: DnBActions.GROUPED_COLUMN_SEARCH_CHANGE };
      },
      undo: () => {
        this.loadingSpinner.setDisplayMessage("loading");
        this.loadingSpinner.isLoading.next(true);
        setTimeout(() => {
          newSections.forEach((newData, idx) => {
            const foundSection = sections.find(
              (s) => s.new.section.code === sectionsCode[idx]
            );

            if (isDrugNameUpdated) {
              this.drugNameColumn = {
                ...this.drugNameColumn,
                value: oldDrugName,
              };
            }

            if (foundSection.new.codesColumn) {
              foundSection.new.codesColumn.value = savedSectionsHeaders[idx];
            }

            foundSection.grouped
              ? ((foundSection.new as GroupedSection).groups = savedSections[
                  idx
                ] as GroupRow[])
              : ((foundSection.new as Section).rows = savedSections[
                  idx
                ] as Row[]);
            foundSection.new = {
              ...foundSection.new,
            };
          });
          this.loadingSpinner.isLoading.next(false);
        });
        return { ...obj, command: DnBActions.GROUPED_COLUMN_SEARCH_CHANGE };
      },
    };
  };
  createBatchSectionsHeaderCommand = (
    sections: UISection[],
    obj: any,
    newVal: any,
    oldval: any
  ) => {
    const newValue = newVal.newValue;
    let { sectionsCode } = obj as BatchSectionsPosition;
    const savedSectionsHeaders = this.sections
      .filter((section) => sectionsCode.indexOf(section.new.section.code) > -1)
      .map((section) => section.new.completed);
    return {
      execute: (value) => {
        this.loadingSpinner.isLoading.next(true);
        setTimeout(() => {
          this.sections.forEach((newData, idx) => {
            const foundSection = sections.find(
              (s) => s.new.section.code === sectionsCode[idx]
            );

            foundSection.new.completed = newValue;
            foundSection.new = {
              ...foundSection.new,
            };
          });
          this.loadingSpinner.isLoading.next(false);
        });
        return {
          ...obj,
          command: DnBActions.BATCH_SECTIONS_HEADER,
        };
      },
      undo: () => {
        this.loadingSpinner.setDisplayMessage("loading");
        this.loadingSpinner.isLoading.next(true);
        setTimeout(() => {
          this.sections.forEach((newData, idx) => {
            const foundSection = sections.find(
              (s) => s.new.section.code === sectionsCode[idx]
            );

            foundSection.new.completed = savedSectionsHeaders[idx];
            foundSection.new = {
              ...foundSection.new,
            };
          });
          this.loadingSpinner.isLoading.next(false);
        });
        return {
          ...obj,
          command: DnBActions.BATCH_SECTIONS_HEADER,
        };
      },
    };
  };
  createDrugNameCommand = (
    sections: UISection[],
    obj: SectionPosition,
    newVal,
    oldval
  ) => {
    return {
      execute: (isUserTyping: boolean) => {
        if (isUserTyping) {
          this.drugNameColumn.value = newVal;
        } else {
          this.drugNameColumn = {
            ...this.drugNameColumn,
            value: newVal,
          };
        }
        return obj;
      },
      undo: () => {
        this.drugNameColumn = {
          ...this.drugNameColumn,
          value: oldval,
        };
        return obj;
      },
    };
  };
  createSectionHeaderCodesCommand = (
    sections: UISection[] | Column,
    obj: SectionPosition,
    newVal,
    oldval
  ) => {
    let { sectionIndex } = obj;
    return {
      execute: (isUserTyping: boolean) => {
        if (isUserTyping) {
          sections[sectionIndex].new.codesColumn.value = newVal;
        } else {
          sections[sectionIndex].new.codesColumn = {
            ...sections[sectionIndex].new.codesColumn,
            value: newVal,
          };
        }
        sections[sectionIndex].new = {
          ...sections[sectionIndex].new,
        };
        return obj;
      },
      undo: () => {
        sections[sectionIndex].new.codesColumn = {
          ...sections[sectionIndex].new.codesColumn,
          value: oldval,
        };
        sections[sectionIndex].new = {
          ...sections[sectionIndex].new,
        };
        return obj;
      },
    };
  };
  createSectionHeaderCodesSearchCommand = (
    sections: UISection[] | Column,
    obj: SectionPosition,
    newVal,
    oldVal
  ) => {
    let { sectionIndex } = obj;
    const { value, searchData, highlight } = newVal;
    const oldValue = oldVal.value;
    const oldSearch = oldVal.searchData;
    const oldHighlight = oldVal.highlight;
    return {
      execute: () => {
        sections[sectionIndex].new.codesColumn = {
          ...sections[sectionIndex].new.codesColumn,
          value: value,
        };
        sections[sectionIndex].new.codesColumn = {
          ...sections[sectionIndex].new.codesColumn,
          searchData: searchData,
        };
        sections[sectionIndex].new.codesColumn = {
          ...sections[sectionIndex].new.codesColumn,
          highlight: highlight,
        };
        sections[sectionIndex].new = {
          ...sections[sectionIndex].new,
        };
        return { ...obj, command: DnBActions.SECTION_HEADER_CODES_SEARCH_DATA };
      },
      undo: () => {
        sections[sectionIndex].new.codesColumn = {
          ...sections[sectionIndex].new.codesColumn,
          value: oldValue,
        };
        sections[sectionIndex].new.codesColumn = {
          ...sections[sectionIndex].new.codesColumn,
          searchData: oldSearch,
        };
        sections[sectionIndex].new.codesColumn = {
          ...sections[sectionIndex].new.codesColumn,
          highlight: oldHighlight,
        };
        sections[sectionIndex].new = {
          ...sections[sectionIndex].new,
        };
        return { ...obj, command: DnBActions.SECTION_HEADER_CODES_SEARCH_DATA };
      },
    };
  };
  createSectionHeaderCommand = (
    sections: UISection[],
    obj: SectionPosition,
    newVal: SectionHeader,
    oldval: SectionHeader
  ) => {
    let { completed } = newVal;
    let { sectionIndex } = obj;
    const oldValue = sections[sectionIndex].new.completed;
    return {
      execute: (value) => {
        sections[sectionIndex].new.completed = completed;
        sections[sectionIndex].new = {
          ...sections[sectionIndex].new,
        };
        return { ...obj, command: DnBActions.SECTION_HEADER_DATA };
      },
      undo: () => {
        sections[sectionIndex].new.completed = oldValue;
        sections[sectionIndex].new = {
          ...sections[sectionIndex].new,
        };
        return { ...obj, command: DnBActions.SECTION_HEADER_DATA };
      },
    };
  };

  commands = {
    [DnBActions.SECTION_CHANGE]: this.createSectionCommand,
    [DnBActions.GROUPED_SECTION_CHANGE]: this.createGroupedSectionCommand,
    [DnBActions.COLUMN_CHANGE]: this.createColumnCommand,
    [DnBActions.COLUMN_SEARCH_CHANGE]: this.createColumnSearchCommand,
    [DnBActions.GROUPED_COLUMN_CHANGE]: this.createGroupedColumnCommand,
    [DnBActions.GROUPED_COLUMN_SEARCH_CHANGE]:
      this.createGroupedColumnSearchCommand,
    [DnBActions.BATCH_SECTIONS]: this.createBatchSectionsCommand,
    [DnBActions.BATCH_SECTIONS_HEADER]: this.createBatchSectionsHeaderCommand,
    [DnBActions.DRUG_NAME]: this.createDrugNameCommand,
    [DnBActions.SECTION_HEADER_CODES_DATA]:
      this.createSectionHeaderCodesCommand,
    [DnBActions.SECTION_HEADER_DATA]: this.createSectionHeaderCommand,
    [DnBActions.SECTION_HEADER_CODES_SEARCH_DATA]:
      this.createSectionHeaderCodesSearchCommand,
  };

  doCommand(
    commandType: string,
    metadata: any,
    newVal: any,
    oldVal: any = null
  ) {
    if (this.position < this.history.length - 1) {
      this.history = this.history.slice(0, this.position + 1);
      this.historyComands = this.historyComands.slice(0, this.position + 1);
      const consoleData = this.historyComands
        .filter((item) => item !== null)
        .map((item, indx) => {
          return {
            command: item.command,
            position: indx === this.position - 1 ? "Here" : "",
            old: item.metadata.oldVal ? item.metadata.oldVal : "",
            new: item.metadata.val ? item.metadata.val : "",
          };
        });
      console.table(consoleData);
      this.stackInfo.next({
        stack: this.historyComands,
        position: this.position,
      });
    }

    if (this.commands[commandType]) {
      const concreteCommand = this.commands[commandType](
        this.sections,
        metadata,
        newVal,
        oldVal
      );
      this.history.push(concreteCommand);
      this.position += 1;
      if (this.history.length > 16) {
        this.history.shift();
        this.position -= 1;
      }
      this.historyComands.push({
        command: commandType,
        sectionIndex: metadata.sectionIndex,
        metadata: metadata,
      });
      if (this.historyComands.length > 16) {
        this.historyComands.shift();
      }
      const consoleData = this.historyComands
        .filter((item) => item !== null)
        .map((item, indx) => {
          return {
            command: item.command,
            position: indx === this.position - 1 ? "Here" : "",
            old: item.metadata.oldVal ? item.metadata.oldVal : "",
            new: item.metadata.val ? item.metadata.val : "",
          };
        });
      console.table(consoleData);
      this.stackInfo.next({
        stack: this.historyComands,
        position: this.position,
      });
      concreteCommand.execute(true);
    }
  }

  undo() {
    if (this.position > 0) {
      const metadata = this.history[this.position].undo();
      this.position -= 1;
      const consoleData = this.historyComands
        .filter((item) => item !== null)
        .map((item, indx) => {
          return {
            command: item.command,
            position: indx === this.position - 1 ? "Here" : "",
            old: item.metadata.oldVal ? item.metadata.oldVal : "",
            new: item.metadata.val ? item.metadata.val : "",
          };
        });
      console.table(consoleData);
      this.stackInfo.next({
        stack: this.historyComands,
        position: this.position,
      });
      return { ...metadata, position: this.position };
    }
  }

  redo() {
    if (this.position < this.history.length - 1) {
      this.position += 1;
      const consoleData = this.historyComands
        .filter((item) => item !== null)
        .map((item, indx) => {
          return {
            command: item.command,
            position: indx === this.position - 1 ? "Here" : "",
            old: item.metadata.oldVal ? item.metadata.oldVal : "",
            new: item.metadata.val ? item.metadata.val : "",
          };
        });
      console.table(consoleData);
      this.stackInfo.next({
        stack: this.historyComands,
        position: this.position,
      });
      const metadata = this.history[this.position].execute(false);
      return { ...metadata, position: this.position };
    }
  }
}
