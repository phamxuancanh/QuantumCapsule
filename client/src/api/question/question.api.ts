import { requestWithJwt } from '../request'
import { AxiosResponse } from 'axios'
import { DataListQuesion, ListQuesionParams } from './question.interfaces';

export const importQuestions = async (questions: any[]): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.post<any>('/questions/importQuestions', { questions }, { withCredentials: true });
}

export const getListQuesion = async ({params}: {params?: ListQuesionParams}): Promise<AxiosResponse<DataListQuesion>> => {
    return await requestWithJwt.get<DataListQuesion>('/questions', { params })
}

export const addQuestion = async (question: any): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.post<any>('/questions', question, { withCredentials: true });
}

export const updateQuestion = async (id: string, question: any): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.put<any>('/questions/'+ id, question , { withCredentials: true });
}

export const deleteQuestion = async (id: string): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.delete<any>('/questions/'+ id,  { withCredentials: true });
}

export const getListQuesionByExamId = async (examId: string): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.get<any>('/questions/getListQuestionByExamId/'+ examId,  { withCredentials: true });
}

export const getListQuestionByChapterId = async (examId: string): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.get<any>('/questions/getListQuestionByChapterId/'+ examId,  { withCredentials: true });
}
export const getListQuestionByLessonId = async (lessonId: string): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.get<any>('/questions/getListQuestionByLessonId/'+ lessonId,  { withCredentials: true });
}