import { IAnswer } from "api/answer/answer.interfaces"
import { IQuestion } from "api/question/question.interfaces"

export interface IResult {
    id?: string
    userId?: string
    totalScore?: number
    yourScore?: number
    timeStart?: Date
    timeEnd?: Date
    // subjectId?: string
    // chapterId?: string
    // lessonId?: string
    examId?: string
    status?: boolean
}

export interface IResultDetail {
    result: IResult
    listQuestion: IQuestion[]
    listAnswer: IAnswer[]
}

export interface IDTOResponse <T> {
    message: string
    data: T
}