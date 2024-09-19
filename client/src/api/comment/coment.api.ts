import { AxiosResponse } from "axios"
import { DataListComment, ListCommentParams } from "./comment.interface"
import { requestWithJwt } from "api/request"

export const getListComment = async ({params}: {params?: ListCommentParams}): Promise<AxiosResponse<DataListComment>> => {
    return await requestWithJwt.get<DataListComment>('/comments', { params })
}

export const addComment = async (comment: any): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.post<any>('/comments', comment, { withCredentials: true });
}

export const updateComment = async (id: string, comment: any): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.put<any>('/comments/'+ id, comment , { withCredentials: true });
}

export const deleteComment = async (id: string): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.delete<any>('/comments/'+ id,  { withCredentials: true });
}

