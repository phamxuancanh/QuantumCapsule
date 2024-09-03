import { IAnswer } from "api/answer/answer.interfaces";
import { IQuestion } from "api/question/question.interfaces";


const randomOrderAnswer = (): string =>{
    // random abcde, adbed, edcba, ...
    const order = ['A', 'B', 'C', 'D', 'E']
    const randomOrder = order.sort(() => Math.random() - 0.5)
    return randomOrder.join('')
}

export const  InitAnswerFromQuestion = (question: IQuestion, resultId?: string): IAnswer => {
    return {
        questionId: question.id,
        resultId: resultId,
        yourAnswer: '',
        isCorrect: false,
        orderAnswer: randomOrderAnswer(),
        status: true,
    }
}
export const  InitListAnswerFromListQuestion = (questions: IQuestion[], resultId?: string): IAnswer[] => {
    return questions.map((question) => InitAnswerFromQuestion(question, resultId));
}