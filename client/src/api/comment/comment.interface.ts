export interface IComment{
    id?: string
    theoryId?: string
    userId?: string
    status?: boolean
    content?: string
}

export interface ListCommentParams {
    page?: number
    size?: number
    search?: string
    startDate?: Date
    endDate?: Date
}

export interface DataListComment {
    data: IComment[]
    page: number
    size: number
    totalRecords: number
}