import { requestWithJwt } from '../request'
import { AxiosResponse } from 'axios'

export const importExams = async (exams: any[]): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.post<any>('/exams/importExams', { exams }, { withCredentials: true });
}
export const importExamQuestions = async (examQuestions: any[]): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.post<any>('/exam_questions/importExamQuestions', { examQuestions }, { withCredentials: true });
}
