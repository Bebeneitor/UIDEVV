/**
 * This inferface contains the list of components, and its visible status, to show in the toolBar.
 * For example: if you want to show trashButton in toolBar, you need to declare the trashButton attribute like true,
 * on the contrary, the value should be declared like false, or well not declare it.
 */
export interface EclToolBar{
    trashButton ?: boolean;
    recoveryButton?: boolean;
}