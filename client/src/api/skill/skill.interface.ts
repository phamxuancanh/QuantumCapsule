import { IBaseResponse } from '../interfaces'

// export interface IGetData {
//     createdAt: string
//     name: string
//     id: string
// }
// export interface IPostResponse extends IBaseResponse {
//     data: IPostData
// }
// export interface IPostListResponse extends IBaseResponse {
//     data: IPostData[]
// }
export interface ISkill{
    id?: string
    name?: string
    subjectId?: string
}

export interface IGetTableData {
    tableName: string;
    filter: any;
}
export interface IPostData {
    createdAt: string
    name: string
    id: string
}
export interface IPostResponse extends IBaseResponse {
    data: IPostData
}
export interface IPostListResponse extends IBaseResponse {
    data: IPostData[]
}
