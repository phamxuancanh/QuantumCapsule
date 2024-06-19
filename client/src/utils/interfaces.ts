import { ACTIONS, IconName} from "./enums";

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





export interface IDirection{
    value: any;
    label: string;
}
export interface IDataSource{
    name: string;
    values: IDirection[];
}

export interface IMenuItem {
    icon: IconName,
    name: string,
    text: string,
}