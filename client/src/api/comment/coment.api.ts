import { AxiosResponse } from "axios"
import { DataListComment, IComment, ListCommentParams } from "./comment.interface"
import { requestWithJwt } from "api/request"

export const getListComment = async ({params}: {params?: ListCommentParams}): Promise<AxiosResponse<DataListComment>> => {
    return await requestWithJwt.get<DataListComment>('/comments', { params })
}

export const updateComment = async (id: string, comment: any): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.put<any>('/comments/'+ id, comment , { withCredentials: true });
}

export const deleteComment = async (id: string): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.delete<any>('/comments/'+ id,  { withCredentials: true });
}
export const getAllCommentsByTheoryId = async (theoryId: string): Promise<AxiosResponse<IComment[]>> => {
    return await requestWithJwt.get<IComment[]>('/comments/getAllCommentsByTheoryId/'+ theoryId);
}
export const getListActiveCommentByTheoryId = async (theoryId: string): Promise<AxiosResponse<any>> => {
    console.log(theoryId);
    return await requestWithJwt.get<any>(`/comments/getListActiveCommentByTheoryId/${theoryId}`);
}
export const addComment = async (comment: any): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.post<any>('/comments', comment, { withCredentials: true });
}
