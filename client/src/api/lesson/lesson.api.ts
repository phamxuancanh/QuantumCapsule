import { requestWithJwt } from '../request'
import { AxiosResponse } from 'axios'
import { DataListChapterandExam, DataListLesson, ILesson, ListChapterandExamParams, ListLessonParams } from './lesson.interface';

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
export const getChaptersandExams = async ({params}: {params?: ListChapterandExamParams}): Promise<AxiosResponse<DataListChapterandExam>> => {
    return await requestWithJwt.get<DataListChapterandExam>('/getChaptersandExams', { params })
}