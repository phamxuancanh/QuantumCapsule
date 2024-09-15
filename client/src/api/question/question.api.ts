import { requestWithJwt } from '../request'
import { AxiosResponse } from 'axios'
import { DataListQuesion, ListQuesionParams } from './question.interfaces';

export const importQuestions = async (questions: any[]): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.post<any>('/questions/importQuestions', { questions }, { withCredentials: true });
}

export const getListQuesion = async ({params}: {params?: ListQuesionParams}): Promise<AxiosResponse<DataListQuesion>> => {
    return await requestWithJwt.get<DataListQuesion>('/questions', { params })
}