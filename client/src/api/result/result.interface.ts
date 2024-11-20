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
    star?: number
    examName?: string // for display
    chapterName?: string // for display
    lessonName?: string // for display
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

export interface IGetResultByUserIdFilterParams {
    from?: Date,
    to?: Date
}