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


export interface IQuestionExcel {
    id: string;
    idRec: string;
    question: string;
    type: 'single' | 'multiple' | 'text';
    correctAnswer: string;
    score: number;
    explain?: string;
    questionType?: string;
    a: string;
    b: string;
    c: string;
    d: string;
    e: string;
}
export interface IQuestion {
    id: string | number;
    idRec: string;
    question: string;
    type: 'single' | 'multiple' | 'text';
    correctAnswer: string;
    score: number;
    explain?: string;
    questionType?: string;
    options: { value: string, label: string }[];
}
export interface IAnswer {
    question: IQuestion;
    answer: string;
    isCorrect: boolean;
}