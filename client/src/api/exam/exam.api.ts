import { requestWithJwt, requestWithoutJwt } from '../request'
import { AxiosResponse } from 'axios'
import { DataListExam, DataListExamQuestion, IExam, IExamQuestion, ListExamParams } from './exam.interface';

export const importExams = async (exams: IExam[]): Promise<AxiosResponse<any>> => {
    console.log(exams);
    
    return await requestWithJwt.post<any>('/exams/importExams', { exams }, { withCredentials: true });
}
export const importExamQuestions = async (examQuestions: any[]): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.post<any>('/exam_questions/importExamQuestions', { examQuestions }, { withCredentials: true });
}

export const addExam = async (exam: IExam): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.post<any>('/exams', exam, { withCredentials: true });
}
export const updateExam = async (id: string, exam: IExam): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.put<any>('/exams/'+ id, exam , { withCredentials: true });
}
export const deleteExam = async (id: string): Promise<AxiosResponse<any>> => {
    console.log(id);
    
    return await requestWithJwt.delete<any>('/exams/'+ id,  { withCredentials: true });
}

export const getListExam = async ({params}: {params?: ListExamParams}): Promise<AxiosResponse<DataListExam>> => {
    return await requestWithJwt.get<DataListExam>('/exams', { params })
}
export const getExamsByLessonId = async (lessonId: string): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.get<any>(`/exams/getExamsByLessonId/${lessonId}`);
}
export const getExamsByChapterId = async (chapterId: string): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.get<any>(`/exams/getExamsByChapterId/${chapterId}`);
}
export const getExercisesByChapterId = async (chapterId: string): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.get<any>(`/exams/getExercisesByChapterId/${chapterId}`);
}
// ----------------- Exam Question -----------------
export const getListExamQuestionByChapterId = async (chapterId: string): Promise<AxiosResponse<DataListExamQuestion>> => {
    return await requestWithJwt.get<DataListExamQuestion>(`/exams/getListExamQuestionByChapterId/${chapterId}`);
}
export const insertExamQuestion = async (examQuestion: IExamQuestion): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.post<any>('/exams/insertExamQuestion', examQuestion, { withCredentials: true });
}
export const updateExamQuestion = async (id: string, examQuestion: IExamQuestion): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.post<any>('/exams/updateExamQuestion/'+ id, examQuestion , { withCredentials: true });
}
export const deleteExamQuestion = async (id: string): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.post<any>('/exams/deleteExamQuestion/'+ id,  { withCredentials: true });
}
export const getListExamByChapterId = async (chapterId: string): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.get<any>(`/exams/getListExamByChapterId/${chapterId}`,  { withCredentials: true });
}