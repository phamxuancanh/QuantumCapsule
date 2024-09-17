export interface IChapter {
    id?: string
    subjectId?: string
    name?: string
    description?: string
    grade?: number
    order?: number
    status?: boolean
}

export interface ListChapterParams {
    page?: number
    size?: number
    search?: string
    subjectId?: string
    grade?: number
}

export interface DataListChapter{
    data: IChapter[]
    page: number
    size: number
    totalRecords: number
}