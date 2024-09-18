import { requestWithJwt } from '../request'
import { AxiosResponse } from 'axios'
import { DataListLessonandExam, DataListLesson, ILesson, ListLessonandExamParams, ListLessonParams } from './lesson.interface';

export const importLessons = async (lessons: any[]): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.post<any>('/lessons/importLessons', { lessons }, { withCredentials: true });
}



export const getListLesson = async ({params}: {params?: ListLessonParams}): Promise<AxiosResponse<DataListLesson>> => {
    return await requestWithJwt.get<DataListLesson>('/lessons', { params })
}
export const getLessonByChapterId = async (chapterId: string): Promise<AxiosResponse<any>> => {
    console.log(chapterId);
    return await requestWithJwt.get<any>(`/lessons/chapter/${chapterId}`);
}
export const getLessonsandExams = async ({params}: {params?: ListLessonandExamParams}): Promise<AxiosResponse<DataListLessonandExam>> => {
    return await requestWithJwt.get<DataListLessonandExam>('/lessons/getLessonsandExams', { params })
}
export const getSuggestions = async (search: string): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.get<any>('/lessons/getSuggestions', { params: { search } });
  }