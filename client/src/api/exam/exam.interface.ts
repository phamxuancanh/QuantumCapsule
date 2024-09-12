export interface IExam {
    id?: string
    name?: string
    order?: number
    lessonId?: string
    chapterId?: string
    status?: boolean
}

export interface IExamQuestion {
    id?: string
    examId?: string
    questionId?: string
    status?: boolean
}