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

export interface IUser {
    id?: string
    firstName?: string
    lastName?: string
    avatar?: string
    email?: string
    address?: string
    phone?: string
    gender?: boolean
    age?: number
    password?: string
    username?: string
    refreshToken?: string
    expire?: Date
    emailVeirfied?: boolean
    otp?: string
    otpExprire?: Date
    roleId?: number
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
