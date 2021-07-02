export interface menuPermissions {
  separation: boolean;
  completeSeparatiion: boolean;

  addDosing: boolean;
  duplicateDosing: boolean;

  addRow: boolean;
  addManyRows: boolean;
  removeRow: boolean;

  addGroupRow: { visible: boolean; label: string };

  copyRow: boolean;
  undoCopyRow: boolean;

  copyColumn: boolean;
  pasteColumn: boolean;

  addGroup: boolean;
  removeGroup: boolean;

  copyGroup: boolean;
  undoCopyGroup: boolean;

  copyRowGroup: boolean;
  undoCopyRowGroup: boolean;

  moveGroupUp: boolean;
  moveGroupDown: boolean;
  moveUp: boolean;
  moveDown: boolean;

  addMidRule: boolean;
  checkFeedback: boolean;

  multiSelect: boolean;
  addComment: boolean;
  editComment: boolean;

  indicationRemove: { visible: boolean; label: string };
  indicationAdded: { visible: boolean; label: string };
}

export const defaultMenuPermissions: menuPermissions = {
  separation: false,
  completeSeparatiion: false,
  addDosing: false,
  duplicateDosing: false,

  addRow: true,
  addManyRows: true,
  removeRow: true,

  addGroupRow: { visible: false, label: "Add Row" },

  copyRow: false,
  undoCopyRow: true,

  copyColumn: true,
  pasteColumn: false,

  addGroup: false,
  removeGroup: false,

  copyGroup: false,
  undoCopyGroup: false,

  copyRowGroup: false,
  undoCopyRowGroup: false,

  moveGroupUp: false,
  moveGroupDown: false,
  moveUp: true,
  moveDown: true,

  addMidRule: false,

  checkFeedback: false,

  multiSelect: true,
  addComment: false,
  editComment: false,

  indicationRemove: { visible: false, label: "Indication Removed" },
  indicationAdded: { visible: false, label: "Indication Added" },
};

export const defaultReadOnlyMenuPermissions: menuPermissions = {
  separation: false,
  completeSeparatiion: false,

  addDosing: false,
  duplicateDosing: false,

  addRow: false,
  addManyRows: false,
  removeRow: false,

  addGroupRow: { visible: false, label: "Add Row" },

  copyRow: true,
  undoCopyRow: true,

  copyColumn: true,
  pasteColumn: false,

  addGroup: false,
  removeGroup: false,

  copyGroup: false,
  undoCopyGroup: false,

  copyRowGroup: false,
  undoCopyRowGroup: false,

  moveGroupUp: false,
  moveGroupDown: false,
  moveUp: false,
  moveDown: false,

  addMidRule: false,

  checkFeedback: false,

  multiSelect: false,
  addComment: false,
  editComment: false,

  indicationRemove: { visible: false, label: "Indication Removed" },
  indicationAdded: { visible: false, label: "Indication Added" },
};

export const defaultEditableMenuPermissions: menuPermissions = {
  separation: false,
  completeSeparatiion: false,

  addDosing: false,
  duplicateDosing: false,

  addRow: true,
  addManyRows: true,
  removeRow: true,

  addGroupRow: { visible: false, label: "Add Row" },

  copyRow: false,
  undoCopyRow: false,

  copyColumn: true,
  pasteColumn: true,

  addGroup: false,
  removeGroup: false,

  copyGroup: false,
  undoCopyGroup: false,

  copyRowGroup: false,
  undoCopyRowGroup: false,

  moveGroupUp: false,
  moveGroupDown: false,
  moveUp: true,
  moveDown: true,

  addMidRule: false,

  checkFeedback: false,
  multiSelect: true,
  addComment: false,
  editComment: false,

  indicationRemove: { visible: false, label: "Indication Removed" },
  indicationAdded: { visible: false, label: "Indication Added" },
};

export const defaultReadOnlyGroupMenuPermissions: menuPermissions = {
  separation: false,
  completeSeparatiion: false,

  addDosing: false,
  duplicateDosing: false,

  addRow: false,
  addManyRows: false,
  removeRow: false,

  addGroupRow: { visible: false, label: "Add Row" },

  copyRow: false,
  undoCopyRow: false,

  copyColumn: true,
  pasteColumn: false,

  addGroup: false,
  removeGroup: false,

  copyGroup: true,
  undoCopyGroup: true,

  copyRowGroup: false,
  undoCopyRowGroup: false,

  moveGroupUp: false,
  moveGroupDown: false,
  moveUp: false,
  moveDown: false,

  addMidRule: false,

  checkFeedback: false,
  multiSelect: false,
  addComment: false,
  editComment: false,

  indicationRemove: { visible: false, label: "Indication Removed" },
  indicationAdded: { visible: false, label: "Indication Added" },
};

export const defaultEditableGroupMenuPermissions: menuPermissions = {
  separation: false,
  completeSeparatiion: false,

  addDosing: false,
  duplicateDosing: false,

  addRow: false,
  addManyRows: true,
  removeRow: false,

  addGroupRow: { visible: false, label: "Add Row" },

  copyRow: false,
  undoCopyRow: false,

  copyColumn: true,
  pasteColumn: true,

  addGroup: true,
  removeGroup: true,

  copyGroup: false,
  undoCopyGroup: false,

  copyRowGroup: false,
  undoCopyRowGroup: false,

  moveGroupUp: true,
  moveGroupDown: true,
  moveUp: true,
  moveDown: false,

  addMidRule: false,

  checkFeedback: false,
  multiSelect: true,
  addComment: false,
  editComment: false,

  indicationRemove: { visible: false, label: "Indication Removed" },
  indicationAdded: { visible: false, label: "Indication Added" },
};

export const defaulReadOnlyGroupRowMenuPermissions: menuPermissions = {
  separation: false,
  completeSeparatiion: false,

  addDosing: false,
  duplicateDosing: false,

  addRow: false,
  addManyRows: false,
  removeRow: false,

  addGroupRow: { visible: false, label: "Add Row" },

  copyRow: false,
  undoCopyRow: false,

  copyColumn: true,
  pasteColumn: false,

  addGroup: false,
  removeGroup: false,

  copyGroup: false,
  undoCopyGroup: false,

  copyRowGroup: true,
  undoCopyRowGroup: true,

  moveGroupUp: false,
  moveGroupDown: false,
  moveUp: false,
  moveDown: false,

  addMidRule: false,

  checkFeedback: false,
  multiSelect: false,
  addComment: false,
  editComment: false,

  indicationRemove: { visible: false, label: "Indication Removed" },
  indicationAdded: { visible: false, label: "Indication Added" },
};
export const defaultEditableGroupRowMenuPermissions: menuPermissions = {
  separation: false,
  completeSeparatiion: false,

  addDosing: false,
  duplicateDosing: false,

  addRow: false,
  addManyRows: true,
  removeRow: true,

  addGroupRow: { visible: true, label: "Add Row Group" },

  copyRow: false,
  undoCopyRow: false,

  copyColumn: true,
  pasteColumn: true,

  addGroup: false,
  removeGroup: false,

  copyGroup: false,
  undoCopyGroup: false,

  copyRowGroup: false,
  undoCopyRowGroup: false,

  moveGroupUp: false,
  moveGroupDown: false,
  moveUp: true,
  moveDown: true,

  addMidRule: false,

  checkFeedback: false,
  multiSelect: true,
  addComment: false,
  editComment: false,

  indicationRemove: { visible: false, label: "Indication Removed" },
  indicationAdded: { visible: false, label: "Indication Added" },
};

export const checkFeedbackOnlyMenuPermissions: menuPermissions = {
  separation: false,
  completeSeparatiion: false,

  addDosing: false,
  duplicateDosing: false,

  addRow: false,
  addManyRows: false,
  removeRow: false,

  addGroupRow: { visible: false, label: "Add Row" },

  copyRow: false,
  undoCopyRow: false,

  copyColumn: false,
  pasteColumn: false,

  addGroup: false,
  removeGroup: false,

  copyGroup: false,
  undoCopyGroup: false,

  copyRowGroup: false,
  undoCopyRowGroup: false,

  moveGroupUp: false,
  moveGroupDown: false,
  moveUp: false,
  moveDown: false,

  addMidRule: false,

  checkFeedback: true,
  multiSelect: false,
  addComment: false,
  editComment: false,

  indicationRemove: { visible: false, label: "Indication Removed" },
  indicationAdded: { visible: false, label: "Indication Added" },
};
