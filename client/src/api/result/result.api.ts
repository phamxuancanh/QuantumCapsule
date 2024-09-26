import { requestWithJwt } from "api/request"
import { AxiosResponse } from "axios"
import { IDTOResponse, IResult, IResultDetail } from "./result.interface"

export const insertResult = async (result : IResult): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.post<any>('/results/insertResult', {result} , { withCredentials: true })
}

export const getListResultByUserId = async (userId: string): Promise<AxiosResponse<IDTOResponse<IResult[]>>> => {
    return await requestWithJwt.get<IDTOResponse<IResult[]>>(`/results/getListResultByUserId/${userId}`, { withCredentials: true })
}

export const getResultDetailByResultId = async (resultId: string): Promise<AxiosResponse<IDTOResponse<IResultDetail>>> => {
    console.log(resultId);
    
    return await requestWithJwt.get<IDTOResponse<IResultDetail>>(`/results/getResultDetailByResultId/${resultId}`, { withCredentials: true })
}