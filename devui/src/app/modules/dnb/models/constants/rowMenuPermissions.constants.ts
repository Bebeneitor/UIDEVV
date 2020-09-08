export interface menuPermissions {
  separation: boolean;

  addDosing: boolean;
  duplicateDosing: boolean;

  addRow: boolean;
  removeRow: boolean;
  undoRemoveRow: boolean;

  addGroupRow: { visible: boolean; label: string };

  copyRow: boolean;
  undoCopyRow: boolean;

  copyColumn: boolean;
  pasteColumn: boolean;

  addGroup: boolean;
  removeGroup: boolean;
  undoRemoveGroup: boolean;

  copyGroup: boolean;
  undoCopyGroup: boolean;

  copyRowGroup: boolean;
  undoCopyRowGroup: boolean;

  moveGroupUp: boolean;
  moveGroupDown: boolean;
  moveUp: boolean;
  moveDown: boolean;
}

export const defaultMenuPermissions: menuPermissions = {
  separation: false,

  addDosing: false,
  duplicateDosing: false,

  addRow: true,
  removeRow: true,
  undoRemoveRow: true,

  addGroupRow: { visible: false, label: "Add Row" },

  copyRow: false,
  undoCopyRow: true,

  copyColumn: true,
  pasteColumn: false,

  addGroup: false,
  removeGroup: false,
  undoRemoveGroup: false,

  copyGroup: false,
  undoCopyGroup: false,

  copyRowGroup: false,
  undoCopyRowGroup: false,

  moveGroupUp: false,
  moveGroupDown: false,
  moveUp: true,
  moveDown: true,
};

export const defaultReadOnlyMenuPermissions: menuPermissions = {
  separation: false,

  addDosing: false,
  duplicateDosing: false,

  addRow: false,
  removeRow: false,
  undoRemoveRow: false,

  addGroupRow: { visible: false, label: "Add Row" },

  copyRow: true,
  undoCopyRow: true,

  copyColumn: true,
  pasteColumn: false,

  addGroup: false,
  removeGroup: false,
  undoRemoveGroup: false,

  copyGroup: false,
  undoCopyGroup: false,

  copyRowGroup: false,
  undoCopyRowGroup: false,

  moveGroupUp: false,
  moveGroupDown: false,
  moveUp: false,
  moveDown: false,
};

export const defaultEditableMenuPermissions: menuPermissions = {
  separation: false,

  addDosing: false,
  duplicateDosing: false,

  addRow: true,
  removeRow: true,
  undoRemoveRow: true,

  addGroupRow: { visible: false, label: "Add Row" },

  copyRow: false,
  undoCopyRow: false,

  copyColumn: true,
  pasteColumn: true,

  addGroup: false,
  removeGroup: false,
  undoRemoveGroup: false,

  copyGroup: false,
  undoCopyGroup: false,

  copyRowGroup: false,
  undoCopyRowGroup: false,

  moveGroupUp: false,
  moveGroupDown: false,
  moveUp: true,
  moveDown: true,
};

export const defaultReadOnlyGroupMenuPermissions: menuPermissions = {
  separation: false,

  addDosing: false,
  duplicateDosing: false,

  addRow: false,
  removeRow: false,
  undoRemoveRow: false,

  addGroupRow: { visible: false, label: "Add Row" },

  copyRow: false,
  undoCopyRow: false,

  copyColumn: true,
  pasteColumn: false,

  addGroup: false,
  removeGroup: false,
  undoRemoveGroup: false,

  copyGroup: true,
  undoCopyGroup: true,

  copyRowGroup: false,
  undoCopyRowGroup: false,

  moveGroupUp: false,
  moveGroupDown: false,
  moveUp: false,
  moveDown: false,
};

export const defaultEditableGroupMenuPermissions: menuPermissions = {
  separation: false,

  addDosing: false,
  duplicateDosing: false,

  addRow: false,
  removeRow: false,
  undoRemoveRow: false,

  addGroupRow: { visible: false, label: "Add Row" },

  copyRow: false,
  undoCopyRow: false,

  copyColumn: true,
  pasteColumn: true,

  addGroup: true,
  removeGroup: true,
  undoRemoveGroup: true,

  copyGroup: false,
  undoCopyGroup: false,

  copyRowGroup: false,
  undoCopyRowGroup: false,

  moveGroupUp: true,
  moveGroupDown: true,
  moveUp: true,
  moveDown: true,
};

export const defaulReadOnlyGroupRowMenuPermissions: menuPermissions = {
  separation: false,

  addDosing: false,
  duplicateDosing: false,

  addRow: false,
  removeRow: false,
  undoRemoveRow: false,

  addGroupRow: { visible: false, label: "Add Row" },

  copyRow: false,
  undoCopyRow: false,

  copyColumn: true,
  pasteColumn: false,

  addGroup: false,
  removeGroup: false,
  undoRemoveGroup: false,

  copyGroup: false,
  undoCopyGroup: false,

  copyRowGroup: true,
  undoCopyRowGroup: true,

  moveGroupUp: false,
  moveGroupDown: false,
  moveUp: false,
  moveDown: false,
};
export const defaultEditableGroupRowMenuPermissions: menuPermissions = {
  separation: false,

  addDosing: false,
  duplicateDosing: false,

  addRow: false,
  removeRow: true,
  undoRemoveRow: true,

  addGroupRow: { visible: true, label: "Add Row Group" },

  copyRow: false,
  undoCopyRow: false,

  copyColumn: true,
  pasteColumn: true,

  addGroup: false,
  removeGroup: false,
  undoRemoveGroup: false,

  copyGroup: false,
  undoCopyGroup: false,

  copyRowGroup: false,
  undoCopyRowGroup: false,

  moveGroupUp: false,
  moveGroupDown: false,
  moveUp: true,
  moveDown: true,
};
