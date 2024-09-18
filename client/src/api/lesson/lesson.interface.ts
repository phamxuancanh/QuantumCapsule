
export interface ILesson {
    id?: string
    chapterId?: string
    name?: string
    order?: number
    status?: boolean
}
export interface ListLessonParams {
    page?: number
    size?: number
    search?: string
    startDate?: Date
    endDate?: Date
}
export interface ListLessonandExamParams {
    page?: number
    size?: number
    search?: string
    type? : string
    subjectId? : string
    grade? : number
}
export interface DataListLesson{
    data: ILesson[]
    page: number
    size: number
    totalRecords: number
}
export interface DataListLessonandExam{
    data: any
    page: number
    size: number
    totalRecords: number
}

