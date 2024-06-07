import { ACTIONS } from "./enums";

export interface IAction {
    open: boolean;
    payload: any;
    type: ACTIONS;
}

export const defaultAction: IAction = {
    open: false,
    payload: {},
    type: ACTIONS.CREATE

}