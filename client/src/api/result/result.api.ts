import { requestWithJwt } from "api/request"
import { AxiosResponse } from "axios"
import { IResult } from "./result.interface"

export const insertResult = async (result : IResult): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.post<any>('/results/insertResult', {result} , { withCredentials: true })
}