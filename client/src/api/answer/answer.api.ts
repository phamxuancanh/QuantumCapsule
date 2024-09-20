import { requestWithJwt } from "api/request"
import { AxiosResponse } from "axios"
import { IAnswer } from "./answer.interfaces"

export const insertListAnswer = async (listAnswer : IAnswer[]): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.post<any>('/answers/insertListAnswer',  {listAnswer} , { withCredentials: true })
}