import { ACTIONS } from "./enums";

export interface IAction {
    open: boolean;
    type: ACTIONS;
    payload?: any;
}

export const defaultAction: IAction = {
    open: false,
    payload: {},
    type: ACTIONS.CREATE

}

export interface IGrid {
    tableName: string;
    columnName: string;
    columnType: string;
    inputType: string;
    label: string;
    editable: boolean;
    dataSource: string;
    isDisplay: boolean;
    regex: string;
    regexMessage: string;
    position: number;
}

export interface IFormParam {
    name: string;
    label: string;
    value?: any;
    labelValue?: string;
    defaultChecked?: boolean;
    values?: IValueFormParam[];
}
export interface IValueFormParam {
    value: any;
    label: string;
}