export interface IExam {
    id?: string
    name?: string
    order?: number
    lessonId?: string
    chapterId?: string
    status?: boolean
    star?: number
}

export interface IExamQuestion {
    id?: string
    examId?: string
    questionId?: string
    status?: boolean
}

export interface ListExamParams {
    page?: number
    size?: number
    search?: string
    startDate?: Date
    endDate?: Date
}

export interface DataListExam {
    data: IExam[]
    page: number
    size: number
    totalRecords: number
}

export interface DataListExamQuestion {
    data: IExamQuestion[]
    page: number
    size: number
    totalRecords: number
}