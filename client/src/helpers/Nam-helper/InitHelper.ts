import { IAnswer } from "api/answer/answer.interfaces";
import { IQuestion } from "api/question/question.interfaces";
import { IResult } from "api/result/result.interface";
import { generateAnswerUID, generateResultUID } from "./GenerateUID";
import { getFromLocalStorage } from "utils/functions";


const randomOrderAnswer = (): string =>{
    // random abcde, adbed, edcba, ...
    const order = ['A', 'B', 'C', 'D', 'E']
    const randomOrder = order.sort(() => Math.random() - 0.5)
    return randomOrder.join('')
}

export const  InitAnswerFromQuestion = (question: IQuestion, resultId?: string): IAnswer => {
    return {
        id: generateAnswerUID(),
        questionId: question.id,
        resultId: resultId,
        yourAnswer: '',
        isCorrect: false,
        // orderAnswer: randomOrderAnswer(),
        status: true,
    }
}
export const  InitListAnswerFromListQuestion = (questions: IQuestion[], resultId?: string): IAnswer[] => {
    return questions.map((question) => InitAnswerFromQuestion(question, resultId));
}

export const InitResult = (totalScore: number, examId: string, userId: string): IResult => {
    return {
        id: generateResultUID(),
        yourScore: 0,
        totalScore: totalScore,
        timeStart: new Date(),
        timeEnd: new Date(),
        status: true,
        examId: examId,
        userId: userId,
        star: 0,
    }
}

export const getUserIDLogin = () => {
    const curentUser = getFromLocalStorage<any>('persist:auth')
    return curentUser.currentUser.id
}

export const caculateStar = (result : IResult): number => {
    const percent = result.yourScore! / result.totalScore! * 100
    if (percent >= 90) {
        return 3
    }
    if (percent >= 50) {
        return 2
    }
    if (percent >= 10) {
        return 1
    }   
    return 0
}

