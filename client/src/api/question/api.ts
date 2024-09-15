import { requestWithJwt } from '../request'
import { AxiosResponse } from 'axios'

export const importQuestions = async (questions: any[]): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.post<any>('/questions/importQuestions', { questions }, { withCredentials: true });
}
