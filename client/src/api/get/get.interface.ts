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

export interface IGetTableData {
    tableName: string;
    filter: any;
}