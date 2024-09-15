
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

export interface DataListLesson{
    data: ILesson[]
    page: number
    size: number
    totalRecords: number
}
