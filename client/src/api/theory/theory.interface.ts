export interface ITheory {
    id?: string
    lessonId?: string
    name?: string
    description?: string
    summary?: string
    url?: string
    type?: string
    order?: number
    status?: boolean
}

export interface ListTheoryParams {
    page?: number
    size?: number
    search?: string
    startDate?: Date
    endDate?: Date
}

export interface DataListTheory {
    data: ITheory[]
    page: number
    size: number
    totalRecords: number
}
