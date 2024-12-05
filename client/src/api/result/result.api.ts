import { requestWithJwt } from "api/request"
import { AxiosResponse } from "axios"
import { IDTOResponse, IGetResultByUserIdFilterParams, IResult, IResultDetail } from "./result.interface"

export const insertResult = async (result : IResult): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.post<any>('/results/insertResult', {result} , { withCredentials: true })
}

export const getListResultByUserId = async (userId: string, filter: IGetResultByUserIdFilterParams): Promise<AxiosResponse<IDTOResponse<IResult[]>>> => {
    return await requestWithJwt.get<IDTOResponse<IResult[]>>(`/results/getListResultByUserId/${userId}`, { params: filter, withCredentials: true })
}

export const getResultDetailByResultId = async (resultId: string): Promise<AxiosResponse<IDTOResponse<IResultDetail>>> => {
    console.log(resultId);
    
    return await requestWithJwt.get<IDTOResponse<IResultDetail>>(`/results/getResultDetailByResultId/${resultId}`, { withCredentials: true })
}
export const getListUniqueDoneResultByChapterId = async (chapterId: string, filter?: IGetResultByUserIdFilterParams): Promise<AxiosResponse<any>> => {
    const params = filter ? { ...filter, chapterId } : { chapterId };
    return await requestWithJwt.get<IDTOResponse<IResult[]>>('/results/getListUniqueDoneResultByUserIdandChapterId', { params, withCredentials: true });
};
export const getListAllDoneResultByUserIdandChapterId = async (chapterId: string, filter?: IGetResultByUserIdFilterParams): Promise<AxiosResponse<any>> => {
    const params = filter ? { ...filter, chapterId } : { chapterId };
    return await requestWithJwt.get<IDTOResponse<IResult[]>>('/results/getListAllDoneResultByUserIdandChapterId', { params, withCredentials: true });
};
export const getListAllDoneResultByUserIdandExamId = async (examId: string, filter?: IGetResultByUserIdFilterParams): Promise<AxiosResponse<any>> => {
    const params = filter ? { ...filter, examId } : { examId };
    return await requestWithJwt.get<IDTOResponse<IResult[]>>('/results/getListAllDoneResultByUserIdandExamId', { params, withCredentials: true });
};
export const getListAllDoneResultByUserIdandLessonId = async (lessonId: string, filter?: IGetResultByUserIdFilterParams): Promise<AxiosResponse<any>> => {
    const params = filter ? { ...filter, lessonId } : { lessonId };
    return await requestWithJwt.get<IDTOResponse<IResult[]>>('/results/getListAllDoneResultByUserIdandLessonId', { params, withCredentials: true });
}