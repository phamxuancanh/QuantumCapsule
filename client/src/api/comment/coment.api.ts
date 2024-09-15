import { AxiosResponse } from "axios"
import { DataListComment, ListCommentParams } from "./comment.interface"
import { requestWithJwt } from "api/request"

export const getListComment = async ({params}: {params?: ListCommentParams}): Promise<AxiosResponse<DataListComment>> => {
    return await requestWithJwt.get<DataListComment>('/comments', { params })
}