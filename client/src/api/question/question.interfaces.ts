export interface IQuestion {
    id?: string
    questionType?: number
    title?: string
    content?: string
    contentImg?: string
    A?: string
    B?: string
    C?: string
    D?: string
    E?: string
    correctAnswer?: string
    explainAnswer?: string
    // score?: number
    status?: boolean
    lessonId?: string
}

export interface ListQuesionParams {
    page?: number
    size?: number
    search?: string
    startDate?: Date
    endDate?: Date
}

export interface DataListQuesion {
    data: IQuestion[]
    page: number
    size: number
    totalRecords: number
}


