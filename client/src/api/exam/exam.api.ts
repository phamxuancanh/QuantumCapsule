import { requestWithJwt, requestWithoutJwt } from '../request'
import { AxiosResponse } from 'axios'
import { DataListExam, ListExamParams } from './exam.interface';

export const importExams = async (exams: any[]): Promise<AxiosResponse<any>> => {
    console.log(exams);
    
    return await requestWithJwt.post<any>('/exams/importExams', { exams }, { withCredentials: true });
}
export const importExamQuestions = async (examQuestions: any[]): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.post<any>('/exam_questions/importExamQuestions', { examQuestions }, { withCredentials: true });
}



export const getListExam = async ({params}: {params?: ListExamParams}): Promise<AxiosResponse<DataListExam>> => {
    return await requestWithJwt.get<DataListExam>('/exams', { params })
}