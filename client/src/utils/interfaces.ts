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
    isDisplayForm: boolean;
    isDisplayTable: boolean;
    regex: string;
    regexMessage: string;
    position: number;
}



export interface IDirection{
    value: any;
    label: string;
}
export interface IDataSource{
    name: string;
    values: IDirection[];
}